import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { interfaceCopy } from '../src/content/interface.mjs';
import { soundtrackTrack } from '../src/content/soundtrack.mjs';
import { soundtrack } from '../src/components/soundtrack.mjs';

const production = await readFile(new URL('../dist/assets/soundtrack.js', import.meta.url), 'utf8');
const source = await readFile(new URL('../src/client/soundtrack.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles/soundtrack.css', import.meta.url), 'utf8');
const provenance = JSON.parse(await readFile(new URL('../docs/music.json', import.meta.url), 'utf8'));
assert.equal(soundtrackTrack.src, provenance.published.path);
for (const directory of ['public', 'dist']) {
  const recording = await readFile(new URL(`../${directory}${provenance.published.path}`, import.meta.url));
  assert.equal(recording.length, provenance.published.bytes, `The ${directory} recording matches its documented size`);
  assert.equal(createHash('sha256').update(recording).digest('hex'), provenance.published.sha256, `The ${directory} recording matches its documented fingerprint`);
}
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function gate() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

// Stateful media mocks exercise the minified recording controller. They verify
// user intent and cleanup; real playback/volume remain browser listening checks.
function fixture(options = {}) {
  const handlers = new Map(), media = [], contexts = [], requests = [];
  const events = name => ({ addEventListener(type, callback, capture) {
    const key = `${name}:${type}`;
    if (!handlers.has(key)) handlers.set(key, []);
    handlers.get(key).push({ callback, capture });
  } });
  const fire = (name, type, event = {}) => {
    for (const { callback } of handlers.get(`${name}:${type}`) || []) callback(event);
  };
  const copy = interfaceCopy[options.lang || 'es'].audio;
  const label = { textContent: copy.play }, status = { textContent: '' };
  const button = { ...events('button'), dataset: { ...copy, src: options.noSrc ? '' : soundtrackTrack.src }, attributes: {},
    querySelector: () => label, setAttribute(name, value) { this.attributes[name] = value; } };
  const slider = { ...events('slider'), value: '65', attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
  const output = { textContent: '65%' }, summary = { focused: false, focus() { this.focused = true; } };
  const panel = { open: false, querySelector: () => summary };
  const player = { ...events('player'), hidden: true, contains: target => [button, slider, summary].includes(target) };
  const elements = { '[data-soundtrack]': options.absent ? null : button, '[data-soundtrack-player]': player,
    '[data-soundtrack-status]': status, '[data-soundtrack-volume]': slider,
    '[data-soundtrack-volume-value]': output, '[data-soundtrack-volume-panel]': panel };
  const document = { ...events('document'), hidden: false, querySelector: selector => elements[selector] || null };
  class Recording {
    constructor() {
      if (options.mediaFails) throw new Error('Media constructor unavailable');
      this.listeners = new Map(); this._src = ''; this.volume = 1; this.paused = true;
      this.pauseCalls = 0; this.playCalls = 0; this.loadCalls = 0; this.playGate = gate(); media.push(this);
    }
    set src(value) { this._src = value; requests.push(value); }
    get src() { return this._src; }
    addEventListener(type, callback) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(callback);
    }
    emit(type) { for (const callback of this.listeners.get(type) || []) callback(); }
    async play() {
      this.playCalls++;
      if (options.playFails) throw new Error('Playback rejected');
      if (options.deferPlay) await this.playGate.promise;
      this.paused = false;
    }
    pause() { this.pauseCalls++; this.paused = true; this.emit('pause'); }
    removeAttribute(name) { assert.equal(name, 'src'); this._src = ''; }
    load() { this.loadCalls++; }
  }
  class GraphNode {
    constructor(context, kind) { this.kind = kind; this.outputs = new Set(); this.disconnects = 0; context.nodes.push(this); }
    connect(target) { this.outputs.add(target); return target; }
    disconnect() { this.disconnects++; this.outputs.clear(); }
  }
  class Context {
    constructor(config) {
      if (options.contextFails) throw new Error('Context unavailable');
      assert.equal(config.latencyHint, 'playback');
      this.state = 'suspended'; this.currentTime = 12; this.destination = {}; this.nodes = [];
      this.resumeCalls = 0; this.closeCalls = 0; this.resumeGate = gate(); contexts.push(this);
    }
    createMediaElementSource(audio) {
      if (options.sourceFails) throw new Error('Media source unavailable');
      assert.ok(media.includes(audio)); const node = new GraphNode(this, 'source'); node.audio = audio; return node;
    }
    createGain() {
      if (options.gainFails) throw new Error('Gain unavailable');
      const node = new GraphNode(this, 'gain');
      node.gain = { value: 1, events: [], setTargetAtTime(value, at, constant) {
        assert.ok(value >= 0 && value <= 1); assert.equal(at, 12); assert.equal(constant, .025);
        this.value = value; this.events.push({ value, at, constant });
      } };
      return node;
    }
    async resume() {
      this.resumeCalls++;
      if (options.resumeFails) throw new Error('Resume rejected');
      if (options.deferResume) await this.resumeGate.promise;
      if (this.state !== 'closed' && !options.staysSuspended) this.state = 'running';
    }
    async close() { this.closeCalls++; this.state = 'closed'; }
  }
  const window = { ...events('window'), Audio: options.noAudio ? undefined : Recording };
  if (!options.nativeVolume) window[options.webkit ? 'webkitAudioContext' : 'AudioContext'] = Context;
  vm.runInNewContext(production, { window, document,
    fetch() { throw new Error('Only explicit media Play initiates a download'); },
    localStorage: { getItem() { throw new Error('No persisted playback'); }, setItem() { throw new Error('No persisted playback'); } },
    setInterval() { throw new Error('Recorded playback needs no scheduling loop'); },
    requestAnimationFrame() { throw new Error('Recorded playback needs no animation loop'); }
  });
  return { options, handlers, media, contexts, requests, copy, button, label, status, slider, output, panel, summary, player, document, fire,
    async click() { fire('button', 'click'); await flush(); },
    setVolume(value) { slider.value = String(value); fire('slider', 'input'); },
    async resolveResume(index = contexts.length - 1) { contexts[index].resumeGate.resolve(); await flush(); },
    async resolvePlay(index = media.length - 1) { media[index].playGate.resolve(); await flush(); }
  };
}

function released(test, { recordings = test.media, graphs = test.contexts } = {}) {
  for (const audio of recordings) {
    assert.equal(audio.src, '', 'Stopping clears the media URL');
    assert.equal(audio.paused, true, 'Stopping pauses the recording');
    assert.ok(audio.loadCalls > 0, 'Clearing src releases the media resource');
  }
  for (const context of graphs) {
    assert.equal(context.state, 'closed', 'Stopping closes the audio context');
    assert.equal(context.closeCalls, 1, 'Each graph is closed exactly once');
    assert.ok(context.nodes.every(node => node.outputs.size === 0 && node.disconnects > 0), 'Stopping disconnects all allocated nodes');
  }
}

for (const options of [{ absent: true }, { noAudio: true }, { noSrc: true }]) {
  const disabled = fixture(options);
  assert.equal(disabled.player.hidden, true); assert.equal(disabled.media.length, 0); assert.equal(disabled.contexts.length, 0);
  assert.equal(disabled.requests.length, 0); assert.equal(disabled.handlers.size, 0, 'Unavailable controls do not register inactive listeners');
}

for (const lang of ['es', 'en']) {
  const markup = soundtrack(lang);
  assert.ok(markup.includes(`data-src="${soundtrackTrack.src}"`) && markup.includes(`data-play-label="${interfaceCopy[lang].audio.playLabel}"`), 'The localized control selects the actual recording');
  assert.ok(!/<audio\b|\bautoplay\b|<link\b[^>]*\bpreload\b/i.test(markup), 'The rendered player contains no eager media element or preload');
  for (const credit of [soundtrackTrack.title, soundtrackTrack.artist, soundtrackTrack.source, soundtrackTrack.license, soundtrackTrack.licenseURL, interfaceCopy[lang].audio.adaptation]) {
    assert.ok(credit && markup.includes(credit), 'Source, licence and adaptation credits remain visible in both languages');
  }
  const normal = fixture({ lang });
  assert.equal(normal.player.hidden, false); assert.equal(normal.button.dataset.state, 'paused');
  assert.equal(normal.media.length, 0); assert.equal(normal.contexts.length, 0); assert.equal(normal.requests.length, 0, 'A page load does not create or download audio');
  normal.setVolume(32); assert.equal(normal.media.length, 0); assert.equal(normal.requests.length, 0, 'A paused volume edit does not download or start audio');
  await normal.click();
  const audio = normal.media[0], context = normal.contexts[0], gain = context.nodes.find(node => node.kind === 'gain');
  assert.deepEqual(normal.requests, [soundtrackTrack.src]); assert.equal(audio.preload, 'none'); assert.equal(audio.loop, true);
  assert.equal(audio.playCalls, 1); assert.equal(audio.volume, 1); assert.equal(gain.gain.value, .32);
  assert.equal(context.resumeCalls, 1); assert.equal(context.state, 'running');
  assert.equal(normal.button.dataset.state, 'playing'); assert.equal(normal.button.attributes['aria-pressed'], 'true');
  assert.equal(normal.button.attributes['aria-busy'], 'false'); assert.equal(normal.button.attributes['aria-label'], normal.copy.pauseLabel);
  assert.equal(normal.button.dataset.tooltip, normal.copy.pauseLabel); assert.equal(normal.label.textContent, normal.copy.pause); assert.equal(normal.status.textContent, normal.copy.playing);
  normal.setVolume(0); assert.equal(gain.gain.value, 0); normal.setVolume(100); assert.equal(gain.gain.value, 1);
  normal.setVolume(200); assert.equal(normal.slider.value, '100'); normal.setVolume(-1); assert.equal(gain.gain.value, 0);
  normal.setVolume(70); normal.setVolume('invalid'); assert.equal(gain.gain.value, .7); assert.equal(normal.output.textContent, '70%');
  assert.equal(normal.slider.attributes['aria-valuetext'], '70%'); assert.equal(context.nodes.length, 2); assert.equal(normal.contexts.length, 1); assert.equal(audio.playCalls, 1, 'Changing level never restarts playback or allocates a graph');
  await normal.click(); released(normal);
  assert.equal(normal.button.dataset.state, 'paused'); assert.equal(normal.button.attributes['aria-pressed'], 'false');
  assert.equal(normal.button.dataset.tooltip, normal.copy.playLabel); assert.equal(normal.label.textContent, normal.copy.play); assert.equal(normal.status.textContent, normal.copy.stopped);
  await normal.click(); assert.equal(normal.media.length, 2); assert.equal(normal.contexts[1].nodes.find(node => node.kind === 'gain').gain.value, .7, 'A later Play uses the visitor’s latest level');
  await normal.click(); released(normal);
}

for (const event of ['hidden', 'pagehide', 'media-error', 'media-pause', 'video']) {
  const test = fixture(); await test.click(); test.panel.open = true;
  if (event === 'hidden') { test.document.hidden = true; test.fire('document', 'visibilitychange'); }
  if (event === 'pagehide') test.fire('window', 'pagehide');
  if (event === 'media-error') test.media[0].emit('error');
  if (event === 'media-pause') test.media[0].emit('pause');
  if (event === 'video') test.fire('document', 'play', { target: { matches: selector => selector === 'video' } });
  released(test); assert.equal(test.button.dataset.state, event === 'media-error' ? 'unavailable' : 'paused');
  if (event === 'hidden' || event === 'pagehide') assert.equal(test.panel.open, false);
  test.document.hidden = false; test.fire('document', 'visibilitychange');
  assert.equal(test.media.length, 1, 'Returning to a visible tab never resumes music automatically');
}

for (const mode of ['deferResume', 'deferPlay']) for (const interruption of ['pause', 'hidden', 'pagehide', 'video']) {
  const test = fixture({ [mode]: true }); await test.click();
  assert.equal(test.button.dataset.state, 'starting'); assert.equal(test.button.attributes['aria-busy'], 'true');
  if (interruption === 'pause') await test.click();
  if (interruption === 'hidden') { test.document.hidden = true; test.fire('document', 'visibilitychange'); }
  if (interruption === 'pagehide') test.fire('window', 'pagehide');
  if (interruption === 'video') test.fire('document', 'play', { target: { matches: () => true } });
  if (mode === 'deferResume') { await test.resolveResume(); assert.equal(test.media[0].playCalls, 0, 'A cancelled resume cannot call Play'); }
  else await test.resolvePlay();
  released(test); assert.equal(test.button.dataset.state, 'paused'); assert.equal(test.button.attributes['aria-busy'], 'false', 'A stale promise cannot resurrect playback or its UI');
}

for (const mode of ['deferResume', 'deferPlay']) {
  const replaced = fixture({ [mode]: true }); await replaced.click(); await replaced.click(); await replaced.click();
  if (mode === 'deferResume') await replaced.resolveResume(0); else await replaced.resolvePlay(0);
  released(replaced, { recordings: [replaced.media[0]], graphs: [replaced.contexts[0]] });
  assert.equal(replaced.button.dataset.state, 'starting', 'An old promise cannot change a newer request');
  if (mode === 'deferResume') await replaced.resolveResume(1); else await replaced.resolvePlay(1);
  assert.equal(replaced.button.dataset.state, 'playing'); assert.equal(replaced.media[1].src, soundtrackTrack.src);
  replaced.media[0].emit('error'); replaced.media[0].emit('pause');
  assert.equal(replaced.button.dataset.state, 'playing', 'Events from a released recording cannot stop the new one');
  await replaced.click(); released(replaced);
}

for (const failure of ['mediaFails', 'contextFails', 'sourceFails', 'gainFails', 'resumeFails', 'playFails', 'staysSuspended']) {
  const test = fixture({ [failure]: true }); await test.click();
  assert.equal(test.button.dataset.state, 'unavailable', `An audio failure is announced: ${failure}`); assert.equal(test.button.attributes['aria-pressed'], 'false');
  assert.equal(test.status.textContent, test.copy.unavailable); released(test);
  test.options[failure] = false; await test.click(); assert.equal(test.button.dataset.state, 'playing', 'An explicit retry can recover from a previous error'); await test.click(); released(test);
}

const native = fixture({ nativeVolume: true }); native.setVolume(42); await native.click();
assert.equal(native.contexts.length, 0); assert.equal(native.media[0].volume, .42); assert.equal(native.button.dataset.state, 'playing');
native.setVolume(15); assert.equal(native.media[0].volume, .15); await native.click(); released(native);
const webkit = fixture({ webkit: true }); await webkit.click(); assert.equal(webkit.contexts.length, 1); await webkit.click(); released(webkit);

const controls = fixture();
controls.panel.open = true; let prevented = false;
controls.fire('player', 'keydown', { key: 'Escape', preventDefault() { prevented = true; } });
assert.equal(controls.panel.open, false); assert.equal(controls.summary.focused, true); assert.equal(prevented, true);
controls.panel.open = true; controls.fire('document', 'pointerdown', { target: controls.slider }); assert.equal(controls.panel.open, true);
controls.fire('document', 'pointerdown', { target: {} }); assert.equal(controls.panel.open, false);
controls.panel.open = true; controls.fire('document', 'focusin', { target: controls.summary }); assert.equal(controls.panel.open, true);
controls.fire('document', 'focusin', { target: {} }); assert.equal(controls.panel.open, false);
await controls.click(); controls.fire('document', 'play', { target: { matches: () => false } }); assert.equal(controls.button.dataset.state, 'playing', 'Other media events do not impersonate video playback');
assert.equal(controls.handlers.get('document:play')[0].capture, true, 'Native video Play is observed in the capture phase');
await controls.click(); released(controls);

assert.ok(!/createOscillator|createBufferSource|setInterval\(|requestAnimationFrame\(|localStorage|sessionStorage|fetch\(/.test(source), 'The recording controller contains no legacy synthesis, background scheduler or persisted playback');
assert.ok(styles.includes('prefers-reduced-motion') && styles.includes('forced-colors') && styles.includes('var(--accent)'));
console.log(JSON.stringify({ soundtrack: true, runtime: 'generated/minified', languages: ['es', 'en'], checks: ['no media allocation or download before Play', 'volume and native fallback', 'localized actions', 'pause/hidden/navigation/error cleanup', 'partial initialization failures', 'cancelled resume/play and newer request isolation', 'retry', 'video arbitration', 'volume-panel keyboard and outside dismissal'] }));
