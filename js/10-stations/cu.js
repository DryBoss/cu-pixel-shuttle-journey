'use strict';
// js/10-stations/cu.js
// Defines: buildCU

// The university station (one platform, two tracks): a long cream building with a
// green roof and a taller entrance block across the tracks, the second track in
// front of it ending at a buffer stop
function buildCU(p, lit) {
  const W = 520, H = 84, [c, g] = makeCanvas(W, H), rng = mulberry32(73), base = 68, bx = 70, w = 250, cx = bx + (w >> 1), wallTop = base - 26, END = W - 60;
  rect(g, 0, 68, W, H - 68, p.gray);
  ditherRect(g, 0, 66, W, 2, p.gray, 8);
  for (let i = 0; i < W * 3; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, 68, H - 1), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  for (let x = 2; x < END; x += 8) { rect(g, x, 71, 4, 3, p.brown); px(g, x, 71, p.tan); }       // the second track
  rect(g, 0, 71, END, 1, p.grayLight); rect(g, 0, 72, END, 1, p.grayDark);
  rect(g, END, 64, 2, 9, p.grayDark); rect(g, END - 1, 64, 4, 3, p.red);
  rect(g, bx, wallTop, w, 26, p.cream);
  rect(g, bx + w - 3, wallTop, 3, 26, p.tan);
  rect(g, bx, base - 3, w, 3, p.grayLight);
  rect(g, bx, wallTop, w, 2, p.green);
  for (let r = 0; r < 7; r++) rect(g, bx - 2 + Math.floor(r * 1.5), wallTop - 1 - r, w + 4 - Math.floor(r * 3), 1, r === 6 ? p.greenDeep : r % 2 ? p.greenDark : p.green);
  for (let x = bx + 8; x + 7 <= bx + w - 6; x += 15) {
    if (Math.abs(x + 3 - cx) < 40) continue;
    rect(g, x - 1, wallTop + 4, 9, 1, p.white);
    rect(g, x, wallTop + 5, 7, 12, lit ? PALETTE.glow : p.skyMid);
    rect(g, x + 3, wallTop + 5, 1, 12, p.white);
    rect(g, x - 1, wallTop + 17, 9, 1, p.white);
  }
  const ew = 86, etop = base - 40;                                             // taller entrance block
  rect(g, cx - (ew >> 1), etop, ew, 37, p.cream);
  rect(g, cx - (ew >> 1) - 2, etop - 2, ew + 4, 3, p.white);
  rect(g, cx - (ew >> 1), etop + 1, ew, 2, p.green);
  rect(g, cx - 40, etop + 5, 80, 16, p.green); rect(g, cx - 39, etop + 6, 78, 14, p.greenDark);       // name board
  drawText(g, 'CHITTAGONG UNIVERSITY', cx - (textWidth('CHITTAGONG UNIVERSITY') >> 1), etop + 8, p.white);
  drawText(g, 'RAILWAY STATION', cx - (textWidth('RAILWAY STATION') >> 1), etop + 14, p.glow);
  rect(g, cx - 10, base - 20, 20, 17, p.white); rect(g, cx - 8, base - 18, 16, 15, lit ? PALETTE.amber : p.brownDark); rect(g, cx - 1, base - 18, 2, 15, p.white);
  for (const dx of [-30, 24]) { rect(g, cx + dx, etop + 26, 6, 8, lit ? PALETTE.glow : p.skyMid); rect(g, cx + dx - 1, etop + 25, 8, 1, p.white); }
  for (let x = 0; x < 28; x++) for (let y = 64; y < H; y++) {
    if (bayer(x, y) < (28 - x) / 28 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(W - 1 - x, y) < (28 - x) / 28 * 16) g.clearRect(W - 1 - x, y, 1, 1);
  }
  return c;
}
