'use strict';
// js/14-atmosphere/overcast.js
// Defines: overcastLayer, drawOvercast

// Monsoon sky: a heavy, lumpy blanket of grey cloud over the whole upper picture.
// Two tileable layers drift at different speeds; fades in with weather.level.
function overcastLayer(v, key, seed, base) {
  return cached(v, key, 256, 112, (g, p) => {
    const [r, gr, b] = hexToRgb(p.cloudShade), dark = `rgb(${r * 0.66 | 0},${gr * 0.66 | 0},${b * 0.7 | 0})`, rng = mulberry32(seed * 101);
    const puffs = [];
    for (let x = -8; x < 256; x += 9 + (rng() * 8 | 0)) puffs.push([x, base - 6 + (rng() * 10 | 0), 8 + (rng() * 9 | 0)]);
    wrapX(256, o => {
      rect(g, o, 0, 256, base - 10, p.cloudShade);                                   // the solid roof of the storm
      for (const [x, y, rad] of puffs) disc(g, x + o, y + 3, rad, dark);             // dark, heavy underside ...
      for (const [x, y, rad] of puffs) disc(g, x + o, y, rad, p.cloudShade);         // ... under rounded grey lumps
    });
    for (let i = 0; i < 90; i++) {                                                   // pale streaks and mottling in the grey
      const x = rng() * 256 | 0, y = 2 + (rng() * (base - 14) | 0), w = 4 + (rng() * 14 | 0);
      wrapX(256, o => rect(g, x + o, y, w, 1, bayer(x, y) < 8 ? p.white : dark));
    }
  });
}

function drawOvercast(g, v) {
  const L = weather.level;
  if (L < 0.02) return;
  const t = sim.clock, d = sim.dist;
  g.globalAlpha = Math.min(1, L * 1.15);
  drawTiled(g, overcastLayer(v, 'overcastB', 2, 58), d * 0.03 + t * 2.5, 0);          // far, lower layer
  g.globalAlpha = Math.min(1, L * 1.25);
  drawTiled(g, overcastLayer(v, 'overcastA', 5, 46), d * 0.06 + t * 5, -14);          // near, heavier layer
  g.globalAlpha = 1;
}
