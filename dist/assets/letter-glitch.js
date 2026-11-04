/* Letter Glitch · integrated Canvas adaptation for Alejandro’sTech.
 * Grid/glyph mutation concept and Pixel preset: React Bits, (c) 2026 David Haz.
 * Source blob 19b40635beb5c05b0e3881e5dbd79e453be22ca4.
 * MIT + Commons Clause: /assets/licenses/react-bits.txt; docs/THIRD_PARTY.md.
 * Local pixel alphabet, renderer, quiet lifecycle and site integration are original.
 */
(() => {
  const layer = document.querySelector('[data-letter-glitch]');
  if (!layer) return;
  const canvas = layer.querySelector('[data-letter-canvas]'), root = document.documentElement;
  const home = document.querySelector('[data-portrait-hero]');
  let context;
  try { context = canvas.getContext('2d', { alpha: true }); } catch { return; }
  if (!context) return;
  const controls = [...document.querySelectorAll('[data-background-motion]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), forced = matchMedia('(forced-colors: active)');
  // Pixel preset: letters, 10px pixel type and the default white/coral palette.
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', palette = ['#ffffff', '#ff6b6b'];
  // Local 5x7 letter shapes keep the pixel treatment independent of fonts.
  const glyphs = [
    [14,17,17,31,17,17,17], [30,17,17,30,17,17,30],
    [14,17,16,16,16,17,14], [30,17,17,17,17,17,30],
    [31,16,16,30,16,16,31], [31,16,16,30,16,16,16],
    [14,17,16,23,17,17,15], [17,17,17,31,17,17,17],
    [14,4,4,4,4,4,14], [7,2,2,2,18,18,12],
    [17,18,20,24,20,18,17], [16,16,16,16,16,16,31],
    [17,27,21,21,17,17,17], [17,25,21,19,17,17,17],
    [14,17,17,17,17,17,14], [30,17,17,30,16,16,16],
    [14,17,17,17,21,18,13], [30,17,17,30,20,18,17],
    [15,16,16,14,1,1,30], [31,4,4,4,4,4,4],
    [17,17,17,17,17,17,14], [17,17,17,17,17,10,4],
    [17,17,17,21,21,21,10], [17,17,10,4,10,17,17],
    [17,17,10,4,4,4,4], [31,1,2,4,8,16,31]
  ];
  let cells = [], shownCells = [], step = 20, glyphPixel = 1.45, glyphInk = 1.25, timer = 0, resizeTimer = 0, homeFrame = 0, homeCut = -1, homeOccluded = Boolean(home), frames = 0, visible = true, paused = false, dirty = true, seed = 1349;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const excluded = () => forced.matches || root.dataset.contrast === 'true';
  const quiet = () => reduced.matches || root.dataset.motion === 'true';
  const present = () => visible && !document.hidden && !excluded() && !homeOccluded;
  const active = () => present() && !quiet() && !paused;
  function stop() {
    if (timer) clearTimeout(timer);
    if (resizeTimer) clearTimeout(resizeTimer);
    if (homeFrame) cancelAnimationFrame(homeFrame);
    timer = resizeTimer = homeFrame = 0;
  }
  function measureHome() {
    if (!home) return;
    const height = Math.max(1, window.innerHeight || layer.getBoundingClientRect().height);
    // Round outward so fractional anchor/zoom positions cannot expose letters
    // under the transparent hero. The mask reveals only the following region.
    const cut = Math.ceil(Math.max(0, Math.min(height, home.getBoundingClientRect().bottom)));
    if (cut !== homeCut) { layer.style.setProperty('--letter-home-cut', `${cut}px`); homeCut = cut; }
    homeOccluded = cut >= height; layer.dataset.homeOccluded = String(homeOccluded);
  }
  function scheduleHome() {
    if (homeFrame || document.hidden) return;
    homeFrame = requestAnimationFrame(() => {
      homeFrame = 0;
      if (document.hidden) return;
      const wasOccluded = homeOccluded; measureHome();
      if (wasOccluded !== homeOccluded) sync();
    });
  }
  function drawCell(cell) {
    context.clearRect(cell.x, cell.y, step, step);
    if (!cell.shown) return;
    context.fillStyle = palette[cell.color]; context.globalAlpha = cell.alpha;
    const rows = glyphs[cell.glyph], left = Math.round(cell.x + (step - 5 * glyphPixel) / 2), top = Math.round(cell.y + (step - 7 * glyphPixel) / 2);
    for (let y = 0; y < 7; y++) for (let x = 0; x < 5; x++) if (rows[y] & (1 << (4 - x))) context.fillRect(left + x * glyphPixel, top + y * glyphPixel, glyphInk, glyphInk);
    context.globalAlpha = 1;
  }
  function rebuild() {
    const box = layer.getBoundingClientRect(), width = Math.max(1, box.width), height = Math.max(1, box.height), compact = width < 700;
    glyphPixel = compact ? 1.35 : 1.45; glyphInk = compact ? 1.15 : 1.25;
    const budget = compact ? 360000 : 720000, maxCells = compact ? 1400 : 3600;
    const ratio = Math.min(devicePixelRatio || 1, compact ? 1 : 1.25, Math.sqrt(budget / (width * height)));
    canvas.width = Math.max(1, Math.floor(width * ratio)); canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0); context.imageSmoothingEnabled = false;
    step = Math.max(compact ? 25 : 20, Math.ceil(Math.sqrt(width * height / maxCells)));
    while (Math.ceil(width / step) * Math.ceil(height / step) > maxCells) step++;
    const columns = Math.ceil(width / step), rows = Math.ceil(height / step), density = compact ? .58 : .8;
    seed = 1349; cells = []; shownCells = [];
    for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
      const color = random(), cell = { x: column * step, y: row * step, shown: random() < density, glyph: Math.floor(random() * glyphs.length), color: color < .7 ? 0 : 1, alpha: .3 + random() * .22 };
      cells.push(cell); if (cell.shown) shownCells.push(cell); drawCell(cell);
    }
    layer.dataset.cells = String(cells.length); layer.dataset.characters = characters; layer.dataset.frames = String(frames); layer.dataset.changedCells = '0'; layer.dataset.enhanced = 'true'; canvas.hidden = false; dirty = false;
  }
  function schedule() { if (!timer && active()) timer = setTimeout(tick, 120); }
  function tick() {
    timer = 0;
    if (!active()) return;
    // Repaint 1.5% of the bounded grid, always selecting visible, distinct
    // letters. Motion remains apparent without changing whole areas at once.
    const amount = Math.min(shownCells.length, Math.max(1, Math.floor(cells.length * .015)));
    for (let i = 0; i < amount; i++) {
      const selected = i + Math.floor(random() * (shownCells.length - i));
      [shownCells[i], shownCells[selected]] = [shownCells[selected], shownCells[i]];
      const cell = shownCells[i];
      cell.glyph = (cell.glyph + 1 + Math.floor(random() * (glyphs.length - 1))) % glyphs.length;
      if (random() < .35) cell.color = cell.color === 0 ? 1 : 0;
      drawCell(cell);
    }
    layer.dataset.frames = String(++frames); layer.dataset.changedCells = String(amount);
    schedule();
  }
  function sync() {
    stop(); layer.hidden = excluded(); layer.dataset.motion = quiet() || paused ? 'static' : 'active'; layer.dataset.paused = String(paused || quiet());
    measureHome();
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
    const wasOccluded = homeOccluded; measureHome();
    if (wasOccluded !== homeOccluded) { sync(); return; }
    if (!resizeTimer && present()) resizeTimer = setTimeout(() => { resizeTimer = 0; sync(); }, 120);
  }
  controls.forEach(control => control.addEventListener('click', () => { paused = !paused; sync(); }));
  document.addEventListener('alejandro:background-motion', event => { if (typeof event.detail?.paused === 'boolean') { paused = event.detail.paused; sync(); } });
  document.addEventListener('alejandro:preferences', sync); document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-contrast'] });
  for (const media of [reduced, forced]) media.addEventListener('change', sync);
  window.addEventListener('resize', resize);
  if (home) window.addEventListener('scroll', scheduleHome, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(layer);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(layer);
  window.addEventListener('pagehide', () => { visible = false; stop(); });
  window.addEventListener('pageshow', () => { visible = true; dirty = true; sync(); });
  sync();
})();
