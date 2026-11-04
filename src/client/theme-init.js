(() => {
  const root = document.documentElement;
  const defaults = { theme: 'system', tone: 'blue', text: 100, radius: 20, contrast: false, spacing: false, links: false, motion: false, cursor: false, guideHidden: false };
  const sanitize = value => {
    const p = { ...defaults }, data = value && typeof value === 'object' ? value : {};
    if (['system', 'light', 'dark'].includes(data.theme)) p.theme = data.theme;
    if (['blue', 'violet', 'coral', 'ocean', 'mono'].includes(data.tone)) p.tone = data.tone;
    if (Number.isFinite(data.text)) p.text = Math.round(Math.max(100, Math.min(125, data.text)) / 5) * 5;
    if (Number.isFinite(data.radius)) p.radius = Math.round(Math.max(0, Math.min(28, data.radius)) / 2) * 2;
    for (const key of ['contrast', 'spacing', 'links', 'motion', 'cursor', 'guideHidden']) p[key] = data[key] === true;
    return p;
  };
  let values = { ...defaults }, consent = '';
  try {
    consent = document.cookie.split('; ').find(c => c.startsWith('at_consent='))?.split('=')[1] || '';
    if (consent === 'preferences') {
      const stored = JSON.parse(localStorage.getItem('alejandros-tech-preferences-v1') || 'null');
      if (stored?.expires > Date.now()) values = sanitize(stored.values);
      else localStorage.removeItem('alejandros-tech-preferences-v1');
    }
    else localStorage.removeItem('alejandros-tech-preferences-v1');
  } catch { /* Storage is optional; all controls work for this visit. */ }
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    root.dataset.theme = values.theme === 'system' ? (systemDark.matches ? 'dark' : 'light') : values.theme;
    root.dataset.tone = values.tone;
    root.style.fontSize = `${values.text}%`;
    root.style.setProperty('--card-radius', `${values.radius}px`);
    for (const key of ['contrast', 'spacing', 'links', 'motion', 'cursor', 'guideHidden']) root.dataset[key] = String(values[key]);
  };
  window.AlejandroPreferences = { defaults, sanitize, apply, get values() { return { ...values }; }, set values(v) { values = sanitize(v); }, get consent() { return consent; }, set consent(v) { consent = v; } };
  systemDark.addEventListener('change', apply); apply();
  // The intro has a hard deadline; HTML remains usable if later scripts fail.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !values.motion && !location.hash && /^\/(en\/)?$/.test(location.pathname)) {
    root.dataset.loading = 'true';
    const finish = () => { delete root.dataset.loading; };
    setTimeout(finish, 1400);
    document.addEventListener('DOMContentLoaded', () => setTimeout(finish, 180), { once: true });
    document.addEventListener('keydown', finish, { once: true });
    document.addEventListener('click', event => { if (event.target.closest('[data-enter-site]')) finish(); });
  }
})();
