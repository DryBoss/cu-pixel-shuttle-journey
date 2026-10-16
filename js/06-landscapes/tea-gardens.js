'use strict';
// js/06-landscapes/tea-gardens.js
// Defines: TEA_PROF, TEA_PROF_MID, teaHedge, teaFgRow, teaFgGround, teaFar, teaMid, teaHill

// --- 4. Srimangal tea gardens --------------------------------------------------
const TEA_PROF = [0, 1, 1, 1, 1, 1, 1, 0];          // bush outline across one period (fg)
const TEA_PROF_MID = [1, 2, 2, 2, 1, 0];

// Rows of clipped tea bushes: rows `gap` px apart starting at y0
function teaHedge(lx, y, y0, gap, prof) {
  const r = Math.floor((y - y0) / gap), ry = y0 + r * gap + gap - 2, n = prof.length;
  const h = prof[((lx + r * 4) % n + n) % n];
  if (y <= ry && y >= ry - h) return y === ry - h ? 'grass' : hash2(lx, y) < 0.15 ? 'greenDark' : 'green';
  return null;
}

// Near tea: 6-row bands of a red-earth path, then a clipped hedge whose top
// is scalloped into rounded bushes, then its shadow
function teaFgRow(lx, y) {
  const r = Math.floor((y - 15) / 6), rel = y - 15 - r * 6, n = TEA_PROF.length;
  return [rel, TEA_PROF[((lx + r * 3) % n + n) % n]];
}

function teaFgGround(c, y, lx) {
  if (y < 12) return null;
  if (y < 15) return y === 12 ? (bayer(lx, y) < 10 ? 'grass' : 'green') : hash2(lx >> 1, y) < 0.2 ? 'greenDark' : 'green';
  const [rel, bump] = teaFgRow(lx, y), top = 2 - bump;
  if (rel === 5) return 'greenDark';
  if (rel < top) return rel === 0 && bayer(lx, y) < 6 ? 'rust' : bump ? 'brown' : 'brownDark';
  if (rel === top) return 'grass';
  return hash2(lx, y) < 0.15 ? 'greenDark' : 'green';
}

function teaFar(ctx) {
  const { rng } = ctx;
  for (let x = ctx.from - 60; x < ctx.to; x += randInt(rng, 40, 90)) {
    const w = randInt(rng, 70, 150), h = randInt(rng, 10, 22), tx = x, back = h > 16;
    if (ctx.ok(x + (w >> 1))) ctx.stat(tx, tx + w, back ? 0 : 1, (g, p, lit, ox) =>
      hump(g, tx + ox, 53, w, h, back ? p.haze : p.greenDark, back ? null : p.green));
  }
  fogBands(ctx, 34, 48, 40, 7);
}

function teaMid(ctx) {
  const { rng } = ctx;
  for (let x = ctx.from - 100; x < ctx.to; x += randInt(rng, 90, 170)) {
    const H = { x0: x, w: randInt(rng, 150, 260), h: randInt(rng, 16, 30), seed: randInt(rng, 1, 1e6) };
    if (!ctx.ok(x + (H.w >> 1))) continue;
    ctx.stat(H.x0, H.x0 + H.w, -H.h, (g, p, lit, ox) => teaHill(g, p, H, ox));
    for (let n = randInt(rng, 1, 3); n > 0; n--) {
      const i = randInt(rng, 20, H.w - 20), d = 2 + 4 * randInt(rng, 0, Math.max(0, Math.floor(H.h / 4) - 2));
      if (humpTop(i, H.w, H.h, 36) + d < 34) ctx.live(pickerEnt(H, i, d, rng));
    }
  }
  fogBands(ctx, 10, 26, 60, 6);
}

// A tea hill: rows of bushes following the slope, tall thin shade trees
function teaHill(g, p, H, ox) {
  const rng = mulberry32(H.seed), base = 36, x = H.x0 + ox;
  const top = i => humpTop(i, H.w, H.h, base);
  for (let i = 0; i < H.w; i++) { const t = top(i); if (t < base) { rect(g, x + i, t, 1, base - t + 2, p.greenDark); px(g, x + i, t, p.green); } }
  for (let d = 2; d < H.h; d += 4)
    for (let i = 2; i < H.w - 2; i += 4) {
      const y = top(i) + d;
      if (y >= base) continue;
      rect(g, x + i - 1, y, 3, 1, p.grass);
      px(g, x + i, y - 1, p.grassLight);
    }
  for (let i = randInt(rng, 10, 30); i < H.w - 10; i += randInt(rng, 18, 34)) {
    const t = top(i), ct = t - randInt(rng, 11, 16), cw = randInt(rng, 5, 8), tx = x + i;
    rect(g, tx, ct + 2, 1, t + 2 - ct, p.grayLight);
    px(g, tx - 1, ct + 4, p.grayLight);
    rect(g, tx - cw + 2, ct, 2 * cw - 3, 1, p.green);
    rect(g, tx - cw + 1, ct + 1, 2 * cw - 1, 2, p.greenDark);
    ditherRect(g, tx - cw + 2, ct + 1, 2 * cw - 3, 1, p.green, 6);
  }
}
