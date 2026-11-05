/* Original Alejandro’sTech composition, synthesized locally with Web Audio.
 * 112 BPM, eight-bar minor/major ninth harmony, a soft house groove and a
 * newly written melody. No recording, external sample, service or runtime fetch.
 * Transport starts only from this button; navigation/hidden tabs stop it.
 */
(() => {
  const button = document.querySelector('[data-soundtrack]');
  if (!button) return;
  const label = button.querySelector('[data-soundtrack-label]'), status = document.querySelector('[data-soundtrack-status]');
  const player = document.querySelector('[data-soundtrack-player]'), volumeInput = document.querySelector('[data-soundtrack-volume]');
  const volumeOutput = document.querySelector('[data-soundtrack-volume-value]'), volumePanel = document.querySelector('[data-soundtrack-volume-panel]');
  const Audio = window.AudioContext || window.webkitAudioContext;
  const BPM = 112, BEAT = 60 / BPM, STEP = BEAT / 4, MAX_VOICES = 64, MAX_GAIN = .6;
  const harmony = [
    { bass: 33, notes: [57, 60, 64, 67, 71] },
    { bass: 29, notes: [53, 57, 60, 64, 67] },
    { bass: 36, notes: [55, 59, 62, 64, 67] },
    { bass: 31, notes: [55, 59, 62, 64, 69] }
  ];
  const melody = [
    [76, 79, 83, 79], [74, 71, 72, 76], [69, 72, 76, 79], [76, 74, 72, 69],
    [67, 71, 74, 76], [74, 76, 71, 67], [71, 74, 76, 81], [79, 76, 74, 71]
  ];
  const frequency = note => 440 * Math.pow(2, (note - 69) / 12);
  let context = null, engine = null, pending = false, generation = 0;
  let volume = 65;

  // This visit's level never creates/resumes audio or writes optional storage.
  function updateVolume() {
    const requested = Number(volumeInput?.value ?? volume);
    if (Number.isFinite(requested)) volume = Math.max(0, Math.min(100, requested));
    if (volumeInput) { volumeInput.value = String(volume); volumeInput.setAttribute('aria-valuetext', `${volume}%`); }
    if (volumeOutput) volumeOutput.textContent = `${volume}%`;
    button.dataset.volume = String(volume);
    engine?.setVolume(volume / 100);
  }
  function closeVolume() { if (volumePanel) volumePanel.open = false; }

  function announce(text) { if (status) status.textContent = text || ''; }
  function display(state) {
    const playing = state === 'playing', accessible = playing ? button.dataset.pauseLabel || button.dataset.pause : button.dataset.playLabel || button.dataset.play;
    button.dataset.state = state;
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-busy', String(state === 'starting'));
    button.setAttribute('aria-label', accessible);
    button.dataset.tooltip = accessible;
    if (label) label.textContent = playing ? button.dataset.pause : button.dataset.play;
  }
  function close(audio) {
    if (!audio || audio.state === 'closed') return;
    try { Promise.resolve(audio.close()).catch(() => {}); } catch { /* A failed close must not trap the control. */ }
  }
  function stop(error = false) {
    const wasActive = Boolean(engine || pending), audio = context;
    generation++; pending = false; context = null;
    engine?.dispose(); engine = null; close(audio);
    button.dataset.voices = '0'; button.dataset.context = 'closed';
    display(error ? 'unavailable' : 'paused');
    if (error) announce(button.dataset.unavailable);
    else if (wasActive) announce(button.dataset.stopped);
  }

  function createEngine(audio) {
    const voices = new Set(), graph = [], keep = node => { graph.push(node); return node; };
    let timer = 0, active = false, nextTime = 0, position = 0, scheduled = 0;
    let mix, compressor, level, master, delay, noise;
    const disconnect = node => { try { node.disconnect(); } catch { /* Already detached. */ } };
    const voiceCount = () => { button.dataset.voices = String(voices.size); };
    function release(voice, stopSources = false) {
      if (voice.disposed) return;
      voice.disposed = true;
      for (const source of voice.sources) {
        source.onended = null;
        if (stopSources) try { source.stop(); } catch { /* An already-ended source needs no second stop. */ }
      }
      voice.nodes.forEach(disconnect); voices.delete(voice); voiceCount();
    }
    function register(sources, nodes, at, duration) {
      const voice = { sources, nodes, disposed: false }, remaining = new Set(sources);
      voices.add(voice); voiceCount();
      for (const source of sources) {
        source.onended = () => { remaining.delete(source); if (!remaining.size) release(voice); };
        source.start(at); source.stop(at + duration);
      }
    }
    function envelope(gain, at, peak, attack, duration) {
      gain.setValueAtTime(.0001, at);
      gain.linearRampToValueAtTime(peak, at + attack);
      gain.exponentialRampToValueAtTime(.0001, at + duration);
    }
    function pan(output, nodes, value) {
      if (typeof audio.createStereoPanner !== 'function') { output.connect(mix); return; }
      const panner = audio.createStereoPanner(); panner.pan.value = value;
      output.connect(panner); panner.connect(mix); nodes.push(panner);
    }
    function tone(note, at, duration, peak, { type = 'triangle', cutoff = 900, spread = 0, echo = false, attack = .012 } = {}) {
      if (voices.size >= MAX_VOICES) return;
      const oscillator = audio.createOscillator(), gain = audio.createGain(), filter = audio.createBiquadFilter();
      const nodes = [oscillator, gain, filter];
      oscillator.type = type; oscillator.frequency.setValueAtTime(frequency(note), at);
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(cutoff, at); filter.Q.value = .45;
      oscillator.connect(filter); filter.connect(gain); pan(gain, nodes, spread);
      if (echo) gain.connect(delay);
      envelope(gain.gain, at, peak, attack, duration);
      register([oscillator], nodes, at, duration + .025);
    }
    function kick(at) {
      if (voices.size >= MAX_VOICES) return;
      const oscillator = audio.createOscillator(), gain = audio.createGain();
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(112, at); oscillator.frequency.exponentialRampToValueAtTime(47, at + .14);
      oscillator.connect(gain); gain.connect(mix); envelope(gain.gain, at, .44, .006, .32);
      register([oscillator], [oscillator, gain], at, .35);
    }
    function percussion(at, { clap = false, open = false, soft = false } = {}) {
      if (voices.size >= MAX_VOICES) return;
      const source = audio.createBufferSource(), filter = audio.createBiquadFilter(), gain = audio.createGain();
      source.buffer = noise; filter.type = clap ? 'bandpass' : 'highpass'; filter.frequency.value = clap ? 1850 : 6700; filter.Q.value = clap ? .7 : .45;
      source.connect(filter); filter.connect(gain); gain.connect(mix);
      const duration = clap ? .17 : open ? .15 : .055, peak = clap ? .05 : soft ? .007 : .023;
      envelope(gain.gain, at, peak, .004, duration);
      register([source], [source, filter, gain], at, duration + .015);
    }
    function step(index, at) {
      const tick = index % 16, bar = Math.floor(index / 16) % 8, chord = harmony[Math.floor(bar / 2)];
      if (tick % 4 === 0) kick(at);
      if (tick === 4 || tick === 12) percussion(at, { clap: true });
      if (tick % 4 === 2) percussion(at, { open: tick === 14 });
      if (tick % 2 === 1) percussion(at, { soft: true });
      if (tick === 0) chord.notes.forEach((note, i) => tone(note, at + i * .006, BEAT * 4 + .52, .043, { cutoff: 1050, spread: (i - 2) * .17, attack: .17 }));
      const bassPattern = { 0: 0, 3: 12, 6: 0, 8: 7, 11: 0, 14: 12 };
      if (Object.hasOwn(bassPattern, tick)) tone(chord.bass + bassPattern[tick], at, STEP * (tick === 8 ? 1.5 : 1.08), .16, { type: 'sine', cutoff: 380, attack: .009 });
      const phrase = [2, 5, 9, 14].indexOf(tick);
      if (phrase >= 0) tone(melody[bar][phrase], at, .56, .037, { cutoff: 2100, spread: phrase % 2 ? .24 : -.24, echo: true });
    }
    function queue() {
      const now = audio.currentTime;
      // A delayed browser timer skips stale beats instead of firing a burst.
      if (nextTime < now - .25) { const missed = Math.ceil((now + .04 - nextTime) / STEP); nextTime += missed * STEP; position += missed; }
      let count = 0;
      while (nextTime < now + .18 && count++ < 4) {
        step(position++, nextTime); nextTime += STEP; button.dataset.scheduled = String(++scheduled);
      }
    }
    function pump() {
      timer = 0; if (!active) return;
      if (audio.state !== 'running') { stop(); return; }
      try { queue(); } catch { stop(true); return; }
      if (active) timer = setTimeout(pump, 25);
    }
    function dispose() {
      active = false; if (timer) clearTimeout(timer); timer = 0;
      if (master) { try { master.gain.cancelScheduledValues(audio.currentTime); master.gain.setValueAtTime(0, audio.currentTime); } catch { /* Context may already be closed. */ } }
      for (const voice of [...voices]) release(voice, true);
      graph.forEach(disconnect);
    }
    try {
      mix = keep(audio.createGain()); compressor = keep(audio.createDynamicsCompressor()); level = keep(audio.createGain()); master = keep(audio.createGain());
      compressor.threshold.value = -15; compressor.knee.value = 20; compressor.ratio.value = 4; compressor.attack.value = .003; compressor.release.value = .25;
      level.gain.value = volume / 100; master.gain.value = 0;
      mix.connect(compressor); compressor.connect(level); level.connect(master); master.connect(audio.destination);
      // A short, quiet filtered echo gives the pluck space without a reverb sample.
      delay = keep(audio.createDelay(1)); delay.delayTime.value = BEAT * .75;
      const shade = keep(audio.createBiquadFilter()), feedback = keep(audio.createGain()), wet = keep(audio.createGain());
      shade.type = 'lowpass'; shade.frequency.value = 1800; feedback.gain.value = .16; wet.gain.value = .14;
      delay.connect(shade); shade.connect(feedback); feedback.connect(delay); shade.connect(wet); wet.connect(mix);
      const rate = audio.sampleRate || 44100; noise = audio.createBuffer(1, Math.ceil(rate * .5), rate);
      const samples = noise.getChannelData(0); let seed = 734159;
      for (let i = 0; i < samples.length; i++) { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; samples[i] = ((seed >>> 0) / 4294967296) * 2 - 1; }
    } catch (error) { dispose(); throw error; }
    return {
      start() {
        active = true; nextTime = audio.currentTime + .06; position = scheduled = 0;
        master.gain.setValueAtTime(0, audio.currentTime); master.gain.linearRampToValueAtTime(MAX_GAIN, audio.currentTime + .55);
        queue(); timer = setTimeout(pump, 25);
      },
      setVolume(value) {
        // Separate from the entrance fade: rapid adjustments stay smooth and
        // cannot cancel its envelope, restart the phrase or allocate voices.
        const now = audio.currentTime, held = level.gain.value;
        level.gain.cancelScheduledValues(now); level.gain.setValueAtTime(held, now);
        level.gain.setTargetAtTime(value, now, .025);
      },
      dispose
    };
  }

  async function start() {
    if (!Audio) { display('unavailable'); announce(button.dataset.unavailable); return; }
    const ticket = ++generation; pending = true; display('starting');
    let audio;
    try {
      // Creation and resume both originate inside the user's click/keyboard act.
      audio = new Audio({ latencyHint: 'playback' }); context = audio;
      await audio.resume();
      if (ticket !== generation || document.hidden) { close(audio); return; }
      if (audio.state !== 'running') throw new Error('Audio remains suspended');
      engine = createEngine(audio); engine.start(); pending = false;
      audio.addEventListener('statechange', () => { if (context === audio && audio.state !== 'running') stop(); });
      button.dataset.context = audio.state; display('playing'); announce(button.dataset.playing);
    } catch {
      close(audio);
      if (ticket === generation) stop(true);
    }
  }
  if (player) player.hidden = false;
  button.hidden = false; button.dataset.tempo = String(BPM); button.dataset.voices = '0'; button.dataset.context = 'closed'; display(Audio ? 'paused' : 'unavailable');
  updateVolume(); volumeInput?.addEventListener('input', updateVolume);
  player?.addEventListener('keydown', event => { if (event.key === 'Escape' && volumePanel?.open) { event.preventDefault(); closeVolume(); volumePanel.querySelector('summary').focus(); } });
  document.addEventListener('pointerdown', event => { if (volumePanel?.open && !player?.contains(event.target)) closeVolume(); });
  document.addEventListener('focusin', event => { if (volumePanel?.open && !player?.contains(event.target)) closeVolume(); });
  button.addEventListener('click', () => { if (engine || pending) stop(); else start(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { closeVolume(); if (engine || pending) stop(); } });
  window.addEventListener('pagehide', () => { closeVolume(); if (engine || pending) stop(); });
})();
