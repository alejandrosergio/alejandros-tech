(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const quiet = () => reduced.matches || root.dataset.motion === 'true';
  const up = document.querySelector('[data-scroll-top]');
  const header = document.querySelector('.site-header'), home = document.querySelector('[data-portrait-hero]');
  const sceneNav = document.querySelector('.hero-section-dots');
  const sceneLinks = sceneNav ? [...sceneNav.querySelectorAll('[data-scene-section]')] : [];
  const guide = document.querySelector('[data-journey-guide]');
  const background = document.querySelector('[data-letter-glitch]');
  const entries = guide ? JSON.parse(guide.dataset.entries) : [];
  const sections = entries.map(entry => document.getElementById(entry.id));
  const panel = guide?.querySelector('[data-guide-panel]'), toggle = guide?.querySelector('[data-guide-toggle]');
  const wide = matchMedia('(min-width: 900px)');
  let open = false, userToggled = false, current = -1, tick = 0;
  let measuredHeader = '';
  const surfaceFocus = new WeakMap();
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
    const headerBox = header?.getBoundingClientRect();
    if (headerBox) {
      const size = `${headerBox.height}px`;
      if (size !== measuredHeader) { root.style.setProperty('--site-header-height', size); measuredHeader = size; }
    }
    const bounds = sections.map(section => section?.getBoundingClientRect());
    const staticSurfaces = quiet() || forced.matches || root.dataset.contrast === 'true' || background?.dataset.paused === 'true';
    if (home) {
      const box = bounds[0] ?? home.getBoundingClientRect();
      home.dataset.sceneMotion = staticSurfaces || document.hidden || box.bottom <= 0 || box.top >= innerHeight ? 'static' : 'active';
    }
    sections.forEach((section, index) => {
      if (!section || index === 0) return;
      const rect = bounds[index], center = innerHeight * .5;
      const distance = rect.top > center ? rect.top - center : rect.bottom < center ? center - rect.bottom : 0;
      const present = rect.bottom > 0 && rect.top < innerHeight;
      const focus = staticSurfaces ? 1 : present ? .65 + .35 * Math.max(0, 1 - distance / Math.max(1, center)) : .65;
      const value = focus.toFixed(3);
      if (surfaceFocus.get(section) !== value) { section.style.setProperty('--module-focus', value); surfaceFocus.set(section, value); }
    });
    if (header && home) header.classList.toggle('is-past-home', home.getBoundingClientRect().bottom <= headerBox.bottom);
    if (up) up.hidden = Boolean(typing) || y < Math.max(450, innerHeight * .7);
    if (guide) {
      const banner = document.querySelector('[data-cookie-banner]');
      if (typing && open) setOpen(false);
      const hidden = root.dataset.guideHidden === 'true' || (banner && !banner.hidden) || Boolean(typing) || y < 220;
      guide.hidden = hidden;
      let index = 0;
      const marker = Math.min(innerHeight * .35, (headerBox?.height ?? 86) + 24);
      // Native anchor scrolling can round the destination by a fractional CSS
      // pixel, particularly after text zoom. Treat that arrival as its section.
      bounds.forEach((rect, i) => { if (rect && rect.top <= marker + 1) index = i; });
      if (progress >= 1) index = entries.length - 1;
      const start = (bounds[index]?.top ?? 0) + y + (index === 0 ? marker : 0);
      const end = bounds[index + 1] ? bounds[index + 1].top + y : Math.max(start + 1, available + marker);
      const fraction = Math.max(0, Math.min(1, (y + marker - start) / Math.max(1, end - start)));
      const sectionProgress = progress >= 1 ? 1 : (index + fraction) / Math.max(1, entries.length);
      const localProgress = progress >= 1 ? 1 : fraction;
      guide.style.setProperty('--journey-progress', String(localProgress));
      sceneNav?.style.setProperty('--section-progress', String(sectionProgress));
      if (index !== current) {
        current = index; const entry = entries[index];
        guide.querySelector('[data-guide-location]').textContent = entry.title;
        guide.querySelector('[data-guide-description]').textContent = entry.text;
        guide.querySelector('[data-guide-position]').textContent = `${String(index + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
        const action = guide.querySelector('[data-guide-action]'); action.href = entry.href; action.firstChild.textContent = entry.action;
        guide.querySelector('[data-guide-previous]').disabled = index === 0;
        guide.querySelector('[data-guide-next]').disabled = index === entries.length - 1;
        sceneLinks.forEach(link => { if (link.dataset.sceneSection === entry.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
        sections.forEach((section, i) => section?.classList.toggle('is-current-section', index === i));
      }
      guide.querySelector('[data-guide-percent]').textContent = `${Math.round(localProgress * 100)}%`;
    }
  }
  const schedule = () => { if (!tick) tick = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
  document.addEventListener('focusin', schedule); document.addEventListener('focusout', schedule);
  document.addEventListener('alejandro:preferences', schedule);
  document.addEventListener('alejandro:background-motion', schedule);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule); forced.addEventListener('change', schedule);
  if (guide) new MutationObserver(schedule).observe(document.querySelector('[data-cookie-banner]'), { attributes: true, attributeFilter: ['hidden'] });
  if (background) new MutationObserver(schedule).observe(background, { attributes: true, attributeFilter: ['data-paused'] });
  update();

  // Short, explicit hints stay anchored to the control rather than covering the
  // content around the pointer. Keyboard focus keeps the same descriptions.
  const tooltip = document.querySelector('[data-interaction-tooltip]');
  if (tooltip) {
    let target = null, timer = 0, keyboard = false, pointX = 0, pointY = 0, labelObserver = null;
    const hideTip = () => {
      clearTimeout(timer); timer = 0; tooltip.hidden = true;
      labelObserver?.disconnect();
      if (target) {
        const ids = (target.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== tooltip.id);
        if (ids.length) target.setAttribute('aria-describedby', ids.join(' ')); else target.removeAttribute('aria-describedby');
      }
      target = null;
    };
    const showTip = () => {
      timer = 0;
      if (!target?.isConnected || document.hidden || root.dataset.loading === 'true' || document.querySelector('dialog[open]')) { hideTip(); return; }
      const text = (target.dataset.tooltip || target.getAttribute('aria-label') || '').trim().slice(0, 140);
      const rect = target.getBoundingClientRect();
      if (!text || !rect.width || !rect.height || rect.bottom <= 0 || rect.top >= innerHeight) { hideTip(); return; }
      tooltip.textContent = text; tooltip.style.visibility = 'hidden'; tooltip.hidden = false;
      const size = tooltip.getBoundingClientRect(), gap = 10;
      const above = rect.top >= size.height + gap + 8;
      tooltip.style.left = `${Math.max(8, Math.min(innerWidth - size.width - 8, rect.left + (rect.width - size.width) / 2))}px`;
      tooltip.style.top = `${Math.max(8, Math.min(innerHeight - size.height - 8, above ? rect.top - size.height - gap : rect.bottom + gap))}px`;
      tooltip.style.visibility = '';
      const ids = new Set((target.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      ids.add(tooltip.id); target.setAttribute('aria-describedby', [...ids].join(' '));
    };
    // A system theme or music state can change a control without pointer input.
    // Excluding aria-describedby prevents our own tooltip linkage from looping.
    if ('MutationObserver' in window) labelObserver = new MutationObserver(() => { if (target && !tooltip.hidden) showTip(); });
    const queueTip = (element, fromKeyboard = false, event = {}) => {
      hideTip();
      if (!element || element.matches(':disabled') || element.closest('dialog,input,textarea,select,[contenteditable="true"]')) return;
      target = element; keyboard = fromKeyboard; pointX = event.clientX || 0; pointY = event.clientY || 0;
      labelObserver?.observe(target, { attributes: true, attributeFilter: ['aria-label', 'data-tooltip'] });
      timer = setTimeout(showTip, 400);
    };
    document.addEventListener('pointerover', event => {
      if (event.pointerType !== 'mouse' || !fine.matches) { hideTip(); return; }
      const element = event.target.closest('[data-tooltip]');
      if (element !== target) queueTip(element, false, event);
    });
    document.addEventListener('pointerout', event => { if (target && !target.contains(event.relatedTarget)) hideTip(); });
    document.addEventListener('pointermove', event => {
      if (!target || keyboard || event.pointerType !== 'mouse') return;
      if (Math.abs(event.clientX - pointX) + Math.abs(event.clientY - pointY) > 5) queueTip(target, false, event);
    }, { passive: true });
    document.addEventListener('focusin', event => {
      const element = event.target.closest('[data-tooltip]');
      if (element && element.matches(':focus-visible')) queueTip(element, true);
    });
    document.addEventListener('focusout', hideTip);
    document.addEventListener('pointerdown', hideTip); document.addEventListener('click', hideTip);
    document.addEventListener('keydown', event => { if (event.key === 'Escape') hideTip(); });
    document.addEventListener('visibilitychange', hideTip); document.addEventListener('alejandro:preferences', hideTip);
    window.addEventListener('scroll', hideTip, { passive: true }); window.addEventListener('resize', hideTip); window.addEventListener('blur', hideTip);
    fine.addEventListener('change', hideTip); forced.addEventListener('change', hideTip);
  }

  // A precise point and a segmented reticle ease toward input, morph on hover,
  // and stop requesting frames at rest. No directional arrow is drawn.
  const dot = document.querySelector('[data-cursor-dot]'), orbit = document.querySelector('[data-cursor-orbit]');
  if (!dot || !orbit) return;
  let x = 0, y = 0, ox = 0, oy = 0, cursorFrame = 0, active = false;
  const dialogOpen = () => Boolean(document.querySelector('dialog[open]'));
  const allowed = () => fine.matches && !quiet() && !forced.matches && root.dataset.cursor !== 'true' && !dialogOpen();
  const hide = () => { active = false; delete root.dataset.cursorActive; dot.hidden = orbit.hidden = true; orbit.dataset.pressed = 'false'; cancelAnimationFrame(cursorFrame); cursorFrame = 0; };
  const frame = () => {
    cursorFrame = 0; if (!active || document.hidden || !allowed()) { hide(); return; }
    ox += (x - ox) * .24; oy += (y - oy) * .24;
    orbit.style.transform = `translate3d(${ox}px,${oy}px,0)`;
    const distance = Math.abs(x - ox) + Math.abs(y - oy), settled = distance <= .2;
    orbit.style.setProperty('--cursor-tilt', `${settled ? 0 : Math.max(-18, Math.min(18, (x - ox) * .65))}deg`);
    orbit.style.setProperty('--cursor-stretch', String(settled ? 1 : 1 + Math.min(distance / 160, .12)));
    if (!settled) cursorFrame = requestAnimationFrame(frame);
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
  document.addEventListener('pointerdown', () => { if (active) orbit.dataset.pressed = 'true'; });
  document.addEventListener('pointerup', () => { orbit.dataset.pressed = 'false'; });
  document.addEventListener('pointercancel', hide); window.addEventListener('blur', hide);
  document.addEventListener('keydown', hide); document.addEventListener('visibilitychange', hide);
  document.addEventListener('alejandro:preferences', () => { if (!allowed()) hide(); });
  const syncDialog = () => { const opened = dialogOpen(); root.dataset.dialogOpen = String(opened); if (opened) hide(); };
  new MutationObserver(syncDialog).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  syncDialog();
  reduced.addEventListener('change', hide); fine.addEventListener('change', hide); forced.addEventListener('change', hide);
})();
