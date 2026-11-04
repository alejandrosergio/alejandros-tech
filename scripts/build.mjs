import { mkdir, readdir, writeFile, readFile, copyFile, stat, lstat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage, renderProject, renderNote } from '../src/components/page.mjs';
import { site } from '../src/content/site.mjs';
import { routeGroups } from '../src/content/routes.mjs';

export const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const clientFiles = ['theme-init.js', 'preferences.js', 'loader-rays.js', 'site.js', 'journey.js', 'letter-glitch.js', 'splash-cursor.js', 'contact.js', 'form-rules.js'];

async function copyDirectory(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const destination = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDirectory(source, destination);
    else if (entry.isFile()) await copyFile(source, destination);
  }
}

export async function build() {
  const dist = path.join(root, 'dist');
  if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Unsafe output directory');
  const previous = await lstat(dist).catch(error => { if (error.code !== 'ENOENT') throw error; return null; });
  if (previous?.isSymbolicLink()) throw new Error('Output must not be a symbolic link');
  await rm(dist, { recursive: true, force: true });
  await mkdir(path.join(dist, 'en'), { recursive: true });
  await copyDirectory(path.join(root, 'public'), dist);
  const styles = await Promise.all(['styles.css', 'preferences.css', 'loader.css', 'journey.css', 'hero.css', 'background.css', 'splash.css', 'interactions.css', 'reveals.css', 'modules.css'].map(file => readFile(path.join(root, 'src/styles', file), 'utf8')));
  await writeFile(path.join(dist, 'assets/styles.css'), styles.join('\n'));
  for (const file of clientFiles) {
    await copyFile(path.join(root, 'src/client', file), path.join(dist, 'assets', file));
  }
  for (const route of routeGroups) for (const lang of ['es', 'en']) {
    const directory = path.join(dist, route.paths[lang].slice(1));
    await mkdir(directory, { recursive: true });
    const html = route.type === 'home' ? renderPage(lang) : route.type === 'project' ? renderProject(lang, route.entity) : renderNote(lang, route.entity);
    await writeFile(path.join(directory, 'index.html'), html);
  }
  await writeFile(path.join(dist, '404.html'), renderPage('es', { notFound: true }));
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${routeGroups.flatMap(route => ['es', 'en'].map(lang => `<url><loc>${site.origin}${route.paths[lang]}</loc><xhtml:link rel="alternate" hreflang="es" href="${site.origin}${route.paths.es}"/><xhtml:link rel="alternate" hreflang="en" href="${site.origin}${route.paths.en}"/></url>`)).join('')}</urlset>\n`);
  const total = (await Promise.all(['index.html', 'assets/styles.css', ...clientFiles.map(file => `assets/${file}`)].map(file => stat(path.join(dist, file))))).reduce((sum, entry) => sum + entry.size, 0);
  return { pages: routeGroups.flatMap(route => Object.values(route.paths)), initialAssetsBytes: total };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify({ built: true, ...(await build()) }));
}
