'use strict';
// js/06-landscapes/khulshi-walls.js
// Defines: tallWall, barbedWire, brokenGlass, ironGate

// Barbed wire strung on leaning posts along a wall top: two rusty strands with barbs
function barbedWire(g, p, x, len, top, seed) {
  const rng = mulberry32(seed);
  for (let i = 0; i <= len; i += 10) { const xx = x + Math.min(i, len - 1); rect(g, xx, top - 5, 1, 5, p.grayDark); px(g, xx + 1, top - 6, p.grayDark); }
  for (let i = 0; i < len; i++) for (const r of [2, 4]) {
    px(g, x + i, top - r + (i % 10 > 5 ? 1 : 0), rng() < 0.7 ? p.rust : p.grayDark);
    if (i % 3 === 0) px(g, x + i, top - r - 1, p.rust);
  }
}

// Broken bottle glass cemented along the coping: random green, clear and brown shards
function brokenGlass(g, p, x, len, top, seed) {
  const rng = mulberry32(seed), cols = [p.skyLight, p.green, p.white, p.brown];
  for (let i = 0; i < len; i++) {
    if (rng() < 0.3) continue;
    const h = 1 + Math.floor(rng() * 3), col = cols[Math.floor(rng() * cols.length)];
    for (let j = 0; j < h; j++) px(g, x + i, top - 1 - j, j === h - 1 && rng() < 0.5 ? p.white : col);
  }
}

// A tall solid boundary wall of a housing society or campus: red brick or painted concrete, with
// pillars, a coping, rain streaks, moss at the foot, and barbed wire or broken glass on top
function tallWall(g, p, x, len, base, h, brick, seed, security) {
  const rng = mulberry32(seed), top = base - h;
  if (brick) {
    rect(g, x, top, len, h, p.rust);
    for (let y = top + 1; y < base; y += 2) rect(g, x, y, len, 1, p.brown);                     // mortar courses
    for (let xx = x; xx < x + len; xx++) for (let y = top; y < base; y += 2) if ((xx + (y & 2)) % 4 === 3) px(g, xx, y, p.brown);
    ditherRect(g, x, top, len, h, p.brownDark, 2);
  } else {
    rect(g, x, top, len, h, p.grayLight);
    ditherRect(g, x, top, len, h, p.cloudShade, 4);
    for (let xx = x + 12; xx < x + len; xx += 12) rect(g, xx, top, 1, h, p.gray);               // panel joints
  }
  for (let i = 0; i < len / 5; i++) {                                                           // rain streaks
    const sx = x + randInt(rng, 0, len - 1), l = randInt(rng, 4, h - 2);
    for (let j = 0; j < l; j++) if (j < l * 0.6 || bayer(sx, top + j) < 8) px(g, sx, top + 1 + j, brick ? p.brownDark : p.gray);
  }
  for (let xx = x; xx < x + len; xx++) {                                                        // moss and damp at the foot
    const mh = 1 + Math.floor(hash2(xx >> 1, seed & 127) * 4);
    for (let j = 0; j < mh; j++) if (bayer(xx, base - 1 - j) < 14 - j * 3) px(g, xx, base - 1 - j, j ? p.greenDark : p.green);
  }
  for (let xx = x; xx < x + len; xx += 24) {                                                    // pillars
    rect(g, xx, top - 2, 3, h + 2, brick ? p.brown : p.cloudShade); rect(g, xx + 2, top - 2, 1, h + 2, brick ? p.brownDark : p.gray);
    rect(g, xx - 1, top - 3, 5, 1, p.gray);
  }
  rect(g, x, top - 1, len, 2, p.gray); rect(g, x, top - 1, len, 1, p.cloudShade);               // coping
  if (security === 'barbed') barbedWire(g, p, x, len, top - 1, seed + 1);
  else if (security === 'glass') brokenGlass(g, p, x, len, top - 1, seed + 1);
}

// A society's gate: two pillars, iron bars, a lamp that glows at night
function ironGate(g, p, lit, x, base, h) {
  const top = base - h;
  rect(g, x, top - 3, 4, h + 3, p.cloudShade); rect(g, x + 3, top - 3, 1, h + 3, p.gray); rect(g, x - 1, top - 4, 6, 1, p.gray);
  rect(g, x + 16, top - 3, 4, h + 3, p.cloudShade); rect(g, x + 19, top - 3, 1, h + 3, p.gray); rect(g, x + 15, top - 4, 6, 1, p.gray);
  rect(g, x + 4, top + 1, 12, h - 1, p.ink);
  for (let xx = x + 5; xx < x + 16; xx += 2) rect(g, xx, top + 2, 1, h - 2, p.grayDark);
  rect(g, x + 4, top + 3, 12, 1, p.grayDark); rect(g, x + 4, base - 4, 12, 1, p.grayDark);
  rect(g, x + 7, top - 2, 6, 2, p.blue);                                                        // the name plate over the gate
  px(g, x + 1, top - 6, p.grayDark); rect(g, x + 1, top - 5, 2, 2, lit ? PALETTE.glow : p.skyLight);   // lamp on a pillar
  if (lit) glowHalo(g, x + 2, top - 5, 2, 6, 4);
}
