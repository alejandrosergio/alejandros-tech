/* Light Rays · bounded loader adaptation for Alejandro’sTech.
 * Underwater preset and shaders: React Bits, (c) 2026 David Haz.
 * Source commit 4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4;
 * component blob 8133de5fefcc6856c6e3d43a363191e30a918049.
 * MIT + Commons Clause: /assets/licenses/react-bits.txt; docs/THIRD_PARTY.md.
 * Local lifecycle, accent/theme integration and resource limits are original.
 */
(() => {
  const canvas = document.querySelector('[data-loader-rays]');
  if (!canvas) return;
  const root = document.documentElement, host = canvas.closest('[data-intro-loader]');
  if (!host) return;
  const MAX_PULSES = 4;
const VERTEX = `#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uScale;
uniform float uTime;
uniform vec2 uSource;
uniform vec2 uAim;
uniform float uReach;
uniform vec3 uColor;
uniform float uSpread;
uniform float uLength;
uniform float uFade;
uniform float uSaturation;
uniform float uPulsating;
uniform float uNoise;
uniform float uDistortion;
uniform float uDensity;
uniform float uSharpness;
uniform float uGlow;
uniform float uHaze;
uniform float uAtmosphere;
uniform float uIntensity;
uniform vec4 uShadow;
uniform vec4 uPulses[${MAX_PULSES}];
uniform vec2 uIntro;
uniform float uLight;
uniform float uOpacity;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), w.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), w.x), w.y);
}

float shape(float strength, float width) {
  float edge = max(mix(0.5, 0.08, uSharpness), width);
  return mix(strength, smoothstep(0.62 - edge, 0.62 + edge, strength), uSharpness);
}

void main() {
  vec2 coord = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uScale;
  vec2 delta = coord - uSource;
  float distance = length(delta);
  vec2 dir = delta / max(distance, 1e-4);
  float cosAngle = dot(dir, uAim);
  float angle = cosAngle + uDistortion * sin(uTime * 2.0 + distance * 0.02) * 0.2;
  float slope = fwidth(angle);
  float depth = distance / uReach;

  float source = exp(-depth * depth * 9.0) * 0.9 + exp(-depth * 3.2) * 0.25;
  float glowLight = uGlow * source * smoothstep(-0.2, 0.6, cosAngle);
  float spread = pow(max(angle, 0.0), 1.0 / uSpread);
  float lengthFalloff = clamp(1.0 - distance / (uReach * uLength), 0.0, 1.0);
  float fadeFalloff = clamp(1.0 - distance / (uReach * uFade), 0.5, 1.0);
  float envelope = spread * lengthFalloff * fadeFalloff;
  float reveal = uIntensity * uIntro.y * (1.0 - smoothstep(uIntro.x - 0.35, uIntro.x, depth));
  if ((envelope * 1.6 + glowLight) * reveal < 0.0015) {
    fragColor = vec4(0.0);
    return;
  }

  float phaseA = angle * 36.2214 * uDensity + uTime * 1.5;
  float phaseB = -angle * 21.11349 * uDensity + uTime * 1.5;
  float phaseC = angle * 22.3991 * uDensity + uTime * 1.1;
  float phaseD = -angle * 18.0234 * uDensity + uTime * 1.1;
  float strengthA = clamp(0.75 + 0.15 * sin(phaseA) + 0.2 * cos(phaseB), 0.0, 1.0);
  float strengthB = clamp(0.75 + 0.15 * sin(phaseC) + 0.2 * cos(phaseD), 0.0, 1.0);
  float widthA = abs(0.15 * 36.2214 * cos(phaseA) + 0.2 * 21.11349 * sin(phaseB)) * uDensity * slope;
  float widthB = abs(0.15 * 22.3991 * cos(phaseC) + 0.2 * 18.0234 * sin(phaseD)) * uDensity * slope;
  float pulseA = uPulsating > 0.5 ? 0.8 + 0.2 * sin(uTime * 4.5) : 1.0;
  float pulseB = uPulsating > 0.5 ? 0.8 + 0.2 * sin(uTime * 3.3) : 1.0;
  float rayLight = envelope * (0.5 * shape(strengthA, widthA) * pulseA + 0.4 * shape(strengthB, widthB) * pulseB);

  if (uHaze > 0.0) {
    float around = atan(uAim.x * dir.y - uAim.y * dir.x, cosAngle);
    vec2 drift = vec2(around * 2.2 + uTime * 0.035, depth * 2.6 - uTime * 0.11);
    float fog = 0.65 * valueNoise(drift * vec2(3.0, 1.0)) + 0.35 * valueNoise(drift * vec2(7.0, 2.3) + 4.1);
    rayLight *= mix(1.0, 0.25 + 1.2 * fog, uHaze);
  }

  if (uShadow.z > 0.0) {
    vec2 toCursor = uShadow.xy - uSource;
    float cursorDistance = length(toCursor);
    float along = dot(delta, toCursor) / max(cursorDistance * cursorDistance, 1e-4);
    float side = abs(delta.x * toCursor.y - delta.y * toCursor.x) / max(cursorDistance, 1e-4);
    float trail = max(along - 1.0, 0.0);
    float width = uShadow.w * along + 0.22 * trail * cursorDistance;
    float behind = smoothstep(0.97, 1.25, along) * exp(-trail * 1.1);
    float shade = (1.0 - smoothstep(width * 0.3, width * 1.6, side)) * behind;
    rayLight *= 1.0 - uShadow.z * 0.62 * shade;
  }

  float boost = 0.0;
  for (int i = 0; i < ${MAX_PULSES}; i++) {
    vec4 wave = uPulses[i];
    if (wave.z <= 0.0) continue;
    float x = (depth - wave.x) / wave.y;
    boost += wave.z * exp(-x * x);
  }
  float light = (rayLight * (1.0 + boost) + glowLight) * reveal;

  if (uNoise > 0.0) {
    float n = fract(sin(dot(coord * 0.02 + uTime * 0.1, vec2(12.9898, 78.233))) * 43758.5453123);
    light *= 1.0 - uNoise + uNoise * n;
  }

  float near = clamp(1.2 - distance / (uResolution.y / uScale), 0.0, 1.0);
  vec3 tint = mix(vec3(0.9), vec3(0.1, 0.3, 0.5) + near * vec3(0.8, 0.6, 0.5), uAtmosphere);
  float gray = dot(tint, vec3(0.299, 0.587, 0.114));
  vec3 hue = max(mix(vec3(gray), tint, uSaturation), 0.0) * uColor;

  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  if (uLight > 0.5) {
    vec3 color = hue * light;
    float energy = max(color.r, max(color.g, color.b));
    vec3 tone = clamp(1.0 - (1.0 - hue / max(max(hue.r, max(hue.g, hue.b)), 1e-4)) * 1.8, 0.0, 1.0);
    float warm = clamp((min(tone.r, tone.g) - tone.b) * 2.0, 0.0, 1.0);
    vec3 ink = tone * (mix(0.66, 0.94, warm) - 0.1 * smoothstep(0.4, 1.2, energy));
    float density = clamp(0.82 * (1.0 - exp(-1.5 * energy * energy)) * uOpacity + grain, 0.0, 1.0);
    fragColor = vec4(ink * density, density);
    return;
  }
  float level = light < 0.75 ? light : 0.75 + 0.25 * (1.0 - exp(-(light - 0.75) / 0.25));
  float top = max(hue.r, max(hue.g, hue.b));
  hue = mix(hue, vec3(top), smoothstep(0.8, 1.0, level) * 0.45);
  vec3 shown = clamp(hue * level, 0.0, 1.0) * level;
  fragColor = vec4(clamp(shown + grain, 0.0, level) * uOpacity, level * uOpacity);
}`;


  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smoother = value => { const t = clamp(value, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), forced = matchMedia('(forced-colors: active)');
  // Official Underwater values. The visitor's accent replaces its cyan color.
  const preset = Object.freeze({ speed: .5, spread: 1, length: 3, density: 1.6, sharpness: .5, glow: .6, haze: .5, atmosphere: .7, intensity: 1, fade: 1, saturation: 1, noise: 0, distortion: .12, opacity: 1 });
  // The brief site loader needs its field visible promptly; this reveal timing
  // is local and does not change the Underwater shader or preset parameters.
  const OPENING_SECONDS = .26;
  let renderer = null, raf = 0, last = 0, lastDraw = 0, time = 0, opening = 0, frames = 0;
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
    const size = { width: 1, height: 1, ratio: 1 }, pulseData = new Float32Array(MAX_PULSES * 4);
    function resize() {
      const box = host.getBoundingClientRect(), width = Math.max(1, box.width), height = Math.max(1, box.height);
      const compact = width < 700 || matchMedia('(pointer: coarse)').matches, budget = compact ? 360000 : 900000;
      const sampling = clamp(.35 + .3 * preset.density * (.35 + .65 * preset.sharpness), .5, 2);
      const ratio = Math.min(devicePixelRatio || 1, compact ? 1 : 1.25, sampling, Math.sqrt(budget / (width * height)));
      canvas.width = Math.max(1, Math.floor(width * ratio)); canvas.height = Math.max(1, Math.floor(height * ratio));
      size.width = width; size.height = height; size.ratio = canvas.width / width;
      canvas.dataset.quality = compact ? 'compact' : 'desktop'; canvas.dataset.pixels = String(canvas.width * canvas.height);
    }
    function render() {
      const u = uniforms, width = size.width, height = size.height, eased = 1 - Math.pow(1 - opening, 3);
      gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program); gl.bindVertexArray(vao);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height); gl.uniform1f(u.uScale, size.ratio);
      gl.uniform1f(u.uTime, time); gl.uniform2f(u.uSource, .5 * width, -.2 * height); gl.uniform2f(u.uAim, 0, 1);
      gl.uniform1f(u.uReach, Math.max(width, height)); gl.uniform3f(u.uColor, color[0], color[1], color[2]);
      gl.uniform1f(u.uSpread, preset.spread); gl.uniform1f(u.uLength, preset.length); gl.uniform1f(u.uFade, preset.fade);
      gl.uniform1f(u.uSaturation, preset.saturation); gl.uniform1f(u.uPulsating, 0); gl.uniform1f(u.uNoise, preset.noise);
      gl.uniform1f(u.uDistortion, preset.distortion); gl.uniform1f(u.uDensity, preset.density); gl.uniform1f(u.uSharpness, preset.sharpness);
      gl.uniform1f(u.uGlow, preset.glow); gl.uniform1f(u.uHaze, preset.haze); gl.uniform1f(u.uAtmosphere, preset.atmosphere); gl.uniform1f(u.uIntensity, preset.intensity);
      // The loader is decorative: no cursor shadow, click pulse or pointer capture.
      gl.uniform4f(u.uShadow, width * .5, height * .5, 0, 16); gl.uniform4fv(u.uPulses, pulseData);
      gl.uniform2f(u.uIntro, eased * 2.6, smoother(opening / .5));
      gl.uniform1f(u.uLight, root.dataset.theme === 'light' ? 1 : 0); gl.uniform1f(u.uOpacity, preset.opacity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    return { resize, render, dispose };
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; canvas.hidden = true; delete canvas.dataset.enhanced; delete host.dataset.raysEnhanced;
    renderer?.dispose(); renderer = null; dirty = true;
  }
  function frame(now) {
    raf = 0;
    if (!allowed()) { sync(); return; }
    if (now - lastDraw < 1000 / 30 - .5) { raf = requestAnimationFrame(frame); return; }
    const dt = clamp((now - last) / 1000, 0, .05); last = lastDraw = now;
    time += dt * preset.speed; opening = Math.min(1, opening + dt / OPENING_SECONDS);
    try {
      if (dirty) { renderer.resize(); dirty = false; }
      renderer.render(); canvas.dataset.frames = String(++frames);
      raf = requestAnimationFrame(frame);
    } catch { failed = true; sync(); }
  }
  function sync() {
    const isLoading = loading();
    if (isLoading && !wasLoading) { time = opening = frames = 0; canvas.dataset.frames = '0'; }
    wasLoading = isLoading;
    if (!allowed()) {
      stop(); canvas.dataset.state = !isLoading ? 'finished' : failed ? 'fallback' : lost ? 'lost' : 'paused'; return;
    }
    accent();
    if (!renderer) {
      try { renderer = createRenderer(); } catch { renderer = null; }
      if (!renderer) { failed = true; stop(); canvas.dataset.state = 'fallback'; return; }
    }
    canvas.hidden = false; canvas.dataset.enhanced = 'true'; host.dataset.raysEnhanced = 'true'; canvas.dataset.state = 'running';
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

