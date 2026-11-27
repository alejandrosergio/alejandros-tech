import { transform } from 'esbuild';

export const stylesheetFiles = Object.freeze([
  'styles.css', 'preferences.css', 'loader.css', 'journey.css', 'hero.css',
  'background.css', 'splash.css', 'soundtrack.css', 'interactions.css',
  'reveals.css', 'modules.css', 'document-assistant.css', 'lab.css',
  'booking.css', 'project-technologies.css', 'project-video.css', 'footer.css', 'technology-explorer.css'
]);

// These files retain their entrypoints and relative imports. The optional AI
// controllers and worker are bundled separately by the existing build step.
export const clientFiles = Object.freeze([
  'theme-init.js', 'preferences.js', 'loader-grid.js', 'site.js', 'journey.js',
  'letter-glitch.js', 'splash-cursor.js', 'soundtrack.js', 'project-video.js',
  'contact.js', 'booking.js', 'booking-embed.js', 'form-rules.js', 'technology-explorer.js'
]);

export function attributionHeader(source) {
  const comment = source.match(/^\s*(\/\*[\s\S]*?\*\/)/)?.[1] || '';
  return /copyright|\(c\)|@license|SPDX-License-Identifier|Commons Clause/i.test(comment) ? comment : '';
}

export async function optimizeAsset(source, { loader, sourcefile }) {
  const { code } = await transform(source, {
    loader, sourcefile, minify: true, charset: 'utf8', legalComments: 'inline',
    ...(loader === 'js' ? { target: 'es2022' } : {}), logLevel: 'warning'
  });
  // Existing upstream notices use ordinary block comments, which esbuild would
  // otherwise remove. Keep their attribution and full local licence reference.
  const attribution = attributionHeader(source);
  return attribution && !code.includes(attribution) ? `${attribution}\n${code}` : code;
}

export function pageEntryAssets(html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  const assets = new Set();
  for (const tag of head.matchAll(/<(?:script|link)\b[^>]*>/gi)) {
    const script = /^<script\b/i.test(tag[0]);
    if (!script && !/\brel="stylesheet"/i.test(tag[0])) continue;
    const href = tag[0].match(script ? /\bsrc="([^"]+)"/i : /\bhref="([^"]+)"/i)?.[1];
    if (href?.startsWith('/assets/')) assets.add(href.slice(1));
  }
  return [...assets];
}
