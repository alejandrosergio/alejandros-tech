import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { root } from './build.mjs';
import { locales } from '../src/content/locales.mjs';
import { site } from '../src/content/site.mjs';

const manifest = JSON.parse(await readFile(path.join(root, '.openai/hosting.json'), 'utf8'));
assert.equal(manifest.project_id, 'appgprj_6aea35f321688191a6452b8b65f782ee', 'Preserve this Site identity');
assert.equal(manifest.static.directory, 'dist');
assert.equal(new URL(site.origin).hostname, 'alejandros-tech.alejosergio3000.chatgpt.site');
assert.deepEqual(Object.keys(locales.es).sort(), Object.keys(locales.en).sort(), 'Translations must have the same keys');

for (const [lang, file] of [['es', 'index.html'], ['en', 'en/index.html']]) {
  const html = await readFile(path.join(root, 'dist', file), 'utf8');
  assert.ok(html.includes(`<html lang="${lang}">`));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'Exactly one page heading');
  assert.ok(html.includes(locales[lang].status));
  assert.ok(html.includes('aria-current="page"'));
  assert.ok(html.includes('href="#main"'));
  assert.ok(html.includes(`mailto:${site.email}`));
  assert.ok(html.includes(site.linkedin) && html.includes(site.github));
  assert.ok(html.includes(`${site.cv}${lang === 'en' ? 'en/' : ''}`));
  assert.ok(!/TODO|lorem ipsum|href=""|href="#"|codex-preview|@gmail\.com/.test(html), 'No unfinished content or unintended contact address');
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)"/g)) {
    const url = match[1];
    const local = url.endsWith('/') ? `${url}index.html` : url;
    await access(path.join(root, 'dist', local));
  }
  for (const match of html.matchAll(/href="(https:[^"]+)"/g)) {
    const url = new URL(match[1]);
    assert.ok(url.hostname, 'External URLs must be valid');
  }
}

const css = await readFile(path.join(root, 'dist/assets/styles.css'), 'utf8');
for (const feature of ['prefers-reduced-motion', 'forced-colors', ':focus-visible', '@media print']) assert.ok(css.includes(feature));
assert.ok(!/overflow-x\s*:\s*hidden/.test(css), 'Fix overflow instead of hiding it');
for (const entry of await readdir(root)) assert.ok(!/^\.env(?:\.|$)/.test(entry), 'Do not package credentials');
console.log(JSON.stringify({ checked: true, languages: ['es', 'en'], checks: ['Site identity', 'translation parity', 'local assets', 'contact URLs', 'CV language', 'accessibility hooks', 'finished content'] }));
