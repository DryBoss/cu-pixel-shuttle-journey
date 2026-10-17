'use strict';
// js/10-stations/polytechnic.js
// Defines: POLY_SX, POLY_CROWNS, leafyCrown, buildPolytechnic

// Polytechnic: no building, no name board, no shed. Behind the bare slab runs the Polytechnic
// Institute's long, tall boundary wall: dirty whitewash, rain-runoff streaks, faded graffiti and
// hand-painted ads, a crude POLYTECHNIC painted straight onto it, and mango and jackfruit crowns
// spilling over the top and throwing shade on the platform.
const POLY_SX = -100;                        // screen x of the sprite's left edge while the train stands here
const POLY_CROWNS = [160, 275, 385];         // crown centres in sprite x -> screen x 60, 175, 285 (route 'shade' must match)

// A big leafy crown: overlapping lobes, light from the upper left, dark gaps. jack = glossier, with fruit
function leafyCrown(g, p, cx, cy, rw, rh, seed, jack) {
  const rng = mulberry32(seed), lobes = [];
  for (let i = 0; i < 16; i++) {                                                      // lobes spread right across the crown so it reads as one dense mass
    const t = i / 15, r = Math.round(rh * (0.55 + rng() * 0.3));
    lobes.push([cx + Math.round((t * 2 - 1) * (rw - r * 0.6)), cy + Math.round((rng() * 2 - 1) * rh * 0.45), r]);
  }
  for (const [x, y, r] of lobes) disc(g, x, y, r, p.greenDeep);
  for (const [x, y, r] of lobes) disc(g, x - 1, y - 1, r - 2, p.greenDark);
  for (const [x, y, r] of lobes) disc(g, x - 2, y - 2, Math.max(1, r - 5), jack ? p.green : p.grass);
  for (const [x, y, r] of lobes)                                                      // leaf glints, only inside the lobes
    for (let k = 0; k < r * 2; k++) {
      const a = rng() * 6.283, d = rng() * (r - 1);
      px(g, x + Math.round(Math.cos(a) * d) - 1, y + Math.round(Math.sin(a) * d) - 1, rng() < 0.5 ? p.grassLight : rng() < 0.6 ? p.green : p.greenDeep);
    }
}

function buildPolytechnic(p, lit) {
  const W = 540, H = 96, [c, g] = makeCanvas(W, H), rng = mulberry32(31), base = 80, wallH = 36, wallTop = base - wallH;
  const crowns = [40, ...POLY_CROWNS, 495];
  rect(g, 0, base, W, H - base, p.gray);                                              // the yard: gravel and dust
  ditherRect(g, 0, base - 2, W, 2, p.gray, 8);
  for (let i = 0; i < W * 4; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, base, H - 1), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  crowns.forEach((x, i) => {                                                          // trunks, then crowns (the wall hides their feet)
    rect(g, x - 2, wallTop - 14, 4, 20, p.brownDark); rect(g, x - 2, wallTop - 14, 1, 20, p.brown);
    leafyCrown(g, p, x, wallTop - 14, 52 + (i & 1) * 6, 22 + (i % 3) * 2, 700 + i * 29, i & 1);
  });

  // --- the wall: faded, dirty whitewash
  rect(g, 0, wallTop, W, wallH, p.grayLight);
  for (let n = 0; n < 40; n++) ditherRect(g, randInt(rng, 0, W - 30), wallTop + randInt(rng, 0, wallH - 12), randInt(rng, 14, 40), randInt(rng, 6, 14), p.cloudShade, 4 + randInt(rng, 0, 4));   // blotchy wash
  ditherRect(g, 0, base - 14, W, 10, p.gray, 3);                                      // splashed and grimy low down
  rect(g, 0, base - 4, W, 4, p.gray);
  ditherRect(g, 0, base - 6, W, 2, p.grayDark, 5);                                    // damp at the foot
  for (let x = 20; x < W; x += 54) {                                                  // pilasters
    rect(g, x, wallTop - 3, 6, wallH + 3, p.cloudShade); rect(g, x + 5, wallTop - 3, 1, wallH + 3, p.gray);
    rect(g, x - 1, wallTop - 4, 8, 2, p.gray);
  }
  rect(g, 0, wallTop - 2, W, 3, p.gray); rect(g, 0, wallTop - 2, W, 1, p.cloudShade); // coping
  // rain runoff: dark streaks from the coping and the pilaster caps
  const streak = (x, len, dk) => { for (let i = 0; i < len; i++) { const y = wallTop + 1 + i; if (i > len * 0.6 && bayer(x, y) > 8) continue; px(g, x, y, dk && i < len * 0.4 ? p.grayDark : p.gray); } };
  for (let i = 0; i < 80; i++) streak(randInt(rng, 0, W - 1), randInt(rng, 6, 30), rng() < 0.4);
  for (let x = 20; x < W; x += 54) for (let k = 0; k < 4; k++) streak(x + k + 1, randInt(rng, 12, 32), true);

  // --- graffiti and hand-painted ads: faded abstract script, red / blue / black
  const faded = (x, y, col) => { if (bayer(x, y) < 11) px(g, x, y, col); };
  const scribble = (x, y, w, col, seed) => {                                         // a line of Bengali-looking lettering: a headline stroke with glyph loops hanging from it
    const r = mulberry32(seed);
    for (let xx = x; xx < x + w; xx++) faded(xx, y, col);
    for (let gx = x + 1; gx < x + w - 3; gx += randInt(r, 3, 5)) {
      const h = randInt(r, 3, 5);
      for (let j = 1; j <= h; j++) { faded(gx, y + j, col); if (j > 1 && r() < 0.6) faded(gx + 2, y + j, col); }
      faded(gx + 1, y + h, col); faded(gx + 1, y + 1, col);
      if (r() < 0.35) faded(gx + 3, y + 1, col);
    }
  };
  const panel = (x, y, w, h, bg, seed) => {                                          // a painted ad board: faded colour block with white/black lettering
    const r = mulberry32(seed);
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (bayer(xx, yy) < 12) px(g, xx, yy, bg);
    scribble(x + 2, y + 2, w - 4, p.white, seed + 1); if (h > 12) scribble(x + 3, y + 8, w - 7, p.ink, seed + 2);
  };
  panel(40, wallTop + 6, 30, 14, p.red, 11); panel(112, wallTop + 4, 26, 16, p.blue, 12); panel(188, wallTop + 8, 22, 12, p.red, 13);
  panel(352, wallTop + 6, 34, 14, p.blue, 14); panel(430, wallTop + 5, 28, 16, p.red, 15); panel(486, wallTop + 8, 24, 12, p.blue, 16);
  scribble(78, wallTop + 14, 24, p.ink, 21); scribble(150, wallTop + 22, 28, p.red, 22); scribble(214, wallTop + 12, 26, p.blue, 23);
  scribble(318, wallTop + 22, 26, p.ink, 24); scribble(398, wallTop + 22, 24, p.red, 25); scribble(76, wallTop + 24, 20, p.blue, 26);
  for (let n = 0; n < 14; n++) {                                                     // spray clusters and tags
    const x = randInt(rng, 0, W - 8), y = wallTop + randInt(rng, 6, wallH - 12), col = [p.red, p.blue, p.ink][n % 3];
    for (let k = 0; k < 9; k++) faded(x + randInt(rng, 0, 6), y + randInt(rng, 0, 5), col);
  }

  // --- the crude name, painted straight onto the wall: a patch of whitewash, wobbly black block letters, worn away
  const name = 'POLYTECHNIC', sx0 = 270 - 50, sy0 = wallTop + 8;
  rect(g, sx0, sy0, 100, 18, p.white);
  for (let i = 0; i < 30; i++) px(g, sx0 + randInt(rng, -1, 100), sy0 + (i & 1 ? -1 : 18), p.white);   // ragged edges of the patch
  ditherRect(g, sx0, sy0, 100, 18, p.cloudShade, 3);
  for (let i = 0; i < name.length; i++) drawText2x(g, name[i], sx0 + 6 + i * 8, sy0 + 4 + (((i * 7) % 3) - 1), i % 4 === 1 ? p.grayDark : p.ink);
  for (let i = 0; i < 60; i++) px(g, randInt(rng, sx0 + 5, sx0 + 94), randInt(rng, sy0 + 3, sy0 + 15), rng() < 0.6 ? p.white : p.cloudShade);   // paint worn away
  for (const dx of [14, 38, 54, 78]) for (let j = 0; j < 4 + (dx & 3); j++) px(g, sx0 + 6 + dx, sy0 + 16 + j, j < 2 ? p.ink : p.gray);   // drips

  // --- foliage spilling over the wall top: drooping leaf fringes, shade on the wall, hanging jackfruit
  crowns.forEach((x, i) => {
    const rw = 52 + (i & 1) * 6, fr = mulberry32(900 + i);
    ditherRect(g, x - rw, wallTop, rw * 2, 12, p.grayDark, 5);
    for (let dx = -rw + 4; dx <= rw - 4; dx++) {
      if (fr() < 0.35) continue;
      const len = 2 + Math.floor(fr() * 7 * (1 - Math.abs(dx) / rw) + 1), y0 = wallTop - 4;
      for (let j = 0; j < len + 4; j++) px(g, x + dx, y0 + j, j > len + 1 ? p.green : j % 3 ? p.greenDark : p.greenDeep);
      if (fr() < 0.25) px(g, x + dx, y0 + len + 4, p.grassLight);
    }
    if (i & 1) for (const fx of [-18, 7, 26]) { rect(g, x + fx, wallTop + 3, 3, 4, p.paddy); px(g, x + fx, wallTop + 3, p.green); px(g, x + fx + 1, wallTop + 6, p.brown); }   // jackfruit
  });
  for (let x = 0; x < 28; x++) for (let y = base - 4; y < H; y++) {                   // the yard peters out at both ends
    if (bayer(x, y) < (28 - x) / 28 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(W - 1 - x, y) < (28 - x) / 28 * 16) g.clearRect(W - 1 - x, y, 1, 1);
  }
  return c;
}
