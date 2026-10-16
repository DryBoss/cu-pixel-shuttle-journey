'use strict';
// js/06-landscapes/river.js
// Defines: riverWater, riverMid, bankRows, riverFgGround, riverFg

function riverWater(lx, y, deep) {
  return hash2(lx >> 2, y) < 0.1 ? 'skyLight' : y > deep && bayer(lx, y) < 3 ? 'skyDeep' : 'skyMid';
}

function riverMid(ctx) {
  const { rng } = ctx, dashes = [];
  for (let x = ctx.from + randInt(rng, 30, 90); x < ctx.to; x += randInt(rng, 90, 200)) {
    const r = rng(), wl = randInt(rng, 29, 33);           // waterline just above the carriage roofs
    if (!ctx.ok(x)) continue;
    ctx.live(r < 0.6 ? noukaEnt(x, wl, rng, r < 0.4 ? 'sail' : 'hood') : fisherEnt(x, wl, rng, false));
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 3, 8))
    if (ctx.ok(x)) dashes.push([x, randInt(rng, 35, 78), randInt(rng, 2, 6), rng() * 6, 1 + rng() * 2]);
  chunkedShimmer(ctx, dashes, 0);
}

// Rows of riverbank left beside the track: 5 on land, sloping away to none
// over the last 60 px before each abutment
function bankRows(u) {
  const out = Math.max(BRIDGE.u0 - u, u - BRIDGE.u1, 0);
  return Math.min(5, Math.round(out / 12));
}

function riverFgGround(bank, y, lx) {
  if (y < 12) return null;
  if (y < 12 + bank) return y === 12 ? (bayer(lx, y) < 10 ? 'grass' : 'green')
                          : y === 11 + bank ? (bayer(lx, y) < 8 ? 'tan' : 'cream') : 'green';
  if (y < 15) return null;                      // under the deck: the river further back shows through
  return hash2(lx >> 3, y) < 0.08 ? 'skyLight' : y > 24 && bayer(lx, y) < y - 24 ? 'skyDeep' : 'skyMid';
}

function riverFg(ctx) {
  const { rng, L } = ctx, dashes = [];
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 2, 6))
    if (ctx.ok(x)) dashes.push([x, randInt(rng, 18, 33), randInt(rng, 2, 7), rng() * 6, 0.8 + rng() * 2.2]);
  chunkedShimmer(ctx, dashes, 0, ['skyLight', 'white']);
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 30, 90))
    if (ctx.ok(x)) ctx.live(hyacinthEnt(x, randInt(rng, 19, 32), rng));
  for (let x = ctx.from + randInt(rng, 100, 300); x < ctx.to; x += randInt(rng, 380, 700))
    if (ctx.ok(x)) ctx.live(fisherEnt(x, randInt(rng, 28, 31), rng, true));
  const onBank = { ...ctx, ok: x => ctx.ok(x) && bankRows(uOf(L, x)) >= 4 };
  addTufts(onBank, 9, 13, 15);
}
