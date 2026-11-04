// Minimal native WebGL viewer for the authored, embedded GLB subset.
const identity = () => new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function multiply(a, b) {
  const out = new Float32Array(16);
  for (let c=0;c<4;c++) for(let r=0;r<4;r++) for(let k=0;k<4;k++) out[c*4+r] += a[k*4+r]*b[c*4+k];
  return out;
}
function translation(v) { const m=identity(); m[12]=v[0]; m[13]=v[1]; m[14]=v[2]; return m; }
function rotate(x,y) {
  const cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y);
  return multiply(new Float32Array([cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1]),new Float32Array([1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,0,0,1]));
}
function localMatrix(node) {
  const [x,y,z,w]=node.rotation, [sx,sy,sz]=node.scale;
  const r=new Float32Array([(1-2*y*y-2*z*z)*sx,(2*x*y+2*z*w)*sx,(2*x*z-2*y*w)*sx,0,(2*x*y-2*z*w)*sy,(1-2*x*x-2*z*z)*sy,(2*y*z+2*x*w)*sy,0,(2*x*z+2*y*w)*sz,(2*y*z-2*x*w)*sz,(1-2*x*x-2*y*y)*sz,0,0,0,0,1]);
  return multiply(translation(node.translation),r);
}
export function createBustView(canvas, model, portrait) {
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
  if(!gl) throw new Error('WebGL unavailable');
  const vertex=`attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModel; uniform mat4 uRestModel; uniform float uAspect; uniform float uHead; varying vec3 vPosition; varying vec3 vNormal; varying vec2 vUV; varying float vFront;
  void main(){vec4 world=uModel*vec4(aPosition,1.0);vPosition=world.xyz;vNormal=mat3(uModel)*aNormal;vec3 rest=(uRestModel*vec4(aPosition,1.0)).xyz-vec3(0.0,.25,8.0);vUV=vec2(.5+rest.x*3.9/(-rest.z)*.5,.5+rest.y*3.9/(-rest.z)*.5);if(uHead>.5)vUV.y=vUV.y*1.18-.171;vFront=(mat3(uRestModel)*aNormal).z;vec3 p=world.xyz-vec3(0.0,.6,8.0);gl_Position=vec4(p.x*5.1/uAspect,p.y*5.1,-1.01005*p.z-.201005,-p.z);}`;
  const fragment=`precision mediump float; uniform vec4 uColor; uniform float uRoughness; uniform float uMetallic; uniform sampler2D uPortrait; uniform float uPhotoMode; varying vec3 vPosition; varying vec3 vNormal; varying vec2 vUV; varying float vFront;
  void main(){vec3 n=normalize(vNormal);vec3 view=normalize(vec3(0.0,.6,8.0)-vPosition);vec3 key=normalize(vec3(-.75,1.2,1.8));vec3 fill=normalize(vec3(.85,.3,.9));
  float d=max(dot(n,key),0.0);float f=max(dot(n,fill),0.0);float ao=.65+.35*smoothstep(-.5,1.3,vPosition.y);float power=mix(110.0,10.0,uRoughness);float spec=pow(max(dot(n,normalize(key+view)),0.0),power);
  float rim=pow(1.0-max(dot(n,view),0.0),3.0)*max(dot(n,normalize(vec3(.8,.65,-.4))),0.0);float grain=sin(vPosition.x*320.0)*sin(vPosition.y*280.0)*sin(vPosition.z*300.0)*.018;
  vec3 base=uColor.rgb*.025;
  if(uPhotoMode>.0){vec4 tex=texture2D(uPortrait,vUV);float grey=dot(tex.rgb,vec3(.2126,.7152,.0722));float mask=smoothstep(-.05,.65,vFront)*tex.a;mask*=step(0.0,vUV.x)*step(vUV.x,1.0)*step(0.0,vUV.y)*step(vUV.y,1.0);base=mix(base,vec3(pow(grey,2.2)*uPhotoMode),mask);}
  vec3 color=base*(.22+d*.95+f*.06)*ao*(1.0+grain);color+=vec3(spec*(.003+(1.0-uRoughness)*.013)+rim*.038);color=mix(color,color*1.03,uMetallic);color=color/(vec3(1.0)+color);gl_FragColor=vec4(pow(max(color,vec3(0.0)),vec3(.454545)),uColor.a);}`;
  const shaders=[];
  for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Bust shader unavailable');shaders.push(s);}
  const program=gl.createProgram();shaders.forEach(s=>gl.attachShader(program,s));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Bust renderer unavailable');shaders.forEach(s=>gl.deleteShader(s));
  const attributes=['aPosition','aNormal'].map(name=>gl.getAttribLocation(program,name));
  const uniforms=Object.fromEntries(['uModel','uRestModel','uAspect','uColor','uRoughness','uMetallic','uPortrait','uPhotoMode','uHead'].map(name=>[name,gl.getUniformLocation(program,name)]));
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  const hasPortrait=Boolean(portrait?.naturalWidth);
  if(hasPortrait)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,portrait);else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([90,90,90,255]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  const buffers=[];
  const buffer=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);buffers.push(b);return b;};
  const meshes=model.meshes.map(mesh=>mesh.primitives.map(p=>{
    if(p.indices instanceof Uint32Array&&!gl.getExtension('OES_element_index_uint'))throw new Error('Large index buffers unavailable');
    return {positions:buffer(gl.ARRAY_BUFFER,p.positions),normals:buffer(gl.ARRAY_BUFFER,p.normals),indices:buffer(gl.ELEMENT_ARRAY_BUFFER,p.indices),count:p.indices.length,type:p.indices instanceof Uint32Array?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,material:model.materials[p.materialIndex],materialIndex:p.materialIndex};
  }));
  gl.clearColor(0,0,0,0);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  return {
    render({x=0,y=0}={}) {
      const width=canvas.clientWidth,height=canvas.clientHeight;if(!width||!height)return;
      const ratio=Math.min(devicePixelRatio||1,1.5,Math.sqrt(1200000/(width*height))),w=Math.round(width*ratio),h=Math.round(height*ratio);
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
      gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(uniforms.uAspect,width/height);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.uniform1i(uniforms.uPortrait,0);
      function drawNode(index,parent,parentRest) {
        const node=model.nodes[index];let local=localMatrix(node),restLocal=local;
        if(node.name==='Head')restLocal=multiply(restLocal,rotate(-.035,0));
        if(node.name==='Head')local=multiply(local,rotate(-.035-y*.11,x*.23));
        if(node.name.startsWith('Eye.'))local=multiply(local,rotate(-y*.11,x*.14));
        const world=multiply(parent,local),rest=multiply(parentRest,restLocal);
        if(node.mesh!==undefined)for(const p of meshes[node.mesh]){
          const isHead=node.name==='Head'||node.name.startsWith('Eye.');
          gl.uniform1f(uniforms.uPhotoMode,hasPortrait?(isHead?.48:[2,3].includes(p.materialIndex)?.34:.72):0);gl.uniform1f(uniforms.uHead,isHead?1:0);gl.uniformMatrix4fv(uniforms.uRestModel,false,rest);
          gl.uniformMatrix4fv(uniforms.uModel,false,world);gl.uniform4fv(uniforms.uColor,p.material.color);gl.uniform1f(uniforms.uRoughness,p.material.roughness);gl.uniform1f(uniforms.uMetallic,p.material.metallic);
          [p.positions,p.normals].forEach((b,i)=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(attributes[i]);gl.vertexAttribPointer(attributes[i],3,gl.FLOAT,false,0,0);});
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,p.indices);gl.drawElements(gl.TRIANGLES,p.count,p.type,0);
        }
        node.children.forEach(child=>drawNode(child,world,rest));
      }
      model.roots.forEach(index=>drawNode(index,rotate(0,-.035),rotate(0,-.035)));
    },
    dispose(){buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteTexture(texture);gl.deleteProgram(program);}
  };
}
