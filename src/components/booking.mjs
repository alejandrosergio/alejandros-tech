import { bookingCopy, bookingURL } from '../content/booking.mjs';
import { escapeHTML as e } from '../lib/html.mjs';
import { icon } from './icons.mjs';

export function bookingLink(lang) {
  const t = bookingCopy[lang];
  return `<a class="button button-primary booking-trigger" href="${e(bookingURL(lang))}" target="_blank" rel="noopener noreferrer" data-booking-open>${icon('calendar')}<span>${e(t.action)}<small>${e(t.short)}</small></span>${icon('arrow')}</a>`;
}

export function bookingDialog(lang) {
  const t = bookingCopy[lang];
  return `<dialog class="booking-dialog" id="booking-dialog" aria-labelledby="booking-title" aria-describedby="booking-hours booking-language" data-booking-dialog data-booking-url="${e(bookingURL(lang))}" data-booking-lang="${lang}" data-frame-title="${e(t.frame)}" data-loading="${e(t.loading)}" data-slow="${e(t.slow)}">
    <header class="booking-header"><div><p class="eyebrow">Alejandro’sTech · ${e(t.short)}</p><h2 id="booking-title">${e(t.title)}</h2><p id="booking-hours">${e(t.hours)}</p><p id="booking-language">${e(t.language)}</p></div><button class="dialog-close" type="button" data-booking-close aria-label="${e(t.close)}" autofocus>×</button></header>
    <div class="booking-calendar"><p class="booking-loading" role="status" data-booking-status>${e(t.loading)}</p><div class="booking-frame-host" data-booking-frame></div></div>
    <footer class="booking-footer"><p>${e(t.privacy)} <a href="https://cal.com/privacy" target="_blank" rel="noopener noreferrer">${e(t.privacyLink)}</a></p><a class="text-link" href="${e(bookingURL(lang))}" target="_blank" rel="noopener noreferrer">${e(t.external)}${icon('arrow')}</a></footer>
  </dialog>`;
}
