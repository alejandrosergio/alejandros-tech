import { createDocumentIndex } from './assistant-core.js';
import { createLocalModel } from './assistant-model.js';
import { evaluateCase, summarizeEvaluation } from './evaluation-core.js';
import { localModel } from '../content/local-model.mjs';

const page = document.querySelector('[data-evaluation]');
if (page) {
  const t = JSON.parse(page.dataset.copy), data = JSON.parse(page.querySelector('[data-evaluation-data]').textContent);
  const index = createDocumentIndex(data.documents), status = page.querySelector('[data-evaluation-status]'), total = data.cases.length * Object.keys(data.documents).length;
  const progress = page.querySelector('[data-evaluation-progress]'), list = page.querySelector('[data-evaluation-results]');
  const cancel = page.querySelector('[data-evaluation-cancel]'), download = page.querySelector('[data-evaluation-download]');
  const output = page.querySelector('[data-evaluation-export]'), buttons = [...page.querySelectorAll('[data-evaluate]')];
  let controller, records = [], mode = 'light', executedAt, finishedAt;
  const model = createLocalModel({ onState() {}, onProgress(value) { if (controller && !records.length) status.textContent = `${t.preparing} ${Math.round(value * 100)}%`; } });
  page.querySelector('[data-evaluation-actions]').hidden = false;
  page.querySelector('[data-evaluation-filters]').hidden = false;
  for (const button of page.querySelectorAll('[data-evaluation-filter]')) button.addEventListener('click', () => {
    for (const peer of page.querySelectorAll('[data-evaluation-filter]')) peer.setAttribute('aria-pressed', String(peer === button));
    for (const record of page.querySelectorAll('[data-evaluation-record]')) record.hidden = button.dataset.evaluationFilter !== 'all' && record.dataset.evaluationRecord !== button.dataset.evaluationFilter;
  });
  function exportRecord() {
    return { version: 1, mode, executedAt, finishedAt, corpusVersion: data.corpusVersion, fingerprints: data.fingerprints, model: mode === 'model' ? localModel.id : null, modelRevision: mode === 'model' ? localModel.revision : null, summary: summarizeEvaluation(records), records };
  }
  function stop() { controller?.abort(); model.stop(); }
  cancel.addEventListener('click', stop);
  download.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(exportRecord(), null, 2) + '\n'], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `alejandros-tech-evaluation-${mode}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  for (const button of buttons) button.addEventListener('click', async () => {
    if (controller) return;
    const active = new AbortController(); controller = active; mode = button.dataset.evaluate; records = []; executedAt = new Date().toISOString(); finishedAt = null; list.replaceChildren(); download.hidden = true;
    buttons.forEach(control => { control.disabled = true; }); cancel.hidden = false; progress.hidden = false; progress.value = 0;
    try {
      if (mode === 'model') {
        status.textContent = t.preparing; await model.load(navigator.gpu);
        if (active.signal.aborted) throw new Error('cancelled');
        if (model.state !== 'ready') throw new Error(model.state === 'unsupported' ? 'unsupported' : 'failed');
      }
      for (const lang of ['es', 'en']) for (const item of data.cases) {
        if (active.signal.aborted) throw new Error('cancelled');
        status.textContent = `${t.running} ${records.length + 1}/${total} · ${lang.toUpperCase()} · ${item.id}`;
        const record = await evaluateCase(index, item, lang, data.corpusVersion, mode === 'model' ? (question, language, sources) => model.generate(question, language, sources, active.signal) : undefined);
        if (active.signal.aborted) throw new Error('cancelled');
        records.push(record); output.textContent = JSON.stringify(exportRecord()); progress.value = records.length;
        const row = document.createElement('li'); row.textContent = `${lang.toUpperCase()} · ${record.question} — ${record.modelState === 'generated' ? record.modelText : record.modelInvoked ? t.fallback : record.displayed.kind === 'abstained' ? t.notInvoked : record.displayed.sources.map(source => source.id).join(', ')}`; list.append(row);
        if (mode === 'model' && model.state !== 'ready') throw new Error('failed');
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      status.textContent = t.done;
    } catch (failure) { status.textContent = active.signal.aborted ? t.stopped : failure.message === 'unsupported' ? t.unsupported : `${t.failed}${model.lastError ? ` (${model.lastError})` : ''}`; }
    finally { finishedAt = new Date().toISOString(); model.stop(); controller = null; buttons.forEach(control => { control.disabled = false; }); cancel.hidden = true; download.hidden = !records.length; output.textContent = JSON.stringify(exportRecord()); }
  });
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden && controller) stop(); });
}
