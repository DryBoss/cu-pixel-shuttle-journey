'use strict';
// js/06-landscapes/colony-people.js
// Defines: pedestrianEnt

// Someone walking along beside the rails as if the line were the local footpath: in a lungi or in
// trousers and a shirt, sometimes with a bag, turning round at the ends of their stretch
function pedestrianEnt(a, b, y, rng) {
  const len = b - a - 16, ph = rng() * len * 2, sp = 4 + rng() * 3;
  const lungi = rng() < 0.5, shirt = pick(rng, SHIRTS), cloth = pick(rng, LUNGIS)[0], trouser = pick(rng, TROUSERS);
  const skin = pick(rng, SKINS), hair = rng() < 0.85 ? 'ink' : 'brownDark', bag = rng() < 0.4 ? pick(rng, BAGS) : null;
  return { x0: a, x1: b, z: y, draw(g, v, ox, oy, t) {
    const s = (t * sp + ph) % (2 * len), fwd = s < len, step = Math.floor(t * 4) & 1;
    mpAt(g, v.p, Math.round(a + 8 + (fwd ? s : 2 * len - s)) + ox, y + oy, fwd ? 1 : -1);
    mpRect(0, -12, 2, 1, hair); mpRect(0, -11, 2, 1, skin); mpRect(0, -10, 2, 3, shirt);
    if (lungi) { mpRect(0, -7, 2, 3, cloth); mp(step, -4, skin); mp(1 - step, -4, skin); }
    else { mpRect(0, -7, 2, 2, trouser); mp(step, -5, trouser); mp(1 - step, -5, trouser); mp(step, -4, 'ink'); mp(1 - step, -4, 'ink'); }
    mp(step ? 2 : -1, -8, skin);                                                                       // swinging arm
    if (bag) { mp(step ? -1 : 2, -8, bag); mp(step ? -1 : 2, -7, bag); }
  } };
}
