'use strict';
// js/04-world/scenery-draw.js
// Defines: palm, roundTree, house

function palm(g, x, base, h, lean, trunk, leaf, leafDark) {
  for (let i = 0; i < h; i++) px(g, x + Math.round(lean * (i / h) ** 2), base - i, trunk);
  stamp(g, PALM, x + lean - 6, base - h - 2, { a: leaf, b: leafDark });
}

function roundTree(g, x, base, r, trunkH, p, seed) {
  const rng = mulberry32(seed), cy = base - trunkH - r;
  rect(g, x, cy, 1, base - cy, p.brownDark);
  disc(g, x, cy, r, p.greenDark);
  disc(g, x - 1, cy - 1, Math.max(1, r - 2), p.green);
  for (let i = 0; i < r * 2; i++) {
    const a = rng() * Math.PI * 2, d = rng() * (r - 1) * 0.7;
    px(g, Math.round(x - 2 + Math.cos(a) * d), Math.round(cy - 2 + Math.sin(a) * d), p.grass);
  }
}

// Village house: woven bamboo (bera) walls, corrugated tin (or rusty) gable
// roof, and optionally a bamboo fence running off to the right
function house(g, x, base, w, p, tin, lightOn, fence = 0) {
  const wallH = 6, top = base - wallH;
  for (let yy = top; yy < base; yy++)
    for (let xx = x; xx < x + w; xx++) px(g, xx, yy, (xx + (yy >> 1)) & 1 ? p.tan : p.cream);
  rect(g, x, top + 2, w, 1, p.brown);                 // tie beam
  rect(g, x, base - 1, w, 1, p.brown);                // mud plinth
  for (let xx = x + w + 1; xx <= x + w + fence; xx++) if ((xx - x) % 2) rect(g, xx, base - 3, 1, 3, p.tan);
  if (fence) rect(g, x + w + 1, base - 2, fence, 1, p.brown);
  rect(g, x + 2, base - 4, 2, 3, p.brownDark);
  rect(g, x + w - 5, base - 4, 2, 2, lightOn ? PALETTE.glow : p.brownDark);
  const rh = 4, roof = tin ? p.grayLight : p.rust, ridge = tin ? p.gray : p.brown;
  for (let r = 0; r < rh; r++) {
    const inset = rh - 1 - r, x0 = x - 1 + inset, rw = w + 2 - inset * 2;
    rect(g, x0, top - rh + r, rw, 1, r === 0 ? ridge : roof);
    if (r > 0) for (let xx = x0 + 1; xx < x0 + rw; xx += 2) px(g, xx, top - rh + r, ridge);
  }
}
