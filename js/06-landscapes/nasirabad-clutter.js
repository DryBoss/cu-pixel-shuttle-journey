'use strict';
// js/06-landscapes/nasirabad-clutter.js
// Defines: rustySideTrack, cableRun, sleeperPile, mileageMarker

// A disused siding, half buried in weeds and dark gravel, slowly diverging from the main line.
// x0..x1 in layer px; the upper rail slopes from row y0 to row y1 across [from, to]
function rustySideTrack(g, p, tx, len, from, to, y0, y1, seed) {
  const rng = mulberry32(seed), yAt = x => y0 + (y1 - y0) * Math.max(0, Math.min(1, (x - from) / (to - from)));
  for (let i = 0; i < len; i++) {
    const x = tx + i, y = Math.round(yAt(x));
    if (i % 5 === 0) { rect(g, x, y - 1, 2, 6, p.brownDark); px(g, x, y - 1, p.brown); }                    // sleepers, rotting
    if (rng() < 0.9) px(g, x, y, rng() < 0.6 ? p.rust : rng() < 0.5 ? p.brown : p.orange);                   // rust-eaten rails
    if (rng() < 0.9) px(g, x, y + 3, rng() < 0.6 ? p.brown : p.rust);
  }
  for (let i = 0; i < len * 1.4; i++) {                                                                      // dark gravel strewn around it
    const x = tx + randInt(rng, 0, len - 1), y = Math.round(yAt(x)) + randInt(rng, -2, 6);
    px(g, x, y, rng() < 0.55 ? p.ink : rng() < 0.6 ? p.grayDark : p.brownDark);
  }
  for (let i = 0; i < len * 0.7; i++) {                                                                      // weeds growing through it
    const x = tx + randInt(rng, 0, len - 1), y = Math.round(yAt(x)) + randInt(rng, 0, 4), h = randInt(rng, 1, 4);
    for (let j = 0; j < h; j++) px(g, x, y - j, j === h - 1 ? p.grassLight : p.greenDark);
  }
}

// Thick black signal cables running along the ballast: two cables, concrete trough covers, clamps
function cableRun(g, p, tx, len, seed) {
  const rng = mulberry32(seed);
  rect(g, tx, 13, len, 2, p.ink); rect(g, tx, 15, len, 1, p.grayDark);
  for (let i = 0; i < len; i += 7) px(g, tx + i, 13, p.grayDark);
  for (let i = 4; i < len - 10; i += randInt(rng, 24, 44)) { rect(g, tx + i, 12, 8, 5, p.cloudShade); rect(g, tx + i, 12, 8, 1, p.white); rect(g, tx + i + 7, 12, 1, 5, p.gray); }   // trough covers
  for (let i = 10; i < len; i += randInt(rng, 28, 50)) { rect(g, tx + i, 11, 1, 3, p.grayDark); px(g, tx + i, 11, p.red); }   // cable markers
}

// Discarded wooden sleepers: a loose stack, and one half sunk in the weeds
function sleeperPile(g, p, tx, y, seed) {
  const rng = mulberry32(seed), n = randInt(rng, 2, 4);
  for (let i = 0; i < n; i++) {
    const x = tx + (i & 1) * 2 - randInt(rng, 0, 1), yy = y - i * 2;
    rect(g, x, yy, 11, 2, p.brownDark); rect(g, x, yy, 11, 1, p.brown); rect(g, x + 10, yy, 1, 2, p.tan);
    px(g, x + 3, yy, p.ink); px(g, x + 7, yy + 1, p.ink);
  }
  for (let i = 0; i < 4; i++) px(g, tx + randInt(rng, 0, 10), y + 2, rng() < 0.5 ? p.greenDark : p.grassLight);
}

// A squat concrete mileage marker with the kilometre painted on its face
function mileageMarker(g, p, tx, y, label) {
  rect(g, tx + 4, y - 2, 5, 4, p.cloudShade);
  rect(g, tx, y - 11, 13, 9, p.white); rect(g, tx, y - 11, 13, 1, p.cloudShade); rect(g, tx + 12, y - 11, 1, 9, p.gray);
  rect(g, tx, y - 3, 13, 1, p.gray);
  drawText(g, label, tx + 1, y - 9, p.ink);
  px(g, tx + 2, y - 1, p.greenDark); px(g, tx + 9, y - 1, p.grassLight);
}
