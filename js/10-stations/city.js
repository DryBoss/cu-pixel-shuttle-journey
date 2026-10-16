'use strict';
// js/10-stations/city.js
// Defines: buildCity

function buildCity(p, lit) {
  const TW = 540, TH = 52, rng = mulberry32(61);
  const [c, g] = makeCanvas(TW, TH);
  // two rows of blocks; the city thins out towards the right (the way out of Dhaka)
  for (const [col, side, win, hMax] of [[p.cloudShade, p.grayLight, p.grayLight, 46], [p.grayLight, p.gray, p.gray, 34]]) {
    for (let x = randInt(rng, 0, 6); x < TW - 12; ) {
      const w = randInt(rng, 8, 22), fade = Math.max(0, Math.min(1, (TW - 30 - x) / 220));
      const h = Math.max(4, Math.round(randInt(rng, 10, hMax) * (0.2 + 0.8 * fade))), top = TH - h;
      rect(g, x, top, w, h, col);
      rect(g, x + w - 1, top, 1, h, side);
      for (let yy = top + 2; yy < TH - 2; yy += 3)
        for (let xx = x + 2; xx < x + w - 2; xx += 3) {
          const on = rng() < 0.35, warm = rng() < 0.7;       // always roll: same city in every lighting
          px(g, xx, yy, lit && on ? (warm ? PALETTE.glow : PALETTE.amber) : win);
        }
      if (rng() < 0.2 && h > 24) { rect(g, x + (w >> 1), top - 5, 1, 5, p.grayDark); px(g, x + (w >> 1), top - 6, p.red); }
      x += w + randInt(rng, 0, 3) + (fade < 0.6 ? randInt(rng, 6, 18) : 0);
    }
  }
  // a mosque dome and minaret among the blocks
  const mx = 168, base = TH - 18;
  disc(g, mx, base, 7, p.white);
  rect(g, mx - 9, base, 19, 18, p.cloudShade);
  rect(g, mx, base - 10, 1, 3, p.glow);
  rect(g, mx + 13, TH - 40, 3, 40, p.white);
  rect(g, mx + 12, TH - 30, 5, 1, p.grayLight);
  rect(g, mx + 14, TH - 43, 1, 3, p.grayLight);
  return c;
}
