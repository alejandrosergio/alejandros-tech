// Bind the optional settings UI to theme-init's already-sanitized state.
// Controls work for the visit even when storage is denied or unavailable.
(() => {
  const state = window.AlejandroPreferences;
  if (!state) return;
  const root = document.documentElement;
  const settings = document.querySelector('[data-settings]'), privacy = document.querySelector('[data-privacy]');
  const banner = document.querySelector('[data-cookie-banner]');
  const preferenceKey = 'alejandros-tech-preferences-v1';
  const period = 15552000000;
  const persist = () => {
    // Optional preference storage follows consent, including its withdrawal.
    try {
      localStorage.removeItem('alejandros-tech-theme');
      if (state.consent === 'preferences') localStorage.setItem(preferenceKey, JSON.stringify({ values: state.values, expires: Date.now() + period }));
      else localStorage.removeItem(preferenceKey);
    } catch { /* Blocked storage never blocks the site. */ }
  };
  const sync = () => {
    const values = state.values;
    document.querySelectorAll('[data-preference]').forEach(input => {
      const v = values[input.dataset.preference];
      if (input.type === 'checkbox') input.checked = v;
      else input.value = String(v);
    });
    document.querySelectorAll('button[data-tone]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tone === values.tone)));
    document.querySelectorAll('[data-toggle-preference]').forEach(button => button.setAttribute('aria-checked', String(values[button.dataset.togglePreference])));
    document.querySelector('[data-output="text"]').textContent = `${values.text}%`;
    document.querySelector('[data-output="radius"]').textContent = `${values.radius} px`;
    document.querySelectorAll('[data-memory]').forEach(node => { node.textContent = state.consent === 'preferences' ? node.dataset.saved : node.dataset.session; });
  };
  const update = patch => {
    state.values = { ...state.values, ...patch }; state.apply(); persist(); sync();
    document.dispatchEvent(new CustomEvent('alejandro:preferences', { detail: state.values }));
  };
  state.set = update;
  const open = dialog => {
    // Keep one native modal open at a time; native focus containment is retained.
    for (const other of [settings, privacy]) if (other !== dialog && other.open) other.close();
    if (!dialog.open) dialog.showModal();
  };
  document.querySelectorAll('[data-open-settings]').forEach(button => { button.hidden = false; button.addEventListener('click', () => open(settings)); });
  document.querySelectorAll('[data-open-privacy]').forEach(button => { button.hidden = false; button.addEventListener('click', () => open(privacy)); });
  for (const dialog of [settings, privacy]) {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => { if (!settings.open && !privacy.open) document.querySelector('[data-open-settings]').focus({ preventScroll: true }); });
  }
  document.querySelectorAll('[data-preference]').forEach(input => input.addEventListener(input.type === 'range' ? 'input' : 'change', () => {
    update({ [input.dataset.preference]: input.type === 'checkbox' ? input.checked : input.type === 'range' ? Number(input.value) : input.value });
  }));
  // The root also stores data-tone; only palette buttons are interactive.
  document.querySelectorAll('button[data-tone]').forEach(button => button.addEventListener('click', () => update({ tone: button.dataset.tone })));
  document.querySelectorAll('[data-toggle-preference]').forEach(button => button.addEventListener('click', () => update({ [button.dataset.togglePreference]: !state.values[button.dataset.togglePreference] })));
  document.querySelector('[data-reset-preferences]').addEventListener('click', () => {
    update(state.defaults);
    const status = document.querySelector('[data-preference-status]'); status.textContent = status.dataset.resetMessage;
  });
  document.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => {
    state.consent = button.dataset.consent;
    try { document.cookie = `at_consent=${state.consent}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; } catch { /* Session-only choice still works. */ }
    if (state.consent === 'essential') update(state.defaults);
    else persist();
    sync(); banner.hidden = true;
    const status = document.querySelector('[data-consent-status]'); status.textContent = status.dataset.message;
    if (privacy.open) privacy.close();
    document.querySelector('[data-open-settings]').focus({ preventScroll: true });
  }));
  banner.hidden = ['preferences','essential'].includes(state.consent);
  sync();
  // OS reduced motion can never be cancelled by this site's setting.
  if (root.dataset.motion === 'true') delete root.dataset.loading;
})();
