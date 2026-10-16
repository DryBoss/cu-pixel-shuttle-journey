'use strict';
// js/06-landscapes/village.js
// Defines: CROPS, MID_BANDS, plots, plotAt, villageMid, paddyColumn, paddyGround, villageFg, villageFgColumn, pondPixel, villageFgGround, villageFgHl

// --- 1. village ------------------------------------------------------------
const CROPS = {                          // [base, row lines, tips lit by the wind]
  paddy:  ['paddy', 'grassLight', 'cream'],
  young:  ['grassLight', 'grass', 'paddy'],
  green:  ['grass', 'green', 'grassLight'],
  dark:   ['green', 'greenDark', 'grass'],
  fallow: ['tan', 'brown', 'paddy'],
};
const MID_BANDS = [[34, 5], [39, 7], [46, 9], [55, 11], [66, 14]];   // field bands, taller towards the viewer

// Plots along a row of fields: sorted start columns, one crop each
function plots(rng, from, to, wMin, wMax, crops) {
  const xs = [], cs = [];
  for (let x = from - wMax; x < to + wMax; x += randInt(rng, wMin, wMax)) { xs.push(x); cs.push(pick(rng, crops)); }
  return { xs, cs };
}
function plotAt(P, lx) {
  let lo = 0, hi = P.xs.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (P.xs[m] <= lx) lo = m; else hi = m - 1; }
  return lo;
}

function villageMid(ctx) {
  const { rng, L } = ctx, G = 34;
  const bands = MID_BANDS.map(() => plots(rng, ctx.from, ctx.to, 28, 90, ['paddy', 'young', 'green', 'young', 'dark', 'fallow', 'paddy']));
  for (let vx = ctx.from + randInt(rng, 10, 40); vx < ctx.to; ) {      // hamlets
    const cw = randInt(rng, 40, 100);
    for (let x = vx; x < vx + cw; x += randInt(rng, 6, 12)) {         // back row of trees
      const r = rng(), tx = x, h = randInt(rng, 14, 21), lean = randInt(rng, -2, 2);
      const rr = randInt(rng, 4, 7), th = randInt(rng, 2, 6), seed = randInt(rng, 1, 1e6);
      if (!ctx.ok(tx)) continue;
      if (r < 0.22) ctx.live(swayer(L, tx, G - 1, 'coco', h, lean));
      else if (r < 0.36) ctx.live(swayer(L, tx, G - 1, 'betel', h + 1, Math.sign(lean)));
      else ctx.stat(tx - rr - 2, tx + rr + 1, G - 1, (g, p, lit, ox) => roundTree(g, tx + ox, G - 1, rr, th, p, seed));
    }
    for (let i = randInt(rng, 0, 2); i >= 0; i--) {                    // banana plants
      const bx = vx + randInt(rng, 0, cw);
      if (ctx.ok(bx)) ctx.live(swayer(L, bx, G + 1, 'banana'));
    }
    for (let i = randInt(rng, 1, 3); i > 0; i--) {                     // houses in front
      const hx = vx + randInt(rng, 0, cw - 16), hw = randInt(rng, 10, 16), fence = rng() < 0.6 ? randInt(rng, 4, 10) : 0;
      const tin = rng() < 0.8, roll = rng();
      if (!ctx.ok(hx)) continue;
      const e = spriteEnt(hx, G + 2, hw + fence + 3, 10, 1, 10, 'house' + hx + '|' + hw,
        (g, p, lit) => house(g, 1, 10, hw, p, tin, lit && roll < 0.7, fence));
      if (roll < 0.7) e.light = [hx + hw - 4, G - 1];      // its window glows after dark
      ctx.live(e);
    }
    vx += cw + randInt(rng, 30, 110);
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 14, 40)) {    // lone trees, palms, haystacks
    const kind = rng(), tx = x, r = randInt(rng, 3, 5), th = randInt(rng, 2, 4), seed = randInt(rng, 1, 1e6);
    const h = randInt(rng, 13, 20), lean = randInt(rng, -2, 2), y = randInt(rng, G + 6, G + 18);
    if (!ctx.ok(tx)) continue;
    if (kind < 0.3) ctx.stat(tx - r - 2, tx + r + 1, G + 1, (g, p, lit, ox) => roundTree(g, tx + ox, G + 1, r, th, p, seed));
    else if (kind < 0.5) ctx.live(swayer(L, tx, G + 1, 'coco', h, lean));
    else if (kind < 0.62) ctx.live(swayer(L, tx, G + 1, 'betel', h + 2, 0));
    else if (kind < 0.85) ctx.live(spriteEnt(tx, y, 5, 4, 2, 4, 'hay', (g, p) => stamp(g, HAYSTACK, 0, 0, { s: p.brown, h: p.paddy, d: p.tan })));
  }
  return { bands };
}

function paddyColumn(lx, D) {
  return D.bands.map(P => { const i = plotAt(P, lx); return [P.cs[i], P.xs[i] === lx]; });
}

function paddyGround(c, y, lx) {
  if (y < 34) return null;
  let i = MID_BANDS.length - 1;
  while (y < MID_BANDS[i][0]) i--;
  const by = MID_BANDS[i][0], [crop, bund] = c[i], C = CROPS[crop];
  if (bund || y === by) return 'green';
  return (y - by) % 2 === 1 && bayer(lx, y) < 6 ? C[1] : C[0];
}

// Near fields: embankment (rows 12-16), a dirt road here and there (17-20),
// paddy with ponds below it
function villageFg(ctx) {
  const { rng, L } = ctx;
  const D = { plots: plots(rng, ctx.from, ctx.to, 40, 120, ['paddy', 'young', 'young', 'green', 'paddy', 'dark']), roads: [], ponds: [] };
  for (let x = ctx.from + randInt(rng, 0, 200); x < ctx.to; ) {
    const len = randInt(rng, 260, 560), a = x;
    D.roads.push([a, a + len]);
    for (let n = randInt(rng, 1, 2); n > 0; n--)                      // rickshaw or bicycle on it
      if (ctx.ok(a + (len >> 1))) ctx.live(rickshawEnt(a, a + len, 20, rng, rng() < 0.4));
    x += len + randInt(rng, 140, 420);
  }
  for (let x = ctx.from + randInt(rng, 40, 160); x < ctx.to; x += randInt(rng, 160, 380)) {
    const pd = { cx: x, rx: randInt(rng, 12, 22), ry: randInt(rng, 4, 5), cy: randInt(rng, 26, 28) };
    if (!ctx.ok(x)) continue;
    D.ponds.push(pd);
    const dashes = [];
    for (let i = 0; i < pd.rx; i++) {
      const dy = randInt(rng, -pd.ry + 1, pd.ry - 1), w = randInt(rng, 2, 4);
      const half = Math.floor(pd.rx * Math.sqrt(1 - (dy / pd.ry) ** 2)) - w;
      if (half > 1) dashes.push([pd.cx + randInt(rng, -half, half - 1), pd.cy + dy, w, rng() * 6, 1.2 + rng() * 2]);
    }
    ctx.live(shimmerEnt(dashes, pd.cy - pd.ry));
    for (let n = randInt(rng, 1, 3); n > 0; n--) ctx.live(duckEnt(pd, rng));
  }
  const clear = (x, pad) => !D.ponds.some(pd => Math.abs(x - pd.cx) < pd.rx + pad);
  for (let x = ctx.from + randInt(rng, 30, 120); x < ctx.to; x += randInt(rng, 120, 300)) {
    const y = randInt(rng, 25, 32), cow = rng() < 0.55;
    if (!ctx.ok(x) || !clear(x, 12)) continue;
    if (cow) ctx.live(cowEnt(x, y, rng));
    else { const tx = x; ctx.stat(tx - 4, tx + 5, y, (g, p, lit, ox) => stamp(g, HAYSTACK_BIG, tx - 4 + ox, y - 6, { s: p.brown, h: p.paddy, d: p.tan })); }
  }
  addTufts(ctx, 10, 13, 16);
  return D;
}

function villageFgColumn(lx, D) {
  const i = plotAt(D.plots, lx);
  let road = -1, pond = null;
  for (const [a, b] of D.roads) if (lx >= a && lx < b) { road = Math.min(lx - a, b - 1 - lx); break; }
  for (const pd of D.ponds) if (Math.abs(lx - pd.cx) <= pd.rx + 2) { pond = pd; break; }
  return { crop: D.plots.cs[i], bund: D.plots.xs[i] === lx, road, pond };
}

// Pond: muddy far rim, the sky mirrored (pale near the far bank, deeper
// blue towards the viewer), a reflection of the bank along the top
function pondPixel(pd, lx, y) {
  const dx = (lx - pd.cx) / pd.rx, dy = (y - pd.cy) / pd.ry, d = dx * dx + dy * dy;
  if (d > 1.35) return null;
  if (d > 1) return dy < 0 ? 'brown' : 'greenDark';
  if (dy < -0.7) return bayer(lx, y) < 8 ? 'green' : 'skyLight';
  return dy < -0.2 ? (bayer(lx, y) < 10 ? 'skyLight' : 'skyMid') : dy < 0.4 ? 'skyMid' : bayer(lx, y) < 6 ? 'skyDeep' : 'skyMid';
}

function villageFgGround(c, y, lx) {
  if (y < 12) return null;
  if (y === 12) return bayer(lx, y) < 10 ? 'grass' : 'green';
  if (y < 16) return hash2(lx >> 1, y) < 0.18 ? 'greenDark' : hash2(lx, y) < 0.1 ? 'grass' : 'green';
  if (y === 16) return bayer(lx, y) < 8 ? 'greenDark' : 'green';
  if (c.road >= 0 && y <= 20) {
    if (y === 17 || y === 20) return bayer(lx, y) < (c.road < 6 ? 4 : 9) ? 'tan' : 'grass';
    return y === 19 && hash2(lx >> 2, 7) < 0.6 && bayer(lx, y) < 10 ? 'brown' : hash2(lx, y) < 0.06 ? 'cream' : 'tan';
  }
  const pk = c.pond && pondPixel(c.pond, lx, y);
  if (pk) return pk;
  if (y === 17 || c.bund) return 'green';
  const C = CROPS[c.crop];
  return y % 2 === 1 && bayer(lx, y) < 7 ? C[1] : C[0];
}

// Under a wind crest the rice tips catch the light and the row lines shift
function villageFgHl(c, y, lx) {
  if (y < 18 || c.bund || (c.road >= 0 && y <= 20) || (c.pond && pondPixel(c.pond, lx, y))) return null;
  const C = CROPS[c.crop];
  if (y % 2) return bayer(lx + 2, y) < 7 ? C[1] : bayer(lx, y) < 7 ? C[0] : null;
  return bayer(lx, y) < 5 ? C[2] : null;
}
