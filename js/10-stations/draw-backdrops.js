'use strict';
// js/10-stations/draw-backdrops.js
// Defines: drawBackdrops

function drawBackdrops(g, v, layer) {
  const f = PARALLAX[layer];
  for (const st of STATIONS)
    for (const key of st.backdrop) {
      const b = BACKDROPS[key];
      if (b.layer !== layer) continue;
      const spr = v.backdrops[key];
      const x = b.sx + Math.floor(st.dist * f) - Math.floor(sim.dist * f);   // same stepping as the tiles
      if (x < W && x + spr.width > 0) g.drawImage(spr, x, b.y);
    }
}
