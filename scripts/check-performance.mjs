import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { root } from './build.mjs';
import { clientFiles, pageEntryAssets, stylesheetFiles } from './optimize-assets.mjs';

const read = filename => readFile(path.join(root, filename), 'utf8');
const byteLength = text => Buffer.byteLength(text);
const sourceCSS = (await Promise.all(stylesheetFiles.map(file => read(`src/styles/${file}`)))).join('\n');
const outputCSS = await read('dist/assets/styles.css');
assert.ok(byteLength(outputCSS) < byteLength(sourceCSS), 'Publish optimized CSS while retaining readable sources');
assert.ok(!/@import\b/.test(outputCSS), 'The shared stylesheet must not introduce render-blocking stylesheet chains');

let sourceJSBytes = 0, outputJSBytes = 0;
for (const file of clientFiles) {
  const [source, output] = await Promise.all([read(`src/client/${file}`), read(`dist/assets/${file}`)]);
  sourceJSBytes += byteLength(source); outputJSBytes += byteLength(output);
  assert.ok(byteLength(output) < byteLength(source), `Publish optimized JavaScript: ${file}`);
  if (['loader-grid.js', 'letter-glitch.js', 'splash-cursor.js'].includes(file)) {
    for (const notice of ['React Bits', '(c) 2026 David Haz', 'MIT + Commons Clause', '/assets/licenses/react-bits.txt']) {
      assert.ok(output.includes(notice), `Retain upstream attribution: ${file} → ${notice}`);
    }
  }
  for (const match of output.matchAll(/(?:\bfrom\s*|\bimport\s*)["'](\.[^"']+)["']/g)) {
    await access(path.resolve(root, 'dist/assets', match[1]));
  }
}

// Parse the actual shipped scripts too: source-only checks cannot detect a
// broken production transform or an unresolved generated entrypoint.
for (const file of [...clientFiles, 'document-assistant.js', 'document-model-worker.js', 'document-evaluation.js', 'workflow.js']) {
  execFileSync(process.execPath, ['--check', path.join(root, 'dist/assets', file)], { stdio: 'pipe' });
}

for (const languagePath of ['', 'en/']) {
  const html = await read(`dist/${languagePath}index.html`);
  const entries = pageEntryAssets(html);
  assert.ok(entries.includes('assets/styles.css') && entries.includes('assets/theme-init.js'));
  assert.ok(!entries.some(file => /document-model-worker|booking-embed|project-video|web-llm|\.wasm$|\.mp4$|\.mp3$/.test(file)), 'Optional model, agenda, video and music resources are absent from homepage entry downloads');
  assert.ok(!/<audio\b/i.test(html), 'The homepage must not create an eager music element');
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  for (const [tag] of head.matchAll(/<script\b[^>]*\bsrc="[^"]+"[^>]*>/gi)) {
    assert.ok(tag.includes('/assets/theme-init.js') || /\bdefer\b|\btype="module"/.test(tag), 'Only the small saved-appearance initializer blocks parsing');
  }
  for (const [tag] of head.matchAll(/<link\b[^>]*>/gi)) {
    if (/\brel="(?:modulepreload|preload)"/i.test(tag)) assert.ok(!/document-model-worker|\.wasm\b|\.mp4\b|\.mp3\b/i.test(tag), 'Heavy optional resources and music must not be preloaded');
  }
}

console.log(JSON.stringify({ performance: true, cssBytes: { source: byteLength(sourceCSS), output: byteLength(outputCSS), gzipSource: gzipSync(sourceCSS).length, gzipOutput: gzipSync(outputCSS).length }, standaloneJSBytes: { source: sourceJSBytes, output: outputJSBytes }, checks: ['production syntax', 'licence attribution', 'local module imports', 'deferred entry scripts', 'optional resource separation'] }));
