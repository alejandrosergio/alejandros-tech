/* Original Alejandro’sTech composition, synthesized locally with Web Audio.
 * “Órbita digital”: 118 BPM, a 32-bar ambient-techno arrangement, soft FM
 * arpeggios and breathing pads. No recording, sample, service or runtime fetch.
 * Transport starts only from this button; navigation/hidden tabs stop it.
 */
(() => {
  const button = document.querySelector('[data-soundtrack]');
  if (!button) return;
  const label = button.querySelector('[data-soundtrack-label]'), status = document.querySelector('[data-soundtrack-status]');
  const player = document.querySelector('[data-soundtrack-player]'), volumeInput = document.querySelector('[data-soundtrack-volume]');
  const volumeOutput = document.querySelector('[data-soundtrack-volume-value]'), volumePanel = document.querySelector('[data-soundtrack-volume-panel]');
  const Audio = window.AudioContext || window.webkitAudioContext;
  const BPM = 118, BEAT = 60 / BPM, STEP = BEAT / 4, MAX_VOICES = 64, MAX_GAIN = 1.4;
  const harmony = [
    { bass: 38, notes: [53, 57, 60, 64, 69] },
    { bass: 34, notes: [53, 57, 60, 62, 65] },
    { bass: 41, notes: [57, 60, 64, 67, 72] },
    { bass: 36, notes: [55, 60, 62, 64, 67] },
    { bass: 43, notes: [53, 57, 58, 62, 65] },
    { bass: 34, notes: [53, 57, 60, 62, 69] },
    { bass: 33, notes: [55, 57, 62, 64, 67] },
    { bass: 38, notes: [53, 57, 60, 64, 69] }
  ];
  const motif = [
    [74, 77, 76, 72], [74, 77, 81, 77], [76, 79, 81, 79], [74, 79, 76, 72],
    [74, 77, 81, 79], [74, 77, 72, 69], [76, 79, 74, 71], [77, 76, 74, 69]
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
    let mix, pads, compressor, level, master, delay, noise;
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
    function pan(output, nodes, value, destination = mix) {
      if (typeof audio.createStereoPanner !== 'function') { output.connect(destination); return; }
      const panner = audio.createStereoPanner(); panner.pan.value = value;
      output.connect(panner); panner.connect(destination); nodes.push(panner);
    }
    function tone(note, at, duration, peak, { type = 'triangle', cutoff = 900, spread = 0, echo = false, attack = .012, pad = false, metal = 0 } = {}) {
      if (voices.size >= MAX_VOICES) return;
      const oscillator = audio.createOscillator(), gain = audio.createGain(), filter = audio.createBiquadFilter();
      const nodes = [oscillator, gain, filter], sources = [oscillator];
      oscillator.type = type; oscillator.frequency.setValueAtTime(frequency(note), at);
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(cutoff * .6, at); filter.Q.value = .4;
      filter.frequency.linearRampToValueAtTime(cutoff, at + attack + .03);
      filter.frequency.exponentialRampToValueAtTime(Math.max(280, cutoff * .6), at + duration);
      oscillator.connect(filter); filter.connect(gain); pan(gain, nodes, spread, pad ? pads : mix);
      // A decaying FM sideband adds a gentle digital/bell attack, not a sample.
      if (metal) {
        const modulator = audio.createOscillator(), depth = audio.createGain();
        modulator.type = 'sine'; modulator.frequency.setValueAtTime(frequency(note) * 2.01, at);
        depth.gain.setValueAtTime(frequency(note) * metal, at); depth.gain.exponentialRampToValueAtTime(.01, at + duration * .7);
        modulator.connect(depth); depth.connect(oscillator.frequency); nodes.push(modulator, depth); sources.push(modulator);
      }
      if (echo) gain.connect(delay);
      if (pad) {
        gain.gain.setValueAtTime(.0001, at); gain.gain.linearRampToValueAtTime(peak, at + attack);
        gain.gain.linearRampToValueAtTime(peak * .82, at + BEAT * 3.5); gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
      } else envelope(gain.gain, at, peak, attack, duration);
      register(sources, nodes, at, duration + .025);
    }
    function kick(at) {
      if (voices.size >= MAX_VOICES) return;
      const oscillator = audio.createOscillator(), gain = audio.createGain();
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(96, at); oscillator.frequency.exponentialRampToValueAtTime(46, at + .14);
      oscillator.connect(gain); gain.connect(mix); envelope(gain.gain, at, .36, .006, .32);
      register([oscillator], [oscillator, gain], at, .35);
    }
    function percussion(at, { clap = false, open = false, soft = false } = {}) {
      if (voices.size >= MAX_VOICES) return;
      const source = audio.createBufferSource(), filter = audio.createBiquadFilter(), gain = audio.createGain();
      source.buffer = noise; filter.type = clap ? 'bandpass' : 'highpass'; filter.frequency.value = clap ? 1450 : 4900; filter.Q.value = clap ? .65 : .4;
      source.connect(filter); filter.connect(gain); gain.connect(mix);
      const duration = clap ? .14 : open ? .13 : .05, peak = clap ? .032 : soft ? .0045 : .015;
      envelope(gain.gain, at, peak, .004, duration);
      register([source], [source, filter, gain], at, duration + .015);
    }
    function step(index, at) {
      const tick = index % 16, bar = Math.floor(index / 16) % 32, chordIndex = Math.floor(bar / 4), chord = harmony[chordIndex];
      const opening = bar < 4, breathing = bar >= 16 && bar < 20, closing = bar >= 28;
      if (tick % 4 === 0 && (!breathing || tick % 8 === 0)) {
        kick(at);
        pads.gain.setValueAtTime(.48, at); pads.gain.exponentialRampToValueAtTime(.9, at + BEAT * .75);
      }
      if ((tick === 4 || tick === 12) && !breathing && bar >= 2) percussion(at, { clap: true });
      if (tick % 4 === 2 && !breathing) percussion(at, { open: tick === 14 && bar % 4 === 3 });
      if (tick % 2 === 1 && bar >= 2) percussion(at, { soft: true });
      if (tick === 0) chord.notes.forEach((note, i) => tone(note, at + i * .009, BEAT * 4 + .34, .031, { cutoff: breathing ? 620 : 850, spread: (i - 2) * .24, attack: .28, pad: true }));
      const bassPattern = { 0: 0, 2: 0, 5: 12, 8: 0, 10: 7, 14: 0 };
      if (Object.hasOwn(bassPattern, tick) && (!opening || tick % 8 === 0) && (!breathing || tick === 0 || tick === 10)) tone(chord.bass + bassPattern[tick], at, STEP * 1.2, .13, { cutoff: 440, attack: .012 });
      const arpeggio = [1, 4, 7, 10, 14].indexOf(tick);
      if (arpeggio >= 0 && (!closing || arpeggio % 2 === 0)) tone(chord.notes[(arpeggio + bar) % 5] + 12, at, .4, opening || breathing ? .012 : .019, { type: 'sine', cutoff: 1450 + (bar % 8) * 55, spread: arpeggio % 2 ? .42 : -.42, echo: true, metal: .3 });
      const phrase = [3, 11].indexOf(tick);
      if (phrase >= 0 && bar % 2 === 1 && !breathing) tone(motif[chordIndex][(bar % 4 < 2 ? 0 : 2) + phrase], at, .95, .032, { type: 'sine', cutoff: 2200, spread: phrase ? .2 : -.2, echo: true, attack: .025, metal: .12 });
      if (tick === 15 && bar % 4 === 3 && !closing) tone(chord.notes[2] + 24, at, .09, .006, { type: 'sine', cutoff: 2400, spread: .55, metal: .18 });
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
      pads = keep(audio.createGain()); pads.gain.value = .9; pads.connect(mix);
      compressor.threshold.value = -15; compressor.knee.value = 20; compressor.ratio.value = 4; compressor.attack.value = .003; compressor.release.value = .25;
      level.gain.value = volume / 100; master.gain.value = 0;
      mix.connect(compressor); compressor.connect(level); level.connect(master); master.connect(audio.destination);
      // A quiet dotted echo extends the electronic attacks without a reverb file.
      delay = keep(audio.createDelay(1)); delay.delayTime.value = BEAT * .75;
      const shade = keep(audio.createBiquadFilter()), feedback = keep(audio.createGain()), wet = keep(audio.createGain());
      shade.type = 'lowpass'; shade.frequency.value = 1450; feedback.gain.value = .2; wet.gain.value = .18;
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
  button.hidden = false; button.dataset.tempo = String(BPM); button.dataset.composition = 'orbita-digital'; button.dataset.cycleBars = '32'; button.dataset.voices = '0'; button.dataset.context = 'closed'; display(Audio ? 'paused' : 'unavailable');
  updateVolume(); volumeInput?.addEventListener('input', updateVolume);
  player?.addEventListener('keydown', event => { if (event.key === 'Escape' && volumePanel?.open) { event.preventDefault(); closeVolume(); volumePanel.querySelector('summary').focus(); } });
  document.addEventListener('pointerdown', event => { if (volumePanel?.open && !player?.contains(event.target)) closeVolume(); });
  document.addEventListener('focusin', event => { if (volumePanel?.open && !player?.contains(event.target)) closeVolume(); });
  button.addEventListener('click', () => { if (engine || pending) stop(); else start(); });
  document.addEventListener('play', event => { if (event.target?.matches?.('video') && (engine || pending)) stop(); }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { closeVolume(); if (engine || pending) stop(); } });
  window.addEventListener('pagehide', () => { closeVolume(); if (engine || pending) stop(); });
})();
