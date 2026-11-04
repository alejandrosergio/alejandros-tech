import { journeyCopy } from '../content/journey.mjs';
import { icon } from './icons.mjs';
const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function journey(lang, home) {
  const t = journeyCopy[lang];
  return `<a class="scroll-top" data-scroll-top href="#top" aria-label="${t.up}" title="${t.up}" hidden>${icon('arrowUp')}</a>
  <div class="cursor-dot" data-cursor-dot aria-hidden="true" hidden></div><div class="cursor-orbit" data-cursor-orbit aria-hidden="true" hidden><span>↗</span></div>
${home ? `<aside class="journey-guide" data-journey-guide data-entries="${e(JSON.stringify(t.entries))}" aria-label="${t.label}" hidden>
    <button class="guide-toggle" data-guide-toggle type="button" aria-expanded="false" aria-controls="guide-panel"><span class="guide-avatar" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21"/><circle class="guide-progress" cx="24" cy="24" r="21"/></svg><span>A<sup>+</sup></span><i></i></span><span class="guide-title"><small>${t.label}</small><strong data-guide-location>${t.entries[0].title}</strong></span><span class="guide-chevron" aria-hidden="true">+</span></button>
    <div class="guide-panel" id="guide-panel" data-guide-panel hidden><div class="guide-meta"><span data-guide-position>01 / 08</span><span aria-label="${t.progress}" data-guide-percent>0%</span></div><p data-guide-description>${t.entries[0].text}</p><nav class="guide-actions" aria-label="${t.navigation}"><button data-guide-previous type="button" aria-label="${t.previous}" disabled>←</button><a data-guide-action href="${t.entries[0].href}">${t.entries[0].action}${icon('arrowRight')}</a><button data-guide-next type="button" aria-label="${t.next}">→</button></nav><button class="guide-dismiss" data-guide-dismiss type="button">${t.dismiss} ×</button></div>
  </aside>` : ''}`;
}
