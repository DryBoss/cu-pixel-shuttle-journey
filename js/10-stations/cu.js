'use strict';
// js/10-stations/cu.js
// Defines: buildCU, buildCanopyOverhang

// Chittagong University: no station building at all. The terminus is open-air, set straight into the
// campus: towering dark-green hills rise almost at once behind the tracks, and old-growth jungle trees
// spill down their slopes and over the line. (Screen x -100 is the sprite's left edge at the stop; the
// ground is row 98 = screen y 128.) The yard, buffer stop, stalls and people are drawn in front.
function buildCU(p, lit) {
  const W = 520, H = 112, [c, g] = makeCanvas(W, H), rng = mulberry32(73), base = 98;
  const taper = x => Math.min(1, x / 110, (W - 1 - x) / 110);                      // the hills die away gently at both ends
  const top = (x, o) => Math.round(o.base - taper(x) * (o.A + o.a1 * Math.sin(x * o.f1 + o.s1) + o.a2 * Math.sin(x * o.f2 + o.s2) + o.a3 * Math.sin(x * o.f3 + o.s3)));
  const RANKS = [
    { base: 88, A: 48, a1: 16, f1: 0.021, s1: 0.6, a2: 8, f2: 0.053, s2: 1.9, a3: 3, f3: 0.11, s3: 0.3, kind: 'haze' },     // far, pale in the haze
    { base: 94, A: 40, a1: 15, f1: 0.027, s1: 2.1, a2: 7, f2: 0.061, s2: 0.4, a3: 3, f3: 0.13, s3: 1.1, kind: 'mid' },      // the main ridge
    { base: 98, A: 22, a1: 11, f1: 0.037, s1: 4.0, a2: 5, f2: 0.083, s2: 2.2, a3: 2, f3: 0.17, s3: 0.7, kind: 'front' },    // the foothills nearest the line
  ];
  RANKS.forEach((o, ri) => {
    for (let x = 0; x < W; x++) {
      const t0 = top(x, o), slope = top(x - 2, o) - top(x + 2, o);
      for (let y = t0; y < o.base; y++) {
        const n = hash2(x >> 1, (y >> 1) + ri * 31), depth = y - t0;
        if (o.kind === 'haze') px(g, x, y, depth < 8 && bayer(x, y) < (8 - depth) * 2 ? p.skyMid : (n < 0.3 ? p.haze : p.haze));
        else px(g, x, y, depth < 2 ? (n < 0.55 ? p.green : p.greenDark)                    // sunlit crowns along the ridge
                         : y > o.base - 8 ? (n < 0.25 ? p.greenDark : p.greenDeep)           // deep shade at the foot
                         : n < 0.3 + (slope > 0 ? 0.22 : -0.08) ? p.green : n > 0.88 ? p.greenDeep : p.greenDark);
      }
    }
    if (o.kind !== 'haze')
      for (let i = 0; i < 40 + ri * 20; i++) {                                              // jungle trees dotting the slopes
        const x = randInt(rng, 6, W - 7), y = top(x, o) + randInt(rng, 3, 26), r = randInt(rng, 3, 6 + ri);
        disc(g, x, y, r, p.greenDeep); disc(g, x - 1, y - 1, r - 1, p.greenDark); disc(g, x - 1, y - 2, Math.max(1, r - 3), i & 1 ? p.green : p.grass);
      }
  });
  rect(g, 0, base, W, H - base, p.brownDark);                                               // leaf-litter ground
  for (let i = 0; i < W * 3; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, base, H - 1), rng() < 0.4 ? p.greenDark : rng() < 0.5 ? p.brown : p.tan);

  for (let x = 14, i = 0; x < W; x += randInt(rng, 46, 70), i++) {                            // old-growth shade trees: huge crowns spilling down and out over the line
    const rw = randInt(rng, 26, 38), rh = randInt(rng, 20, 26), cy = randInt(rng, 70, 80), seed = 800 + i * 13;
    rect(g, x - 3, cy + 8, 7, base - cy - 6, p.brownDark); rect(g, x - 3, cy + 8, 2, base - cy - 6, p.brown); rect(g, x - 5, base - 4, 11, 4, p.brownDark);   // buttressed trunk
    leafyCrown(g, p, x, cy, rw, rh, seed, i & 1);
    const fr = mulberry32(seed + 5);
    for (let dx = -rw + 3; dx <= rw - 3; dx++) {                                             // lianas and leaf fringes hanging below the canopy
      if (fr() < 0.55) continue;
      const len = 2 + Math.floor(fr() * 8 * (1 - Math.abs(dx) / rw) + 1), y0 = cy + rh - 6;
      for (let j = 0; j < len; j++) px(g, x + dx, y0 + j, j > len - 2 ? p.grass : j % 3 ? p.greenDark : p.greenDeep);
    }
  }
  for (let x = 2; x < W; x += randInt(rng, 3, 6)) {                                          // ferns and undergrowth along the foot
    const h = randInt(rng, 3, 6);
    for (let j = 0; j < h; j++) px(g, x + (j > 2 ? (rng() < 0.5 ? -1 : 1) : 0), base - 1 - j, j === h - 1 ? p.grassLight : j % 2 ? p.grass : p.greenDark);
  }
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
