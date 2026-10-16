'use strict';
// js/06-landscapes/mill-buildings.js
// Defines: millShed, millChimney, millTower, millBales, millWall, millGate

// --- the jute mill: sawtooth sheds, a tall chimney, a water tower, a boundary wall, stacked bales
function millShed(g, p, lit, x, base, w, h) {
  rect(g, x, base - h, w, h, p.rust);
  for (let y = base - h + 2; y < base - 2; y += 3) rect(g, x, y, w, 1, p.brown);                       // brick courses
  for (let wx = x + 3; wx + 3 <= x + w - 2; wx += 7) rect(g, wx, base - h + 4, 3, 5, lit ? PALETTE.glow : p.indigo);
  rect(g, x, base - h - 1, w, 1, p.grayLight);
  const teeth = Math.max(2, Math.floor(w / 14));
  for (let t = 0; t < teeth; t++) {                                                                      // sawtooth roof, glazed on the steep face
    const tx = x + Math.floor(t * w / teeth), tw = Math.floor((t + 1) * w / teeth) - tx + x;
    for (let i = 0; i < tw; i++) { const ht = 1 + Math.floor(i * 7 / tw); rect(g, tx + i, base - h - 1 - ht, 1, ht, i & 1 ? p.gray : p.grayLight); }
    rect(g, tx + tw - 2, base - h - 8, 2, 7, lit ? PALETTE.glow : p.skyMid);
  }
}
function millChimney(g, p, x, base, h) {                                                                 // tall tapering brick chimney
  for (let y = 0; y < h; y++) {
    const half = 2 + Math.floor((h - y) * 0.05);
    rect(g, x - half, base - y - 1, half * 2 + 1, 1, y % 9 === 8 ? p.brown : p.rust);
  }
  rect(g, x - 3, base - h, 7, 2, p.grayDark);
  rect(g, x - 2, base - h + 5, 5, 2, p.white); rect(g, x - 2, base - h + 9, 5, 2, p.white);
}
function millTower(g, p, x, base) {                                                                      // water tank on a steel frame
  rect(g, x - 6, base - 27, 13, 1, p.grayDark);
  rect(g, x - 5, base - 26, 11, 7, p.grayLight); rect(g, x - 5, base - 26, 11, 1, p.white); rect(g, x - 5, base - 20, 11, 1, p.gray);
  for (const dx of [-4, 4]) rect(g, x + dx, base - 19, 1, 19, p.grayDark);
  for (let k = 0; k < 4; k++) { px(g, x - 3 + k, base - 17 + k * 4, p.grayDark); px(g, x + 3 - k, base - 17 + k * 4, p.grayDark); }
}
function millBales(g, p, x, base, cols, rows) {                                                          // stacked jute bales
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols - (r >> 1); c++) {
      const bx = x + c * 6 + (r & 1) * 3, by = base - (r + 1) * 5;
      rect(g, bx, by, 6, 5, (c + r) & 1 ? p.tan : p.paddy);
      rect(g, bx, by + 2, 6, 1, p.brown); px(g, bx + 5, by, p.brownDark);
    }
}
function millWall(g, p, x0, x1, base) {
  rect(g, x0, base - 7, x1 - x0, 7, p.cream);
  rect(g, x0, base - 8, x1 - x0, 1, p.grayLight);
  for (let x = x0 + 8; x < x1; x += 14) rect(g, x, base - 8, 2, 8, p.tan);
  for (let x = x0; x < x1; x += 3) px(g, x, base - 9, p.grayDark);                                       // wire on top
}
function millGate(g, p, x, base) {
  rect(g, x, base - 12, 3, 12, p.cream); rect(g, x + 45, base - 12, 3, 12, p.cream);
  rect(g, x - 1, base - 13, 5, 1, p.grayLight); rect(g, x + 44, base - 13, 5, 1, p.grayLight);
  rect(g, x + 3, base - 3, 42, 3, p.grayDark);
  rect(g, x + 2, base - 13, 44, 9, p.white); rect(g, x + 2, base - 13, 44, 1, p.grayDark); rect(g, x + 2, base - 5, 44, 1, p.grayDark);
  drawText(g, 'JUTE MILLS', x + 4, base - 11, p.ink);
}
