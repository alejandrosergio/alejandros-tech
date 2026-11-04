import { icon } from './icons.mjs';

export function hero(t) {
  const h = t.hero;
  return `<section class="portrait-hero" id="inicio" aria-labelledby="hero-title" data-portrait-hero>
    <div class="hero-rings" aria-hidden="true"><i></i><i></i></div>
    <div class="hero-edition"><span class="status-dot" aria-hidden="true"></span>${h.eyebrow}</div>
    <figure class="portrait-stage" data-bust-stage data-model="/assets/sergio-stylized-bust.glb" data-label="${h.modelLabel}">
      <img class="bust-fallback" src="/assets/sergio-bust-appearance.webp" alt="${h.portrait}" width="1254" height="1254" fetchpriority="high" decoding="async" draggable="false">
      <canvas class="bust-canvas" data-bust-canvas aria-hidden="true" hidden></canvas>
    </figure>
    <div class="hero-name"><p class="hero-kicker"><span aria-hidden="true">+</span>${h.kicker}<span aria-hidden="true">+</span></p><h1 id="hero-title">Sergio <span>Hernández</span></h1><p class="hero-signature">${h.tagline}</p></div>
    <div class="hero-disciplines" aria-label="${h.disciplinesLabel}">${h.disciplines.map((label, i) => `<div><span>0${i + 1}</span>${label}</div>`).join('')}</div>
    <div class="hero-chapter" aria-hidden="true"><span>01</span><i>←</i></div>
    <nav class="hero-section-dots" aria-label="${h.quickNav}"><a href="#inicio" aria-label="${h.home}" aria-current="location"></a><a href="#sobre-mi" aria-label="${t.nav[0].label}"></a><a href="#proyectos" aria-label="${t.nav[3].label}"></a><a href="#contacto" aria-label="${t.contactNav}"></a></nav>
    <div class="hero-invitation"><span class="hero-small-line" aria-hidden="true"></span><h2>${h.statement}</h2><p>${h.intro}</p><a class="hero-work-link" href="#proyectos"><span class="hero-work-icon" aria-hidden="true">${h.go}</span><span>${h.primary}<small>${h.workDetail}</small></span></a></div>
    <div class="hero-footer"><div class="hero-location">${icon('globe')}<span>${h.location}<small>${h.stack}</small></span></div><div class="bust-controls" data-bust-controls hidden><span class="bust-hint" id="bust-help">${h.modelHint}<span class="sr-only">. ${h.modelKeyboard}</span></span><button class="portrait-motion" type="button" data-portrait-motion data-pause="${h.pause}" data-play="${h.play}" aria-pressed="false"><span aria-hidden="true">◉</span><span data-portrait-motion-label>${h.pause}</span></button></div><a class="hero-scroll" href="#sobre-mi"><span>${h.scroll}<small>${h.secondary}</small></span><span class="hero-scroll-icon" aria-hidden="true">↓</span></a></div>
  </section>`;
}
