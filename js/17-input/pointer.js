'use strict';
// js/17-input/pointer.js
// Defines: toInternal

function toInternal(e) {
  const r = canvas.getBoundingClientRect();
  return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height];
}
canvas.addEventListener('pointermove', e => {
  const [x, y] = toInternal(e), t = ui.title ? titleHit(x, y) : -1;
  if (t >= 0) ui.titleSel = t;
  ui.hover = buttonHit(x, y);
  canvas.style.cursor = ui.hover || t >= 0 ? 'pointer' : 'default';
});
canvas.addEventListener('pointerdown', e => {
  const [x, y] = toInternal(e), t = ui.title ? titleHit(x, y) : -1;
  if (t >= 0) { beginTrip(t === 1); canvas.style.cursor = 'default'; }
  else if (buttonHit(x, y)) { startJourney(); ui.hover = false; canvas.style.cursor = 'default'; }
  syncButtons();
});
