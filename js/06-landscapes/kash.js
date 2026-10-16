'use strict';
// js/06-landscapes/kash.js
// Defines: thinCount, thinOut, kashMid, kashMidGround, kashFg

// --- 3. kash phool chars -----------------------------------------------------
// Every other plant is skipped on low quality (the densest thing on screen)
let thinCount = 0;
const thinOut = e => { if (++thinCount & 1) e.lod = true; return e; };
function kashMid(ctx) {
  const { rng, L } = ctx;
  for (let row = 0; row < 2; row++)
    for (let x = ctx.from + randInt(rng, 0, 6); x < ctx.to; x += randInt(rng, 5, 11)) {
      const y = 34 + row * 3 + randInt(rng, 0, 1), h = randInt(rng, 9, 13), v = randInt(rng, 0, 2);
      if (ctx.ok(x)) ctx.live(thinOut(swayer(L, x, y, 'kash', h, v)));
    }
}

// The dense field seen from afar: a fuzz of plumes over the sand
function kashMidGround(top, y, lx) {
  if (y < top) return null;
  if (y < 34) return bayer(lx, y) < 9 ? 'cloudShade' : y > 31 ? 'tan' : null;
  if (y < 38) return bayer(lx, y) < 5 ? 'grass' : 'tan';
  return hash2(lx, y) < 0.3 ? 'tan' : 'cream';
}

function kashFg(ctx) {
  const { rng, L } = ctx;
  // nearer rows stand taller; the back row only just reaches the ballast
  for (const [base, hMin, hMax] of [[17, 8, 11], [22, 9, 13], [27, 10, 14], [32, 11, 16]])
    for (let x = ctx.from + randInt(rng, 0, 6); x < ctx.to; x += randInt(rng, 5, 10)) {
      const y = base + randInt(rng, -1, 1), h = randInt(rng, hMin, hMax), v = randInt(rng, 0, 2);
      if (ctx.ok(x)) ctx.live(thinOut(swayer(L, x, y, 'kash', h, v)));
    }
}
