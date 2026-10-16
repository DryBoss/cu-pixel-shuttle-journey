'use strict';
// js/04-world/humps.js
// Defines: humpTop, hump

// Bell-shaped hill: top row of column i, and the filled silhouette
const humpTop = (i, w, h, base) => base - Math.round(h * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / w)));

function hump(g, x, base, w, h, col, ridge, tint) {
  for (let i = 0; i < w; i++) {
    const t = humpTop(i, w, h, base);
    if (t >= base) continue;
    rect(g, x + i, t, 1, base - t, col);
    if (tint) for (let y = t; y < Math.min(base, t + 6); y++) if (bayer(x + i, y) < 7 - (y - t)) px(g, x + i, y, tint);
    if (ridge && bayer(x + i, t) < 10) px(g, x + i, t, ridge);
  }
}
