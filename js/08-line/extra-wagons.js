'use strict';
// js/08-line/extra-wagons.js
// Defines: EXTRA_WAGONS, extraWagons, paintWagon, drawExtraWagons

// Rusted freight wagons left standing on the abandoned yard line (on the near rail)
let EXTRA_WAGONS = null;
function extraWagons() {
  if (!EXTRA_WAGONS) {
    const rng = mulberry32(401), list = [], end = STATIONS[1].dist - 450;
    for (let u = STATIONS[0].dist + 800; u < end; u += randInt(rng, 450, 1000)) {
      const cars = randInt(rng, 1, 3), kind = pick(rng, ['box', 'box', 'tank', 'open']);
      for (let k = 0; k < cars; k++) list.push({ u: u + k * 31, kind: k && rng() < 0.4 ? pick(rng, ['box', 'open']) : kind });
    }
    EXTRA_WAGONS = list;
  }
  return EXTRA_WAGONS;
}
function paintWagon(g, p, kind) {                        // 28 x 19, wheels on the bottom row
  if (kind === 'tank') {
    rect(g, 1, 1, 26, 10, p.brown); rect(g, 1, 1, 26, 2, p.rust); rect(g, 12, 0, 4, 1, p.rust);
    for (let i = 0; i < 26; i++) px(g, 2 + (i * 7) % 24, 2 + (i * 3) % 8, i % 3 ? p.orange : p.brownDark);
    for (let x = 6; x < 26; x += 8) rect(g, x, 1, 1, 10, p.brownDark);
  } else if (kind === 'open') {
    rect(g, 0, 4, 28, 7, p.rust); rect(g, 0, 4, 28, 1, p.brown);
    for (let i = 0; i < 26; i += 2) px(g, 1 + i, 3 - (i % 3 === 0 ? 1 : 0), p.grayDark);        // a heap of scrap sticking out
    for (let x = 3; x < 28; x += 5) rect(g, x, 5, 1, 6, p.brownDark);
  } else {
    rect(g, 0, 1, 28, 10, p.rust); rect(g, 0, 0, 28, 1, p.grayDark);
    for (let y = 3; y < 11; y += 3) rect(g, 0, y, 28, 1, p.brown);
    rect(g, 11, 2, 7, 9, p.brown); rect(g, 11, 2, 1, 9, p.ink); rect(g, 17, 2, 1, 9, p.ink);   // sliding door
    for (let i = 0; i < 18; i++) px(g, (i * 11) % 28, 1 + (i * 5) % 10, p.red);
  }
  rect(g, 0, 11, 28, 2, p.ink);
  for (const wx of [4, 9, 19, 24]) { disc(g, wx, 15, 3, p.ink); px(g, wx, 15, p.rust); }
  for (let i = 0; i < 5; i++) px(g, randInt(mulberry32(i + 3), 1, 26), 0, p.green);              // weeds on the roof
}
function drawExtraWagons(g, v) {
  const cam = Math.floor(sim.dist);
  for (const w of extraWagons()) {
    const x = Math.round(w.u - cam + ANCHOR_X) - 14;
    if (x > W || x + 28 < 0) continue;
    g.drawImage(cached(v, 'wagon' + w.kind, 28, 19, (gg, p) => paintWagon(gg, p, w.kind)), x, 157);
  }
}
