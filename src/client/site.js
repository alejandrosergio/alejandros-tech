(() => {
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('alejandros-tech-theme', next); } catch { /* The theme still works without storage. */ }
  });
})();
