/* Letter Glitch · integrated Canvas adaptation for Alejandro’sTech.
 * Grid/letter mutation concept and Pixel preset: React Bits, (c) 2026 David Haz.
 * Source blob 19b40635beb5c05b0e3881e5dbd79e453be22ca4.
 * MIT + Commons Clause: /assets/licenses/react-bits.txt; docs/THIRD_PARTY.md.
 * Local pixel alphabet, renderer, quiet lifecycle and site integration are original.
 */
(() => {
  const layer = document.querySelector('[data-letter-glitch]');
  if (!layer) return;
  const canvas = layer.querySelector('[data-letter-canvas]'), root = document.documentElement;
  let context;
  try { context = canvas.getContext('2d', { alpha: true }); } catch { return; }
  if (!context) return;
  const controls = [...document.querySelectorAll('[data-background-motion]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), forced = matchMedia('(forced-colors: active)');
  const palette = ['#ffffff', '#ff6b6b', '#40ffaa', '#4079ff'];
  // Five by seven pixels: a local alphabet, not a downloaded font or image atlas.
  const glyphs = [
    [14,17,17,31,17,17,17], [30,17,17,30,17,17,30], [14,17,16,16,16,17,14], [30,17,17,17,17,17,30],
    [31,16,16,30,16,16,31], [31,16,16,30,16,16,16], [14,17,16,23,17,17,15], [17,17,17,31,17,17,17],
    [14,4,4,4,4,4,14], [7,2,2,2,18,18,12], [17,18,20,24,20,18,17], [16,16,16,16,16,16,31],
    [17,27,21,21,17,17,17], [17,25,21,19,17,17,17], [14,17,17,17,17,17,14], [30,17,17,30,16,16,16],
    [14,17,17,17,21,18,13], [30,17,17,30,20,18,17], [15,16,16,14,1,1,30], [31,4,4,4,4,4,4],
    [17,17,17,17,17,17,14], [17,17,17,17,17,10,4], [17,17,17,21,21,21,10], [17,17,10,4,10,17,17],
    [17,17,10,4,4,4,4], [31,1,2,4,8,16,31]
  ];
  let cells = [], step = 21, timer = 0, resizeTimer = 0, visible = true, paused = false, dirty = true, seed = 1349;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const excluded = () => forced.matches || root.dataset.contrast === 'true';
  const quiet = () => reduced.matches || root.dataset.motion === 'true';
  const present = () => visible && !document.hidden && !excluded();
  const active = () => present() && !quiet() && !paused;
  function stop() {
    if (timer) clearTimeout(timer);
    if (resizeTimer) clearTimeout(resizeTimer);
    timer = resizeTimer = 0;
  }
  function drawCell(cell) {
    context.clearRect(cell.x, cell.y, step, step);
    if (!cell.shown) return;
    context.fillStyle = palette[cell.color]; context.globalAlpha = cell.alpha;
    const rows = glyphs[cell.glyph], left = Math.round(cell.x + (step - 7) / 2), top = Math.round(cell.y + (step - 10) / 2);
    for (let y = 0; y < 7; y++) for (let x = 0; x < 5; x++) if (rows[y] & (1 << (4 - x))) context.fillRect(left + x * 1.25, top + y * 1.25, 1, 1);
    context.globalAlpha = 1;
  }
  function rebuild() {
    const box = layer.getBoundingClientRect(), width = Math.max(1, box.width), height = Math.max(1, box.height), compact = width < 700;
    const budget = compact ? 360000 : 720000, maxCells = compact ? 1400 : 3600;
    const ratio = Math.min(devicePixelRatio || 1, compact ? 1 : 1.25, Math.sqrt(budget / (width * height)));
    canvas.width = Math.max(1, Math.floor(width * ratio)); canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0); context.imageSmoothingEnabled = false;
    step = Math.max(compact ? 26 : 21, Math.ceil(Math.sqrt(width * height / maxCells)));
    while (Math.ceil(width / step) * Math.ceil(height / step) > maxCells) step++;
    const columns = Math.ceil(width / step), rows = Math.ceil(height / step), density = compact ? .48 : .68;
    seed = 1349; cells = [];
    for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
      const color = random(), cell = { x: column * step, y: row * step, shown: random() < density, glyph: Math.floor(random() * glyphs.length), color: color < .55 ? 0 : 1 + Math.floor((color - .55) / .15), alpha: .16 + random() * .18 };
      cells.push(cell); drawCell(cell);
    }
    layer.dataset.cells = String(cells.length); layer.dataset.enhanced = 'true'; canvas.hidden = false; dirty = false;
  }
  function schedule() { if (!timer && active()) timer = setTimeout(tick, 180); }
  function tick() {
    timer = 0;
    if (!active()) return;
    // Only a handful of tiny glyphs change; no area-wide flashes or full redraw.
    const amount = Math.max(1, Math.floor(cells.length * .0018));
    for (let i = 0; i < amount; i++) {
      const cell = cells[Math.floor(random() * cells.length)];
      if (!cell) continue;
      cell.glyph = Math.floor(random() * glyphs.length);
      if (random() < .35) cell.color = Math.floor(random() * palette.length);
      drawCell(cell);
    }
    schedule();
  }
  function sync() {
    stop(); layer.hidden = excluded(); layer.dataset.motion = quiet() || paused ? 'static' : 'active'; layer.dataset.paused = String(paused || quiet());
    for (const control of controls) {
      control.hidden = excluded(); control.disabled = quiet(); control.setAttribute('aria-pressed', String(paused || quiet()));
      control.textContent = paused || quiet() ? control.dataset.play : control.dataset.pause;
    }
    if (!present()) return;
    if (dirty) rebuild();
    schedule();
  }
  function resize() {
    dirty = true;
    if (!resizeTimer && present()) resizeTimer = setTimeout(() => { resizeTimer = 0; sync(); }, 120);
  }
  controls.forEach(control => control.addEventListener('click', () => { paused = !paused; sync(); }));
  document.addEventListener('alejandro:background-motion', event => { if (typeof event.detail?.paused === 'boolean') { paused = event.detail.paused; sync(); } });
  document.addEventListener('alejandro:preferences', sync); document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-contrast'] });
  for (const media of [reduced, forced]) media.addEventListener('change', sync);
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(layer);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(layer);
  window.addEventListener('pagehide', () => { visible = false; stop(); });
  window.addEventListener('pageshow', () => { visible = true; dirty = true; sync(); });
  sync();
})();
