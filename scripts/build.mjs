import { mkdir, readdir, writeFile, copyFile, stat, lstat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from '../src/components/page.mjs';
import { site } from '../src/content/site.mjs';

export const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

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
  await copyFile(path.join(root, 'src/styles/styles.css'), path.join(dist, 'assets/styles.css'));
  for (const file of ['theme-init.js', 'site.js']) {
    await copyFile(path.join(root, 'src/client', file), path.join(dist, 'assets', file));
  }
  await writeFile(path.join(dist, 'index.html'), renderPage('es'));
  await writeFile(path.join(dist, 'en/index.html'), renderPage('en'));
  await writeFile(path.join(dist, '404.html'), renderPage('es', { notFound: true }));
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${['/', '/en/'].map(route => `<url><loc>${site.origin}${route}</loc><xhtml:link rel="alternate" hreflang="es" href="${site.origin}/"/><xhtml:link rel="alternate" hreflang="en" href="${site.origin}/en/"/></url>`).join('')}</urlset>\n`);
  const total = (await Promise.all(['index.html', 'assets/styles.css', 'assets/site.js', 'assets/theme-init.js', 'assets/brand-mark.svg', 'favicon.svg'].map(file => stat(path.join(dist, file))))).reduce((sum, entry) => sum + entry.size, 0);
  return { pages: ['/', '/en/'], initialAssetsBytes: total };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify({ built: true, ...(await build()) }));
}
