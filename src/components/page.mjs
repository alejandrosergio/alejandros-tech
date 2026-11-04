import { site } from '../content/site.mjs';
import { locales } from '../content/locales.mjs';
import { experience, skills } from '../content/profile.mjs';
import { projects, projectPath } from '../content/projects.mjs';
import { notes, notePath } from '../content/notes.mjs';
import { icon } from './icons.mjs';
import { artwork } from './artwork.mjs';
import { preferences, loader, contactForm } from './preferences.mjs';
import { interfaceCopy } from '../content/interface.mjs';

export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const e = escapeHTML;
const cvURL = lang => site.cv + (lang === 'en' ? 'en/' : '');
const mailURL = t => `mailto:${site.email}?subject=${encodeURIComponent(t.contact.subject)}`;
const splitTitle = lines => `${e(lines[0])}<em>${e(lines[1])}</em>`;
const tags = values => `<ul class="tags">${values.map(value => `<li>${e(value)}</li>`).join('')}</ul>`;
const sectionLabel = (number, label) => `<p class="section-label"><span>${number}</span>${e(label)}</p>`;

function head(lang, { title, description, paths, notFound = false, home = false }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)}</title>
  <meta name="description" content="${e(description)}">
  <meta name="theme-color" content="#f5f7fb">
  ${notFound ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${site.origin}${paths[lang]}">
  <link rel="alternate" hreflang="es" href="${site.origin}${paths.es}">
  <link rel="alternate" hreflang="en" href="${site.origin}${paths.en}">
  <link rel="alternate" hreflang="x-default" href="${site.origin}${paths.es}">`}
  <meta property="og:type" content="${home ? 'website' : 'article'}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${e(title)}">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:url" content="${site.origin}${paths[lang]}">
  <meta property="og:locale" content="${lang === 'es' ? 'es_CO' : 'en_US'}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
  <script src="/assets/theme-init.js"></script>
  <script src="/assets/preferences.js" defer></script>
  <script src="/assets/site.js" defer></script>${home ? '\n  <script src="/assets/brand-3d.js" defer></script>\n  <script src="/assets/contact.js" type="module"></script>' : ''}
</head>`;
}

function header(lang, t, paths) {
  return `<header class="site-header" id="top">
    <div class="header-inner wrap">
      <a class="wordmark" href="${t.path}" aria-label="${site.name}"><img src="/assets/brand-mark.svg" width="36" height="36" alt=""><span>Alejandro’s<span class="wordmark-accent">Tech</span></span></a>
      <nav class="primary-nav" id="primary-nav" aria-label="${t.navLabel}" data-primary-nav>${t.nav.map(n => `<a href="${t.path}#${n.id}" data-nav-section="${n.id}">${n.label}</a>`).join('')}<a class="nav-contact" href="${t.path}#contacto">${t.contactNav}${icon('arrow')}</a></nav>
      <div class="header-controls"><nav class="languages" aria-label="${t.languages}"><a href="${paths.es}" lang="es" hreflang="es" title="Español"${lang === 'es' ? ' aria-current="page"' : ''}>ES</a><a href="${paths.en}" lang="en" hreflang="en" title="English"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a></nav>
      <button class="theme-button" type="button" data-theme-toggle aria-label="${t.themeLabel}" title="${t.themeLabel}" hidden>${icon('moon', 'moon-icon')}${icon('sun', 'sun-icon')}</button>
      <button class="menu-button" type="button" data-menu-toggle data-open="${t.menu}" data-close="${t.closeMenu}" aria-label="${t.menu}" aria-expanded="false" aria-controls="primary-nav" hidden><span></span><span></span></button></div>
    </div><div class="reading-progress" aria-hidden="true" data-reading-progress></div>
  </header>`;
}

function footer(t, lang) {
  return `<footer class="site-footer wrap"><div><a class="footer-brand" href="${t.path}">${site.name}</a><p>${t.contact.footer}</p><button class="footer-privacy" type="button" data-open-privacy hidden>${interfaceCopy[lang].cookies}</button></div><small>© ${site.copyrightYear} ${site.name}<br>${t.rights}</small><a class="back-top" href="#top">${t.top}${icon('arrow')}</a></footer>`;
}

function document(lang, content, options) {
  const t = locales[lang];
  return `<!doctype html>
<html lang="${lang}">
${head(lang, options)}
<body${options.home ? ' class="home-page"' : ' class="detail-page"'}>
${options.home ? `  ${loader(lang)}` : ''}
  <a class="skip-link" href="#main">${t.skip}</a>
  ${header(lang, t, options.paths)}
  ${content}
  ${footer(t, lang)}
  ${preferences(lang)}
</body>
</html>
`;
}

function hero(t) {
  return `<section class="hero wrap" aria-labelledby="hero-title">
    <div class="hero-grid"><div class="hero-copy"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${t.hero.eyebrow}</p>
      <h1 id="hero-title">${splitTitle(t.hero.heading)}</h1><p class="hero-intro">${t.hero.intro}</p>
      <div class="hero-actions"><a class="button button-primary" href="#proyectos">${t.hero.primary}${icon('arrowRight')}</a><a class="text-link" href="#sobre-mi">${t.hero.secondary}${icon('arrow')}</a></div>
      <div class="hero-stack" aria-label="${t.skills.label}"><span>.NET</span><i aria-hidden="true">/</i><span>Power Platform</span><i aria-hidden="true">/</i><span>React</span></div>
    </div><div class="hero-art"><span class="art-overline" aria-hidden="true">A<span>+</span> / ${t.hero.artLabel}</span>${artwork(t)}</div></div>
    <div class="hero-bottom"><a href="#sobre-mi"><span class="scroll-mark" aria-hidden="true">↓</span>${t.hero.scroll}</a><span class="location">${icon('globe')}${t.hero.location}</span></div>
  </section>`;
}

function about(lang, t) {
  return `<section class="section about-section wrap" id="sobre-mi" aria-labelledby="about-title">
    <div class="about-copy" data-reveal>${sectionLabel('01', t.about.label)}<h2 id="about-title">${splitTitle(t.about.title)}</h2><p class="lead">${t.about.intro}</p>${t.about.paragraphs.map(p => `<p>${e(p)}</p>`).join('')}<a class="text-link" href="${cvURL(lang)}">${t.cv}${icon('arrow')}</a></div>
    <div class="profile-card" data-profile-card data-reveal>
      <div class="profile-front" data-profile-front><div class="profile-card-top"><span>${t.about.profileLabel}</span><span aria-hidden="true">A+</span></div><div class="portrait-wrap"><img src="/assets/sergio-hernandez.jpeg" alt="${t.about.portrait}" width="1024" height="1536" loading="lazy" decoding="async"></div><div class="profile-name"><strong>Sergio Hernández</strong><span>${t.about.profileRole}</span></div><div class="profile-meta"><span>${t.about.location}</span><span>${t.about.experience}</span></div></div>
      <div class="profile-back" data-profile-back hidden><span class="profile-monogram" aria-hidden="true">A+</span><h3>${t.about.cardTitle}</h3><p>${t.about.cardText}</p><ul>${t.about.cardDetails.map((s, i) => `<li><span>0${i + 1}</span>${e(s)}</li>`).join('')}</ul></div>
      <button class="profile-flip" type="button" data-profile-flip data-front="${t.about.flip}" data-back="${t.about.flipBack}" aria-expanded="false" hidden><span data-flip-text>${t.about.flip}</span>${icon('arrowRight')}</button>
    </div>
    <dl class="profile-facts" data-reveal>${t.about.facts.map(f => `<div><dt>${e(f.value)}</dt><dd>${e(f.label)}</dd></div>`).join('')}</dl>
  </section>`;
}

function skillExplorer(lang, t) {
  const first = skills[0];
  return `<section class="section skills-section" id="tecnologias" aria-labelledby="skills-title"><div class="wrap">
    <div class="section-heading" data-reveal><div>${sectionLabel('02', t.skills.label)}<h2 id="skills-title">${splitTitle(t.skills.title)}</h2></div><p>${t.skills.intro}</p></div>
    <div class="skills-static" data-skills-static><h3 class="sr-only">${t.skills.fallback}</h3><ul>${skills.map(s => `<li><strong>${e(s.name)}</strong><p>${e(s[lang])}</p></li>`).join('')}</ul></div>
    <div class="skill-explorer" data-skill-explorer aria-label="${t.skills.explorerLabel}" hidden>
      <div class="skill-filters" role="group" aria-label="${t.skills.filterLabel}"><button type="button" data-skill-filter="all" aria-pressed="true">${t.skills.all}<span>${skills.length}</span></button>${Object.entries(t.skills.groups).map(([key, label]) => `<button type="button" data-skill-filter="${key}" aria-pressed="false">${label}<span>${skills.filter(s => s.group === key).length}</span></button>`).join('')}</div>
      <div class="skill-explorer-body"><div class="skill-grid">${skills.map((s, i) => `<button type="button" class="skill-tile" data-skill="${s.id}" data-group="${s.group}" data-name="${e(s.name)}" data-symbol="${e(s.symbol)}" data-description="${e(s[lang])}" data-context="${e(s.context[lang])}" data-category="${e(t.skills.groups[s.group])}" aria-pressed="${i === 0}" aria-controls="skill-inspector"><span class="skill-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="skill-symbol" aria-hidden="true">${e(s.symbol)}</span><span class="skill-name">${e(s.name)}</span><span class="skill-tile-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
      <aside class="skill-inspector" id="skill-inspector" aria-live="polite" aria-atomic="true"><span class="small-label">${t.skills.selected}</span><span class="inspector-symbol" data-inspector-symbol aria-hidden="true">${e(first.symbol)}</span><p class="inspector-category" data-inspector-category>${t.skills.groups[first.group]}</p><h3 data-inspector-name>${e(first.name)}</h3><p data-inspector-description>${e(first[lang])}</p><div class="inspector-context"><span class="small-label">${t.skills.related}</span><p data-inspector-context>${e(first.context[lang])}</p></div></aside></div>
    </div>
  </div></section>`;
}

function career(lang, t) {
  return `<section class="section career-section wrap" id="trayectoria" aria-labelledby="career-title"><div class="career-intro" data-reveal>${sectionLabel('03', t.career.label)}<h2 id="career-title">${splitTitle(t.career.title)}</h2><p>${t.career.intro}</p><a class="text-link" href="${cvURL(lang)}">${t.career.cvLink}${icon('arrow')}</a><div class="education"><span class="small-label">${t.career.educationLabel} / ${t.career.educationDate}</span><h3>${t.career.educationTitle}</h3><p>${t.career.educationDegree}</p><p>${t.career.educationSchool}</p></div></div>
    <ol class="timeline">${experience.map((job, i) => `<li data-reveal><details class="career-entry"${i === 0 ? ' open' : ''}><summary><span class="career-meta"><span>${job.dates[lang]}</span><span>${job.place[lang]}</span></span><span class="career-name">${e(job.company)}<span class="entry-toggle" aria-hidden="true">+</span></span><span class="career-role">${e(job.role[lang])}</span></summary><div class="career-body"><ul>${job[lang].map(p => `<li>${e(p)}</li>`).join('')}</ul>${tags(job.tags)}</div></details></li>`).join('')}</ol>
  </section>`;
}

function projectCards(lang, t) {
  return projects.map((project, i) => `<article class="project-card" data-reveal><a class="project-image" href="${projectPath(project, lang)}" aria-label="${e(project.name)} — ${t.readCase}"><img src="${project.image}" alt="${e(project.name)}" width="1280" height="900" loading="lazy" decoding="async"><span class="project-open" aria-hidden="true">${icon('arrow')}</span><span class="project-index" aria-hidden="true">0${i + 1}</span></a><div class="project-meta"><span>${e(project[lang].type)}</span><span>2026</span></div><h3><a href="${projectPath(project, lang)}">${e(project.name)}</a></h3><p>${e(project[lang].summary)}</p>${tags(project.stack)}<a class="text-link" href="${projectPath(project, lang)}">${t.readCase}${icon('arrowRight')}</a></article>`).join('');
}

function projectSection(lang, t) {
  return `<section class="section projects-section wrap" id="proyectos" aria-labelledby="projects-title"><div class="section-heading" data-reveal><div>${sectionLabel('04', t.projects.label)}<h2 id="projects-title">${splitTitle(t.projects.title)}</h2></div><p>${t.projects.intro}</p></div><div class="project-grid">${projectCards(lang, t)}</div></section>`;
}

function processSection(t) {
  return `<section class="process-section" aria-labelledby="process-title"><div class="wrap"><div class="process-heading" data-reveal><p class="eyebrow">${t.process.label}</p><h2 id="process-title">${t.process.title}</h2></div><ol class="process-steps">${t.process.steps.map((step, i) => `<li data-reveal><span class="process-number">0${i + 1}</span><h3>${step.title}</h3><p>${step.text}</p></li>`).join('')}</ol></div></section>`;
}

function noteCards(lang, t, items = notes) {
  return items.map(note => `<article class="note-card" data-reveal><a href="${notePath(note, lang)}" class="note-card-link"><div class="note-meta"><span>${note.category[lang]}</span><span aria-hidden="true">${note.symbol}</span></div><h3>${note[lang].title}</h3><p>${note[lang].summary}</p><span class="note-read">${t.readNote}${icon('arrowRight')}</span></a></article>`).join('');
}

function noteSection(lang, t) {
  return `<section class="section notes-section wrap" id="conocimiento" aria-labelledby="notes-title"><div class="section-heading" data-reveal><div>${sectionLabel('05', t.notes.label)}<h2 id="notes-title">${splitTitle(t.notes.title)}</h2></div><p>${t.notes.intro}</p></div><div class="notes-grid">${noteCards(lang, t)}</div></section>`;
}

function contact(t, lang) {
  return `<section class="contact-section" id="contacto" aria-labelledby="contact-title"><div class="wrap"><div class="contact-heading" data-reveal>${sectionLabel('06', t.contact.label)}<h2 id="contact-title">${splitTitle(t.contact.title)}</h2><p>${t.contact.intro}</p></div>${contactForm(lang, site.email)}<div class="contact-bottom"><div class="contact-email"><a href="${e(mailURL(t))}" class="contact-address">${site.email}${icon('arrow')}</a><button class="copy-email" type="button" data-copy-email="${site.email}" data-success="${t.contact.copied}" data-failure="${t.contact.copyFail}" hidden>${icon('copy')}<span>${t.contact.copy}</span></button><span class="sr-only" role="status" data-copy-status></span></div><div class="contact-links"><a href="${site.linkedin}" rel="me">LinkedIn${icon('arrow')}</a><a href="${site.github}" rel="me">GitHub${icon('arrow')}</a><a href="${site.cv}${t.path === '/en/' ? 'en/' : ''}">${t.cv}${icon('arrow')}</a></div></div></div></section>`;
}

export function renderPage(lang, { notFound = false } = {}) {
  const t = locales[lang];
  if (!t) throw new Error(`Unsupported language: ${lang}`);
  const paths = { es: '/', en: '/en/' };
  if (notFound) return document(lang, `<main class="not-found wrap" id="main" tabindex="-1"><p class="eyebrow">404</p><h1>${t.notFoundHeading}</h1><p>${t.notFoundText}</p><a class="button button-primary" href="${t.path}">${t.backHome}${icon('arrowRight')}</a></main>`, { title: `${t.notFoundHeading} | ${site.name}`, description: t.description, paths: { ...paths, [lang]: '/404.html' }, notFound: true });
  return document(lang, `<main id="main" tabindex="-1">${hero(t)}${about(lang, t)}${skillExplorer(lang, t)}${career(lang, t)}${projectSection(lang, t)}${processSection(t)}${noteSection(lang, t)}${contact(t, lang)}</main>`, { title: t.title, description: t.description, paths, home: true });
}

export function renderProject(lang, project) {
  const t = locales[lang], p = project[lang], paths = { es: projectPath(project, 'es'), en: projectPath(project, 'en') };
  const live = `${project.live}${lang === 'en' ? '/en/' : '/'}`;
  const content = `<main id="main" tabindex="-1"><article class="case-study wrap"><header class="detail-heading"><a class="back-link" href="${t.path}#proyectos">← ${t.backProjects}</a><p class="eyebrow">${p.type} / 2026</p><h1>${e(p.title)}</h1><p class="detail-lead">${e(p.summary)}</p><div class="hero-actions"><a class="button button-primary" href="${live}">${t.visit}${icon('arrow')}</a>${project.repository ? `<a class="text-link" href="${project.repository}">${t.source}${icon('github')}</a>` : ''}</div></header><figure class="case-image"><img src="${project.caseImage ?? project.image}" alt="${e(project.name)}" width="1280" height="900"><figcaption>${project.id === 'cv' ? t.projects.cvCaption : t.projects.imageCaption}</figcaption></figure><div class="case-content"><aside class="case-facts"><span class="small-label">${t.projects.overview}</span><h2>${e(project.name)}</h2><h3>${t.projects.scope}</h3><p>${e(p.contribution)}</p><h3>${t.projects.stack}</h3>${tags(project.stack)}<a class="text-link" href="${cvURL(lang)}">${t.cv}${icon('arrow')}</a></aside><div class="prose"><section><h2>${t.projects.problem}</h2><p>${e(p.problem)}</p></section><section><h2>${t.projects.approach}</h2><ul>${p.approach.map(item => `<li>${e(item)}</li>`).join('')}</ul></section><section><h2>${t.projects.result}</h2><p>${e(p.result)}</p></section><a class="button button-secondary" href="${t.path}#contacto">${t.contactNav}${icon('arrowRight')}</a></div></div></article><div class="detail-end wrap"><a class="text-link" href="${t.path}#proyectos">← ${t.backProjects}</a><a class="text-link" href="${t.path}#conocimiento">${t.backNotes}${icon('arrowRight')}</a></div></main>`;
  return document(lang, content, { title: `${project.name} — ${p.title} | ${site.name}`, description: p.summary, paths });
}

export function renderNote(lang, note) {
  const t = locales[lang], n = note[lang], paths = { es: notePath(note, 'es'), en: notePath(note, 'en') };
  const content = `<main id="main" tabindex="-1"><article class="note-article wrap"><header class="detail-heading"><a class="back-link" href="${t.path}#conocimiento">← ${t.backNotes}</a><p class="eyebrow">${note.category[lang]} / ${t.notes.type}</p><h1>${e(n.title)}</h1><p class="detail-lead">${e(n.summary)}</p><div class="article-byline"><img src="/assets/sergio-hernandez.jpeg" alt="" width="40" height="40"><span>${t.notes.by}</span><time datetime="${note.date}">${t.notes.date}</time></div></header><div class="article-layout"><aside class="article-toc"><span class="small-label">${t.notes.contents}</span><ol>${n.sections.map((s, i) => `<li><a href="#section-${i + 1}">${e(s.title)}</a></li>`).join('')}</ol></aside><div class="prose"><p class="article-intro">${e(n.intro)}</p>${n.sections.map((s, i) => `<section id="section-${i + 1}"><h2>${e(s.title)}</h2>${s.paragraphs.map(p => `<p>${e(p)}</p>`).join('')}</section>`).join('')}<aside class="takeaway"><span class="small-label">${t.notes.takeaway}</span><p>${e(n.takeaway)}</p></aside><section class="note-references"><h2>${t.notes.references}</h2><ul>${note.references.map(ref => `<li><a href="${ref.url}">${e(ref.title)}</a></li>`).join("")}</ul></section><a class="text-link" href="${t.path}#contacto">${t.contactNav}${icon('arrow')}</a></div></div></article><section class="related-notes wrap" aria-labelledby="related-title"><p class="eyebrow">${t.notes.label}</p><h2 id="related-title">${t.related}</h2><div class="notes-grid">${noteCards(lang, t, notes.filter(item => item.id !== note.id))}</div></section></main>`;
  return document(lang, content, { title: `${n.title} | ${site.name}`, description: n.summary, paths });
}
