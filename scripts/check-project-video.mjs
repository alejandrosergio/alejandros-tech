import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { projects, projectPath, projectDestination } from '../src/content/projects.mjs';
import { powerPlatformProject as project, projectVideoCopy, videoTranscript, videoCaptions } from '../src/content/power-platform-video.mjs';
import { projectTechnologies } from '../src/content/project-technologies.mjs';

assert.equal(projects.filter(item => item.video).length, 1);
assert.deepEqual(Object.keys(projectVideoCopy.es), Object.keys(projectVideoCopy.en));
assert.equal(projectTechnologies[project.id].length, 6);
assert.ok(!project.live && !project.repository, 'A recording must not imply a publicly runnable app or source repository');
for (const lang of ['es', 'en']) {
  const html = await readFile(new URL(`../dist${projectPath(project, lang)}index.html`, import.meta.url), 'utf8');
  const home = await readFile(new URL(`../dist/${lang === 'en' ? 'en/' : ''}index.html`, import.meta.url), 'utf8');
  const media = html.match(/<video\b[^]*?<\/video>/)?.[0];
  assert.ok(media?.includes('controls playsinline preload="none"'));
  assert.ok(!/autoplay|\bloop\b/.test(media));
  assert.ok(media.includes(`poster="${project.image[lang]}"`));
  assert.ok(media.includes(`src="${project.video.src}" type="video/mp4"`));
  assert.equal((media.match(/<track /g) || []).length, 2);
  assert.equal((media.match(/ default/g) || []).length, lang === 'en' ? 1 : 0, 'Spanish captions are already burned in; English subtitles can be switched off');
  assert.ok(html.includes(`href="${projectDestination(project, lang)}"`));
  assert.ok(html.includes('class="case-delivery-steps"') && html.includes(projectVideoCopy[lang].transcript));
  assert.ok(home.includes('project-card--video') && !home.includes('<video') && !home.includes(project.video.src), 'Home loads a poster, not the video');
  assert.ok(html.includes('/assets/project-video.js') && !home.includes('/assets/project-video.js'));
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1])['@graph'];
  const video = graph.find(item => item['@type'] === 'VideoObject');
  assert.equal(video.contentUrl, `https://alejandros-tech.alejosergio3000.chatgpt.site${project.video.src}`);
  assert.equal(video.duration, 'PT2M58S'); assert.equal(video.inLanguage, 'es');
  assert.ok(!video.interactionStatistic && !video.embedUrl, 'No invented views or video hosting service');
  const captions = await readFile(new URL(`../dist/assets/power-platform-${lang}.vtt`, import.meta.url), 'utf8');
  assert.equal(captions, videoCaptions(lang));
  const payload = captions.split('\n').filter(line => line && line !== 'WEBVTT' && !line.includes(' --> '));
  assert.ok(payload.every(line => line.length <= 44), 'Explicit caption lines fit the player without truncating long sentences');
  assert.equal(payload.join(' '), videoTranscript.filter(segment => !segment.visual).flatMap(segment => segment[lang]).join(' '), 'Wrapping retains every spoken word');
  const cues = [...captions.matchAll(/(\d\d:\d\d:\d\d\.\d\d\d) --> (\d\d:\d\d:\d\d\.\d\d\d)/g)];
  const seconds = time => time.split(':').reduce((sum, value) => sum * 60 + Number(value), 0);
  let previous = 0;
  for (const cue of cues) {
    const start = seconds(cue[1]), end = seconds(cue[2]);
    assert.ok(start >= previous && start < end && end <= project.video.duration, 'Captions stay ordered and within the recording'); previous = end;
  }
  assert.equal(cues.length, videoTranscript.filter(segment => !segment.visual).reduce((sum, segment) => sum + segment[lang].length, 0));
}

const bytes = await readFile(new URL(`../public${project.video.src}`, import.meta.url));
const built = await readFile(new URL(`../dist${project.video.src}`, import.meta.url));
assert.ok(bytes.equals(built) && bytes.length < 6_000_000, 'Optimised MP4 is copied unchanged');
const boxes = [];
for (let offset = 0; offset < bytes.length;) {
  const length = bytes.readUInt32BE(offset), type = bytes.toString('ascii', offset + 4, offset + 8);
  assert.ok(length >= 8 && offset + length <= bytes.length, 'Complete MP4 container'); boxes.push(type); offset += length;
}
assert.ok(boxes.indexOf('moov') < boxes.indexOf('mdat'), 'Fast-start metadata precedes the media data');
assert.ok(bytes.includes(Buffer.from('avc1')) && bytes.includes(Buffer.from('mp4a')), 'H.264 video and AAC audio');

const controller = await readFile(new URL('../src/client/project-video.js', import.meta.url), 'utf8');
function fixture({ deferred = false, fail = false, header = '5396028', size = 5396028, type = 'video/mp4', foreign = false, unsupported = false, blocked = false } = {}) {
  const handlers = new Map(), requests = [], created = [], revoked = []; let resolveFetch;
  const events = target => ({ addEventListener(name, callback) { handlers.set(`${target}:${name}`, callback); } });
  const label = { textContent: 'Play video' }, status = { textContent: '', hidden: true };
  const button = { ...events('button'), hidden: true, dataset: { play: 'Play video', loading: 'Preparing', ready: 'Ready', error: 'Error', retry: 'Retry' }, attributes: {}, querySelector: () => label, setAttribute(key, value) { this.attributes[key] = value; }, removeAttribute(key) { delete this.attributes[key]; } };
  const source = { src: `https://${foreign ? 'other.test' : 'example.test'}/assets/power-platform-delivery.mp4` };
  const video = { ...events('video'), paused: true, pauses: 0, plays: 0, loads: 0, blocked, querySelector: () => source,
    pause() { this.paused = true; this.pauses++; }, load() { this.loads++; }, focus() { document.activeElement = this; },
    removeAttribute(key) { delete this[key]; },
    async play() { this.plays++; if (this.blocked) throw Error('Gesture required'); this.paused = false; handlers.get('video:play')?.(); }
  };
  const elements = { '[data-project-video]': video, '[data-project-video-start]': button, '[data-project-video-status]': status, '[data-soundtrack]': events('music') };
  const document = { ...events('document'), hidden: false, activeElement: button, querySelector: selector => elements[selector] ?? null };
  class MediaURL extends URL { static createObjectURL(blob) { created.push(blob); return `blob:example-${created.length}`; } static revokeObjectURL(url) { revoked.push(url); } }
  async function fetch(url, options) {
    requests.push({ url, ...options });
    if (deferred) await new Promise(resolve => { resolveFetch = resolve; });
    if (fail) throw Error('Network failure');
    return { ok: true, headers: { get: () => header }, blob: async () => ({ size, type }) };
  }
  vm.runInNewContext(controller, { document, window: events('window'), fetch: unsupported ? undefined : fetch, AbortController, URL: MediaURL, location: { href: 'https://example.test/case/', origin: 'https://example.test' } });
  return { video, button, label, status, document, requests, created, revoked, fire: (target, event) => handlers.get(`${target}:${event}`)?.(), resolve: () => resolveFetch() };
}
const f = fixture();
assert.equal(f.requests.length, 0); assert.equal(f.video.plays, 0); assert.equal(f.button.hidden, false, 'No download or playback before activation');
await f.fire('button', 'click'); assert.equal(f.requests.length, 1); assert.equal(f.requests[0].credentials, 'omit');
assert.equal(f.created.length, 1); assert.equal(f.video.src, 'blob:example-1'); assert.equal(f.video.paused, false); assert.equal(f.button.hidden, true); assert.equal(f.document.activeElement, f.video);
await f.fire('video', 'play'); assert.equal(f.requests.length, 1, 'Repeated playback reuses the prepared recording');
f.document.hidden = true; f.fire('document', 'visibilitychange'); assert.equal(f.video.paused, true);
f.document.hidden = false; f.fire('document', 'visibilitychange'); assert.equal(f.video.paused, true, 'Visibility never resumes sound');
f.fire('music', 'click'); f.fire('window', 'pagehide'); assert.deepEqual(f.revoked, ['blob:example-1']); assert.equal(f.video.src, undefined); assert.equal(f.button.hidden, false);

for (const cancelTarget of ['hidden', 'music', 'pagehide']) {
  const pending = fixture({ deferred: true }); const task = pending.fire('button', 'click');
  await pending.fire('button', 'click'); assert.equal(pending.requests.length, 1, 'Pending clicks do not duplicate downloads');
  if (cancelTarget === 'hidden') { pending.document.hidden = true; pending.fire('document', 'visibilitychange'); }
  else pending.fire(cancelTarget === 'music' ? 'music' : 'window', cancelTarget === 'music' ? 'click' : 'pagehide');
  assert.equal(pending.requests[0].signal.aborted, true); pending.resolve(); await task;
  assert.equal(pending.created.length, 0); assert.equal(pending.video.plays, 0, 'A cancelled response cannot allocate media or restart playback');
}
for (const options of [{ fail: true }, { header: '6000001' }, { size: 6000001 }, { type: 'text/html' }, { foreign: true }]) {
  const failed = fixture(options); await failed.fire('button', 'click');
  assert.equal(failed.status.textContent, 'Error'); assert.equal(failed.button.hidden, false); assert.equal(failed.label.textContent, 'Retry'); assert.equal(failed.created.length, 0); assert.equal(failed.video.plays, 0);
  assert.ok(failed.requests.every(request => request.signal.aborted));
}
const gesture = fixture({ blocked: true }); await gesture.fire('button', 'click');
assert.equal(gesture.status.textContent, 'Ready'); assert.equal(gesture.button.hidden, false);
gesture.video.blocked = false; await gesture.fire('button', 'click'); assert.equal(gesture.video.paused, false); assert.equal(gesture.requests.length, 1, 'A browser gesture restriction needs no second download');
const native = fixture({ unsupported: true }); assert.equal(native.button.hidden, true); assert.equal(native.requests.length, 0); native.fire('music', 'click'); assert.equal(native.video.paused, true);
vm.runInNewContext(controller, { document: { querySelector: () => null } });
console.log('Project video: opt-in bounded media preparation, cancellation/retry/gesture handling, object URL disposal, native controls, captions/transcript, metadata and music coordination verified.');
