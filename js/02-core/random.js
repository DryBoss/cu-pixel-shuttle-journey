'use strict';
// js/02-core/random.js
// Defines: BAYER4, bayer, mulberry32, randInt

// =====================================================================
// 3. DRAWING HELPERS
// =====================================================================
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x, y) => BAYER4[((y & 3) << 2) | (x & 3)];

// Small seeded RNG so every lighting variant gets an identical layout
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randInt = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
