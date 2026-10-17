'use strict';
// js/06-landscapes/khulshi-layers.js
// Defines: khulshiFar, khulshiMid, khulshiFg, khulshiMidGround, khulshiFgGround, bankMound

// --- the Khulshi stretch: a closed-in green corridor of boundary walls, heavy canopies and hills ---

function khulshiFar(ctx) {                               // rolling dark-green hills, with big residential blocks peeking out of the tree line
  const { rng } = ctx, base = 52;
  for (let rank = 0; rank < 2; rank++)
    for (let x = ctx.from - 120; x < ctx.to; ) {
      const w = randInt(rng, 110, 220), h = randInt(rng, rank ? 34 : 42, rank ? 50 : 62), tx = x;
      if (ctx.ok(tx + (w >> 1))) ctx.stat(tx, tx + w, rank ? -2 : -3, (g, p, lit, ox) => hump(g, tx + ox, 53, w, h, p.greenDark, rank ? p.green : null, p.haze));
      x += randInt(rng, 70, 130);
    }
  for (let x = ctx.from + randInt(rng, 0, 30); x < ctx.to; x += randInt(rng, 28, 70)) {
    const w = randInt(rng, 10, 18), h = randInt(rng, 24, 46), tx = x, seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx)) ctx.stat(tx, tx + w, 0, (g, p, lit, ox) => farResidence(g, p, tx + ox, base, w, h, seed));
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 4, 8)) {                                // the tree line in front, hiding the feet of the blocks
    const r = randInt(rng, 3, 6), tx = x, dy = randInt(rng, 0, 3), seed = randInt(rng, 0, 1e5);
    if (ctx.ok(tx)) ctx.stat(tx - r, tx + r, 1, (g, p, lit, ox) => {
      disc(g, tx + ox, base - r + dy, r, p.greenDeep); disc(g, tx + ox - 1, base - r + dy - 1, Math.max(1, r - 1), seed & 1 ? p.greenDark : p.green);
    });
  }
  return { from: ctx.from, to: ctx.to };
}

function khulshiMid(ctx) {
  const { rng } = ctx, G = 34, WB = G + 10, WH = 17, wallTop = WB - WH;
  for (let x = ctx.from + randInt(rng, 0, 20); x < ctx.to; x += randInt(rng, 90, 190)) {      // multi-storey residences standing behind the walls
    const w = randInt(rng, 20, 30), floors = randInt(rng, 3, 5), tx = x, seed = randInt(rng, 1, 1e6), base = G + 6;
    if (ctx.ok(tx)) ctx.stat(tx - 1, tx + w + 1, base, (g, p, lit, ox) => residenceBlock(g, p, lit, tx + ox, base, w, floors, seed));
  }
  for (let x = ctx.from - 20; x < ctx.to; x += randInt(rng, 26, 52)) {                        // heavy shade trees, tightly spaced, branches over the wall
    const rw = randInt(rng, 22, 38), rh = randInt(rng, 10, 15), cx = x + rw, cy = wallTop - 2 - Math.round(rh * 0.3) + randInt(rng, 0, 3), seed = randInt(rng, 1, 1e6), jack = rng() < 0.4 ? 1 : 0;
    if (ctx.ok(cx)) {
      ctx.stat(cx - rw - 2, cx + rw + 2, G + 7, (g, p, lit, ox) => shadeTree(g, p, cx + ox, cy, wallTop, rw, rh, seed, jack));
      ctx.stat(cx - rw, cx + rw, WB + 1, (g, p, lit, ox) => canopyFringe(g, p, cx + ox, wallTop, rw, seed + 7));
    }
  }
  for (let x = ctx.from - 10; x < ctx.to; ) {                                                  // the tall boundary walls, nearly unbroken
    const len = randInt(rng, 60, 140), brick = rng() < 0.55, tx = x, seed = randInt(rng, 1, 1e6), r = rng();
    const security = r < 0.4 ? 'barbed' : r < 0.75 ? 'glass' : null, gate = rng() < 0.4;
    if (ctx.ok(tx + (len >> 1))) {
      ctx.stat(tx, tx + len, WB, (g, p, lit, ox) => tallWall(g, p, tx + ox, len, WB, WH, brick, seed, security));
      if (rng() < 0.5) ctx.stat(tx, tx + len, WB + 2, (g, p, lit, ox) => vineGrowth(g, p, tx + ox, len, WB - WH + 4, seed + 5, 0.25));
    }
    x += len;
    if (gate) { const gx = x; if (ctx.ok(gx + 10)) ctx.stat(gx, gx + 21, WB, (g, p, lit, ox) => ironGate(g, p, lit, gx + ox, WB, WH)); x += 21; }
  }
  return { from: ctx.from, to: ctx.to };
}

// An embankment slope: a long grassy mound, crest lit, flanks dark
function bankMound(g, p, x, len, base, h, seed) {
  const rng = mulberry32(seed);
  for (let i = 0; i < len; i++) {
    const top = base - Math.round(h * Math.pow(Math.sin(Math.PI * (i + 0.5) / len), 0.7));
    for (let y = top; y <= base; y++) {
      const d = y - top;
      px(g, x + i, y, d === 0 ? (rng() < 0.5 ? p.grassLight : p.grass) : d < 3 || (y + i) % 5 === 0 ? p.green : p.greenDark);
    }
    if (rng() < 0.3) px(g, x + i, top - 1, p.grass);
  }
}

function khulshiFg(ctx) {
  const { rng, L } = ctx;
  for (let x = ctx.from - 20; x < ctx.to; ) {                                                  // the embankment rises beside the ballast
    const len = randInt(rng, 50, 110), h = randInt(rng, 5, 8), tx = x, seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx + (len >> 1))) ctx.stat(tx, tx + len, 20, (g, p, lit, ox) => bankMound(g, p, tx + ox, len, 20, h, seed));
    x += Math.round(len * 0.62);
  }
  for (let x = ctx.from + randInt(rng, 0, 10); x < ctx.to; x += randInt(rng, 6, 15)) {         // thick ferns and tall grass over the slope and verge
    const r = rng(), y = randInt(rng, 13, 28);
    if (!ctx.ok(x)) continue;
    if (r < 0.6) ctx.live(swayer(L, x, y, 'fern'));
    else ctx.live(swayer(L, x, y, 'grass', y < 16 ? randInt(rng, 5, 8) : randInt(rng, 7, 15), randInt(rng, 0, 3)));
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 60, 130)) {                             // dappled shade from the canopy overhead
    const rw = randInt(rng, 20, 40), y = randInt(rng, 15, 28), tx = x;
    if (ctx.ok(tx)) ctx.stat(tx - rw, tx + rw, 21, (g, p, lit, ox) => ditherRect(g, tx + ox - rw, y - 3, rw * 2, 7, p.greenDeep, 6));
  }
  return { from: ctx.from, to: ctx.to };
}

function khulshiMidGround(c, y, lx) {
  if (y < 34) return null;
  const k = hash2(lx, y), sh = hash2(lx >> 4, (y >> 2) + 40) < 0.3;
  return y === 34 ? 'greenDark' : sh ? (k < 0.7 ? 'greenDeep' : 'greenDark') : k < 0.5 ? 'greenDark' : k < 0.82 ? 'green' : 'greenDeep';
}

function khulshiFgGround(c, y, lx) {                      // rows 12..20 the embankment, 21+ the lush verge: no dust, no trash
  if (y < 12) return null;
  if (y === 12) return bayer(lx, y) < 9 ? 'gray' : 'grayDark';
  const k = hash2(lx, y), sh = hash2(lx >> 4, (y >> 2) + 40) < 0.28;
  if (y <= 20) return sh ? (k < 0.6 ? 'greenDark' : 'greenDeep') : k < 0.45 ? 'green' : k < 0.8 ? 'greenDark' : k < 0.9 ? 'grass' : 'greenDeep';
  return sh ? (k < 0.7 ? 'greenDeep' : 'greenDark') : k < 0.5 ? 'greenDark' : k < 0.78 ? 'green' : k < 0.95 ? 'greenDeep' : 'grass';
}
