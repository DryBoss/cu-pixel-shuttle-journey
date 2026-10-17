'use strict';
// js/06-landscapes/khulshi-trees.js
// Defines: shadeTree, canopyFringe

// A big shade tree standing just behind a boundary wall: a short trunk and a wide rounded crown
// (mango, mahogany or jackfruit). cy = crown centre row, wallTop = the row where the wall's top is.
function shadeTree(g, p, cx, cy, wallTop, rw, rh, seed, jack) {
  rect(g, cx - 1, cy, 3, wallTop - cy + 8, p.brownDark); rect(g, cx - 1, cy, 1, wallTop - cy + 8, p.brown);
  leafyCrown(g, p, cx, cy, rw, rh, seed, jack);
}

// The same tree's branches hanging over the wall: shade on the wall's face and drooping leaf fringes
// along its top. Drawn after the wall.
function canopyFringe(g, p, cx, wallTop, rw, seed) {
  const fr = mulberry32(seed);
  ditherRect(g, cx - rw, wallTop, rw * 2, 10, p.grayDark, 5);
  for (let dx = -rw + 3; dx <= rw - 3; dx++) {
    if (fr() < 0.3) continue;
    const len = 2 + Math.floor(fr() * 6 * (1 - Math.abs(dx) / rw) + 1), y0 = wallTop - 5;
    for (let j = 0; j < len + 5; j++) px(g, cx + dx, y0 + j, j > len + 2 ? p.green : j % 3 ? p.greenDark : p.greenDeep);
    if (fr() < 0.25) px(g, cx + dx, y0 + len + 5, p.grassLight);
  }
}
