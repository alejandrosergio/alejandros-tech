import { interfaceCopy } from '../content/interface.mjs';
import { icon } from './icons.mjs';
import { soundtrackTrack as track } from '../content/soundtrack.mjs';
import { escapeHTML as e } from '../lib/html.mjs';

// No audio element or preload hint is emitted: Play opts into the local file.
export function soundtrack(lang) {
  const t = interfaceCopy[lang].audio;
  return `<div class="soundtrack-player" data-soundtrack-player hidden><button type="button" class="soundtrack-toggle" data-soundtrack data-src="${track.src}" data-play="${t.play}" data-pause="${t.pause}" data-play-label="${t.playLabel}" data-pause-label="${t.pauseLabel}" data-playing="${t.playing}" data-stopped="${t.stopped}" data-unavailable="${t.unavailable}" aria-pressed="false" data-tooltip="${t.playLabel}" aria-label="${t.playLabel}"><span class="soundtrack-icon" aria-hidden="true"><i></i><i></i><i></i></span><span data-soundtrack-label>${t.play}</span></button><details class="soundtrack-volume" data-soundtrack-volume-panel><summary aria-label="${t.volume}" data-tooltip="${t.volume}">${icon('volume')}</summary><div class="soundtrack-volume-content"><label for="soundtrack-volume">${t.volume}<output for="soundtrack-volume" data-soundtrack-volume-value>65%</output></label><input type="range" id="soundtrack-volume" data-soundtrack-volume min="0" max="100" step="1" value="65" aria-valuetext="65%"><p class="soundtrack-credit"><a href="${track.source}" target="_blank" rel="noopener noreferrer">${e(track.title)} · ${e(track.artist)}</a><span><a href="${track.licenseURL}" target="_blank" rel="license noopener noreferrer">${track.license}</a> · ${t.adaptation}</span></p></div></details></div><span class="sr-only" role="status" data-soundtrack-status></span>`;
}
