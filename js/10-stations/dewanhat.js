'use strict';
// js/10-stations/dewanhat.js
// Defines: DEW_W, buildDewanhat

// --- the Dewanhat road overpass: a heavy concrete deck right across the picture on
// stained pillars; traffic crawls along it (drawn live) and it shades the line below
const DEW_W = 760;
function buildDewanhat(p, lit) {
  const W = DEW_W, H = 56, [c, g] = makeCanvas(W, H), rng = mulberry32(31);
  // shadow under the deck, darkest just below it: a dither of ink over whatever is behind
  ditherRect(g, 0, 22, W, 9, p.ink, 10); ditherRect(g, 0, 31, W, 10, p.ink, 7); ditherRect(g, 0, 41, W, 14, p.ink, 4);
  for (const px0 of [81, 226, 370, 516, 661]) {                          // pillars
    const x = px0 - 7;
    rect(g, x, 26, 14, 28, p.gray);
    rect(g, x, 26, 2, 28, p.grayLight); rect(g, x + 12, 26, 2, 28, p.grayDark);
    for (let y = 32; y < 54; y += 7) rect(g, x, y, 14, 1, p.grayDark);                              // formwork lines
    rect(g, x - 2, 22, 18, 5, p.gray); rect(g, x - 2, 22, 18, 1, p.grayLight);                      // capital
    rect(g, x - 2, 52, 18, 3, p.grayDark);                                                          // plinth
    for (let n = 0; n < 3; n++) { const sx = x + randInt(rng, 2, 11), sl = randInt(rng, 8, 20); for (let j = 0; j < sl; j++) px(g, sx, 27 + j, p.grayDark); }   // damp streaks
    for (let y = 40; y < 53; y++) for (let xx = 0; xx < 14; xx++)                                   // moss creeping up from the bottom
      if (rng() < (y - 38) / 18) px(g, x + xx, y, rng() < 0.5 ? p.greenDark : rng() < 0.6 ? p.green : p.grass);
    for (let n = 0; n < 2; n++) {                                                                   // faded election posters
      const py = 29 + n * 10 + randInt(rng, 0, 2), pxx = x + randInt(rng, 2, 6), faded = rng() < 0.5;
      rect(g, pxx, py, 6, 8, faded ? p.cloudShade : p.white);
      rect(g, pxx + 1, py + 1, 4, 2, faded ? p.grayDark : p.ink); rect(g, pxx + 1, py + 4, 4, 1, p.grayDark); rect(g, pxx + 1, py + 6, 3, 1, p.grayDark);
      px(g, pxx + 5, py + 7, p.gray); px(g, pxx, py, p.gray);                                       // torn corners
    }
  }
  rect(g, 0, 22, W, 4, p.gray); rect(g, 0, 22, W, 1, p.grayLight);                                  // girders under the deck
  rect(g, 0, 12, W, 10, p.grayLight); rect(g, 0, 12, W, 1, p.cloudShade);                           // the slab
  rect(g, 0, 19, W, 3, p.gray); rect(g, 0, 21, W, 1, p.grayDark);
  for (let x = 20; x < W; x += 40) rect(g, x, 12, 1, 10, p.gray);                                   // expansion joints
  rect(g, 0, 8, W, 1, p.cloudShade);                                                                // railing: a rail on posts
  for (let x = 3; x < W; x += 24) rect(g, x, 8, 2, 5, p.grayLight);
  return c;
}
