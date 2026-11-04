import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { root } from './build.mjs';
import { locales } from '../src/content/locales.mjs';
import { site } from '../src/content/site.mjs';
import { routeGroups } from '../src/content/routes.mjs';
import { skills, experience } from '../src/content/profile.mjs';
import { projects } from '../src/content/projects.mjs';
import { notes } from '../src/content/notes.mjs';
import { interfaceCopy } from '../src/content/interface.mjs';
import { journeyCopy } from '../src/content/journey.mjs';

const dist = path.join(root, 'dist');
const manifest = JSON.parse(await readFile(path.join(root, '.openai/hosting.json'), 'utf8'));
assert.equal(manifest.project_id, 'appgprj_6aea35f321688191a6452b8b65f782ee', 'Preserve this Site identity');
assert.equal(manifest.static.directory, 'dist');
assert.equal(new URL(site.origin).hostname, 'alejandros-tech.alejosergio3000.chatgpt.site');

function compareShape(es, en, key = 'locales') {
  assert.equal(typeof es, typeof en, `Translation type: ${key}`);
  if (typeof es === 'string') { assert.ok(es.trim() && en.trim(), `Empty translation: ${key}`); return; }
  assert.deepEqual(Object.keys(es), Object.keys(en), `Translation keys: ${key}`);
  for (const field of Object.keys(es)) compareShape(es[field], en[field], `${key}.${field}`);
}
compareShape(locales.es, locales.en);
compareShape(interfaceCopy.es, interfaceCopy.en, 'interface');
compareShape(journeyCopy.es, journeyCopy.en, 'journey');
assert.equal(new Set(skills.map(s => s.id)).size, skills.length);
for (const skill of skills) assert.ok(skill.es && skill.en && skill.context.es && skill.context.en);
for (const record of experience) assert.ok(record.es.length && record.es.length === record.en.length);
for (const project of projects) compareShape(project.es, project.en, `project.${project.id}`);
for (const note of notes) compareShape(note.es, note.en, `note.${note.id}`);

const ids = html => [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const htmlCache = new Map();
const fileFor = pathname => path.join(dist, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
async function readHTML(file) {
  if (!htmlCache.has(file)) htmlCache.set(file, await readFile(file, 'utf8'));
  return htmlCache.get(file);
}

for (const route of routeGroups) for (const lang of ['es', 'en']) {
  const pathname = route.paths[lang], html = await readHTML(fileFor(pathname));
  assert.ok(html.includes(`<html lang="${lang}"`), pathname);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `One page heading: ${pathname}`);
  assert.ok(html.includes('href="#main"') && html.includes('id="main" tabindex="-1"'), `Keyboard skip target: ${pathname}`);
  assert.ok(html.includes(`<link rel="canonical" href="${site.origin}${pathname}">`));
  for (const alternate of ['es', 'en']) assert.ok(html.includes(`<link rel="alternate" hreflang="${alternate}" href="${site.origin}${route.paths[alternate]}">`));
  assert.equal(new Set(ids(html)).size, ids(html).length, `Unique IDs: ${pathname}`);
  assert.ok(html.includes('data-letter-glitch') && html.includes('data-background-motion'), 'Decorative background and pause control on every route');
  assert.ok(html.includes('data-settings') && html.includes('data-privacy') && html.includes('data-cookie-banner'), 'Visitor controls on every route');
  assert.ok(html.includes('data-scroll-top') && html.includes('data-cursor-dot'), 'Progressive navigation controls on every route');
  assert.ok(!/TODO|lorem ipsum|undefined|href=""|href="#"|codex-preview|@gmail\.com/.test(html), `Finished and private-contact-free content: ${pathname}`);
  for (const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
    const target = new URL(match[1].replaceAll('&amp;', '&'), site.origin + pathname);
    if (target.origin !== site.origin) { assert.ok(['https:', 'mailto:'].includes(target.protocol)); continue; }
    const file = fileFor(target.pathname); await access(file);
    if (target.hash && file.endsWith('.html')) assert.ok(ids(await readHTML(file)).includes(decodeURIComponent(target.hash.slice(1))), `Existing anchor: ${pathname} → ${target.href}`);
  }
  for (const match of html.matchAll(/(?:aria-controls|aria-describedby|aria-labelledby)="([^"]+)"/g)) for (const id of match[1].split(/\s+/)) assert.ok(ids(html).includes(id), `ARIA reference: ${pathname} → ${id}`);
  if (route.type === 'home') {
    assert.equal((html.match(/data-splash-cursor/g) ?? []).length,1,'One optional smoke surface in the home');
    assert.ok(html.includes('data-intensity="0.6" data-size="0.5"') && html.includes('/assets/splash-cursor.js'),'Requested Smoke settings are home-only');
    assert.ok(html.includes('data-portrait-hero') && html.includes('sergio-natural-appearance.webp'), 'Home retains its static portrait');
    assert.ok(!/data-bust|data-model|portrait\.js|bust-view|bust-glb|\.glb/.test(html), 'The paused 3D feature is absent from the public page');
    assert.ok(!/brand-3d|aero-shards|data-brand-art/.test(html), 'Retired renderers are absent');
    assert.ok(html.includes('data-journey-guide'));
    assert.equal((html.match(/class="portrait-photo"/g)??[]).length,1,'One static portrait');
    assert.ok(!/data-profile-card|data-profile-flip/.test(html),'Duplicate portrait card removed');
    assert.ok(!html.includes('<span>↗</span></div>'),'No redirect arrow in cursor');
    for (const file of ['sergio-stylized-bust.glb','portrait.js','bust-glb.js','bust-view.js']) await assert.rejects(access(path.join(dist,'assets',file)), 'The paused renderer is not shipped');
    for (const entry of journeyCopy[lang].entries) assert.ok(ids(html).includes(entry.id), `Guide section: ${entry.id}`);
    assert.ok(html.includes(`action="${site.formEndpoint}" method="POST"`) && html.includes('name="consent"') && html.includes('data-intro-loader'));
    assert.ok(html.includes('name="_gotcha"') && html.includes(`name="_language" value="${lang}"`));
    assert.ok(!/formsubmit\.co|FormSubmit/.test(html), 'Use the verified Formspree integration');
    for (const id of ['sobre-mi', 'tecnologias', 'trayectoria', 'proyectos', 'conocimiento', 'contacto']) assert.ok(ids(html).includes(id));
    assert.ok(html.includes(`mailto:${site.email}`) && html.includes(site.linkedin) && html.includes(site.github));
    assert.ok(html.includes(`${site.cv}${lang === 'en' ? 'en/' : ''}`));
    assert.ok(html.includes('class="portrait-photo"') && html.includes('data-skills-static'), 'HTML portrait and skill explorer alternatives');
    assert.ok(!/Próximamente|Coming soon|Estamos construyendo|We’re building/.test(html), 'Replace the old coming-soon homepage');
  } else assert.ok(!html.includes('data-splash-cursor') && !html.includes('/assets/splash-cursor.js'),'Interior pages do not load the hero smoke');
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
for (const lang of ['es', 'en']) for (const entry of journeyCopy[lang].entries) {
  const target = new URL(entry.href, site.origin + locales[lang].path);
  const file = fileFor(target.pathname); await access(file);
  if (target.hash) assert.ok(ids(await readHTML(file)).includes(target.hash.slice(1)), `Guide action target: ${lang} → ${entry.href}`);
}
for (const route of routeGroups) for (const pathname of Object.values(route.paths)) assert.ok(sitemap.includes(`<loc>${site.origin}${pathname}</loc>`));
const css = await readFile(path.join(dist, 'assets/styles.css'), 'utf8');
for (const feature of ['prefers-reduced-motion', 'forced-colors', ':focus-visible', '@media print']) assert.ok(css.includes(feature));
assert.ok(!/overflow-x\s*:\s*hidden/.test(css), 'Fix overflow instead of hiding it');
for (const entry of await readdir(root)) assert.ok(!/^\.env(?:\.|$)/.test(entry), 'Do not package credentials');
await import('./check-letter-glitch.mjs');
await import('./check-splash.mjs');
await import('./check-navigation.mjs');
await import('./check-journey.mjs');
await import('./check-preferences.mjs');
console.log(JSON.stringify({ checked: true, languages: ['es', 'en'], pages: routeGroups.length * 2, checks: ['Site identity', 'deep translation parity', 'content completeness', 'all local links and anchors', 'ARIA references', 'unique headings and IDs', 'canonical and alternate routes', 'CV language', 'static fallbacks', 'sitemap'] }));
