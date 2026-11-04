import { interfaceCopy } from '../content/interface.mjs';
import { icon } from './icons.mjs';

const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function preferences(lang) {
  const t = interfaceCopy[lang];
  return `<button class="settings-launcher" type="button" data-open-settings aria-label="${t.settings}" aria-haspopup="dialog" aria-controls="experience-settings" hidden>${icon('settings')}<span>${t.settings}</span></button>
  <dialog class="settings-dialog" id="experience-settings" aria-labelledby="settings-title" data-settings>
    <div class="dialog-header"><div><p class="eyebrow">A+ / ${t.settings}</p><h2 id="settings-title">${t.title}</h2></div><button class="dialog-close" type="button" data-close-dialog aria-label="${t.close}">×</button></div><p class="dialog-intro">${t.intro}</p>
    <div class="settings-grid"><fieldset><legend>${t.appearance}</legend><label class="setting-label" for="preference-theme">${t.theme}</label><select id="preference-theme" data-preference="theme">${['system','light','dark'].map((v,i)=>`<option value="${v}">${t.themes[i]}</option>`).join('')}</select>
    <p class="setting-label" id="tone-label">${t.tones}</p><div class="tone-options" role="group" aria-labelledby="tone-label">${['blue','violet','coral','ocean','mono'].map((v,i)=>`<button type="button" data-tone="${v}" aria-pressed="${i===0}"><span aria-hidden="true"></span>${t.colors[i]}</button>`).join('')}</div>
    <label class="setting-label" for="preference-text">${t.textSize}<output for="preference-text" data-output="text">100%</output></label><input id="preference-text" data-preference="text" type="range" min="100" max="125" step="5" value="100">
    <label class="setting-label" for="preference-radius">${t.radius}<output for="preference-radius" data-output="radius">20 px</output></label><input id="preference-radius" data-preference="radius" type="range" min="0" max="28" step="2" value="20"></fieldset>
    <fieldset><legend>${t.reading}</legend>${['contrast','spacing','links','motion'].map(key=>`<button class="setting-switch" type="button" role="switch" aria-checked="false" data-toggle-preference="${key}"${key==='motion'?' aria-describedby="motion-description"':''}><span>${t[key]}</span><i aria-hidden="true"></i></button>`).join('')}<p class="setting-help" id="motion-description">${t.motionHelp}</p><p class="settings-memory" data-memory data-session="${t.memory}" data-saved="${t.remembered}">${t.memory}</p><button class="button button-secondary" data-reset-preferences type="button">${t.reset}</button></fieldset></div>
    <div class="dialog-footer"><button type="button" class="text-link" data-open-privacy>${t.cookies}${icon('arrowRight')}</button><span class="sr-only" role="status" data-preference-status data-reset-message="${t.defaults}"></span></div>
  </dialog>
  <aside class="cookie-banner" data-cookie-banner aria-labelledby="cookie-title" hidden><span class="small-label">${t.cookies}</span><h2 id="cookie-title">${t.cookieTitle}</h2><p>${t.cookieIntro}</p><div class="cookie-actions"><button class="button button-primary" type="button" data-consent="preferences">${t.accept}</button><button class="button button-secondary" type="button" data-consent="essential">${t.essential}</button><button class="text-link" type="button" data-open-privacy>${t.configure}</button></div></aside>
  <dialog class="settings-dialog privacy-dialog" id="privacy-settings" aria-labelledby="privacy-title" data-privacy><div class="dialog-header"><div><p class="eyebrow">A+ / ${t.cookies}</p><h2 id="privacy-title">${t.cookieDetails}</h2></div><button class="dialog-close" type="button" data-close-dialog aria-label="${t.close}">×</button></div><p>${t.cookieText}</p><p>${t.contactPrivacy}</p><a href="https://formspree.io/legal/privacy-policy/" class="text-link">${t.provider}${icon('arrow')}</a><div class="cookie-actions"><button class="button button-primary" type="button" data-consent="preferences">${t.accept}</button><button class="button button-secondary" type="button" data-consent="essential">${t.essential}</button></div><p role="status" data-consent-status data-message="${t.cookieSaved}"></p></dialog>`;
}

export function loader(lang) {
  const t = interfaceCopy[lang];
  return `<div class="intro-loader" data-intro-loader><div class="loader-sign" aria-hidden="true">A<span>+</span></div><p>${t.loader}</p><span class="loader-track" aria-hidden="true"></span><button type="button" data-enter-site>${t.enter} →</button></div>`;
}

export function contactForm(lang, endpoint) {
  const t = interfaceCopy[lang], f = t.form;
  const field = (name, type, max, min) => `<div class="form-field"><label for="contact-${name}">${f[name]}</label><input id="contact-${name}" name="${name}" type="${type}" autocomplete="${name==='name'?'name':'email'}" required maxlength="${max}"${min?` minlength="${min}"`:''} aria-describedby="error-${name}"><span class="field-error" id="error-${name}" data-error="${name}"></span></div>`;
  return `<div class="contact-form-wrap" data-reveal><div class="form-intro"><h3>${f.label}</h3><p>${f.intro}</p><p class="form-fine">${f.required}</p></div><form class="contact-form" action="${e(endpoint)}" method="POST" data-contact-form data-messages="${e(JSON.stringify(f))}">
    <div class="form-summary" tabindex="-1" data-form-summary hidden></div><div class="form-row">${field('name','text',80,2)}${field('email','email',254)}</div>
    <div class="form-field"><label for="contact-topic">${f.topic}</label><select id="contact-topic" name="topic" required aria-describedby="error-topic">${f.topics.map((v,i)=>`<option value="${i?e(v):''}">${v}</option>`).join('')}</select><span class="field-error" id="error-topic" data-error="topic"></span></div>
    <div class="form-field"><label for="contact-message">${f.message}</label><textarea id="contact-message" name="message" rows="5" minlength="20" maxlength="4000" required aria-describedby="message-hint error-message"></textarea><span id="message-hint" class="form-fine">${f.hint}</span><span class="field-error" id="error-message" data-error="message"></span></div>
    <label class="form-consent"><input id="contact-consent" name="consent" type="checkbox" required aria-describedby="error-consent"><span>${f.consent}</span></label><span class="field-error" id="error-consent" data-error="consent"></span>
    <details class="form-privacy"><summary>${f.privacy}</summary><p>${t.contactPrivacy}</p><a href="https://formspree.io/legal/privacy-policy/">${t.provider}</a></details>
    <div class="form-trap" aria-hidden="true"><label>${f.honeypot}<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div><input type="hidden" name="_subject" value="Alejandro’sTech · ${lang==='es'?'Contacto web':'Website contact'}"><input type="hidden" name="_language" value="${lang}">
    <div class="form-submit"><button class="button button-primary" type="submit"><span data-submit-label>${f.submit}</span>${icon('arrowRight')}</button><p class="form-fine">${f.via}</p></div><p class="form-status" role="status" data-form-status></p></form></div>`;
}
