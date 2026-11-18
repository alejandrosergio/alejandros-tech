// Create the third-party frame only after a visitor opens the agenda. Closing
// the dialog removes it, its listeners and its timer; ordinary browsing is local.
(() => {
  const dialog = document.querySelector('[data-booking-dialog]');
  const triggers = [...document.querySelectorAll('[data-booking-open]')];
  if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;

  const root = document.documentElement;
  const host = dialog.querySelector('[data-booking-frame]');
  const status = dialog.querySelector('[data-booking-status]');
  let frame = null, timer = null, returnFocus = null, observer = null;

  const appearance = () => ({
    theme: root.dataset.theme === 'dark' ? 'dark' : 'light',
  });
  const syncAppearance = () => {
    frame?.contentWindow?.postMessage({ type: 'alejandros-booking:appearance', theme: appearance().theme }, window.location.origin);
  };
  const receive = event => {
    if (!frame || event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'alejandros-booking:ready') {
      clearTimeout(timer); status.hidden = true; syncAppearance();
    } else if (event.data?.type === 'alejandros-booking:error') {
      clearTimeout(timer); status.hidden = false; status.textContent = dialog.dataset.slow;
    }
  };
  const cleanup = () => {
    clearTimeout(timer); timer = null;
    observer?.disconnect(); observer = null;
    window.removeEventListener('message', receive);
    frame?.remove(); frame = null;
    host.replaceChildren();
  };
  const open = event => {
    // Keep the ordinary new-tab link available for modifier clicks and no JS.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    let url;
    try { url = new URL(dialog.dataset.bookingUrl); } catch { return; }
    if (url.origin !== 'https://cal.com' || !url.pathname.startsWith('/alejandros-tech/')) return;
    if (dialog.open) { event.preventDefault(); return; }
    returnFocus = event.currentTarget;
    try {
      for (const other of document.querySelectorAll('dialog[open]')) other.close();
      dialog.showModal();
    } catch { return; }
    event.preventDefault();
    status.hidden = false; status.textContent = dialog.dataset.loading;

    // The disposable shell owns Cal.com's SDK and the real provider frame.
    const embed = new URL('/assets/booking-shell.html', window.location.origin);
    embed.searchParams.set('event', url.pathname);
    embed.searchParams.set('lang', dialog.dataset.bookingLang);
    embed.searchParams.set('theme', appearance().theme);
    const currentFrame = frame = document.createElement('iframe');
    frame.className = 'booking-frame';
    frame.title = dialog.dataset.frameTitle;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = "camera 'none'; microphone 'none'; payment 'none'";
    frame.addEventListener('load', () => {
      if (!dialog.open || frame !== currentFrame) return;
      syncAppearance();
    }, { once: true });
    frame.addEventListener('error', () => {
      if (!dialog.open || frame !== currentFrame) return;
      clearTimeout(timer); status.hidden = false; status.textContent = dialog.dataset.slow;
    }, { once: true });
    window.addEventListener('message', receive);
    frame.src = embed.href;
    host.append(frame);
    timer = setTimeout(() => { if (dialog.open && frame === currentFrame) status.textContent = dialog.dataset.slow; }, 15000);
    observer = new MutationObserver(syncAppearance);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  };

  for (const link of triggers) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', dialog.id);
    link.addEventListener('click', open);
  }
  dialog.querySelector('[data-booking-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    cleanup();
    if (!document.querySelector('dialog[open]')) returnFocus?.focus({ preventScroll: true });
  });
  window.addEventListener('pagehide', () => { if (dialog.open) dialog.close(); cleanup(); });
})();
