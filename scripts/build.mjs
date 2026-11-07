import { mkdir, readdir, writeFile, readFile, copyFile, stat, lstat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage, renderProject, renderNote, renderAssistant, renderEvaluation, renderWorkflow } from '../src/components/page.mjs';
import { createHash } from 'node:crypto';
import { assistantDocuments } from '../src/content/document-assistant.mjs';
import { evaluationCases, evaluationVersion } from '../src/content/evaluation-cases.mjs';
import { evaluationReference } from '../src/content/evaluation-reference.mjs';
import { evaluationHistory } from '../src/content/evaluation-history.mjs';
import { site } from '../src/content/site.mjs';
import { routeGroups } from '../src/content/routes.mjs';
import { build as bundle } from 'esbuild';

export const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const clientFiles = ['theme-init.js', 'preferences.js', 'loader-grid.js', 'site.js', 'journey.js', 'letter-glitch.js', 'splash-cursor.js', 'soundtrack.js', 'contact.js', 'form-rules.js', 'document-assistant.js'];

async function copyDirectory(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const destination = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDirectory(source, destination);
    else if (entry.isFile()) await copyFile(source, destination);
  }
}

export async function build() {
  const dist = path.join(root, 'dist');
  if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Unsafe output directory');
  const previous = await lstat(dist).catch(error => { if (error.code !== 'ENOENT') throw error; return null; });
  if (previous?.isSymbolicLink()) throw new Error('Output must not be a symbolic link');
  await rm(dist, { recursive: true, force: true });
  await mkdir(path.join(dist, 'en'), { recursive: true });
  await copyDirectory(path.join(root, 'public'), dist);
  const styles = await Promise.all(['styles.css', 'preferences.css', 'loader.css', 'journey.css', 'hero.css', 'background.css', 'splash.css', 'soundtrack.css', 'interactions.css', 'reveals.css', 'modules.css', 'document-assistant.css', 'lab.css'].map(file => readFile(path.join(root, 'src/styles', file), 'utf8')));
  await writeFile(path.join(dist, 'assets/styles.css'), styles.join('\n'));
  for (const file of clientFiles.filter(file => file !== 'document-assistant.js')) {
    await copyFile(path.join(root, 'src/client', file), path.join(dist, 'assets', file));
  }
  // The lightweight controller and the large optional model worker have separate
  // entrypoints. No homepage or ordinary query imports the WebLLM runtime.
  await bundle({ entryPoints: ['src/client/document-assistant.js', 'src/client/document-model-worker.js', 'src/client/document-evaluation.js', 'src/client/workflow.js'], outdir: path.join(dist, 'assets'), absWorkingDir: root, bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true, legalComments: 'linked', logLevel: 'warning' });
  const digest = bytes => createHash('sha256').update(bytes).digest('hex');
  const fingerprints = { corpus: digest(JSON.stringify({ es: assistantDocuments('es'), en: assistantDocuments('en') })), questions: digest(JSON.stringify(evaluationCases)) };
  for (const [key, filename] of Object.entries({ assistant: 'src/client/assistant-core.js', modelWorker: 'src/client/document-model-worker.js', modelSupervisor: 'src/client/assistant-model.js', modelConfig: 'src/content/local-model.mjs', evaluator: 'src/client/evaluation-core.js' })) fingerprints[key] = digest((await readFile(path.join(root, filename), 'utf8')).replace(/\r\n/g, '\n'));
  if (evaluationReference && JSON.stringify(evaluationReference.fingerprints) !== JSON.stringify(fingerprints)) throw new Error('Evaluation reference is stale: repeat the run or restore its exact inputs');
  await mkdir(path.join(dist, 'assets/evaluation'), { recursive: true });
  await writeFile(path.join(dist, 'assets/evaluation/questions.json'), JSON.stringify({ version: evaluationVersion, cases: evaluationCases }, null, 2) + '\n');
  if (evaluationReference) await writeFile(path.join(dist, 'assets/evaluation/reference-run.json'), JSON.stringify(evaluationReference, null, 2) + '\n');
  await writeFile(path.join(dist, 'assets/evaluation/previous-run.json'), JSON.stringify(evaluationHistory, null, 2) + '\n');
  const renderers = { home: renderPage, project: renderProject, note: renderNote, assistant: renderAssistant, evaluation: lang => renderEvaluation(lang, fingerprints), workflow: renderWorkflow };
  for (const route of routeGroups) for (const lang of ['es', 'en']) {
    const directory = path.join(dist, route.paths[lang].slice(1));
    await mkdir(directory, { recursive: true });
    if (!renderers[route.type]) throw new Error(`Unknown route type: ${route.type}`);
    const html = renderers[route.type](lang, route.entity);
    await writeFile(path.join(directory, 'index.html'), html);
  }
  await writeFile(path.join(dist, '404.html'), renderPage('es', { notFound: true }));
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${routeGroups.flatMap(route => ['es', 'en'].map(lang => `<url><loc>${site.origin}${route.paths[lang]}</loc><xhtml:link rel="alternate" hreflang="es" href="${site.origin}${route.paths.es}"/><xhtml:link rel="alternate" hreflang="en" href="${site.origin}${route.paths.en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${site.origin}${route.paths.es}"/></url>`)).join('')}</urlset>\n`);
  const total = (await Promise.all(['index.html', 'assets/styles.css', ...clientFiles.filter(file => file !== 'document-assistant.js').map(file => `assets/${file}`)].map(file => stat(path.join(dist, file))))).reduce((sum, entry) => sum + entry.size, 0);
  return { pages: routeGroups.flatMap(route => Object.values(route.paths)), initialAssetsBytes: total };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify({ built: true, ...(await build()) }));
}
