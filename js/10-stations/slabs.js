'use strict';
// js/10-stations/slabs.js
// Defines: buildOldSlab, buildSlab, buildCleanSlab, buildBakedSlab, buildBleachedSlab, buildWeatheredSlab, dappleSlab, shadeSlab

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

// The Cantonment's platform: swept every morning. Same concrete, but no scatter of stains or litter:
// crisp joints, a bright safety line, a white kerb
function buildCleanSlab(p, w, seed) {
  const [c, g] = makeCanvas(w, 32);
  rect(g, 0, 0, w, 1, p.white);
  rect(g, 0, 1, w, 23, p.grayLight);
  rect(g, 0, 2, w, 1, p.glow);
  for (const y of [9, 16]) rect(g, 0, y, w, 1, p.cloudShade);
  [[3, 6], [10, 6], [17, 7]].forEach(([y, h], r) => { for (let x = (r * 7) % 16; x < w; x += 16) rect(g, x, y, 1, h, p.cloudShade); });
  rect(g, 0, 24, w, 1, p.white);
  rect(g, 0, 25, w, 7, p.cloudShade);
  rect(g, 0, 29, w, 3, p.gray);
  for (let x = 5; x < w; x += 24) rect(g, x, 25, 1, 7, p.gray);
  rect(g, 0, 0, 1, 32, p.gray); rect(g, w - 1, 0, 1, 32, p.gray);
  return c;
}

// Foteyabad's platform: open to the sky, so sun-baked and a little bleached, with a faded safety line and a few
// hairline cracks, but kept tidy: no litter, no mould
function buildBakedSlab(p, w, seed) {
  const c = buildCleanSlab(p, w, seed), g = c.getContext('2d'), rng = mulberry32(4100 + seed);
  for (let y = 3; y < 24; y++) for (let x = 1; x < w - 1; x++)
    if (y !== 2 && hash2(x >> 2, y >> 1) < 0.3 - y * 0.006 && bayer(x, y) < 9) px(g, x, y, (x + y) % 5 ? p.cloudShade : p.white);   // bleached by the sun
  for (let x = 1; x < w - 1; x++) px(g, x, 2, bayer(x, 2) < 10 && hash2(x >> 1, 7) < 0.8 ? p.paddy : p.cloudShade);    // faded safety line
  for (let i = 0; i < w / 40; i++) {                                                                                   // hairline cracks
    let x = randInt(rng, 6, w - 7), y = randInt(rng, 4, 14);
    for (let n = randInt(rng, 5, 11); n > 0 && y < 23; n--) { px(g, x, y, p.gray); y += rng() < 0.7 ? 1 : 0; x += rng() < 0.5 ? 1 : -1; }
  }
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
function dappleSlab(c, p, L, xs, spread = 24, strength = 0.5) {
  const g = c.getContext('2d');
  for (const tx of xs)
    for (let dx = -spread; dx <= spread; dx++)
      for (let y = 3; y < 23; y++) {
        const x = tx - L + dx, dens = strength * (1 - Math.abs(dx) / (spread + 1)) * (1 - Math.abs(y - 12) / 14);
        if (x < 1 || x >= c.width - 1) continue;
        if (hash2((x + 3) >> 1, (y + 5) >> 1) < dens) px(g, x, y, hash2(x, y) < 0.35 ? p.gray : p.cloudShade);
      }
}

// Polytechnic's naked platform: years of sun and monsoon with nobody caring for it. Bleached patches,
// dark mould stains, puddles that never quite dry, cracks with bright weeds, and weeds creeping over the edges
function buildWeatheredSlab(p, w, seed) {
  const c = buildBleachedSlab(p, w, seed), g = c.getContext('2d'), rng = mulberry32(3300 + seed);
  const blob = (cx, cy, rx, ry, fn) => {
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
      const d = (x / rx) ** 2 + (y / ry) ** 2 + (hash2(cx + x, cy + y) - 0.5) * 0.5;
      if (d < 1) fn(cx + x, cy + y, d);
    }
  };
  for (let i = 0; i < w / 14; i++) {                                     // mould and damp: dark grey stains, thickest in the low corners
    const cx = randInt(rng, 0, w - 1), cy = randInt(rng, 4, 22), rx = randInt(rng, 3, 10), ry = randInt(rng, 1, 4);
    blob(cx, cy, rx, ry, (x, y, d) => { if (x > 0 && x < w - 1 && y > 2 && y < 24) px(g, x, y, d < 0.45 && bayer(x, y) < 11 ? p.grayDark : bayer(x, y) < 9 ? p.gray : p.cloudShade); });
  }
  for (let i = 0; i < w / 60; i++) {                                     // puddles: a dark wet rim round a pale sky reflection
    const cx = randInt(rng, 10, w - 11), cy = randInt(rng, 8, 19), rx = randInt(rng, 6, 13), ry = randInt(rng, 2, 4);
    blob(cx, cy, rx + 1, ry + 1, (x, y) => { if (bayer(x, y) < 10) px(g, x, y, p.grayDark); });
    blob(cx, cy, rx, ry, (x, y, d) => px(g, x, y, d < 0.35 && (x + y) % 3 === 0 ? p.white : d < 0.7 ? p.skyLight : p.skyMid));
    px(g, cx - 2, cy - 1, p.white); px(g, cx - 1, cy - 1, p.white);
  }
  for (let i = 0; i < w / 5; i++) {                                      // weeds sprouting from the cracks and joints
    const x = randInt(rng, 2, w - 3), y = randInt(rng, 4, 22);
    if (rng() < 0.7) {
      px(g, x, y, p.green);
      px(g, x, y - 1, p.grassLight); if (rng() < 0.6) px(g, x - 1, y - 2, p.grassLight); if (rng() < 0.5) px(g, x + 1, y - 2, p.grassLight);
    }
  }
  for (let x = 1; x < w - 1; x++) {                                      // creeping over the track-side edge and the front face
    if (hash2(x >> 1, 91) < 0.22) { px(g, x, 0, p.grassLight); if (rng() < 0.5) px(g, x, 1, p.green); }
    if (hash2(x >> 2, 92) < 0.18) { const l = randInt(rng, 2, 6); for (let j = 0; j < l; j++) px(g, x, 24 + j, j % 2 ? p.green : p.grassLight); }
    if (hash2(x >> 3, 93) < 0.3) { const l = randInt(rng, 4, 10); for (let j = 0; j < l; j++) if (bayer(x, 25 + j) < 12 - j) px(g, x, 25 + j, p.grayDark); }   // mould drips down the face
  }
  return c;
}

// Shade under a long roof: darker toward the back wall, dithered so the concrete still shows
function shadeSlab(c, p, L, span) {
  const g = c.getContext('2d');
  for (let y = 3; y < 24; y++)
    for (let x = Math.max(1, span[0] - L); x < Math.min(c.width - 1, span[1] - L); x++) {
      const lv = y < 9 ? 9 : y < 16 ? 6 : 3;
      if (bayer(x, y) < lv) px(g, x, y, y < 9 ? p.grayDark : p.gray);
    }
}
