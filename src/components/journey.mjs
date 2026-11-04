import { journeyCopy } from '../content/journey.mjs';
import { icon } from './icons.mjs';
const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Emit global enhancement hooks on every route, but section-aware guidance only
// on the home. JSON is attribute-escaped; the client decides when controls appear.
export function journey(lang, home) {
  const t = journeyCopy[lang];
  const label = lang === 'es' ? 'Guía de navegación' : 'Navigation guide';
  const navigation = lang === 'es' ? 'Explorar las secciones' : 'Explore the sections';
  return `<a class="scroll-top" data-scroll-top data-tooltip href="#top" aria-label="${t.up}" hidden>${icon('arrowUp')}</a>
  <div class="cursor-dot" data-cursor-dot aria-hidden="true" hidden></div><div class="cursor-orbit" data-cursor-orbit aria-hidden="true" hidden><svg class="cursor-reticle" viewBox="0 0 40 40" fill="none" focusable="false"><circle class="cursor-ring" cx="20" cy="20" r="15.5"/><path class="cursor-corners" d="M13 5H5v8m22-8h8v8M5 27v8h8m22-8v8h-8"/></svg></div>
  <div class="interaction-tooltip" id="interaction-tooltip" role="tooltip" data-interaction-tooltip hidden></div>
${home ? `<aside class="journey-guide" data-journey-guide data-entries="${e(JSON.stringify(t.entries))}" aria-label="${label}" hidden>
    <button class="guide-toggle" data-guide-toggle type="button" aria-expanded="false" aria-controls="guide-panel"><span class="guide-avatar" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21"/><circle class="guide-progress" cx="24" cy="24" r="21"/></svg><span class="guide-beacon"></span><span class="guide-dot-track"><i></i></span></span><span class="guide-title"><small>${label}</small><strong data-guide-location>${t.entries[0].title}</strong></span><span class="guide-chevron" aria-hidden="true">+</span></button>
    <div class="guide-panel" id="guide-panel" data-guide-panel hidden><div class="guide-meta"><span data-guide-position>01 / 08</span><span aria-label="${t.progress}" data-guide-percent>0%</span></div><p data-guide-description>${t.entries[0].text}</p><nav class="guide-actions" aria-label="${navigation}"><button data-guide-previous data-tooltip type="button" aria-label="${t.previous}" disabled>←</button><a data-guide-action href="${t.entries[0].href}">${t.entries[0].action}${icon('arrowRight')}</a><button data-guide-next data-tooltip type="button" aria-label="${t.next}">→</button></nav><button class="guide-dismiss" data-guide-dismiss type="button">${t.dismiss} ×</button></div>
  </aside>` : ''}`;
}
