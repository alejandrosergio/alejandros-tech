import { site } from '../content/site.mjs';
import { locales } from '../content/locales.mjs';
import { footerCopy } from '../content/footer.mjs';
import { interfaceCopy } from '../content/interface.mjs';
import { assistantPaths } from '../content/document-assistant.mjs';
import { workflowPaths } from '../content/workflow.mjs';
import { evaluationPaths } from '../content/evaluation-cases.mjs';
import { bookingCopy, bookingURL } from '../content/booking.mjs';
import { icon } from './icons.mjs';
import { escapeHTML as e } from '../lib/html.mjs';

const external = ' target="_blank" rel="noopener noreferrer"';
const link = (label, href, outside = false) => `<li><a class="footer-link" href="${e(href)}"${outside ? external : ''}><span>${e(label)}</span>${icon(outside ? 'arrow' : 'arrowRight')}</a></li>`;

// Real links remain available without JavaScript. The utility buttons reuse the
// existing preference controls, and entrances reuse the bounded reveal system.
export function footer(lang, paths) {
  const t = locales[lang], f = footerCopy[lang], ui = interfaceCopy[lang];
  const cv = site.cv + (lang === 'en' ? 'en/' : '');
  return `<footer class="site-footer" id="site-footer" aria-labelledby="footer-title"><div class="wrap">
    <div class="footer-callout" data-reveal><div><p class="eyebrow">${e(f.eyebrow)}</p><h2 id="footer-title">${e(f.title)} <em>${e(f.emphasis)}</em></h2></div><div class="footer-actions"><a class="footer-cta" href="${t.path}#contacto"><span>${e(f.action)}</span><span class="footer-cta-icon">${icon('arrowRight')}</span></a><a class="footer-cv" href="${cv}"${external}>${e(t.cv)}${icon('arrow')}</a></div></div>
    <div class="footer-body"><div class="footer-identity" data-reveal><div><a class="footer-brand" href="${t.path}">Alejandro’s<span>Tech</span></a><p>${e(f.intro)}</p><span class="footer-location"><i aria-hidden="true"></i>${e(f.location)}</span></div><nav class="footer-socials" aria-label="${e(f.social)}"><a href="${site.linkedin}"${external}>${icon('linkedin')}LinkedIn</a><a href="${site.github}"${external}>${icon('github')}GitHub</a></nav></div>
      <nav class="footer-group" aria-labelledby="footer-explore" data-reveal><h3 id="footer-explore">${e(f.explore)}</h3><ul>${t.nav.map(item => link(item.label, `${t.path}#${item.id}`)).join('')}${link(f.work, `${t.path}#proceso`)}</ul></nav>
      <nav class="footer-group" aria-labelledby="footer-lab" data-reveal><h3 id="footer-lab">${e(f.lab)}</h3><ul>${link(f.assistant, assistantPaths[lang])}${link(f.workflow, workflowPaths[lang])}${link(f.evaluation, evaluationPaths[lang])}${link(f.code, site.source, true)}</ul></nav>
      <nav class="footer-group footer-group--contact" aria-labelledby="footer-connect" data-reveal><h3 id="footer-connect">${e(f.connect)}</h3><ul>${link(bookingCopy[lang].action, bookingURL(lang), true)}${link(f.whatsapp, site.whatsapp, true)}${link(site.email, `mailto:${site.email}`)}${link(`${f.phone} ${site.phoneLabel}`, `tel:${site.phone}`)}</ul></nav>
    </div>
    <div class="footer-bottom"><small class="footer-legal"><span>© ${site.copyrightYear} ${site.name}</span><span>${e(t.rights)}</span></small><div class="footer-controls" role="group" aria-label="${e(f.preferences)}"><button class="footer-utility" type="button" data-open-privacy hidden>${e(ui.cookies)}</button><button class="footer-utility" type="button" data-background-motion data-pause="${e(ui.backgroundPause)}" data-play="${e(ui.backgroundPlay)}" aria-pressed="false" hidden>${e(ui.backgroundPause)}</button><nav class="footer-languages" aria-label="${e(t.languages)}"><a href="${paths.es}" lang="es" hreflang="es"${lang === 'es' ? ' aria-current="page"' : ''}>ES</a><a href="${paths.en}" lang="en" hreflang="en"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a></nav></div></div>
  </div></footer>`;
}
