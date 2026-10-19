'use strict';
// js/10-stations/cu.js
// Defines: buildCU, buildCanopyOverhang

// Chittagong University: no station building at all. The open-air terminus is set in the packed university town:
// behind the tracks, rows of concrete blocks and tin-roofed shops stand shoulder to shoulder around the campus
// gate (a pair of brick pillars and an arch sign). There are no hills nearby, only a few shade trees and, far off,
// the hazy hills of the far layer. (Screen x -100 is the sprite's left edge at the stop; the ground is row 98 =
// screen y 128.) The yard, buffer stop, stalls and people are drawn in front.
function buildCU(p, lit) {
  const W = 520, H = 112, [c, g] = makeCanvas(W, H), rng = mulberry32(73), base = 98, GX = 216, GW = 92;   // the gate spans sprite x 216..308
  const kinds = ['copy', 'food', 'tin', 'mobile', 'book'];
  rect(g, 0, base, W, H - base, p.brownDark);                                              // trodden ground
  for (let i = 0; i < W * 3; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, base, H - 1), rng() < 0.4 ? p.brown : rng() < 0.5 ? p.tan : p.grayDark);
  for (let x = 0; x < W; ) {                                                               // the back rank of the town
    const w = randInt(rng, 16, 27), seed = randInt(rng, 1, 1e6), r = rng();
    if (x + w > GX - 6 && x < GX + GW + 6) { x = GX + GW + 6; continue; }
    if (r < 0.15) roundTree(g, x + (w >> 1), base - 2, randInt(rng, 6, 9), randInt(rng, 6, 10), p, seed);
    else if (r < 0.65) commercialBlock(g, p, lit, x, base - 2, w, randInt(rng, 2, 4), seed);
    else burgShop(g, p, lit, x, base - 2, w, kinds[Math.floor(rng() * kinds.length)], seed, randInt(rng, 13, 18));
    x += w + randInt(rng, 0, 2);
  }
  const pil = x0 => {                                                                      // a brick gate pillar with a white cap and a lamp
    rect(g, x0, base - 40, 10, 40, p.rust); rect(g, x0, base - 40, 1, 40, p.orange); rect(g, x0 + 9, base - 40, 1, 40, p.brownDark);
    for (let y = base - 38; y < base; y += 3) rect(g, x0, y, 10, 1, p.brownDark);
    rect(g, x0 - 2, base - 43, 14, 3, p.white); rect(g, x0 - 2, base - 41, 14, 1, p.cloudShade);
    rect(g, x0 + 4, base - 47, 2, 4, p.grayDark); rect(g, x0 + 3, base - 49, 4, 2, lit ? PALETTE.glow : p.cream);
    rect(g, x0 - 2, base - 3, 14, 3, p.cloudShade);
  };
  pil(GX); pil(GX + GW - 10);
  rect(g, GX + 10, base - 36, GW - 20, 14, p.greenDark); rect(g, GX + 10, base - 36, GW - 20, 1, p.glow); rect(g, GX + 10, base - 23, GW - 20, 1, p.glow);   // the arch sign
  drawText2x(g, 'CU', GX + (GW >> 1) - 8, base - 34, p.white);
  rect(g, GX + 10, base - 44, GW - 20, 8, p.white); drawText(g, 'UNIVERSITY', GX + (GW >> 1) - 19, base - 42, p.greenDark);
  for (const wx of [GX - 40, GX + GW + 4]) { posterFence(g, p, wx, base, 36, wx + 11); }   // posters on the walls either side
  return c;
}

// Leaf clumps and lianas hanging from the very top of the screen: the old trees meeting overhead, so the
// whole terminus stands in leafy shade. Built at the platform's width and drawn at screen y 0
function buildCanopyOverhang(p, w) {
  const [c, g] = makeCanvas(w, 30), rng = mulberry32(59);
  for (let x = 0; x < w; x++) {
    const n = 5 + Math.round(5 * (Math.sin(x * 0.09) + Math.sin(x * 0.23 + 1.3)) / 2 + 3 * rng());
    for (let y = 0; y < n; y++) px(g, x, y, y > n - 3 ? (rng() < 0.5 ? p.greenDeep : p.greenDark) : rng() < 0.18 ? p.green : rng() < 0.7 ? p.greenDark : p.greenDeep);
    if (rng() < 0.2) { const l = randInt(rng, 3, 14); for (let j = 0; j < l; j++) px(g, x, n + j, j > l - 3 ? p.grass : j % 3 ? p.greenDark : p.greenDeep); }
  }
  for (let i = 0; i < w / 40; i++) { const x = randInt(rng, 0, w - 24), y = randInt(rng, 2, 8); for (let k = 0; k < 24; k++) px(g, x + k, y + Math.round(Math.sin(k * 0.3) * 1.5), p.brownDark); }   // a bough
  return c;
}
