import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/client/soundtrack.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles/soundtrack.css', import.meta.url), 'utf8');

// The stateful audio graph checks transport correctness, timing, polyphony and
// disposal. Native browser QA separately verifies real AudioContext playback.
function fixture({ absent = false, unsupported = false, constructorFails = false, resumeFails = false, staysSuspended = false, deferred = false, noPanner = false } = {}) {
  const handlers = new Map(), timers = new Map(), contexts = []; let timerID = 0;
  const events = name => ({ addEventListener(type, callback) { const key = name + ':' + type; if (!handlers.has(key)) handlers.set(key, []); handlers.get(key).push(callback); } });
  const label = { textContent: 'Play' }, status = { textContent: '' };
  const button = { ...events('button'), hidden: true, dataset: { play: 'Play', pause: 'Pausa', playLabel: 'Reproducir música original', pauseLabel: 'Pausar música', playing: 'Música activada', stopped: 'Música pausada', unavailable: 'Audio no disponible' }, attributes: {},
    querySelector: () => label, setAttribute(name, value) { this.attributes[name] = value; }
  };
  const volumeInput = { ...events('volume'), value: '65', attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } }, volumeOutput = { textContent: '65%' };
  const summary = { focused: false, focus() { this.focused = true; } }, volumePanel = { open: false, querySelector: () => summary };
  const player = { ...events('player'), hidden: true, contains: target => [button, volumeInput, summary].includes(target) };
  const elements = { '[data-soundtrack]': absent ? null : button, '[data-soundtrack-status]': status, '[data-soundtrack-player]': player, '[data-soundtrack-volume]': volumeInput, '[data-soundtrack-volume-value]': volumeOutput, '[data-soundtrack-volume-panel]': volumePanel };
  const document = { ...events('document'), hidden: false, querySelector: selector => elements[selector] || null };
  class Param {
    constructor(value = 0) { this.value = value; this.events = []; }
    record(type, value, at) { assert.ok(Number.isFinite(value) && Number.isFinite(at) && at >= 0); if (type === 'exponential') assert.ok(value > 0); this.events.push({ type, value, at }); this.value = value; }
    setValueAtTime(value, at) { this.record('set', value, at); }
    linearRampToValueAtTime(value, at) { this.record('linear', value, at); }
    exponentialRampToValueAtTime(value, at) { this.record('exponential', value, at); }
    cancelScheduledValues(at) { this.events.push({ type: 'cancel', at }); }
    setTargetAtTime(value, at, timeConstant) { assert.equal(timeConstant, .025); this.record('target', value, at); }
  }
  class Node {
    constructor(audio, kind) { this.audio = audio; this.kind = kind; this.outputs = new Set(); this.stopped = false; audio.nodes.add(this); }
    connect(node) { this.outputs.add(node); return node; }
    disconnect() { this.outputs.clear(); }
    start(at) { assert.ok(at >= this.audio.currentTime, 'Sources are scheduled ahead of the audio clock'); this.startAt = at; }
    stop(at = this.audio.currentTime) { this.stopAt = at; this.stopped = true; }
  }
  class Audio {
    constructor(options) {
      if (constructorFails) throw new Error('Unavailable');
      assert.equal(options.latencyHint, 'playback'); this.nodes = new Set(); this.buffers = []; this.state = 'suspended'; this.sampleRate = 44100; this.currentTime = 0; this.listeners = []; this.destination = {}; this.closeCalls = 0; this.resumeCalls = 0; contexts.push(this);
      if (noPanner) this.createStereoPanner = undefined;
    }
    node(kind) { return new Node(this, kind); }
    createGain() { const n = this.node('gain'); n.gain = new Param(1); return n; }
    createDynamicsCompressor() { const n = this.node('compressor'); for (const name of ['threshold', 'knee', 'ratio', 'attack', 'release']) n[name] = new Param(); return n; }
    createDelay(max) { assert.equal(max, 1); const n = this.node('delay'); n.delayTime = new Param(); return n; }
    createBiquadFilter() { const n = this.node('filter'); n.frequency = new Param(); n.Q = new Param(); return n; }
    createStereoPanner() { const n = this.node('panner'); n.pan = new Param(); return n; }
    createOscillator() { const n = this.node('oscillator'); n.frequency = new Param(); return n; }
    createBufferSource() { return this.node('noise'); }
    createBuffer(channels, length, rate) { assert.equal(channels, 1); assert.equal(rate, this.sampleRate); const data = new Float32Array(length), buffer = { getChannelData: () => data, data }; this.buffers.push(buffer); return buffer; }
    addEventListener(type, callback) { assert.equal(type, 'statechange'); this.listeners.push(callback); }
    async resume() {
      this.resumeCalls++;
      if (resumeFails) throw new Error('Blocked');
      if (deferred) await new Promise(resolve => { this.resolveResume = resolve; });
      if (this.state !== 'closed' && !staysSuspended) this.state = 'running';
    }
    async close() { this.closeCalls++; this.state = 'closed'; this.listeners.forEach(callback => callback()); }
    advance(seconds) {
      this.currentTime += seconds;
      for (const node of [...this.nodes]) if (!node.ended && node.startAt !== undefined && node.stopAt <= this.currentTime) { node.ended = true; node.onended?.(); }
    }
    interrupt() { this.state = 'suspended'; this.listeners.forEach(callback => callback()); }
  }
  const window = { ...events('window'), AudioContext: unsupported ? undefined : Audio };
  vm.runInNewContext(source, { window, document, Float32Array,
    setTimeout(callback, delay) { assert.equal(delay, 25, 'One short scheduling lookahead timer'); timers.set(++timerID, callback); return timerID; }, clearTimeout(id) { timers.delete(id); },
    fetch() { throw new Error('The composition must never request audio or services'); },
    localStorage: { setItem() { throw new Error('Playback must not be persisted'); }, getItem() { throw new Error('Playback must not be restored'); } },
    requestAnimationFrame() { throw new Error('Audio timing must use the audio clock, not a perpetual visual loop'); }
  });
  const fire = (target, type, event = {}) => { const callbacks = handlers.get(target + ':' + type); assert.ok(callbacks, 'Registered ' + target + ':' + type); callbacks.forEach(callback => callback(event)); };
  return { contexts, button, label, status, document, timers, fire, player, volumeInput, volumeOutput, volumePanel, summary,
    setVolume(value) { volumeInput.value = String(value); fire('volume', 'input'); },
    async click() { fire('button', 'click'); await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); },
    tick(seconds = .025) { contexts.forEach(audio => { if (audio.state === 'running') audio.advance(seconds); }); const queued = [...timers.values()]; timers.clear(); queued.forEach(callback => callback()); },
    async resolve() { contexts.at(-1).resolveResume(); await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); },
    live() { return [...contexts.at(-1).nodes].filter(node => node.outputs.size); }
  };
}

const absent = fixture({ absent: true }); assert.equal(absent.contexts.length, 0); assert.equal(absent.timers.size, 0);
const normal = fixture();
assert.equal(normal.contexts.length, 0, 'Loading a page never creates an audio context'); assert.equal(normal.button.hidden, false); assert.equal(normal.button.dataset.state, 'paused'); assert.equal(normal.timers.size, 0); assert.equal(normal.status.textContent, '');
await normal.click();
const audio = normal.contexts[0];
assert.equal(audio.state, 'running'); assert.equal(audio.resumeCalls, 1); assert.equal(normal.button.dataset.state, 'playing'); assert.equal(normal.button.attributes['aria-pressed'], 'true'); assert.equal(normal.label.textContent, 'Pausa'); assert.equal(normal.button.dataset.tooltip, 'Pausar música'); assert.equal(normal.button.attributes['aria-label'], 'Pausar música'); assert.equal(normal.status.textContent, 'Música activada'); assert.equal(normal.timers.size, 1);
assert.equal(normal.button.dataset.tempo, '112'); assert.ok(Number(normal.button.dataset.voices) > 0);
const master = [...audio.nodes].find(node => node.outputs.has(audio.destination));
assert.ok(master.gain.events.some(event => event.type === 'linear' && event.value === .6 && event.at === .55), 'The louder master still fades in');
const compressor = [...audio.nodes].find(node => node.kind === 'compressor'); assert.equal(compressor.ratio.value, 4);
const level = [...compressor.outputs][0];
assert.equal(level.gain.value, .65); assert.ok(level.gain.value * master.gain.value > .15 * 2, 'The initial output gain is more than twice the former fixed output');
const activeNodes = audio.nodes.size, scheduledAtLevelChange = normal.button.dataset.scheduled;
normal.setVolume(0); assert.equal(level.gain.events.at(-1).type, 'target'); assert.equal(level.gain.value, 0, 'Zero percent fades toward silence');
normal.setVolume(100); assert.equal(level.gain.value, 1); assert.equal(normal.volumeOutput.textContent, '100%'); assert.equal(normal.volumeInput.attributes['aria-valuetext'], '100%');
normal.setVolume(300); assert.equal(normal.volumeInput.value, '100'); normal.setVolume(-20); assert.equal(level.gain.value, 0); normal.setVolume(65);
assert.equal(audio.nodes.size, activeNodes); assert.equal(normal.contexts.length, 1); assert.equal(normal.button.dataset.scheduled, scheduledAtLevelChange); assert.equal(normal.timers.size, 1, 'Changing volume neither restarts playback nor allocates nodes/timers');
assert.equal(master.gain.events.at(-1).at, .55, 'Volume automation leaves the entrance envelope intact');
const noise = audio.buffers[0].data; assert.equal(noise.length, 22050); assert.ok(noise.every(value => value >= -1 && value <= 1)); assert.ok(Math.abs(noise.reduce((sum, value) => sum + value, 0) / noise.length) < .02); assert.ok(new Set(noise.slice(0, 100)).size > 90, 'Percussion noise is generated locally rather than fetched');
let maximum = Number(normal.button.dataset.voices);
for (let i = 0; i < 1600; i++) { normal.tick(); maximum = Math.max(maximum, Number(normal.button.dataset.voices)); assert.equal(normal.timers.size, 1); }
assert.ok(maximum <= 32, 'Normal polyphony stays well below the hard 64-voice limit');
assert.ok(Number(normal.button.dataset.scheduled) > 250, 'The eight-bar groove schedules continuously');
const sources = [...audio.nodes].filter(node => node.startAt !== undefined);
assert.ok(sources.every(node => node.stopAt - node.startAt < 3), 'Every source has a short scheduled lifetime');
assert.ok(sources.filter(node => node.kind === 'oscillator').some(node => node.frequency.events.some(event => Math.abs(event.value - 440 * 2 ** ((76 - 69) / 12)) < .001)), 'The composed melody is scheduled as pitched oscillators');
const beforeLag = Number(normal.button.dataset.scheduled); normal.tick(8); assert.ok(Number(normal.button.dataset.scheduled) - beforeLag <= 4, 'A delayed timer skips missed beats instead of bursting');
await normal.click();
assert.equal(normal.button.dataset.state, 'paused'); assert.equal(normal.button.attributes['aria-pressed'], 'false'); assert.equal(normal.label.textContent, 'Play'); assert.equal(normal.button.dataset.tooltip, 'Reproducir música original'); assert.equal(normal.status.textContent, 'Música pausada'); assert.equal(normal.timers.size, 0); assert.equal(audio.state, 'closed'); assert.equal(normal.live().length, 0); assert.equal(normal.button.dataset.voices, '0');
assert.ok(sources.every(node => node.stopped && node.onended === null), 'Pause cancels all sources and their callbacks');
await normal.click(); assert.equal(normal.contexts.length, 2); normal.document.hidden = true; normal.fire('document', 'visibilitychange'); assert.equal(normal.timers.size, 0); assert.equal(normal.contexts.at(-1).state, 'closed'); normal.document.hidden = false; normal.fire('document', 'visibilitychange'); assert.equal(normal.contexts.length, 2); assert.equal(normal.timers.size, 0, 'A visible page does not resume sound automatically');
await normal.click(); normal.fire('window', 'pagehide'); assert.equal(normal.contexts.at(-1).state, 'closed'); assert.equal(normal.timers.size, 0);
await normal.click(); normal.contexts.at(-1).interrupt(); assert.equal(normal.button.dataset.state, 'paused'); assert.equal(normal.timers.size, 0, 'An externally suspended context is released instead of silently claiming playback');

for (const options of [{ unsupported: true }, { constructorFails: true }, { resumeFails: true }, { staysSuspended: true }]) {
  const unavailable = fixture(options); await unavailable.click(); assert.equal(unavailable.button.dataset.state, 'unavailable'); assert.equal(unavailable.button.attributes['aria-pressed'], 'false'); assert.equal(unavailable.label.textContent, 'Play'); assert.equal(unavailable.status.textContent, 'Audio no disponible'); assert.equal(unavailable.timers.size, 0); assert.ok(unavailable.contexts.every(audio => audio.state === 'closed'));
}
const pending = fixture({ deferred: true }); await pending.click(); assert.equal(pending.button.dataset.state, 'starting'); assert.equal(pending.button.attributes['aria-pressed'], 'false'); assert.equal(pending.timers.size, 0); await pending.click(); await pending.resolve(); assert.equal(pending.button.dataset.state, 'paused'); assert.equal(pending.contexts.length, 1); assert.equal(pending.contexts[0].state, 'closed'); assert.equal(pending.timers.size, 0, 'A cancelled async resume cannot restart sound');
const hiddenPending = fixture({ deferred: true }); await hiddenPending.click(); hiddenPending.document.hidden = true; hiddenPending.fire('document', 'visibilitychange'); await hiddenPending.resolve(); assert.equal(hiddenPending.button.dataset.state, 'paused'); assert.equal(hiddenPending.timers.size, 0);
const mono = fixture({ noPanner: true }); await mono.click(); assert.equal(mono.button.dataset.state, 'playing'); await mono.click(); assert.equal(mono.live().length, 0, 'Stereo panning is optional');
const controls = fixture();
controls.setVolume(20); assert.equal(controls.contexts.length, 0); assert.equal(controls.timers.size, 0, 'Setting a paused volume never starts audio');
controls.volumePanel.open = true; controls.fire('player', 'keydown', { key: 'Escape', preventDefault() {} }); assert.equal(controls.volumePanel.open, false); assert.equal(controls.summary.focused, true);
controls.volumePanel.open = true; controls.fire('document', 'pointerdown', { target: controls.volumeInput }); assert.equal(controls.volumePanel.open, true); controls.fire('document', 'pointerdown', { target: {} }); assert.equal(controls.volumePanel.open, false);
controls.volumePanel.open = true; controls.fire('document', 'focusin', { target: {} }); assert.equal(controls.volumePanel.open, false);
await controls.click(); assert.equal([...controls.contexts[0].nodes].find(node => node.kind === 'compressor').outputs.values().next().value.gain.value, .2, 'Play uses the level chosen before playback');
controls.volumePanel.open = true; controls.document.hidden = true; controls.fire('document', 'visibilitychange'); assert.equal(controls.volumePanel.open, false); assert.equal(controls.contexts[0].state, 'closed');
assert.ok(styles.includes('prefers-reduced-motion') && styles.includes('forced-colors') && styles.includes('data-motion'));
assert.ok(styles.includes('min-height: 46px') && styles.includes('min-height: 44px') && styles.includes('var(--accent)'));
assert.ok(!/fetch\(|localStorage|document\.cookie|https?:|<audio/.test(source), 'The soundtrack has no remote track, service, persistence or media autoplay');
console.log('Soundtrack: opt-in transport, original 112-BPM synthesis, bounded polyphony/lookahead, error/race handling, native context state and complete pause/navigation teardown verified.');
