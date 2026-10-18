'use strict';
// js/07-entities/cow.js
// Defines: COW_LEGS, cowEnt

// A zebu grazing: head down, chewing, now and then looking up; tail swishes
const COW_LEGS = [-4, -2, 2, 3];
function cowEnt(lx, y, rng) {
  const ph = rng() * 20, dir = rng() < 0.5 ? 1 : -1;
  const [c0, c1] = pick(rng, [['white', 'cloudShade'], ['tan', 'brown'], ['brown', 'brownDark'], ['white', 'grayDark']]);
  return { x0: lx - 9, x1: lx + 9, z: y, draw(g, v, ox, oy, t) {
    mpAt(g, v.p, lx + ox, y + oy, dir);
    mpRect(-4, -6, 8, 4, c0);
    mpRect(-3, -3, 6, 1, c1);
    mp(-2, -5, c1); mp(-1, -5, c1); mp(1, -6, c1);                            // patches
    mp(2, -7, c0); mp(3, -7, c0);                                            // hump
    for (let i = 0; i < 4; i++) mpRect(COW_LEGS[i], -2, 1, 2, c1);           // legs
    const passing = sim.speed > 6 && Math.abs(lx + ox - 160) < 110;          // the train is going by: heads come up
    if (passing || Math.sin(t * 0.35 + ph) > 0.6) {                          // looking up
      mpRect(4, -7, 2, 2, c0); mp(6, -6, c0); mp(4, -8, c1); mp(5, -8, 'cream');
    } else {                                                                 // grazing, chewing
      const chew = Math.floor(t * 2 + ph) & 1;
      mp(4, -4, c0); mp(5, -4 + chew, c0); mp(4, -3 + chew, c0); mp(5, -2 + chew, c0); mp(5, -1 + chew, 'ink');
    }
    const swish = Math.floor(t * 3 + ph) % 7 === 0;
    mp(-5, -6, c1); mp(swish ? -6 : -5, -5, c1); mp(swish ? -7 : -5, -4, 'ink');
  } };
}
