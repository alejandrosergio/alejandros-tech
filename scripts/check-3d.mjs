import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../src/client/brand-3d.js', import.meta.url), 'utf8');
function boot({ reduced = false, supported = true } = {}) {
  const element = () => ({
    dataset: {}, hidden: true, events: {}, attributes: {}, clientWidth: 280, clientHeight: 280,
    classList: { values: new Set(), add(v) { this.values.add(v); }, remove(v) { this.values.delete(v); } },
    addEventListener(name, cb) { this.events[name] = cb; },
    fire(name, args = {}) { this.events[name]?.(args); },
    setAttribute(name, value) { this.attributes[name] = value; }, removeAttribute(name) { delete this.attributes[name]; },
    focus() {}, setPointerCapture() {}, getBoundingClientRect() { return { left: 0, top: 0, width: 280, height: 280 }; }
  });
  const art = element(), stage = element(), canvas = element(), controls = element(), motion = element(), label = element(), reset = element();
  stage.dataset = { label: 'A+', help: 'Arrow keys' }; motion.dataset = { pause: 'Pause', play: 'Play' };
  motion.querySelector = () => label;
  const elements = { '[data-brand-stage]': stage, '[data-brand-canvas]': canvas, '[data-art-controls]': controls, '[data-art-motion]': motion, '[data-art-reset]': reset };
  art.querySelector = key => elements[key];
  const doc = element(); doc.hidden = false; doc.querySelector = () => art;
  const media = { '(prefers-reduced-motion: reduce)': element(), '(forced-colors: active)': element() };
  media['(prefers-reduced-motion: reduce)'].matches = reduced;
  media['(forced-colors: active)'].matches = false;
  let next = 0, bufferId = 0, currentBuffer, matrix, frameTime = 0, observer;
  const queue = new Map(), models = [];
  const gl = new Proxy({
    createBuffer: () => ({ id: ++bufferId }), bindBuffer: (_, b) => { currentBuffer = b; },
    uniformMatrix3fv: (_, __, m) => { matrix = [...m]; }, drawArrays: () => { if (currentBuffer.id % 4 === 1) models.push(matrix); },
    createShader: () => ({}), createProgram: () => ({}), getShaderParameter: () => true, getProgramParameter: () => true,
    getAttribLocation: (_, name) => ['aPosition', 'aNormal', 'aColor', 'aGlow'].indexOf(name), getUniformLocation: (_, name) => name
  }, { get: (target, key) => target[key] ?? (key === key.toUpperCase() ? 1 : () => {}) });
  canvas.getContext = () => supported ? gl : null;
  vm.runInNewContext(source, { document: doc, matchMedia: q => media[q], devicePixelRatio: 3,
    requestAnimationFrame: cb => { queue.set(++next, cb); return next; }, cancelAnimationFrame: id => queue.delete(id),
    ResizeObserver: class { observe() {} }, IntersectionObserver: class { constructor(cb) { observer = cb; } observe() {} }
  });
  return { art, stage, canvas, controls, motion, label, doc, media, models, queue, reset,
    intersect(value) { observer([{ isIntersecting: value }]); },
    flush(count = 120) { for (let i = 0; i < count && queue.size; i++) { const pending = [...queue.values()]; queue.clear(); pending.forEach(cb => cb(frameTime += 16.7)); } }
  };
}

const fallback = boot({ supported: false });
assert.equal(fallback.art.dataset.enhanced, undefined);
assert.equal(fallback.canvas.hidden, true);
assert.equal(fallback.controls.hidden, true);
assert.equal(fallback.queue.size, 0);

const still = boot({ reduced: true }); still.flush();
assert.equal(still.motion.dataset.paused, 'true');
assert.equal(still.queue.size, 0, 'Reduced motion starts and remains still');
assert.equal(still.canvas.width, 560, 'High-DPI rendering is capped');
const initial = still.models.at(-1);
let prevented = false;
still.stage.fire('keydown', { key: 'ArrowRight', preventDefault: () => { prevented = true; } }); still.flush();
assert.equal(prevented, true);
assert.notDeepEqual(still.models.at(-1), initial, 'Keyboard changes the actual model transform');
assert.equal(still.queue.size, 0, 'Manual rotation does not restart automatic motion');
still.stage.fire('keydown', { key: 'Home', preventDefault() {} }); still.flush();
assert.deepEqual(still.models.at(-1), initial, 'Home restores the model view');

still.stage.fire('pointerdown', { isPrimary: true, button: 0, pointerId: 1, clientX: 20, clientY: 20, pointerType: 'touch' });
still.stage.fire('pointermove', { pointerId: 1, clientX: 90, clientY: 100, pointerType: 'touch' }); still.flush();
const dragged = still.models.at(-1);
assert.notDeepEqual(dragged, initial, 'Horizontal touch changes the transform');
assert.ok(Math.abs(dragged[5] / dragged[8] - initial[5] / initial[8]) < 1e-6, 'Vertical touch does not rotate the model or capture page scrolling');
still.stage.fire('pointercancel');
assert.equal(still.stage.classList.values.has('is-dragging'), false);
still.reset.fire('click'); still.flush();
assert.deepEqual(still.models.at(-1), initial, 'Reset button restores the model view');

let lostPrevented = false;
still.canvas.fire('webglcontextlost', { preventDefault() { lostPrevented = true; } });
assert.equal(lostPrevented, true);
assert.equal(still.canvas.hidden, true);
assert.equal(still.art.dataset.enhanced, undefined);
still.canvas.fire('webglcontextrestored'); still.flush();
assert.equal(still.art.dataset.enhanced, 'true');
assert.equal(still.canvas.hidden, false);

const live = boot(); live.flush(3);
assert.equal(live.queue.size, 1);
live.motion.fire('click'); live.flush();
assert.equal(live.label.textContent, 'Play');
assert.equal(live.queue.size, 0, 'Pause stops the render loop');
live.motion.fire('click'); live.flush(2);
live.intersect(false); live.flush();
assert.equal(live.queue.size, 0, 'Offscreen scene stops');
live.intersect(true); live.flush(2);
assert.equal(live.queue.size, 1, 'Visible scene resumes');
live.doc.hidden = true; live.doc.fire('visibilitychange'); live.flush();
assert.equal(live.queue.size, 0, 'Hidden tab stops');
live.doc.hidden = false; live.doc.fire('visibilitychange'); live.flush(2);
live.media['(prefers-reduced-motion: reduce)'].matches = true;
live.media['(prefers-reduced-motion: reduce)'].fire('change'); live.flush();
assert.equal(live.queue.size, 0, 'Changing motion preference stops animation');
console.log(JSON.stringify({ passed: true, checks: ['WebGL fallback', 'reduced motion', 'resolution cap', 'keyboard rotation/reset', 'horizontal touch', 'touch cancellation', 'context recovery', 'pause/resume', 'offscreen/hidden suspension'] }));
