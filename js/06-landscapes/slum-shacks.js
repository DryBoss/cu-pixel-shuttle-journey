'use strict';
// js/06-landscapes/slum-shacks.js
// Defines: SLUM_WALLS, SLUM_ROOFS, slumShack, slumBlock

// --- 2. Meghna river ------------------------------------------------------
// --- 0. the city: small buildings, houses and slums ---------------------------
const SLUM_WALLS = ['tan', 'cream', 'brown', 'rust', 'grayLight', 'skyMid', 'paddy', 'rose'];
const SLUM_ROOFS = ['grayLight', 'grayLight', 'rust', 'rust', 'blue', 'gray'];

// A one-room shack: plank walls, a door, a sloping tin roof weighed down with bricks
// A makeshift shack: walls of mismatched scrap wood and bamboo, and a rusty,
// patched corrugated-tin roof sloping down to one side
function slumShack(g, p, lit, x, base, w, h, lamp, seed) {
  const rng = mulberry32(seed);
  for (let i = 0; i < w; i += 2) {
    rect(g, x + i, base - h, Math.min(2, w - i), h, p[pick(rng, ['tan', 'brown', 'grayLight', 'rust', 'paddy', 'brownDark', 'tan'])]);
    if (rng() < 0.3) px(g, x + i, base - h + randInt(rng, 1, h - 2), p.ink);               // gaps between the boards
  }
  rect(g, x, base - 1, w, 1, p.brownDark);
  rect(g, x + 1, base - 5, 2, 5, p.ink);
  if (w > 9) rect(g, x + w - 4, base - 6, 2, 2, lamp ? PALETTE.glow : p.ink);
  const dir = rng() < 0.5 ? 1 : -1;
  for (let r = 0; r < 4; r++) {                                                           // sloping roof, higher on one side
    const y = base - h - 1 - r, x0 = dir > 0 ? x - 1 + r : x - 1, rw = w + 2 - r;
    for (let xx = x0; xx < x0 + rw; xx++) {
      const k = hash2(xx >> 1, y + (seed & 63));
      px(g, xx, y, (xx + r) % 3 === 0 ? p.brownDark : k < 0.45 ? p.rust : k < 0.7 ? p.grayLight : k < 0.85 ? p.brown : k < 0.93 ? p.blue : p.orange);   // rust, tin and tarpaulin patches
    }
  }
  rect(g, x + 2, base - h - 6 + (dir > 0 ? 0 : 1), 2, 1, p.ink); px(g, x + w - 3, base - h - 6 + (dir > 0 ? 1 : 0), p.ink);   // bricks and tyres holding the roof down
}

// A concrete block of one to three floors in a faded wash (tone 0 peeling cream,
// 1 pale green, 2 dirty pink), with damp creeping up from the ground and black
// mould under the windows; a blue water tank and a tangle of antennas on top
function slumBlock(g, p, lit, x, base, w, floors, tone, lamps, tank, ant, seed) {
  const fh = 7, h = floors * fh + 2, rng = mulberry32(seed), top = base - h;
  rect(g, x, top, w, h, tone === 2 ? p.rose : p.cream);
  if (tone === 1) ditherRect(g, x, top, w, h, p.grassLight, 5);
  else if (tone === 2) ditherRect(g, x, top, w, h, p.cream, 4);
  for (let n = 0; n < w * floors * 0.5; n++) rect(g, x + randInt(rng, 0, w - 2), top + randInt(rng, 1, h - 3), 2, 1, rng() < 0.6 ? p.tan : p.cloudShade);   // peeling plaster
  ditherRect(g, x + w - 3, top, 3, h, p.grayDark, 6);
  for (let xx = x; xx < x + w; xx++) {                                                    // damp stains creeping up
    const hgt = 2 + Math.floor(hash2(xx >> 1, seed & 255) * h * 0.45);
    for (let j = 0; j < hgt; j++) if (bayer(xx, base - 1 - j) < 14 - j * 14 / hgt) px(g, xx, base - 1 - j, p.brownDark);
  }
  rect(g, x - 1, top - 1, w + 2, 2, p.grayLight);
  for (let f = 0; f < floors; f++)
    for (let wx = x + 2; wx + 2 <= x + w - 2; wx += 5) {
      const wy = top + 2 + f * fh;
      rect(g, wx, wy, 2, 3, lit && lamps[f * 6 + (((wx - x) / 5) | 0)] ? PALETTE.glow : p.indigo);
      if (rng() < 0.7) rect(g, wx + (rng() < 0.5 ? 0 : 1), wy + 3, 1, randInt(rng, 2, 3), p.ink);   // black mould streaks
    }
  rect(g, x + 1, base - 4, 2, 4, p.brownDark);
  if (tank) { rect(g, x + 2, top - 6, 5, 4, p.blue); rect(g, x + 2, top - 6, 5, 1, p.skyMid); px(g, x + 3, top - 2, p.grayDark); px(g, x + 5, top - 2, p.grayDark); }
  if (ant) {
    const ax = x + w - 7;
    rect(g, ax, top - 9, 1, 8, p.grayDark);
    for (let k = 0; k < 3; k++) { cabLine(g, ax, top - 8 + k * 2, ax - 3 - k, top - 9 + k * 2, p.grayDark); cabLine(g, ax, top - 8 + k * 2, ax + 3 + k, top - 10 + k * 2, p.grayDark); }
  }
}
