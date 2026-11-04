import { icon } from './icons.mjs';
import { site } from '../content/site.mjs';
import { journeyCopy } from '../content/journey.mjs';

export function hero(t) {
  const h = t.hero;
  const lang = t.path === '/en/' ? 'en' : 'es';
  return `<section class="portrait-hero" id="inicio" aria-labelledby="hero-title" data-portrait-hero>
    <div class="hero-rings" aria-hidden="true"><svg viewBox="0 0 1000 1000"><circle cx="500" cy="500" r="498"/></svg><svg viewBox="0 0 1000 1000"><circle cx="500" cy="500" r="498"/></svg></div>
    <div class="hero-edition"><span class="status-dot" aria-hidden="true"></span>${h.eyebrow}</div>
    <figure class="portrait-stage" data-bust-stage data-model="/assets/sergio-stylized-bust.glb" data-label="${h.modelLabel}">
      <img class="bust-fallback" src="/assets/sergio-bust-appearance.webp" alt="${h.portrait}" width="1254" height="1254" fetchpriority="high" decoding="async" draggable="false">
      <canvas class="bust-canvas" data-bust-canvas aria-hidden="true" hidden></canvas>
    </figure>
    <div class="hero-name"><p class="hero-kicker"><span aria-hidden="true">+</span>${h.kicker}<span aria-hidden="true">+</span></p><h1 id="hero-title">Sergio <span>Hernández</span></h1><p class="hero-signature">${h.tagline}</p></div>
    <div class="hero-primary-actions"><a class="hero-cv-link" href="${site.cv}${lang === 'en' ? 'en/' : ''}">${h.cvLabel}${icon('arrow')}</a><a class="hero-contact-link" href="#contacto">${h.contactLabel}${icon('mail')}</a></div>
    <div class="hero-disciplines" aria-label="${h.disciplinesLabel}">${h.disciplines.map((label, i) => `<div><span>0${i + 1}</span><b>${label}</b></div>`).join('')}</div>
    <nav class="hero-socials" aria-label="${h.socialsLabel}"><a href="${site.linkedin}" aria-label="LinkedIn" data-tooltip="LinkedIn">${icon('linkedin')}</a><a href="${site.github}" aria-label="GitHub" data-tooltip="GitHub">${icon('github')}</a><a href="mailto:${site.email}" aria-label="${h.emailLabel}" data-tooltip="${h.emailLabel}">${icon('mail')}</a></nav>
    <nav class="hero-section-dots" aria-label="${h.quickNav}">${journeyCopy[lang].entries.map((entry, i) => `<a href="#${entry.id}" data-scene-section="${entry.id}" aria-label="${entry.title}" data-tooltip="${entry.title}"${i === 0 ? ' aria-current="location"' : ''}></a>`).join('')}</nav>
    <div class="hero-invitation"><span class="hero-small-line" aria-hidden="true"></span><h2>${h.statement}</h2><p>${h.intro}</p><a class="hero-work-link" href="#proyectos"><span class="hero-work-icon" aria-hidden="true">${h.go}</span><span>${h.primary}<small>${h.workDetail}</small></span></a></div>
    <div class="hero-footer"><div class="hero-location">${icon('globe')}<span>${h.location}<small>${h.stack}</small></span></div><div class="bust-controls" data-bust-controls hidden><span class="bust-hint" id="bust-help">${h.modelHint}<span class="sr-only">. ${h.modelKeyboard}</span></span><button class="portrait-motion" type="button" data-portrait-motion data-pause="${h.pause}" data-play="${h.play}" aria-pressed="false"><span aria-hidden="true">◉</span><span data-portrait-motion-label>${h.pause}</span></button></div><a class="hero-scroll" href="#sobre-mi"><span>${h.scroll}<small>${h.secondary}</small></span><span class="hero-scroll-icon" aria-hidden="true">↓</span></a></div>
  </section>`;
}
