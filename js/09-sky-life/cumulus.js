'use strict';
// js/09-sky-life/cumulus.js
// Defines: drawCumulus

// Kash section's big white cumulus, faded in with an ordered dither
function drawCumulus(g, v, weight) {
  const level = Math.round(weight * 16), off = sim.dist * 0.07 + sim.cloudDrift * 1.4;
  if (level <= 0) return;
  if (level >= 16) { drawTiled(g, v.cumulus, off, 2); return; }
  sctx.clearRect(0, 0, W, 64);
  drawTiled(sctx, v.cumulus, off, 2);
  sctx.globalCompositeOperation = 'destination-in';
  sctx.fillStyle = DITHER_MASKS[level];
  sctx.fillRect(0, 0, W, 64);
  sctx.globalCompositeOperation = 'source-over';
  g.drawImage(scratch, 0, 0, W, 64, 0, 0, W, 64);
}
