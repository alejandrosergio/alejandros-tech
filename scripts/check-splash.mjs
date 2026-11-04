import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/client/splash-cursor.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles/splash.css', import.meta.url), 'utf8');

// A stateful WebGL stand-in verifies the solver passes, resource bounds and
// lifecycle. Native browser QA separately verifies shader compilation/pixels.
function fixture({ width = 1440, height = 900, dpr = 2, reduced = false, forced = false, contrast = false, loading = false, dialog = false, noHero = false, noGL = false, throws = false, badFormat = false, badShader = false, badLink = false, coarse = false } = {}) {
  const handlers = new Map(), frames = new Map(), observers = [], media = new Map();
  const textures = new Set(), buffers = new Set(), framebuffers = new Set(), programs = new Set(), shaders = new Set(), vaos = new Set();
  const uniforms = [], allocations = []; let key = 0, now = 0, currentProgram, contextLost = false, draws = 0, intersection;
  const events = name => ({ addEventListener(type, callback, options) { const id = name + ':' + type; if (!handlers.has(id)) handlers.set(id, []); handlers.get(id).push({ callback, options }); } });
  const rect = () => ({ left: 0, top: 0, bottom: height, width, height });
  const home = { ...events('home'), getBoundingClientRect: rect };
  const canvas = { ...events('canvas'), dataset: { preset: 'smoke', intensity: '0.6', size: '0.5' }, hidden: true, width: 1, height: 1, getBoundingClientRect: rect, closest: () => home, getContext() { if (throws) throw new Error('Unavailable'); return noGL ? null : gl; } };
  const root = { dataset: { contrast: String(contrast), loading: String(loading) } }, background = { dataset: { paused: 'false' } }, modal = { ...events('dialog'), open: dialog };
  const document = { ...events('document'), documentElement: root, hidden: false,
    querySelector(selector) { if (selector.includes('[data-splash-cursor]')) return noHero ? null : canvas; if (selector === '[data-letter-glitch]') return background; if (selector === 'dialog[open]') return modal.open ? modal : null; return null; },
    querySelectorAll(selector) { return selector === 'dialog' ? [modal] : []; }
  };
  const window = { ...events('window'), ResizeObserver: true, IntersectionObserver: true };
  const gl = {
    get drawingBufferWidth() { return canvas.width; }, get drawingBufferHeight() { return canvas.height; },
    getExtension() { return {}; }, isContextLost: () => contextLost,
    createTexture() { const item = {}; textures.add(item); return item; }, deleteTexture(item) { textures.delete(item); },
    createFramebuffer() { const item = {}; framebuffers.add(item); return item; }, deleteFramebuffer(item) { framebuffers.delete(item); },
    createShader(type) { const item = { type }; shaders.add(item); return item; }, deleteShader(item) { shaders.delete(item); },
    shaderSource(shader, body) { shader.source = body; }, compileShader() {}, getShaderParameter() { return !badShader; },
    createProgram() { const item = { shaders: [], uniforms: [] }; programs.add(item); return item; }, deleteProgram(item) { programs.delete(item); },
    attachShader(program, shader) { program.shaders.push(shader); }, bindAttribLocation() {},
    linkProgram(program) { program.uniforms = [...new Set(program.shaders.flatMap(shader => [...shader.source.matchAll(/uniform\s+\w+\s+(\w+)/g)].map(match => match[1])))]; },
    getProgramParameter(program, query) { return query === gl.LINK_STATUS ? !badLink : program.uniforms.length; },
    getActiveUniform(program, index) { return { name: program.uniforms[index] }; }, getUniformLocation(program, name) { return { program, name }; },
    useProgram(program) { currentProgram = program; },
    uniform1f(location, value) { if (location) uniforms.push([location.name, value]); },
    uniform2f(location, x, y) { if (location) uniforms.push([location.name, x, y]); },
    uniform3f(location, x, y, z) { if (location) uniforms.push([location.name, x, y, z]); }, uniform1i() {},
    createBuffer() { const item = {}; buffers.add(item); return item; }, deleteBuffer(item) { buffers.delete(item); },
    createVertexArray() { const item = {}; vaos.add(item); return item; }, deleteVertexArray(item) { vaos.delete(item); },
    bindTexture() {}, bindFramebuffer() {}, framebufferTexture2D() {}, texParameteri() {}, activeTexture() {},
    texImage2D(_target, _level, _internal, w, h) { allocations.push({ width: w, height: h }); },
    checkFramebufferStatus() { return badFormat ? -1 : gl.FRAMEBUFFER_COMPLETE; },
    bindVertexArray() {}, bindBuffer() {}, bufferData() {}, enableVertexAttribArray() {}, vertexAttribPointer() {}, viewport() {}, clearColor() {}, clear() {}, disable() {},
    drawArrays() { assert.ok(currentProgram, 'A linked solver program is used for every draw'); draws++; }
  };
  for (const [index, name] of ['LINK_STATUS', 'ACTIVE_UNIFORMS', 'COMPILE_STATUS', 'FRAMEBUFFER_COMPLETE', 'RGBA16F', 'RGBA', 'RG16F', 'RG', 'R16F', 'RED', 'TEXTURE_2D', 'FRAMEBUFFER', 'COLOR_ATTACHMENT0', 'HALF_FLOAT', 'VERTEX_SHADER', 'FRAGMENT_SHADER', 'ARRAY_BUFFER', 'STATIC_DRAW', 'FLOAT', 'TRIANGLE_STRIP', 'TEXTURE0', 'TEXTURE_MIN_FILTER', 'TEXTURE_MAG_FILTER', 'TEXTURE_WRAP_S', 'TEXTURE_WRAP_T', 'CLAMP_TO_EDGE', 'NEAREST', 'LINEAR', 'COLOR_BUFFER_BIT', 'BLEND'].entries()) gl[name] = index + 1;
  const context = { document, window, innerHeight: height, devicePixelRatio: dpr, Float32Array,
    performance: { now: () => now }, requestAnimationFrame(callback) { frames.set(++key, callback); return key; }, cancelAnimationFrame(id) { frames.delete(id); },
    matchMedia(query) { const value = { matches: query.includes('reduced') ? reduced : query.includes('forced') ? forced : coarse, addEventListener(_event, callback) { this.change = callback; } }; media.set(query, value); return value; },
    MutationObserver: class { constructor(callback) { this.callback = callback; } observe(target, options) { observers.push({ target, options, callback: this.callback }); } },
    ResizeObserver: class { constructor(callback) { this.callback = callback; } observe() {} },
    IntersectionObserver: class { constructor(callback) { intersection = callback; } observe() {} },
    fetch() { throw new Error('The decorative effect must never request the network'); }
  };
  vm.runInNewContext(source, context);
  const fire = (name, type, event = {}) => { const listeners = handlers.get(name + ':' + type); assert.ok(listeners, 'Registered ' + name + ':' + type); for (const { callback } of listeners) callback(event); };
  const mutate = target => { for (const observer of observers) if (observer.target === target) observer.callback(); };
  const point = (x, y, { touch = false, interactive = false, id = 1 } = {}) => ({ clientX: x * width, clientY: (1 - y) * height, pointerId: id, pointerType: touch ? 'touch' : 'mouse', target: { closest: () => interactive ? {} : null } });
  return { canvas, root, background, modal, document, frames, uniforms, allocations, textures, buffers, framebuffers, programs, shaders, vaos, handlers, fire,
    get draws() { return draws; },
    tick(milliseconds = 34) { now += milliseconds; const scheduled = [...frames.values()]; frames.clear(); for (const callback of scheduled) callback(now); },
    settle() { let count = 0; while (frames.size) { assert.ok(++count < 400, 'The intro and tail terminate rather than animate forever'); this.tick(); } },
    move(x, y, options) { fire('home', 'pointermove', point(x, y, options)); },
    press(x, y, options) { fire('home', 'pointerdown', point(x, y, options)); },
    preference(name, value) { root.dataset[name] = String(value); mutate(root); },
    pause(value) { background.dataset.paused = String(value); mutate(background); },
    dialog(value) { modal.open = value; mutate(modal); },
    visible(value) { intersection([{ isIntersecting: value }]); },
    media(fragment, value) { const entry = [...media.entries()].find(([query]) => query.includes(fragment))[1]; entry.matches = value; entry.change(); },
    resize(w, h) { width = w; height = h; fire('window', 'resize'); },
    lost(value) { contextLost = value; fire('canvas', value ? 'webglcontextlost' : 'webglcontextrestored', { preventDefault() {} }); }
  };
}

const absent = fixture({ noHero: true }); assert.equal(absent.programs.size, 0); assert.equal(absent.frames.size, 0);
for (const options of [{ noGL: true }, { throws: true }, { badFormat: true }, { badShader: true }, { badLink: true }]) {
  const unavailable = fixture(options);
  assert.equal(unavailable.canvas.hidden, true); assert.equal(unavailable.canvas.dataset.state, 'unsupported'); assert.equal(unavailable.frames.size, 0);
  for (const pool of [unavailable.textures, unavailable.framebuffers, unavailable.shaders, unavailable.programs, unavailable.buffers, unavailable.vaos]) assert.equal(pool.size, 0, 'Failed initialization releases allocated resources');
}
for (const options of [{ reduced: true }, { forced: true }, { contrast: true }, { loading: true }, { dialog: true }]) {
  const quiet = fixture(options); assert.equal(quiet.canvas.hidden, true); assert.equal(quiet.frames.size, 0); assert.equal(quiet.programs.size, 0, 'Quiet/occluded initial states allocate no GPU resources');
}
const normal = fixture();
assert.equal(normal.canvas.dataset.enhanced, 'true'); assert.equal(normal.canvas.hidden, false); assert.equal(normal.frames.size, 1);
assert.equal(normal.programs.size, 12, 'The fluid implementation includes the actual solver, splat, burst and display passes');
assert.equal(normal.textures.size, 8, 'Eight bounded half-float field textures, without unused bloom buffers');
assert.ok(normal.canvas.width * normal.canvas.height <= 960000);
assert.ok(normal.allocations.every(({ width, height }) => width * height <= 480000), 'Dye allocation is area bounded');
normal.tick(); const once = Number(normal.canvas.dataset.frames); normal.tick(5); assert.equal(Number(normal.canvas.dataset.frames), once, 'Frames are capped rather than drawing on every browser refresh');
for (let index = 0; index < 12; index++) normal.tick();
assert.ok(normal.uniforms.some(([name, value]) => name === 'curl' && value === 18));
assert.ok(normal.uniforms.some(([name, value]) => name === 'dissipation' && value === 1.4));
assert.ok(normal.uniforms.some(([name, value]) => name === 'dissipation' && value === 2));
assert.ok(normal.uniforms.some(([name, value]) => name === 'shading' && value === .4));
assert.ok(normal.uniforms.some(([name, value]) => name === 'radius' && Math.abs(value - .001 * normal.canvas.width / normal.canvas.height) < 1e-10), 'Studio size .5 maps to the actual upstream Gaussian radius');
normal.settle(); assert.equal(normal.canvas.dataset.state, 'idle'); assert.equal(normal.frames.size, 0);
const afterIntro = normal.draws; normal.fire('document', 'alejandro:preferences'); assert.equal(normal.frames.size, 0); assert.equal(normal.draws, afterIntro, 'A completed intro does not replay on preference updates');
normal.move(.2, .6); normal.move(.24, .6); assert.equal(normal.frames.size, 1); normal.tick(); assert.ok(normal.draws > afterIntro, 'Mouse input advects a real fluid field');
normal.pause(true); assert.equal(normal.frames.size, 0); assert.equal(normal.canvas.hidden, true); const pausedFrames = normal.canvas.dataset.frames; normal.move(.3, .6); assert.equal(normal.canvas.dataset.frames, pausedFrames); assert.equal(normal.frames.size, 0);
normal.pause(false); assert.equal(normal.frames.size, 0); assert.equal(normal.canvas.hidden, false);
normal.fire('document', 'alejandro:background-motion', { detail: { paused: true } }); assert.equal(normal.canvas.hidden, true);
normal.fire('document', 'alejandro:background-motion', { detail: { paused: false } });
normal.press(.4, .5, { interactive: true }); assert.equal(normal.frames.size, 0, 'Link and button activation does not create a click burst');
normal.press(.4, .5); assert.equal(normal.frames.size, 1); normal.tick();
assert.ok(normal.uniforms.some(([name, value]) => name === 'strength' && value === 880), 'Click burst retains Smoke force .8');
normal.dialog(true); assert.equal(normal.frames.size, 0); assert.equal(normal.canvas.hidden, true); normal.dialog(false); assert.equal(normal.frames.size, 0);
normal.move(.25, .5); normal.move(.3, .5); normal.document.hidden = true; normal.fire('document', 'visibilitychange'); assert.equal(normal.frames.size, 0); normal.document.hidden = false; normal.fire('document', 'visibilitychange'); assert.equal(normal.frames.size, 0);
normal.visible(false); normal.press(.2, .2); assert.equal(normal.frames.size, 0); normal.visible(true); assert.equal(normal.frames.size, 0);
normal.preference('motion', true); assert.equal(normal.canvas.hidden, true); normal.preference('motion', false);
normal.preference('contrast', true); assert.equal(normal.canvas.hidden, true); normal.preference('contrast', false);
normal.media('reduced', true); assert.equal(normal.canvas.hidden, true); normal.media('reduced', false);
normal.media('forced', true); assert.equal(normal.canvas.hidden, true); normal.media('forced', false);
normal.lost(true); assert.equal(normal.frames.size, 0); assert.equal(normal.canvas.dataset.state, 'lost'); normal.lost(false); assert.equal(normal.canvas.dataset.enhanced, 'true'); assert.equal(normal.frames.size, 0);
normal.fire('window', 'pagehide');
// Context-loss invalidates old WebGL objects outside JS; the newly restored
// context's resources are deleted explicitly by pagehide (native QA covers loss).
assert.equal(normal.frames.size, 0); assert.equal(normal.canvas.dataset.enhanced, undefined);

const pendingLoader = fixture({ loading: true }); pendingLoader.preference('loading', false); assert.equal(pendingLoader.frames.size, 1, 'Intro waits for the site loader'); pendingLoader.settle();
const mobile = fixture({ width: 390, height: 844, dpr: 3, coarse: true });
assert.equal(mobile.canvas.dataset.quality, 'compact'); assert.ok(mobile.canvas.width * mobile.canvas.height <= 420000); assert.ok(mobile.allocations.every(({ width, height }) => width * height <= 160000));
mobile.settle(); mobile.move(.5, .5, { touch: true }); assert.equal(mobile.frames.size, 0, 'Untracked touch events do not synthesize a swipe');
mobile.press(.5, .5, { touch: true }); mobile.move(.53, .53, { touch: true }); assert.equal(mobile.frames.size, 1); mobile.fire('window', 'pointercancel', { pointerType: 'touch', pointerId: 1 }); mobile.settle();
for (const type of ['pointermove', 'pointerdown']) assert.equal(mobile.handlers.get('home:' + type)[0].options.passive, true, 'Touch gestures are never intercepted');
mobile.fire('window', 'pagehide'); for (const pool of [mobile.textures, mobile.framebuffers, mobile.programs, mobile.buffers, mobile.vaos]) assert.equal(pool.size, 0, 'Normal teardown releases GPU resources');
const wide = fixture({ width: 9000, height: 500, dpr: 3 }); assert.ok(wide.canvas.width * wide.canvas.height <= 960000); assert.ok(wide.allocations.every(({ width, height }) => width * height <= 480000)); wide.settle();
assert.ok(styles.includes('pointer-events: none') && styles.includes('z-index: -3') && styles.includes('opacity: 1'));
assert.ok(styles.includes('prefers-reduced-motion') && styles.includes('forced-colors') && styles.includes('data-loading'));
assert.ok(!source.includes('preventDefault()') || source.match(/event\.preventDefault\(\)/g)?.length === 1, 'Only context-loss restoration uses preventDefault, never pointer gestures');
console.log('Splash Cursor: actual fluid passes, Smoke parameters, bounded resources, passive input, one-shot intro, finite tail and quiet lifecycle verified.');
