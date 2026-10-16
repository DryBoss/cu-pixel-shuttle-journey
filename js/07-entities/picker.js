'use strict';
// js/07-entities/picker.js
// Defines: pickerEnt

// Tea picker with a basket on her back, working slowly along a row and
// stooping now and then to pluck the leaves
function pickerEnt(H, i, d, rng) {
  const ph = rng() * 20, cloth = pick(rng, SARIS)[0], skin = pick(rng, SKINS), range = 8;
  return { x0: H.x0 + i - range - 3, x1: H.x0 + i + range + 3, z: 50, draw(g, v, ox, oy, t) {
    const a = t * 0.06 + ph, j = Math.round(i + Math.sin(a) * range);
    mpAt(g, v.p, H.x0 + j + ox, humpTop(j, H.w, H.h, 36) + d + oy, Math.cos(a) >= 0 ? 1 : -1);
    mpRect(0, -3, 1, 3, cloth);
    mp(-1, -5, 'tan'); mp(-1, -4, 'tan');                                    // basket
    if (Math.sin(t * 0.7 + ph * 3) > 0.2) { mp(1, -4, cloth); mp(2, -4, skin); mp(2, -3, skin); mp(0, -5, 'brown'); }
    else { mp(0, -4, cloth); mp(0, -5, skin); mp(0, -6, cloth); mp(1, -3, skin); mp(-1, -3, 'brown'); }
  } };
}
