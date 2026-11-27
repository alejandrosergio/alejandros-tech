import { readdirSync } from 'node:fs';
import { skills } from '../content/profile.mjs';
// Brand artwork is served locally. Concepts without a product logo use our
// own line icons, so the explorer never suggests a vendor or certification.
const logos = {
  net: ['dot-net'], csharp: ['csharp'], react: ['react'],
  typescript: ['typescript'], web: ['html5', 'css3'], html: ['html5'], css: ['css3'],
  powerapps: ['powerapps'], dataverse: ['dataverse'],
  automate: ['powerautomate'], powerbi: ['powerbi'],
  sql: ['microsoftsqlserver'], ef: ['entityframeworkcore'], azure: ['azure'],
  oauth: ['oauth'], git: ['git', 'github'], 'git-only': ['git'], node: ['nodejs'],
  copilot: ['copilot-studio'], 'ai-builder': ['ai-builder'],
  sap: ['sap'], sharepoint: ['sharepoint'],
};

const concepts = {
  pcf: '<path d="M9 3H4v5a3 3 0 1 1 0 6v6h6a3 3 0 1 1 6 0h5v-6a3 3 0 1 0 0-6V3h-6a3 3 0 1 1-6 0Z"/>',
  api: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  ai: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4m-13-3h6m-3-3v6"/>',
  rag: '<path d="M3 3h6v8H3zm12 10h6v8h-6zM12 5h7v5M5 14v5h7m-5-2-2 2-2-2m14-9 2 2 2-2M9 7h3m0 10h3"/>',
  alm: '<path d="M3 5h5v5H3zm13 9h5v5h-5zM8 7h10v7M5 10v7h11"/>',
};

const files = new Set(readdirSync(new URL('../../public/assets/technologies/', import.meta.url)).filter(name => name.endsWith('.svg')).map(name => name.slice(0, -4)));
const aliases = { actions: 'githubactions', gemini: 'googlegemini', wasm: 'webassembly', cal: 'caldotcom', sites: 'chatgpt' };
const symbolGroups = new Map(skills.map(skill => [skill.mark, skill.group]));
const symbols = {
  methods: '<path d="M4 4h6v6H4zm10 10h6v6h-6zM10 7h7v7M7 10v7h7"/>',
  ai: concepts.ai,
  data: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  cloud: '<path d="M6 18a5 5 0 0 1-1-10 7 7 0 0 1 13-1 6 6 0 0 1 0 11H6Z"/>',
  collaboration: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17h7m-4-3v7"/>',
  tools: '<path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 3l-4 18"/>',
  integration: '<rect x="2" y="8" width="7" height="8" rx="2"/><rect x="15" y="8" width="7" height="8" rx="2"/><path d="M9 10h6m-6 4h6"/>'
};

export function technologyIcon(id) {
  const artwork = logos[id] || (files.has(aliases[id] || id) ? [aliases[id] || id] : null);
  if (artwork) return `<span class="technology-mark" aria-hidden="true">${artwork.map(name => `<span class="technology-logo"><img src="/assets/technologies/${name}.svg" width="32" height="32" alt="" loading="lazy" decoding="async"></span>`).join('')}</span>`;
  if (!concepts[id] && !symbolGroups.has(id)) throw new Error(`Missing technology icon: ${id}`);
  const symbol = concepts[id] || symbols[symbolGroups.get(id)] || symbols.tools;
  return `<span class="technology-mark" data-symbol="${id}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false">${symbol}</svg></span>`;
}
