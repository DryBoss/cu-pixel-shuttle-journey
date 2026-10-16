'use strict';
// js/18-main/fit.js
// Defines: fit

function fit() {
  const cs = getComputedStyle(document.body);
  const aw = innerWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const ah = innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  let n = 0;
  for (const b of bar.children) if (!b.hidden) n++;
  const B = 48, GAP = 8, along = n * B + (n - 1) * 6;
  const rows = Math.ceil(n / Math.max(1, Math.floor((aw + 6) / (B + 6)))), tall = rows * B + (rows - 1) * 6;
  const Ht = H + (cabOn ? CAB_H : 0);
  const below = rows <= 2 || cabOn ? Math.min(aw / W, (ah - tall - GAP) / Ht) : 0;
  const side = along <= ah ? Math.min((aw - B - GAP) / W, ah / Ht) : 0;
  const over = Math.min(aw / W, ah / Ht);
  let mode = side >= below ? 'side' : 'below', s = Math.max(side, below);
  if (s < over * 0.8 && !cabOn) { mode = 'overlay'; s = over; }
  document.body.className = mode + (cabOn ? ' cabbed' : '');
  canvas.style.width = Math.floor(W * s) + 'px';
  canvas.style.height = Math.floor(H * s) + 'px';
  cab.style.width = Math.floor(W * s) + 'px';
  cab.style.height = Math.floor(CAB_H * s) + 'px';
}
addEventListener('resize', fit);
addEventListener('orientationchange', () => setTimeout(fit, 100));
fit();
