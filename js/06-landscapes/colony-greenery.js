'use strict';
// js/06-landscapes/colony-greenery.js
// Defines: brokenWall, vineGrowth, rubble

// The inner city's boundary wall, now broken and intermittent: low, crumbling ends, bricks missing.
// ruin 0..1: how much of it has fallen
function brokenWall(g, p, x, len, base, seed, ruin) {
  const rng = mulberry32(seed);
  for (let i = 0; i < len; i++) {
    const edge = Math.min(i, len - 1 - i);
    let h = rng() < 0.1 + 0.25 * ruin ? 1 : rng() < 0.3 ? 2 : 3;
    if (edge < 4 && rng() < 1 - edge * 0.22) h = Math.min(h, rng() < 0.4 ? 2 : 1);              // the ends crumble away
    for (let j = 0; j < h; j++) px(g, x + i, base - j, (i + (j & 1) * 2) % 4 === 3 ? p.brown : rng() < 0.15 ? p.tan : p.rust);
    if (h === 3 && rng() < 0.08) px(g, x + i, base - 1, p.ink);                                  // a brick gone
  }
}

// Creepers overrunning a wall: a leafy mass on top, tendrils hanging down the face, a few flowers
function vineGrowth(g, p, x, len, base, seed, dens) {
  const rng = mulberry32(seed), leaf = [p.greenDeep, p.greenDark, p.green, p.grass];
  for (let i = 0; i < len + 4; i++) {
    if (rng() > dens) continue;
    const xx = x - 2 + i, h = randInt(rng, 1, 4);
    for (let j = 0; j < h; j++) px(g, xx + (rng() < 0.3 ? 1 : 0), base - 2 - j, leaf[randInt(rng, 0, 3)]);
    if (rng() < 0.3) { const dl = randInt(rng, 2, 4); for (let j = 0; j < dl; j++) px(g, xx, base - 1 + j, j === dl - 1 ? p.grass : p.greenDark); }
    if (rng() < 0.05) px(g, xx, base - 2 - h, rng() < 0.5 ? p.white : p.rose);
  }
}

// Where the wall has fallen: a scatter of bricks and a stump or two
function rubble(g, p, x, len, base, seed) {
  const rng = mulberry32(seed);
  for (let n = 0; n < len / 2; n++) px(g, x + randInt(rng, 0, len - 1), base - randInt(rng, 0, 1) + randInt(rng, 0, 1), rng() < 0.5 ? p.rust : rng() < 0.5 ? p.brown : p.red);
  for (let n = randInt(rng, 1, 2); n > 0; n--) { const sx = x + randInt(rng, 0, len - 4); rect(g, sx, base - 1, 3, 2, p.rust); px(g, sx, base - 1, p.brown); }
}
