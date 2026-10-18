'use strict';
// js/06-landscapes/mill-buildings.js
// Defines: MILL_GATE_W, millShed, millChimney, millSmoke, millTower, millBales, millWall, millGate

// --- the Amin Jute Mill: weathered brick sheds with sawtooth roofs, towering chimneys, steel water towers,
//     a long dirty boundary wall with barbed wire, one heavy gate, and organised stacks of jute bales
const MILL_GATE_W = 100;

// A sprawling brick shed under a sawtooth roof: every tooth has a gentle tin slope rising to the right
// and a steep glazed face, all facing one way. Weathered rust-red brick, stained, with loading bays.
function millShed(g, p, lit, x, base, w, h, seed = 1) {
  const rng = mulberry32(seed), top = base - h;
  rect(g, x, top, w, h, p.rust);
  for (let y = top + 2; y < base - 2; y += 3) rect(g, x, y, w, 1, p.brown);                            // brick courses
  ditherRect(g, x, top, w, h, p.brownDark, 2);                                                         // soot and age
  ditherRect(g, x, base - 8, w, 8, p.brown, 5);                                                        // splashed with monsoon mud
  for (let i = 0; i < w / 5; i++) { const sx = x + randInt(rng, 0, w - 1), l = randInt(rng, 3, 9); for (let j = 0; j < l; j++) px(g, sx, top + 1 + j, p.brownDark); }   // rain streaks under the eaves
  for (let i = 0; i < w / 6; i++) px(g, x + randInt(rng, 0, w - 1), base - randInt(rng, 1, 6), p.cream);   // salt bloom on the brick
  for (let wx = x + 3; wx + 3 <= x + w - 2; wx += 7) {                                                 // tall barred factory windows
    if (hash2(wx, seed & 255) < 0.18) continue;
    rect(g, wx, top + 4, 3, 7, lit ? PALETTE.glow : p.indigo); rect(g, wx + 1, top + 4, 1, 7, p.ink); rect(g, wx, top + 7, 3, 1, p.ink);
  }
  for (let bx = x + 12; bx + 9 <= x + w - 4; bx += randInt(rng, 26, 40)) {                             // loading bays
    rect(g, bx, base - 11, 9, 11, p.ink); rect(g, bx - 1, base - 12, 11, 1, p.grayLight);
    if (lit) rect(g, bx + 1, base - 9, 7, 3, PALETTE.amber);
  }
  rect(g, x, top - 1, w, 1, p.grayLight);
  const teeth = Math.max(2, Math.floor(w / 15));
  for (let t = 0; t < teeth; t++) {                                                                      // sawtooth roof
    const tx = x + Math.floor(t * w / teeth), tw = Math.floor((t + 1) * w / teeth) - Math.floor(t * w / teeth), th = 9;
    for (let i = 0; i < tw - 3; i++) {                                                                   // the gentle tin slope, rising to the right
      const ht = 1 + Math.floor(i * (th - 2) / (tw - 3));
      rect(g, tx + i, top - 1 - ht, 1, ht, i & 1 ? p.gray : p.grayLight);
      px(g, tx + i, top - 1 - ht, p.grayDark);
    }
    rect(g, tx + tw - 3, top - 1 - th, 3, th, lit ? PALETTE.glow : p.skyMid);                           // the steep glazed face
    px(g, tx + tw - 3, top - th, lit ? PALETTE.amber : p.white); px(g, tx + tw - 2, top - th + 3, lit ? PALETTE.amber : p.skyLight);
    rect(g, tx + tw - 2, top - 1 - th, 1, th, p.grayDark);                                               // glazing bar
    rect(g, tx + tw - 3, top - 2 - th, 3, 1, p.grayDark);                                                // ridge flashing
    if (rng() < 0.4) { px(g, tx + 2, top - 3, p.rust); px(g, tx + 2, top - 2, p.rust); }
  }
}

// A towering tapering brick chimney with bands, iron hoops and a soot-blackened rim. (x, base) = centre of foot
function millChimney(g, p, x, base, h) {
  for (let y = 0; y < h; y++) {
    const half = 2 + Math.floor((h - y) * 0.05), yy = base - y - 1;
    rect(g, x - half, yy, half * 2 + 1, 1, y % 9 === 8 ? p.brown : (y & 1) ? p.rust : p.red);
    px(g, x + half, yy, p.brownDark); px(g, x + half - 1, yy, y & 1 ? p.brownDark : p.rust);          // shaded right side
    px(g, x - half, yy, p.red);
    if (y % 14 === 5) rect(g, x - half - 1, yy, half * 2 + 3, 1, p.grayDark);                          // iron hoops
  }
  rect(g, x - 4, base - h - 1, 9, 2, p.grayDark); rect(g, x - 4, base - h - 1, 9, 1, p.gray);        // flared rim
  rect(g, x - 3, base - h + 1, 7, 3, p.ink);                                                           // soot
  rect(g, x - 2, base - h + 6, 5, 2, p.white); rect(g, x - 2, base - h + 10, 5, 2, p.white);          // painted bands
  px(g, x, base - h - 4, p.grayDark); rect(g, x, base - h - 3, 1, 2, p.grayDark);                     // lightning rod
}

// The dark smog a chimney breathes out, slowly: a string of puffs that swell, thin out and drift
function millSmoke(tx, tipY, phase) {
  return { x0: tx - 10, x1: tx + 52, z: 5, draw(g, v, ox, oy, t) {
    for (let i = 0; i < 9; i++) {
      const a = (t * 0.06 + phase + i / 9) % 1, r = 2 + a * 7;
      const cx = Math.round(tx + ox + a * a * 26 + Math.sin(a * 7 + i * 2) * 1.6), cy = Math.round(tipY + oy - a * 42);
      const col = a < 0.25 ? v.p.ink : a < 0.55 ? v.p.grayDark : v.p.gray, dens = Math.round(16 * Math.pow(1 - a, 0.9));
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++)
        if (dx * dx + dy * dy <= r * r && bayer(cx + dx, cy + dy) < dens) px(g, cx + dx, cy + dy, col);
    }
  } };
}

// A tall steel-framed water tank on lattice legs with a conical roof and a ladder
function millTower(g, p, x, base) {
  const legH = 22, ty = base - legH - 12;
  rect(g, x - 9, base - legH - 1, 19, 1, p.grayDark);                                                  // platform
  rect(g, x - 8, ty, 17, 11, p.grayLight); rect(g, x - 8, ty, 17, 1, p.white);
  for (const by of [ty + 3, ty + 7]) rect(g, x - 8, by, 17, 1, p.gray);                                // riveted bands
  for (let rx = x - 7; rx < x + 8; rx += 3) { px(g, rx, ty + 2, p.gray); px(g, rx, ty + 5, p.gray); px(g, rx, ty + 9, p.gray); }
  rect(g, x + 7, ty, 2, 11, p.gray);                                                                   // shaded flank
  for (let r = 0; r < 4; r++) rect(g, x - 7 + r * 2, ty - 1 - r, 15 - r * 4, 1, r === 3 ? p.grayDark : p.gray);   // conical roof
  px(g, x, ty - 5, p.grayDark); px(g, x, ty - 6, p.gray);
  for (const dx of [-7, 7]) rect(g, x + dx, base - legH, 1, legH, p.grayDark);                         // lattice legs
  for (let bay = 0; bay < 3; bay++) {
    const y0 = base - legH + bay * 7;
    rect(g, x - 7, y0, 15, 1, p.gray);                                                                 // horizontal struts
    for (let k = 0; k < 7; k++) { px(g, x - 7 + Math.round(k * 14 / 7), y0 + k, p.grayDark); px(g, x + 7 - Math.round(k * 14 / 7), y0 + k, p.grayDark); }   // X bracing
  }
  for (let y = ty + 1; y < base; y += 2) px(g, x + 9, y, p.grayDark);                                  // ladder
  rect(g, x - 8, base - 1, 17, 1, p.grayDark);
}

// An organised stack of raw jute bales: tan and straw-yellow, each wrapped in thin dark steel strapping
function millBales(g, p, x, base, cols, rows) {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols - (r >> 1); c++) {
      const bx = x + c * 6 + (r & 1) * 3, by = base - (r + 1) * 5;
      rect(g, bx, by, 6, 5, (c + r) & 1 ? p.tan : p.paddy);
      rect(g, bx + 1, by, 1, 5, p.brown); rect(g, bx + 4, by, 1, 5, p.brown);                          // two vertical straps
      rect(g, bx, by + 2, 6, 1, p.brown);                                                              // one around the middle
      px(g, bx, by, p.cream); px(g, bx + 5, by + 4, p.brownDark);
    }
}

// The long, towering boundary wall: faded dirty cream, a darker base stained by monsoon mud, pilasters,
// and rusted barbed wire along the top
function millWall(g, p, x0, x1, base) {
  const h = 24, top = base - h, len = x1 - x0;
  rect(g, x0, top, len, h, p.cream);
  ditherRect(g, x0, top, len, h, p.tan, 4);
  for (let x = x0 + 3; x < x1; x += 7) { const l = 4 + ((x * 7) % 11); for (let j = 0; j < l; j++) if (j < l * 0.6 || bayer(x, top + j) < 8) px(g, x, top + 1 + j, p.tan); }   // streaks from the coping
  ditherRect(g, x0, base - 10, len, 10, p.brown, 6);                                                   // mud splashed up the wall
  rect(g, x0, base - 4, len, 4, p.brown); ditherRect(g, x0, base - 5, len, 1, p.brownDark, 8);
  for (let x = x0 + 8; x < x1; x += 20) { rect(g, x, top, 3, h, p.tan); rect(g, x + 2, top, 1, h, p.brown); rect(g, x - 1, top - 1, 5, 1, p.grayLight); }
  rect(g, x0, top - 1, len, 2, p.grayLight); rect(g, x0, top, len, 1, p.gray);                         // coping
  for (let x = x0; x < x1; x += 10) { rect(g, x, top - 5, 1, 4, p.grayDark); px(g, x + 1, top - 6, p.grayDark); }   // barbed wire posts
  for (let x = x0; x < x1; x++) for (const r of [2, 4]) {
    px(g, x, top - r + (x % 10 > 5 ? 1 : 0), (x + r) % 3 ? p.rust : p.grayDark);
    if (x % 3 === 0) px(g, x, top - r - 1, p.rust);
  }
}

// The one break in the wall: a wide, heavy steel gate between brick pillars, a guard hut, and over it all a big
// faded industrial sign in black block letters
function millGate(g, p, lit, x, base) {
  const gw = MILL_GATE_W, pw = 7, top = base - 30;
  rect(g, x, top, pw, 30, p.cream); rect(g, x + gw - pw - 12, top, pw, 30, p.cream);                    // the two pillars (the hut stands outside)
  for (const px0 of [x, x + gw - pw - 12]) { rect(g, px0 - 1, top - 1, pw + 2, 2, p.grayLight); rect(g, px0 + pw - 2, top, 2, 30, p.tan); ditherRect(g, px0, base - 10, pw, 10, p.brown, 6); }
  const gx0 = x + pw, gx1 = x + gw - pw - 12;                                                           // the steel gate
  rect(g, gx0, top, gx1 - gx0, 3, p.grayDark);
  for (let k = gx0; k < gx1; k += 4) { px(g, k, top + 3, p.gray); px(g, k + 2, top + 4, p.grayDark); }  // truss under the lintel
  rect(g, gx0, base - 3, gx1 - gx0, 3, p.ink);
  const mid = (gx0 + gx1) >> 1;
  for (const [a, b] of [[gx0, mid], [mid, gx1]]) {                                                      // two heavy leaves
    rect(g, a, top + 5, b - a, base - top - 8, p.grayDark);
    for (let k = a + 1; k < b; k += 3) rect(g, k, top + 6, 1, base - top - 10, p.gray);
    for (const y of [top + 5, (top + base) >> 1, base - 5]) rect(g, a, y, b - a, 2, p.ink);
    for (let k = 0; k < b - a - 2; k++) { px(g, a + 1 + k, top + 7 + Math.floor(k * (base - top - 14) / (b - a)), p.rust); }   // a rusty diagonal brace
  }
  rect(g, mid - 1, top + 5, 2, base - top - 8, p.ink);
  rect(g, x + gw - 11, base - 12, 11, 12, p.cream); rect(g, x + gw - 12, base - 14, 13, 2, p.rust);      // the guard hut
  rect(g, x + gw - 8, base - 9, 4, 5, lit ? PALETTE.amber : p.indigo);
  const sx = x + 2, sw = gw - 16, sy = top - 15;                                                        // the big faded sign
  rect(g, sx, sy, sw, 15, p.grayDark); rect(g, sx + 1, sy + 1, sw - 2, 13, p.cream);
  ditherRect(g, sx + 1, sy + 1, sw - 2, 13, p.tan, 4);
  drawText2x(g, 'JUTE MILLS', sx + ((sw - 78) >> 1), sy + 3, p.ink);
  for (let i = 0; i < 40; i++) px(g, sx + 2 + ((i * 37) % (sw - 4)), sy + 2 + ((i * 11) % 11), i & 1 ? p.cloudShade : p.cream);   // peeled paint
  rect(g, sx + 4, sy + 15, 2, 3, p.grayDark); rect(g, sx + sw - 6, sy + 15, 2, 3, p.grayDark);
  if (lit) for (const lx of [sx + 8, sx + (sw >> 1), sx + sw - 9]) { px(g, lx, sy - 1, PALETTE.glow); glowHalo(g, lx, sy - 1, 1, 5, 5); }
}
