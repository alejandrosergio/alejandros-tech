import { projectVideoCopy, videoTranscript } from '../content/power-platform-video.mjs';
import { escapeHTML as e } from '../lib/html.mjs';

const minute = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export function projectVideo(project, lang) {
  const t = projectVideoCopy[lang];
  return `<section class="project-video" id="project-video" aria-labelledby="project-video-title">
    <div class="project-video-heading"><h2 id="project-video-title">${e(t.title)}</h2><span>${t.duration}</span></div>
    <figure class="project-video-media"><video controls playsinline preload="none" width="1280" height="720" poster="${e(project.image[lang])}" aria-label="${e(project[lang].name)}" aria-describedby="project-video-description" data-project-video>
      <source src="${project.video.src}" type="video/mp4">
      <track kind="captions" src="/assets/power-platform-es.vtt" srclang="es" label="${t.captions}">
      <track kind="subtitles" src="/assets/power-platform-en.vtt" srclang="en" label="${t.subtitles}"${lang === 'en' ? ' default' : ''}>
      <p>${e(t.fallback)} <a href="${project.video.src}">${e(t.download)}</a></p>
    </video><figcaption id="project-video-description">${e(t.description)} <a href="${project.video.src}" target="_blank" rel="noopener noreferrer">${e(t.download)}</a></figcaption></figure>
    <details class="project-video-transcript"><summary>${e(t.transcript)}</summary><div>${videoTranscript.map(segment => `<p><span class="transcript-time">${minute(segment.start)}</span><span>${e(segment[lang].join(' '))}</span></p>`).join('')}</div></details>
  </section>`;
}
