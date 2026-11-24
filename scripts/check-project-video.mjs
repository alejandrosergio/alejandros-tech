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
const handlers = new Map(); let pauses = 0;
const events = target => ({ addEventListener(type, callback) { handlers.set(`${target}:${type}`, callback); } });
const element = { pause() { pauses++; } }, button = events('music');
const document = { ...events('document'), hidden: false, querySelector: selector => selector === '[data-project-video]' ? element : button };
vm.runInNewContext(controller, { document, window: events('window') });
assert.equal(pauses, 0, 'No playback or audio operations at page load');
handlers.get('document:visibilitychange')(); assert.equal(pauses, 0);
document.hidden = true; handlers.get('document:visibilitychange')(); assert.equal(pauses, 1);
document.hidden = false; handlers.get('document:visibilitychange')(); assert.equal(pauses, 1, 'No automatic resume');
handlers.get('music:click')(); handlers.get('window:pagehide')(); assert.equal(pauses, 3);
vm.runInNewContext(controller, { document: { querySelector: () => null } });
console.log('Project video: native opt-in playback, bilingual captions/transcript, honest metadata, fast-start H.264/AAC and music/visibility coordination verified.');
