// Brand artwork is served locally. Concepts without a product logo use our
// own line icons, so the explorer never suggests a vendor or certification.
const logos = {
  net: ['dot-net'], csharp: ['csharp'], react: ['react'],
  typescript: ['typescript'], web: ['html5', 'css3'], html: ['html5'], css: ['css3'],
  powerapps: ['powerapps'], dataverse: ['dataverse'],
  automate: ['powerautomate'], powerbi: ['powerbi'],
  sql: ['microsoftsqlserver'], ef: ['entityframeworkcore'], azure: ['azure'],
  oauth: ['oauth'], git: ['git', 'github'], node: ['nodejs'],
  copilot: ['copilot-studio'], 'ai-builder': ['ai-builder'],
  sap: ['sap'], sharepoint: ['sharepoint'], alm: ['azuredevops'],
};

const concepts = {
  pcf: '<path d="M9 3H4v5a3 3 0 1 1 0 6v6h6a3 3 0 1 1 6 0h5v-6a3 3 0 1 0 0-6V3h-6a3 3 0 1 1-6 0Z"/>',
  api: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  ai: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4m-13-3h6m-3-3v6"/>',
  rag: '<path d="M3 3h6v8H3zm12 10h6v8h-6zM12 5h7v5M5 14v5h7m-5-2-2 2-2-2m14-9 2 2 2-2M9 7h3m0 10h3"/>',
};

export function technologyIcon(id) {
  if (logos[id]) return `<span class="technology-mark" aria-hidden="true">${logos[id].map(name => `<span class="technology-logo"><img src="/assets/technologies/${name}.svg" width="32" height="32" alt="" loading="lazy" decoding="async"></span>`).join('')}</span>`;
  if (!concepts[id]) throw new Error(`Missing technology icon: ${id}`);
  return `<span class="technology-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false">${concepts[id]}</svg></span>`;
}
