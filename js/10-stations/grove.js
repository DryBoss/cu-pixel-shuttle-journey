'use strict';
// js/10-stations/grove.js
// Defines: GROVE_FRONT, groveMid, drawGrove

// The rural greenery choking the ground around a village halt (Choudhury Hat): swaying coconut palms,
// clumps of bamboo and broad-leafed banana plants, all animated with the same wind as the landscape.
// Screen x is where the plant stands while the train is at the halt; y is its foot on the ground.
const GROVE_FRONT = [
  // beyond the rear of the train
  ['coco', -34, 154, 24, 0], ['bananaBig', -46, 157, 12, 0], ['bamboo', -20, 157, 17, 4], ['coco', -8, 156, 21, -1],
  ['bananaBig', 3, 158, 12, 0], ['coco', 9, 154, 24, 1], ['bamboo', 17, 157, 16, 4],
  // beyond the front of the train
  ['bamboo', 284, 157, 18, 4], ['bananaBig', 278, 157, 12, 0], ['coco', 296, 154, 25, 1], ['bamboo', 312, 158, 15, 3], ['coco', 322, 156, 20, -1], ['bananaBig', 332, 157, 13, 0],
  // leaning over the waiting area at both ends of the shelter
  ['bananaBig', 180, 158, 11, 0], ['bananaBig', 268, 158, 12, 0],
];

// Plants standing right in front of the station: built once per station, drawn between the ground and the people
function drawGrove(g, v, st, off) {
  if (!st.groveEnts) st.groveEnts = GROVE_FRONT.map(([kind, x, y, a, b]) => swayer(TL.mid, x + Math.round(st.dist * TL.mid.f), y, kind, a, b));
  const shift = off - Math.round(st.dist * TL.mid.f);
  for (const e of st.groveEnts) if (e.x1 + shift > -4 && e.x0 + shift < W + 4) e.draw(g, v, shift, 0, sim.clock);
}

// And a dense wall of it in the mid layer behind the train, so palms and bamboo rise over the roofs of the carriages
function groveMid(L, st) {
  const rng = mulberry32(6000 + st.index * 31), G = 34;
  for (let X = -70; X < 400; X += randInt(rng, 9, 17)) {
    const lx = Math.round(st.dist * L.f) + X, base = G + 2 + randInt(rng, 0, 12), r = rng();
    if (r < 0.42) L.live.push(swayer(L, lx, base, 'coco', randInt(rng, 18, 28), randInt(rng, -2, 2)));
    else if (r < 0.72) L.live.push(swayer(L, lx, base, 'bamboo', randInt(rng, 14, 22), randInt(rng, 3, 5)));
    else if (r < 0.92) L.live.push(swayer(L, lx, base, 'bananaBig', randInt(rng, 10, 14), 0));
    else L.live.push(swayer(L, lx, base, 'fern'));
  }
}
