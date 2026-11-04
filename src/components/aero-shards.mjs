// Decorative static alternative to the native WebGL adaptation of Aero Shards.
export function aeroShards() {
  const shards = [];
  for (let layer = 0; layer < 3; layer++) for (let i = 0; i < 43; i++) {
    const s = i / 42, x = -80 + s * 1160;
    const y = 330 + (layer - 1) * 75 + Math.sin(s * 4.6 + layer * 1.9) * 100 + Math.sin(i * 7.1) * 24;
    const size = 8 + (i * 17 % 13), angle = Math.cos(s * 4.6 + layer * 1.9) * 19;
    shards.push(`<path d="M${-size} -4 ${size} 0 ${(-size * .6).toFixed(1)} 6Z" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})" opacity="${(.15 + (i % 5) * .07).toFixed(2)}"/>`);
  }
  return `<div class="aero-backdrop" data-aero-backdrop aria-hidden="true"><svg class="aero-fallback" viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid slice" fill="currentColor" stroke="currentColor" stroke-width=".7">${shards.join('')}<g fill="none" stroke-width="1.2" opacity=".3"><path d="M720 130h10m-5-5v10M815 470h10m-5-5v10M465 160h10m-5-5v10M930 250h10m-5-5v10M600 550h10m-5-5v10"/></g></svg><canvas class="aero-canvas" data-aero-canvas hidden></canvas></div>`;
}
