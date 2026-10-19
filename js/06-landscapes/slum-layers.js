'use strict';
// js/06-landscapes/slum-layers.js
// Defines: slumFar, slumMid

function slumFar(ctx) {                                  // the city haze: a jagged, continuous skyline of packed blocks
  const { rng } = ctx, base = 52;
  for (let rank = 0; rank < 2; rank++)                   // the far rank is washed out in the smog, the near one darker
    for (let x = ctx.from; x < ctx.to; ) {
      const w = randInt(rng, 4, 12), tall = rng() < 0.08, h = (rank ? randInt(rng, 8, 22) : randInt(rng, 12, 34)) + (tall ? 8 : 0), tx = x;
      const tank = w > 6 && rng() < 0.25;
      if (ctx.ok(tx)) ctx.stat(tx, tx + w, rank, (g, p, lit, ox) => {
        rect(g, tx + ox, base - h, w, h, p.haze);
        if (!rank) ditherRect(g, tx + ox, base - h, w, h, p.skyMid, 6);
        else if (h > 10) ditherRect(g, tx + ox + 1, base - h + 2, w - 2, h - 3, p.slate, 3);
        if (tank) rect(g, tx + ox + 1, base - h - 2, 3, 2, p.haze);
      });
      x += w;                                            // no gaps
    }
  for (let x = ctx.from + randInt(rng, 30, 90); x < ctx.to; x += randInt(rng, 140, 260)) {      // billboards
    const bw = randInt(rng, 16, 24), bh = randInt(rng, 8, 11), top = randInt(rng, 6, 14), tx = x;
    if (ctx.ok(tx)) ctx.stat(tx, tx + bw, 3, (g, p, lit, ox) => slumBillboard(g, p, tx + ox, top, bw, bh, base));
  }
}

function slumMid(ctx, dense) {                           // dense: three ranks, shoulder to shoulder with no gaps
  const { rng, L } = ctx, G = 34;
  for (let row = 0; row < (dense ? 3 : 2); row++)
    for (let x = ctx.from + randInt(rng, 0, 8); x < ctx.to; ) {
      const base = G + 2 + (row === 0 ? randInt(rng, 0, 2) : row === 1 ? randInt(rng, 5, 8) : randInt(rng, 11, 14)), kind = rng(), tx = x, seed = randInt(rng, 1, 1e6);
      let w;
      if (kind < (dense ? 0.38 : 0.55)) {                // makeshift shack
        w = randInt(rng, 8, 14);
        const h = randInt(rng, 6, 9), lamp = rng() < 0.5;
        if (ctx.ok(tx)) ctx.stat(tx - 1, tx + w + 1, base, (g, p, lit, ox) => slumShack(g, p, lit, tx + ox, base, w, h, lamp, seed));
      } else if (kind < (dense ? 0.96 : 0.82)) {         // concrete block, one to three floors
        w = dense ? randInt(rng, 14, 26) : randInt(rng, 12, 22);
        const floors = row === 0 ? randInt(rng, 2, 3) : randInt(rng, 1, 3), tone = randInt(rng, 0, 2);
        const lamps = Array.from({ length: floors * 6 }, () => rng() < 0.45), tank = rng() < 0.5, ant = rng() < 0.5;
        if (ctx.ok(tx)) {
          ctx.stat(tx - 1, tx + w + 1, base, (g, p, lit, ox) => slumBlock(g, p, lit, tx + ox, base, w, floors, tone, lamps, tank, ant, seed));
          if (rng() < 0.45) ctx.live(clotheslineEnt(tx + 1, tx + w - 1, base - (floors * 7 + 2) - 4, base, rng));
        }
      } else if (!dense && kind < 0.93) {                // bamboo-and-tin house
        w = randInt(rng, 10, 16);
        const tin = rng() < 0.85, on = rng() < 0.6;
        if (ctx.ok(tx)) ctx.stat(tx - 2, tx + w + 3, base, (g, p, lit, ox) => house(g, tx + ox, base, w, p, tin, lit && on, 0));
      } else {                                           // a palm or banana between the roofs
        w = 6;
        const palm = rng() < 0.5, h = randInt(rng, 13, 19), lean = randInt(rng, -2, 2);
        if (ctx.ok(tx)) ctx.live(palm ? swayer(L, tx + 3, base, 'coco', h, lean) : swayer(L, tx + 3, base, 'banana'));
      }
      x += w + (dense ? 0 : randInt(rng, -1, 3));
    }
}
