import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { letterGlitch } from '../src/components/letter-glitch.mjs';
const source = await readFile(new URL('../src/client/letter-glitch.js', import.meta.url), 'utf8');

function fixture({ width = 1440, height = 900, dpr = 2, reduced = false, forced = false, contrast = false, noCanvas = false, throws = false } = {}) {
  const handlers = new Map(), timers = new Map(), media = new Map(), colors = new Set(); let id = 0, intersection, mutation;
  const stats = { fills: 0, clears: 0, transform: [] };
  const events = name => ({ addEventListener(event, callback) { handlers.set(name + ':' + event, callback); } });
  const context2d = { clearRect() { stats.clears++; }, fillRect() { stats.fills++; colors.add(this.fillStyle); }, setTransform(...values) { stats.transform = values; } };
  const canvas = { width: 0, height: 0, hidden: true, getContext() { if (throws) throw new Error('Unavailable'); return noCanvas ? null : context2d; } };
  const layer = { hidden: false, dataset: {}, querySelector: () => canvas, getBoundingClientRect: () => ({ width, height }) };
  const control = { hidden: true, disabled: false, dataset: { pause: 'Pause background', play: 'Animate background' }, textContent: '', attrs: {}, ...events('control'), setAttribute(name, value) { this.attrs[name] = value; } };
  const root = { dataset: { contrast: String(contrast) } };
  const document = { documentElement: root, hidden: false, querySelector: () => layer, querySelectorAll: () => [control], ...events('document') };
  const context = { document, window: { ...events('window'), ResizeObserver: true, IntersectionObserver: true }, devicePixelRatio: dpr,
    setTimeout(callback, delay) { timers.set(++id, { callback, delay }); return id; }, clearTimeout(key) { timers.delete(key); },
    requestAnimationFrame() { throw new Error('The quiet background must not use a continuous RAF loop'); },
    fetch() { throw new Error('The decorative background must not make network requests'); },
    matchMedia(query) { const value = { matches: query.includes('reduced') ? reduced : forced, addEventListener(_name, callback) { this.change = callback; } }; media.set(query, value); return value; },
    MutationObserver: class { constructor(callback) { mutation = callback; } observe() {} },
    ResizeObserver: class { constructor(callback) { this.callback = callback; } observe() {} },
    IntersectionObserver: class { constructor(callback) { intersection = callback; } observe() {} }
  };
  vm.runInNewContext(source, context);
  const fire = (target, event, detail) => { const callback = handlers.get(target + ':' + event); assert.ok(callback, 'Registered ' + target + ':' + event); callback({ detail }); };
  return { layer, canvas, control, root, document, timers, stats, colors, handlers, fire,
    tick() { assert.equal(timers.size, 1, 'Only one bounded timer is pending'); const [key, timer] = [...timers][0]; timers.delete(key); timer.callback(); return timer.delay; },
    visible(value) { intersection([{ isIntersecting: value }]); },
    resize(w, h) { width = w; height = h; fire('window', 'resize'); },
    preference(key, value) { root.dataset[key] = value; mutation(); },
    mediaChange(fragment, value) { const item = [...media.entries()].find(([query]) => query.includes(fragment))[1]; item.matches = value; item.change(); }
  };
}
for (const options of [{ noCanvas: true }, { throws: true }]) {
  const missing = fixture(options); assert.equal(missing.layer.dataset.enhanced, undefined); assert.equal(missing.canvas.hidden, true); assert.equal(missing.control.hidden, true); assert.equal(missing.timers.size, 0);
}
const normal = fixture();
assert.equal(normal.layer.dataset.enhanced, 'true'); assert.equal(normal.control.hidden, false); assert.equal(normal.canvas.hidden, false);
assert.ok(normal.canvas.width * normal.canvas.height <= 720000); assert.ok(Number(normal.layer.dataset.cells) <= 3600);
assert.deepEqual([...normal.colors].sort(), ['#ffffff', '#ff6b6b', '#40ffaa', '#4079ff'].sort(), 'The requested palette is retained exactly');
const before = normal.stats.clears, beforeFills = normal.stats.fills, delay = normal.tick(), changed = normal.stats.clears - before;
assert.ok(delay >= 100 && delay <= 300, 'Updates are periodic and quiet');
assert.ok(changed > 0 && changed < Number(normal.layer.dataset.cells) / 100, 'Only a handful of cells change, not a full-screen flash');
assert.ok(normal.stats.fills - beforeFills <= changed * 35, 'Each change repaints only its tiny glyph');
assert.equal(normal.timers.size, 1);
normal.fire('control', 'click'); assert.equal(normal.timers.size, 0); assert.equal(normal.control.attrs['aria-pressed'], 'true'); assert.equal(normal.control.textContent, 'Animate background');
normal.fire('control', 'click'); assert.equal(normal.timers.size, 1); assert.equal(normal.control.attrs['aria-pressed'], 'false');
normal.fire('document', 'alejandro:background-motion', { paused: true }); assert.equal(normal.timers.size, 0); assert.equal(normal.control.textContent, 'Animate background');
normal.fire('document', 'alejandro:background-motion', { paused: false }); assert.equal(normal.timers.size, 1);
normal.fire('document', 'alejandro:background-motion', { paused: 'false' }); assert.equal(normal.timers.size, 1, 'Malformed events do not change pause state');
normal.document.hidden = true; normal.fire('document', 'visibilitychange'); assert.equal(normal.timers.size, 0);
const hiddenFills = normal.stats.fills; normal.resize(1600, 1000); assert.equal(normal.timers.size, 0); assert.equal(normal.stats.fills, hiddenFills);
normal.document.hidden = false; normal.fire('document', 'visibilitychange'); assert.equal(normal.timers.size, 1); assert.ok(normal.stats.fills > hiddenFills);
normal.visible(false); assert.equal(normal.timers.size, 0); normal.visible(true); assert.equal(normal.timers.size, 1);
normal.preference('motion', 'true'); assert.equal(normal.timers.size, 0); assert.equal(normal.control.disabled, true); assert.equal(normal.layer.dataset.motion, 'static');
normal.preference('motion', 'false'); assert.equal(normal.timers.size, 1); assert.equal(normal.control.disabled, false);
normal.preference('contrast', 'true'); assert.equal(normal.layer.hidden, true); assert.equal(normal.control.hidden, true); assert.equal(normal.timers.size, 0);
normal.preference('contrast', 'false'); assert.equal(normal.layer.hidden, false); assert.equal(normal.timers.size, 1);
normal.mediaChange('forced-colors', true); assert.equal(normal.layer.hidden, true); assert.equal(normal.timers.size, 0);
normal.mediaChange('forced-colors', false); assert.equal(normal.layer.hidden, false); assert.equal(normal.timers.size, 1);
normal.fire('window', 'pagehide'); assert.equal(normal.timers.size, 0); normal.fire('window', 'pageshow'); assert.equal(normal.timers.size, 1);
const quiet = fixture({ reduced: true }); assert.equal(quiet.timers.size, 0); assert.ok(quiet.stats.fills > 0); assert.equal(quiet.control.disabled, true); assert.equal(quiet.layer.dataset.motion, 'static');
quiet.resize(1200, 800); assert.equal(quiet.tick(), 120); assert.equal(quiet.timers.size, 0, 'Reduced motion permits one resized static image without resuming animation');
const forced = fixture({ forced: true }); assert.equal(forced.layer.hidden, true); assert.equal(forced.stats.fills, 0); assert.equal(forced.timers.size, 0);
const contrast = fixture({ contrast: true }); assert.equal(contrast.layer.hidden, true); assert.equal(contrast.timers.size, 0);
const mobile = fixture({ width: 390, height: 844, dpr: 3 }), desktop = fixture(), large = fixture({ width: 7680, height: 4320, dpr: 3 });
assert.ok(mobile.canvas.width * mobile.canvas.height <= 360000); assert.ok(Number(mobile.layer.dataset.cells) <= 1400);
assert.ok(mobile.stats.fills / Number(mobile.layer.dataset.cells) < desktop.stats.fills / Number(desktop.layer.dataset.cells) * .85, 'The mobile glyph field is less dense');
assert.ok(large.canvas.width * large.canvas.height <= 720000); assert.ok(Number(large.layer.dataset.cells) <= 3600, 'Large screens do not create unbounded cell arrays');
assert.ok(!normal.handlers.has('window:pointermove') && !normal.handlers.has('document:click'), 'The decorative field does not intercept pointer navigation');
assert.ok(letterGlitch().includes('aria-hidden="true"') && letterGlitch().includes('data-letter-canvas hidden'), 'The optional canvas is decorative and absent without enhancement');
const license = await readFile(new URL('../public/assets/licenses/react-bits.txt', import.meta.url));
assert.equal(createHash('sha1').update('blob ' + license.length + '\0').update(license).digest('hex'), '4069ce9d0ef1a712c93d6ce48ade5d5667e0f5ee', 'The full upstream license is retained verbatim');
console.log(JSON.stringify({ letterGlitchChecks: ['requested palette and local pixels', 'bounded pixels/cells/mobile density', 'small periodic repaint', 'footer and scene pause', 'reduced static mode', 'hidden/offscreen suspension', 'contrast/forced exclusion', 'no remote runtime resources', 'upstream license'] }));
