import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { letterGlitch } from '../src/components/letter-glitch.mjs';
const source = await readFile(new URL('../src/client/letter-glitch.js', import.meta.url), 'utf8');

function fixture({ width = 1440, height = 900, dpr = 2, reduced = false, forced = false, contrast = false, noCanvas = false, throws = false, homeBottom = null } = {}) {
  const handlers = new Map(), timers = new Map(), animationFrames = new Map(), media = new Map(), colors = new Set(), patterns = new Set(), drawings = new Map(); let id = 0, intersection, mutation, glyph = [], cellX = 0, cellY = 0;
  const stats = { fills: 0, clears: 0, alphaMin: Infinity, alphaMax: 0, transform: [] };
  const events = name => ({ addEventListener(event, callback) { handlers.set(name + ':' + event, callback); } });
  const context2d = { clearRect(x, y) { stats.clears++; if (glyph.length) patterns.add(glyph.join('|')); glyph = []; drawings.set(`${x},${y}`, glyph); cellX = x; cellY = y; }, fillRect(x, y, width, height) { stats.fills++; stats.alphaMin = Math.min(stats.alphaMin, this.globalAlpha); stats.alphaMax = Math.max(stats.alphaMax, this.globalAlpha); colors.add(this.fillStyle); glyph.push([x - cellX, y - cellY, width, height].map(value => value.toFixed(3)).join(',')); }, setTransform(...values) { stats.transform = values; } };
  const canvas = { width: 0, height: 0, hidden: true, getContext() { if (throws) throw new Error('Unavailable'); return noCanvas ? null : context2d; } };
  const layer = { hidden: false, dataset: {}, style: { setProperty(key, value) { this[key] = value; } }, querySelector: () => canvas, getBoundingClientRect: () => ({ width, height }) };
  const home = homeBottom === null ? null : { getBoundingClientRect: () => ({ bottom: homeBottom }) };
  const control = { hidden: true, disabled: false, dataset: { pause: 'Pause background', play: 'Animate background' }, textContent: '', attrs: {}, ...events('control'), setAttribute(name, value) { this.attrs[name] = value; } };
  const root = { dataset: { contrast: String(contrast) } };
  const document = { documentElement: root, hidden: false, querySelector: selector => selector === '[data-letter-glitch]' ? layer : selector === '[data-portrait-hero]' ? home : null, querySelectorAll: () => [control], ...events('document') };
  const window = { ...events('window'), innerHeight: height, ResizeObserver: true, IntersectionObserver: true };
  const context = { document, window, devicePixelRatio: dpr,
    setTimeout(callback, delay) { timers.set(++id, { callback, delay }); return id; }, clearTimeout(key) { timers.delete(key); },
    requestAnimationFrame(callback) { animationFrames.set(++id, callback); return id; }, cancelAnimationFrame(key) { animationFrames.delete(key); },
    fetch() { throw new Error('The decorative background must not make network requests'); },
    matchMedia(query) { const value = { matches: query.includes('reduced') ? reduced : forced, addEventListener(_name, callback) { this.change = callback; } }; media.set(query, value); return value; },
    MutationObserver: class { constructor(callback) { mutation = callback; } observe() {} },
    ResizeObserver: class { constructor(callback) { this.callback = callback; } observe() {} },
    IntersectionObserver: class { constructor(callback) { intersection = callback; } observe() {} }
  };
  vm.runInNewContext(source, context);
  const fire = (target, event, detail) => { const callback = handlers.get(target + ':' + event); assert.ok(callback, 'Registered ' + target + ':' + event); callback({ detail }); };
  const flushFrames = () => { let count = 0; while (animationFrames.size) { assert.ok(++count < 4, 'The geometric mask does not create an idle animation loop'); const pending = [...animationFrames.values()]; animationFrames.clear(); for (const callback of pending) callback(); } };
  return { layer, canvas, control, root, document, timers, animationFrames, stats, colors, patterns, handlers, fire, flushFrames,
    snapshot() { return new Map([...drawings].map(([key, pixels]) => [key, pixels.join('|')])); },
    tick() { assert.equal(timers.size, 1, 'Only one bounded timer is pending'); const [key, timer] = [...timers][0]; timers.delete(key); timer.callback(); return timer.delay; },
    visible(value) { intersection([{ isIntersecting: value }]); },
    resize(w, h) { width = w; height = h; window.innerHeight = h; fire('window', 'resize'); },
    homeAt(bottom, flush = true) { assert.ok(home, 'The fixture has a hero'); homeBottom = bottom; fire('window', 'scroll'); if (flush) flushFrames(); },
    preference(key, value) { root.dataset[key] = value; mutation(); },
    mediaChange(fragment, value) { const item = [...media.entries()].find(([query]) => query.includes(fragment))[1]; item.matches = value; item.change(); }
  };
}
for (const options of [{ noCanvas: true }, { throws: true }]) {
  const missing = fixture(options); assert.equal(missing.layer.dataset.enhanced, undefined); assert.equal(missing.canvas.hidden, true); assert.equal(missing.control.hidden, true); assert.equal(missing.timers.size, 0);
}
const normal = fixture();
assert.equal(normal.layer.dataset.enhanced, 'true'); assert.equal(normal.control.hidden, false); assert.equal(normal.canvas.hidden, false);
assert.equal(normal.animationFrames.size, 0, 'The background has no continuous animation frame loop');
assert.ok(!normal.handlers.has('window:scroll'), 'Internal pages need no hero geometry listener');
assert.ok(normal.canvas.width * normal.canvas.height <= 720000); assert.ok(Number(normal.layer.dataset.cells) <= 3600);
assert.deepEqual([...normal.colors].sort(), ['#ffffff', '#ff6b6b'].sort(), 'The Pixel preset default palette is retained exactly');
assert.equal(normal.layer.dataset.characters, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
assert.equal(normal.patterns.size, 26, 'The rendered field contains the complete A–Z pixel alphabet');
assert.ok(normal.stats.alphaMin >= .4 && normal.stats.alphaMax <= .65, 'Pixel ink is visible but does not use opaque flashes');
assert.equal(normal.layer.dataset.frames, '0');
const before = normal.stats.clears, beforeFills = normal.stats.fills, previousPixels = normal.snapshot(), delay = normal.tick(), changed = normal.stats.clears - before;
assert.ok(delay >= 100 && delay <= 150, 'The visible glitch cadence stays within 100–150ms');
assert.ok(changed > Number(normal.layer.dataset.cells) * .01 && changed <= Number(normal.layer.dataset.cells) * .02, 'A perceptible 1–2% of cells change without an area-wide flash');
assert.ok(normal.stats.fills - beforeFills <= changed * 35, 'Each change repaints only its tiny glyph');
assert.equal([...normal.snapshot()].filter(([key, pixels]) => previousPixels.get(key) !== pixels).length, changed, 'Every updated cell is visible, distinct and changes its actual letter pixels');
assert.equal(normal.layer.dataset.frames, '1');
assert.equal(Number(normal.layer.dataset.changedCells), changed, 'QA metadata reports actual repainted cells');
assert.equal(normal.timers.size, 1);
normal.tick(); assert.equal(normal.layer.dataset.frames, '2', 'The animation continues after the first mutation');
normal.fire('control', 'click'); assert.equal(normal.timers.size, 0); assert.equal(normal.control.attrs['aria-pressed'], 'true'); assert.equal(normal.control.textContent, 'Animate background');
assert.equal(normal.layer.dataset.frames, '2', 'Pausing does not advance animation metadata');
normal.fire('control', 'click'); assert.equal(normal.timers.size, 1); assert.equal(normal.control.attrs['aria-pressed'], 'false');
normal.fire('document', 'alejandro:background-motion', { paused: true }); assert.equal(normal.timers.size, 0); assert.equal(normal.control.textContent, 'Animate background');
normal.fire('document', 'alejandro:background-motion', { paused: false }); assert.equal(normal.timers.size, 1);
normal.fire('document', 'alejandro:background-motion', { paused: 'false' }); assert.equal(normal.timers.size, 1, 'Malformed events do not change pause state');
normal.document.hidden = true; normal.fire('document', 'visibilitychange'); assert.equal(normal.timers.size, 0);
const hiddenFrames = normal.layer.dataset.frames;
const hiddenFills = normal.stats.fills; normal.resize(1600, 1000); assert.equal(normal.timers.size, 0); assert.equal(normal.stats.fills, hiddenFills);
assert.equal(normal.layer.dataset.frames, hiddenFrames, 'A hidden tab does not advance glyph mutations');
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
const mobileBefore = mobile.stats.clears; mobile.tick();
assert.ok(mobile.stats.clears - mobileBefore <= Number(mobile.layer.dataset.cells) * .02, 'Mobile animation retains the same small repaint budget');
assert.ok(large.canvas.width * large.canvas.height <= 720000); assert.ok(Number(large.layer.dataset.cells) <= 3600, 'Large screens do not create unbounded cell arrays');
assert.ok(!normal.handlers.has('window:pointermove') && !normal.handlers.has('document:click'), 'The decorative field does not intercept pointer navigation');
const homepage = fixture({ homeBottom: 900 });
assert.equal(homepage.layer.style['--letter-home-cut'], '900px');
assert.equal(homepage.layer.dataset.homeOccluded, 'true');
assert.equal(homepage.canvas.hidden, true); assert.equal(homepage.stats.fills, 0); assert.equal(homepage.timers.size, 0, 'A full-screen hero does not build or animate hidden glyphs');
homepage.homeAt(450);
assert.equal(homepage.layer.style['--letter-home-cut'], '450px', 'The mask follows the actual hero bottom rather than a fixed scroll amount');
assert.equal(homepage.layer.dataset.homeOccluded, 'false');
assert.equal(homepage.canvas.hidden, false); assert.ok(homepage.stats.fills > 0); assert.equal(homepage.timers.size, 1);
const initialHomeFills = homepage.stats.fills, initialTimer = [...homepage.timers.keys()][0];
homepage.homeAt(220, false); homepage.homeAt(210, false);
assert.equal(homepage.animationFrames.size, 1, 'Multiple scroll events share one geometric measurement');
homepage.flushFrames();
assert.equal(homepage.layer.style['--letter-home-cut'], '210px');
assert.equal(homepage.stats.fills, initialHomeFills, 'Moving the reveal edge does not rebuild the glyph field');
assert.equal([...homepage.timers.keys()][0], initialTimer, 'Scrolling does not restart the mutation cadence');
homepage.homeAt(.3);
assert.equal(homepage.layer.style['--letter-home-cut'], '1px', 'Fractional hero positions round outward to prevent leakage');
homepage.homeAt(-40);
assert.equal(homepage.layer.style['--letter-home-cut'], '0px', 'The field is fully available outside the hero');
homepage.tick(); const homeFrames = homepage.layer.dataset.frames;
homepage.homeAt(1200);
assert.equal(homepage.layer.style['--letter-home-cut'], '900px');
assert.equal(homepage.layer.dataset.homeOccluded, 'true'); assert.equal(homepage.timers.size, 0, 'Returning to the cover pauses mutations');
assert.equal(homepage.layer.dataset.frames, homeFrames);
homepage.homeAt(300, false); assert.equal(homepage.animationFrames.size, 1);
homepage.document.hidden = true; homepage.fire('document', 'visibilitychange');
assert.equal(homepage.animationFrames.size, 0, 'Hiding the tab cancels a queued geometry frame');
assert.equal(homepage.timers.size, 0);
homepage.document.hidden = false; homepage.fire('document', 'visibilitychange');
assert.equal(homepage.layer.style['--letter-home-cut'], '300px'); assert.equal(homepage.timers.size, 1, 'Resuming the tab refreshes the real cover boundary');
const staticHome = fixture({ reduced: true, homeBottom: 1100 });
assert.equal(staticHome.stats.fills, 0); assert.equal(staticHome.timers.size, 0);
staticHome.homeAt(0); assert.ok(staticHome.stats.fills > 0); assert.equal(staticHome.timers.size, 0, 'Reduced motion reveals only a static field beyond the cover');
staticHome.homeAt(900); assert.equal(staticHome.layer.dataset.homeOccluded, 'true'); assert.equal(staticHome.timers.size, 0);
assert.ok(letterGlitch().includes('aria-hidden="true"') && letterGlitch().includes('data-letter-canvas hidden') && letterGlitch().includes('data-preset="pixel"') && letterGlitch().includes('data-characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"') && letterGlitch().includes('data-palette="#ffffff,#ff6b6b"'), 'The optional Pixel canvas is decorative and absent without enhancement');
const css = await readFile(new URL('../src/styles/background.css', import.meta.url), 'utf8');
assert.match(css, /\.home-page \.letter-backdrop\s*\{[^}]*clip-path:\s*inset\(var\(--letter-home-cut,\s*100%\)/, 'The homepage defaults to fully clipped decoration before JavaScript or without it');
assert.match(css, /mask-image:\s*linear-gradient\([^}]*--letter-home-cut[^}]*36px/, 'A short gradient softly reveals only the region beyond the cover');
const license = await readFile(new URL('../public/assets/licenses/react-bits.txt', import.meta.url));
assert.equal(createHash('sha1').update('blob ' + license.length + '\0').update(license).digest('hex'), '4069ce9d0ef1a712c93d6ce48ade5d5667e0f5ee', 'The full upstream license is retained verbatim');
console.log(JSON.stringify({ letterGlitchChecks: ['Pixel default palette and actual A–Z pixels', 'bounded pixels/cells/mobile density', 'perceptible 120ms glyph mutations', 'cover-region clipping and idle pause', 'footer and scene pause', 'reduced static mode', 'hidden/offscreen suspension', 'contrast/forced exclusion', 'no remote runtime resources', 'upstream license'] }));
