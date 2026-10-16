'use strict';
// js/06-landscapes/slum-details.js
// Defines: clotheslineEnt, slumBillboard

// Colourful washing strung across a roof, fluttering in the wind (drawn live)
function clotheslineEnt(x0, x1, y, base, rng) {
  const cols = ['red', 'white', 'blue', 'paddy', 'skyMid', 'rose'], n = Math.max(2, (x1 - x0 - 4) >> 2), ph = rng() * 6;
  const picks = Array.from({ length: n }, () => pick(rng, cols));
  return { x0, x1, z: base + 1, draw(g, v, ox, oy, t) {
    const yy = y + oy;
    g.fillStyle = v.p.grayDark; g.fillRect(x0 + ox, yy, x1 - x0, 1);
    for (let i = 0; i < n; i++) {
      const f = Math.sin(t * 3 + i * 1.3 + ph + windAt(x0 + i * 4, t) * 2) > 0.2 ? 1 : 0, x = x0 + 3 + i * 4 + ox;
      g.fillStyle = v.p[picks[i]]; g.fillRect(x + f, yy + 1, 2, 1); g.fillRect(x + f, yy + 2, 1, 1 + f);
    }
  } };
}

function slumBillboard(g, p, x, top, bw, bh, base) {     // the silhouette of a tall billboard frame
  rect(g, x + 2, top + bh, 2, base - top - bh, p.haze); rect(g, x + bw - 4, top + bh, 2, base - top - bh, p.haze);
  rect(g, x, top, bw, 1, p.haze); rect(g, x, top + bh - 1, bw, 1, p.haze); rect(g, x, top, 1, bh, p.haze); rect(g, x + bw - 1, top, 1, bh, p.haze);
  ditherRect(g, x + 1, top + 1, bw - 2, bh - 2, p.skyMid, 5);
  for (let k = 0; k < bw - 2; k += 6) cabLine(g, x + 1 + k, top + 1, x + 4 + k, top + bh - 2, p.haze);   // braces
}
