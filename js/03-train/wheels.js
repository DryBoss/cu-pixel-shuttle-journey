'use strict';
// js/03-train/wheels.js
// Defines: buildWheels

// 7x7 wheel with four spokes; frames cover a quarter turn (spoke symmetry)
function buildWheels(p) {
  const frames = [];
  for (let f = 0; f < CONFIG.WHEEL_FRAMES; f++) {
    const [c, g] = makeCanvas(7, 7);
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++) {
        const d = Math.hypot(x - 3, y - 3);
        if (d <= 3.4) px(g, x, y, d > 2.4 ? p.ink : p.grayDark);
      }
    const base = (f / CONFIG.WHEEL_FRAMES) * Math.PI / 2;
    for (let k = 0; k < 4; k++) {
      const a = base + k * Math.PI / 2;
      for (const r of [1, 2]) px(g, 3 + Math.round(Math.cos(a) * r), 3 + Math.round(Math.sin(a) * r), p.grayLight);
    }
    px(g, 3, 3, p.gray);
    frames.push(c);
  }
  return frames;
}
