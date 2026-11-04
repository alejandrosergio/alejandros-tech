// A layered photographic portrait: only the head follows a fine mouse pointer.
// No tracking, WebGL, external model or perpetual animation loop is needed.
(() => {
  const hero = document.querySelector('[data-portrait-hero]');
  if (!hero) return;
  const stage = hero.querySelector('[data-portrait-stage]');
  const head = hero.querySelector('[data-portrait-head]');
  const control = hero.querySelector('[data-portrait-motion]');
  const root = document.documentElement;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  let visible = true, paused = false, raf = 0;
  let x = 0, y = 0, targetX = 0, targetY = 0;
  const permitted = () => fine.matches && !reduced.matches && !forced.matches && root.dataset.motion !== 'true' && root.dataset.contrast !== 'true';
  const active = () => permitted() && !paused && visible && !document.hidden;
  const clamp = value => Math.max(-1, Math.min(1, value));
  function draw() {
    head.style.transform = `translate3d(${(x * 7).toFixed(2)}px,${(y * 3).toFixed(2)}px,0) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) rotateZ(${(x * 1.8).toFixed(2)}deg)`;
    hero.style.setProperty('--look-x', `${(x * 12).toFixed(2)}px`);
    hero.style.setProperty('--look-y', `${(y * 8).toFixed(2)}px`);
  }
  function reset() {
    cancelAnimationFrame(raf); raf = 0;
    x = y = targetX = targetY = 0; draw();
  }
  function frame() {
    raf = 0;
    if (!active()) { reset(); return; }
    x += (targetX - x) * .13; y += (targetY - y) * .13;
    const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < .002;
    if (settled) { x = targetX; y = targetY; }
    draw();
    if (!settled) raf = requestAnimationFrame(frame);
  }
  function schedule() { if (!raf && active()) raf = requestAnimationFrame(frame); }
  function sync() {
    const enabled = permitted();
    stage.dataset.follow = String(enabled);
    head.hidden = !enabled;
    control.hidden = !enabled;
    control.setAttribute('aria-pressed', String(paused));
    control.querySelector('[data-portrait-motion-label]').textContent = paused ? control.dataset.play : control.dataset.pause;
    if (!active()) reset();
  }
  window.addEventListener('pointermove', event => {
    if (!active() || event.pointerType !== 'mouse') return;
    if (event.target.closest('dialog[open]')) { targetX = targetY = 0; schedule(); return; }
    const rect = stage.getBoundingClientRect();
    targetX = clamp((event.clientX - rect.left - rect.width * .51) / (innerWidth * .44));
    targetY = clamp((event.clientY - rect.top - rect.height * .29) / (innerHeight * .5));
    schedule();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); });
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('alejandro:preferences', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-contrast'] });
  for (const media of [fine, reduced, forced]) media.addEventListener('change', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  }, { threshold: .05 }).observe(hero);
  control.addEventListener('click', () => { paused = !paused; reset(); sync(); });
  sync();
})();
