'use strict';
// js/06-landscapes/colony-quarters.js
// Defines: quartersPorchX, railwayQuarters, beraFence, wireFence

// --- the old Railway Colony: long single-storey quarters with tin roofs and a small porch,
//     fenced with woven bamboo (bera) or rusted wire --------------------------------------
const quartersPorchX = (x, w, seed) => x + 6 + Math.floor(hash2(seed & 1023, 7) * Math.max(1, w - 24));

// brick: red brick courses, otherwise a faded yellow lime-wash. Roof: rust-streaked corrugated tin
function railwayQuarters(g, p, lit, x, base, w, brick, seed) {
  const rng = mulberry32(seed), wallH = 10, top = base - wallH, dir = rng() < 0.5 ? 1 : -1, porchX = quartersPorchX(x, w, seed);
  if (brick) {
    rect(g, x, top, w, wallH, p.red);
    for (let y = top + 1; y < base - 1; y += 2) rect(g, x, y, w, 1, p.rust);                           // mortar courses
    for (let xx = x; xx < x + w; xx++) for (let y = top; y < base - 1; y += 2) if ((xx + (y & 2)) % 4 === 3) px(g, xx, y, p.rust);   // staggered joints
    for (let n = 0; n < w * 0.5; n++) px(g, x + randInt(rng, 0, w - 1), top + randInt(rng, 0, wallH - 2), rng() < 0.5 ? p.brown : p.tan);   // chipped and weathered
  } else {
    rect(g, x, top, w, wallH, p.cream);
    ditherRect(g, x, top, w, wallH, p.peach, 5);                                                       // washed-out yellow
    for (let n = 0; n < w * 0.6; n++) rect(g, x + randInt(rng, 0, w - 2), top + randInt(rng, 1, wallH - 3), 2, 1, rng() < 0.5 ? p.tan : p.cloudShade);   // peeling lime wash
  }
  for (let xx = x; xx < x + w; xx++) {                                                                 // damp creeping up from the ground
    const hgt = 2 + Math.floor(hash2(xx >> 1, seed & 255) * 4);
    for (let j = 0; j < hgt; j++) if (bayer(xx, base - 1 - j) < 12 - j * 3) px(g, xx, base - 1 - j, p.brownDark);
  }
  ditherRect(g, x + w - 3, top, 3, wallH, p.grayDark, 5);
  rect(g, x, base - 1, w, 1, p.brownDark);
  for (let wx = x + 4; wx + 3 <= x + w - 3; wx += 9) {                                                 // shuttered windows
    if (wx + 4 > porchX - 1 && wx < porchX + 11) continue;
    const on = lit && rng() < 0.55;
    rect(g, wx - 1, top + 2, 5, 1, p.white);
    rect(g, wx, top + 3, 3, 4, on ? PALETTE.glow : p.indigo);
    rect(g, wx - 1, top + 3, 1, 4, p.greenDark); rect(g, wx + 3, top + 3, 1, 4, p.greenDark);
    rect(g, wx - 1, top + 7, 5, 1, p.white);
  }
  rect(g, porchX + 3, base - 7, 4, 7, lit ? PALETTE.amber : p.brownDark);                              // the doorway, open into the dark
  rect(g, porchX + 4, base - 7, 1, 7, lit ? PALETTE.glow : p.ink);
  rect(g, porchX - 1, top + 2, 12, 1, p.brownDark);                                                    // porch: lean-to tin roof on two posts
  for (let xx = porchX - 1; xx < porchX + 11; xx++) px(g, xx, top + 1, xx & 1 ? p.rust : p.brown);
  rect(g, porchX, top + 3, 1, wallH - 3, p.brownDark); rect(g, porchX + 9, top + 3, 1, wallH - 3, p.brownDark);
  rect(g, porchX - 1, base - 1, 12, 1, p.grayLight);                                                   // the step
  for (let r = 0; r < 5; r++) {                                                                        // sloping rust-coloured tin roof, eaves overhanging
    const y = top - 1 - r, x0 = dir > 0 ? x - 2 + r : x - 2, rw = w + 4 - r;
    for (let xx = x0; xx < x0 + rw; xx++) {
      const k = hash2(xx >> 1, y + (seed & 63));
      const tone = seed % 3;                                                                          // some roofs more weathered than others
      px(g, xx, y, xx % 3 === 0 ? p.brownDark : k < (tone === 1 ? 0.35 : 0.55) ? p.rust : k < (tone === 2 ? 0.6 : 0.8) ? p.brown : k < (tone === 2 ? 0.95 : 0.9) ? p.orange : p.grayLight);
    }
  }
  rect(g, x - 2, top, w + 4, 1, p.brownDark);                                                          // eave shadow
  const cx = x + 5 + randInt(rng, 0, Math.max(1, w - 12));
  rect(g, cx, top - 8, 2, 4, p.rust); px(g, cx, top - 8, p.ink); px(g, cx + 1, top - 8, p.ink);        // kitchen chimney
}

// Woven bamboo fence: herringbone strips between bamboo posts, a broken panel here and there
function beraFence(g, p, x, len, base, seed, h = 5) {
  const rng = mulberry32(seed);
  for (let i = 0; i < len; i++) {
    const hh = rng() < 0.06 ? h - 2 : h;
    for (let j = 0; j < hh; j++) px(g, x + i, base - 1 - j, ((i >> 1) + j) & 1 ? p.tan : p.paddy);
    if (rng() < 0.05) px(g, x + i, base - 1 - randInt(rng, 0, hh - 1), p.brownDark);
  }
  for (let i = 0; i <= len; i += 12) {
    const xx = x + Math.min(i, len - 1);
    rect(g, xx, base - h - 1, 1, h + 1, p.brown); px(g, xx, base - h - 1, p.brownDark);
  }
}

// Rusted wire fence: leaning posts, three sagging strands and a little mesh
function wireFence(g, p, x, len, base, seed, h = 6) {
  const rng = mulberry32(seed);
  for (let i = 0; i < len; i++) for (const r of [1, 3, 5]) {
    if (r > h) continue;
    const sag = Math.round(Math.sin((i % 9) / 9 * Math.PI));
    px(g, x + i, base - r + sag, (i + r) % 4 ? p.rust : p.grayDark);
    if ((i + r * 2) % 5 === 0) px(g, x + i, base - r - 1 + sag, p.rust);
  }
  for (let i = 0; i <= len; i += 9) {
    const lean = rng() < 0.15 ? 1 : 0, xx = x + Math.min(i, len - 1);
    for (let j = 0; j <= h; j++) px(g, xx + (j > h - 2 ? lean : 0), base - j, j % 3 === 0 ? p.grayDark : p.brown);
  }
}
