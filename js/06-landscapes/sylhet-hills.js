'use strict';
// js/06-landscapes/sylhet-hills.js
// Defines: hillsFar, hillsTall, hillsMid, streamPath, forestHill, jungleTree, cuttingBank, hillsFg, hillsFgGround

// --- the Chittagong University hills: the line leaves the plains and plunges into steep, forested country.
//     Towering silhouettes, jungle, fog in the valleys, a deep cutting with ferns and chhoras (hill streams) ---

function hillsFar(ctx) {
  const { rng } = ctx;
  for (let x = ctx.from - 120; x < ctx.to; x += randInt(rng, 60, 120)) {      // tall blue-green range
    const w = randInt(rng, 140, 260), h = randInt(rng, 38, 52), tx = x;
    if (ctx.ok(x + (w >> 1))) ctx.stat(tx, tx + w, 0, (g, p, lit, ox) => hump(g, tx + ox, 53, w, h, p.haze, null, p.skyMid));
  }
  for (let x = ctx.from - 80; x < ctx.to; x += randInt(rng, 50, 100)) {       // nearer, greener ridges
    const w = randInt(rng, 90, 170), h = randInt(rng, 20, 34), tx = x;
    if (ctx.ok(x + (w >> 1))) ctx.stat(tx, tx + w, 1, (g, p, lit, ox) => hump(g, tx + ox, 53, w, h, p.greenDark, p.green));
  }
  fogBands(ctx, 24, 46, 36, 8);
}

// The 'tall' layer rises right through the sky: massive hill silhouettes that dwarf the train, and big forested hills in front of them
function hillsTall(ctx) {
  const { rng } = ctx, base = 122;
  for (let x = ctx.from - 180; x < ctx.to; x += randInt(rng, 90, 170)) {
    const w = randInt(rng, 240, 420), h = randInt(rng, 70, 104), tx = x, seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx + (w >> 1))) ctx.stat(tx, tx + w, -2, (g, p, lit, ox) => {
      hump(g, tx + ox, base, w, h, p.greenDark, p.green, p.haze);
      const r = mulberry32(seed);
      for (let i = 0; i < w * h / 70; i++) {                                    // jungle texture: dark crowns, a few lit
        const j = randInt(r, 4, w - 5), t = humpTop(j, w, h, base), y = randInt(r, t + 2, base - 4);
        disc(g, tx + ox + j, y, randInt(r, 2, 4), r() < 0.7 ? p.greenDeep : p.greenDark); px(g, tx + ox + j - 1, y - 1, p.green);
      }
    });
  }
  for (let x = ctx.from - 100; x < ctx.to; x += randInt(rng, 70, 130)) {
    const w = randInt(rng, 150, 260), h = randInt(rng, 44, 72), tx = x, seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx + (w >> 1))) ctx.stat(tx, tx + w, -1, (g, p, lit, ox) => forestHill(g, p, tx + ox, w, h, seed, null, base, 30, 3));
  }
  fogBands(ctx, 78, 112, 60, 9);                                                 // low fog clinging to the valleys between them
}

function hillsMid(ctx) {
  const { rng, L } = ctx;
  for (let x = ctx.from - 80; x < ctx.to; x += randInt(rng, 60, 120)) {          // overlapping, undulating forested hills
    const w = randInt(rng, 110, 200), h = randInt(rng, 20, 36), x0 = x, seed = randInt(rng, 1, 1e6);
    const stream = rng() < 0.6 ? streamPath(rng, w, h) : null;
    if (!ctx.ok(x + (w >> 1))) continue;
    ctx.stat(x0, x0 + w, -h, (g, p, lit, ox) => forestHill(g, p, x0 + ox, w, h, seed, stream));
    if (stream) ctx.live(streamFlowEnt(stream.map(([i, y]) => [x0 + i, y]), rng));
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 24, 52)) {                // wild, dense jungle canopy: big crowns, lianas, no tidy trees
    const rw = randInt(rng, 12, 22), rh = randInt(rng, 10, 15), base = randInt(rng, 36, 40), seed = randInt(rng, 1, 1e6), tx = x;
    if (ctx.ok(tx)) ctx.stat(tx - rw - 2, tx + rw + 2, base + 1, (g, p, lit, ox) => jungleTree(g, p, tx + ox, base, rw, rh, seed));
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 28, 60)) {                // dense clumps of bamboo leaning out from the hillsides towards the tracks
    for (let n = randInt(rng, 2, 4), cx = x; n > 0; n--, cx += randInt(rng, 3, 7)) {
      const y = randInt(rng, 35, 44), h = randInt(rng, 18, 28), k = randInt(rng, 3, 5);
      if (ctx.ok(cx)) ctx.live(rng() < 0.82 ? swayer(L, cx, y, 'bamboo', h, k) : swayer(L, cx, y, 'betel', h, k - 4));
    }
  }
  fogBands(ctx, 22, 34, 34, 9);
}

// A stream wandering down a hillside from near the crest: [i, y] points
function streamPath(rng, w, h, base = 37) {
  let i = randInt(rng, Math.floor(w * 0.35), Math.floor(w * 0.65));
  const pts = [];
  for (let y = humpTop(i, w, h, base) + 3; y < base; y++) {
    if (y > humpTop(i, w, h, base)) pts.push([i, y]);
    i += randInt(rng, -1, 1) + (rng() < 0.3 ? Math.sign(i - w / 2) : 0);
  }
  return pts;
}

// A forested hill: crowns all over the slope, an optional stream. base = the ground row it stands on; dense/rmax thin the work out for big hills
function forestHill(g, p, x, w, h, seed, stream, base = 37, dense = 14, rmax = 2) {
  const rng = mulberry32(seed);
  hump(g, x, base, w, h, p.green, p.grass);
  for (let i = 0; i < w * h / dense; i++) {
    const j = randInt(rng, 3, w - 4), t = humpTop(j, w, h, base), y = randInt(rng, t + 1, base), r = randInt(rng, 1, rmax);
    if (y >= base) continue;
    disc(g, x + j, y, r, rng() < 0.3 ? p.greenDeep : p.greenDark);
    px(g, x + j - 1, y - 1, p.grass);
  }
  if (stream) for (const [j, y] of stream) { px(g, x + j, y, p.skyMid); px(g, x + j + 1, y, p.skyLight); }
}

// Wild old jungle: a huge irregular crown on a thick trunk, lianas trailing from it
function jungleTree(g, p, cx, base, rw, rh, seed) {
  const rng = mulberry32(seed), cy = base - rh - 4;
  rect(g, cx - 2, cy, 4, base - cy, p.brownDark); rect(g, cx - 2, cy, 1, base - cy, p.brown);
  leafyCrown(g, p, cx, cy, rw, rh, seed, 0);
  for (let dx = -rw + 3; dx <= rw - 3; dx++) {
    if (rng() < 0.6) continue;
    const len = 2 + Math.floor(rng() * 7), y0 = cy + rh - 5;
    for (let j = 0; j < len; j++) px(g, cx + dx, y0 + j, j === len - 1 ? p.grass : j % 3 ? p.greenDark : p.greenDeep);
  }
}

// A steep cutting face rising straight up beside the ballast: dark green, roots and bare earth showing
function cuttingBank(g, p, x, len, base, h, seed) {
  const rng = mulberry32(seed);
  for (let i = 0; i < len; i++) {
    const top = base - Math.round(h * Math.pow(Math.sin(Math.PI * (i + 0.5) / len), 0.45));
    for (let y = top; y <= base; y++) {
      const d = y - top, n = rng();
      px(g, x + i, y, d === 0 ? p.green : d < 2 ? (n < 0.5 ? p.green : p.greenDark) : n < 0.08 ? p.brownDark : n < 0.5 ? p.greenDark : p.greenDeep);
    }
    if (rng() < 0.35) px(g, x + i, top - 1, p.greenDark);
  }
}

function hillsFg(ctx) {
  const { rng, L } = ctx, streams = [];
  for (let x = ctx.from + randInt(rng, 40, 120); x < ctx.to; x += randInt(rng, 120, 260)) {   // chhoras: springs running out from culverts under the line, often
    const s = { cx: x, w: randInt(rng, 7, 12) };
    if (!ctx.ok(x)) continue;
    streams.push(s);
    const pts = [];
    for (let y = 14; y < 34; y++) pts.push([Math.round(s.cx + (y - 12) * 0.8) + randInt(rng, -2, 2), y]);
    const cs = randInt(rng, 1, 1e6), cx0 = s.cx + 2;
    ctx.stat(cx0 - (s.w >> 1) - 5, cx0 + (s.w >> 1) + 5, 17, (g, p, lit, ox) => culvert(g, p, cx0 + ox, s.w, cs));
    ctx.live(streamFlowEnt(pts, rng));
  }
  const dry = { ...ctx, ok: x => ctx.ok(x) && !streams.some(s => Math.abs(x - s.cx - 8) < s.w + 14) };
  for (let x = ctx.from - 20; x < ctx.to; ) {                                                 // the steep cutting walls
    const len = randInt(rng, 50, 110), h = randInt(rng, 9, 15), tx = x, seed = randInt(rng, 1, 1e6);
    if (dry.ok(tx + (len >> 1))) ctx.stat(tx, tx + len, 20, (g, p, lit, ox) => cuttingBank(g, p, tx + ox, len, 21, h, seed));
    x += Math.round(len * 0.6);
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 5, 12)) {                              // wild undergrowth: ferns and long grass everywhere
    const y = randInt(rng, 9, 33), r = rng(), tx = x;
    if (!dry.ok(x)) continue;
    if (r < 0.55) ctx.live(swayer(L, tx, y, 'fern'));
    else if (r < 0.9) ctx.live(swayer(L, tx, y, 'grass', y < 16 ? randInt(rng, 5, 9) : randInt(rng, 7, 15), randInt(rng, 0, 3)));
    else ctx.stat(tx - 2, tx + 2, y, (g, p, lit, ox) => { rect(g, tx - 1 + ox, y - 1, 3, 2, p.gray); px(g, tx + ox, y - 1, p.grayLight); });
  }
  addTufts(dry, 8, 13, 16);
  return { streams };
}

// A steep, dark green cutting beside the ballast, then jungle floor; and a hill stream running out from a culvert under the track
function hillsFgGround(s, y, lx) {
  if (y < 12) return null;
  if (s) {
    const d = Math.abs(lx - (s.cx + (y - 12) * 0.8)), hw = s.w / 2 + (y - 12) * 0.12;
    if (d < hw) return y < 14 ? 'navy' : hash2(lx >> 1, y) < 0.12 ? 'skyLight' : 'skyMid';
    if (d < hw + 2) return hash2(lx, y) < 0.4 ? 'grayLight' : 'gray';
  }
  if (y === 12) return bayer(lx, y) < 10 ? 'greenDark' : 'greenDeep';
  const k = hash2(lx, y);
  if (y <= 22) return k < 0.45 ? 'greenDark' : k < 0.8 ? 'greenDeep' : k < 0.93 ? 'green' : 'brownDark';
  return k < 0.3 ? 'greenDark' : k < 0.75 ? 'green' : k < 0.9 ? 'greenDeep' : 'grass';
}
