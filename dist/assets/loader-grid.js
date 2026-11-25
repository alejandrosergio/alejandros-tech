/* Grid Scan Deep · bounded loader adaptation for Alejandro’sTech.
 * React Bits, (c) 2026 David Haz; source commit
 * 4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4, component blob
 * 1dcda3a7c39864e5ff5105041cd92fea5e378f3d, Deep preset blob
 * 6639f8318bb325a664ecf04eede31f95db1b510b. MIT + Commons Clause:
 * /assets/licenses/react-bits.txt; docs/THIRD_PARTY.md.
 * Local accent integration, single-pass glow and lifecycle/resource limits.
 */
(()=>{const t=document.querySelector("[data-loader-grid]");if(!t)return;const p=document.documentElement,x=t.closest("[data-intro-loader]");if(!x)return;const B=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,G=`#version 300 es
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
}`,C=(e,l,r)=>Math.min(r,Math.max(l,e)),R=matchMedia("(prefers-reduced-motion: reduce)"),T=matchMedia("(forced-colors: active)"),i=Object.freeze({cells:10,depth:8,depthFade:.6,shading:.7,reflection:.35,scanDuration:4,scanDelay:1.6,scanWidth:1,trail:.7,glow:.6}),q=2.2;let s=null,d=0,A=0,E=0,v=0,F=0,z=!1,y=!1,L=!1,P=!1,b=!0,w=[1,1,1];t.dataset.state="idle",t.dataset.frames="0";const U=()=>p.dataset.loading==="true",k=()=>U()&&!L&&!document.hidden&&!z&&!y&&!R.matches&&!T.matches&&p.dataset.motion!=="true"&&p.dataset.contrast!=="true";function H(){const e=getComputedStyle(p).getPropertyValue("--accent").trim(),l=/^#([\da-f]{3}|[\da-f]{6})$/i.exec(e);if(l){const r=l[1].length===3?l[1].replace(/./g,c=>c+c):l[1];w=[0,2,4].map(c=>parseInt(r.slice(c,c+2),16)/255)}else{const r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(e);r&&(w=r.slice(1,4).map(c=>C(Number(c)/255,0,1)))}t.dataset.color=e}function W(){const e=t.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"low-power"});if(!e)return null;const l=new Set;let r,c;function I(){if(!e.isContextLost()){for(const a of l)e.deleteShader(a);c&&e.deleteVertexArray(c),r&&e.deleteProgram(r),e.bindVertexArray(null),e.useProgram(null),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT)}l.clear(),r=c=null,t.width=t.height=1}function V(a,n){const o=e.createShader(a);if(!o)throw new Error("Loader shader unavailable");if(l.add(o),e.shaderSource(o,n),e.compileShader(o),!e.getShaderParameter(o,e.COMPILE_STATUS))throw new Error("Loader shader unavailable");return o}const j={};try{const a=V(e.VERTEX_SHADER,B),n=V(e.FRAGMENT_SHADER,G);if(r=e.createProgram(),!r)throw new Error("Loader program unavailable");e.attachShader(r,a),e.attachShader(r,n),e.linkProgram(r);for(const o of l)e.deleteShader(o);if(l.clear(),!e.getProgramParameter(r,e.LINK_STATUS))throw new Error("Loader program unavailable");for(let o=0;o<e.getProgramParameter(r,e.ACTIVE_UNIFORMS);o++){const u=e.getActiveUniform(r,o);u&&(j[u.name.replace(/\[0\]$/,"")]=e.getUniformLocation(r,u.name))}if(c=e.createVertexArray(),!c)throw new Error("Loader geometry unavailable")}catch(a){throw I(),a}const m={width:1,height:1,ratio:1};function X(){const a=x.getBoundingClientRect(),n=Math.max(1,a.width),o=Math.max(1,a.height),u=n<700||matchMedia("(pointer: coarse)").matches,h=Math.min(devicePixelRatio||1,u?1:1.25,Math.sqrt((u?36e4:9e5)/(n*o)));t.width=Math.max(1,Math.floor(n*h)),t.height=Math.max(1,Math.floor(o*h)),m.width=n,m.height=o,m.ratio=t.width/n,t.dataset.quality=u?"compact":"desktop",t.dataset.pixels=String(t.width*t.height)}function $(){const a=j,n=m.width/m.height,o=1/i.cells,u=n/Math.max(1,Math.round(n/o)),S=Math.max(o,Math.round(i.depth/o)*o),h=Math.min(1,v/q),K=Math.max(0,v-q)%(i.scanDuration+i.scanDelay),g=h<1?h:C((K-i.scanDelay)/i.scanDuration,0,1),N=h<1?g*(S+.4)-.2:g*(S+.3)-.15,J=h<1?Math.min(1,g*6)*(1-Math.max(0,g-.85)/.15):Math.min(1,g/.12)*Math.min(1,(1-g)/.12),D=p.dataset.theme==="light",Q=D?w:w.map(Z=>Z+(1-Z)*.65);e.viewport(0,0,t.width,t.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(r),e.bindVertexArray(c),e.uniform1f(a.uAspect,n),e.uniform1f(a.uPixel,1/t.height),e.uniform3f(a.uEye,Math.sin(v*.21)*.025*n,Math.sin(v*.17)*.018,-1.25),e.uniform1f(a.uDepth,S),e.uniform3f(a.uCell,u,o,o),e.uniform1f(a.uThick,m.ratio*.5),e.uniform1f(a.uDot,1.8*m.ratio),e.uniform3f(a.uLineColor,77/255,71/255,87/255),e.uniform3f(a.uScanColor,...w),e.uniform3f(a.uCoreColor,...Q),e.uniform1f(a.uFade,i.depthFade),e.uniform1f(a.uScanZ,N),e.uniform1f(a.uScanDir,1),e.uniform1f(a.uScanAlpha,J),e.uniform1f(a.uScanWidth,.006*i.scanWidth),e.uniform1f(a.uTrail,.04+i.trail*1.1),e.uniform1f(a.uReveal,h<1?N+.05:S+1),e.uniform1f(a.uPoints,1),e.uniform1f(a.uReflect,i.reflection),e.uniform1f(a.uHaze,D?.03:.05),e.uniform1f(a.uShade,i.shading),e.uniform1f(a.uLight,D?1:0),e.uniform1f(a.uGlow,i.glow),e.uniform1f(a.uTime,v),e.drawArrays(e.TRIANGLES,0,3)}return{resize:X,render:$,dispose:I}}function _(){d&&cancelAnimationFrame(d),d=0,t.hidden=!0,delete t.dataset.enhanced,delete x.dataset.gridEnhanced,s?.dispose(),s=null,b=!0}function M(e){if(d=0,!k()){f();return}if(e-E<1e3/30-.5){d=requestAnimationFrame(M);return}const l=C((e-A)/1e3,0,10);A=E=e,v+=l;try{b&&(s.resize(),b=!1),s.render(),t.dataset.frames=String(++F),d=requestAnimationFrame(M)}catch{y=!0,f()}}function f(){const e=U();if(e&&!P&&(v=F=0,t.dataset.frames="0"),P=e,!k()){_(),t.dataset.state=e?y?"fallback":z?"lost":"paused":"finished";return}if(H(),!s){try{s=W()}catch{s=null}if(!s){y=!0,_(),t.dataset.state="fallback";return}}t.hidden=!1,t.dataset.enhanced="true",x.dataset.gridEnhanced="true",t.dataset.state="running",d||(A=E=performance.now(),d=requestAnimationFrame(M))}new MutationObserver(f).observe(p,{attributes:!0,attributeFilter:["data-loading","data-theme","data-tone","data-motion","data-contrast"]}),document.addEventListener("alejandro:preferences",f),document.addEventListener("visibilitychange",f);for(const e of[R,T])e.addEventListener("change",f);const O=()=>{b=!0};window.addEventListener("resize",O,{passive:!0}),"ResizeObserver"in window&&new ResizeObserver(O).observe(x),t.addEventListener("webglcontextlost",e=>{e.preventDefault(),z=!0,f()}),t.addEventListener("webglcontextrestored",()=>{z=y=!1,f()}),window.addEventListener("pagehide",()=>{L=!0,f()}),window.addEventListener("pageshow",()=>{L=!1,f()}),f()})();
