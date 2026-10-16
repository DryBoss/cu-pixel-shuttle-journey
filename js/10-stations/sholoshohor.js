'use strict';
// js/10-stations/sholoshohor.js
// Defines: buildSholoshohor

// Sholosohor Junction: a long station building with a taller centre block, a
// signal cabin and semaphore signals (the platform in front keeps its canopy)
function buildSholoshohor(p, lit) {
  const W = 420, H = 76, [c, g] = makeCanvas(W, H), rng = mulberry32(8), base = 62, bx = 50, w = 230, cx = bx + (w >> 1);
  rect(g, 0, 62, W, H - 62, p.gray);
  ditherRect(g, 0, 60, W, 2, p.gray, 8);
  for (let i = 0; i < W * 3; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, 62, H - 1), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  const wallTop = base - 24;
  rect(g, bx, wallTop, w, 24, p.red);
  for (let y = wallTop + 2; y < base - 3; y += 3) rect(g, bx, y, w, 1, p.rust);        // brick courses
  rect(g, bx + w - 3, wallTop, 3, 24, p.rust);
  rect(g, bx, base - 3, w, 3, p.grayLight);
  rect(g, bx, wallTop, w, 1, p.white);
  for (let r = 0; r < 8; r++) rect(g, bx - 2 + Math.floor(r * 1.5), wallTop - 1 - r, w + 4 - Math.floor(r * 3), 1, r === 7 ? p.ink : r % 2 ? p.grayDark : p.gray);
  for (let x = bx + 8; x + 6 <= bx + w - 6; x += 14) {
    if (Math.abs(x + 3 - cx) < 40) continue;
    rect(g, x, wallTop + 5, 6, 12, lit ? PALETTE.amber : p.brownDark);
    rect(g, x - 1, wallTop + 4, 8, 1, p.white); rect(g, x - 1, wallTop + 17, 8, 1, p.white);
  }
  const cw = 70, ctop = base - 46;                                          // the taller centre block
  rect(g, cx - (cw >> 1), ctop, cw, 43, p.red);
  for (let y = ctop + 2; y < base - 3; y += 3) rect(g, cx - (cw >> 1), y, cw, 1, p.rust);
  rect(g, cx - (cw >> 1), ctop, 2, 43, p.white); rect(g, cx + (cw >> 1) - 2, ctop, 2, 43, p.white);
  for (let r = 0; r < 10; r++) rect(g, cx - 38 + Math.floor(r * 3.5), ctop - 1 - r, 76 - Math.floor(r * 7), 1, r === 9 ? p.ink : r % 2 ? p.grayDark : p.gray);
  rect(g, cx - 31, ctop + 4, 62, 9, p.white);
  drawText(g, 'SHOLOSOHOR JN', cx - 26, ctop + 6, p.ink);
  for (const wx of [cx - 25, cx - 3, cx + 19]) {
    rect(g, wx, ctop + 17, 6, 10, lit ? PALETTE.glow : p.indigo); rect(g, wx - 1, ctop + 16, 8, 1, p.white); rect(g, wx - 1, ctop + 27, 8, 1, p.white);
  }
  rect(g, cx - 7, base - 20, 14, 17, lit ? PALETTE.amber : p.brownDark); rect(g, cx - 8, base - 21, 16, 1, p.white);   // entrance
  const sx = bx + w + 18, cabTop = base - 24;                                // signal cabin
  rect(g, sx, base - 12, 18, 12, p.rust);
  for (let y = base - 10; y < base; y += 3) rect(g, sx, y, 18, 1, p.brown);
  rect(g, sx - 1, cabTop + 2, 20, 10, p.white);
  for (let x = sx + 1; x < sx + 17; x += 5) rect(g, x, cabTop + 4, 4, 6, lit ? PALETTE.glow : p.skyMid);
  for (let r = 0; r < 3; r++) rect(g, sx - 2 + r * 2, cabTop + 1 - r, 22 - r * 4, 1, p.grayDark);
  for (let k = 0; k < 9; k++) px(g, sx - 9 + k, base - 12 + k + 3, p.grayLight);       // steps up to the cabin
  const signal = (x, up) => {
    rect(g, x, 20, 2, 42, p.grayDark);
    for (let y = 26; y < 60; y += 4) px(g, x + 2, y, p.gray);
    for (let k = 0; k < 9; k++) { px(g, x + 2 + k, up ? 28 - (k >> 1) : 26 + k, p.red); px(g, x + 2 + k, up ? 29 - (k >> 1) : 27 + k, p.red); }
    rect(g, x, 17, 2, 3, lit ? PALETTE.glow : p.grayDark);
  };
  signal(bx - 26, false); signal(sx + 40, true);
  for (let x = 0; x < 28; x++) for (let y = 58; y < H; y++) {
    if (bayer(x, y) < (28 - x) / 28 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(W - 1 - x, y) < (28 - x) / 28 * 16) g.clearRect(W - 1 - x, y, 1, 1);
  }
  return c;
}
