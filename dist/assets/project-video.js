// Native controls work without this enhancement. Only one audio source plays,
// and returning to a hidden page never resumes the recording automatically.
(() => {
  const video = document.querySelector('[data-project-video]');
  if (!video) return;
  document.querySelector('[data-soundtrack]')?.addEventListener('click', () => video.pause());
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  window.addEventListener('pagehide', () => video.pause());
})();
