'use strict';
// js/06-landscapes/slum-lane.js
// Defines: brickWall, sleeperPile, signalBox, cableCoil, walkerEnt

// --- right beside the tracks: a decaying brick boundary wall, a narrow dirt lane, an open drain
function brickWall(g, p, x, len, base, seed) {           // low, crumbling, missing bricks
  const rng = mulberry32(seed);
  for (let i = 0; i < len; i++) {
    const h = rng() < 0.12 ? 1 : rng() < 0.3 ? 2 : 3;
    for (let j = 0; j < h; j++) px(g, x + i, base - j, (i + (j & 1) * 2) % 4 === 3 ? p.brown : rng() < 0.15 ? p.tan : p.rust);
    if (h === 3 && rng() < 0.06) px(g, x + i, base - 1, p.ink);                           // a brick gone
  }
  rect(g, x, base - 3, 2, 4, p.brown); rect(g, x + len - 2, base - 3, 2, 4, p.brown);
}
function sleeperPile(g, p, x, base) {                    // discarded wooden sleepers
  for (let r = 0; r < 3; r++) { rect(g, x + r, base - 2 - r * 2, 9 - r, 2, r & 1 ? p.brown : p.brownDark); px(g, x + r, base - 2 - r * 2, p.tan); }
}
function signalBox(g, p, x, base) {                      // a rusty signal box on short legs, cable trailing
  rect(g, x, base - 8, 8, 6, p.rust); rect(g, x, base - 8, 8, 1, p.brown); rect(g, x + 1, base - 7, 3, 4, p.brownDark); px(g, x + 6, base - 6, p.amber);
  rect(g, x + 1, base - 2, 1, 2, p.grayDark); rect(g, x + 6, base - 2, 1, 2, p.grayDark);
  for (let k = 0; k < 8; k++) px(g, x + 8 + k, base - 1 - (k % 3 === 0 ? 1 : 0), p.ink);
}
function cableCoil(g, p, x, base) {                      // a coil of old cable
  for (const r of [4, 3, 2]) for (let a = 0; a < 16; a++)
    px(g, x + 4 + Math.round(Math.cos(a * Math.PI / 8) * r), base - 3 + Math.round(Math.sin(a * Math.PI / 8) * r * 0.6), r === 3 ? p.grayDark : p.ink);
}
function walkerEnt(a, b, y, rng) {                       // a man pushing his bicycle along the lane, right beside the train
  const len = b - a - 16, ph = rng() * len * 2, sp = 3 + rng() * 3, shirt = pick(rng, SHIRTS), lungi = pick(rng, LUNGIS)[0], skin = pick(rng, SKINS);
  return { x0: a, x1: b, z: y, draw(g, v, ox, oy, t) {
    const s = (t * sp + ph) % (2 * len), fwd = s < len, step = Math.floor(t * 3) & 1;
    mpAt(g, v.p, Math.round(a + 8 + (fwd ? s : 2 * len - s)) + ox, y + oy, fwd ? 1 : -1);
    mpRect(0, -12, 2, 1, 'ink'); mpRect(0, -11, 2, 1, skin); mpRect(0, -10, 2, 3, shirt); mpRect(0, -7, 2, 3, lungi);
    mp(step, -4, skin); mp(1 - step, -4, skin); mp(2, -8, skin);
    cycleWheel(5, -2, step); cycleWheel(12, -2, step);
    mpRect(6, -4, 6, 1, 'grayDark'); mp(8, -5, 'grayDark'); mpRect(11, -7, 1, 3, 'grayDark'); mp(12, -8, 'grayDark');
  } };
}
