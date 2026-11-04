import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source=(await readFile(new URL('../src/client/portrait.js',import.meta.url),'utf8')).replace(/^import[^\n]*\n/gm,'');

async function fixture({fine=true,reduced=false,forced=false,fetchOK=true,fetchFails=false,noGL=false,parseFails=false}={}) {
  const handlers=new Map(),media=new Map(),frames=new Map(),poses=[],requests=[],sceneEvents=[];let id=0,intersection,mutation,viewerAttempts=0,restoreFails=false;
  const events=target=>({addEventListener(name,callback){handlers.set(target+':'+name,callback);}});
  const attributes=()=>({attrs:{},setAttribute(name,value){this.attrs[name]=String(value);},getAttribute(name){return this.attrs[name]??null;},removeAttribute(name){delete this.attrs[name];}});
  const label={textContent:''},controls={hidden:true};
  const control={hidden:true,disabled:false,dataset:{pause:'Pause',play:'Follow'},...events('control'),...attributes(),querySelector:()=>label};
  const canvas={hidden:true,clientWidth:800,clientHeight:800,...events('canvas')};
  const stage={dataset:{model:'/assets/sergio-stylized-bust.glb',label:'Stylized 3D bust'},clientWidth:800,clientHeight:800,...events('stage'),...attributes(),querySelector:()=>canvas,getBoundingClientRect:()=>({left:200,top:89,width:800,height:800}),setPointerCapture(value){this.captured=value;}};
  Object.defineProperty(stage,'tabIndex',{set(value){stage.setAttribute('tabindex',value);},get(){return Number(stage.getAttribute('tabindex')??-1);}});
  const hero={dataset:{},querySelector:selector=>({'[data-bust-stage]':stage,'[data-bust-controls]':controls,'[data-portrait-motion]':control})[selector]};
  const root={dataset:{},style:{setProperty(name,value){this[name]=value;}},...events('root')},header={getBoundingClientRect:()=>({height:89})};
  const document={documentElement:root,hidden:false,...events('document'),dispatchEvent:event=>sceneEvents.push(event),querySelector:selector=>selector==='.site-header'?header:hero},model={own:'model'};
  const context={document,window:{...events('window'),IntersectionObserver:true},innerWidth:1280,innerHeight:900,
    AbortSignal:{timeout:value=>({timeout:value})},CustomEvent:class{constructor(type,{detail}={}){this.type=type;this.detail=detail;}},
    fetch:async(url,options)=>{requests.push({url,options});if(fetchFails)throw new Error('Network');return{ok:fetchOK,arrayBuffer:async()=>new ArrayBuffer(28)};},
    parseBust:()=>{if(parseFails)throw new Error('Invalid model');return model;},
    createBustView:(_canvas,parsed)=>{assert.equal(parsed,model);viewerAttempts++;if(noGL||restoreFails)throw new Error('Graphics unavailable');return{render:pose=>poses.push({...pose})};},
    requestAnimationFrame:callback=>{frames.set(++id,callback);return id;},cancelAnimationFrame:key=>frames.delete(key),
    matchMedia(query){const item={matches:query.includes('hover:')?fine:query.includes('reduced')?reduced:forced,addEventListener(_name,callback){this.change=callback;}};media.set(query,item);return item;},
    MutationObserver:class{constructor(callback){mutation=callback;}observe(){}},ResizeObserver:class{constructor(callback){this.callback=callback;}observe(){}},
    IntersectionObserver:class{constructor(callback){intersection=callback;}observe(){}}
  };
  await vm.runInNewContext(source,context);
  const fire=(target,name,values={})=>{const event={prevented:false,preventDefault(){this.prevented=true;},...values};const callback=handlers.get(target+':'+name);assert.ok(callback,'Registered '+target+':'+name);callback(event);return event;};
  return{root,document,hero,stage,canvas,control,controls,label,poses,frames,requests,sceneEvents,get viewerAttempts(){return viewerAttempts;},
    flush(){let count=0;while(frames.size&&count++<200){const entries=[...frames];frames.clear();entries.forEach(([,callback])=>callback());}assert.ok(count<200,'Pose settles without an idle loop');},fire,
    move(x,y,pointerType='mouse'){return fire('window','pointermove',{clientX:x,clientY:y,pointerType,target:{closest:()=>null}});},
    key(key){return fire('stage','keydown',{key});},visible(value){intersection([{isIntersecting:value}]);},
    preference(key,value){root.dataset[key]=value;mutation();},
    mediaChange(fragment,value){const item=[...media.entries()].find(([query])=>query.includes(fragment))[1];item.matches=value;item.change();},
    failRestore(){restoreFails=true;}
  };
}
for(const options of[{noGL:true},{fetchFails:true},{fetchOK:false},{parseFails:true}]){
  const missing=await fixture(options);assert.equal(missing.canvas.hidden,true);assert.equal(missing.controls.hidden,true);assert.equal(missing.stage.dataset.enhanced,undefined);assert.equal(missing.stage.getAttribute('tabindex'),null);assert.equal(missing.frames.size,0);
}
const normal=await fixture();normal.flush();
assert.equal(normal.stage.dataset.enhanced,'true');assert.equal(normal.stage.getAttribute('role'),'img');assert.equal(normal.stage.tabIndex,0);
assert.equal(normal.root.style['--site-header-height'],'89px');assert.equal(normal.requests[0].options.credentials,'omit');assert.equal(normal.requests[0].options.signal.timeout,15000);
assert.equal(normal.poses.length,1);assert.deepEqual(normal.poses.at(-1),{x:0,y:0});assert.equal(normal.frames.size,0);
assert.equal(normal.hero.dataset.sceneMotion,'active','Decorative orbit can run while the scene is visible and motion is allowed');
normal.move(2000,-2000);normal.flush();assert.deepEqual(normal.poses.at(-1),{x:1,y:1});assert.equal(normal.frames.size,0);
normal.fire('control','click');normal.flush();assert.equal(normal.control.getAttribute('aria-pressed'),'true');assert.equal(normal.label.textContent,'Follow');assert.deepEqual(normal.poses.at(-1),{x:0,y:0});
assert.equal(normal.hero.dataset.sceneMotion,'static','Scene pause stops the decorative orbit too');assert.equal(normal.sceneEvents.at(-1).type,'alejandro:background-motion');assert.equal(normal.sceneEvents.at(-1).detail.paused,true);
const pausedFrames=normal.poses.length;normal.move(-2000,2000);assert.equal(normal.frames.size,0);assert.equal(normal.poses.length,pausedFrames);
normal.fire('control','click');normal.flush();assert.equal(normal.control.getAttribute('aria-pressed'),'false');
assert.equal(normal.hero.dataset.sceneMotion,'active');assert.equal(normal.sceneEvents.at(-1).detail.paused,false);
assert.equal(normal.key('ArrowRight').prevented,true);normal.flush();assert.deepEqual(normal.poses.at(-1),{x:.25,y:0});
normal.key('ArrowUp');normal.flush();assert.deepEqual(normal.poses.at(-1),{x:.25,y:.25});normal.key('Home');normal.flush();assert.deepEqual(normal.poses.at(-1),{x:0,y:0});
assert.equal(normal.key('Tab').prevented,false,'Ordinary keyboard navigation stays native');
normal.fire('stage','pointerdown',{pointerType:'touch',pointerId:1,clientX:0,clientY:0});
const vertical=normal.fire('stage','pointermove',{pointerId:1,clientX:4,clientY:60});assert.equal(vertical.prevented,false);assert.equal(normal.frames.size,0);normal.fire('stage','pointerup');
normal.fire('stage','pointerdown',{pointerType:'touch',pointerId:2,clientX:0,clientY:0});
const horizontal=normal.fire('stage','pointermove',{pointerId:2,clientX:60,clientY:8});assert.equal(horizontal.prevented,true);assert.equal(normal.stage.captured,2);normal.flush();assert.deepEqual(normal.poses.at(-1),{x:.5,y:-.05});
normal.fire('stage','pointercancel');assert.equal(normal.fire('stage','pointermove',{pointerId:2,clientX:100,clientY:0}).prevented,false);assert.equal(normal.frames.size,0);
normal.visible(false);const offscreenFrames=normal.poses.length;normal.move(1280,0);assert.equal(normal.frames.size,0);assert.equal(normal.poses.length,offscreenFrames);
assert.equal(normal.hero.dataset.sceneMotion,'static','Offscreen decorative animation is suspended');
normal.visible(true);normal.flush();assert.deepEqual(normal.poses.at(-1),{x:0,y:0});
assert.equal(normal.hero.dataset.sceneMotion,'active');
normal.move(1280,0);normal.document.hidden=true;normal.fire('document','visibilitychange');assert.equal(normal.frames.size,0);
assert.equal(normal.hero.dataset.sceneMotion,'static','Hidden tabs suspend the decorative orbit');
normal.document.hidden=false;normal.fire('document','visibilitychange');normal.flush();assert.deepEqual(normal.poses.at(-1),{x:0,y:0});
assert.equal(normal.hero.dataset.sceneMotion,'active');
normal.move(1280,0);normal.fire('window','blur');assert.equal(normal.frames.size,0);assert.deepEqual(normal.poses.at(-1),{x:0,y:0});
normal.preference('motion','true');normal.flush();assert.equal(normal.control.disabled,true);assert.equal(normal.frames.size,0);assert.deepEqual(normal.poses.at(-1),{x:0,y:0});normal.move(1280,0);assert.equal(normal.frames.size,0);
assert.equal(normal.hero.dataset.sceneMotion,'static','The visitor motion preference also stops decorative animation');
normal.preference('motion','false');normal.flush();normal.preference('contrast','true');assert.equal(normal.canvas.hidden,true);assert.equal(normal.controls.hidden,true);assert.equal(normal.frames.size,0);
assert.equal(normal.hero.dataset.sceneMotion,'static');
normal.preference('contrast','false');normal.flush();assert.equal(normal.canvas.hidden,false);
normal.mediaChange('forced-colors',true);assert.equal(normal.canvas.hidden,true);assert.equal(normal.frames.size,0);normal.mediaChange('forced-colors',false);normal.flush();
const loss=normal.fire('canvas','webglcontextlost');assert.equal(loss.prevented,true);assert.equal(normal.canvas.hidden,true);assert.equal(normal.stage.dataset.enhanced,undefined);assert.equal(normal.frames.size,0);
normal.fire('canvas','webglcontextrestored');normal.flush();assert.equal(normal.viewerAttempts,2);assert.equal(normal.stage.dataset.enhanced,'true');assert.equal(normal.stage.getAttribute('role'),'img');assert.equal(normal.stage.tabIndex,0);assert.equal(normal.canvas.hidden,false);
normal.fire('canvas','webglcontextlost');normal.failRestore();normal.fire('canvas','webglcontextrestored');assert.equal(normal.canvas.hidden,true);assert.equal(normal.controls.hidden,true);assert.equal(normal.stage.dataset.enhanced,undefined);
const quiet=await fixture({reduced:true});quiet.flush();assert.equal(quiet.poses.length,1);assert.equal(quiet.control.disabled,true);assert.equal(quiet.frames.size,0);quiet.move(1280,0);assert.equal(quiet.frames.size,0);
assert.equal(quiet.hero.dataset.sceneMotion,'static','Device reduced motion never starts the decorative orbit');
const touch=await fixture({fine:false});touch.flush();assert.equal(touch.control.hidden,true);const touchCount=touch.poses.length;touch.move(1280,0);assert.equal(touch.frames.size,0);assert.equal(touch.poses.length,touchCount);
const forced=await fixture({forced:true});forced.flush();assert.equal(forced.canvas.hidden,true);assert.equal(forced.controls.hidden,true);assert.equal(forced.poses.length,0);
assert.equal(forced.hero.dataset.sceneMotion,'static');
console.log(JSON.stringify({portraitChecks:['binary/model/WebGL fallback','bounded head and gaze targets','idle suspension','scene/orbit/background pause','keyboard rotation/reset','touch horizontal versus vertical scroll','offscreen/hidden orbit suspension','reduced motion','contrast/forced fallback','context recovery']}));
