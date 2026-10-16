'use strict';
// js/06-landscapes/slum-foreground.js
// Defines: slumFg, slumMidGround, slumFgGround

function slumFg(ctx) {
  const { rng, L } = ctx, yardEnd = STATIONS[1].dist + 400 * SCALE;
  for (let x = ctx.from; x < ctx.to; ) {                 // the boundary wall, in runs with breaks where it has fallen
    const len = randInt(rng, 24, 70), gap = rng() < 0.5 ? randInt(rng, 5, 16) : 0, tx = x, seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx + (len >> 1))) ctx.stat(tx, tx + len, 20, (g, p, lit, ox) => brickWall(g, p, tx + ox, len, 20, seed));
    x += len + gap;
  }
  for (let x = ctx.from + randInt(rng, 0, 200); x < ctx.to; ) {      // cycle rickshaws and people pushing bicycles along the lane
    const len = randInt(rng, 220, 480), a = x;
    if (ctx.ok(a + (len >> 1))) {
      for (let n = randInt(rng, 1, 2); n > 0; n--) ctx.live(rng() < 0.55 ? rickshawEnt(a, a + len, 17, rng, rng() < 0.4) : walkerEnt(a, a + len, 17, rng));
    }
    x += len + randInt(rng, 40, 200);
  }
  for (let x = ctx.from + randInt(rng, 20, 90); x < ctx.to; x += randInt(rng, 40, 110)) {     // dark weeds beside the ballast
    const tx = x, y = randInt(rng, 13, 14), blades = Array.from({ length: randInt(rng, 3, 6) }, () => [randInt(rng, -2, 2), randInt(rng, 2, 4), rng() < 0.5]);
    if (ctx.ok(tx)) ctx.stat(tx - 3, tx + 3, y, (g, p, lit, ox) => { for (const [dx, bh, dark] of blades) for (let k = 0; k < bh; k++) px(g, tx + ox + dx, y - k, dark ? p.greenDeep : p.greenDark); });
  }
  for (let x = ctx.from + randInt(rng, 30, 120); x < ctx.to; x += randInt(rng, 110, 230)) {   // the yard's leftovers, until the lines end at Dewanhat
    const tx = x, kind = randInt(rng, 0, 2);
    if (ctx.ok(tx) && uOf(L, tx) < yardEnd) ctx.stat(tx, tx + 17, 20, (g, p, lit, ox) => (kind === 0 ? sleeperPile : kind === 1 ? signalBox : cableCoil)(g, p, tx + ox, 20));
  }
}

function slumMidGround(c, y, lx) {
  if (y < 34) return null;
  if (y === 34) return bayer(lx, y) < 8 ? 'brown' : 'brownDark';
  return hash2(lx >> 1, y) < 0.22 ? 'brownDark' : hash2(lx, y + 5) < 0.14 ? 'tan' : 'brown';
}

function slumFgGround(c, y, lx) {                        // rows 12..20 are what shows between the track and the extra line
  if (y < 12) return null;
  if (y === 12) return bayer(lx, y) < 9 ? 'gray' : 'grayDark';
  if (y === 13) {                                        // dark trackside dirt, litter and weeds
    const k = hash2(lx, 13);
    return k < 0.06 ? 'white' : k < 0.09 ? 'blue' : k < 0.12 ? 'red' : k < 0.3 ? 'greenDark' : k < 0.6 ? 'brownDark' : 'ink';
  }
  if (y === 14) return hash2(lx >> 1, 14) < 0.5 ? 'grayLight' : 'gray';                        // concrete lip of the open drain
  if (y === 15) return lx % 24 < 3 ? 'grayLight' : hash2(lx >> 2, 15) < 0.08 ? 'indigo' : 'ink';   // the drain itself, with a cover slab now and then
  if (y === 16) return 'gray';
  if (y <= 17) return hash2(lx, y) < 0.07 ? 'cream' : hash2(lx >> 1, y) < 0.3 ? 'brown' : 'tan';  // the narrow dirt lane
  if (y <= 20) { const k = hash2(lx, y); return k < 0.07 ? 'white' : k < 0.1 ? 'red' : k < 0.13 ? 'blue' : k < 0.3 ? 'greenDark' : 'brownDark'; }   // where the wall has fallen: rubble and weeds
  if (hash2(lx >> 3, y >> 2) < 0.04) return 'skyMid';
  const k = hash2(lx, y + 9);
  return k < 0.04 ? 'white' : k < 0.07 ? 'red' : hash2(lx >> 1, y) < 0.24 ? 'brownDark' : k < 0.2 ? 'tan' : 'brown';
}
