/* Letter Glitch Classic · React Bits, (c) 2026 David Haz.
 * Preset 3e75aaadcb43a6f4f683517b217c03ab77a00421, component
 * 19b40635beb5c05b0e3881e5dbd79e453be22ca4; MIT + Commons Clause:
 * /assets/licenses/react-bits.txt. Local Canvas renderer and lifecycle.
 */
(() => {
  const layer = document.querySelector('[data-letter-glitch]');
  if (!layer) return;
  const canvas = layer.querySelector('[data-letter-canvas]'), root = document.documentElement;
  const home = document.querySelector('[data-portrait-hero]');
  let context, look;
  try { context = canvas.getContext('2d', { alpha: true }); look = JSON.parse(layer.dataset.look); } catch { return; }
  if (!context || !look.characters || !look.dark?.colors?.length || !look.light?.colors?.length) return;

  const controls = [...document.querySelectorAll('[data-background-motion]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), forced = matchMedia('(forced-colors: active)');
  const FRAME_MS = 40, MUTATION_MS = 100;
  let cells = [], selection = [], hot = new Set(), cellWidth = 10, cellHeight = 15;
  let timer = 0, resizeTimer = 0, homeFrame = 0, homeCut = -1, homeOccluded = Boolean(home);
  let frames = 0, visible = true, paused = false, dirty = true, seed = 1349, last = 0, carry = 0, compact = false;
  let base = [], palette = [], theme = '';
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const rgb = hex => [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16));
  const excluded = () => forced.matches || root.dataset.contrast === 'true';
  const quiet = () => reduced.matches || root.dataset.motion === 'true';
  const present = () => visible && !document.hidden && root.dataset.loading !== 'true' && !excluded() && !homeOccluded;
  const active = () => present() && !quiet() && !paused;

  function stop() {
    clearTimeout(timer); clearTimeout(resizeTimer); cancelAnimationFrame(homeFrame);
    timer = resizeTimer = homeFrame = 0;
  }
  function measureHome() {
    if (!home) return;
    const height = Math.max(1, window.innerHeight || layer.getBoundingClientRect().height);
    const cut = Math.ceil(Math.max(0, Math.min(height, home.getBoundingClientRect().bottom)));
    if (cut !== homeCut) { layer.style.setProperty('--letter-home-cut', `${cut}px`); homeCut = cut; }
    homeOccluded = cut >= height; layer.dataset.homeOccluded = String(homeOccluded);
  }
  function scheduleHome() {
    if (homeFrame || document.hidden || root.dataset.loading === 'true') return;
    homeFrame = requestAnimationFrame(() => {
      homeFrame = 0;
      if (document.hidden || root.dataset.loading === 'true') return;
      const wasOccluded = homeOccluded; measureHome();
      if (wasOccluded !== homeOccluded) sync();
    });
  }
  function paint(cell) {
    context.clearRect(cell.x, cell.y, cellWidth, cellHeight);
    if (!cell.shown) return;
    const color = palette[cell.color];
    context.fillStyle = `rgb(${base.map((value, i) => Math.round(value + (color[i] - value) * cell.heat)).join(',')})`;
    context.globalAlpha = cell.opacity * look.baseOpacity;
    context.fillText(look.characters[cell.glyph], cell.x + cellWidth / 2, cell.y + cellHeight / 2);
    context.globalAlpha = 1;
  }
  function rebuild() {
    const box = layer.getBoundingClientRect(), width = Math.max(1, box.width), height = Math.max(1, box.height);
    compact = width < 700;
    const budget = compact ? 360000 : 720000, maxCells = compact ? 3000 : 9000;
    const ratio = Math.min(devicePixelRatio || 1, compact ? 1 : 1.25, Math.sqrt(budget / (width * height)));
    canvas.width = Math.max(1, Math.floor(width * ratio)); canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    context.font = `${look.fontSize}px ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`;
    context.textAlign = 'center'; context.textBaseline = 'middle';
    cellWidth = Math.ceil(context.measureText('M').width + look.fontSize * look.spacing);
    cellHeight = Math.ceil(look.fontSize * (.95 + look.spacing));
    while (Math.ceil(width / cellWidth) * Math.ceil(height / cellHeight) > maxCells) { cellWidth++; cellHeight++; }
    const columns = Math.ceil(width / cellWidth), rows = Math.ceil(height / cellHeight);
    seed = 1349; cells = []; hot.clear();
    for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
      const cell = { x: column * cellWidth, y: row * cellHeight, shown: random() < look.density, glyph: Math.floor(random() * look.characters.length), color: Math.floor(random() * palette.length), opacity: .55 + random() * .45, heat: 0, hold: 0, fade: 500 };
      cells.push(cell);
    }
    selection = cells.filter(cell => cell.shown); carry = 0;
    // A few tinted cells also identify Classic in the static accessible mode.
    for (let i = 0; i < selection.length; i += 13) selection[i].heat = .55;
    cells.forEach(paint);
    layer.dataset.cells = String(cells.length); layer.dataset.characters = look.characters;
    layer.dataset.frames = String(frames); layer.dataset.changedCells = '0'; layer.dataset.hotCells = '0';
    layer.dataset.enhanced = 'true'; canvas.hidden = false; dirty = false;
  }
  function mutate(changes) {
    const amount = Math.min(selection.length, Math.max(1, Math.floor(cells.length * .2 * MUTATION_MS / 1000)));
    const highlights = Math.min(amount, Math.ceil(cells.length * .1 * look.glitchAmount * MUTATION_MS / 1000));
    const limit = compact ? 240 : 600;
    for (let i = 0; i < amount; i++) {
      const selected = i + Math.floor(random() * (selection.length - i));
      [selection[i], selection[selected]] = [selection[selected], selection[i]];
      const cell = selection[i];
      cell.glyph = (cell.glyph + 1 + Math.floor(random() * (look.characters.length - 1))) % look.characters.length;
      if (i < highlights && (hot.has(cell) || hot.size < limit)) {
        cell.color = Math.floor(random() * palette.length); cell.heat = 1;
        cell.hold = 60 + random() * 120; cell.fade = 350 + random() * 400; hot.add(cell);
      }
      changes.add(cell);
    }
    layer.dataset.changedCells = String(amount);
  }
  function schedule() {
    if (!timer && active()) timer = setTimeout(tick, FRAME_MS);
  }
  function tick() {
    timer = 0;
    if (!active()) return;
    const now = performance.now(), elapsed = Math.max(0, Math.min(100, now - last)) * look.speed;
    last = now; carry += elapsed;
    const changes = new Set();
    for (const cell of hot) {
      if (cell.hold > 0) cell.hold = Math.max(0, cell.hold - elapsed);
      else { cell.heat = Math.max(0, cell.heat - elapsed / cell.fade); changes.add(cell); }
      if (!cell.heat) hot.delete(cell);
    }
    if (carry >= MUTATION_MS) { carry %= MUTATION_MS; mutate(changes); }
    changes.forEach(paint);
    layer.dataset.frames = String(++frames); layer.dataset.hotCells = String(hot.size);
    schedule();
  }
  function sync() {
    stop(); layer.hidden = excluded(); layer.dataset.motion = quiet() || paused ? 'static' : 'active'; layer.dataset.paused = String(paused || quiet());
    const nextTheme = root.dataset.theme === 'light' ? 'light' : 'dark';
    if (theme !== nextTheme) { theme = nextTheme; base = rgb(look[theme].base); palette = look[theme].colors.map(rgb); dirty = true; }
    measureHome();
    for (const control of controls) {
      control.hidden = excluded(); control.disabled = quiet(); control.setAttribute('aria-pressed', String(paused || quiet()));
      control.textContent = paused || quiet() ? control.dataset.play : control.dataset.pause;
    }
    if (!present()) return;
    if (dirty) rebuild();
    last = performance.now(); schedule();
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
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-contrast', 'data-loading', 'data-theme'] });
  for (const media of [reduced, forced]) media.addEventListener('change', sync);
  window.addEventListener('resize', resize);
  if (home) window.addEventListener('scroll', scheduleHome, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(layer);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(layer);
  window.addEventListener('pagehide', () => { visible = false; stop(); });
  window.addEventListener('pageshow', () => { visible = true; dirty = true; sync(); });
  sync();
})();
