(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const quiet = () => reduced.matches || root.dataset.motion === 'true';
  const up = document.querySelector('[data-scroll-top]');
  const guide = document.querySelector('[data-journey-guide]');
  const entries = guide ? JSON.parse(guide.dataset.entries) : [];
  const sections = entries.map(entry => document.getElementById(entry.id));
  const panel = guide?.querySelector('[data-guide-panel]'), toggle = guide?.querySelector('[data-guide-toggle]');
  const wide = matchMedia('(min-width: 900px)');
  let open = false, userToggled = false, current = -1, lastY = window.scrollY, tick = 0;
  const setOpen = value => { open = value; if (panel) { panel.hidden = !value; toggle.setAttribute('aria-expanded', String(value)); } };
  if (guide) {
    setOpen(open);
    toggle.addEventListener('click', () => { userToggled = true; setOpen(!open); });
    guide.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && wide.matches && !userToggled) setOpen(true); });
    guide.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse' && !userToggled && !guide.contains(document.activeElement)) setOpen(false); });
    guide.querySelector('[data-guide-dismiss]').addEventListener('click', () => {
      window.AlejandroPreferences?.set({ guideHidden: true });
      document.querySelector('[data-open-settings]')?.focus({ preventScroll: true });
    });
    const visit = (index, event) => {
      const section = sections[index]; if (!section) return;
      section.scrollIntoView({ behavior: quiet() ? 'instant' : 'smooth', block: 'start' });
      if (event.detail === 0) { const heading = section.querySelector('h1,h2'); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } }
    };
    guide.querySelector('[data-guide-previous]').addEventListener('click', event => visit(current - 1, event));
    guide.querySelector('[data-guide-next]').addEventListener('click', event => visit(current + 1, event));
    guide.addEventListener('keydown', event => { if (event.key === 'Escape' && open) { setOpen(false); toggle.focus(); } });
    wide.addEventListener('change', () => { if (!userToggled && !wide.matches) setOpen(false); });
  }
  up?.addEventListener('click', event => {
    event.preventDefault(); window.scrollTo({ top: 0, behavior: quiet() ? 'instant' : 'smooth' });
    if (event.detail === 0) document.querySelector('.wordmark')?.focus({ preventScroll: true });
  });
  function update() {
    tick = 0;
    const y = window.scrollY, available = Math.max(1, root.scrollHeight - innerHeight), progress = Math.max(0, Math.min(1, y / available));
    const typing = document.activeElement?.closest('form');
    if (up) up.hidden = Boolean(typing) || y < Math.max(450, innerHeight * .7);
    if (guide) {
      const banner = document.querySelector('[data-cookie-banner]');
      if (typing && open) setOpen(false);
      const hidden = root.dataset.guideHidden === 'true' || (banner && !banner.hidden) || Boolean(typing) || y < 220;
      guide.hidden = hidden;
      guide.style.setProperty('--journey-progress', String(progress));
      guide.dataset.direction = y < lastY ? 'up' : 'down';
      let index = 0;
      const marker = Math.min(220, innerHeight * .3);
      sections.forEach((section, i) => { if (section && section.getBoundingClientRect().top <= marker) index = i; });
      if (progress > .995) index = entries.length - 1;
      if (index !== current) {
        current = index; const entry = entries[index];
        guide.querySelector('[data-guide-location]').textContent = entry.title;
        guide.querySelector('[data-guide-description]').textContent = entry.text;
        guide.querySelector('[data-guide-position]').textContent = `${String(index + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
        const action = guide.querySelector('[data-guide-action]'); action.href = entry.href; action.firstChild.textContent = entry.action;
        guide.querySelector('[data-guide-previous]').disabled = index === 0;
        guide.querySelector('[data-guide-next]').disabled = index === entries.length - 1;
        sections.forEach((section, i) => section?.classList.toggle('is-current-section', index === i));
      }
      guide.querySelector('[data-guide-percent]').textContent = `${Math.round(progress * 100)}%`;
    }
    lastY = y;
  }
  const schedule = () => { if (!tick) tick = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
  document.addEventListener('focusin', schedule); document.addEventListener('focusout', schedule);
  document.addEventListener('alejandro:preferences', schedule);
  if (guide) new MutationObserver(schedule).observe(document.querySelector('[data-cookie-banner]'), { attributes: true, attributeFilter: ['hidden'] });
  update();

  // The precise dot follows input directly; its orbit eases and stops at rest.
  const dot = document.querySelector('[data-cursor-dot]'), orbit = document.querySelector('[data-cursor-orbit]');
  if (!dot || !orbit) return;
  let x = 0, y = 0, ox = 0, oy = 0, cursorFrame = 0, active = false;
  const allowed = () => fine.matches && !quiet() && !forced.matches && root.dataset.cursor !== 'true';
  const hide = () => { active = false; delete root.dataset.cursorActive; dot.hidden = orbit.hidden = true; cancelAnimationFrame(cursorFrame); cursorFrame = 0; };
  const frame = () => {
    cursorFrame = 0; if (!active || document.hidden || !allowed()) { hide(); return; }
    ox += (x - ox) * .24; oy += (y - oy) * .24;
    orbit.style.transform = `translate3d(${ox}px,${oy}px,0)`;
    if (Math.abs(x - ox) + Math.abs(y - oy) > .2) cursorFrame = requestAnimationFrame(frame);
  };
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !allowed() || event.target.closest('dialog,input,textarea,select,[contenteditable="true"]')) { hide(); return; }
    x = event.clientX; y = event.clientY;
    if (!active) { ox = x; oy = y; active = true; dot.hidden = orbit.hidden = false; root.dataset.cursorActive = 'true'; }
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    orbit.dataset.interactive = String(Boolean(event.target.closest('a,button,summary')));
    if (!cursorFrame) cursorFrame = requestAnimationFrame(frame);
  }, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); });
  document.addEventListener('keydown', hide); document.addEventListener('visibilitychange', hide);
  document.addEventListener('alejandro:preferences', () => { if (!allowed()) hide(); });
  new MutationObserver(() => { if (document.querySelector('dialog[open]')) hide(); }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  reduced.addEventListener('change', hide); fine.addEventListener('change', hide); forced.addEventListener('change', hide);
})();
