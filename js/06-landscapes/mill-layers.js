'use strict';
// js/06-landscapes/mill-layers.js
// Defines: softBlock, millFar, millTall, millMid, millMidGround

// A silhouette whose top edge dissolves into the haze: solid below, dithered thinner in the top rows
function softBlock(g, x, top, w, h, col) {
  rect(g, x, top + 4, w, h - 4, col);
  for (let k = 0; k < 4; k++) ditherRect(g, x, top + k, w, 1, col, 3 + k * 3);
}

function millFar(ctx) {                                  // the mill works in the smog: roofs and chimneys with no hard edges
  const { rng } = ctx, base = 52;
  for (let rank = 0; rank < 2; rank++)
    for (let x = ctx.from; x < ctx.to; ) {
      const w = randInt(rng, 20, 46), h = (rank ? randInt(rng, 8, 14) : randInt(rng, 12, 22)), tx = x;
      if (ctx.ok(tx)) ctx.stat(tx, tx + w, rank, (g, p, lit, ox) => {
        softBlock(g, tx + ox, base - h, w, h, p.haze);
        for (let k = 0; k < w; k += 7) { rect(g, tx + ox + k, base - h - 3, 4, 3, p.haze); ditherRect(g, tx + ox + k, base - h - 3, 4, 3, p.skyMid, 8); }   // faint sawtooth edge
      });
      x += w + randInt(rng, 0, 8);
    }
  for (let x = ctx.from + randInt(rng, 20, 60); x < ctx.to; x += randInt(rng, 60, 110)) {      // distant chimneys, each trailing a smear of smoke
    const h = randInt(rng, 32, 48), tx = x;
    if (ctx.ok(tx)) ctx.stat(tx - 2, tx + 24, 2, (g, p, lit, ox) => {
      rect(g, tx + ox - 1, base - h + 4, 3, h - 4, p.haze); ditherRect(g, tx + ox - 1, base - h, 3, 4, p.haze, 5);
      ditherRect(g, tx + ox + 1, base - h - 10, 22, 10, p.cloudShade, 3); ditherRect(g, tx + ox + 5, base - h - 6, 18, 8, p.slate, 2);
    });
  }
  for (let x = ctx.from; x < ctx.to; x += 64) { const tx = x; ctx.stat(tx, tx + 66, 8, (g, p, lit, ox) => smogBand(g, p, tx + ox, 66, base)); }   // the smog itself
  treeLine(ctx);
  return { from: ctx.from, to: ctx.to };
}

// The 'tall' layer shares the mid layer's columns but spans the whole screen height, so the chimneys can
// tower into the sky. Chimney feet stand where the mid layer's ground is (screen y 122)
function millTall(ctx) {
  const { rng } = ctx, base = 122;
  for (let x = ctx.from + randInt(rng, 20, 80); x < ctx.to; x += randInt(rng, 150, 270)) {
    const h = randInt(rng, 74, 100), tx = x, phase = rng();
    if (ctx.ok(tx)) {
      ctx.stat(tx - 8, tx + 9, 0, (g, p, lit, ox) => millChimney(g, p, tx + ox, base, h));
      ctx.live(millSmoke(tx, base - h - 4, phase));
    }
  }
}

function millMid(ctx) {
  const { rng } = ctx, G = 34;
  for (let x = ctx.from + randInt(rng, 6, 30); x < ctx.to; ) {          // the works: sprawling sheds, water towers breaking up the roofline
    const kind = rng(), tx = x;
    if (kind < 0.8) {
      const w = randInt(rng, 90, 170), h = randInt(rng, 20, 26), base = G + 3 + randInt(rng, 0, 3), seed = randInt(rng, 1, 1e6);
      if (ctx.ok(tx + (w >> 1))) ctx.stat(tx, tx + w, base, (g, p, lit, ox) => millShed(g, p, lit, tx + ox, base, w, h, seed));
      x += w + randInt(rng, 0, 6);
    } else {
      const base = G + 4;
      if (ctx.ok(tx)) ctx.stat(tx - 9, tx + 10, base, (g, p, lit, ox) => millTower(g, p, tx + ox, base));
      x += randInt(rng, 24, 36);
    }
  }
  const base = G + 13, gateX = ctx.from + Math.round((ctx.to - ctx.from) * 0.42);
  for (let bx = ctx.from + randInt(rng, 6, 20); bx < ctx.to; bx += randInt(rng, 34, 60)) {   // organised stacks of jute bales, tall enough to be seen over the wall
    const cols = randInt(rng, 5, 8), rows = randInt(rng, 6, 9), bb = base - 1;
    if (bx > gateX - 6 && bx < gateX + MILL_GATE_W + 4) continue;
    if (ctx.ok(bx)) ctx.stat(bx, bx + cols * 6 + 3, bb, (g, p, lit, ox) => millBales(g, p, bx + ox, bb, cols, rows));
  }
  let gated = false;
  for (let x = ctx.from; x < ctx.to; ) {                                 // the boundary wall, continuous, with one gate
    if (!gated && x >= gateX) {
      const gx = x; gated = true;
      if (ctx.ok(gx + 40)) ctx.stat(gx - 2, gx + MILL_GATE_W + 2, base + 1, (g, p, lit, ox) => millGate(g, p, lit, gx + ox, base));
      x += MILL_GATE_W; continue;
    }
    const tx = x, len = 56;
    if (ctx.ok(tx + 28)) ctx.stat(tx, tx + len, base + 1, (g, p, lit, ox) => millWall(g, p, tx + ox, tx + ox + len, base));
    x += len;
  }
  return { from: ctx.from, to: ctx.to };
}

function millMidGround(c, y, lx) {
  if (y < 34) return null;
  if (y === 34) return bayer(lx, y) < 8 ? 'grayLight' : 'gray';
  return hash2(lx >> 1, y) < 0.25 ? 'grayDark' : hash2(lx, y + 3) < 0.12 ? 'tan' : 'gray';
}
