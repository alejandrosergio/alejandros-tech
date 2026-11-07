import { site } from '../content/site.mjs';
import { locales } from '../content/locales.mjs';
import { projectName, projectDestination } from '../content/projects.mjs';
import { escapeHTML as e, scriptJSON } from '../lib/html.mjs';

const absolute = pathname => new URL(pathname, site.origin).href;
const personID = `${site.origin}/#sergio-hernandez`;
const websiteID = `${site.origin}/#website`;
const portrait = '/assets/sergio-natural-appearance.webp';

function structuredData(lang, options, image) {
  const { title, description, paths, home, project, note } = options;
  const url = absolute(paths[lang]), pageID = `${url}#webpage`;
  const person = { '@type': 'Person', '@id': personID, name: 'Sergio Alejandro Hernández Patiño', url: absolute('/'), image: absolute(portrait), jobTitle: locales[lang].hero.kicker, description: locales[lang].about.intro, sameAs: [site.linkedin, site.github, site.cv] };
  const website = { '@type': 'WebSite', '@id': websiteID, name: site.name, url: absolute('/'), inLanguage: ['es', 'en'], publisher: { '@id': personID } };
  const page = { '@type': home ? 'ProfilePage' : 'WebPage', '@id': pageID, url, name: title, description, inLanguage: lang, isPartOf: { '@id': websiteID }, primaryImageOfPage: { '@type': 'ImageObject', url: absolute(image) } };
  const graph = [person, website, page];
  if (home) page.mainEntity = { '@id': personID };
  else {
    const breadcrumbID = `${url}#breadcrumb`;
    page.breadcrumb = { '@id': breadcrumbID };
    graph.push({ '@type': 'BreadcrumbList', '@id': breadcrumbID, itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'es' ? 'Inicio' : 'Home', item: absolute(locales[lang].path) },
      { '@type': 'ListItem', position: 2, name: note?.[lang].title ?? (project ? projectName(project, lang) : title), item: url }
    ] });
    if (note) {
      page.mainEntity = { '@id': `${url}#article` };
      graph.push({ '@type': 'BlogPosting', '@id': `${url}#article`, headline: note[lang].title, description, datePublished: note.date, inLanguage: lang, author: { '@id': personID }, mainEntityOfPage: { '@id': pageID }, image: absolute(image) });
    } else if (project) {
      page.mainEntity = { '@id': `${url}#project` };
      graph.push({ '@type': 'CreativeWork', '@id': `${url}#project`, name: projectName(project, lang), description, url: absolute(projectDestination(project, lang)), creator: { '@id': personID }, mainEntityOfPage: { '@id': pageID }, image: absolute(image) });
    }
  }
  return `<script type="application/ld+json">${scriptJSON({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

export function metadata(lang, options) {
  const { title, description, paths, notFound, project, note } = options;
  const image = options.image ?? project?.image[lang] ?? portrait, imageAlt = options.imageAlt ?? project?.[lang].imageAlt ?? locales[lang].hero.portrait;
  const canonical = notFound ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${absolute(paths[lang])}">
  ${['es', 'en'].map(language => `<link rel="alternate" hreflang="${language}" href="${absolute(paths[language])}">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${absolute(paths.es)}">`;
  return `<title>${e(title)}</title>
  <meta name="description" content="${e(description)}">
  <meta name="author" content="Sergio Alejandro Hernández Patiño">
  <meta name="theme-color" content="#0e0e10">
  ${canonical}
  <meta property="og:type" content="${note ? 'article' : 'website'}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${e(title)}">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:url" content="${absolute(paths[lang])}">
  <meta property="og:locale" content="${lang === 'es' ? 'es_CO' : 'en_US'}">
  <meta property="og:locale:alternate" content="${lang === 'es' ? 'en_US' : 'es_CO'}">
  <meta property="og:image" content="${absolute(image)}">
  <meta property="og:image:alt" content="${e(imageAlt)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${e(title)}">
  <meta name="twitter:description" content="${e(description)}">
  <meta name="twitter:image" content="${absolute(image)}">
  <meta name="twitter:image:alt" content="${e(imageAlt)}">${notFound ? '' : '\n  ' + structuredData(lang, options, image)}`;
}
