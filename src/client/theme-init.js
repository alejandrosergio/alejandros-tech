(() => {
  const root = document.documentElement;
  const defaults = { theme: 'dark', tone: 'coral', text: 100, radius: 6, contrast: false, spacing: false, links: false, motion: false, cursor: false, guideHidden: false };
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
    root.dataset.text = String(values.text);
    root.style.setProperty('--card-radius', `${values.radius}px`);
    for (const key of ['contrast', 'spacing', 'links', 'motion', 'cursor', 'guideHidden']) root.dataset[key] = String(values[key]);
  };
  window.AlejandroPreferences = { defaults, sanitize, apply, get values() { return { ...values }; }, set values(v) { values = sanitize(v); }, get consent() { return consent; }, set consent(v) { consent = v; } };
  systemDark.addEventListener('change', apply); apply();
  // Each new document gets a perceptible intro, independent of later effects.
  // The hard deadline and immediate keyboard exit keep navigation fail-open.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !values.motion) {
    root.dataset.loading = 'true';
    let finished = false, ready = document.readyState !== 'loading', minimumElapsed = false, minimumTimer = 0, deadlineTimer = 0;
    const finish = () => {
      if (finished) return;
      finished = true; delete root.dataset.loading;
      clearTimeout(minimumTimer); clearTimeout(deadlineTimer);
      document.removeEventListener('DOMContentLoaded', onReady);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', onPageShow);
    };
    const finishWhenReady = () => { if (ready && minimumElapsed) finish(); };
    const onReady = () => { ready = true; finishWhenReady(); };
    const onKey = () => finish();
    const onClick = event => { if (event.target.closest('[data-enter-site]')) finish(); };
    const onPageShow = event => { if (event.persisted) finish(); };
    minimumTimer = setTimeout(() => { minimumElapsed = true; finishWhenReady(); }, 1200);
    deadlineTimer = setTimeout(finish, 2400);
    if (!ready) document.addEventListener('DOMContentLoaded', onReady, { once: true });
    document.addEventListener('keydown', onKey, { once: true });
    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onPageShow);
  }
})();
