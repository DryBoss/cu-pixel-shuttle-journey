'use strict';
// js/06-landscapes/village-bari.js
// Defines: bariHouse, haystackDome

// A classic Bengali rural house in a bari: woven bamboo walls (tan and cream, checkered), a small mud plinth,
// a rusty corrugated tin roof with overhanging eaves, a door, a shuttered window and a bamboo veranda post.
// (x, base) = the left foot and the ground line; w = wall width
function bariHouse(g, p, lit, x, base, w, seed) {
  const rng = mulberry32(seed), wh = 7, top = base - 2 - wh;
  rect(g, x - 1, base - 2, w + 2, 2, p.brown); rect(g, x - 1, base - 2, w + 2, 1, p.tan);           // mud plinth
  for (let yy = top; yy < base - 2; yy++) for (let xx = x; xx < x + w; xx++)
    px(g, xx, yy, ((xx >> 1) + yy) & 1 ? p.tan : p.cream);                                           // woven bamboo, checkerboard
  for (let n = 0; n < w / 3; n++) px(g, x + randInt(rng, 0, w - 1), top + randInt(rng, 0, wh - 1), p.brown);    // smoke-stained strands
  const dx = x + 3 + Math.floor(hash2(seed & 255, 3) * Math.max(1, w - 10));
  rect(g, dx - 1, top + 1, 5, 1, p.brown); rect(g, dx, top + 2, 3, wh - 2, lit ? PALETTE.amber : p.brownDark);   // doorway
  if (lit) px(g, dx + 1, top + 3, PALETTE.glow);
  const wx = dx + 6 < x + w - 2 ? dx + 6 : x + 1;
  rect(g, wx, top + 2, 2, 2, lit ? PALETTE.glow : p.indigo); px(g, wx - 1, top + 2, p.brown); px(g, wx + 2, top + 2, p.brown);
  rect(g, x - 1, top + 1, 1, wh + 1, p.paddy); px(g, x - 1, top + 1, p.brownDark);                  // a bamboo veranda post
  for (let r = 0; r < 5; r++) {                                                                      // rusty corrugated roof, overhanging
    const y = top - 1 - r, x0 = x - 2 + r, rw = w + 4 - 2 * r;
    for (let xx = x0; xx < x0 + rw; xx++) {
      const k = hash2(xx >> 1, y + (seed & 63));
      px(g, xx, y, xx % 3 === 0 ? p.brownDark : k < 0.55 ? p.rust : k < 0.85 ? p.brown : p.orange);
    }
  }
  rect(g, x - 2, top, w + 4, 1, p.brownDark);                                                        // eave shadow
}

// A big traditional dome-shaped haystack: layered straw in tan and paddy, tied with rope, a tuft on top
function haystackDome(g, p, x, base, w, h, seed) {
  const rng = mulberry32(seed);
  for (let r = 0; r < h; r++) {
    const half = Math.round(w / 2 * Math.sqrt(1 - (r / h) * (r / h))), y = base - r - 1;
    rect(g, x - half, y, half * 2 + 1, 1, (r >> 1) & 1 ? p.tan : p.paddy);
    px(g, x + half, y, p.brown); px(g, x + half - 1, y, rng() < 0.6 ? p.brown : p.tan);               // shaded side
    px(g, x - half, y, p.cream);                                                                      // sunlit edge
  }
  for (let n = 0; n < w * h * 0.18; n++) {                                                            // straw texture
    const r = randInt(rng, 1, h - 2), half = Math.round(w / 2 * Math.sqrt(1 - (r / h) * (r / h)));
    px(g, x + randInt(rng, -half + 1, half - 1), base - r - 1, rng() < 0.5 ? p.brown : p.cream);
  }
  rect(g, x - Math.round(w / 2 * 0.87), base - (h >> 1) - 1, Math.round(w * 0.87) + 1, 1, p.brown);   // rope round the middle
  rect(g, x, base - h - 2, 1, 3, p.brown); px(g, x - 1, base - h - 1, p.paddy); px(g, x + 1, base - h - 1, p.paddy);   // the pole and a tuft
  rect(g, x - (w >> 1) - 1, base, w + 3, 1, p.brownDark);
}
