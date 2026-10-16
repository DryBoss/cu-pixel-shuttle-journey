'use strict';
// js/06-landscapes/sylhet-hills.js
// Defines: hillsFar, hillsMid, streamPath, forestHill, hillsFg, hillsFgGround

// --- 5. Sylhet hills -------------------------------------------------------
function hillsFar(ctx) {
  const { rng } = ctx;
  for (let x = ctx.from - 120; x < ctx.to; x += randInt(rng, 60, 120)) {      // tall blue-green range
    const w = randInt(rng, 140, 260), h = randInt(rng, 30, 46), tx = x;
    if (ctx.ok(x + (w >> 1))) ctx.stat(tx, tx + w, 0, (g, p, lit, ox) => hump(g, tx + ox, 53, w, h, p.haze, null, p.skyMid));
  }
  for (let x = ctx.from - 80; x < ctx.to; x += randInt(rng, 50, 100)) {       // nearer, greener ridges
    const w = randInt(rng, 90, 170), h = randInt(rng, 14, 26), tx = x;
    if (ctx.ok(x + (w >> 1))) ctx.stat(tx, tx + w, 1, (g, p, lit, ox) => hump(g, tx + ox, 53, w, h, p.greenDark, p.green));
  }
  fogBands(ctx, 24, 46, 36, 8);
}

function hillsMid(ctx) {
  const { rng, L } = ctx;
  for (let x = ctx.from - 80; x < ctx.to; x += randInt(rng, 70, 140)) {
    const w = randInt(rng, 110, 200), h = randInt(rng, 12, 24), x0 = x, seed = randInt(rng, 1, 1e6);
    const stream = rng() < 0.6 ? streamPath(rng, w, h) : null;
    if (!ctx.ok(x + (w >> 1))) continue;
    ctx.stat(x0, x0 + w, -h, (g, p, lit, ox) => forestHill(g, p, x0 + ox, w, h, seed, stream));
    if (stream) ctx.live(streamFlowEnt(stream.map(([i, y]) => [x0 + i, y]), rng));
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 16, 40)) {
    const y = randInt(rng, 35, 38), bamboo = rng() < 0.6, h = randInt(rng, 16, 24), n = randInt(rng, 3, 5);
    if (ctx.ok(x)) ctx.live(bamboo ? swayer(L, x, y, 'bamboo', h, n) : swayer(L, x, y, 'betel', h, n - 4));
  }
  fogBands(ctx, 10, 28, 46, 7);
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

function forestHill(g, p, x, w, h, seed, stream) {
  const rng = mulberry32(seed), base = 37;
  hump(g, x, base, w, h, p.green, p.grass);
  for (let i = 0; i < w * h / 14; i++) {                          // crowns all over the slope
    const j = randInt(rng, 3, w - 4), t = humpTop(j, w, h, base), y = randInt(rng, t + 1, base), r = randInt(rng, 1, 2);
    if (y >= base) continue;
    disc(g, x + j, y, r, p.greenDark);
    px(g, x + j - 1, y - 1, p.grass);
  }
  if (stream) for (const [j, y] of stream) { px(g, x + j, y, p.skyMid); px(g, x + j + 1, y, p.skyLight); }
}

function hillsFg(ctx) {
  const { rng, L } = ctx, streams = [];
  for (let x = ctx.from + randInt(rng, 60, 200); x < ctx.to; x += randInt(rng, 260, 520)) {
    const s = { cx: x, w: randInt(rng, 7, 12) };
    if (!ctx.ok(x)) continue;
    streams.push(s);
    const pts = [];
    for (let y = 14; y < 34; y++) pts.push([Math.round(s.cx + (y - 12) * 0.8) + randInt(rng, -2, 2), y]);
    ctx.live(streamFlowEnt(pts, rng));
  }
  const dry = { ...ctx, ok: x => ctx.ok(x) && !streams.some(s => Math.abs(x - s.cx - 8) < s.w + 14) };
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 10, 30)) {
    const y = randInt(rng, 15, 33), fern = rng() < 0.5, tx = x;
    if (!dry.ok(x)) continue;
    if (fern) ctx.live(swayer(L, tx, y, 'fern'));
    else ctx.stat(tx - 2, tx + 2, y, (g, p, lit, ox) => { rect(g, tx - 1 + ox, y - 1, 3, 2, p.gray); px(g, tx + ox, y - 1, p.grayLight); });
  }
  addTufts(dry, 12, 13, 16);
  return { streams };
}

// Grass, and a hill stream running out from a culvert under the track
function hillsFgGround(s, y, lx) {
  if (y < 12) return null;
  if (s) {
    const d = Math.abs(lx - (s.cx + (y - 12) * 0.8)), hw = s.w / 2 + (y - 12) * 0.12;
    if (d < hw) return y < 14 ? 'navy' : hash2(lx >> 1, y) < 0.12 ? 'skyLight' : 'skyMid';
    if (d < hw + 2) return hash2(lx, y) < 0.4 ? 'grayLight' : 'gray';
  }
  if (y === 12) return bayer(lx, y) < 10 ? 'grass' : 'green';
  return hash2(lx >> 1, y) < 0.16 ? 'greenDark' : hash2(lx, y + 99) < 0.05 ? 'grass' : 'green';
}
