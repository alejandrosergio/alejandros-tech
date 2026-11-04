/* Local, procedural A+ geometry. No models, textures or remote libraries. */
(() => {
  const art = document.querySelector('[data-brand-art]');
  if (!art) return;
  const stage = art.querySelector('[data-brand-stage]');
  const canvas = art.querySelector('[data-brand-canvas]');
  const controls = art.querySelector('[data-art-controls]');
  const motion = art.querySelector('[data-art-motion]');
  const resetButton = art.querySelector('[data-art-reset]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const customReduced = () => document.documentElement?.dataset.motion === 'true';
  const reduceMotion = () => reduced.matches || customReduced();
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
  if (!gl) return; // The original SVG and all page content remain available.

  const TAU = Math.PI * 2;
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const normalize = v => { const n = Math.hypot(...v) || 1; return v.map(x => x / n); };
  const rotation = (x, y, z) => {
    const cx = Math.cos(x), sx = Math.sin(x), cy = Math.cos(y), sy = Math.sin(y), cz = Math.cos(z), sz = Math.sin(z);
    return new Float32Array([cz * cy, sz * cy, -sy, cz * sy * sx - sz * cx, sz * sy * sx + cz * cx, cy * sx, cz * sy * cx + sz * sx, sz * sy * cx - cz * sx, cy * cx]);
  };
  const transform = (p, m) => [m[0] * p[0] + m[3] * p[1] + m[6] * p[2], m[1] * p[0] + m[4] * p[1] + m[7] * p[2], m[2] * p[0] + m[5] * p[1] + m[8] * p[2]];

  // Each vertex stores position, normal, linear colour and emissive strength.
  function triangle(out, a, b, c, color, glow = 0) {
    const u = b.map((v, i) => v - a[i]), v = c.map((v, i) => v - a[i]);
    const n = normalize([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]);
    for (const p of [a, b, c]) out.push(...p, ...n, ...color, glow);
  }
  function inset(points, amount) {
    return points.map((p, i) => {
      const a = points[(i + points.length - 1) % points.length], b = points[(i + 1) % points.length];
      const n1 = normalize([a[1] - p[1], p[0] - a[0]]), n2 = normalize([p[1] - b[1], b[0] - p[0]]);
      const factor = amount / Math.max(.12, 1 + n1[0] * n2[0] + n1[1] * n2[1]);
      return [p[0] + (n1[0] + n2[0]) * factor, p[1] + (n1[1] + n2[1]) * factor];
    });
  }
  function extrude(out, contours, faces, depth, bevel, color, side) {
    const points = contours.flat(), inner = contours.flatMap(c => inset(c, bevel));
    const at = (p, z) => [...p, z];
    for (const [a, b, c] of faces) {
      triangle(out, at(inner[a], depth), at(inner[b], depth), at(inner[c], depth), color);
      triangle(out, at(inner[c], -depth), at(inner[b], -depth), at(inner[a], -depth), side);
    }
    let offset = 0;
    for (const contour of contours) {
      for (let i = 0; i < contour.length; i++) {
        const j = (i + 1) % contour.length, a = points[offset + i], b = points[offset + j], ai = inner[offset + i], bi = inner[offset + j];
        const wall = [at(a, -depth + bevel), at(b, -depth + bevel), at(b, depth - bevel), at(a, depth - bevel)];
        const back = [at(ai, -depth), at(bi, -depth), at(b, -depth + bevel), at(a, -depth + bevel)];
        // Four bevel bands round the metal edge and catch the studio reflections.
        const edge = (p, innerPoint, t) => {
          const angle = t * Math.PI / 2, amount = 1 - Math.cos(angle);
          return [p[0] + (innerPoint[0] - p[0]) * amount, p[1] + (innerPoint[1] - p[1]) * amount, depth - bevel + bevel * Math.sin(angle)];
        };
        for (let band = 0; band < 4; band++) {
          const t = band / 4, next = (band + 1) / 4;
          const quad = [edge(a, ai, t), edge(b, bi, t), edge(b, bi, next), edge(a, ai, next)];
          const tint = color.map((v, k) => v * .78 + side[k] * .22);
          triangle(out, quad[0], quad[1], quad[2], tint);
          triangle(out, quad[0], quad[2], quad[3], tint);
        }
        for (const [quad, tint] of [[wall, side], [back, side]]) {
          triangle(out, quad[0], quad[1], quad[2], tint);
          triangle(out, quad[0], quad[2], quad[3], tint);
        }
      }
      offset += contour.length;
    }
  }
  function ring(out, radius, tube, tilt, color) {
    const matrix = rotation(...tilt), point = (a, b) => transform([(radius + tube * Math.cos(b)) * Math.cos(a), (radius + tube * Math.cos(b)) * Math.sin(a), tube * Math.sin(b)], matrix);
    for (let i = 0; i < 112; i++) for (let j = 0; j < 6; j++) {
      const a = i / 112 * TAU, b = j / 6 * TAU, an = (i + 1) / 112 * TAU, bn = (j + 1) / 6 * TAU;
      triangle(out, point(a, b), point(an, b), point(an, bn), color, .6);
      triangle(out, point(a, b), point(an, bn), point(a, bn), color, .6);
    }
  }
  function sphere(out, center, radius, color, glow = 0) {
    const p = [[radius, 0, 0], [-radius, 0, 0], [0, radius, 0], [0, -radius, 0], [0, 0, radius], [0, 0, -radius]].map(p => p.map((v, i) => v + center[i]));
    for (const [a, b, c] of [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]]) triangle(out, p[a], p[b], p[c], color, glow);
  }

  const emblem = [], orbit = [], stars = [];
  // A with an open lower notch and a true triangular hole, bevelled on both sides.
  const outline = [[-.84, -.83], [-.47, -.83], [-.30, -.39], [.30, -.39], [.47, -.83], [.84, -.83], [.12, .99], [-.12, .99]];
  const hole = [[-.19, -.10], [0, .41], [.19, -.10]];
  extrude(emblem, [outline, hole], [[0, 1, 2], [0, 2, 8], [0, 8, 7], [7, 8, 9], [7, 9, 6], [5, 6, 10], [6, 9, 10], [5, 10, 3], [5, 3, 4], [2, 3, 10], [2, 10, 8]], .21, .045, [.66, .79, .94], [.025, .14, .32]);
  const plus = [[-.075, -.255], [.075, -.255], [.075, -.075], [.255, -.075], [.255, .075], [.075, .075], [.075, .255], [-.075, .255], [-.075, .075], [-.255, .075], [-.255, -.075], [-.075, -.075]].map(([x, y]) => [x + .74, y + .83]);
  extrude(emblem, [plus], [[0, 1, 2], [0, 2, 11], [2, 3, 4], [2, 4, 5], [11, 2, 5], [11, 5, 8], [8, 5, 6], [8, 6, 7], [11, 8, 9], [11, 9, 10]], .14, .023, [.03, .52, .95], [.012, .14, .35]);
  ring(orbit, 1.47, .008, [1.05, .28, -.43], [.035, .35, .68]);
  ring(orbit, 1.63, .004, [.73, -.66, .83], [.12, .30, .58]);
  // Seeded positions keep the scene reproducible, without a particle dependency.
  for (let i = 0; i < 42; i++) {
    const a = i * 2.39996, r = 1.3 + ((i * 37) % 19) / 30;
    sphere(stars, [Math.cos(a) * r, Math.sin(a) * r * .83, Math.sin(i * 4.7) * .65 - .3], i % 7 === 0 ? .016 : .006, [.04, .34, .65], .8);
  }

  const vertexSource = `
    attribute vec3 aPosition; attribute vec3 aNormal; attribute vec3 aColor; attribute float aGlow;
    uniform mat3 uRotation; uniform vec3 uOffset; uniform float uAspect;
    varying vec3 vNormal; varying vec3 vPosition; varying vec3 vColor; varying float vGlow;
    void main() {
      vec3 p = uRotation * aPosition + uOffset;
      vNormal = uRotation * aNormal; vPosition = p; vColor = aColor; vGlow = aGlow;
      gl_Position = vec4(p.x * 2.65 / uAspect, p.y * 2.65, -1.002 * p.z - .2002, -p.z);
    }`;
  const fragmentSource = `
    precision mediump float;
    varying vec3 vNormal; varying vec3 vPosition; varying vec3 vColor; varying float vGlow;
    void main() {
      vec3 n = normalize(vNormal), view = normalize(-vPosition);
      vec3 key = normalize(vec3(-.65, .9, 1.3)), fill = normalize(vec3(1., -.1, .6));
      vec3 reflection = reflect(-view, n);
      float diffuse = .14 + .52 * max(dot(n, key), 0.) + .24 * max(dot(n, fill), 0.);
      float shine = pow(max(dot(reflection, key), 0.), 62.);
      float strip = exp(-pow((reflection.y - .32) / .21, 2.));
      float edge = pow(1. - max(dot(n, view), 0.), 3.);
      vec3 studio = mix(vec3(.015, .07, .18), vec3(.45, .65, .93), smoothstep(-.7, .65, reflection.y));
      studio += vec3(.8, .9, 1.) * strip * .48;
      vec3 color = vColor * diffuse + studio * .38 + vec3(.85, .94, 1.) * shine * 1.8;
      color += vec3(.02, .32, .85) * edge * .8 + vColor * vGlow;
      color = pow(vec3(1.) - exp(-color * 1.45), vec3(.4545));
      gl_FragColor = vec4(color, 1.);
    }`;

  let program, buffers, attributes, uniforms;
  function createRenderer() {
    const shaders = [];
    try {
      for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source); gl.compileShader(shader); shaders.push(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader unavailable');
      }
      program = gl.createProgram();
      shaders.forEach(shader => gl.attachShader(program, shader)); gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Renderer unavailable');
      gl.useProgram(program);
      attributes = ['aPosition', 'aNormal', 'aColor', 'aGlow'].map(name => gl.getAttribLocation(program, name));
      uniforms = ['uRotation', 'uOffset', 'uAspect'].map(name => gl.getUniformLocation(program, name));
      buffers = [emblem, orbit, stars, []].map(vertices => {
        const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return { buffer, count: vertices.length / 10 };
      });
      gl.enable(gl.DEPTH_TEST); gl.clearColor(0, 0, 0, 0);
    } finally { shaders.forEach(shader => gl.deleteShader(shader)); }
  }
  function mesh(index, angles, offset, dynamic) {
    const entry = buffers[index];
    gl.bindBuffer(gl.ARRAY_BUFFER, entry.buffer);
    if (dynamic) { gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dynamic), gl.DYNAMIC_DRAW); entry.count = dynamic.length / 10; }
    attributes.forEach((location, i) => {
      gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, i === 3 ? 1 : 3, gl.FLOAT, false, 40, i * 12);
    });
    gl.uniformMatrix3fv(uniforms[0], false, rotation(...angles)); gl.uniform3fv(uniforms[1], offset);
    gl.drawArrays(gl.TRIANGLES, 0, entry.count);
  }

  let paused = reduceMotion(), visible = true, lost = false, raf = 0, last = 0, elapsed = 0;
  let yaw = .32, pitch = -.12, targetYaw = .32, targetPitch = -.12, hoverX = 0, hoverY = 0, drag = null;
  function updateControl() {
    motion.dataset.paused = String(paused);
    motion.disabled = reduceMotion();
    art.dataset.paused = String(paused);
    motion.querySelector('[data-motion-text]').textContent = paused ? motion.dataset.play : motion.dataset.pause;
  }
  function fallback() {
    cancelAnimationFrame(raf); raf = 0;
    delete art.dataset.enhanced; canvas.hidden = true; controls.hidden = true;
    stage.removeAttribute('tabindex'); stage.removeAttribute('role'); stage.removeAttribute('aria-label'); stage.removeAttribute('aria-describedby');
  }
  function enhance() {
    art.dataset.enhanced = 'true'; canvas.hidden = false; controls.hidden = false;
    stage.tabIndex = 0; stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', stage.dataset.label); stage.setAttribute('aria-describedby', 'brand-3d-help');
    updateControl();
  }
  function schedule() {
    if (!raf && !lost && visible && !document.hidden && !forced.matches) raf = requestAnimationFrame(frame);
  }
  function frame(now) {
    raf = 0;
    if (lost || !visible || document.hidden || forced.matches) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60; last = now;
    if (!paused && !drag) elapsed += dt;
    const blend = reduceMotion() ? 1 : 1 - Math.exp(-dt * 10);
    yaw += (targetYaw - yaw) * blend; pitch += (targetPitch - pitch) * blend;
    const width = stage.clientWidth, height = stage.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(devicePixelRatio || 1, 2, 900 / Math.max(width, height));
    const w = Math.round(width * dpr), h = Math.round(height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program); gl.uniform1f(uniforms[2], width / height);
    const bob = Math.sin(elapsed * .7) * .045;
    mesh(1, [.04 * Math.sin(elapsed * .13), elapsed * .045, 0], [0, 0, -5.25]);
    mesh(2, [0, elapsed * .025, 0], [0, 0, -5.25]);
    mesh(0, [pitch + Math.sin(elapsed * .43) * .045 + hoverY, yaw + Math.sin(elapsed * .35) * .24 + hoverX, -.055], [-.08, bob, -5.05]);
    const sparks = [];
    for (let i = 0; i < 5; i++) {
      const a = elapsed * .25 + i * TAU / 5;
      const point = transform([1.47 * Math.cos(a), 1.47 * Math.sin(a), 0], rotation(1.05, .28, -.43));
      sphere(sparks, point, i === 0 ? .043 : .023, [.06, .55, 1.], 1.2);
    }
    mesh(3, [.04 * Math.sin(elapsed * .13), elapsed * .045, 0], [0, 0, -5.25], sparks);
    if (!paused || Math.abs(yaw - targetYaw) + Math.abs(pitch - targetPitch) > .0005) schedule();
  }
  try { createRenderer(); enhance(); schedule(); } catch { fallback(); return; }

  motion.addEventListener('click', () => { paused = reduceMotion() ? true : !paused; hoverX = hoverY = 0; last = 0; updateControl(); schedule(); });
  const reset = () => { targetYaw = .32; targetPitch = -.12; hoverX = hoverY = 0; elapsed = 0; last = 0; schedule(); };
  resetButton?.addEventListener('click', reset);
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || lost) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: targetYaw, pitch: targetPitch };
    hoverX = hoverY = 0; stage.setPointerCapture(event.pointerId); stage.classList.add('is-dragging');
    stage.focus({ preventScroll: true }); schedule();
  });
  stage.addEventListener('pointermove', event => {
    if (drag && event.pointerId === drag.id) {
      targetYaw = drag.yaw + (event.clientX - drag.x) / stage.clientWidth * 4;
      if (event.pointerType !== 'touch') targetPitch = clamp(drag.pitch + (event.clientY - drag.y) / stage.clientHeight * 2, -.65, .65);
      schedule();
    } else if (event.pointerType === 'mouse' && !paused && !reduceMotion()) {
      const rect = stage.getBoundingClientRect();
      hoverX = ((event.clientX - rect.left) / rect.width - .5) * .24;
      hoverY = ((event.clientY - rect.top) / rect.height - .5) * .12;
      schedule();
    }
  });
  const release = () => { drag = null; stage.classList.remove('is-dragging'); schedule(); };
  stage.addEventListener('pointerup', release); stage.addEventListener('pointercancel', release); stage.addEventListener('lostpointercapture', release);
  stage.addEventListener('pointerleave', () => { hoverX = hoverY = 0; schedule(); });
  stage.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') reset();
    if (event.key === 'ArrowLeft') targetYaw -= .2;
    if (event.key === 'ArrowRight') targetYaw += .2;
    if (event.key === 'ArrowUp') targetPitch = clamp(targetPitch - .15, -.65, .65);
    if (event.key === 'ArrowDown') targetPitch = clamp(targetPitch + .15, -.65, .65);
    schedule();
  });
  let previousReduced = reduceMotion();
  const motionChanged = () => { const next = reduceMotion(); if (next === previousReduced) return; previousReduced = next; paused = next; hoverX = hoverY = 0; updateControl(); schedule(); };
  reduced.addEventListener('change', motionChanged);
  document.addEventListener('alejandro:preferences', motionChanged);
  forced.addEventListener('change', () => { last = 0; schedule(); });
  document.addEventListener('visibilitychange', () => { last = 0; schedule(); });
  new ResizeObserver(schedule).observe(stage);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; last = 0; schedule(); }, { threshold: .05 }).observe(stage);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; release(); fallback(); });
  canvas.addEventListener('webglcontextrestored', () => {
    try { createRenderer(); lost = false; enhance(); last = 0; schedule(); } catch { fallback(); }
  });
})();
