import { site } from '../content/site.mjs';
import { locales } from '../content/locales.mjs';
import { icon } from './icons.mjs';

export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function head(lang, t, pagePath, notFound) {
  const title = notFound ? `${t.notFoundHeading} | ${site.name}` : t.title;
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHTML(title)}</title>
  <meta name="description" content="${escapeHTML(t.description)}">
  <meta name="theme-color" content="#f0f5fc">
  ${notFound ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${site.origin}${pagePath}">
  <link rel="alternate" hreflang="es" href="${site.origin}/">
  <link rel="alternate" hreflang="en" href="${site.origin}/en/">
  <link rel="alternate" hreflang="x-default" href="${site.origin}/">`}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${escapeHTML(title)}">
  <meta property="og:description" content="${escapeHTML(t.description)}">
  <meta property="og:url" content="${site.origin}${pagePath}">
  <meta property="og:locale" content="${lang === 'es' ? 'es_CO' : 'en_US'}">
  <meta property="og:locale:alternate" content="${lang === 'es' ? 'en_US' : 'es_CO'}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
  <script src="/assets/theme-init.js"></script>
  <script src="/assets/site.js" defer></script>${notFound ? '' : '\n  <script src="/assets/brand-3d.js" defer></script>'}
</head>`;
}

function header(lang, t) {
  return `<header class="site-header wrap">
    <a class="wordmark" href="${t.path}" aria-label="${site.name}">
      <img src="/assets/brand-mark.svg" width="40" height="40" alt="" fetchpriority="high">
      <span>Alejandro’s<span class="wordmark-accent">Tech</span></span>
    </a>
    <div class="header-controls">
      <nav class="languages" aria-label="${t.languages}">
        <a href="/" lang="es" hreflang="es" title="Español"${lang === 'es' ? ' aria-current="page"' : ''}>ES</a>
        <span aria-hidden="true">/</span>
        <a href="/en/" lang="en" hreflang="en" title="English"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a>
      </nav>
      <button class="theme-button" type="button" data-theme-toggle aria-label="${t.themeLabel}" title="${t.themeLabel}" hidden>${icon('moon', 'moon-icon')}${icon('sun', 'sun-icon')}</button>
    </div>
  </header>`;
}

function artwork(t) {
  return `<figure class="artwork" aria-label="${t.diagramLabel}" data-brand-art>
    <div class="brand-stage" data-brand-stage data-label="${t.modelLabel}" data-help="${t.modelKeyboard}">
    <canvas class="brand-canvas" data-brand-canvas aria-hidden="true" hidden></canvas>
    <svg class="network-art brand-fallback" viewBox="0 0 520 510" fill="none" aria-hidden="true" width="520" height="510">
      <defs>
        <linearGradient id="orbit" x1="70" y1="60" x2="450" y2="460"><stop stop-color="#008bd9"/><stop offset=".55" stop-color="#6e9fe8"/><stop offset="1" stop-color="#9e79ce"/></linearGradient>
        <radialGradient id="glow"><stop stop-color="#75bfff" stop-opacity=".23"/><stop offset="1" stop-color="#75bfff" stop-opacity="0"/></radialGradient>
        <linearGradient id="tile" x1="190" y1="180" x2="330" y2="330"><stop stop-color="#163d66"/><stop offset="1" stop-color="#0a203b"/></linearGradient>
      </defs>
      <circle cx="260" cy="250" r="250" fill="url(#glow)"/>
      <g class="art-grid" stroke="currentColor" stroke-opacity=".13">
        <path d="M65 190h390M65 250h390M65 310h390M140 95v310M200 65v370M260 45v410M320 65v370M380 95v310"/>
      </g>
      <g stroke="url(#orbit)">
        <ellipse cx="260" cy="250" rx="195" ry="95" transform="rotate(-35 260 250)" opacity=".7"/>
        <ellipse cx="260" cy="250" rx="195" ry="95" transform="rotate(35 260 250)" opacity=".42"/>
        <circle cx="260" cy="250" r="173" stroke-dasharray="2 12" opacity=".5"/>
        <path d="M78 372c95-32 257-32 364 0M48 400c135-42 285-42 424 0M26 429c151-44 317-44 468 0" opacity=".2"/>
      </g>
      <g class="orbit-spark"><circle cx="403" cy="123" r="10" fill="#e8f3ff" stroke="#008bd9"/><circle cx="403" cy="123" r="3" fill="#008bd9"/></g>
      <g class="orbit-spark spark-two"><circle cx="104" cy="324" r="8" fill="#e8f3ff" stroke="#6f8ee2"/><circle cx="104" cy="324" r="2.5" fill="#6f8ee2"/></g>
      <path d="m351 374 10 10-10 10-10-10Z" fill="#e8f3ff" stroke="#9e79ce"/>
      <rect class="center-shadow" x="186" y="176" width="148" height="148" rx="36" fill="url(#tile)"/>
      <rect x="194" y="184" width="132" height="132" rx="29" stroke="#75bfff" stroke-opacity=".4"/>
      <path d="m225 280 35-68 35 68m-59-19h48" stroke="#f3f7ff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M284 213h17m-8-8v17" stroke="#75bfff" stroke-width="3.5" stroke-linecap="round"/>
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect class="art-node" x="48" y="107" width="66" height="58" rx="16"/>
        <path d="m74 127-7 9 7 9m15-18 7 9-7 9m-6-20-4 22"/>
        <rect class="art-node" x="403" y="279" width="66" height="58" rx="16"/>
        <path d="M419 308h34m-26-8 9 8-9 8m-8-18v20"/>
      </g>
    </svg>
    </div>
    <div class="art-controls" data-art-controls hidden>
      <span id="brand-3d-help" class="art-hint">${t.modelHint}<span class="sr-only">. ${t.modelKeyboard}</span></span>
      <button class="art-motion" type="button" data-art-motion data-pause="${t.modelPause}" data-play="${t.modelPlay}"><span data-motion-icon aria-hidden="true"></span><span data-motion-text></span></button>
    </div>
    <figcaption class="art-caption"><span>${t.development}</span><i aria-hidden="true"></i><span>${t.automation}</span><i aria-hidden="true"></i><span>${t.ai}</span></figcaption>
  </figure>`;
}

function footer(t) {
  return `<footer class="site-footer wrap"><p>${t.footer}</p><small>Copyright © ${site.copyrightYear} ${site.name}. ${t.rights}</small></footer>`;
}

export function renderPage(lang, { notFound = false } = {}) {
  const t = locales[lang];
  if (!t) throw new Error(`Unsupported language: ${lang}`);
  const cvURL = `${site.cv}${lang === 'en' ? 'en/' : ''}`;
  const mailURL = `mailto:${site.email}?subject=${encodeURIComponent(t.emailSubject)}`;
  const content = notFound
    ? `<main id="main" class="wrap not-found"><span class="status"><span class="status-dot"></span>404</span><h1>${t.notFoundHeading}</h1><p>${t.notFoundText}</p><a class="button button-primary" href="${t.path}">${t.home}${icon('arrowRight')}</a></main>`
    : `<main id="main" class="hero wrap">
      <div class="hero-copy">
        <p class="status"><span class="status-dot" aria-hidden="true"></span>${t.status}</p>
        <p class="eyebrow">${t.eyebrow}</p>
        <h1>${t.heading}<span class="brand-heading">Alejandro’s<span>Tech</span><span class="heading-dot" aria-hidden="true">.</span></span></h1>
        <p class="focus">${t.focus}</p>
        <p class="intro">${t.intro}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="${cvURL}" title="${t.cvTitle}">${t.cvLabel}${icon('arrow')}</a>
          <a class="button button-secondary" href="${escapeHTML(mailURL)}" title="${t.emailTitle}">${icon('mail')}${t.emailLabel}</a>
        </div>
        <a class="email-link" href="${escapeHTML(mailURL)}">${site.email}</a>
        <div class="social-links"><span>${t.connect}</span><a href="${site.linkedin}" rel="me" title="${lang === 'es' ? 'LinkedIn de Sergio Hernández' : 'Sergio Hernández on LinkedIn'}">${icon('linkedin')}LinkedIn${icon('arrow', 'external-arrow')}</a><a href="${site.github}" rel="me" title="${lang === 'es' ? 'GitHub de Sergio Hernández' : 'Sergio Hernández on GitHub'}">${icon('github')}GitHub${icon('arrow', 'external-arrow')}</a></div>
      </div>
      ${artwork(t)}
    </main>`;
  return `<!doctype html>
<html lang="${lang}">
${head(lang, t, notFound ? '/404.html' : t.path, notFound)}
<body>
  <a class="skip-link" href="#main">${t.skip}</a>
  ${header(lang, t)}
  ${content}
  ${footer(t)}
</body>
</html>
`;
}
