import { interfaceCopy } from '../content/interface.mjs';

// Audio starts only after an explicit gesture; no files or services are loaded.
export function soundtrack(lang) {
  const t = interfaceCopy[lang].audio;
  return `<button type="button" class="soundtrack-toggle" data-soundtrack data-play="${t.play}" data-pause="${t.pause}" data-play-label="${t.playLabel}" data-pause-label="${t.pauseLabel}" data-playing="${t.playing}" data-stopped="${t.stopped}" data-unavailable="${t.unavailable}" aria-pressed="false" data-tooltip="${t.playLabel}" aria-label="${t.playLabel}" hidden><span class="soundtrack-icon" aria-hidden="true"><i></i><i></i><i></i></span><span data-soundtrack-label>${t.play}</span></button><span class="sr-only" role="status" data-soundtrack-status></span>`;
}
