'use strict';
// js/10-stations/cu.js
// Defines: buildCU, buildCanopyOverhang

// Chittagong University: no station building at all. The open-air terminus is set in the packed university town:
// behind the tracks, rows of concrete blocks and tin-roofed shops stand shoulder to shoulder around the campus
// gate (a pair of brick pillars and an arch sign). There are no hills nearby, only a few shade trees and, far off,
// the hazy hills of the far layer. (Screen x -100 is the sprite's left edge at the stop; the ground is row 98 =
// screen y 128.) The yard, buffer stop, stalls and people are drawn in front.
function buildCU(p, lit) {
  const W = 520, H = 112, [c, g] = makeCanvas(W, H), rng = mulberry32(73), base = 98, GX = 216, GW = 124;   // the gate spans sprite x 216..340
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
  // The university's main gate, as photographed: one pale-ochre concrete portal. A low left pylon with a round clock
  // and a pedestrian passage through it; a thick flat roof-beam spanning the whole road, its underside cut with a
  // row of rectangular skylight slots and the name "UNIVERSITY OF CHITTAGONG" in dark capitals on its face; a tall
  // massive right pylon with a round cut-out high in its corner, a black panel with the crest and Bangla name, and a
  // pinkish stone base. The road passes open between them.
  const ochre = p.cream, shade = p.tan, hi = p.peach;
  const slab = (x0, y0, w, h) => { rect(g, x0, y0, w, h, ochre); rect(g, x0, y0, w, 1, hi); rect(g, x0 + w - 1, y0, 1, h, shade); ditherRect(g, x0, y0, w, h, shade, 1); };
  const LX = GX, LW = 28, RW = 24, RX = GX + GW - RW, TOP = base - 52, BEAM = 11;
  // open road and the green campus beyond, between the pylons
  rect(g, LX + LW, base - 40, RX - LX - LW, 40, lit ? p.indigo : p.skyLight);
  ditherRect(g, LX + LW, base - 28, RX - LX - LW, 23, p.green, 7);
  ditherRect(g, LX + LW, base - 16, RX - LX - LW, 11, p.greenDark, 8);
  // left pylon: a block with the clock, and the pedestrian passage below it
  slab(LX, base - 40, LW, 40);
  rect(g, LX + 6, base - 24, 11, 24, p.brownDark); rect(g, LX + 7, base - 23, 9, 23, lit ? p.indigo : p.haze);   // the passage
  disc(g, LX + 14, base - 32, 4, p.grayDark); disc(g, LX + 14, base - 32, 3, p.white);                          // the round clock
  rect(g, LX + 14, base - 34, 1, 3, p.ink); rect(g, LX + 14, base - 32, 2, 1, p.ink);
  rect(g, LX + LW - 6, base - 21, 6, 17, p.ink); rect(g, LX + LW - 5, base - 20, 4, 4, p.grayDark);              // the dark signboard on its side
  rect(g, LX, base - 4, LW, 4, p.rose); ditherRect(g, LX, base - 4, LW, 4, p.brown, 5);                         // pinkish base
  // right pylon: tall, massive
  slab(RX, TOP, RW, 52);
  disc(g, RX + 5, TOP + 11, 5, p.skyMid); ditherRect(g, RX, TOP + 4, 10, 15, p.green, 8);                      // the round cut-out
  rect(g, RX + 5, TOP + 22, 15, 22, p.ink); rect(g, RX + 5, TOP + 22, 15, 1, p.grayDark);                      // the black panel
  disc(g, RX + 12, TOP + 27, 2, p.grayLight); rect(g, RX + 7, TOP + 32, 11, 1, p.grayLight); rect(g, RX + 7, TOP + 34, 9, 1, p.grayLight);
  rect(g, RX + 8, TOP + 38, 8, 2, p.gray);                                                                     // the small plaque
  rect(g, RX, base - 8, RW, 8, p.rose); ditherRect(g, RX, base - 8, RW, 8, p.brown, 5);                         // pinkish stone base
  // the roof-beam across the road: thick, flat, slotted underneath
  const BY = TOP + 1;
  slab(LX, BY, GW, BEAM);
  rect(g, LX, BY + BEAM - 2, GW, 2, shade);
  for (let sx = LX + 34; sx + 6 <= RX - 4; sx += 11) { rect(g, sx, BY + BEAM - 2, 6, 2, p.white); }             // light slots in the underside
  const nm = 'UNIVERSITY OF CHITTAGONG';
  drawText(g, nm, LX + 3, BY + 3, p.grayDark);
  rect(g, LX + 2, BY - 3, 8, 3, shade); rect(g, LX + 4, BY - 5, 4, 2, p.grayDark);                              // a floodlight on the beam
  rect(g, RX - 2, base - 6, 2, 0, p.ink);
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
