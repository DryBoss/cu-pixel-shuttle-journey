'use strict';
// js/04-world/scenery-sprites.js
// Defines: PALM, HAYSTACK, HAYSTACK_BIG, BANANA2, BETEL_CROWN

// =====================================================================
// 5. WORLD LAYERS
// =====================================================================
// Every layer is a pre-rendered tile whose width is a multiple of 4, so
// Bayer dither patterns line up across the seam and it repeats forever.

// --- scenery props ---------------------------------------------------
const PALM = [
  '...aaa.aaa...',
  '.aa...a...aa.',
  'a...bbabb...a',
  '...b.....b...',
  '..b.......b..',
  '.b.........b.',
];
const HAYSTACK = [
  '..s..',
  '.hhh.',
  'hhhhd',
  'hhhdd',
];
const HAYSTACK_BIG = [
  '....s....',
  '...hhh...',
  '..hhhhh..',
  '.hhhhhhd.',
  'hhhhhhhdd',
  'hhhhhhddd',
  '.hhhhhdd.',
];
const BANANA2 = [                        // l/d leaves, s stem, b a dried leaf hanging down
  'l.......l',
  '.l.....l.',
  'd.l...l.d',
  '.d.lsl.d.',
  '..d.s.d..',
  '...bs....',
  '...bs....',
  '....s....',
];
const BETEL_CROWN = [                    // supari palm: small crown, a bunch of nuts
  '.a...a.',
  'a.aba.a',
  '..bbb..',
  '.a.n.a.',
];
