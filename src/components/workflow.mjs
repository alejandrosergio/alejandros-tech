import { workflowCopy } from '../content/workflow.mjs';
import { escapeHTML as e } from '../lib/html.mjs';

export function workflowPage(lang, casePath) {
  const t = workflowCopy[lang], base = 'https://github.com/alejandrosergio/alejandros-tech/blob/main/examples/workflow-api/';
  const field = (name, label, value, constraints) => `<label for="workflow-${name}">${e(label)}</label><input id="workflow-${name}" name="${name}" value="${e(value)}" ${constraints} required aria-describedby="workflow-hint" autocomplete="off">`;
  const select = (name, label, options, selected) => `<div><label for="workflow-${name}">${e(label)}</label><select id="workflow-${name}" name="${name}">${Object.entries(options).map(([value, title]) => `<option value="${value}"${value === selected ? ' selected' : ''}>${e(title)}</option>`).join('')}</select></div>`;
  return `<main id="main" tabindex="-1"><article class="lab-page workflow-page wrap" data-workflow data-language="${lang}" data-copy="${e(JSON.stringify(t))}">
    <header class="detail-heading"><a class="back-link" href="${casePath}">← ${e(t.back)}</a><p class="eyebrow">${e(t.label)}</p><h1>${e(t.title)}</h1><p class="detail-lead">${e(t.description)}</p><p class="small-label">${e(t.scope)}</p></header>
    <p class="workflow-intro">${e(t.intro)}</p>
    <div class="workflow-workspace"><section class="workflow-panel"><h2>${e(t.form)}</h2><form data-workflow-form>
      ${field('requestId', t.requestId, 'REQ-1001', 'minlength="3" maxlength="32" pattern="[A-Za-z0-9][A-Za-z0-9-]{2,31}"')}
      ${field('title', t.titleLabel, t.sample, 'minlength="12" maxlength="160"')}
      <div class="workflow-fields">${select('category', t.category, t.categories, 'automation')}${select('priority', t.priority, t.priorities, 'normal')}</div>
      ${field('idempotencyKey', t.key, 'demo-request-1001', 'minlength="8" maxlength="64" pattern="[A-Za-z0-9_-]{8,64}"')}
      <p class="assistant-hint" id="workflow-hint">${e(t.hint)}</p><button class="button button-primary" type="submit" data-workflow-create disabled>${e(t.create)}</button>
    </form><noscript><p>${e(t.noJS)}</p></noscript></section>
    <section class="workflow-panel" aria-labelledby="workflow-journey-title"><h2 id="workflow-journey-title">${e(t.journey)}</h2><p data-workflow-empty>${e(t.empty)}</p><div data-workflow-record hidden><p class="workflow-current"><strong data-workflow-state tabindex="-1"></strong><span data-workflow-version></span></p><p data-workflow-help></p><div class="workflow-actions" data-workflow-actions></div><h3>${e(t.events)}</h3><ol class="workflow-events" data-workflow-events></ol></div><p class="workflow-count">${e(t.records)}: <strong data-workflow-count>0</strong></p></section></div>
    <section class="workflow-experiments"><h2>${e(t.experiments)}</h2><p>${e(t.experimentIntro)}</p><div class="workflow-actions"><button class="button button-secondary" type="button" data-workflow-replay disabled>${e(t.replay)}</button><button class="button button-secondary" type="button" data-workflow-conflict disabled>${e(t.conflict)}</button><button class="button button-secondary" type="button" data-workflow-stale disabled>${e(t.stale)}</button></div></section>
    <section class="workflow-response" aria-labelledby="workflow-response-title"><h2 id="workflow-response-title">${e(t.response)}</h2><p role="status" aria-live="polite" data-workflow-status>${e(t.idle)}</p><pre data-workflow-response tabindex="0" aria-labelledby="workflow-response-title">{}</pre><div class="workflow-actions"><button class="assistant-text-button" type="button" data-workflow-export hidden>${e(t.export)}</button><button class="assistant-text-button" type="button" data-workflow-reset hidden>${e(t.reset)}</button></div></section>
    <aside class="lab-scope"><h2>${e(t.implementation)}</h2><p>${e(t.implementationText)}</p><div class="lab-downloads">${[['README.md', t.source], ['openapi.json', t.contract], [`POWER-AUTOMATE${lang === 'en' ? '-EN' : ''}.md`, t.automate], ['fixtures.json', t.fixtures]].map(([path, label]) => `<a class="text-link" href="${base}${path}">${e(label)}</a>`).join('')}</div><p>${e(t.boundary)}</p></aside>
  </article></main>`;
}
