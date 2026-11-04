/* Splash Cursor · contained WebGL fluid adaptation for Alejandro’sTech.
 * Fluid shaders/solver and Smoke preset: React Bits, (c) 2026 David Haz.
 * Upstream commit 4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4;
 * SplashCursor.jsx blob 3a073699c3aa520f99c8c68247edd78bf503e843.
 * MIT + Commons Clause: /assets/licenses/react-bits.txt; docs/THIRD_PARTY.md.
 * Integrated use only. Local lifecycle, bounded quality and site wiring are original.
 */
(() => {
  const canvas = document.querySelector('[data-portrait-hero] > [data-splash-cursor]');
  if (!canvas) return;
  const home = canvas.closest('[data-portrait-hero]'), root = document.documentElement;
  // Official Smoke preset plus the Studio URL’s direct intensity/size overrides.
  const settings = Object.freeze({ color: [228 / 255, 228 / 255, 231 / 255], intensity: .6, size: .5, force: .8, swirl: 18, trail: 2.5, momentum: 1, shading: .4 });
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
`;

const SHADERS = {
  copy: `uniform sampler2D uTexture;
void main() {
  outColor = texture(uTexture, vUv);
}`,
  clear: `uniform sampler2D uTexture;
uniform float value;
void main() {
  outColor = value * texture(uTexture, vUv);
}`,
  splat: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 pointA;
uniform vec2 pointB;
uniform float radius;
void main() {
  vec2 scale = vec2(aspectRatio, 1.0);
  vec2 pa = (vUv - pointA) * scale;
  vec2 ba = (pointB - pointA) * scale;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-9), 0.0, 1.0);
  vec2 d = pa - ba * h;
  vec3 base = texture(uTarget, vUv).xyz;
  outColor = vec4(base + exp(-dot(d, d) / radius) * color, 1.0);
}`,
  burst: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform float strength;
uniform float seed;
void main() {
  vec2 d = (vUv - point) * vec2(aspectRatio, 1.0);
  float distance = length(d);
  vec2 direction = d / max(distance, 0.00001);
  float angle = atan(d.y, d.x);
  float petals = 0.78 + 0.22 * sin(angle * 5.0 + seed) * sin(angle * 3.0 - seed * 1.7);
  vec2 twist = vec2(-direction.y, direction.x) * 0.3 * sin(angle * 4.0 + seed * 2.3);
  float falloff = exp(-dot(d, d) / radius) * distance / sqrt(radius);
  outColor = vec4(texture(uTarget, vUv).xy + (direction * petals + twist) * falloff * strength, 0.0, 1.0);
}`,
  crown: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform vec3 colorA;
uniform vec3 colorB;
uniform float seed;
void main() {
  vec2 d = (vUv - point) * vec2(aspectRatio, 1.0);
  vec3 ink = exp(-dot(d, d) / (radius * 0.45)) * colorA;
  for (int i = 0; i < 7; i++) {
    float index = float(i);
    float angle = seed + index * 0.8975979 + sin(seed * 3.0 + index * 1.9) * 0.35;
    float reach = sqrt(radius) * (0.75 + 0.45 * fract(sin(seed * 7.1 + index * 3.7) * 43.7));
    float drop = radius * (0.08 + 0.12 * fract(sin(seed * 2.9 + index * 5.3) * 31.9));
    vec2 q = d - vec2(cos(angle), sin(angle)) * reach;
    ink += exp(-dot(q, q) / drop) * mix(colorA, colorB, fract(index * 0.37 + 0.2));
  }
  outColor = vec4(texture(uTarget, vUv).xyz + ink, 1.0);
}`,
  advection: `uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  outColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: `uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  outColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  outColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  outColor = vec4(velocity, 0.0, 1.0);
}`,
  display: `uniform sampler2D uTexture;
uniform sampler2D uBloom;
uniform vec2 texelSize;
uniform float shading;
uniform float bloom;
uniform float light;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  if (shading > 0.0) {
    float dx = length(texture(uTexture, vR).rgb) - length(texture(uTexture, vL).rgb);
    float dy = length(texture(uTexture, vT).rgb) - length(texture(uTexture, vB).rgb);
    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
    c *= mix(1.0, clamp(n.z + 0.7, 0.7, 1.0), shading);
  }
  if (bloom > 0.0) {
    c += max(texture(uBloom, vUv).rgb, 0.0) * bloom;
  }
  c = max(c, 0.0);
  float peak = max(c.r, max(c.g, c.b));
  float grain = (hash(gl_FragCoord.xy) - 0.5) / 255.0 * smoothstep(0.0, 0.03, peak);
  if (light > 0.5) {
    vec3 transmit = exp(-2.4 * c);
    float low = min(transmit.r, min(transmit.g, transmit.b));
    float alpha = clamp(1.0 - low + grain, 0.0, 1.0);
    outColor = vec4(min(transmit - low, vec3(alpha)), alpha);
  } else {
    c = max(c + grain, 0.0);
    float alpha = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
    outColor = vec4(min(c, vec3(alpha)), alpha);
  }
}`
};


  function createFluid() {
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl) return null;
    gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('EXT_color_buffer_half_float');
    const linear = Boolean(gl.getExtension('OES_texture_float_linear'));
    const renderable = (internal, format) => {
      const texture = gl.createTexture(), fbo = gl.createFramebuffer();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, gl.HALF_FLOAT, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.deleteFramebuffer(fbo); gl.deleteTexture(texture);
      return complete;
    };
    const rgba = { internal: gl.RGBA16F, format: gl.RGBA };
    if (!renderable(rgba.internal, rgba.format)) return null;
    const rg = renderable(gl.RG16F, gl.RG) ? { internal: gl.RG16F, format: gl.RG } : rgba;
    const r = renderable(gl.R16F, gl.RED) ? { internal: gl.R16F, format: gl.RED } : rg;
    const targets = new Set(), programs = {}, shaders = new Set();
    let buffer, vao;
    function release() {
      if (!gl.isContextLost()) {
        targets.forEach(target => { gl.deleteFramebuffer(target.fbo); gl.deleteTexture(target.texture); });
        Object.values(programs).forEach(item => gl.deleteProgram(item.program));
        shaders.forEach(shader => gl.deleteShader(shader));
        if (buffer) gl.deleteBuffer(buffer);
        if (vao) gl.deleteVertexArray(vao);
      }
      targets.clear(); shaders.clear();
    }
    const compile = (type, source) => {
      const shader = gl.createShader(type); shaders.add(shader);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Fluid shader unavailable');
      return shader;
    };
    try {
      const vertex = compile(gl.VERTEX_SHADER, VERTEX);
      for (const [name, body] of Object.entries(SHADERS)) {
        const fragment = compile(gl.FRAGMENT_SHADER, HEADER + body), program = gl.createProgram();
        programs[name] = { program, uniforms: {} };
        gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.bindAttribLocation(program, 0, 'aPosition'); gl.linkProgram(program);
        gl.deleteShader(fragment); shaders.delete(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Fluid program unavailable');
        const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let index = 0; index < count; index++) {
          const info = gl.getActiveUniform(program, index);
          if (info) programs[name].uniforms[info.name] = gl.getUniformLocation(program, info.name);
        }
      }
      gl.deleteShader(vertex); shaders.delete(vertex);
      buffer = gl.createBuffer(); vao = gl.createVertexArray(); gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    } catch (error) { release(); throw error; }
    const use = name => {
      const item = programs[name];
      gl.useProgram(item.program);
      return item.uniforms;
    };

    const blit = target => {
      if (target) {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const createTarget = (width, height, format, filter) => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, format.internal, width, height, 0, format.format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const target = {
        texture,
        fbo,
        width,
        height,
        texelX: 1 / width,
        texelY: 1 / height,
        attach: unit => {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return unit;
        }
      };
      targets.add(target);
      return target;
    };

    const destroyTarget = target => {
      if (!target) return;
      gl.deleteFramebuffer(target.fbo);
      gl.deleteTexture(target.texture);
      targets.delete(target);
    };

    const reshape = (target, width, height, format) => {
      gl.bindTexture(gl.TEXTURE_2D, target.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, format.internal, width, height, 0, format.format, gl.HALF_FLOAT, null);
      target.width = width;
      target.height = height;
      target.texelX = 1 / width;
      target.texelY = 1 / height;
    };

    const createDouble = (width, height, format, filter) => {
      const pair = {
        read: createTarget(width, height, format, filter),
        write: createTarget(width, height, format, filter),
        width,
        height,
        texelX: 1 / width,
        texelY: 1 / height,
        swap: () => {
          const current = pair.read;
          pair.read = pair.write;
          pair.write = current;
        }
      };
      return pair;
    };

    const resizeDouble = (pair, width, height, format, filter, keep) => {
      if (keep) {
        const next = createTarget(width, height, format, filter);
        const u = use('copy');
        gl.uniform1i(u.uTexture, pair.read.attach(0));
        blit(next);
        destroyTarget(pair.read);
        pair.read = next;
      } else {
        reshape(pair.read, width, height, format);
      }
      reshape(pair.write, width, height, format);
      pair.width = width;
      pair.height = height;
      pair.texelX = 1 / width;
      pair.texelY = 1 / height;
    };


    // Resolution is bounded by area as well as short edge: ultrawide and zoomed
    // layouts cannot allocate an unbounded long-side texture.
    const compact = () => canvas.getBoundingClientRect().width < 700 || matchMedia('(pointer: coarse)').matches;
    let quality, dye, velocity, pressure, divergence, curl;
    function fit() {
      const box = canvas.getBoundingClientRect(), width = Math.max(1, box.width), height = Math.max(1, box.height), small = compact();
      const pixelBudget = small ? 420000 : 960000;
      const ratio = Math.min(devicePixelRatio || 1, small ? 1 : 1.25, Math.sqrt(pixelBudget / (width * height)));
      canvas.width = Math.max(1, Math.floor(width * ratio)); canvas.height = Math.max(1, Math.floor(height * ratio));
      quality = small ? { sim: 64, dye: 256, iterations: 10, area: 160000 } : { sim: 96, dye: 512, iterations: 16, area: 480000 };
      const aspect = canvas.width / canvas.height;
      const resolution = (short, area) => {
        const base = Math.min(short, Math.sqrt(area / Math.max(aspect, 1 / aspect)));
        return aspect > 1 ? { width: Math.max(1, Math.floor(base * aspect)), height: Math.max(1, Math.floor(base)) } : { width: Math.max(1, Math.floor(base)), height: Math.max(1, Math.floor(base / aspect)) };
      };
      return { sim: resolution(quality.sim, 40000), ink: resolution(quality.dye, quality.area) };
    }
    const filter = linear ? gl.LINEAR : gl.NEAREST;
    function resize() {
      const next = fit();
      if (!dye) {
        dye = createDouble(next.ink.width, next.ink.height, rgba, filter);
        velocity = createDouble(next.sim.width, next.sim.height, rg, filter);
        pressure = createDouble(next.sim.width, next.sim.height, r, gl.NEAREST);
        divergence = createTarget(next.sim.width, next.sim.height, r, gl.NEAREST);
        curl = createTarget(next.sim.width, next.sim.height, r, gl.NEAREST);
      } else {
        if (dye.width !== next.ink.width || dye.height !== next.ink.height) resizeDouble(dye, next.ink.width, next.ink.height, rgba, filter, false);
        if (velocity.width !== next.sim.width || velocity.height !== next.sim.height) {
          resizeDouble(velocity, next.sim.width, next.sim.height, rg, filter, false);
          resizeDouble(pressure, next.sim.width, next.sim.height, r, gl.NEAREST, false);
          reshape(divergence, next.sim.width, next.sim.height, r); reshape(curl, next.sim.width, next.sim.height, r);
        }
      }
      canvas.dataset.simulation = velocity.width + 'x' + velocity.height;
      canvas.dataset.dye = dye.width + 'x' + dye.height;
      canvas.dataset.quality = compact() ? 'compact' : 'desktop';
    }
    const radiusFor = scale => {
      const aspect = canvas.width / canvas.height;
      return ((0.2 * settings.size * scale) / 100) * (aspect > 1 ? aspect : 1);
    };

    const splat = (ax, ay, bx, by, vx, vy, color, radius) => {
      const u = use('splat');
      gl.uniform1i(u.uTarget, velocity.read.attach(0));
      gl.uniform1f(u.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(u.pointA, ax, ay);
      gl.uniform2f(u.pointB, bx, by);
      gl.uniform3f(u.color, vx, vy, 0);
      gl.uniform1f(u.radius, radius);
      blit(velocity.write);
      velocity.swap();
      gl.uniform1i(u.uTarget, dye.read.attach(0));
      gl.uniform3f(u.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    };

    const colorAt = () => settings.color;
    const inkFor = (color, amount) => color.map(channel => channel * amount);

    const flush = (pointer, dt, now) => {
      const s = settings;
      const aspect = canvas.width / canvas.height;
      const length = Math.hypot((pointer.x - pointer.px) * aspect, pointer.y - pointer.py);
      if (length > 0.35) {
        pointer.px = pointer.x;
        pointer.py = pointer.y;
        return;
      }
      let dx = pointer.x - pointer.px;
      let dy = pointer.y - pointer.py;
      if (aspect < 1) dx *= aspect;
      else dy /= aspect;
      const radius = radiusFor(1);
      const spread = 1 + length / (1.77 * Math.sqrt(radius));
      const push = (6000 * s.force) / Math.sqrt(spread);
      const amount = (0.15 * s.intensity * Math.min(dt * 60, 1)) / Math.sqrt(spread);
      const color = inkFor(colorAt(pointer.offset, now), amount);
      splat(pointer.px, pointer.py, pointer.x, pointer.y, dx * push, dy * push, color, radius);
      pointer.px = pointer.x;
      pointer.py = pointer.y;
    };

    const burst = (x, y, now) => {
      const s = settings;
      const seed = Math.random() * Math.PI * 2;
      const aspect = canvas.width / canvas.height;
      let u = use('burst');
      gl.uniform1i(u.uTarget, velocity.read.attach(0));
      gl.uniform1f(u.aspectRatio, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform1f(u.radius, radiusFor(3));
      gl.uniform1f(u.strength, 1100 * s.force);
      gl.uniform1f(u.seed, seed);
      blit(velocity.write);
      velocity.swap();
      const offset = Math.random();
      const amount = 1.6 * s.intensity;
      const first = inkFor(colorAt(offset, now), amount);
      const second = inkFor(colorAt(offset + 0.3, now), amount);
      u = use('crown');
      gl.uniform1i(u.uTarget, dye.read.attach(0));
      gl.uniform1f(u.aspectRatio, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform1f(u.radius, radiusFor(1.6));
      gl.uniform3f(u.colorA, first[0], first[1], first[2]);
      gl.uniform3f(u.colorB, second[0], second[1], second[2]);
      gl.uniform1f(u.seed, seed);
      blit(dye.write);
      dye.swap();
    };

    const step = dt => {
      const s = settings;
      const iterations = quality.iterations;
      gl.disable(gl.BLEND);

      let u = use('curl');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      blit(curl);

      u = use('vorticity');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uCurl, curl.attach(1));
      gl.uniform1f(u.curl, s.swirl);
      gl.uniform1f(u.dt, dt);
      blit(velocity.write);
      velocity.swap();

      u = use('divergence');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      blit(divergence);

      u = use('clear');
      gl.uniform1i(u.uTexture, pressure.read.attach(0));
      gl.uniform1f(u.value, 0.1);
      blit(pressure.write);
      pressure.swap();

      u = use('pressure');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uDivergence, divergence.attach(0));
      for (let i = 0; i < iterations; i++) {
        gl.uniform1i(u.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      u = use('gradient');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uPressure, pressure.read.attach(0));
      gl.uniform1i(u.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      u = use('advection');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uSource, velocity.read.attach(0));
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, 2 / s.momentum);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uSource, dye.read.attach(1));
      gl.uniform1f(u.dissipation, 3.5 / s.trail);
      blit(dye.write);
      dye.swap();
    };


    function clear() {
      gl.clearColor(0, 0, 0, 0);
      for (const target of targets) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); gl.clear(gl.COLOR_BUFFER_BIT); }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.clear(gl.COLOR_BUFFER_BIT);
    }
    function render() {
      gl.disable(gl.BLEND);
      const u = use('display');
      gl.uniform2f(u.texelSize, 1 / canvas.width, 1 / canvas.height);
      gl.uniform1i(u.uTexture, dye.read.attach(0)); gl.uniform1i(u.uBloom, dye.read.attach(1));
      gl.uniform1f(u.shading, settings.shading); gl.uniform1f(u.bloom, 0); gl.uniform1f(u.light, 0);
      blit(null);
    }
    try { resize(); clear(); } catch (error) { release(); throw error; }
    return { resize, flush, burst, step, render, clear, dispose: release };
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), forced = matchMedia('(forced-colors: active)');
  const background = document.querySelector('[data-letter-glitch]');
  const pointers = new Map(), bursts = [];
  const introPointer = { x: 0, y: 0, px: 0, py: 0, ready: false, offset: 0 };
  let fluid = null, raf = 0, last = 0, lastDraw = 0, lastActivity = 0, frames = 0, introStart = -1;
  let paused = background?.dataset.paused === 'true', lost = false, failed = false, visible = true, suspended = false, needsResize = false, introConsumed = false;
  canvas.dataset.frames = '0'; canvas.dataset.state = 'idle';
  const blocked = () => paused || suspended || lost || failed || !visible || document.hidden || reduced.matches || forced.matches || root.dataset.motion === 'true' || root.dataset.contrast === 'true' || root.dataset.loading === 'true' || Boolean(document.querySelector('dialog[open]'));
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; introStart = -1; pointers.clear(); bursts.length = 0;
    if (fluid && !lost) fluid.clear();
  }
  function ensure() {
    if (fluid) return true;
    try { fluid = createFluid(); } catch { fluid = null; }
    if (!fluid) { failed = true; canvas.dataset.state = 'unsupported'; delete canvas.dataset.enhanced; canvas.hidden = true; return false; }
    canvas.dataset.enhanced = 'true'; return true;
  }
  function locate(event) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = (event.clientX - rect.left) / rect.width, y = 1 - (event.clientY - rect.top) / rect.height;
    return x < 0 || x > 1 || y < 0 || y > 1 ? null : { x, y };
  }
  function wake() {
    if (blocked() || !ensure()) return;
    lastActivity = performance.now();
    canvas.hidden = false; canvas.dataset.state = 'running';
    if (!raf) { last = lastDraw = performance.now(); raf = requestAnimationFrame(frame); }
  }
  function frame(now) {
    raf = 0;
    if (blocked()) { sync(); return; }
    // Render at most 30 times per second; no idle loop remains after the tail.
    if (now - lastDraw < 1000 / 30 - .5) { raf = requestAnimationFrame(frame); return; }
    const dt = clamp((now - last) / 1000, 0, 1 / 30); last = lastDraw = now;
    if (needsResize) { fluid.resize(); needsResize = false; }
    if (introStart >= 0) {
      const t = clamp((now - introStart) / 1100, 0, 1), eased = t * t * (3 - 2 * t);
      const x = .2 + .6 * eased, y = .5 + .12 * Math.sin(eased * Math.PI * 2);
      if (!introPointer.ready) { introPointer.x = introPointer.px = x; introPointer.y = introPointer.py = y; introPointer.ready = true; }
      else if (now >= introStart) { introPointer.x = x; introPointer.y = y; fluid.flush(introPointer, dt, now); }
      if (t >= 1) introStart = -1;
      lastActivity = now;
    }
    for (const pointer of pointers.values()) if (pointer.moved) { pointer.moved = false; fluid.flush(pointer, dt, now); }
    for (const point of bursts.splice(0)) fluid.burst(point.x, point.y, now);
    fluid.step(dt); fluid.render(); canvas.dataset.frames = String(++frames);
    if (introStart >= 0 || now - lastActivity < 5900) raf = requestAnimationFrame(frame);
    else { fluid.clear(); pointers.clear(); canvas.dataset.state = 'idle'; }
  }
  function sync() {
    if (blocked()) {
      stop(); canvas.hidden = true;
      canvas.dataset.state = lost ? 'lost' : failed ? 'unsupported' : 'paused';
      return;
    }
    if (!ensure()) return;
    canvas.hidden = false;
    if (needsResize) { fluid.resize(); needsResize = false; }
    if (!introConsumed) {
      // The official one-shot sweep starts only after the site's loader, in view.
      introConsumed = true; introPointer.ready = false; introStart = performance.now() + 150; wake();
    } else if (!raf) canvas.dataset.state = 'idle';
  }
  function track(event) {
    if (blocked()) return;
    if (event.pointerType === 'touch' && !pointers.has(event.pointerId)) return;
    const point = locate(event);
    if (!point) { pointers.delete(event.pointerId); return; }
    let pointer = pointers.get(event.pointerId);
    if (!pointer) {
      if (pointers.size >= 2) return;
      pointer = { x: point.x, y: point.y, px: point.x, py: point.y, offset: 0, moved: false };
      pointers.set(event.pointerId, pointer); return;
    }
    if (point.x === pointer.x && point.y === pointer.y) return;
    pointer.x = point.x; pointer.y = point.y; pointer.moved = true; wake();
  }
  home.addEventListener('pointermove', track, { passive: true });
  home.addEventListener('pointerdown', event => {
    if (blocked() || event.target.closest('a, button, input, textarea, select, summary, [role="button"]')) return;
    const point = locate(event); if (!point) return;
    if (!pointers.has(event.pointerId) && pointers.size < 2) pointers.set(event.pointerId, { ...point, px: point.x, py: point.y, offset: 0, moved: false });
    if (bursts.length < 2) bursts.push(point);
    wake();
  }, { passive: true });
  for (const name of ['pointerup', 'pointercancel']) window.addEventListener(name, event => { if (event.pointerType === 'touch') pointers.delete(event.pointerId); }, { passive: true });
  home.addEventListener('pointerleave', () => pointers.clear(), { passive: true });
  window.addEventListener('scroll', () => pointers.clear(), { passive: true });
  document.addEventListener('alejandro:background-motion', event => { if (typeof event.detail?.paused === 'boolean') { paused = event.detail.paused; sync(); } });
  document.addEventListener('alejandro:preferences', sync); document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-contrast', 'data-loading'] });
  if (background) new MutationObserver(() => { paused = background.dataset.paused === 'true'; sync(); }).observe(background, { attributes: true, attributeFilter: ['data-paused'] });
  for (const dialog of document.querySelectorAll('dialog')) {
    new MutationObserver(sync).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    dialog.addEventListener('close', sync);
  }
  for (const media of [reduced, forced]) media.addEventListener('change', sync);
  const resized = () => { needsResize = true; if (!blocked() && fluid && !raf) { fluid.resize(); needsResize = false; } };
  window.addEventListener('resize', resized, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(resized).observe(home);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .05 }).observe(home);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); lost = true; stop(); fluid?.dispose(); fluid = null; delete canvas.dataset.enhanced; sync();
  });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; failed = false; needsResize = false; sync(); });
  window.addEventListener('pagehide', () => { suspended = true; stop(); fluid?.dispose(); fluid = null; delete canvas.dataset.enhanced; });
  window.addEventListener('pageshow', () => { suspended = false; sync(); });
  const box = home.getBoundingClientRect();
  visible = box.bottom > 0 && box.top < innerHeight;
  sync();
})();

