import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('../src/client/aero-shards.js', import.meta.url), 'utf8');

function boot({ supported = true, reduced = false, width = 1280 } = {}) {
  const element = () => ({ dataset: {}, hidden: true, events: {}, clientWidth: width, clientHeight: 800,
    addEventListener(name, fn) { (this.events[name] ??= []).push(fn); },
    fire(name, value = {}) { this.events[name]?.forEach(fn => fn(value)); },
    getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth, height: this.clientHeight }; }
  });
  const scene = element(), backdrop = element(), canvas = element(), control = element(), model = element(), controls = element(), root = element(), doc = element();
  root.dataset = { theme: 'dark', motion: 'false', contrast: 'false' }; doc.hidden = false; doc.documentElement = root;
  model.dataset.paused = 'false'; controls.hidden = false; control.dataset = { pause: 'Pause', play: 'Play' };
  doc.querySelector = key => key === '[data-aero-scene]' ? scene : null;
  scene.querySelector = key => ({ '[data-aero-backdrop]': backdrop, '[data-background-pause]': control, '[data-brand-art]': model })[key];
  backdrop.querySelector = () => canvas; model.querySelector = () => controls;
  const media = { '(prefers-reduced-motion: reduce)': element(), '(forced-colors: active)': element() };
  media['(prefers-reduced-motion: reduce)'].matches = reduced;
  media['(forced-colors: active)'].matches = false;
  const queue = new Map(), mutations = new Map(), times = [];
  let next = 0, now = 0, draws = 0, intersection, geometryFloats = 0;
  const gl = new Proxy({
    createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}),
    getShaderParameter: () => true, getProgramParameter: () => true,
    getAttribLocation: (_, key) => ['aPoint','aNormal','aBary','aSeed','aLayer'].indexOf(key), getUniformLocation: (_, key) => key,
    bufferData: (_, data) => { geometryFloats = data.length; },
    uniform1f: (key, value) => { if (key === 'uTime') times.push(value); }, drawArrays: () => { draws++; }
  }, { get: (object, key) => object[key] ?? (key === key.toUpperCase() ? 1 : () => {}) });
  canvas.getContext = () => supported ? gl : null;
  vm.runInNewContext(source, { document: doc, matchMedia: key => media[key], devicePixelRatio: 3,
    getComputedStyle: () => ({ getPropertyValue: () => '#83bbff' }),
    requestAnimationFrame: fn => { queue.set(++next, fn); return next; }, cancelAnimationFrame: id => queue.delete(id),
    MutationObserver: class { constructor(fn) { this.fn = fn; } observe(target) { (mutations.get(target) ?? mutations.set(target, []).get(target)).push(this.fn); } },
    ResizeObserver: class { observe() {} }, IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} }
  });
  return { root, doc, model, controls, backdrop, canvas, control, media, queue, times,
    get draws() { return draws; }, get geometryFloats() { return geometryFloats; },
    mutate(target) { mutations.get(target)?.forEach(fn => fn()); }, intersect(value) { intersection([{ isIntersecting: value }]); },
    flush(frames = 12) { for (let i = 0; i < frames && queue.size; i++) { const pending = [...queue.values()]; queue.clear(); now += 16.7; pending.forEach(fn => fn(now)); } }
  };
}

const unsupported = boot({ supported: false });
assert.equal(unsupported.backdrop.dataset.enhanced, undefined); assert.equal(unsupported.canvas.hidden, true);
assert.equal(unsupported.queue.size, 0, 'Keep the SVG without a renderer');
const still = boot({ reduced: true }); still.flush();
assert.equal(still.draws, 1); assert.equal(still.queue.size, 0, 'Reduced motion draws one still frame');
assert.ok(still.canvas.width * still.canvas.height < 1103000, 'Bound the high-DPI pixel budget');
const mobile = boot({ width: 390 }); mobile.flush(1);
assert.ok(mobile.geometryFloats < still.geometryFloats * .6, 'Narrow layouts use fewer shards');
const live = boot(); live.flush();
assert.ok(live.draws > 1 && live.draws < 12, 'Throttle GPU rendering below the animation-frame rate');
assert.ok(live.times.at(-1) > live.times[0]);
live.model.dataset.paused = 'true'; live.mutate(live.model); const beforePause = live.times.at(-1); live.flush();
assert.equal(live.times.at(-1), beforePause); assert.equal(live.queue.size, 0, 'The A+ pause also stops the background');
live.model.dataset.paused = 'false'; live.mutate(live.model); live.flush(3);
live.intersect(false); live.flush(); assert.equal(live.queue.size, 0, 'Stop outside the viewport');
live.intersect(true); live.flush(3); assert.ok(live.queue.size > 0);
live.doc.hidden = true; live.doc.fire('visibilitychange'); live.flush(); assert.equal(live.queue.size, 0);
live.doc.hidden = false; live.doc.fire('visibilitychange'); live.flush(3); assert.ok(live.queue.size > 0);
live.root.dataset.contrast = 'true'; live.mutate(live.root); live.flush(); assert.equal(live.queue.size, 0, 'Hidden high-contrast decoration does not keep rendering');
live.root.dataset.contrast = 'false'; live.mutate(live.root); live.flush(3);
live.media['(forced-colors: active)'].matches = true; live.media['(forced-colors: active)'].fire('change'); live.flush();
assert.equal(live.canvas.hidden, true); assert.equal(live.queue.size, 0, 'Forced colours stop the decoration');
live.media['(forced-colors: active)'].matches = false; live.media['(forced-colors: active)'].fire('change'); live.flush(3);
live.controls.hidden = true; live.mutate(live.controls); assert.equal(live.control.hidden, false, 'Expose a pause when the model control is unavailable');
live.control.fire('click'); live.flush(); assert.equal(live.queue.size, 0);
live.control.fire('click'); live.flush(3); assert.ok(live.queue.size > 0);
let prevented = false;
live.canvas.fire('webglcontextlost', { preventDefault() { prevented = true; } });
assert.ok(prevented); assert.equal(live.canvas.hidden, true); assert.equal(live.backdrop.dataset.enhanced, undefined); assert.equal(live.queue.size, 0);
live.canvas.fire('webglcontextrestored'); live.flush(3); assert.equal(live.backdrop.dataset.enhanced, 'true');
live.root.dataset.motion = 'true'; live.doc.fire('alejandro:preferences'); live.flush(); assert.equal(live.queue.size, 0);
console.log(JSON.stringify({ backgroundChecks: ['SVG fallback', 'reduced motion', 'pixel budget', 'mobile geometry budget', 'render throttle', 'shared pause', 'offscreen/hidden suspension', 'high contrast', 'fallback pause', 'context recovery'] }));
