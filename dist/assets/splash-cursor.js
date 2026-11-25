/* Splash Cursor · contained WebGL fluid adaptation for Alejandro’sTech.
 * Fluid shaders/solver and Smoke preset: React Bits, (c) 2026 David Haz.
 * Upstream commit 4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4;
 * SplashCursor.jsx blob 3a073699c3aa520f99c8c68247edd78bf503e843.
 * MIT + Commons Clause: /assets/licenses/react-bits.txt; docs/THIRD_PARTY.md.
 * Integrated use only. Local lifecycle, bounded quality and site wiring are original.
 */
(()=>{const i=document.querySelector("[data-portrait-hero] > [data-splash-cursor]");if(!i)return;const L=i.closest("[data-portrait-hero]"),O=document.documentElement,M=Object.freeze({color:[228/255,228/255,231/255],intensity:.6,size:.5,force:.8,swirl:18,trail:2.5,momentum:1,shading:.4}),ce=(e,l,c)=>Math.min(c,Math.max(l,e)),Re=`#version 300 es
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
}`,be=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
`,we={copy:`uniform sampler2D uTexture;
void main() {
  outColor = texture(uTexture, vUv);
}`,clear:`uniform sampler2D uTexture;
uniform float value;
void main() {
  outColor = value * texture(uTexture, vUv);
}`,splat:`uniform sampler2D uTarget;
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
}`,burst:`uniform sampler2D uTarget;
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
}`,crown:`uniform sampler2D uTarget;
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
}`,advection:`uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  outColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,divergence:`uniform sampler2D uVelocity;
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
}`,curl:`uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,vorticity:`uniform sampler2D uVelocity;
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
}`,pressure:`uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  outColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`,gradient:`uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  outColor = vec4(velocity, 0.0, 1.0);
}`,display:`uniform sampler2D uTexture;
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
}`};function Fe(){const e=i.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1});if(!e)return null;e.getExtension("EXT_color_buffer_float"),e.getExtension("EXT_color_buffer_half_float");const l=!!e.getExtension("OES_texture_float_linear"),c=(t,a)=>{const o=e.createTexture(),r=e.createFramebuffer();e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,t,4,4,0,a,e.HALF_FLOAT,null),e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0);const n=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(r),e.deleteTexture(o),n},T={internal:e.RGBA16F,format:e.RGBA};if(!c(T.internal,T.format))return null;const D=c(e.RG16F,e.RG)?{internal:e.RG16F,format:e.RG}:T,w=c(e.R16F,e.RED)?{internal:e.R16F,format:e.RED}:D,C=new Set,k={},P=new Set;let N,Y;function ie(){e.isContextLost()||(C.forEach(t=>{e.deleteFramebuffer(t.fbo),e.deleteTexture(t.texture)}),Object.values(k).forEach(t=>e.deleteProgram(t.program)),P.forEach(t=>e.deleteShader(t)),N&&e.deleteBuffer(N),Y&&e.deleteVertexArray(Y)),C.clear(),P.clear()}const ge=(t,a)=>{const o=e.createShader(t);if(P.add(o),e.shaderSource(o,a),e.compileShader(o),!e.getShaderParameter(o,e.COMPILE_STATUS))throw new Error("Fluid shader unavailable");return o};try{const t=ge(e.VERTEX_SHADER,Re);for(const[a,o]of Object.entries(we)){const r=ge(e.FRAGMENT_SHADER,be+o),n=e.createProgram();if(k[a]={program:n,uniforms:{}},e.attachShader(n,t),e.attachShader(n,r),e.bindAttribLocation(n,0,"aPosition"),e.linkProgram(n),e.deleteShader(r),P.delete(r),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error("Fluid program unavailable");const d=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let u=0;u<d;u++){const m=e.getActiveUniform(n,u);m&&(k[a].uniforms[m.name]=e.getUniformLocation(n,m.name))}}e.deleteShader(t),P.delete(t),N=e.createBuffer(),Y=e.createVertexArray(),e.bindVertexArray(Y),e.bindBuffer(e.ARRAY_BUFFER,N),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0)}catch(t){throw ie(),t}const E=t=>{const a=k[t];return e.useProgram(a.program),a.uniforms},g=t=>{t?(e.viewport(0,0,t.width,t.height),e.bindFramebuffer(e.FRAMEBUFFER,t.fbo)):(e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.bindFramebuffer(e.FRAMEBUFFER,null)),e.drawArrays(e.TRIANGLE_STRIP,0,4)},z=(t,a,o,r)=>{e.activeTexture(e.TEXTURE0);const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,o.internal,t,a,0,o.format,e.HALF_FLOAT,null);const d=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,d),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.viewport(0,0,t,a),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT);const u={texture:n,fbo:d,width:t,height:a,texelX:1/t,texelY:1/a,attach:m=>(e.activeTexture(e.TEXTURE0+m),e.bindTexture(e.TEXTURE_2D,n),m)};return C.add(u),u},Ue=t=>{t&&(e.deleteFramebuffer(t.fbo),e.deleteTexture(t.texture),C.delete(t))},H=(t,a,o,r)=>{e.bindTexture(e.TEXTURE_2D,t.texture),e.texImage2D(e.TEXTURE_2D,0,r.internal,a,o,0,r.format,e.HALF_FLOAT,null),t.width=a,t.height=o,t.texelX=1/a,t.texelY=1/o},oe=(t,a,o,r)=>{const n={read:z(t,a,o,r),write:z(t,a,o,r),width:t,height:a,texelX:1/t,texelY:1/a,swap:()=>{const d=n.read;n.read=n.write,n.write=d}};return n},ne=(t,a,o,r,n,d)=>{if(d){const u=z(a,o,r,n),m=E("copy");e.uniform1i(m.uTexture,t.read.attach(0)),g(u),Ue(t.read),t.read=u}else H(t.read,a,o,r);H(t.write,a,o,r),t.width=a,t.height=o,t.texelX=1/a,t.texelY=1/o},Te=()=>i.getBoundingClientRect().width<700||matchMedia("(pointer: coarse)").matches;let X,v,s,F,G,j;function Le(){const t=i.getBoundingClientRect(),a=Math.max(1,t.width),o=Math.max(1,t.height),r=Te(),d=Math.min(devicePixelRatio||1,r?1:1.25,Math.sqrt((r?42e4:96e4)/(a*o)));i.width=Math.max(1,Math.floor(a*d)),i.height=Math.max(1,Math.floor(o*d)),X=r?{sim:64,dye:256,iterations:10,area:16e4}:{sim:96,dye:512,iterations:16,area:48e4};const u=i.width/i.height,m=(x,A)=>{const y=Math.min(x,Math.sqrt(A/Math.max(u,1/u)));return u>1?{width:Math.max(1,Math.floor(y*u)),height:Math.max(1,Math.floor(y))}:{width:Math.max(1,Math.floor(y)),height:Math.max(1,Math.floor(y/u))}};return{sim:m(X.sim,4e4),ink:m(X.dye,X.area)}}const W=l?e.LINEAR:e.NEAREST;function Ee(){const t=Le();v?((v.width!==t.ink.width||v.height!==t.ink.height)&&ne(v,t.ink.width,t.ink.height,T,W,!1),(s.width!==t.sim.width||s.height!==t.sim.height)&&(ne(s,t.sim.width,t.sim.height,D,W,!1),ne(F,t.sim.width,t.sim.height,w,e.NEAREST,!1),H(G,t.sim.width,t.sim.height,w),H(j,t.sim.width,t.sim.height,w))):(v=oe(t.ink.width,t.ink.height,T,W),s=oe(t.sim.width,t.sim.height,D,W),F=oe(t.sim.width,t.sim.height,w,e.NEAREST),G=z(t.sim.width,t.sim.height,w,e.NEAREST),j=z(t.sim.width,t.sim.height,w,e.NEAREST)),i.dataset.simulation=s.width+"x"+s.height,i.dataset.dye=v.width+"x"+v.height,i.dataset.quality=Te()?"compact":"desktop"}const se=t=>{const a=i.width/i.height;return .2*M.size*t/100*(a>1?a:1)},Me=(t,a,o,r,n,d,u,m)=>{const x=E("splat");e.uniform1i(x.uTarget,s.read.attach(0)),e.uniform1f(x.aspectRatio,i.width/i.height),e.uniform2f(x.pointA,t,a),e.uniform2f(x.pointB,o,r),e.uniform3f(x.color,n,d,0),e.uniform1f(x.radius,m),g(s.write),s.swap(),e.uniform1i(x.uTarget,v.read.attach(0)),e.uniform3f(x.color,u[0],u[1],u[2]),g(v.write),v.swap()},ue=()=>M.color,le=(t,a)=>t.map(o=>o*a),_e=(t,a,o)=>{const r=M,n=i.width/i.height,d=Math.hypot((t.x-t.px)*n,t.y-t.py);if(d>.35){t.px=t.x,t.py=t.y;return}let u=t.x-t.px,m=t.y-t.py;n<1?u*=n:m/=n;const x=se(1),A=1+d/(1.77*Math.sqrt(x)),y=6e3*r.force/Math.sqrt(A),Pe=.15*r.intensity*Math.min(a*60,1)/Math.sqrt(A),ze=le(ue(t.offset,o),Pe);Me(t.px,t.py,t.x,t.y,u*y,m*y,ze,x),t.px=t.x,t.py=t.y},De=(t,a,o)=>{const r=M,n=Math.random()*Math.PI*2,d=i.width/i.height;let u=E("burst");e.uniform1i(u.uTarget,s.read.attach(0)),e.uniform1f(u.aspectRatio,d),e.uniform2f(u.point,t,a),e.uniform1f(u.radius,se(3)),e.uniform1f(u.strength,1100*r.force),e.uniform1f(u.seed,n),g(s.write),s.swap();const m=Math.random(),x=1.6*r.intensity,A=le(ue(m,o),x),y=le(ue(m+.3,o),x);u=E("crown"),e.uniform1i(u.uTarget,v.read.attach(0)),e.uniform1f(u.aspectRatio,d),e.uniform2f(u.point,t,a),e.uniform1f(u.radius,se(1.6)),e.uniform3f(u.colorA,A[0],A[1],A[2]),e.uniform3f(u.colorB,y[0],y[1],y[2]),e.uniform1f(u.seed,n),g(v.write),v.swap()},Se=t=>{const a=M,o=X.iterations;e.disable(e.BLEND);let r=E("curl");e.uniform2f(r.texelSize,s.texelX,s.texelY),e.uniform1i(r.uVelocity,s.read.attach(0)),g(j),r=E("vorticity"),e.uniform2f(r.texelSize,s.texelX,s.texelY),e.uniform1i(r.uVelocity,s.read.attach(0)),e.uniform1i(r.uCurl,j.attach(1)),e.uniform1f(r.curl,a.swirl),e.uniform1f(r.dt,t),g(s.write),s.swap(),r=E("divergence"),e.uniform2f(r.texelSize,s.texelX,s.texelY),e.uniform1i(r.uVelocity,s.read.attach(0)),g(G),r=E("clear"),e.uniform1i(r.uTexture,F.read.attach(0)),e.uniform1f(r.value,.1),g(F.write),F.swap(),r=E("pressure"),e.uniform2f(r.texelSize,s.texelX,s.texelY),e.uniform1i(r.uDivergence,G.attach(0));for(let n=0;n<o;n++)e.uniform1i(r.uPressure,F.read.attach(1)),g(F.write),F.swap();r=E("gradient"),e.uniform2f(r.texelSize,s.texelX,s.texelY),e.uniform1i(r.uPressure,F.read.attach(0)),e.uniform1i(r.uVelocity,s.read.attach(1)),g(s.write),s.swap(),r=E("advection"),e.uniform2f(r.texelSize,s.texelX,s.texelY),e.uniform1i(r.uVelocity,s.read.attach(0)),e.uniform1i(r.uSource,s.read.attach(0)),e.uniform1f(r.dt,t),e.uniform1f(r.dissipation,2/a.momentum),g(s.write),s.swap(),e.uniform1i(r.uVelocity,s.read.attach(0)),e.uniform1i(r.uSource,v.read.attach(1)),e.uniform1f(r.dissipation,3.5/a.trail),g(v.write),v.swap()};function ye(){e.clearColor(0,0,0,0);for(const t of C)e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.clear(e.COLOR_BUFFER_BIT);e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.clear(e.COLOR_BUFFER_BIT)}function Ce(){e.disable(e.BLEND);const t=E("display");e.uniform2f(t.texelSize,1/i.width,1/i.height),e.uniform1i(t.uTexture,v.read.attach(0)),e.uniform1i(t.uBloom,v.read.attach(1)),e.uniform1f(t.shading,M.shading),e.uniform1f(t.bloom,0),e.uniform1f(t.light,0),g(null)}try{Ee(),ye()}catch(t){throw ie(),t}return{resize:Ee,flush:_e,burst:De,step:Se,render:Ce,clear:ye,dispose:ie}}const fe=matchMedia("(prefers-reduced-motion: reduce)"),de=matchMedia("(forced-colors: active)"),V=document.querySelector("[data-letter-glitch]"),h=new Map,I=[],R={x:0,y:0,px:0,py:0,ready:!1,offset:0};let f=null,b=0,K=0,J=0,Q=0,Ae=0,B=-1,Z=V?.dataset.paused==="true",S=!1,q=!1,$=!0,ee=!1,U=!1,me=!1;i.dataset.frames="0",i.dataset.state="idle";const _=()=>Z||ee||S||q||!$||document.hidden||fe.matches||de.matches||O.dataset.motion==="true"||O.dataset.contrast==="true"||O.dataset.loading==="true"||!!document.querySelector("dialog[open]");function te(){b&&cancelAnimationFrame(b),b=0,B=-1,h.clear(),I.length=0,f&&!S&&f.clear()}function ve(){if(f)return!0;try{f=Fe()}catch{f=null}return f?(i.dataset.enhanced="true",!0):(q=!0,i.dataset.state="unsupported",delete i.dataset.enhanced,i.hidden=!0,!1)}function xe(e){const l=i.getBoundingClientRect();if(!l.width||!l.height)return null;const c=(e.clientX-l.left)/l.width,T=1-(e.clientY-l.top)/l.height;return c<0||c>1||T<0||T>1?null:{x:c,y:T}}function re(){_()||!ve()||(Q=performance.now(),i.hidden=!1,i.dataset.state="running",b||(K=J=performance.now(),b=requestAnimationFrame(ae)))}function ae(e){if(b=0,_()){p();return}if(e-J<1e3/30-.5){b=requestAnimationFrame(ae);return}const l=ce((e-K)/1e3,0,1/30);if(K=J=e,U&&(f.resize(),U=!1),B>=0){const c=ce((e-B)/1100,0,1),T=c*c*(3-2*c),D=.2+.6*T,w=.5+.12*Math.sin(T*Math.PI*2);R.ready?e>=B&&(R.x=D,R.y=w,f.flush(R,l,e)):(R.x=R.px=D,R.y=R.py=w,R.ready=!0),c>=1&&(B=-1),Q=e}for(const c of h.values())c.moved&&(c.moved=!1,f.flush(c,l,e));for(const c of I.splice(0))f.burst(c.x,c.y,e);f.step(l),f.render(),i.dataset.frames=String(++Ae),B>=0||e-Q<5900?b=requestAnimationFrame(ae):(f.clear(),h.clear(),i.dataset.state="idle")}function p(){if(_()){te(),i.hidden=!0,i.dataset.state=S?"lost":q?"unsupported":"paused";return}ve()&&(i.hidden=!1,U&&(f.resize(),U=!1),me?b||(i.dataset.state="idle"):(me=!0,R.ready=!1,B=performance.now()+150,re()))}function Be(e){if(_()||e.pointerType==="touch"&&!h.has(e.pointerId))return;const l=xe(e);if(!l){h.delete(e.pointerId);return}let c=h.get(e.pointerId);if(!c){if(h.size>=2)return;c={x:l.x,y:l.y,px:l.x,py:l.y,offset:0,moved:!1},h.set(e.pointerId,c);return}l.x===c.x&&l.y===c.y||(c.x=l.x,c.y=l.y,c.moved=!0,re())}L.addEventListener("pointermove",Be,{passive:!0}),L.addEventListener("pointerdown",e=>{if(_()||e.target.closest('a, button, input, textarea, select, summary, [role="button"]'))return;const l=xe(e);l&&(!h.has(e.pointerId)&&h.size<2&&h.set(e.pointerId,{...l,px:l.x,py:l.y,offset:0,moved:!1}),I.length<2&&I.push(l),re())},{passive:!0});for(const e of["pointerup","pointercancel"])window.addEventListener(e,l=>{l.pointerType==="touch"&&h.delete(l.pointerId)},{passive:!0});L.addEventListener("pointerleave",()=>h.clear(),{passive:!0}),window.addEventListener("scroll",()=>h.clear(),{passive:!0}),document.addEventListener("alejandro:background-motion",e=>{typeof e.detail?.paused=="boolean"&&(Z=e.detail.paused,p())}),document.addEventListener("alejandro:preferences",p),document.addEventListener("visibilitychange",p),new MutationObserver(p).observe(O,{attributes:!0,attributeFilter:["data-motion","data-contrast","data-loading"]}),V&&new MutationObserver(()=>{Z=V.dataset.paused==="true",p()}).observe(V,{attributes:!0,attributeFilter:["data-paused"]});for(const e of document.querySelectorAll("dialog"))new MutationObserver(p).observe(e,{attributes:!0,attributeFilter:["open"]}),e.addEventListener("close",p);for(const e of[fe,de])e.addEventListener("change",p);const he=()=>{U=!0,!_()&&f&&!b&&(f.resize(),U=!1)};window.addEventListener("resize",he,{passive:!0}),"ResizeObserver"in window&&new ResizeObserver(he).observe(L),"IntersectionObserver"in window&&new IntersectionObserver(e=>{$=e[0].isIntersecting,p()},{threshold:.05}).observe(L),i.addEventListener("webglcontextlost",e=>{e.preventDefault(),S=!0,te(),f?.dispose(),f=null,delete i.dataset.enhanced,p()}),i.addEventListener("webglcontextrestored",()=>{S=!1,q=!1,U=!1,p()}),window.addEventListener("pagehide",()=>{ee=!0,te(),f?.dispose(),f=null,delete i.dataset.enhanced}),window.addEventListener("pageshow",()=>{ee=!1,p()});const pe=L.getBoundingClientRect();$=pe.bottom>0&&pe.top<innerHeight,p()})();
