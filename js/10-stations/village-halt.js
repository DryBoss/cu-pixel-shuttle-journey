'use strict';
// js/10-stations/village-halt.js
// Defines: buildVillageGround, buildRusticRoof

// Choudhury Hat's ground: no platform, just lush grass with a winding, well-trodden dirt path up to the
// tracks and a worn waiting patch under the shelter. No litter: fallen leaves and tiny wildflowers instead
function buildVillageGround(p, w, seed, shelterCx = 226 + 40) {
  const rng = mulberry32(2600 + seed), [c, g] = makeCanvas(w, 19);
  for (let y = 0; y < 19; y++)
    for (let x = 0; x < w; x++) {
      const k = rng(), mix = y < 3 ? 0 : y > 5 ? 1 : (bayer(x, y) < (y - 2) * 5 ? 1 : 0);   // dark ballast above, then straight into grass
      px(g, x, y, !mix ? (k < 0.5 ? p.grayDark : k < 0.8 ? p.gray : k < 0.9 ? p.ink : p.grayLight)
                       : k < 0.38 ? p.green : k < 0.68 ? p.grass : k < 0.82 ? p.greenDark : k < 0.94 ? p.grassLight : p.green);
    }
  for (let n = 0; n < w * 0.9; n++) {                                                         // grass blades: little lit strokes
    const x = randInt(rng, 0, w - 1), y = randInt(rng, 5, 17);
    px(g, x, y, p.grassLight); if (rng() < 0.7) px(g, x, y - 1, p.grass);
  }
  const ph = rng() * 6, cxAt = y => shelterCx + Math.round(Math.sin(y * 0.5 + ph) * 4 + (18 - y) * 0.35);
  for (let y = 18; y >= 3; y--) {                                                             // the beaten track, winding up from the front
    const half = 2 + Math.round((18 - y) * 0.12) + (y < 9 ? Math.round((9 - y) * 1.4) : 0);
    for (let dx = -half - 1; dx <= half + 1; dx++) {
      const x = cxAt(y) + dx; if (x < 0 || x >= w) continue;
      const edge = Math.abs(dx) > half - (rng() < 0.4 ? 1 : 0);
      if (edge && rng() < 0.55) { px(g, x, y, rng() < 0.5 ? p.grass : p.grassLight); continue; }          // ragged, grass creeping in
      const k = rng();
      px(g, x, y, k < 0.5 ? p.tan : k < 0.78 ? p.brown : k < 0.9 ? p.cream : p.brownDark);              // trodden pale, with ruts
    }
  }
  const ax = shelterCx - 22, bx = shelterCx + 30;                                               // a worn patch where people wait, under the shelter
  for (let y = 3; y < 9; y++) for (let x = ax; x < bx; x++) {
    const d = ((x - (ax + bx) / 2) / ((bx - ax) / 2)) ** 2 + ((y - 5) / 3.4) ** 2;
    if (d < 1 - rng() * 0.45 && x >= 0 && x < w) px(g, x, y, rng() < 0.55 ? p.tan : rng() < 0.7 ? p.brown : p.cream);
  }
  for (let n = 0; n < w / 4; n++) {                                                           // tiny wildflowers dotting the grass
    const x = randInt(rng, 0, w - 1), y = randInt(rng, 5, 18);
    px(g, x, y, rng() < 0.6 ? p.white : p.glow);
  }
  for (let n = 0; n < w / 9; n++) px(g, randInt(rng, 0, w - 1), randInt(rng, 6, 18), p[pick(rng, ['orange', 'rust', 'paddy', 'brown'])]);   // fallen leaves
  for (let x = 1; x < w - 1; x++) if (rng() < 0.2) { px(g, x, 2, p.grassLight); px(g, x, 3, p.green); }  // grass overgrowing the ballast edge
  return c;
}

// An old, makeshift shelter roof: corrugated tin, deeply rusted, patched and uneven, with holes and a sag
function buildRusticRoof(p, w) {
  const [c, g] = makeCanvas(w, 7), rng = mulberry32(93);
  for (let x = 0; x < w; ) {                                                                  // sheets of different age, laid a little crooked
    const sw = randInt(rng, 8, 14), off = randInt(rng, 0, 2), r = rng();
    const tone = r < 0.45 ? p.rust : r < 0.75 ? p.brown : r < 0.9 ? p.red : p.orange;
    for (let i = 0; i < sw && x + i < w; i++) {
      const sag = Math.round(Math.sin((x + i) / w * Math.PI) * 1);                            // the middle sags
      for (let y = off + sag; y < 5; y++) px(g, x + i, y, (x + i) % 3 === 0 ? p.brownDark : tone);
      if (rng() < 0.5) px(g, x + i, off + sag, p.brownDark);
    }
    x += sw;
  }
  for (let i = 0; i < w * 0.9; i++) px(g, randInt(rng, 0, w - 1), randInt(rng, 1, 4), rng() < 0.55 ? p.brownDark : rng() < 0.6 ? p.orange : p.rust);   // pitting and rust blooms
  for (let n = 0; n < Math.max(2, Math.round(w / 26)); n++) { const hx = randInt(rng, 2, w - 3), hy = randInt(rng, 1, 3); px(g, hx, hy, p.indigo); if (rng() < 0.5) px(g, hx + 1, hy, p.indigo); }   // holes
  for (let x = 0; x < w; x++) {                                                               // ragged, bent lower edge
    px(g, x, 5, hash2(x >> 1, 21) < 0.3 ? p.brownDark : p.rust);
    if (hash2(x >> 2, 22) < 0.45) px(g, x, 6, hash2(x, 23) < 0.5 ? p.brown : p.brownDark);
  }
  rect(g, 0, 0, 1, 5, p.brownDark); rect(g, w - 1, 0, 1, 5, p.brownDark);
  return c;
}
