'use strict';
// js/10-stations/steam.js
// Defines: drawSteam

// Steam curling up from the kettle spout: a few dithered wisps on a loop
function drawSteam(g, v, x, y) {
  for (let i = 0; i < 4; i++) {
    const ph = (sim.clock * 0.6 + i / 4) % 1;
    const sx = x + Math.round(Math.sin(ph * 6 + i * 2) * 1.2 + ph * 2), sy = y - Math.floor(ph * 11);
    if (bayer(sx, sy) < (1 - ph) * 22) px(g, sx, sy, v.p.white);
    if (ph < 0.45) px(g, sx + 1, sy - 1, v.p.cloudShade);
  }
}
