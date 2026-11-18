import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const languageFor = file => ({ '.js': 'JavaScript', '.mjs': 'JavaScript', '.css': 'CSS', '.html': 'HTML', '.cs': 'C#' })[path.extname(file)];
export const assistantSource = ['src/client/assistant-core.js', 'src/client/assistant-model.js', 'src/client/document-assistant.js', 'src/client/document-model-worker.js', 'src/components/document-assistant.mjs', 'src/content/local-model.mjs', 'src/content/document-assistant.mjs', 'src/styles/document-assistant.css'];
export const workflowSource = ['src/client/workflow-core.js', 'src/client/workflow.js', 'src/components/workflow.mjs', 'src/content/workflow.mjs', 'scripts/check-workflow.mjs', 'scripts/check-workflow-http.mjs'];
const excluded = new Set([...assistantSource, ...workflowSource, 'src/content/evaluation-reference.mjs', 'src/content/evaluation-history.mjs', 'src/content/evaluation-cases.mjs', 'src/client/evaluation-core.js', 'src/client/document-evaluation.js', 'src/components/evaluation.mjs', 'scripts/check-document-assistant.mjs', 'scripts/check-evaluation.mjs']);

export function codeBreakdown(files) {
  const bytes = new Map();
  for (const file of files) {
    const language = languageFor(file.path);
    if (!language) continue;
    if (!Number.isSafeInteger(file.bytes) || file.bytes < 0) throw new Error('Invalid source size');
    if (file.bytes) bytes.set(language, (bytes.get(language) ?? 0) + file.bytes);
  }
  const totalBytes = [...bytes.values()].reduce((sum, value) => sum + value, 0);
  if (!totalBytes) throw new Error('Source report is empty');
  const languages = [...bytes].map(([name, bytes]) => ({ name, bytes, units: Math.floor(bytes * 1000 / totalBytes), remainder: bytes * 1000 / totalBytes % 1 }));
  let remaining = 1000 - languages.reduce((sum, item) => sum + item.units, 0);
  for (const item of [...languages].sort((a, b) => b.remainder - a.remainder || a.name.localeCompare(b.name))) if (remaining-- > 0) item.units++;
  return { totalBytes, fileCount: files.filter(f => languageFor(f.path)).length, languages: languages.sort((a, b) => b.bytes - a.bytes).map(({ name, bytes, units }) => ({ name, bytes, percentage: units / 10 })) };
}

async function sourceFiles(root, directory) {
  const output = [];
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    if (['bin', 'obj', 'node_modules'].includes(entry.name)) continue;
    const relative = directory + '/' + entry.name;
    if (entry.isDirectory()) output.push(...await sourceFiles(root, relative));
    else if (entry.isFile() && languageFor(relative)) output.push(relative);
  }
  return output.sort();
}

export async function projectCodeReports(root) {
  const cv = JSON.parse(await readFile(path.join(root, 'src/content/cv-code-snapshot.json'), 'utf8'));
  const website = [...await sourceFiles(root, 'src'), ...await sourceFiles(root, 'scripts')].filter(file => !excluded.has(file));
  const workflow = [...workflowSource, ...await sourceFiles(root, 'examples/workflow-api/src'), ...await sourceFiles(root, 'examples/workflow-api/tests')];
  const report = async files => codeBreakdown(await Promise.all(files.map(async file => ({ path: file, bytes: Buffer.byteLength((await readFile(path.join(root, file), 'utf8')).replaceAll('\r\n', '\n')) }))));
  const [assistant, process, site] = await Promise.all([report(assistantSource), report(workflow), report(website)]);
  return { 'document-assistant': assistant, 'request-workflow': process, 'alejandros-tech': site, cv: { ...codeBreakdown(cv.files), revision: cv.commit, sourceURL: `https://github.com/${cv.repository}/tree/${cv.commit}/src`, checkedOn: cv.checkedOn } };
}
