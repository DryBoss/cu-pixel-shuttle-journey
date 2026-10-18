'use strict';
// js/06-landscapes/cantonment.js
// Defines: canttBarracks, canttFlag, canttMid, canttFg, canttMidGround, canttFgGround

// --- inside the cantonment: shade trees, lawns, long white barracks, flagpoles, tarmac roads
function canttBarracks(g, p, lit, x, base, w, roof) {
  rect(g, x, base - 9, w, 9, p.white);
  rect(g, x, base - 3, w, 3, p.cloudShade);
  for (let wx = x + 4; wx + 3 <= x + w - 3; wx += 8) rect(g, wx, base - 7, 3, 4, lit ? PALETTE.glow : p.indigo);
  rect(g, x + (w >> 1) - 2, base - 7, 4, 7, p.brown);
  for (let r = 0; r < 4; r++) rect(g, x - 2 + r * 2, base - 10 - r, w + 4 - r * 4, 1, r === 3 ? p.grayDark : p[roof]);
}
function canttFlag(g, p, x, base) {
  rect(g, x, base - 26, 1, 26, p.grayLight);
  rect(g, x + 1, base - 26, 10, 6, p.greenDark); disc(g, x + 5, base - 23, 2, p.red);
}
function canttMid(ctx) {
  const { rng, L } = ctx, G = 34;
  for (let x = ctx.from + randInt(rng, 0, 10); x < ctx.to; x += randInt(rng, 12, 28)) {     // huge old rain trees: wide, neat domes, thick and close together
    const rw = randInt(rng, 12, 20), rh = randInt(rng, 9, 14), seed = randInt(rng, 1, 1e6), base = G + 3 + randInt(rng, 0, 12), tx = x, kind = rng();
    if (!ctx.ok(tx)) continue;
    if (kind < 0.8) ctx.stat(tx - rw - 2, tx + rw + 2, base, (g, p, lit, ox) => rainTree(g, p, tx + ox, base, rw, rh, seed, base - 5));
    else if (kind < 0.88) ctx.live(swayer(L, tx, base, 'coco', randInt(rng, 14, 20), randInt(rng, -2, 2)));
    else ctx.live(swayer(L, tx, base, 'bamboo', randInt(rng, 12, 18), randInt(rng, 3, 5)));
  }
  for (let x = ctx.from + randInt(rng, 40, 120); x < ctx.to; x += randInt(rng, 140, 300)) {   // barracks
    const w = randInt(rng, 60, 110), base = G + 8 + randInt(rng, 0, 6), tx = x;
    if (ctx.ok(tx + (w >> 1))) ctx.stat(tx, tx + w, base + 4, (g, p, lit, ox) => canttBarracksLong(g, p, lit, tx + ox, base, w, 9));
  }
  for (let x = ctx.from + randInt(rng, 80, 240); x < ctx.to; x += randInt(rng, 420, 760)) {   // flagpoles
    const base = G + 8, tx = x;
    if (ctx.ok(tx)) ctx.stat(tx - 1, tx + 12, base + 5, (g, p, lit, ox) => canttFlag(g, p, tx + ox, base));
  }
}
function canttFg(ctx) {
  const { rng } = ctx;
  for (let x = ctx.from + randInt(rng, 20, 80); x < ctx.to; x += randInt(rng, 70, 160)) {     // clipped hedges along the kerb
    const w = randInt(rng, 24, 60), tx = x, y = 15;
    if (ctx.ok(tx)) ctx.stat(tx, tx + w, y, (g, p, lit, ox) => hedgeRow(g, p, tx + ox, w, y, 5));
  }
  addTufts(ctx, 12, 22, 30, 5);
}
function canttMidGround(c, y, lx) {
  if (y < 34) return null;
  return ((lx >> 3) + (y >> 1)) & 1 ? 'grassLight' : (hash2(lx, y + 2) < 0.12 ? 'grass' : 'grassLight');     // perfectly mown lawn, in stripes
}
function canttFgGround(c, y, lx) {
  if (y < 12) return null;
  if (y === 12) return bayer(lx, y) < 10 ? 'grassLight' : 'grass';
  if (y < 17) return ((lx >> 3) + y) & 1 ? 'grassLight' : (hash2(lx, y) < 0.12 ? 'grass' : 'grassLight');
  if (y === 17) return (lx >> 3) & 1 ? 'white' : 'grayLight';                               // painted kerb stones
  if (y <= 20) return hash2(lx, y) < 0.08 ? 'gray' : 'grayDark';                            // tarmac
  return ((lx >> 3) + (y >> 1)) & 1 ? 'grassLight' : (hash2(lx, y + 1) < 0.1 ? 'grass' : 'grassLight');
}
