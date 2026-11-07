import { letterGlitchLook } from '../content/background.mjs';
import { escapeHTML } from '../lib/html.mjs';

// The optional surface is decorative; all content works without this canvas.
export function letterGlitch() {
  return `<div class="letter-backdrop" data-letter-glitch data-preset="classic" data-look="${escapeHTML(JSON.stringify(letterGlitchLook))}" aria-hidden="true"><canvas class="letter-canvas" data-letter-canvas hidden></canvas></div>`;
}
