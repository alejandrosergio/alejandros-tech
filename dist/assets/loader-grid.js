/* Grid Scan Deep · bounded loader adaptation for Alejandro’sTech.
 * React Bits, (c) 2026 David Haz; source commit
 * 4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4, component blob
 * 1dcda3a7c39864e5ff5105041cd92fea5e378f3d, Deep preset blob
 * 6639f8318bb325a664ecf04eede31f95db1b510b. MIT + Commons Clause:
 * /assets/licenses/react-bits.txt; docs/THIRD_PARTY.md.
 * Local accent integration, single-pass glow and lifecycle/resource limits.
 */
(() => {
  const canvas = document.querySelector('[data-loader-grid]');
  if (!canvas) return;
  const root = document.documentElement, host = canvas.closest('[data-intro-loader]');
  if (!host) return;
  const VERTEX = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;
  const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
uniform float uAspect;
uniform float uPixel;
uniform vec3 uEye;
uniform float uDepth;
uniform vec3 uCell;
uniform float uThick;
uniform float uDot;
uniform vec3 uLineColor;
uniform vec3 uScanColor;
uniform vec3 uCoreColor;
uniform float uFade;
uniform float uScanZ;
uniform float uScanDir;
uniform float uScanAlpha;
uniform float uScanWidth;
uniform float uTrail;
uniform float uReveal;
uniform float uPoints;
uniform float uReflect;
uniform float uHaze;
uniform float uShade;
uniform float uLight;
uniform float uGlow;
uniform float uTime;
in vec2 vUv;
out vec4 outColor;

struct Light {
  float grid;
  float fade;
  float core;
  float trail;
  float spill;
  float reveal;
};

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

vec2 hash2(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}

float lines(float across, float period, float footprint) {
  float u = across / period;
  float du = footprint / period;
  float d = abs(fract(u + 0.5) - 0.5) / max(du, 1e-5);
  float coverage = clamp(uThick + 0.5 - d, 0.0, 1.0);
  float mean = min(1.0, 2.0 * uThick * du);
  return mix(coverage, mean, smoothstep(0.1, 0.4, du));
}

float depthFade(float z) {
  float n = clamp(z / uDepth, 0.0, 1.0);
  return mix(1.0, (exp(-3.0 * n) - 0.0497871) / 0.9502129, uFade);
}

vec3 project(vec3 eye, vec3 o, int face, float plane) {
  vec3 d = o - eye;
  float t = face == 0 ? (plane - o.x) / d.x : (face == 1 ? (plane - o.y) / d.y : (plane - o.z) / d.z);
  return o + d * t;
}

void trace(vec3 o, vec3 d, out int face, out float plane, out vec3 h) {
  float sx = d.x > 0.0 ? 0.5 * uAspect : -0.5 * uAspect;
  float sy = d.y > 0.0 ? 0.5 : -0.5;
  float tx = abs(d.x) > 1e-6 ? (sx - o.x) / d.x : 1e9;
  float ty = abs(d.y) > 1e-6 ? (sy - o.y) / d.y : 1e9;
  float t = (uDepth - o.z) / d.z;
  face = 2;
  plane = uDepth;
  if (tx < t) {
    face = 0;
    plane = sx;
    t = tx;
  }
  if (ty < t) {
    face = 1;
    plane = sy;
    t = ty;
  }
  h = o + d * t;
}

vec2 faceUv(vec3 h, int face) {
  if (face == 0) return vec2(h.z, h.y + 0.5);
  if (face == 1) return vec2(h.x + 0.5 * uAspect, h.z);
  return vec2(h.x + 0.5 * uAspect, h.y + 0.5);
}

Light illuminate(vec3 h, int face, vec2 uv, vec2 foot, float blur) {
  Light l;
  vec2 cell = face == 0 ? uCell.zy : (face == 1 ? uCell.xz : uCell.xy);
  vec2 f = foot * blur;
  float minor = max(lines(uv.x, cell.x, f.x), lines(uv.y, cell.y, f.y));
  float major = max(
    lines(uv.x, cell.x * 4.0, f.x),
    lines(uv.y, cell.y * 4.0, f.y)
  );
  l.grid = max(minor * 0.75, major) / blur;
  float z = h.z;
  l.fade = depthFade(z);
  l.reveal = (1.0 - smoothstep(uReveal - 0.2, uReveal, z));
  float zFoot = face == 0 ? f.x : (face == 1 ? f.y : 0.0);
  float width = max(uScanWidth, zFoot * 1.1);
  float dz = z - uScanZ;
  l.core = exp(-dz * dz / (width * width)) * (face == 2 ? 0.45 : 1.0) * uScanAlpha;
  float behind = -dz * uScanDir;
  l.trail = exp(-max(behind, 0.0) / uTrail) * smoothstep(-width, width * 0.5, behind) * uScanAlpha;
  l.spill = exp(-dz * dz / 0.05) * uScanAlpha;
  return l;
}

void over(inout vec4 acc, vec3 color, float alpha) {
  alpha = clamp(alpha, 0.0, 1.0);
  acc = vec4(color * alpha, alpha) + acc * (1.0 - alpha);
}

void paint(inout vec4 color, inout float energy, Light l, float gain, float lift) {
  float base = l.grid * l.fade * l.reveal * lift;
  float far = l.fade * l.reveal * gain;
  float lit = l.grid * (l.core * 1.2 + l.trail * 0.75) * far;
  float sheen = (l.core * 0.14 + l.spill * 0.05 + l.trail * 0.03) * far;
  float laser = l.core * far;
  over(color, uLineColor, base);
  over(color, uScanColor, sheen);
  over(color, uScanColor, lit);
  over(color, uCoreColor, laser * 0.9);
  energy += laser * 0.9 + lit * 0.5;
}

void main() {
  vec3 p = vec3((vUv.x - 0.5) * uAspect, vUv.y - 0.5, 0.0);
  vec3 d = p - uEye;
  int face;
  float plane;
  vec3 h;
  trace(p, d, face, plane, h);
  vec3 hx = project(uEye, p + vec3(uPixel, 0.0, 0.0), face, plane);
  vec3 hy = project(uEye, p + vec3(0.0, uPixel, 0.0), face, plane);
  vec2 uv = faceUv(h, face);
  vec2 ux = faceUv(hx, face) - uv;
  vec2 uy = faceUv(hy, face) - uv;
  vec2 foot = vec2(length(vec2(ux.x, uy.x)), length(vec2(ux.y, uy.y)));
  Light l = illuminate(h, face, uv, foot, 1.0);

  vec4 color = vec4(0.0);
  float energy = 0.0;

  if (uShade > 0.0) {
    vec2 gaps = face == 0
      ? vec2(0.5 - abs(h.y), uDepth - h.z)
      : (face == 1 ? vec2(0.5 * uAspect - abs(h.x), uDepth - h.z) : vec2(0.5 * uAspect - abs(h.x), 0.5 - abs(h.y)));
    vec2 crease = 1.0 - exp(-max(gaps, 0.0) / 0.16);
    float occlusion = crease.x * crease.y;
    float lamp = 1.0 / (1.0 + h.z * h.z * 0.9);
    float tilt = face == 1 ? (plane < 0.0 ? 1.1 : 0.85) : (face == 2 ? 0.8 : 1.0);
    float glowSpill = (l.spill * 0.5 + l.trail * 0.12) * l.reveal * l.fade;
    if (uLight > 0.5) {
      float shadow = (1.0 - lamp * tilt) * 0.09 + (1.0 - occlusion) * 0.2;
      over(color, vec3(0.0), shadow * uShade * l.reveal * l.fade);
    } else {
      over(color, vec3(1.0), lamp * tilt * occlusion * 0.11 * uShade * l.reveal * l.fade);
    }
    over(color, uScanColor, glowSpill * uShade * occlusion * 0.35);
  }

  if (face == 1 && plane < 0.0 && uReflect > 0.0) {
    vec3 mirror = vec3(uEye.x, -1.0 - uEye.y, uEye.z);
    vec3 r = h - mirror;
    int face2;
    float plane2;
    vec3 h2;
    trace(h, r, face2, plane2, h2);
    vec2 uv2 = faceUv(h2, face2);
    vec2 ux2 = faceUv(project(mirror, hx, face2, plane2), face2) - uv2;
    vec2 uy2 = faceUv(project(mirror, hy, face2, plane2), face2) - uv2;
    vec2 foot2 = vec2(length(vec2(ux2.x, uy2.x)), length(vec2(ux2.y, uy2.y)));
    float travel = length(h2 - h);
    Light m = illuminate(h2, face2, uv2, foot2, 1.0 + travel * 4.0);
    m.reveal *= l.reveal;
    float grazing = 1.0 - normalize(r).y;
    float gain = (0.3 + 0.7 * grazing * grazing * grazing * grazing) * uReflect * exp(-travel * 1.1) * (uLight > 0.5 ? 0.6 : 1.0);
    float reflected = 0.0;
    paint(color, reflected, m, gain, 0.0);
    energy += reflected * 0.6;
  }

  paint(color, energy, l, 1.0, 1.0);

  if (uPoints > 0.5) {
    vec2 cell = face == 0 ? uCell.zy : (face == 1 ? uCell.xz : uCell.xy);
    vec2 spacing = cell / 2.5;
    vec2 q = uv / spacing;
    vec2 id = floor(q);
    vec2 seed = id + vec2(float(face) * 13.7 + plane * 5.3, float(face) * 3.1);
    vec2 delta = (q - id - (0.2 + 0.6 * hash2(seed))) * spacing;
    float det = ux.x * uy.y - ux.y * uy.x;
    vec2 s = vec2(delta.x * uy.y - delta.y * uy.x, ux.x * delta.y - ux.y * delta.x) / det;
    float radius = uDot * mix(1.0, 0.55, clamp(h.z / uDepth, 0.0, 1.0));
    float spot = clamp(radius + 0.5 - length(s), 0.0, 1.0);
    float gap = min(spacing.x / foot.x, spacing.y / foot.y);
    float r = hash(seed + 7.7);
    float flicker = 0.75 + 0.25 * sin(uTime * (3.0 + r * 5.0) + r * 40.0);
    float dots = spot * smoothstep(5.0, 10.0, gap) * smoothstep(0.25, 0.6, r) * (0.3 + 0.7 * r * r) * flicker;
    float hot = l.core * 2.5;
    float warm = l.trail * l.trail * 1.3;
    float spark = dots * (hot + warm) * l.fade * l.reveal;
    over(color, mix(uScanColor, uCoreColor, clamp(hot / max(hot + warm, 1e-4), 0.0, 1.0)), spark);
    energy += spark * 0.9;
  }

  if (uHaze > 0.0 && uScanAlpha > 0.0 && uScanZ > 0.0 && h.z > uScanZ) {
    vec3 c = p + d * (uScanZ / d.z);
    float grain = hash(floor(c.xy * 180.0) + floor(uTime * 24.0) * 7.0);
    float edge = min(0.5 * uAspect - abs(c.x), 0.5 - abs(c.y));
    float rim = exp(-edge / 0.06);
    float veil = uHaze * uScanAlpha * (0.45 + 0.9 * grain) * (0.55 + rim * 1.6);
    over(color, uScanColor, veil * depthFade(uScanZ) * l.reveal);
  }

  energy = clamp(energy, 0.0, 1.0);
  // A bounded single-pass glow avoids offscreen textures for the short intro.
  vec4 glow = vec4(uScanColor * energy, energy) * uGlow * 0.65;
  outColor = color + glow * (1.0 - color.a);
}`;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), forced = matchMedia('(forced-colors: active)');
  const preset = Object.freeze({ cells: 10, depth: 8, depthFade: .6, shading: .7, reflection: .35, scanDuration: 4, scanDelay: 1.6, scanWidth: 1, trail: .7, glow: .6 });
  const INTRO_SECONDS = 2.2;
  let renderer = null, raf = 0, last = 0, lastDraw = 0, time = 0, frames = 0;
  let lost = false, failed = false, suspended = false, wasLoading = false, dirty = true, color = [1, 1, 1];
  canvas.dataset.state = 'idle'; canvas.dataset.frames = '0';
  const loading = () => root.dataset.loading === 'true';
  const allowed = () => loading() && !suspended && !document.hidden && !lost && !failed && !reduced.matches && !forced.matches && root.dataset.motion !== 'true' && root.dataset.contrast !== 'true';
  function accent() {
    const value = getComputedStyle(root).getPropertyValue('--accent').trim();
    const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(value);
    if (hex) { const full = hex[1].length === 3 ? hex[1].replace(/./g, digit => digit + digit) : hex[1]; color = [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16) / 255); }
    else {
      const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(value);
      if (rgb) color = rgb.slice(1, 4).map(channel => clamp(Number(channel) / 255, 0, 1));
    }
    canvas.dataset.color = value;
  }
  function createRenderer() {
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const shaders = new Set(); let program, vao;
    function dispose() {
      if (!gl.isContextLost()) {
        for (const shader of shaders) gl.deleteShader(shader);
        if (vao) gl.deleteVertexArray(vao);
        if (program) gl.deleteProgram(program);
        gl.bindVertexArray(null); gl.useProgram(null); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      }
      shaders.clear(); program = vao = null;
      // Release the drawing surface as well as programs/VAO after this brief use.
      canvas.width = canvas.height = 1;
    }
    function compile(type, source) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Loader shader unavailable');
      shaders.add(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Loader shader unavailable');
      return shader;
    }
    const uniforms = {};
    try {
      const vertex = compile(gl.VERTEX_SHADER, VERTEX), fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
      program = gl.createProgram(); if (!program) throw new Error('Loader program unavailable');
      gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
      for (const shader of shaders) gl.deleteShader(shader); shaders.clear();
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Loader program unavailable');
      for (let index = 0; index < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); index++) {
        const info = gl.getActiveUniform(program, index);
        if (info) uniforms[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(program, info.name);
      }
      vao = gl.createVertexArray(); if (!vao) throw new Error('Loader geometry unavailable');
    } catch (error) { dispose(); throw error; }
    const size = { width: 1, height: 1, ratio: 1 };
    function resize() {
      const box = host.getBoundingClientRect(), width = Math.max(1, box.width), height = Math.max(1, box.height);
      const compact = width < 700 || matchMedia('(pointer: coarse)').matches, budget = compact ? 360000 : 900000;
      const ratio = Math.min(devicePixelRatio || 1, compact ? 1 : 1.25, Math.sqrt(budget / (width * height)));
      canvas.width = Math.max(1, Math.floor(width * ratio)); canvas.height = Math.max(1, Math.floor(height * ratio));
      size.width = width; size.height = height; size.ratio = canvas.width / width;
      canvas.dataset.quality = compact ? 'compact' : 'desktop'; canvas.dataset.pixels = String(canvas.width * canvas.height);
    }
    function render() {
      const u = uniforms, aspect = size.width / size.height, cy = 1 / preset.cells;
      const cx = aspect / Math.max(1, Math.round(aspect / cy));
      const depth = Math.max(cy, Math.round(preset.depth / cy) * cy);
      const intro = Math.min(1, time / INTRO_SECONDS);
      const phase = (Math.max(0, time - INTRO_SECONDS)) % (preset.scanDuration + preset.scanDelay);
      const progress = intro < 1 ? intro : clamp((phase - preset.scanDelay) / preset.scanDuration, 0, 1);
      const scanZ = intro < 1 ? progress * (depth + .4) - .2 : progress * (depth + .3) - .15;
      const scanAlpha = intro < 1 ? Math.min(1, progress * 6) * (1 - Math.max(0, progress - .85) / .15) : Math.min(1, progress / .12) * Math.min(1, (1 - progress) / .12);
      const light = root.dataset.theme === 'light';
      const core = light ? color : color.map(channel => channel + (1 - channel) * .65);
      gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program); gl.bindVertexArray(vao);
      gl.uniform1f(u.uAspect, aspect); gl.uniform1f(u.uPixel, 1 / canvas.height);
      gl.uniform3f(u.uEye, Math.sin(time * .21) * .025 * aspect, Math.sin(time * .17) * .018, -1.25);
      gl.uniform1f(u.uDepth, depth); gl.uniform3f(u.uCell, cx, cy, cy);
      gl.uniform1f(u.uThick, size.ratio * .5); gl.uniform1f(u.uDot, 1.8 * size.ratio);
      gl.uniform3f(u.uLineColor, 77 / 255, 71 / 255, 87 / 255);
      gl.uniform3f(u.uScanColor, ...color); gl.uniform3f(u.uCoreColor, ...core);
      gl.uniform1f(u.uFade, preset.depthFade); gl.uniform1f(u.uScanZ, scanZ); gl.uniform1f(u.uScanDir, 1);
      gl.uniform1f(u.uScanAlpha, scanAlpha); gl.uniform1f(u.uScanWidth, .006 * preset.scanWidth);
      gl.uniform1f(u.uTrail, .04 + preset.trail * 1.1); gl.uniform1f(u.uReveal, intro < 1 ? scanZ + .05 : depth + 1);
      gl.uniform1f(u.uPoints, 1); gl.uniform1f(u.uReflect, preset.reflection);
      gl.uniform1f(u.uHaze, light ? .03 : .05); gl.uniform1f(u.uShade, preset.shading);
      gl.uniform1f(u.uLight, light ? 1 : 0); gl.uniform1f(u.uGlow, preset.glow); gl.uniform1f(u.uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    return { resize, render, dispose };
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; canvas.hidden = true; delete canvas.dataset.enhanced; delete host.dataset.gridEnhanced;
    renderer?.dispose(); renderer = null; dirty = true;
  }
  function frame(now) {
    raf = 0;
    if (!allowed()) { sync(); return; }
    if (now - lastDraw < 1000 / 30 - .5) { raf = requestAnimationFrame(frame); return; }
    // Analytical geometry follows visible elapsed time without catch-up passes.
    const dt = clamp((now - last) / 1000, 0, 10); last = lastDraw = now;
    time += dt;
    try {
      if (dirty) { renderer.resize(); dirty = false; }
      renderer.render(); canvas.dataset.frames = String(++frames);
      raf = requestAnimationFrame(frame);
    } catch { failed = true; sync(); }
  }
  function sync() {
    const isLoading = loading();
    if (isLoading && !wasLoading) { time = frames = 0; canvas.dataset.frames = '0'; }
    wasLoading = isLoading;
    if (!allowed()) {
      stop(); canvas.dataset.state = !isLoading ? 'finished' : failed ? 'fallback' : lost ? 'lost' : 'paused'; return;
    }
    accent();
    if (!renderer) {
      try { renderer = createRenderer(); } catch { renderer = null; }
      if (!renderer) { failed = true; stop(); canvas.dataset.state = 'fallback'; return; }
    }
    canvas.hidden = false; canvas.dataset.enhanced = 'true'; host.dataset.gridEnhanced = 'true'; canvas.dataset.state = 'running';
    if (!raf) { last = lastDraw = performance.now(); raf = requestAnimationFrame(frame); }
  }
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-loading', 'data-theme', 'data-tone', 'data-motion', 'data-contrast'] });
  document.addEventListener('alejandro:preferences', sync); document.addEventListener('visibilitychange', sync);
  for (const media of [reduced, forced]) media.addEventListener('change', sync);
  const resize = () => { dirty = true; };
  window.addEventListener('resize', resize, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; sync(); });
  canvas.addEventListener('webglcontextrestored', () => { lost = failed = false; sync(); });
  window.addEventListener('pagehide', () => { suspended = true; sync(); });
  window.addEventListener('pageshow', () => { suspended = false; sync(); });
  sync();
})();

