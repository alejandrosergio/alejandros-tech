import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { skills } from '../src/content/profile.mjs';
import { technologyGroups } from '../src/content/technology-interface.mjs';
import { projectSkillIds, cvTechnologies } from '../src/content/technology-directory.mjs';
import { projectTechnologies } from '../src/content/project-technologies.mjs';
import { technologyIcon } from '../src/components/technology-icon.mjs';

const ids = new Set(skills.map(s => s.id));
const artwork = JSON.parse(await readFile(new URL('../docs/technology-logos.json', import.meta.url), 'utf8'));
for (const asset of artwork.assets) {
  const bytes = await readFile(new URL(`../${asset.file}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, `Artwork fingerprint: ${asset.file}`);
  assert.ok(bytes.toString().includes('<svg') && !/<script\b|<foreignObject\b|\son\w+\s*=/i.test(bytes.toString()), 'Self-contained, non-scripted artwork');
}
assert.equal(ids.size, skills.length);
// Products missing in the previous version must stay represented individually.
for (const id of ['powerpages','powerfx','m365','teams','outlook','onedrive','excel','planner','entra','defender','net-framework','webforms','winforms','linq','dapper','java','spring','python','angular','javascript','bootstrap','reactnative','xamarin','azuresql','oracle','mysql','mongodb','redis','databricks','grpc','rabbitmq','azurefunctions','appservice','storage','servicebus','aks','aws','awslambda','amazons3','applicationinsights','datadog','subversion','jenkins','docker','mscopilot','githubcopilot','chatgpt','claude','gemini','appsheet','outsystems','mendix','zapier','bpmn','sipoc','vsm','asis','kpi','scrum','kanban','lean']) assert.ok(ids.has(id), `Master CV coverage: ${id}`);
for (const key of new Set(Object.values(projectTechnologies).flat())) assert.ok(ids.has(projectSkillIds[key] || key), `Sample project coverage: ${key}`);
assert.ok(cvTechnologies.find(t => t.id === 'python').context.en.includes('Complementary'));
assert.ok(cvTechnologies.find(t => t.id === 'java').context.en.includes('Earlier'));
for (const skill of skills) {
  assert.ok(technologyGroups.es[skill.group] && technologyGroups.en[skill.group]);
  assert.ok(skill.es && skill.en && skill.context.es && skill.context.en);
  const mark = technologyIcon(skill.mark);
  for (const [,src] of mark.matchAll(/src="([^"]+)"/g)) await access(new URL(`../public${src}`, import.meta.url));
  assert.ok(mark.includes('<img') || mark.includes('data-symbol='), 'Original symbols are distinguishable from brand artwork');
}
for (const lang of ['es','en']) {
  const html = await readFile(new URL(`../dist/${lang === 'en' ? 'en/' : ''}index.html`, import.meta.url), 'utf8');
  assert.equal((html.match(/class="skill-static-group"/g)||[]).length, 10, 'No-JS catalogue is grouped in native disclosures');
  assert.equal((html.match(/data-skill="/g)||[]).length, skills.length);
  assert.ok(html.includes('/assets/technology-explorer.js') && html.includes('type="search"'));
}
const runtime = await readFile(new URL('../dist/assets/technology-explorer.js',import.meta.url),'utf8');
function fixture(lang) {
  const element = (dataset = {}) => ({dataset,hidden:false,attributes:{},handlers:{},textContent:'',value:'',setAttribute(k,v){this.attributes[k]=v;},getAttribute(k){return this.attributes[k];},addEventListener(k,fn){this.handlers[k]=fn;},focus(){this.focused=true;}});
  const tiles = skills.map((s,i) => Object.assign(element({skill:s.id,group:s.group,name:s.name,description:s[lang],context:s.context[lang],category:technologyGroups[lang][s.group]}),{parentElement:{},querySelector(){return {cloneNode:()=>({id:s.id})};},closest(){return this;}}));
  const search=element(), category=element(), more=element(), empty=element(), count=element({template:'{shown}/{total}'}), inspector=element(), grid=element(), fallback=element();
  const filters=['all',...Object.keys(technologyGroups[lang])].map(group=>element({skillFilter:group}));
  const fields=Object.fromEntries(['category','name','description','context'].map(k=>[`[data-inspector-${k}]`,element()]));
  fields['[data-inspector-symbol]']={replaceChildren(node){this.current=node;}};
  const map={'[data-skill-search]':search,'[data-skill-category]':category,'[data-skill-more]':more,'[data-skill-count]':count,'#skill-inspector':inspector,'[data-skill-empty]':empty,'.skill-grid':grid,...fields};
  const explorer=Object.assign(element({pageSize:'12'}),{querySelector:s=>map[s],querySelectorAll:s=>s==='[data-skill]'?tiles:filters});
  vm.runInNewContext(runtime,{document:{querySelector:s=>s==='[data-skill-explorer]'?explorer:fallback},getComputedStyle:()=>({gridTemplateColumns:'1fr 1fr 1fr'})});
  const visible=()=>tiles.filter(t=>!t.hidden), selected=()=>tiles.find(t=>t.attributes['aria-pressed']==='true');
  assert.equal(visible().length,12); assert.equal(fallback.hidden,true); assert.equal(count.textContent,`12/${skills.length}`);
  more.handlers.click();assert.equal(visible().length,24);
  filters.find(f=>f.dataset.skillFilter==='cloud').handlers.click();assert.ok(visible().every(t=>t.dataset.group==='cloud'));assert.equal(category.value,'cloud');
  search.value='AWS';search.handlers.input();assert.ok(visible().length>0 && visible().every(t=>(t.dataset.name+t.dataset.description).includes('AWS')||t.dataset.name.includes('Amazon')));
  search.value='not-a-real-technology';search.handlers.input();assert.equal(visible().length,0);assert.equal(empty.hidden,false);assert.equal(inspector.hidden,true);assert.equal(more.hidden,true);assert.equal(selected(),undefined);
  search.value='';search.handlers.input();assert.equal(inspector.hidden,false);
  category.value='all';category.handlers.change();assert.equal(visible().length,12);
  let prevented=false;grid.handlers.keydown({target:visible()[0],key:'End',preventDefault(){prevented=true;}});assert.equal(selected(),visible().at(-1));assert.equal(prevented,true);assert.ok(selected().focused);
  grid.handlers.keydown({target:selected(),key:'Home',preventDefault(){}});assert.equal(selected(),visible()[0]);
  search.value='azure storage';search.handlers.input();assert.ok(visible().some(t=>t.dataset.skill==='storage'));
}
fixture('es'); fixture('en');
assert.ok(!/fetch\(|localStorage|sessionStorage/.test(runtime),'Searching is entirely local');
console.log(JSON.stringify({technologyDirectory:true,entries:skills.length,categories:10,checks:['master CV and all project inventories','local artwork','native no-JS categories','generated search/filter/paging','zero results and recovery','keyboard selection','ES/EN context boundaries']}));
