import { parseBust } from './bust-glb.js';
import { createBustView } from './bust-view.js';

// The authored GLB has real volume, a neck pivot and independently moving eyes.
async function initPortrait() {
  const hero=document.querySelector('[data-portrait-hero]');if(!hero)return;
  const root=document.documentElement,stage=hero.querySelector('[data-bust-stage]'),canvas=stage.querySelector('[data-bust-canvas]');
  const controls=hero.querySelector('[data-bust-controls]'),control=hero.querySelector('[data-portrait-motion]');
  const header=document.querySelector('.site-header');
  const sizeHeader=()=>{if(header)root.style.setProperty('--site-header-height',`${header.getBoundingClientRect().height}px`);};
  sizeHeader();if(header)new ResizeObserver(sizeHeader).observe(header);
  const fine=matchMedia('(hover: hover) and (pointer: fine)'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),forced=matchMedia('(forced-colors: active)');
  const photo=stage.querySelector('.bust-fallback');
  let view,model,lost=false,visible=true,paused=false,raf=0,x=0,y=0,targetX=0,targetY=0,touch=null;
  const quiet=()=>reduced.matches||root.dataset.motion==='true';
  const excluded=()=>forced.matches||root.dataset.contrast==='true';
  const mayRender=()=>view&&!lost&&visible&&!document.hidden&&!excluded();
  const clamp=value=>Math.max(-1,Math.min(1,value));
  function fallback(){cancelAnimationFrame(raf);raf=0;delete stage.dataset.enhanced;canvas.hidden=true;controls.hidden=true;for(const name of ['tabindex','role','aria-label','aria-describedby'])stage.removeAttribute(name);}
  function render(){if(mayRender()){view.render({x,y});stage.dataset.pose=`${x.toFixed(3)},${y.toFixed(3)}`;}}
  function frame(){raf=0;if(!mayRender())return;if(quiet()||paused){x=y=0;render();return;}x+=(targetX-x)*.11;y+=(targetY-y)*.11;const settled=Math.abs(targetX-x)+Math.abs(targetY-y)<.0015;if(settled){x=targetX;y=targetY;}render();if(!settled)raf=requestAnimationFrame(frame);}
  function schedule(){if(!raf&&mayRender())raf=requestAnimationFrame(frame);}
  function reset(){cancelAnimationFrame(raf);raf=0;x=y=targetX=targetY=0;render();}
  function sync(){
    hero.dataset.sceneMotion=quiet()||paused||!visible||document.hidden||excluded()?'static':'active';
    if(!view)return;
    canvas.hidden=excluded()||lost;controls.hidden=excluded()||lost;control.hidden=!fine.matches;control.disabled=quiet();
    if(excluded()||lost){for(const name of ['tabindex','role','aria-label','aria-describedby'])stage.removeAttribute(name);}else{stage.setAttribute('role','img');stage.setAttribute('aria-label',stage.dataset.label);stage.tabIndex=quiet()||paused?-1:0;if(quiet()||paused)stage.removeAttribute('aria-describedby');else stage.setAttribute('aria-describedby','bust-help');}
    control.setAttribute('aria-pressed',String(paused||quiet()));control.querySelector('[data-portrait-motion-label]').textContent=paused||quiet()?control.dataset.play:control.dataset.pause;
    if(quiet()||paused||!visible||document.hidden||excluded()){cancelAnimationFrame(raf);raf=0;x=y=targetX=targetY=0;}schedule();
  }
  try {
    const response=await fetch(stage.dataset.model,{credentials:'omit',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Bust unavailable');
    model=parseBust(await response.arrayBuffer());if(photo?.decode)try{await photo.decode();}catch{}view=createBustView(canvas,model,photo);
    canvas.hidden=false;stage.dataset.enhanced='true';stage.setAttribute('role','img');stage.setAttribute('aria-label',stage.dataset.label);stage.setAttribute('aria-describedby','bust-help');stage.tabIndex=0;
  } catch {fallback();return;}
  window.addEventListener('pointermove',event=>{
    if(!fine.matches||event.pointerType!=='mouse'||quiet()||paused||!mayRender())return;
    if(event.target.closest('dialog[open]')){targetX=targetY=0;}else{const rect=stage.getBoundingClientRect();targetX=clamp((event.clientX-rect.left-rect.width*.5)/(innerWidth*.43));targetY=clamp((rect.top+rect.height*.24-event.clientY)/(innerHeight*.5));}schedule();
  },{passive:true});
  root.addEventListener('pointerleave',()=>{targetX=targetY=0;schedule();});
  stage.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'&&!quiet()&&!paused)touch={id:event.pointerId,x:event.clientX,y:event.clientY,active:false};},{passive:true});
  stage.addEventListener('pointermove',event=>{
    if(!touch||touch.id!==event.pointerId||quiet()||paused)return;
    const dx=event.clientX-touch.x,dy=event.clientY-touch.y;
    if(!touch.active&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.4){touch.active=true;stage.setPointerCapture?.(event.pointerId);}
    if(touch.active){event.preventDefault();targetX=clamp(dx/120);targetY=clamp(-dy/160);schedule();}
  },{passive:false});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,()=>{touch=null;});
  stage.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
    event.preventDefault();if(event.key==='Home'){reset();return;}if(quiet()||paused)return;
    if(event.key==='ArrowLeft')targetX=clamp(targetX-.25);if(event.key==='ArrowRight')targetX=clamp(targetX+.25);if(event.key==='ArrowUp')targetY=clamp(targetY+.25);if(event.key==='ArrowDown')targetY=clamp(targetY-.25);schedule();
  });
  control.addEventListener('click',()=>{paused=!paused;reset();sync();document.dispatchEvent(new CustomEvent('alejandro:background-motion',{detail:{paused}}));});
  window.addEventListener('blur',reset);document.addEventListener('visibilitychange',sync);document.addEventListener('alejandro:preferences',sync);
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-motion','data-contrast']});
  for(const media of [fine,reduced,forced])media.addEventListener('change',sync);
  new ResizeObserver(schedule).observe(stage);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(hero);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;fallback();});
  canvas.addEventListener('webglcontextrestored',()=>{try{view=createBustView(canvas,model,photo);lost=false;stage.dataset.enhanced='true';stage.tabIndex=0;stage.setAttribute('role','img');stage.setAttribute('aria-label',stage.dataset.label);stage.setAttribute('aria-describedby','bust-help');sync();}catch{fallback();}});
  sync();
}
initPortrait();
