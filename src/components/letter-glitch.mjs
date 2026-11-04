// The decorative Canvas enhancement is optional; the CSS texture needs no script.
// Keep the whole layer out of the accessibility tree and the canvas hidden until
// its client renderer is ready. The preset metadata records the chosen appearance.
export function letterGlitch() {
  return '<div class="letter-backdrop" data-letter-glitch data-preset="pixel" data-characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ" data-palette="#ffffff,#ff6b6b" aria-hidden="true"><canvas class="letter-canvas" data-letter-canvas hidden></canvas></div>';
}
