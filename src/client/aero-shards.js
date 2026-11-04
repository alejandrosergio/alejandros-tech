/* Aero Shards: native WebGL adaptation for Alejandro’sTech.
 * Ribbon curves / layered flow adapted from React Bits, Copyright (c) 2026 David Haz.
 * Upstream blob: 2f027efed082728d0fff98a733c1dec981c5ee00.
 * MIT + Commons Clause: /assets/licenses/react-bits.txt. See docs/THIRD_PARTY.md.
 * The renderer, shaders, static alternative and lifecycle integration are site-specific.
 */
(() => {
  const scene = document.querySelector('[data-aero-scene]');
  if (!scene) return;
  const root = document.documentElement, backdrop = scene.querySelector('[data-aero-backdrop]');
  const canvas = backdrop.querySelector('[data-aero-canvas]'), fallbackControl = scene.querySelector('[data-background-pause]');
  const model = scene.querySelector('[data-brand-art]'), modelControls = model?.querySelector('[data-art-controls]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), forced = matchMedia('(forced-colors: active)');
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
  if (!gl) return;
  const quiet = () => reduced.matches || root.dataset.motion === 'true';
  const excluded = () => forced.matches || root.dataset.contrast === 'true';
  let ownPaused = false, visible = true, lost = false, raf = 0, last = 0, elapsed = 3, dirty = true, compact;
  let program, buffer, vertices = 0, attributes = [], uniforms = {}, accent = [0.08, .4, .9];
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  const paused = () => quiet() || ownPaused || model?.dataset.paused === 'true';

  const vertexSource = `
    attribute vec3 aPoint; attribute vec3 aNormal; attribute vec3 aBary;
    attribute vec4 aSeed; attribute float aLayer;
    uniform float uTime; uniform float uAspect; uniform vec2 uPointer;
    varying vec3 vNormal; varying vec3 vBary; varying float vFade; varying float vTint; varying float vMarker;
    const float TAU = 6.283185307;
    void main() {
      float level = max(aLayer, 0.0);
      float depth = 2.7; vec2 slope = vec2(.2, -.78); float growth = 1.0;
      if (level > .5) { depth = 3.9; slope = vec2(-.72, .02); growth = 1.3; }
      if (level > 1.5) { depth = 5.6; slope = vec2(.58, -.06); growth = 1.8; }
      if (level > 2.5) { depth = 8.1; slope = vec2(-.24, .62); growth = 2.6; }
      if (level > 3.5) { depth = 11.6; slope = vec2(.8, .3); growth = 3.6; }
      float s = fract(aSeed.x + uTime * .016 * (1.0 + level * .07));
      float u = -1.32 + 2.64 * s;
      float v = mix(slope.x, slope.y, s) + .1 * sin(s * TAU * .7 + level * 2.3) + .045 * sin(s * TAU * 1.9 + level);
      depth += .35 * sin(s * 3.14159265 * 1.4 + level * 1.9);
      vec3 center = vec3(u * uAspect * depth / 4.0, (v - .22) * depth / 4.0, -depth);
      vec3 tangent = normalize(vec3(2.64 * uAspect, slope.y - slope.x + .45 * cos(s * TAU * .7 + level * 2.3), .18));
      vec3 across = normalize(cross(vec3(0.0, 0.0, 1.0), tangent));
      vec3 lift = normalize(cross(tangent, across));
      float twist = s * TAU * .6 + level * 1.7 + uTime * .12;
      vec3 lane = across * cos(twist) + lift * sin(twist);
      float width = (.15 + .035 * depth) * (.8 + .3 * sin(s * TAU * 1.3 + level * .8));
      center += lane * aSeed.y * width;
      center += lift * .10 * depth / 4.0 * sin(s * TAU * 1.3 - uTime * .17 + level * 1.1);
      center.xy += uPointer * vec2(.055, .035) * depth;
      float bank = .8 * sin(twist) + .24 * sin(s * TAU * 1.6 - uTime * .1 + aSeed.z * TAU);
      vec3 side = across * cos(bank) + lift * sin(bank);
      vec3 normal = normalize(cross(tangent, side));
      float taper = smoothstep(0.0, .1, s) * smoothstep(0.0, .1, 1.0 - s);
      float size = .062 * aSeed.w * growth * sqrt(taper) * (1.0 - .3 * aSeed.y * aSeed.y);
      size *= min(1.0, uAspect / .85);
      vec3 p = center + (tangent * aPoint.x + side * aPoint.y + normal * aPoint.z) * size;
      vNormal = normalize(tangent * aNormal.x + side * aNormal.y + normal * aNormal.z);
      vFade = (1.0 - level * .16) * taper;
      vMarker = step(aLayer, -.5);
      if (aLayer < -.5) {
        depth = 5.0;
        p = vec3((aSeed.x * uAspect + uPointer.x * .035) * depth / 4.0, (aSeed.y + uPointer.y * .025) * depth / 4.0, -depth);
        p += aPoint * .027; vFade = .2; vNormal = vec3(0.0, 0.0, 1.0);
      }
      vBary = aBary; vTint = aSeed.z;
      gl_Position = vec4(p.x * 4.0 / uAspect, p.y * 4.0, 0.0, -p.z);
    }`;
  const fragmentSource = `
    precision mediump float;
    uniform vec3 uAccent; uniform float uLight;
    varying vec3 vNormal; varying vec3 vBary; varying float vFade; varying float vTint; varying float vMarker;
    void main() {
      vec3 n = normalize(vNormal);
      vec3 key = normalize(vec3(-.4, .8, 1.0));
      float edge = 1.0 - smoothstep(.015, .07, min(vBary.x, min(vBary.y, vBary.z)));
      float shine = pow(max(dot(reflect(vec3(0.0, 0.0, -1.0), n), key), 0.0), 28.0);
      float fresnel = pow(1.0 - abs(n.z), 2.0);
      float studio = .22 + .5 * abs(dot(n, key));
      vec3 base = mix(uAccent, vec3(.68, .84, 1.0), .15 + .25 * vTint);
      vec3 color = base * studio + uAccent * fresnel * .35;
      color += mix(vec3(.5, .75, 1.0), uAccent, uLight) * (edge * .35 + shine * .7);
      float alpha = (.17 + edge * .42 + fresnel * .17 + shine * .3) * vFade;
      if (vMarker > .5) { color = uAccent; alpha = vFade; }
      gl_FragColor = vec4(color, min(alpha, .78));
    }`;

  function createGeometry() {
    const count = compact ? 340 : 760, data = [];
    let seed = 1349;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    function triangle(a, b, c, seedData, layer, edges = [true, true, true]) {
      const u = b.map((v, i) => v - a[i]), v = c.map((n, i) => n - a[i]);
      const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const length = Math.hypot(...n) || 1, normal = n.map(x => x / length);
      [a, b, c].forEach((point, i) => data.push(...point, ...normal, ...edges.map((edge, j) => edge ? Number(i === j) : 1), ...seedData, layer));
    }
    // Far layers are drawn first. Thin polygonal prisms catch light along their outlines.
    for (let level = 4; level >= 0; level--) {
      const amount = Math.round(count * [.26, .23, .20, .17, .14][level]);
      for (let i = 0; i < amount; i++) {
        const spread = .2 + random() * .2, family = random();
        const shape = family < .55 ? [[1, 0], [-.65 - random() * .2, spread], [-.6, -spread]] :
          family < .83 ? [[1, 0], [-.08, spread], [-.75, -.05], [-.1, -spread]] :
          [[.9, .1], [.16, spread], [-.7, spread * .4], [-.76, -spread * .7], [.3, -spread]];
        const top = shape.map(([x, y]) => [x, y, .045]), bottom = shape.map(([x, y]) => [x, y, -.045]);
        const seedData = [(i + random()) / amount, (random() * 2 - 1), random(), .65 + random() * random() * 1.15];
        for (let j = 1; j < shape.length - 1; j++) {
          triangle(top[0], top[j], top[j + 1], seedData, level, [true, j + 1 === shape.length - 1, j === 1]);
          triangle(bottom[0], bottom[j + 1], bottom[j], seedData, level, [true, j === 1, j + 1 === shape.length - 1]);
        }
        for (let j = 0; j < shape.length; j++) { const next = (j + 1) % shape.length; triangle(top[j], bottom[j], top[next], seedData, level, [false, true, true]); triangle(top[next], bottom[j], bottom[next], seedData, level, [true, true, false]); }
      }
    }
    for (let i = 0; i < (compact ? 15 : 30); i++) {
      const sd = [random() * 2.1 - 1.05, random() * 1.7 - .85, .5, 1];
      for (const horizontal of [true, false]) {
        const w = horizontal ? 1 : .13, h = horizontal ? .13 : 1;
        const a = [-w, -h, 0], b = [w, -h, 0], c = [w, h, 0], d = [-w, h, 0];
        triangle(a, b, c, sd, -1); triangle(a, c, d, sd, -1);
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    vertices = data.length / 14;
  }
  function createRenderer() {
    const shaders = [];
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); shaders.push(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Background shader unavailable');
    }
    program = gl.createProgram(); shaders.forEach(shader => gl.attachShader(program, shader)); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Background renderer unavailable');
    shaders.forEach(shader => gl.deleteShader(shader)); buffer = gl.createBuffer();
    attributes = ['aPoint', 'aNormal', 'aBary', 'aSeed', 'aLayer'].map(name => gl.getAttribLocation(program, name));
    for (const name of ['uTime','uAspect','uPointer','uAccent','uLight']) uniforms[name] = gl.getUniformLocation(program, name);
    gl.clearColor(0, 0, 0, 0); gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    compact = scene.clientWidth < 700; createGeometry();
  }
  function readTheme() {
    const value = getComputedStyle(root).getPropertyValue('--accent').trim();
    if (/^#[a-f0-9]{6}$/i.test(value)) accent = [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16) / 255);
    canvas.hidden = excluded(); dirty = true; schedule();
  }
  function updateControls() {
    backdrop.dataset.paused = String(paused());
    if (fallbackControl) {
      fallbackControl.hidden = lost || excluded() || (modelControls && !modelControls.hidden);
      fallbackControl.disabled = quiet();
      fallbackControl.textContent = paused() ? fallbackControl.dataset.play : fallbackControl.dataset.pause;
    }
    dirty = true; last = 0; schedule();
  }
  function fallback() {
    cancelAnimationFrame(raf); raf = 0; delete backdrop.dataset.enhanced; canvas.hidden = true;
    if (fallbackControl) fallbackControl.hidden = true;
  }
  function schedule() {
    if (!raf && !lost && visible && !document.hidden && !excluded()) raf = requestAnimationFrame(frame);
  }
  function frame(now) {
    raf = 0;
    if (lost || !visible || document.hidden || excluded()) { last = 0; return; }
    if (!dirty && last && now - last < 32) { schedule(); return; }
    if (!paused()) elapsed += last ? Math.min((now - last) / 1000, .05) : 1 / 30;
    last = now; dirty = false;
    pointerX += ((paused() ? 0 : targetX) - pointerX) * .08; pointerY += ((paused() ? 0 : targetY) - pointerY) * .08;
    const width = scene.clientWidth, height = scene.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(devicePixelRatio || 1, 1.25, Math.sqrt(1100000 / (width * height)));
    const w = Math.round(width * ratio), h = Math.round(height * ratio);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const nextCompact = width < 700;
    if (nextCompact !== compact) { compact = nextCompact; createGeometry(); }
    gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const sizes = [3, 3, 3, 4, 1], offsets = [0, 3, 6, 9, 13];
    attributes.forEach((attribute, i) => { gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, sizes[i], gl.FLOAT, false, 56, offsets[i] * 4); });
    gl.uniform1f(uniforms.uTime, elapsed); gl.uniform1f(uniforms.uAspect, width / height);
    gl.uniform2f(uniforms.uPointer, pointerX, pointerY); gl.uniform3fv(uniforms.uAccent, accent);
    gl.uniform1f(uniforms.uLight, root.dataset.theme === 'dark' ? 0 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, vertices);
    if (!paused()) schedule();
  }
  try { createRenderer(); backdrop.dataset.enhanced = 'true'; canvas.hidden = forced.matches; readTheme(); updateControls(); } catch { fallback(); return; }
  fallbackControl?.addEventListener('click', () => { ownPaused = !ownPaused; updateControls(); });
  if (model) new MutationObserver(updateControls).observe(model, { attributes: true, attributeFilter: ['data-paused', 'data-enhanced'] });
  if (modelControls) new MutationObserver(updateControls).observe(modelControls, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(readTheme).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-tone', 'data-contrast'] });
  document.addEventListener('alejandro:preferences', updateControls);
  reduced.addEventListener('change', updateControls);
  forced.addEventListener('change', () => { canvas.hidden = excluded(); dirty = true; updateControls(); });
  document.addEventListener('visibilitychange', () => { last = 0; schedule(); });
  new ResizeObserver(() => { dirty = true; schedule(); }).observe(scene);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; last = 0; schedule(); }, { threshold: .01 }).observe(scene);
  scene.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || paused()) return;
    const rect = scene.getBoundingClientRect(); targetX = (event.clientX - rect.left) / rect.width - .5; targetY = .5 - (event.clientY - rect.top) / rect.height;
  }, { passive: true });
  scene.addEventListener('pointerleave', () => { targetX = targetY = 0; });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; fallback(); });
  canvas.addEventListener('webglcontextrestored', () => {
    try { createRenderer(); lost = false; backdrop.dataset.enhanced = 'true'; canvas.hidden = excluded(); last = 0; updateControls(); } catch { fallback(); }
  });
})();
