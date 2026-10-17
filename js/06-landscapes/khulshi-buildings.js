'use strict';
// js/06-landscapes/khulshi-buildings.js
// Defines: residenceBlock, farResidence

// A multi-storey residential block of the Khulshi hill societies: flat roof, parapet, water tank,
// and a balcony with a railing and a window on every floor
function residenceBlock(g, p, lit, x, base, w, floors, seed) {
  const rng = mulberry32(seed), fh = 7, h = floors * fh + 3, top = base - h, tone = [p.cream, p.peach, p.cloudShade, p.white][seed % 4];
  rect(g, x, top, w, h, tone);
  ditherRect(g, x, top, w, h, p.tan, 3);
  ditherRect(g, x + w - 3, top, 3, h, p.grayDark, 5);
  rect(g, x - 1, top - 2, w + 2, 2, p.white); rect(g, x - 1, top, w + 2, 1, p.cloudShade);
  for (let f = 0; f < floors; f++) {
    const y = top + 2 + f * fh;
    for (let bx = x + 2; bx + 5 <= x + w - 2; bx += 7) {
      const on = lit && rng() < 0.5;
      rect(g, bx + 1, y, 3, 3, on ? PALETTE.glow : p.indigo);                                   // window behind the balcony
      rect(g, bx, y + 3, 5, 1, p.gray); px(g, bx, y + 4, p.grayDark); px(g, bx + 2, y + 4, p.grayDark); px(g, bx + 4, y + 4, p.grayDark);   // railing
      rect(g, bx - 1, y + 5, 7, 1, p.white);                                                    // balcony slab
      if (rng() < 0.25) { px(g, bx + 1, y + 2, p.green); px(g, bx + 3, y + 2, p.greenDark); }   // a potted plant
    }
  }
  rect(g, x + 2, top - 5, 4, 3, p.grayLight); rect(g, x + 2, top - 6, 4, 1, p.gray);            // water tank
  if (w > 18) { rect(g, x + w - 8, top - 4, 4, 2, p.cloudShade); px(g, x + w - 6, top - 8, p.grayDark); rect(g, x + w - 6, top - 7, 1, 3, p.grayDark); }
}

// The same blocks far away: hazy silhouettes with balcony ledges and window hints
function farResidence(g, p, x, base, w, h, seed) {
  const rng = mulberry32(seed);
  rect(g, x, base - h, w, h, p.haze);
  ditherRect(g, x, base - h, w, h, p.skyMid, 5);
  rect(g, x - 1, base - h - 1, w + 2, 1, p.cloudShade);                                         // flat roof parapet
  for (let y = base - h + 3; y < base - 3; y += 4) {
    rect(g, x + 1, y, w - 2, 1, p.cloudShade);                                                  // balcony ledges
    for (let bx = x + 2; bx < x + w - 2; bx += 3) if (rng() < 0.8) px(g, bx, y + 1, p.slate);   // windows
  }
  if (w > 10 && rng() < 0.6) rect(g, x + 2, base - h - 3, 3, 2, p.haze);                        // water tank
}
