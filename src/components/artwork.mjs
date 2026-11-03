export function artwork(t) {
  return `<figure class="artwork" aria-label="${t.diagramLabel}" data-brand-art>
    <div class="brand-stage" data-brand-stage data-label="${t.modelLabel}">
    <canvas class="brand-canvas" data-brand-canvas aria-hidden="true" hidden></canvas>
    <svg class="network-art brand-fallback" viewBox="0 0 520 510" fill="none" aria-hidden="true" width="520" height="510">
      <defs>
        <linearGradient id="orbit" x1="70" y1="60" x2="450" y2="460"><stop stop-color="#008bd9"/><stop offset=".55" stop-color="#6e9fe8"/><stop offset="1" stop-color="#9e79ce"/></linearGradient>
        <radialGradient id="glow"><stop stop-color="#75bfff" stop-opacity=".23"/><stop offset="1" stop-color="#75bfff" stop-opacity="0"/></radialGradient>
        <linearGradient id="tile" x1="190" y1="180" x2="330" y2="330"><stop stop-color="#163d66"/><stop offset="1" stop-color="#0a203b"/></linearGradient>
      </defs>
      <circle cx="260" cy="250" r="250" fill="url(#glow)"/>
      <g class="art-grid" stroke="currentColor" stroke-opacity=".13">
        <path d="M65 190h390M65 250h390M65 310h390M140 95v310M200 65v370M260 45v410M320 65v370M380 95v310"/>
      </g>
      <g stroke="url(#orbit)">
        <ellipse cx="260" cy="250" rx="195" ry="95" transform="rotate(-35 260 250)" opacity=".7"/>
        <ellipse cx="260" cy="250" rx="195" ry="95" transform="rotate(35 260 250)" opacity=".42"/>
        <circle cx="260" cy="250" r="173" stroke-dasharray="2 12" opacity=".5"/>
        <path d="M78 372c95-32 257-32 364 0M48 400c135-42 285-42 424 0M26 429c151-44 317-44 468 0" opacity=".2"/>
      </g>
      <g class="orbit-spark"><circle cx="403" cy="123" r="10" fill="#e8f3ff" stroke="#008bd9"/><circle cx="403" cy="123" r="3" fill="#008bd9"/></g>
      <g class="orbit-spark spark-two"><circle cx="104" cy="324" r="8" fill="#e8f3ff" stroke="#6f8ee2"/><circle cx="104" cy="324" r="2.5" fill="#6f8ee2"/></g>
      <path d="m351 374 10 10-10 10-10-10Z" fill="#e8f3ff" stroke="#9e79ce"/>
      <rect class="center-shadow" x="186" y="176" width="148" height="148" rx="36" fill="url(#tile)"/>
      <rect x="194" y="184" width="132" height="132" rx="29" stroke="#75bfff" stroke-opacity=".4"/>
      <path d="m225 280 35-68 35 68m-59-19h48" stroke="#f3f7ff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M284 213h17m-8-8v17" stroke="#75bfff" stroke-width="3.5" stroke-linecap="round"/>
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect class="art-node" x="48" y="107" width="66" height="58" rx="16"/>
        <path d="m74 127-7 9 7 9m15-18 7 9-7 9m-6-20-4 22"/>
        <rect class="art-node" x="403" y="279" width="66" height="58" rx="16"/>
        <path d="M419 308h34m-26-8 9 8-9 8m-8-18v20"/>
      </g>
    </svg>
    </div>
    <div class="art-controls" data-art-controls hidden>
      <span id="brand-3d-help" class="art-hint">${t.modelHint}<span class="sr-only">. ${t.modelKeyboard}</span></span>
      <button class="art-motion" type="button" data-art-motion data-pause="${t.modelPause}" data-play="${t.modelPlay}"><span data-motion-icon aria-hidden="true"></span><span data-motion-text></span></button>
      <button class="art-reset" type="button" data-art-reset aria-label="${t.modelReset}" title="${t.modelReset}"><svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 10a8 8 0 1 1 1.4 7M4 4v6h6"/></svg></button>
    </div>
    <figcaption class="art-caption"><span>${t.hero.disciplines[0]}</span><i aria-hidden="true"></i><span>${t.hero.disciplines[1]}</span><i aria-hidden="true"></i><span>${t.hero.disciplines[2]}</span></figcaption>
  </figure>`;
}

