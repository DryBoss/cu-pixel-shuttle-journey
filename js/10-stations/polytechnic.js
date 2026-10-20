'use strict';
// js/10-stations/polytechnic.js
// Defines: POLY_SX, POLY_CROWNS, leafyCrown, buildPolytechnic

// Polytechnic: no building, no name board, no shed. Behind the bare slab runs the Polytechnic
// Institute's long, tall boundary wall: dirty whitewash, rain-runoff streaks, faded graffiti and
// hand-painted ads, a crude POLYTECHNIC painted straight onto it, and mango and jackfruit crowns
// spilling over the top and throwing shade on the platform.
// It has to BLEND into the Khulshi corridor on both sides, so it does not start and stop as a slab: the wall steps
// down at both ends into the low brick-and-hedge boundary the corridor already has, the ground behind it is the
// corridor's own grass (not a gravel pad), the end crowns are small and ragged, and the last stretch of the whole
// sprite dissolves (dithered) into the landscape.
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
  const W = 540, H = 96, [c, g] = makeCanvas(W, H), rng = mulberry32(31), base = 80, FULL = 34, wallTop = base - FULL;
  const crowns = [30, ...POLY_CROWNS, 510];
  const crownRw = i => i === 0 || i === crowns.length - 1 ? 30 : 52 + (i & 1) * 6;      // the end crowns are smaller: they thin out into the corridor's own trees
  // the wall steps down towards both ends (piers and stepped coping), into the low boundary wall of the corridor
  const STEPS = [[0, 9], [30, 16], [58, 24], [86, FULL]];
  const hAt = x => { const d = Math.min(x, W - 1 - x); let h = STEPS[0][1]; for (const [x0, hh] of STEPS) if (d >= x0) h = hh; return h; };
  const FX0 = 86, FX1 = W - 86;                                                      // where the wall stands at full height

  // --- the ground behind: the corridor's own grass and trodden earth, not a gravel pad
  rect(g, 0, base, W, H - base, p.greenDark);
  ditherRect(g, 0, base - 2, W, 2, p.greenDark, 8);
  for (let i = 0; i < W * 5; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, base, H - 1), rng() < 0.4 ? p.green : rng() < 0.45 ? p.grass : rng() < 0.5 ? p.greenDeep : p.brownDark);
  for (let n = 0; n < 9; n++) ditherRect(g, randInt(rng, 40, W - 90), base + randInt(rng, 2, 10), randInt(rng, 24, 60), randInt(rng, 3, 6), p.brown, 6);   // bare trodden patches

  // --- trunks and crowns (the wall hides their feet)
  crowns.forEach((x, i) => {
    const rw = crownRw(i), rh = i === 0 || i === crowns.length - 1 ? 16 : 22 + (i % 3) * 2, top0 = base - hAt(x) - 12;
    rect(g, x - 2, top0, 4, 20, p.brownDark); rect(g, x - 2, top0, 1, 20, p.brown);
    leafyCrown(g, p, x, top0, rw, rh, 700 + i * 29, i & 1);
  });
  // a few small shrubs and sapling mangoes in the gaps, so the crowns read as one tree line rather than five lumps
  for (const x of [95, 215, 335, 445]) leafyCrown(g, p, x, base - FULL - 4, 22, 9, 1500 + x, x & 1);

  // --- the wall: dirty whitewash, stepped down at the ends
  for (let x = 0; x < W; x++) {
    const h = hAt(x), top = base - h;
    for (let y = top; y < base; y++) px(g, x, y, p.grayLight);
  }
  for (let n = 0; n < 46; n++) {                                                     // blotchy wash; darker, dirtier than before so it sits with the greens around it
    const bx = randInt(rng, 0, W - 30), bw = randInt(rng, 14, 40), bh = randInt(rng, 6, 14), by = base - Math.min(hAt(bx), hAt(bx + bw)) + randInt(rng, 0, 6);
    ditherRect(g, bx, by, bw, bh, rng() < 0.5 ? p.cloudShade : p.gray, 4 + randInt(rng, 0, 4));
  }
  ditherRect(g, 0, base - 14, W, 10, p.gray, 3);                                     // splashed and grimy low down
  rect(g, 0, base - 4, W, 4, p.gray);
  ditherRect(g, 0, base - 6, W, 2, p.grayDark, 5);                                   // damp at the foot
  for (let x = 0; x < W; x++) {                                                      // moss creeping up the foot of the wall
    const mh = 1 + Math.floor(hash2(x >> 1, 41) * 5);
    for (let j = 0; j < mh; j++) if (bayer(x, base - 1 - j) < 14 - j * 2) px(g, x, base - 1 - j, j ? p.greenDark : p.green);
  }
  // piers + coping that follow the steps
  for (let x = 14; x < W; x += 54) {
    const h = hAt(x), top = base - h;
    rect(g, x, top - 3, 6, h + 3, p.cloudShade); rect(g, x + 5, top - 3, 1, h + 3, p.gray);
    rect(g, x - 1, top - 4, 8, 2, p.gray);
  }
  for (let x = 0; x < W; x++) { const top = base - hAt(x); px(g, x, top - 2, p.gray); px(g, x, top - 1, p.gray); px(g, x, top, p.cloudShade); }   // coping on every step
  for (const [x0] of STEPS.slice(1)) for (const sx of [x0, W - x0 - 1]) {            // the little step-down shoulders
    const top = base - hAt(sx), lo = base - hAt(sx - 1 + (sx < W / 2 ? 0 : 2));
    rect(g, Math.max(0, sx - 1), Math.min(top, lo) - 3, 3, 3, p.cloudShade);
  }
  // the low end sections are exposed brick like the corridor's own low walls
  for (const [bx0, bx1] of [[0, 56], [W - 56, W]]) {
    for (let x = bx0; x < bx1; x++) {
      const top = base - hAt(x);
      for (let y = top; y < base - 1; y++) px(g, x, y, ((x + (y & 2)) % 4 === 3 || (y & 1)) ? p.brown : p.rust);
      px(g, x, top - 1, p.gray);
    }
  }
  // rain runoff: dark streaks from the coping and the pier caps (full-height stretch only)
  const streak = (x, len, dk) => { for (let i = 0; i < len; i++) { const y = base - FULL + 1 + i; if (i > len * 0.6 && bayer(x, y) > 8) continue; px(g, x, y, dk && i < len * 0.4 ? p.grayDark : p.gray); } };
  for (let i = 0; i < 70; i++) streak(randInt(rng, FX0, FX1), randInt(rng, 6, 28), rng() < 0.4);
  for (let x = 14; x < W; x += 54) if (x >= FX0 && x < FX1) for (let k = 0; k < 4; k++) streak(x + k + 1, randInt(rng, 12, 30), true);

  // --- graffiti and hand-painted ads: faded abstract script, red / blue / black (only on the full-height stretch)
  const faded = (x, y, col) => { if (bayer(x, y) < 11) px(g, x, y, col); };
  const scribble = (x, y, w, col, seed) => {
    const r = mulberry32(seed);
    for (let xx = x; xx < x + w; xx++) faded(xx, y, col);
    for (let gx = x + 1; gx < x + w - 3; gx += randInt(r, 3, 5)) {
      const h = randInt(r, 3, 5);
      for (let j = 1; j <= h; j++) { faded(gx, y + j, col); if (j > 1 && r() < 0.6) faded(gx + 2, y + j, col); }
      faded(gx + 1, y + h, col); faded(gx + 1, y + 1, col);
      if (r() < 0.35) faded(gx + 3, y + 1, col);
    }
  };
  const panel = (x, y, w, h, bg, seed) => {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (bayer(xx, yy) < 12) px(g, xx, yy, bg);
    scribble(x + 2, y + 2, w - 4, p.white, seed + 1); if (h > 12) scribble(x + 3, y + 8, w - 7, p.ink, seed + 2);
  };
  const wt = wallTop;
  panel(100, wt + 6, 28, 14, p.red, 11); panel(140, wt + 4, 24, 16, p.blue, 12); panel(188, wt + 8, 22, 12, p.red, 13);
  panel(352, wt + 6, 34, 14, p.blue, 14); panel(400, wt + 5, 28, 16, p.red, 15); panel(434, wt + 8, 20, 12, p.blue, 16);
  scribble(130, wt + 24, 20, p.ink, 21); scribble(150, wt + 22, 24, p.red, 22); scribble(214, wt + 12, 26, p.blue, 23);
  scribble(318, wt + 22, 26, p.ink, 24); scribble(398, wt + 24, 22, p.red, 25); scribble(96, wt + 24, 20, p.blue, 26);
  for (let n = 0; n < 12; n++) {                                                     // spray clusters and tags
    const x = randInt(rng, FX0, FX1 - 8), y = wt + randInt(rng, 6, FULL - 12), col = [p.red, p.blue, p.ink][n % 3];
    for (let k = 0; k < 9; k++) faded(x + randInt(rng, 0, 6), y + randInt(rng, 0, 5), col);
  }

  // --- the crude name, painted straight onto the wall: a patch of whitewash, wobbly black block letters, worn away
  const name = 'POLYTECHNIC', sx0 = 270 - 50, sy0 = wt + 8;
  rect(g, sx0, sy0, 100, 18, p.white);
  for (let i = 0; i < 30; i++) px(g, sx0 + randInt(rng, -1, 100), sy0 + (i & 1 ? -1 : 18), p.white);
  ditherRect(g, sx0, sy0, 100, 18, p.cloudShade, 3);
  for (let i = 0; i < name.length; i++) drawText2x(g, name[i], sx0 + 6 + i * 8, sy0 + 4 + (((i * 7) % 3) - 1), i % 4 === 1 ? p.grayDark : p.ink);
  for (let i = 0; i < 60; i++) px(g, randInt(rng, sx0 + 5, sx0 + 94), randInt(rng, sy0 + 3, sy0 + 15), rng() < 0.6 ? p.white : p.cloudShade);
  for (const dx of [14, 38, 54, 78]) for (let j = 0; j < 4 + (dx & 3); j++) px(g, sx0 + 6 + dx, sy0 + 16 + j, j < 2 ? p.ink : p.gray);

  // --- foliage spilling over the wall top: drooping leaf fringes, shade on the wall, hanging jackfruit
  crowns.forEach((x, i) => {
    const rw = crownRw(i), fr = mulberry32(900 + i), top = base - hAt(x);
    ditherRect(g, x - rw, top, rw * 2, 10, p.grayDark, 5);
    for (let dx = -rw + 4; dx <= rw - 4; dx++) {
      if (fr() < 0.35) continue;
      const len = 2 + Math.floor(fr() * 7 * (1 - Math.abs(dx) / rw) + 1), y0 = base - hAt(x + dx) - 4;
      for (let j = 0; j < len + 4; j++) px(g, x + dx, y0 + j, j > len + 1 ? p.green : j % 3 ? p.greenDark : p.greenDeep);
      if (fr() < 0.25) px(g, x + dx, y0 + len + 4, p.grassLight);
    }
    if ((i & 1) && rw > 40) for (const fx of [-18, 7, 26]) { rect(g, x + fx, top + 3, 3, 4, p.paddy); px(g, x + fx, top + 3, p.green); px(g, x + fx + 1, top + 6, p.brown); }
  });

  // --- a hedge and a few weeds along the foot, running right out to both ends
  for (let x = 0; x < W; x++) {
    const hh = 3 + Math.floor(hash2(x >> 2, 53) * 4);
    for (let j = 0; j < hh; j++) if (bayer(x, base - 1 - j) < 16 - j * 2) px(g, x, base - 1 - j, j > hh - 2 ? p.grass : j % 2 ? p.greenDark : p.greenDeep);
  }

  // --- the whole sprite dissolves into the landscape at both ends (a dithered fade, no hard edge)
  const FADE = 70;
  for (let x = 0; x < FADE; x++) {
    const k = (FADE - x) / FADE * 16;
    for (let y = 0; y < H; y++) {
      if (bayer(x, y) < k) g.clearRect(x, y, 1, 1);
      if (bayer(W - 1 - x, y) < k) g.clearRect(W - 1 - x, y, 1, 1);
    }
  }
  return c;
}
