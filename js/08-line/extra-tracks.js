'use strict';
// js/08-line/extra-tracks.js
// Defines: EXTRA_Y, EXTRA_RANGES, extraRanges, drawExtraTracks

// Other lines run alongside ours on the near side from Bottoli until just past
// Dewanhat, then swing away off the bottom of the picture
const EXTRA_Y = 164;
let EXTRA_RANGES = null;
function extraRanges() {
  return EXTRA_RANGES || (EXTRA_RANGES = [
    { from: -Infinity, to: STATIONS[1].dist + 260 * SCALE, rust: true },                   // Bottoli's lines, gone just past Dewanhat
    { from: STATIONS[4].dist - 1000 * SCALE, to: STATIONS[4].dist + 300 * SCALE },     // the main line alongside at Sholosohor Junction
  ]);
}
function drawExtraTracks(g, v) {
  const cam = Math.floor(sim.dist), T = 160, tw = v.track.width;
  for (const r of extraRanges()) {
    const xa = r.from - cam + ANCHOR_X, xb = r.to - cam + ANCHOR_X, tile = r.rust ? v.trackRust : v.track;
    if (xb + T <= 0 || xa - T >= W) continue;
    const x1 = Math.min(W, Math.ceil(xb + T));
    for (let x = Math.max(0, Math.floor(xa - T)); x < x1; x++) {
      const dy = x < xa ? 30 * (1 - smoothstep((x - (xa - T)) / T)) : x > xb ? 30 * smoothstep((x - xb) / T) : 0;
      if (dy >= 18) continue;
      g.drawImage(tile, (((x + cam) % tw) + tw) % tw, 0, 1, 20, x, EXTRA_Y + Math.round(dy), 1, 20);
    }
  }
  drawExtraWagons(g, v);
}
