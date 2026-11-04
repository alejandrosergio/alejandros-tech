const paths = {
  arrowUp: '<path d="M12 19V5m-6 6 6-6 6 6"/>',
  settings: '<path d="m9.5 3-.6 2.1-1.8 1L5 5.5 2.5 9.8 4 11.3v2L2.5 15 5 19.3l2.1-.6 1.8 1 .6 2.1h5l.6-2.1 1.8-1 2.1.6 2.5-4.3-1.5-1.6v-2L21.5 9.8 19 5.5l-2.1.6-1.8-1L14.5 3Z"/><circle cx="12" cy="12.4" r="3.2"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  arrowRight: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',
  moon: '<path d="M20.8 13a9 9 0 0 1-9.8-9.8A9 9 0 1 0 20.8 13Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10v7M7.5 7v.1M11 17v-7m0 3c0-4 6-4 6 0v4"/>',
  github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.3a5.7 5.7 0 0 0-1.5-4c.2-.7.6-2.6-.2-4 0 0-1.3-.4-4.2 1.5a14.6 14.6 0 0 0-7.6 0C4.4-.4 3.1 0 3.1 0c-.8 1.4-.4 3.3-.2 4a5.7 5.7 0 0 0-1.5 4c0 5.7 3.5 6.9 6.8 7.3A3.5 3.5 0 0 0 7 18v4" transform="translate(1 1) scale(.9)"/>'
};

export function icon(name, className = '') {
  if (!paths[name]) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon ${className}" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}
