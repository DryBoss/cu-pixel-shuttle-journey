'use strict';
// js/05-terrain/sway.js
// Defines: KASH_BLADES, GRASS_BLADES, SWAY

// Each kind: size(a, b) -> [w, h, anchor x, anchor y]; paint(g, p, lean, a, b, ax, ay)
const KASH_BLADES = [[[-3, 4], [2, 5]], [[-2, 5], [3, 3], [1, 4]], [[3, 4], [-2, 3]]];
const GRASS_BLADES = [[[-3, 0.6], [-1, 1], [1, 0.8], [3, 0.55]], [[-2, 0.8], [0, 0.55], [2, 1], [4, 0.7]], [[-4, 0.5], [-2, 0.9], [0, 0.65], [2, 1], [3, 0.5]], [[-1, 1], [1, 0.7], [3, 0.85]]];
const SWAY = {
  coco: {                                             // coconut palm: a = height, b = trunk lean
    size: h => [23, h + 4, 11, h + 2],
    paint(g, p, lean, h, b, ax, ay) { palm(g, ax, ay, h, b + lean, p.brown, p.green, p.greenDark); },
  },
  betel: {                                            // betel-nut palm: tall, thin, ringed trunk
    size: h => [13, h + 5, 6, h + 4],
    paint(g, p, lean, h, b, ax, ay) {
      const bend = b + lean * 0.6;
      for (let i = 0; i < h; i++) px(g, ax + Math.round(bend * (i / h) ** 2), ay - i, i % 3 ? p.grayLight : p.gray);
      stamp(g, BETEL_CROWN, ax + Math.round(bend) - 3 + (lean > 1 ? 1 : 0), ay - h - 3,
            { a: p.green, b: p.greenDark, n: p.paddy });
    },
  },
  banana: {
    size: () => [13, 8, 6, 7],
    paint(g, p, lean, a, b, ax, ay) {
      const cols = { l: p.grassLight, d: p.grass, s: p.green, b: p.tan };
      BANANA2.forEach((row, r) => stamp(g, [row], ax - 4 + (r < 5 ? Math.round(lean * (5 - r) / 5) : 0), ay - 7 + r, cols));
    },
  },
  kash: {                                             // kash phool: a = height, b = variant
    size: h => [14, h + 2, 5, h + 1],
    paint(g, p, lean, h, v, ax, ay) {
      const stalk = k => ax + Math.round(lean * 1.5 * (k / h) ** 2);
      for (const [dx, bh] of KASH_BLADES[v]) for (let k = 0; k < bh; k++) px(g, ax + Math.round(dx * (k + 1) / bh), ay - k, k < bh - 2 ? p.green : p.grass);
      for (let k = 0; k < h - 4; k++) px(g, stalk(k), ay - k, p.tan);
      const hx = stalk(h - 4), hy = ay - h + 4;    // fluffy white head, drooping downwind
      for (let j = 0; j < 6; j++) {
        const x = hx + Math.round((lean + 0.5) * j / 4), y = hy - j;
        px(g, x, y, j === 5 ? p.cloudShade : p.white);
        if (j > 0 && j < 5) px(g, x - 1, y, lean >= 2 || (j + v) % 2 ? p.white : p.cloudShade);
        if (j > 1 && j < 4 && v !== 1) px(g, x + 1, y + 1, p.cloudShade);
      }
    },
  },
  bamboo: {                                           // bamboo clump: a = height, b = culms
    size: h => [23, h + 3, 11, h + 2],
    paint(g, p, lean, h, n, ax, ay) {
      for (let i = 0; i < n; i++) {
        const spread = (i - (n - 1) / 2) * 2.2, hh = Math.round(h - Math.abs(spread) * 1.5);
        for (let k = 0; k < hh; k++) {
          const x = ax + Math.round(spread * k / hh * 1.6 + (lean + 0.5) * (k / hh) ** 2 * 2.5);
          px(g, x, ay - k, k % 4 === 3 ? p.greenDark : p.grass);
          if (k > hh * 0.45 && k % 2 === (i & 1)) px(g, x + (k % 4 < 2 ? -1 : 1), ay - k + 1, p.green);
        }
      }
    },
  },
  jhau: {                                             // Jhau (casuarina): a = height, b = variant
    size: h => [27, h + 3, 13, h + 2],
    paint(g, p, lean, h, v, ax, ay) { jhauTree(g, p, ax, ay, h, 100 + v * 17, 0, lean); },
  },
  grass: {                                            // tall grass: a = height, b = variant
    size: h => [13, h + 2, 6, h + 1],
    paint(g, p, lean, h, v, ax, ay) {
      for (const [dx, f] of GRASS_BLADES[v % GRASS_BLADES.length]) {
        const bl = Math.max(3, Math.round(h * f));
        for (let k = 0; k < bl; k++) {
          const r = k / bl;
          px(g, ax + Math.round(dx * r * 1.4 + lean * r * r * 2.4), ay - k, r > 0.7 ? p.grassLight : (dx + k) & 1 ? p.grass : p.greenDark);
        }
      }
    },
  },
  fern: {
    size: () => [13, 7, 6, 6],
    paint(g, p, lean, a, b, ax, ay) {
      const arc = [1, 3, 4, 4, 3];
      for (const d of [-1, 1]) for (let k = 0; k < 5; k++)
        px(g, ax + d * (k + 1) + (k > 2 ? Math.round(lean * 0.7) : 0), ay - arc[k] + (k > 3 ? 1 : 0), k > 2 ? p.grass : p.green);
      rect(g, ax, ay - 2, 1, 3, p.greenDark);
    },
  },
};
