import { icon } from './icons.mjs';

// The portrait and every destination remain available without the motion controller.
export function hero(t) {
  const h = t.hero;
  return `<section class="portrait-hero" id="inicio" aria-labelledby="hero-title" data-portrait-hero>
    <div class="hero-rings" aria-hidden="true"><i></i><i></i><span>+</span></div>
    <div class="hero-edition"><span class="status-dot" aria-hidden="true"></span>${h.eyebrow}</div>
    <figure class="portrait-stage" data-portrait-stage>
      <img class="portrait-body" src="/assets/sergio-portrait-cutout.webp" alt="${h.portrait}" width="1024" height="1536" fetchpriority="high" decoding="async" draggable="false">
      <div class="portrait-head" data-portrait-head aria-hidden="true" hidden><img src="/assets/sergio-portrait-cutout.webp" alt="" width="1024" height="1536" decoding="async" draggable="false"></div>
    </figure>
    <div class="hero-name"><p>${h.kicker}</p><h1 id="hero-title"><span>Sergio</span><em>Hernández.</em></h1></div>
    <div class="hero-disciplines" aria-label="${h.disciplinesLabel}">${h.disciplines.map((label, i) => `<div><span>0${i + 1}</span>${label}</div>`).join('')}</div>
    <div class="hero-invitation"><span class="hero-small-line" aria-hidden="true"></span><h2>${h.statement}</h2><p>${h.intro}</p><a class="hero-work-link" href="#proyectos"><span class="hero-work-icon">${icon('arrow')}</span><span>${h.primary}<small>${h.workDetail}</small></span></a></div>
    <div class="hero-footer"><div class="hero-location">${icon('globe')}<span>${h.location}<small>${h.stack}</small></span></div><button class="portrait-motion" type="button" data-portrait-motion data-pause="${h.pause}" data-play="${h.play}" aria-pressed="false" hidden><span aria-hidden="true">◉</span><span data-portrait-motion-label>${h.pause}</span></button><a class="hero-scroll" href="#sobre-mi"><span>${h.scroll}<small>${h.secondary}</small></span><span class="hero-scroll-icon" aria-hidden="true">↓</span></a></div>
  </section>`;
}
