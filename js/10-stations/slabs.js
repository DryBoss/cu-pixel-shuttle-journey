'use strict';
// js/10-stations/slabs.js
// Defines: buildOldSlab, buildSlab, buildBleachedSlab, dappleSlab

// Raised concrete platform seen from slightly above: coping, yellow safety
// line along the track edge, paved surface, then the front face.
// The old terminal's platform: red brick paving instead of concrete
function buildOldSlab(p, w, seed) {
  const c = buildSlab(p, w, seed), g = c.getContext('2d'), rng = mulberry32(1896 + seed);
  rect(g, 0, 0, w, 1, p.cream);
  for (let y = 1; y < 24; y++) {
    const r = Math.floor(y / 3), lane = y >= 8 && y <= 20;                 // the walking lane is worn pale
    for (let x = 0; x < w; x++) {
      const k = rng(), crooked = hash2(x >> 3, r) < 0.12, wear = lane ? 0.22 + 0.4 * hash2(x >> 4, r + 7) : 0.04;
      const mortar = y % 3 === 0 || (x + (r & 1) * 3 + (crooked ? 1 : 0)) % 6 === 0;
      if (y === 2) { px(g, x, y, bayer(x, y) < 9 && hash2(x >> 1, 2) < 0.8 ? p.paddy : p.tan); continue; }   // the safety line, faded and broken
      px(g, x, y, mortar ? (k < wear ? p.cloudShade : p.grayLight)
                         : hash2(x >> 2, y >> 1) < 0.08 ? p.brownDark       // a sunken, darker brick
                         : k < wear ? p.tan : k < wear + 0.14 ? p.brown : p.rust);
    }
  }
  rect(g, 0, 24, w, 1, p.cream);
  rect(g, 0, 25, w, 7, p.rust);
  rect(g, 0, 29, w, 3, p.brown);
  for (let x = 5; x < w; x += 12) rect(g, x, 25, 1, 7, p.brown);
  rect(g, 0, 0, 1, 32, p.brownDark);
  rect(g, w - 1, 0, 1, 32, p.brownDark);
  return c;
}

function buildSlab(p, w, seed) {
  const rng = mulberry32(300 + seed);
  const [c, g] = makeCanvas(w, 32);                      // screen y 148..179
  rect(g, 0, 0, w, 1, p.cloudShade);
  rect(g, 0, 1, w, 23, p.grayLight);
  rect(g, 0, 2, w, 1, p.glow);                           // safety line
  for (const y of [9, 16]) rect(g, 0, y, w, 1, p.gray);
  [[3, 6], [10, 6], [17, 7]].forEach(([y, h], r) => {
    for (let x = (r * 7) % 16; x < w; x += 16) rect(g, x, y, 1, h, p.gray);
  });
  for (let i = 0; i < w / 3; i++) px(g, randInt(rng, 0, w - 1), randInt(rng, 3, 23), rng() < 0.6 ? p.gray : p.cloudShade);
  rect(g, 0, 24, w, 1, p.cloudShade);
  rect(g, 0, 25, w, 7, p.gray);
  rect(g, 0, 29, w, 3, p.grayDark);
  for (let x = 5; x < w; x += 24) rect(g, x, 25, 1, 7, p.grayDark);
  rect(g, 0, 0, 1, 32, p.grayDark);
  rect(g, w - 1, 0, 1, 32, p.grayDark);
  return c;
}

// Jhawtola's platform: open to sun and monsoon, so the concrete is bleached pale, the safety line
// has faded to a broken dash, and long hairline cracks run across it with a weed in the worst
function buildBleachedSlab(p, w, seed) {
  const c = buildSlab(p, w, seed), g = c.getContext('2d'), rng = mulberry32(2200 + seed);
  for (let y = 1; y < 24; y++)                                           // sun-bleached: pale patches, mostly toward the track
    for (let x = 0; x < w; x++)
      if (y !== 2 && hash2(x >> 2, y >> 1) < 0.5 - y * 0.012) px(g, x, y, bayer(x, y) < 6 ? p.cloudShade : p.white);
  for (let x = 1; x < w - 1; x++)                                        // the safety line: faded, broken
    px(g, x, 2, bayer(x, 2) < 9 && hash2(x >> 1, 2) < 0.7 ? p.paddy : p.cloudShade);
  for (let i = 0; i < w / 26; i++) {                                     // cracks
    let x = randInt(rng, 6, w - 7), y = randInt(rng, 4, 16), dir = rng() < 0.5 ? -1 : 1;
    for (let n = randInt(rng, 7, 16); n > 0 && y < 23; n--) {
      px(g, x, y, p.gray);
      if (rng() < 0.5) px(g, x + dir, y, p.gray);
      y += rng() < 0.7 ? 1 : 0; x += rng() < 0.65 ? dir : 0;
      if (rng() < 0.12) { dir = -dir; px(g, x, y, p.grayDark); }
    }
    if (rng() < 0.4) px(g, x, y, p.grassLight);                          // a weed through the crack
  }
  for (let i = 0; i < w / 40; i++) {                                     // chipped coping at the track edge
    const x = randInt(rng, 2, w - 4); rect(g, x, 0, randInt(rng, 1, 3), 1, p.gray);
  }
  return c;
}

// Dappled shade under a Jhau tree standing at screen x tx (ragged, wind-flickering shade is faked
// as fixed dithered blotches on the slab)
function dappleSlab(c, p, L, xs) {
  const g = c.getContext('2d');
  for (const tx of xs)
    for (let dx = -24; dx <= 24; dx++)
      for (let y = 3; y < 23; y++) {
        const x = tx - L + dx, dens = 0.5 * (1 - Math.abs(dx) / 25) * (1 - Math.abs(y - 12) / 14);
        if (x < 1 || x >= c.width - 1) continue;
        if (hash2((x + 3) >> 1, (y + 5) >> 1) < dens) px(g, x, y, hash2(x, y) < 0.35 ? p.gray : p.cloudShade);
      }
}
