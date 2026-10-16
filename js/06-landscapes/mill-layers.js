'use strict';
// js/06-landscapes/mill-layers.js
// Defines: millFar, millMid, millMidGround

function millFar(ctx) {                                  // factory roofs and chimneys in the haze
  const { rng } = ctx, base = 52;
  for (let x = ctx.from; x < ctx.to; ) {
    const w = randInt(rng, 14, 36), h = randInt(rng, 8, 16), tx = x;
    if (ctx.ok(tx)) ctx.stat(tx, tx + w, 0, (g, p, lit, ox) => {
      rect(g, tx + ox, base - h, w, h, p.haze);
      for (let k = 0; k < w; k += 6) rect(g, tx + ox + k, base - h - 3, 3, 3, p.haze);
    });
    x += w + randInt(rng, 0, 6);
  }
  for (let x = ctx.from + randInt(rng, 20, 60); x < ctx.to; x += randInt(rng, 70, 130)) {
    const h = randInt(rng, 30, 40), tx = x;
    if (ctx.ok(tx)) ctx.stat(tx - 2, tx + 4, 1, (g, p, lit, ox) => rect(g, tx + ox - 1, base - h, 4, h, p.haze));
  }
  treeLine(ctx);
}

function millMid(ctx) {
  const { rng } = ctx, G = 34;
  for (let x = ctx.from + randInt(rng, 6, 30); x < ctx.to; ) {          // the works: sheds, with chimneys and towers among them
    const kind = rng(), tx = x;
    if (kind < 0.55) {
      const w = randInt(rng, 60, 120), h = randInt(rng, 20, 26), base = G + 3 + randInt(rng, 0, 3);
      if (ctx.ok(tx + (w >> 1))) ctx.stat(tx, tx + w, base, (g, p, lit, ox) => millShed(g, p, lit, tx + ox, base, w, h));
      x += w + randInt(rng, 2, 10);
    } else if (kind < 0.8) {
      const h = randInt(rng, 46, 58), base = G + 4;
      if (ctx.ok(tx)) ctx.stat(tx - 7, tx + 8, base, (g, p, lit, ox) => millChimney(g, p, tx + ox, base, h));
      x += randInt(rng, 24, 40);
    } else {
      const base = G + 4;
      if (ctx.ok(tx)) ctx.stat(tx - 8, tx + 8, base, (g, p, lit, ox) => millTower(g, p, tx + ox, base));
      x += randInt(rng, 24, 36);
    }
  }
  for (let x = ctx.from; x < ctx.to; ) {                                // front: the boundary wall, bales stacked behind it, a gate
    const len = randInt(rng, 90, 170), base = G + 13, tx = x;
    if (ctx.ok(tx + (len >> 1))) {
      ctx.stat(tx, tx + len, base + 1, (g, p, lit, ox) => millWall(g, p, tx + ox, tx + ox + len, base));
      for (let bx = tx + 10; bx < tx + len - 30; bx += randInt(rng, 26, 48)) {
        const cols = randInt(rng, 3, 5), rows = randInt(rng, 2, 4), bb = base - 1;
        ctx.stat(bx, bx + cols * 6 + 3, bb, (g, p, lit, ox) => millBales(g, p, bx + ox, bb, cols, rows));
      }
    }
    x += len;
    const gx = x;
    if (ctx.ok(gx)) ctx.stat(gx - 2, gx + 50, base + 1, (g, p, lit, ox) => millGate(g, p, gx + ox, base));
    x += 48;
  }
}

function millMidGround(c, y, lx) {
  if (y < 34) return null;
  if (y === 34) return bayer(lx, y) < 8 ? 'grayLight' : 'gray';
  return hash2(lx >> 1, y) < 0.25 ? 'grayDark' : hash2(lx, y + 3) < 0.12 ? 'tan' : 'gray';
}
