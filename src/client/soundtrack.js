// The licensed recording is requested only by Play. Release media and its gain
// graph on pause/navigation; a delayed play promise cannot restart a stopped visit.
(() => {
  const button = document.querySelector('[data-soundtrack]');
  if (!button) return;
  const player = document.querySelector('[data-soundtrack-player]');
  const label = button.querySelector('[data-soundtrack-label]');
  const status = document.querySelector('[data-soundtrack-status]');
  const slider = document.querySelector('[data-soundtrack-volume]');
  const output = document.querySelector('[data-soundtrack-volume-value]');
  const panel = document.querySelector('[data-soundtrack-volume-panel]');
  let media = null, graph = null, generation = 0, volume = 65;

  function display(state) {
    const active = state === 'playing' || state === 'starting';
    const name = active ? button.dataset.pauseLabel : button.dataset.playLabel;
    button.dataset.state = state;
    button.dataset.tooltip = name;
    button.setAttribute('aria-label', name);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-busy', String(state === 'starting'));
    if (label) label.textContent = active ? button.dataset.pause : button.dataset.play;
  }
  function announce(text) { if (status) status.textContent = text || ''; }
  function closePanel() { if (panel) panel.open = false; }
  function release(audio) {
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  }
  function stop(failed = false) {
    const previous = media, previousGraph = graph;
    generation++; media = null; graph = null;
    // Detach state before pausing: the media pause event can fire synchronously.
    release(previous);
    if (previousGraph) {
      previousGraph.source?.disconnect(); previousGraph.gain?.disconnect();
      Promise.resolve(previousGraph.context.close()).catch(() => {});
    }
    display(failed ? 'unavailable' : 'paused');
    if (failed || previous) announce(failed ? button.dataset.unavailable : button.dataset.stopped);
  }
  function updateVolume() {
    const requested = Number(slider?.value ?? volume);
    if (Number.isFinite(requested)) volume = Math.max(0, Math.min(100, requested));
    if (slider) { slider.value = String(volume); slider.setAttribute('aria-valuetext', `${volume}%`); }
    if (output) output.textContent = `${volume}%`;
    button.dataset.volume = String(volume);
    if (graph) graph.gain.gain.setTargetAtTime(volume / 100, graph.context.currentTime, .025);
    else if (media) media.volume = volume / 100;
  }
  async function start() {
    const ticket = ++generation;
    display('starting');
    try {
      const audio = new window.Audio();
      media = audio;
      audio.preload = 'none'; audio.loop = true;
      audio.src = button.dataset.src;
      audio.volume = volume / 100;
      audio.addEventListener('error', () => { if (media === audio) stop(true); });
      audio.addEventListener('pause', () => { if (media === audio) stop(); });
      // A gain node also gives iOS a working level control. Native volume remains
      // a fallback on browsers without Web Audio; both are created by the gesture.
      const Context = window.AudioContext || window.webkitAudioContext;
      if (Context) {
        const context = new Context({ latencyHint: 'playback' });
        graph = { context, source: null, gain: null };
        graph.source = context.createMediaElementSource(audio);
        graph.gain = context.createGain();
        const { source, gain } = graph;
        gain.gain.value = volume / 100; audio.volume = 1;
        source.connect(gain); gain.connect(context.destination);
        await context.resume();
        if (ticket === generation && context.state !== 'running') throw new Error('Audio is suspended');
      }
      if (ticket !== generation || document.hidden) { if (media === audio) stop(); return; }
      await audio.play();
      if (ticket !== generation || document.hidden) { release(audio); return; }
      display('playing'); announce(button.dataset.playing);
    } catch { if (ticket === generation) stop(true); }
  }
  if (!window.Audio || !button.dataset.src) return;
  if (player) player.hidden = false;
  display('paused'); updateVolume();
  slider?.addEventListener('input', updateVolume);
  button.addEventListener('click', () => { if (media) stop(); else start(); });
  player?.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel?.open) { event.preventDefault(); closePanel(); panel.querySelector('summary').focus(); }
  });
  for (const event of ['pointerdown', 'focusin']) document.addEventListener(event, e => { if (panel?.open && !player?.contains(e.target)) closePanel(); });
  document.addEventListener('play', event => { if (event.target?.matches?.('video') && media) stop(); }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { closePanel(); if (media) stop(); } });
  window.addEventListener('pagehide', () => { closePanel(); if (media) stop(); });
})();
