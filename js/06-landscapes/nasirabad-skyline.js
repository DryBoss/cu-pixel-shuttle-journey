'use strict';
// js/06-landscapes/nasirabad-skyline.js
// Defines: rooftopTank, cellTower, smogBand, blinkingBeacon

// A cylindrical rooftop water tank on legs, hazy
function rooftopTank(g, p, x, top, r) {
  rect(g, x, top - r - 1, r, r, p.haze); rect(g, x + 1, top - r - 2, r - 2, 1, p.haze);
  rect(g, x, top - r - 1, 1, r, p.slate); px(g, x, top - 1, p.slate); px(g, x + r - 1, top - 1, p.slate);
}

// A tall thin cellular tower: lattice mast with antenna panels at the top
function cellTower(g, p, x, base, h) {
  rect(g, x, base - h, 1, h, p.slate);
  for (let y = base - h + 3; y < base; y += 3) { px(g, x - 1, y, p.slate); px(g, x + 1, y + 1, p.slate); }
  rect(g, x - 2, base - h + 1, 5, 1, p.slate);
  rect(g, x - 2, base - h + 2, 1, 3, p.slate); rect(g, x + 2, base - h + 2, 1, 3, p.slate);               // antenna panels
}

// A band of smog and dust: dithered brownish haze that thickens toward the ground
function smogBand(g, p, x, w, base) {
  ditherRect(g, x, base - 30, w, 12, p.cloudShade, 2);
  ditherRect(g, x, base - 20, w, 12, p.tan, 3);
  ditherRect(g, x, base - 10, w, 10, p.peach, 4);
}

// The single red pixel on a tower's tip, blinking
function blinkingBeacon(tx, tipY, phase) {
  return { x0: tx - 2, x1: tx + 3, z: 9, draw(g, v, ox, oy, t) {
    if ((t * 0.9 + phase) % 1 < 0.45) { px(g, tx + ox, tipY + oy, PALETTE.red); if (v.night > 0.3) glowHalo(g, tx + ox, tipY + oy, 0.5, 2.5, 6); }
  } };
}
