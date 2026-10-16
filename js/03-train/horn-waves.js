'use strict';
// js/03-train/horn-waves.js
// Defines: drawHornWaves

function drawHornWaves(g, p) {
  const hx = TRAIN.vehicles[0].x + 42, hy = LAYER_Y.loco + 1;
  const ph = Math.floor(sim.clock * 8) % 3;
  for (let i = 0; i < 3; i++) {
    if ((i + ph) % 3 === 2) continue;                                   // flicker outward
    const r = 2 + i * 3;
    for (let a = -2; a <= 2; a++) px(g, hx + r + (Math.abs(a) === 2 ? -1 : 0), hy + a - i, p.white);
  }
}
