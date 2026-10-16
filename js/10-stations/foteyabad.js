'use strict';
// js/10-stations/foteyabad.js
// Defines: buildFoteyabad

// Foteyabad: Jhawtola's idea done better: a big red-brick station with a columned
// portico, a clock in the pediment, a slate roof, a signal cabin and semaphores
// (still no shed over the platform)
function buildFoteyabad(p, lit) {
  const W = 420, H = 84, [c, g] = makeCanvas(W, H), rng = mulberry32(19), base = 68, bx = 40, w = 250, cx = bx + (w >> 1), wallTop = base - 30;
  rect(g, 0, 68, W, H - 68, p.gray);
  ditherRect(g, 0, 66, W, 2, p.gray, 8);
  for (let i = 0; i < W * 3; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, 68, H - 1), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  const dark = lit ? PALETTE.amber : p.brownDark;
  rect(g, bx, wallTop, w, 30, p.red);
  for (let y = wallTop + 2; y < base - 3; y += 3) rect(g, bx, y, w, 1, p.rust);
  rect(g, bx + w - 3, wallTop, 3, 30, p.rust);
  rect(g, bx, base - 3, w, 3, p.grayLight);
  rect(g, bx, base - 14, w, 1, p.white);
  rect(g, bx - 1, wallTop - 1, w + 2, 2, p.white);
  for (let r = 0; r < 9; r++) rect(g, bx - 2 + Math.floor(r * 1.4), wallTop - 2 - r, w + 4 - Math.floor(r * 2.8), 1, r === 8 ? p.ink : r % 2 ? p.grayDark : p.gray);
  for (let x = bx + 10; x + 8 <= bx + w - 6; x += 18) {
    if (Math.abs(x + 4 - cx) < 46) continue;
    rect(g, x - 1, wallTop + 4, 10, 1, p.white);
    rect(g, x, wallTop + 5, 8, 9, lit ? PALETTE.glow : p.indigo);
    rect(g, x - 2, wallTop + 5, 2, 9, p.greenDark); rect(g, x + 8, wallTop + 5, 2, 9, p.greenDark);
    rect(g, x - 1, wallTop + 14, 10, 1, p.white);
    rect(g, x + 2, base - 13, 4, 1, dark); rect(g, x + 1, base - 12, 6, 1, dark); rect(g, x, base - 11, 8, 8, dark);
    px(g, x + 3, base - 14, p.white); px(g, x + 4, base - 14, p.white);
  }
  for (let r = 0; r < 10; r++) {                                              // pediment over the portico
    const hw = 33 - Math.floor(r * 3.3), y = wallTop - 1 - r;
    rect(g, cx - hw, y, hw * 2, 1, r === 9 ? p.white : p.red);
    px(g, cx - hw, y, p.white); px(g, cx + hw - 1, y, p.white);
  }
  rect(g, cx - 33, wallTop, 66, 3, p.white);                                  // entablature
  rect(g, cx - 31, wallTop + 3, 62, 27, p.red);
  for (let y = wallTop + 4; y < base - 3; y += 3) rect(g, cx - 31, y, 62, 1, p.rust);
  disc(g, cx, wallTop - 4, 3, p.white); disc(g, cx, wallTop - 4, 2, lit ? PALETTE.glow : p.cream);
  px(g, cx, wallTop - 5, p.ink); px(g, cx, wallTop - 4, p.ink); px(g, cx + 1, wallTop - 4, p.ink);
  for (const dx of [-27, -9, 9, 27]) { rect(g, cx + dx - 1, wallTop + 3, 3, 27, p.white); rect(g, cx + dx - 2, wallTop + 3, 5, 1, p.cloudShade); rect(g, cx + dx - 2, base - 4, 5, 1, p.cloudShade); }
  rect(g, cx - 7, base - 24, 14, 21, p.white); rect(g, cx - 5, base - 22, 10, 19, dark); rect(g, cx, base - 22, 1, 19, p.white);   // doors
  for (const dx of [-20, 14]) { rect(g, cx + dx, wallTop + 6, 6, 9, lit ? PALETTE.glow : p.indigo); rect(g, cx + dx - 1, wallTop + 5, 8, 1, p.white); rect(g, cx + dx - 1, wallTop + 15, 8, 1, p.white); }
  rect(g, cx - 40, wallTop - 28, 80, 15, p.white);                            // the name on the roof
  rect(g, cx - 39, wallTop - 27, 78, 13, p.greenDark);
  drawText2x(g, 'FOTEYABAD', cx - 35, wallTop - 26, p.white);
  rect(g, cx - 1, wallTop - 13, 2, 4, p.grayDark);
  const sx = bx + w + 20, cabTop = base - 26;                                  // signal cabin
  rect(g, sx, base - 12, 18, 12, p.red);
  for (let y = base - 10; y < base; y += 3) rect(g, sx, y, 18, 1, p.rust);
  rect(g, sx - 1, cabTop + 2, 20, 12, p.white);
  for (let x = sx + 1; x < sx + 17; x += 5) rect(g, x, cabTop + 4, 4, 7, lit ? PALETTE.glow : p.skyMid);
  for (let r = 0; r < 3; r++) rect(g, sx - 2 + r * 2, cabTop + 1 - r, 22 - r * 4, 1, p.grayDark);
  for (let k = 0; k < 9; k++) px(g, sx - 9 + k, base - 12 + k + 3, p.grayLight);
  const signal = (x, up) => {
    rect(g, x, 26, 2, 42, p.grayDark);
    for (let y = 32; y < 66; y += 4) px(g, x + 2, y, p.gray);
    for (let k = 0; k < 9; k++) { px(g, x + 2 + k, up ? 34 - (k >> 1) : 32 + k, p.red); px(g, x + 2 + k, up ? 35 - (k >> 1) : 33 + k, p.red); }
    rect(g, x, 23, 2, 3, lit ? PALETTE.glow : p.grayDark);
  };
  signal(bx - 26, true); signal(sx + 40, false);
  for (let x = 0; x < 28; x++) for (let y = 64; y < H; y++) {
    if (bayer(x, y) < (28 - x) / 28 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(W - 1 - x, y) < (28 - x) / 28 * 16) g.clearRect(W - 1 - x, y, 1, 1);
  }
  return c;
}
