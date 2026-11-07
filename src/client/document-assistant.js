import { createDocumentIndex, extractAnswer, validateQuestion, validateLocalAnswer } from './assistant-core.js';
import { createLocalModel, clearModelDownload } from './assistant-model.js';
import { localModel } from '../content/local-model.mjs';

const app = document.querySelector('[data-document-assistant]');
if (app) {
  const t = JSON.parse(app.dataset.copy), lang = app.dataset.language;
  const form = app.querySelector('[data-assistant-form]'), input = app.querySelector('[data-assistant-question]');
  const submit = app.querySelector('[data-assistant-submit]'), submitLabel = app.querySelector('[data-assistant-submit-label]');
  const cancel = app.querySelector('[data-assistant-cancel]'), clear = app.querySelector('[data-assistant-clear]');
  const status = app.querySelector('[data-assistant-status]'), error = app.querySelector('[data-assistant-error]');
  const response = app.querySelector('[data-assistant-response]'), result = app.querySelector('[data-assistant-result]');
  const initialContent = result.cloneNode(true);
  const documents = JSON.parse(app.querySelector('[data-assistant-library]').textContent), index = createDocumentIndex({ [lang]: documents });
  const mode = app.querySelector('[data-assistant-mode]');
  const knownSources = new Map([...app.querySelectorAll('[data-source-id]')].map(section => [section.dataset.sourceId, new URL(section.dataset.sourceHref, location.origin).href]));
  const modelPanel = app.querySelector('[data-assistant-model]'), enableModel = app.querySelector('[data-model-enable]');
  const stopModel = app.querySelector('[data-model-stop]'), clearModel = app.querySelector('[data-model-clear]');
  const modelStatus = app.querySelector('[data-model-status]'), progress = app.querySelector('[data-model-progress]');
  let controller = null, requestSequence = 0;
  let attemptedDownload = false;
  submit.disabled = false; clear.hidden = false; modelPanel.hidden = false; app.querySelector('[data-assistant-suggestions]').hidden = false;
  form.noValidate = true;

  const model = createLocalModel({
    onState(state) {
      app.dataset.modelState = state;
      const preparing = ['checking', 'loading'].includes(state), loaded = ['ready', 'generating'].includes(state);
      enableModel.hidden = loaded; enableModel.disabled = preparing || state === 'unsupported';
      enableModel.textContent = state === 'error' ? t.model.retry : t.model.download;
      stopModel.hidden = !preparing && !loaded; stopModel.textContent = preparing ? t.model.cancel : t.model.stop;
      clearModel.hidden = !attemptedDownload; clearModel.disabled = preparing;
      progress.hidden = state !== 'loading';
      const messages = { checking: t.model.checking, loading: t.model.loading, ready: t.model.ready, generating: t.model.generating, unsupported: t.model.unsupported, error: t.model.failed, idle: attemptedDownload ? t.model.stopped : t.model.cache };
      modelStatus.textContent = messages[state];
    },
    onProgress(value) { progress.value = Math.max(progress.value, value); }
  });
  if (!navigator.gpu) { enableModel.disabled = true; modelStatus.textContent = t.model.unsupported; }
  enableModel.addEventListener('click', async () => { attemptedDownload = true; progress.value = 0; await model.load(navigator.gpu); });
  stopModel.addEventListener('click', () => model.stop());
  clearModel.addEventListener('click', async () => {
    model.stop(); clearModel.disabled = true;
    try {
      const wasm = new URL(localModel.wasm, location.origin).href;
      await clearModelDownload(caches, localModel.weights, wasm);
      modelStatus.textContent = t.model.cleared;
    } catch { modelStatus.textContent = t.model.clearFailed; }
    finally { clearModel.disabled = false; }
  });

  const element = (tag, className, text) => {
    const node = document.createElement(tag); if (className) node.className = className;
    if (text !== undefined) node.textContent = text; return node;
  };
  const message = value => { status.textContent = value; };
  const setBusy = busy => {
    submit.disabled = busy; clear.disabled = busy; cancel.hidden = !busy;
    submitLabel.textContent = busy ? t.sending : t.send;
    if (busy) form.setAttribute('aria-busy', 'true'); else form.removeAttribute('aria-busy');
    for (const button of app.querySelectorAll('[data-assistant-example]')) button.disabled = busy;
  };
  const resetError = () => { error.hidden = true; error.textContent = ''; input.removeAttribute('aria-invalid'); };
  const focusResult = heading => {
    heading.tabIndex = -1; heading.focus({ preventScroll: true });
    if (matchMedia('(max-width: 920px)').matches && heading.getBoundingClientRect().top > innerHeight - 100) {
      const reduced = document.documentElement.dataset.motion === 'true' || matchMedia('(prefers-reduced-motion: reduce)').matches;
      heading.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
    }
  };
  const restore = () => { result.replaceChildren(...[...initialContent.childNodes].map(node => node.cloneNode(true))); response.dataset.state = 'idle'; mode.textContent = t.lightMode; };

  // Model output is always plain text. Identifiers, quotes and destinations
  // are checked against the public library before anything is displayed.
  function showAnswer(payload) {
    if (payload?.version !== 1 || payload.corpusVersion !== app.dataset.corpusVersion || !['answer', 'extracts', 'abstained'].includes(payload.kind)) throw new Error('invalid_sources');
    const extracts = payload.kind === 'extracts'; mode.textContent = payload.kind === 'answer' ? t.aiMode : t.lightMode;
    const content = element('div', 'assistant-answer');
    if (payload.kind === 'abstained') {
      const heading = element('h2', 'assistant-answer-heading', t.abstainedTitle);
      content.append(heading, element('p', 'assistant-answer-paragraph', t.abstained)); result.replaceChildren(content); response.dataset.state = 'abstained'; return heading;
    }
    if (!Array.isArray(payload.paragraphs) || (!extracts && !payload.paragraphs.length) || payload.paragraphs.length > 2 || !Array.isArray(payload.sources) || !payload.sources.length || payload.sources.length > 3) throw new Error('invalid_sources');
    const sourceNumbers = new Map();
    for (const [i, source] of payload.sources.entries()) {
      if (!source || typeof source.id !== 'string' || typeof source.href !== 'string' || typeof source.quote !== 'string' || typeof source.document !== 'string' || typeof source.title !== 'string') throw new Error('invalid_sources');
      const url = new URL(source.href, location.origin);
      if (sourceNumbers.has(source.id) || url.origin !== location.origin || knownSources.get(source.id) !== url.href || source.quote.length < 24 || source.quote.length > 320) throw new Error('invalid_sources');
      sourceNumbers.set(source.id, i + 1);
    }
    const heading = element('h2', 'assistant-answer-heading', extracts ? t.extractsTitle : t.answer); content.append(heading);
    for (const paragraph of payload.paragraphs) {
      if (typeof paragraph.text !== 'string' || !paragraph.text.trim() || paragraph.text.length > 1000 || !Array.isArray(paragraph.citationIds) || !paragraph.citationIds.length) throw new Error('invalid_sources');
      const p = element('p', 'assistant-answer-paragraph', paragraph.text);
      for (const id of paragraph.citationIds) {
        if (!sourceNumbers.has(id)) throw new Error('invalid_sources');
        const number = sourceNumbers.get(id), link = element('a', 'assistant-citation', `[${number}]`);
        link.href = `#evidence-${number}`; link.setAttribute('aria-label', `${t.sources}: ${number}`); p.append(' ', link);
      }
      content.append(p);
    }
    const evidence = element('section', 'assistant-evidence'); if (!extracts) evidence.append(element('h3', '', t.sources));
    const list = element('ol');
    for (const [i, source] of payload.sources.entries()) {
      const item = element('li'); item.id = `evidence-${i + 1}`;
      const link = element('a'); link.href = source.href;
      if (new URL(source.href, location.origin).pathname !== location.pathname) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      link.append(element('span', '', `[${i + 1}]`), element('span', '', source.document));
      if (link.target) link.append(element('span', 'sr-only', ` (${t.newTab})`));
      const quote = element('blockquote', '', source.quote); quote.setAttribute('aria-label', t.quote);
      item.append(link, element('p', 'assistant-source-section', source.title), quote); list.append(item);
    }
    evidence.append(list); content.append(evidence, element('p', 'assistant-caveat', extracts ? t.extractsCaveat : t.caveat));
    result.replaceChildren(content); response.dataset.state = extracts ? 'extracts' : 'answer'; return heading;
  }

  input.addEventListener('input', resetError);
  for (const button of app.querySelectorAll('[data-assistant-example]')) button.addEventListener('click', () => {
    input.value = button.dataset.assistantExample; resetError(); input.focus();
  });
  clear.addEventListener('click', () => { input.value = ''; resetError(); restore(); message(t.cleared); input.focus(); });
  cancel.addEventListener('click', () => controller?.abort('cancelled'));
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (controller) return; resetError();
    const question = input.value.trim();
    if (!validateQuestion(question)) { input.setAttribute('aria-invalid', 'true'); error.textContent = t.invalid; error.hidden = false; input.focus(); return; }
    const sequence = ++requestSequence, activeController = new AbortController(); controller = activeController;
    restore(); response.dataset.state = 'loading'; setBusy(true); message(t.loading);
    let resultHeading;
    try {
      let payload = extractAnswer(index, question, lang, app.dataset.corpusVersion), fallback = false;
      if (payload.sources.length && model.state === 'ready') {
        message(t.model.generating); mode.textContent = t.aiMode;
        // Keep the small optional model focused on the most relevant passage.
        // The lightweight result still exposes the wider set of source matches.
        const sources = index.retrieve(question, lang).slice(0, 1).map(source => ({ ...source, text: index.excerpt(question, source) }));
        try {
          const answer = await model.generate(question, lang, sources, activeController.signal);
          const generated = validateLocalAnswer(answer, sources, app.dataset.corpusVersion);
          if (generated.kind === 'answer') payload = generated; else fallback = true;
        }
        catch (failure) { if (activeController.signal.aborted) throw failure; fallback = true; }
      }
      if (sequence !== requestSequence || activeController.signal.aborted) throw new Error('cancelled');
      resultHeading = showAnswer(payload); message(fallback ? t.modelFallback : payload.kind === 'abstained' ? t.abstainedTitle : payload.kind === 'extracts' ? t.extractsReady : t.completed);
    } catch (failure) {
      if (sequence !== requestSequence) return;
      response.dataset.state = 'error';
      const code = activeController.signal.aborted ? activeController.signal.reason : failure.message;
      const messages = { cancelled: t.cancelled, timeout: t.timeout, invalid_question: t.invalid, invalid_sources: t.invalid_sources };
      const explanation = messages[code] ?? t.failed; message(explanation);
      if (code !== 'cancelled') { error.textContent = explanation; error.hidden = false; }
    } finally {
      if (sequence === requestSequence) {
        controller = null; setBusy(false);
        // Settle the form's responsive layout before positioning the answer.
        if (resultHeading) focusResult(resultHeading);
        else if (activeController.signal.aborted) input.focus({ preventScroll: true });
      }
    }
  });
  // Guide citations can point inside a closed native disclosure. Reveal it and
  // preserve the normal fragment link, including browser Back behaviour.
  function revealSource() {
    const id = location.hash.slice(1); if (!id.startsWith('source-demo-')) return;
    const section = document.getElementById(id), disclosure = section?.closest('details');
    if (disclosure) { disclosure.open = true; section.scrollIntoView({ block: 'start' }); section.focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', revealSource); revealSource();
  window.addEventListener('pagehide', () => {
    requestSequence++; controller?.abort('cancelled'); controller = null; model.stop();
    input.value = ''; resetError(); restore(); message(t.ready); setBusy(false);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && ['ready', 'generating'].includes(model.state)) model.stop(); });
}
