import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../src/client/portrait.js', import.meta.url), 'utf8');
function fixture({ fine = true, reduced = false, forced = false } = {}) {
  const handlers = new Map(), media = new Map(), frames = new Map(); let id = 0, intersection;
  const events = target => ({ addEventListener(name, callback) { handlers.set(target + ':' + name, callback); } });
  const style = () => ({ setProperty(name, value) { this[name] = value; } });
  const label = { textContent: '' }, head = { hidden: true, style: style() };
  const control = { hidden: true, dataset: { pause: 'Pause', play: 'Follow' }, ...events('control'), setAttribute(name, value) { this[name] = value; }, querySelector() { return label; } };
  const stage = { dataset: {}, getBoundingClientRect: () => ({ left: 300, top: 30, width: 600, height: 900 }) };
  const hero = { style: style(), querySelector: selector => ({ '[data-portrait-stage]': stage, '[data-portrait-head]': head, '[data-portrait-motion]': control })[selector] };
  const root = { dataset: {}, ...events('root') };
  const document = { documentElement: root, hidden: false, querySelector: () => hero, ...events('document') };
  const context = { document, window: { ...events('window'), IntersectionObserver: true }, innerWidth: 1280, innerHeight: 900, requestAnimationFrame: callback => { frames.set(++id, callback); return id; }, cancelAnimationFrame: key => frames.delete(key),
    matchMedia(query) { const item = { matches: query.includes('hover:') ? fine : query.includes('reduced') ? reduced : forced, addEventListener(_name, callback) { this.change = callback; } }; media.set(query, item); return item; },
    MutationObserver: class { constructor(callback) { context.mutation = callback; } observe() {} }, IntersectionObserver: class { constructor(callback) { intersection = callback; } observe() {} }
  };
  vm.runInNewContext(source, context);
  return { head, control, label, stage, hero, root, document, frames, media,
    move(x, y, pointerType = 'mouse') { handlers.get('window:pointermove')({ clientX: x, clientY: y, pointerType, target: { closest: () => null } }); },
    flush() { let count = 0; while (frames.size && count++ < 200) { const entries = [...frames]; frames.clear(); entries.forEach(([, callback]) => callback()); } assert.ok(count < 200, 'Mouse motion settles without an idle loop'); },
    event(target, event) { handlers.get(target + ':' + event)(); },
    visibility(value) { intersection([{ isIntersecting: value }]); },
    preference(key, value) { root.dataset[key] = value; context.mutation(); }
  };
}
const normal = fixture();
assert.equal(normal.control.hidden, false); assert.equal(normal.head.hidden, false); assert.equal(normal.frames.size, 0);
normal.move(1280, 800); normal.flush();
assert.ok(normal.head.style.transform.includes('rotateY(9.00deg)')); assert.equal(normal.frames.size, 0);
normal.event('control', 'click'); assert.equal(normal.control['aria-pressed'], 'true'); assert.equal(normal.label.textContent, 'Follow');
normal.move(0, 0); assert.equal(normal.frames.size, 0); assert.ok(normal.head.style.transform.includes('rotateY(0.00deg)'));
normal.event('control', 'click'); normal.move(-2000, -2000); normal.flush(); assert.ok(normal.head.style.transform.includes('rotateY(-9.00deg)'));
normal.visibility(false); normal.move(1280, 900); assert.equal(normal.frames.size, 0);
normal.visibility(true); normal.move(1280, 900); normal.document.hidden = true; normal.event('document', 'visibilitychange'); assert.equal(normal.frames.size, 0);
normal.document.hidden = false; normal.event('document', 'visibilitychange'); normal.move(1280, 900); normal.event('window', 'blur'); assert.equal(normal.frames.size, 0);
normal.preference('motion', 'true'); assert.equal(normal.head.hidden, true); assert.equal(normal.control.hidden, true);
normal.preference('motion', 'false'); normal.preference('contrast', 'true'); assert.equal(normal.head.hidden, true);
for (const options of [{ fine: false }, { reduced: true }, { forced: true }]) {
  const staticPortrait = fixture(options); staticPortrait.move(1280, 900); assert.equal(staticPortrait.frames.size, 0); assert.equal(staticPortrait.head.hidden, true); assert.equal(staticPortrait.control.hidden, true);
}
const touch = fixture(); touch.move(1280, 900, 'touch'); assert.equal(touch.frames.size, 0);
console.log(JSON.stringify({ portraitChecks: ['mouse following and bounded pose', 'idle suspension', 'pause/resume', 'offscreen/hidden suspension', 'reduced motion', 'touch static', 'contrast and forced colors', 'focus loss reset'] }));
