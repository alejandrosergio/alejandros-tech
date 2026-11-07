import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/client/loader-grid.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles/loader.css', import.meta.url), 'utf8');

// Native browser QA verifies the actual shader/pixels; this stateful stand-in
// checks allocation, accent uniforms, budgets and every stop/resume boundary.
function fixture({ width = 1440, height = 900, dpr = 2, accent = '#f06a73', theme = 'dark', loading = true, reduced = false, forced = false, contrast = false, motion = false, hidden = false, coarse = false, absent = false, noHost = false, noGL = false, throws = false, badShader = false, badLink = false, badProgram = false, badVAO = false } = {}) {
  const frames = new Map(), handlers = new Map(), observers = [], media = new Map(), programs = new Set(), shaders = new Set(), vaos = new Set(), uniforms = [];
  let now = 0, id = 0, currentProgram, contextLost = false, contextRequests = 0, draws = 0, resize;
  const events = name => ({ addEventListener(type, callback, options) { const key = name + ':' + type; if (!handlers.has(key)) handlers.set(key, []); handlers.get(key).push({ callback, options }); } });
  const root = { dataset: { theme, loading: String(loading), contrast: String(contrast), motion: String(motion) } };
  const host = { dataset: {}, getBoundingClientRect: () => ({ width, height }) };
  const canvas = { ...events('canvas'), dataset: {}, width: 0, height: 0, hidden: true, closest: () => noHost ? null : host,
    getContext(type, options) { contextRequests++; assert.equal(type, 'webgl2'); assert.equal(options.antialias, false); if (throws) throw new Error('Unavailable'); return noGL ? null : gl; }
  };
  const document = { ...events('document'), documentElement: root, hidden, querySelector: () => absent ? null : canvas };
  const window = { ...events('window'), ResizeObserver: true };
  const gl = {
    isContextLost: () => contextLost,
    createShader(type) { const shader = { type }; shaders.add(shader); return shader; }, deleteShader(shader) { shaders.delete(shader); },
    shaderSource(shader, body) { shader.source = body; }, compileShader() {},
    getShaderParameter(shader) { return badShader !== true && !(badShader === 'fragment' && shader.type === gl.FRAGMENT_SHADER); },
    createProgram() { if (badProgram) return null; const program = { shaders: [], uniforms: [] }; programs.add(program); return program; }, deleteProgram(program) { programs.delete(program); },
    attachShader(program, shader) { program.shaders.push(shader); },
    linkProgram(program) { program.uniforms = [...new Set(program.shaders.flatMap(shader => [...shader.source.matchAll(/uniform\s+\w+\s+(\w+)(\[\d+\])?/g)].map(match => match[1] + (match[2] ? '[0]' : ''))))]; },
    getProgramParameter(program, query) { return query === gl.LINK_STATUS ? !badLink : program.uniforms.length; },
    getActiveUniform(program, index) { return { name: program.uniforms[index] }; }, getUniformLocation(_program, name) { return name; },
    createVertexArray() { if (badVAO) return null; const vao = {}; vaos.add(vao); return vao; }, deleteVertexArray(vao) { vaos.delete(vao); },
    bindVertexArray() {}, useProgram(program) { currentProgram = program; }, viewport() {}, clearColor() {}, clear() {},
    uniform1f(name, value) { uniforms.push([name, value]); }, uniform2f(name, x, y) { uniforms.push([name, x, y]); }, uniform3f(name, x, y, z) { uniforms.push([name, x, y, z]); }, uniform4f(name, x, y, z, w) { uniforms.push([name, x, y, z, w]); },
    uniform4fv(name, value) { assert.ok(name, 'Array uniform names are normalized from their active [0] suffix'); uniforms.push([name, ...value]); },
    drawArrays(mode, first, count) { assert.ok(currentProgram); assert.equal(mode, gl.TRIANGLES); assert.equal(first, 0); assert.equal(count, 3); draws++; }
  };
  for (const [index, name] of ['VERTEX_SHADER', 'FRAGMENT_SHADER', 'COMPILE_STATUS', 'LINK_STATUS', 'ACTIVE_UNIFORMS', 'COLOR_BUFFER_BIT', 'TRIANGLES'].entries()) gl[name] = index + 1;
  vm.runInNewContext(source, { document, window, devicePixelRatio: dpr, Float32Array,
    performance: { now: () => now },
    requestAnimationFrame(callback) { frames.set(++id, callback); return id; }, cancelAnimationFrame(key) { frames.delete(key); },
    getComputedStyle: () => ({ getPropertyValue: name => name === '--accent' ? accent : '' }),
    matchMedia(query) { const value = { matches: query.includes('reduced') ? reduced : query.includes('forced') ? forced : coarse, addEventListener(_type, callback) { this.change = callback; } }; media.set(query, value); return value; },
    MutationObserver: class { constructor(callback) { this.callback = callback; } observe(target, options) { observers.push({ target, options, callback: this.callback }); } },
    ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} },
    fetch() { throw new Error('Loader grid must not use the network'); }
  });
  const mutate = () => { for (const observer of observers) if (observer.target === root) observer.callback(); };
  const fire = (target, type, event = {}) => { const listeners = handlers.get(target + ':' + type); assert.ok(listeners, 'Registered ' + target + ':' + type); for (const { callback } of listeners) callback(event); };
  return { canvas, host, root, document, frames, programs, shaders, vaos, uniforms, handlers, fire,
    get draws() { return draws; }, get contextRequests() { return contextRequests; },
    tick(milliseconds = 34) { now += milliseconds; const queued = [...frames.values()]; frames.clear(); for (const callback of queued) callback(now); },
    set(name, value) { root.dataset[name] = String(value); mutate(); },
    color(value, tone = 'violet') { accent = value; root.dataset.tone = tone; mutate(); },
    media(fragment, value) { const entry = [...media.entries()].find(([query]) => query.includes(fragment))[1]; entry.matches = value; entry.change(); },
    resize(w, h) { width = w; height = h; resize(); },
    lost(value) { contextLost = value; if (value) { programs.clear(); shaders.clear(); vaos.clear(); } fire('canvas', value ? 'webglcontextlost' : 'webglcontextrestored', { preventDefault() {} }); }
  };
}

for (const options of [{ absent: true }, { noHost: true }, { loading: false }, { reduced: true }, { forced: true }, { contrast: true }, { motion: true }, { hidden: true }]) {
  const quiet = fixture(options); assert.equal(quiet.contextRequests, 0); assert.equal(quiet.frames.size, 0); assert.equal(quiet.canvas.hidden, true);
}
for (const options of [{ noGL: true }, { throws: true }, { badShader: true }, { badShader: 'fragment' }, { badLink: true }, { badProgram: true }, { badVAO: true }]) {
  const fallback = fixture(options); assert.equal(fallback.canvas.dataset.state, 'fallback'); assert.equal(fallback.frames.size, 0); assert.equal(fallback.canvas.hidden, true); assert.equal(fallback.host.dataset.gridEnhanced, undefined);
  for (const pool of [fallback.programs, fallback.shaders, fallback.vaos]) assert.equal(pool.size, 0, 'Partial initialization releases every allocated GPU object');
}

const normal = fixture();
assert.equal(normal.canvas.dataset.state, 'running'); assert.equal(normal.canvas.dataset.enhanced, 'true'); assert.equal(normal.host.dataset.gridEnhanced, 'true');
assert.equal(normal.programs.size, 1); assert.equal(normal.vaos.size, 1); assert.equal(normal.shaders.size, 0, 'Linked shaders are deleted immediately'); assert.equal(normal.frames.size, 1);
normal.tick(); assert.equal(normal.draws, 1); assert.equal(normal.canvas.dataset.frames, '1'); assert.equal(normal.canvas.dataset.quality, 'desktop'); assert.ok(normal.canvas.width * normal.canvas.height <= 900000);
const actual = name => normal.uniforms.findLast(row => row[0] === name)?.slice(1);
for (const [name, expected] of Object.entries({ uDepth: 8, uFade: .6, uScanDir: 1, uScanWidth: .006, uTrail: .81, uPoints: 1, uReflect: .35, uHaze: .05, uShade: .7, uGlow: .6, uLight: 0 })) assert.ok(Math.abs(actual(name)[0] - expected) < 1e-12, 'Deep preset ' + name);
assert.deepEqual(actual('uCell'), [.1, .1, .1]);
assert.deepEqual(actual('uScanColor'), [240 / 255, 106 / 255, 115 / 255]);
assert.deepEqual(actual('uLineColor'), [77 / 255, 71 / 255, 87 / 255]);
assert.ok(actual('uCoreColor').every((value, i) => value >= actual('uScanColor')[i] && value <= 1));
assert.ok(Math.abs(actual('uTime')[0] - .034) < 1e-12);
assert.equal(actual('uEye')[2], -1.25);
const sweep = fixture(); sweep.tick(400);
const earlyZ = sweep.uniforms.findLast(row => row[0] === 'uScanZ')[1];
sweep.tick(400);
assert.ok(sweep.uniforms.findLast(row => row[0] === 'uScanZ')[1] > earlyZ, 'The scan travels deeper into the room');
assert.ok(Math.abs(sweep.uniforms.findLast(row => row[0] === 'uTime')[1] - .8) < 1e-12, 'Slow frames preserve elapsed scan time');
assert.equal(sweep.draws, 2, 'Elapsed time adds no catch-up draws');
sweep.tick(1500);
assert.equal(sweep.uniforms.findLast(row => row[0] === 'uReveal')[1], 9, 'The entire room is revealed after the 2.2s opening');
assert.equal(sweep.uniforms.findLast(row => row[0] === 'uScanAlpha')[1], 0, 'Deep respects its delay between scans');
sweep.tick(2000);
assert.ok(sweep.uniforms.findLast(row => row[0] === 'uScanAlpha')[1] > 0, 'A later automatic sweep begins');
assert.ok(sweep.uniforms.findLast(row => row[0] === 'uScanZ')[1] < 2, 'The 4s sweep starts near the viewer');
sweep.tick(2000);
assert.ok(sweep.uniforms.findLast(row => row[0] === 'uScanZ')[1] > 4, 'The same sweep advances through the full room depth');
const beforeHidden = sweep.uniforms.findLast(row => row[0] === 'uTime')[1];
sweep.document.hidden = true; sweep.fire('document', 'visibilitychange'); sweep.tick(10000);
sweep.document.hidden = false; sweep.fire('document', 'visibilitychange'); sweep.tick(34);
assert.ok(Math.abs(sweep.uniforms.findLast(row => row[0] === 'uTime')[1] - beforeHidden - .034) < 1e-12, 'Hidden time is excluded from the next frame');
sweep.set('loading', false);
normal.tick(5); assert.equal(normal.draws, 1, 'Rendering is capped at 30fps'); normal.tick(); assert.equal(normal.draws, 2);
normal.color('#c4a4ff'); normal.tick(); assert.deepEqual(actual('uScanColor'), [196 / 255, 164 / 255, 1]); assert.equal(normal.canvas.dataset.color, '#c4a4ff');
normal.set('theme', 'light'); normal.color('rgb(105, 53, 184)'); normal.tick(); assert.deepEqual(actual('uScanColor'), [105 / 255, 53 / 255, 184 / 255]); assert.deepEqual(actual('uLight'), [1]);
normal.color('#0cf'); normal.tick(); assert.deepEqual(actual('uScanColor'), [0, 204 / 255, 1]);
normal.document.hidden = true; normal.fire('document', 'visibilitychange'); assert.equal(normal.frames.size, 0); assert.equal(normal.programs.size, 0); assert.equal(normal.vaos.size, 0); assert.equal(normal.canvas.hidden, true);
normal.document.hidden = false; normal.fire('document', 'visibilitychange'); assert.equal(normal.frames.size, 1); normal.tick();
for (const name of ['motion', 'contrast']) { normal.set(name, true); assert.equal(normal.frames.size, 0); assert.equal(normal.programs.size, 0); normal.set(name, false); assert.equal(normal.frames.size, 1); normal.tick(); }
for (const name of ['reduced', 'forced']) { normal.media(name, true); assert.equal(normal.frames.size, 0); assert.equal(normal.programs.size, 0); normal.media(name, false); assert.equal(normal.frames.size, 1); normal.tick(); }
normal.lost(true); assert.equal(normal.canvas.dataset.state, 'lost'); assert.equal(normal.frames.size, 0); normal.lost(false); assert.equal(normal.frames.size, 1); normal.tick();
normal.fire('window', 'pagehide'); assert.equal(normal.frames.size, 0); assert.equal(normal.programs.size, 0); normal.fire('window', 'pageshow'); normal.tick();
const beforeFinish = normal.canvas.dataset.frames; normal.set('loading', false);
assert.equal(normal.canvas.dataset.state, 'finished'); assert.equal(normal.frames.size, 0); assert.equal(normal.canvas.hidden, true); assert.equal(normal.canvas.dataset.enhanced, undefined); assert.equal(normal.host.dataset.gridEnhanced, undefined);
assert.equal(normal.programs.size, 0); assert.equal(normal.shaders.size, 0); assert.equal(normal.vaos.size, 0); assert.equal(normal.canvas.width * normal.canvas.height, 1, 'Drawing surface memory shrinks after the loader');
const contextsAtFinish = normal.contextRequests; normal.fire('document', 'alejandro:preferences'); normal.color('#f00'); normal.resize(700, 1000); normal.tick(1000);
assert.equal(normal.canvas.dataset.frames, beforeFinish); assert.equal(normal.contextRequests, contextsAtFinish); assert.equal(normal.frames.size, 0, 'A finished loader never wakes or reacquires GPU resources');
normal.set('loading', true); normal.tick(); assert.equal(normal.canvas.dataset.frames, '1', 'A new authorized loading cycle starts cleanly'); normal.set('loading', false);

for (const [width, height, budget] of [[390, 844, 360000], [320, 568, 360000], [9000, 500, 900000], [3000, 2000, 900000]]) {
  const sized = fixture({ width, height, dpr: 3 }); sized.tick(); assert.ok(sized.canvas.width * sized.canvas.height <= budget); assert.equal(sized.programs.size, 1); sized.set('loading', false); assert.equal(sized.programs.size, 0);
}
const coarse = fixture({ width: 1200, height: 900, coarse: true }); coarse.tick(); assert.equal(coarse.canvas.dataset.quality, 'compact'); assert.ok(coarse.canvas.width * coarse.canvas.height <= 360000);
assert.ok([...normal.handlers.keys()].every(key => !/pointer|touch|wheel/.test(key)), 'The loader renderer has no pointer, touch or wheel listeners');
assert.ok(styles.includes('pointer-events: none') && styles.includes('var(--accent)') && styles.includes('::before'), 'The local CSS fallback follows the accent and cannot capture gestures');
assert.ok(styles.includes('prefers-reduced-motion') && styles.includes('forced-colors') && styles.includes('overflow-wrap: anywhere'));
assert.ok(styles.includes('.intro-loader .loader-content') && styles.includes('flex-direction: column') && styles.includes('align-items: center'), 'The loader content wrapper lays out the progress track as a flex item with a real area');
assert.ok(!source.includes('fetch(') && !source.includes('requestIdleCallback') && !source.includes('setInterval'));
console.log('Loader Grid Scan Deep: perspective room, moving sweeps, accent/theme updates, bounded rendering, fallback and complete GPU/RAF teardown verified.');
