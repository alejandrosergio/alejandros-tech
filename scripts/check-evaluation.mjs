import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluationCases, evaluationPaths } from '../src/content/evaluation-cases.mjs';
import { evaluationReference as reference } from '../src/content/evaluation-reference.mjs';
import { assistantDocuments, corpusVersion } from '../src/content/document-assistant.mjs';
import { createDocumentIndex, prepareLocalContext, validateLocalAnswer } from '../src/client/assistant-core.js';
import { evaluateCase, summarizeEvaluation } from '../src/client/evaluation-core.js';
import { localModel } from '../src/content/local-model.mjs';

assert.ok(reference, 'A public release needs actual reviewed reference results');
assert.equal(reference.records.length, evaluationCases.length * 2);
assert.equal(reference.model, localModel.id); assert.equal(reference.modelRevision, localModel.revision); assert.equal(reference.corpusVersion, corpusVersion);
assert.deepEqual(reference.summary, summarizeEvaluation(reference.records));
const index = createDocumentIndex({ es: assistantDocuments('es'), en: assistantDocuments('en') }), seen = new Set();
for (const lang of ['es', 'en']) for (const item of evaluationCases) {
  const record = reference.records.find(record => record.lang === lang && record.id === item.id);
  assert.ok(record, `Missing actual record: ${lang}:${item.id}`); assert.ok(!seen.has(lang + record.id)); seen.add(lang + record.id);
  const replay = await evaluateCase(index, item, lang, corpusVersion);
  for (const field of ['question', 'expectedIds', 'reference', 'retrievedIds', 'first', 'topThree', 'abstention', 'literal']) assert.deepEqual(record[field], replay[field], `Reference retrieval changed: ${lang}:${item.id}:${field}`);
  assert.ok(['correct', 'partial', 'insufficient', 'incorrect', 'error'].includes(record.review?.status)); assert.ok(record.review.es.trim() && record.review.en.trim());
  if (record.modelState === 'generated') {
    const checked = validateLocalAnswer({ text: record.modelText, finishReason: 'stop' }, prepareLocalContext(index, record.question, lang), corpusVersion);
    assert.deepEqual(checked, record.displayed, 'Accepted reference text and citations still satisfy the real contract');
  } else if (record.modelState === 'rejected') assert.ok(record.error && !record.modelText && record.displayed.kind === 'extracts');
  if (!record.modelInvoked) assert.equal(record.displayed.kind, 'abstained');
}
const rejected = await evaluateCase(index, evaluationCases[0], 'es', corpusVersion, async () => ({ text: 'https://invented.invalid/', finishReason: 'stop' }));
assert.equal(rejected.modelState, 'rejected'); assert.equal(rejected.displayed.kind, 'extracts', 'Rejected generation preserves real excerpts');
let invoked = false;
const outside = await evaluateCase(index, evaluationCases.find(item => item.id === 'astronomy'), 'en', corpusVersion, async () => { invoked = true; });
assert.ok(!invoked && !outside.modelInvoked && outside.abstention, 'Unsupported retrieval cannot invoke the model');
await assert.rejects(evaluateCase(index, evaluationCases[0], 'es', corpusVersion, async () => { throw new Error('cancelled'); }), /cancelled/);
assert.deepEqual(JSON.parse(await readFile(new URL('../dist/assets/evaluation/reference-run.json', import.meta.url), 'utf8')), reference);
for (const lang of ['es', 'en']) {
  const html = await readFile(new URL(`../dist${evaluationPaths[lang]}index.html`, import.meta.url), 'utf8');
  assert.ok(html.includes('data-evaluation-record') && html.includes('data-evaluation-data') && html.includes('/assets/document-evaluation.js'));
  assert.ok(!html.includes('data-document-assistant') && !html.includes('>No ejecutado<') && !html.includes('>Not run<'));
}
console.log(JSON.stringify({ evaluation: true, reviewedRecords: seen.size, summary: reference.summary, provenance: 'actual local browser run; AI-assisted qualitative review' }));
