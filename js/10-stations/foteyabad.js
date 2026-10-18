'use strict';
// js/10-stations/foteyabad.js
// Defines: buildFoteyabad

// Foteyabad: a proud, historic red-brick station standing open to the sky (no shed over the platform):
// exposed brick courses, a columned portico under a pediment with a white-faced clock, deep-set
// glowing booking windows, a slate roof carrying a long green signboard, a two-storey brick signal
// cabin with a steep stair, tall semaphores, and thick trees and palms at both ends tying it into the
// countryside. Screen x -5 is the sprite's left edge at the stop; row 68 (screen y 128) is the ground.
function buildFoteyabad(p, lit) {
  const W = 360, H = 84, [c, g] = makeCanvas(W, H), rng = mulberry32(19), base = 68, bx = 30, w = 190, cx = bx + (w >> 1), wallTop = base - 30;
  rect(g, 0, 68, W, H - 68, p.gray);
  ditherRect(g, 0, 66, W, 2, p.gray, 8);
  for (let i = 0; i < W * 3; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, 68, H - 1), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  const dark = lit ? PALETTE.amber : p.brownDark;

  // --- the red-brick walls: deep reds and browns, distinct courses
  const brick = (x, y, bw, bh) => {
    rect(g, x, y, bw, bh, p.red); ditherRect(g, x, y, bw, bh, p.rust, 3);
    for (let yy = y + 1, r = 0; yy < y + bh - 1; yy += 3, r++) {
      rect(g, x, yy + 2, bw, 1, p.brown);                                                          // mortar course
      for (let xx = x + (r & 1) * 3; xx < x + bw; xx += 6) { px(g, xx, yy, p.rust); px(g, xx, yy + 1, p.rust); }   // staggered joints
    }
  };
  brick(bx, wallTop, w, 30);
  rect(g, bx + w - 3, wallTop, 3, 30, p.rust); ditherRect(g, bx + w - 3, wallTop, 3, 30, p.brownDark, 5);
  for (let y = wallTop; y < base - 3; y += 6) { rect(g, bx, y, 3, 3, p.white); rect(g, bx + w - 3, y + 3, 3, 3, p.white); rect(g, bx, y + 3, 2, 3, p.cloudShade); }   // white quoins
  rect(g, bx, base - 3, w, 3, p.grayLight);
  rect(g, bx, base - 14, w, 1, p.white);                                                            // string course
  rect(g, bx - 1, wallTop - 1, w + 2, 2, p.white);                                                  // cornice
  for (let r = 0; r < 9; r++) {                                                                     // the slate roof, in tiles
    const x0 = bx - 2 + Math.floor(r * 1.4), rw = w + 4 - Math.floor(r * 2.8);
    for (let xx = x0; xx < x0 + rw; xx++) px(g, xx, wallTop - 2 - r, r === 8 ? p.ink : ((xx >> 1) + r) & 1 ? p.grayDark : p.gray);
  }
  for (const chx of [bx + 22, bx + w - 30]) { rect(g, chx, wallTop - 14, 4, 8, p.red); rect(g, chx, wallTop - 12, 4, 1, p.rust); rect(g, chx - 1, wallTop - 15, 6, 1, p.ink); }   // brick chimneys
  for (let x = bx + 10; x + 8 <= bx + w - 6; x += 18) {                                             // wing windows with green shutters, and arched ground-floor doors
    if (Math.abs(x + 4 - cx) < 40) continue;
    rect(g, x - 1, wallTop + 4, 10, 1, p.white);
    rect(g, x, wallTop + 5, 8, 9, lit ? PALETTE.glow : p.indigo);
    rect(g, x - 2, wallTop + 5, 2, 9, p.greenDark); rect(g, x + 8, wallTop + 5, 2, 9, p.greenDark);
    rect(g, x - 1, wallTop + 14, 10, 1, p.white);
    rect(g, x + 2, base - 13, 4, 1, dark); rect(g, x + 1, base - 12, 6, 1, dark); rect(g, x, base - 11, 8, 8, dark);
    px(g, x + 3, base - 14, p.white); px(g, x + 4, base - 14, p.white);
  }

  // --- the portico: columns, a triangular pediment with a white-faced clock, and a deep dark entrance
  for (let r = 0; r < 10; r++) {
    const hw = 33 - Math.floor(r * 3.3), y = wallTop - 1 - r;
    rect(g, cx - hw, y, hw * 2, 1, r === 9 ? p.white : p.red);
    px(g, cx - hw, y, p.white); px(g, cx + hw - 1, y, p.white);
  }
  rect(g, cx - 33, wallTop, 66, 3, p.white);                                                        // entablature
  rect(g, cx - 31, wallTop + 3, 62, 27, p.brownDark); rect(g, cx - 31, wallTop + 3, 62, 3, p.ink);   // the dark recessed entrance
  disc(g, cx, wallTop - 5, 4, p.grayDark); disc(g, cx, wallTop - 5, 3, p.white);                    // the clock: a white face in a dark rim
  for (const [dx, dy] of [[0, -3], [3, 0], [0, 3], [-3, 0]]) px(g, cx + dx, wallTop - 5 + dy, p.ink);
  px(g, cx, wallTop - 6, p.ink); px(g, cx, wallTop - 7, p.ink); px(g, cx + 1, wallTop - 5, p.ink); px(g, cx + 2, wallTop - 5, p.ink);
  for (const dx of [-27, -9, 9, 27]) { rect(g, cx + dx - 1, wallTop + 3, 3, 27, p.white); rect(g, cx + dx + 1, wallTop + 3, 1, 27, p.cloudShade); rect(g, cx + dx - 2, wallTop + 3, 5, 1, p.cloudShade); rect(g, cx + dx - 2, base - 4, 5, 1, p.cloudShade); }
  for (const bxc of [cx - 18, cx + 18]) {                                                           // deep-set arched booking windows with grilles, warm after dark
    rect(g, bxc - 4, wallTop + 9, 8, 12, p.white);
    rect(g, bxc - 3, wallTop + 10, 6, 10, lit ? PALETTE.amber : p.indigo);
    px(g, bxc - 3, wallTop + 10, p.white); px(g, bxc + 2, wallTop + 10, p.white);                   // arched corners
    if (lit) rect(g, bxc - 1, wallTop + 11, 2, 7, PALETTE.glow);
    for (let gx = bxc - 2; gx <= bxc + 1; gx += 1) rect(g, gx, wallTop + 12, 1, 7, p.ink);          // grille bars
    rect(g, bxc - 4, wallTop + 21, 8, 1, p.cloudShade);
  }
  rect(g, cx - 7, base - 24, 14, 21, p.white); rect(g, cx - 5, base - 22, 10, 19, dark); rect(g, cx, base - 22, 1, 19, p.white);   // doors
  rect(g, cx - 5, base - 24, 10, 2, lit ? PALETTE.glow : p.cream);                                   // fanlight
  // --- the name on the roof: a long wooden board painted dark green, stark white letters
  rect(g, cx - 49, wallTop - 29, 98, 16, p.brown);
  rect(g, cx - 48, wallTop - 28, 96, 14, p.greenDark);
  for (let y = wallTop - 25; y < wallTop - 14; y += 4) rect(g, cx - 48, y, 96, 1, p.greenDeep);       // plank lines
  drawText2x(g, 'FOTEYABAD', cx - 35, wallTop - 26, p.white);
  rect(g, cx - 34, wallTop - 13, 3, 4, p.brown); rect(g, cx + 31, wallTop - 13, 3, 4, p.brown);
  rect(g, cx - 1, wallTop - 13, 2, 4, p.grayDark);

  // --- the signal cabin: red brick, a heavily glazed upper floor, a steep stair
  const sx = bx + w + 16, cabTop = base - 28;
  brick(sx, base - 13, 26, 13);
  rect(g, sx + 3, base - 9, 4, 9, dark); rect(g, sx + 15, base - 9, 5, 4, lit ? PALETTE.amber : p.indigo);
  rect(g, sx - 2, cabTop + 2, 30, 13, p.white);
  for (let x = sx - 1; x < sx + 26; x += 5) { rect(g, x, cabTop + 3, 4, 10, lit ? PALETTE.amber : p.skyMid); if (!lit) px(g, x, cabTop + 3, p.white); else rect(g, x + 1, cabTop + 4, 2, 7, PALETTE.glow); }
  rect(g, sx - 2, cabTop + 13, 30, 2, p.cloudShade);
  for (let r = 0; r < 4; r++) rect(g, sx - 4 + r * 2, cabTop + 1 - r, 34 - r * 4, 1, r === 3 ? p.ink : p.grayDark);   // hipped slate roof
  rect(g, sx + 20, cabTop - 6, 2, 3, p.red); px(g, sx + 20, cabTop - 6, p.ink);
  for (let k = 0; k < 15; k++) { rect(g, sx - 16 + k, base - 2 - k, 2, 1, p.brown); px(g, sx - 15 + k, base - 7 - k, p.grayDark); }   // the steep wooden stair and its handrail
  rect(g, sx - 3, cabTop + 15, 4, 1, p.brown); rect(g, sx - 17, base - 1, 2, 1, p.brownDark);

  // --- tall mechanical semaphores flanking the station: red arms, tiny lamps
  const signal = (x, top, foot, up) => {
    rect(g, x, top, 2, foot - top, p.grayDark);
    for (let y = top + 6; y < foot; y += 4) px(g, x + 2, y, p.gray);
    rect(g, x - 2, top + 1, 6, 1, p.gray);
    for (let k = 0; k < 11; k++) { const y = top + 4 + (up ? -(k >> 1) : k >> 3); px(g, x + 2 + k, y, p.red); px(g, x + 2 + k, y + 1, k % 4 === 3 ? p.white : p.red); }
    rect(g, x + 11, top + 3 + (up ? -4 : 1), 2, 2, p.ink);
    rect(g, x - 2, top + 5, 2, 2, p.grayDark);
    rect(g, x, top - 3, 2, 2, lit ? (up ? PALETTE.green : PALETTE.red) : p.grayLight);
    if (lit) glowHalo(g, x + 0.5, top - 2, 1.5, 6, 5);
  };
  signal(bx - 18, 14, 68, true); signal(sx + 40, 20, 68, false); signal(sx + 66, 34, 66, true);

  // --- thick trees and tall palms at both ends, anchoring the brick in the countryside
  const fringe = xs => xs.forEach(([x, kind, seed], i) => {
    if (kind === 'palm') palm(g, x, base, randInt(rng, 26, 34), randInt(rng, -2, 2), p.brown, p.green, p.greenDark);
    else { rect(g, x - 1, 46, 3, 24, p.brownDark); leafyCrown(g, p, x, 44, 15 + (i & 1) * 3, 14 + (i % 3), seed, i & 1); }
  });
  fringe([[7, 'tree', 301], [19, 'palm'], [27, 'tree', 302], [-2, 'palm']]);
  fringe([[322, 'tree', 311], [334, 'palm'], [345, 'tree', 312], [309, 'palm'], [356, 'palm']]);
  for (let x = 0; x < 28; x++) for (let y = 66; y < H; y++) {                                       // the yard fades out at both ends
    if (bayer(x, y) < (28 - x) / 28 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(W - 1 - x, y) < (28 - x) / 28 * 16) g.clearRect(W - 1 - x, y, 1, 1);
  }
  return c;
}
