import { icon } from './icons.mjs';
import { site } from '../content/site.mjs';
import { journeyCopy } from '../content/journey.mjs';

export function hero(t) {
  const h = t.hero;
  const lang = t.path === '/en/' ? 'en' : 'es';
  return `<section class="portrait-hero" id="inicio" aria-labelledby="hero-title" data-portrait-hero>
    <canvas class="hero-smoke" data-splash-cursor data-preset="smoke" data-intensity="0.6" data-size="0.5" aria-hidden="true" hidden></canvas>
    <div class="hero-rings" aria-hidden="true"><svg viewBox="0 0 1000 1000"><circle cx="500" cy="500" r="498"/></svg><svg viewBox="0 0 1000 1000"><circle cx="500" cy="500" r="498"/></svg><svg viewBox="0 0 1000 1000"><circle cx="500" cy="500" r="498"/></svg></div>
    <div class="hero-edition"><span class="status-dot" aria-hidden="true"></span>${h.eyebrow}</div>
    <figure class="portrait-stage">
      <img class="portrait-photo" src="/assets/sergio-natural-appearance.webp" alt="${h.portrait}" width="1024" height="1536" fetchpriority="high" decoding="async" draggable="false">
    </figure>
    <div class="hero-name"><p class="hero-kicker"><span aria-hidden="true">+</span>${h.kicker}<span aria-hidden="true">+</span></p><h1 id="hero-title">Sergio <span>Hernández</span></h1><p class="hero-signature">${h.tagline}</p></div>
    <nav class="hero-disciplines" aria-label="${h.disciplinesLabel}">${h.disciplines.map((label, i) => `<a class="hero-discipline" href="#${['tecnologias', 'proceso', 'conocimiento'][i]}" aria-label="${label}" aria-describedby="hero-discipline-${i}"><span class="hero-discipline-index" aria-hidden="true">0${i + 1}</span><span class="hero-discipline-copy"><b>${label}</b><small id="hero-discipline-${i}">${h.disciplineDescriptions[i]}</small></span></a>`).join('')}</nav>
    <nav class="hero-socials" aria-label="${h.socialsLabel}"><a href="${site.linkedin}" aria-label="LinkedIn" data-tooltip="LinkedIn">${icon('linkedin')}</a><a href="${site.github}" aria-label="GitHub" data-tooltip="GitHub">${icon('github')}</a></nav>
    <div class="hero-invitation"><span class="hero-small-line" aria-hidden="true"></span><h2>${h.statement}</h2><p>${h.intro}</p><a class="hero-work-link" href="#proyectos"><span class="hero-work-icon" aria-hidden="true">${h.go}</span><span>${h.primary}<small>${h.workDetail}</small></span></a></div>
    <div class="hero-footer"><div class="hero-location">${icon('globe')}<span>${h.location}<small>${h.stack}</small></span></div><nav class="hero-primary-actions" aria-label="${h.actionsLabel}"><a class="hero-cv-link" aria-label="${t.cv}" href="${site.cv}${lang === 'en' ? 'en/' : ''}" target="_blank" rel="noopener noreferrer">${h.cvLabel}${icon('arrow')}</a><a class="hero-contact-link" href="#contacto">${h.contactLabel}${icon('mail')}</a></nav><a class="hero-scroll" href="#sobre-mi"><span>${h.scroll}<small>${h.secondary}</small></span><span class="hero-scroll-icon" aria-hidden="true">↓</span></a></div>
  </section><section class="hero-areas-mobile" aria-label="${h.disciplinesLabel}">${h.disciplines.map((label, i) => `<div><h2><span aria-hidden="true">0${i + 1}</span>${label}</h2><p>${h.disciplineDescriptions[i]}</p></div>`).join('')}</section>`;
}

export function sectionNavigation(t) {
  const lang = t.path === '/en/' ? 'en' : 'es';
  return `<nav class="hero-section-dots" aria-label="${t.hero.quickNav}">${journeyCopy[lang].entries.map((entry, i) => `<a href="#${entry.id}" data-scene-section="${entry.id}" aria-label="${entry.title}" data-tooltip="${entry.title}"${i === 0 ? ' aria-current="location"' : ''}></a>`).join('')}</nav>`;
}
