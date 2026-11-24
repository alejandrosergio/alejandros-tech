// The host serves complete MP4 responses rather than byte ranges. Preparing a
// small, visitor-activated object URL makes seeking independent of that host.
// Native controls and the MP4 link remain available without JavaScript.
(() => {
  const video = document.querySelector('[data-project-video]');
  if (!video) return;
  const button = document.querySelector('[data-project-video-start]');
  const label = button?.querySelector('[data-project-video-label]');
  const status = document.querySelector('[data-project-video-status]');
  const source = video.querySelector('source');
  const supported = button && label && status && source && typeof fetch === 'function' && typeof AbortController === 'function' && typeof URL.createObjectURL === 'function';
  let pending = null, objectURL = null, generation = 0;
  const announce = text => { if (status) { status.textContent = text; status.hidden = !text; } };
  const resetButton = () => { if (button) { button.hidden = false; button.removeAttribute('aria-disabled'); label.textContent = button.dataset.play; } };

  function cancel() {
    generation++;
    pending?.abort(); pending = null;
    video.pause();
    if (supported && !objectURL) { resetButton(); announce(''); }
  }
  async function resume() {
    if (document.hidden) return;
    try { await video.play(); }
    catch { if (!document.hidden) { resetButton(); announce(button.dataset.ready); } }
  }
  async function prepare() {
    if (objectURL) { await resume(); return; }
    if (pending || document.hidden) return;
    const ticket = ++generation, request = new AbortController(); pending = request;
    // Stop a native play request too: all entry points use the same preparation.
    video.pause(); video.load();
    button.setAttribute('aria-disabled', 'true'); label.textContent = button.dataset.loading;
    announce(button.dataset.loading);
    try {
      const url = new URL(source.src, location.href);
      if (url.origin !== location.origin) throw new Error('Unexpected media origin');
      const response = await fetch(url.href, { signal: request.signal, credentials: 'omit' });
      if (!response.ok || Number(response.headers.get('content-length')) > 6_000_000) throw new Error('Video unavailable');
      const blob = await response.blob();
      if (ticket !== generation || document.hidden) return;
      if (!blob.size || blob.size > 6_000_000 || !blob.type.startsWith('video/mp4')) throw new Error('Invalid video');
      objectURL = URL.createObjectURL(blob); pending = null;
      const keepFocus = document.activeElement === button;
      video.src = objectURL; video.load(); button.hidden = true; button.removeAttribute('aria-disabled'); announce('');
      if (keepFocus) video.focus();
      await resume();
    } catch {
      if (ticket !== generation) return;
      request.abort(); pending = null; resetButton(); label.textContent = button.dataset.retry; announce(button.dataset.error);
    }
  }
  if (supported) {
    button.hidden = false;
    button.addEventListener('click', prepare);
    video.addEventListener('play', () => {
      if (document.hidden) { video.pause(); return; }
      if (!objectURL) { video.pause(); if (!pending) void prepare(); }
      else { button.hidden = true; announce(''); }
    });
  }
  document.querySelector('[data-soundtrack]')?.addEventListener('click', cancel);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
  window.addEventListener('pagehide', () => {
    cancel();
    if (objectURL) {
      video.removeAttribute('src'); video.load(); URL.revokeObjectURL(objectURL); objectURL = null;
      resetButton(); announce('');
    }
  });
})();
