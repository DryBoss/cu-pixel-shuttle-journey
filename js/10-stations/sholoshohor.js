'use strict';
// js/10-stations/sholoshohor.js
// Defines: buildSholoshohor

// Sholosohor Junction, seen across the tracks: a long, imposing red-brick colonial building with a
// taller flat-topped centre block carrying the big black-and-white name board; a two-storey brick
// signal cabin with an upper floor wrapped in glass; mechanical semaphores all round the yard; and
// a web of yard lines that merge and diverge, with an old faded rake waiting on the far loop.
// Sprite rows: yard rails at 52 (loop line), 60 and 66; buildings stand on row 72.
function buildSholoshohor(p, lit) {
  const W = 420, H = 86, [c, g] = makeCanvas(W, H), rng = mulberry32(8), base = 72;

  // --- the yard: gravel, then the lines that fan out and join
  rect(g, 0, 50, W, H - 50, p.gray);
  ditherRect(g, 0, 48, W, 2, p.gray, 8);
  for (let i = 0; i < W * 5; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, 50, H - 1), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  const line = (y, x0, x1) => {                                                          // one running line: rail, sleepers, rail
    rect(g, x0, y, x1 - x0, 1, p.grayLight); rect(g, x0, y + 2, x1 - x0, 1, p.gray);
    for (let x = x0; x < x1; x += 4) rect(g, x, y + 1, 2, 1, p.brownDark);
  };
  const points = (x0, y0, x1, y1) => {                                                   // a turnout curving from one line to the next
    const n = x1 - x0;
    for (let i = 0; i <= n; i++) { const y = Math.round(y0 + (y1 - y0) * (i / n) * (i / n) * (3 - 2 * i / n)); px(g, x0 + i, y, p.grayLight); px(g, x0 + i, y + 2, p.gray); px(g, x0 + i, y + 1, i % 3 ? p.brownDark : p.brown); }
  };
  line(57, 214, W); line(63, 150, W); line(69, 0, W);
  points(236, 63, 262, 57); points(300, 57, 326, 63); points(142, 69, 168, 63); points(344, 63, 372, 69); points(268, 69, 292, 63);
  rect(g, 208, 56, 2, 5, p.red); rect(g, 207, 55, 4, 1, p.white);                        // buffer stop at the end of the loop line

  // --- the waiting rake on the far loop line: old, faded, rust-streaked coaches
  const coach = (x, tone) => {
    const body = tone ? p.green : p.blue, dark = tone ? p.greenDark : p.navy;
    rect(g, x, 46, 26, 9, body); ditherRect(g, x, 46, 26, 9, p.cloudShade, 2);          // sun-faded paint
    rect(g, x, 45, 26, 1, p.grayLight); rect(g, x, 55, 26, 1, dark); rect(g, x, 49, 26, 1, tone ? p.green : p.skyDeep);
    for (let wx = x + 2; wx < x + 24; wx += 4) { rect(g, wx, 47, 3, 3, lit && rng() < 0.4 ? PALETTE.amber : p.indigo); px(g, wx, 47, lit ? PALETTE.glow : p.skyMid); }
    rect(g, x + 11, 47, 4, 8, dark);                                                     // the door
    for (let i = 0; i < 9; i++) { const sx = x + randInt(rng, 1, 24); for (let j = 0; j < randInt(rng, 2, 5); j++) px(g, sx, 51 + j, p.rust); }   // rust streaks
    rect(g, x + 3, 56, 4, 1, p.ink); rect(g, x + 19, 56, 4, 1, p.ink);                  // bogies
    rect(g, x + 25, 54, 2, 1, p.grayDark);                                               // coupling
  };
  for (let k = 0; k < 6; k++) coach(216 + k * 27, k === 2 || k === 5 ? 1 : 0);

  // --- the long red-brick main building: two-storey wings, flat roofs with balustrades
  const bx = 30, w = 180, wallTop = base - 26, cx = bx + (w >> 1);
  rect(g, bx, wallTop, w, 26, p.red);
  for (let y = wallTop + 2; y < base - 3; y += 3) rect(g, bx, y, w, 1, p.rust);          // brick courses
  ditherRect(g, bx, wallTop, w, 26, p.rust, 2);
  rect(g, bx + w - 3, wallTop, 3, 26, p.rust);
  rect(g, bx, base - 3, w, 3, p.grayLight);                                               // plinth
  rect(g, bx, wallTop + 12, w, 1, p.white);                                               // string course
  rect(g, bx - 1, wallTop - 3, w + 2, 3, p.white); rect(g, bx - 1, wallTop, w + 2, 1, p.cloudShade);   // cornice
  for (let x = bx; x < bx + w; x += 4) px(g, x, wallTop - 4, p.cloudShade);              // balustrade posts
  for (let x = bx + 8; x + 6 <= bx + w - 6; x += 14) {                                    // arched windows, upper and lower
    if (Math.abs(x + 3 - cx) < 62) continue;
    for (const y of [wallTop + 3, wallTop + 15]) {
      rect(g, x, y + 1, 6, 8, lit ? PALETTE.amber : p.brownDark); rect(g, x + 1, y, 4, 1, lit ? PALETTE.amber : p.brownDark);
      rect(g, x - 1, y, 1, 10, p.white); rect(g, x + 6, y, 1, 10, p.white); rect(g, x, y - 1, 6, 1, p.white); rect(g, x - 1, y + 9, 8, 1, p.white);
      if (lit) rect(g, x + 3, y + 1, 1, 8, PALETTE.glow);
    }
  }

  // --- the taller flat-topped centre block with the big name board
  const cw = 110, ctop = base - 58, cl = cx - (cw >> 1);
  rect(g, cl, ctop, cw, 58, p.red);
  for (let y = ctop + 2; y < base - 3; y += 3) rect(g, cl, y, cw, 1, p.rust);
  ditherRect(g, cl, ctop, cw, 58, p.rust, 2);
  for (let y = ctop; y < base; y += 6) { rect(g, cl, y, 3, 3, p.white); rect(g, cl + cw - 3, y + 3, 3, 3, p.white); }   // quoins
  rect(g, cl - 2, ctop - 4, cw + 4, 4, p.white); rect(g, cl - 2, ctop, cw + 4, 1, p.cloudShade);               // heavy cornice and parapet
  for (let x = cl; x < cl + cw; x += 4) px(g, x, ctop - 5, p.cloudShade);
  rect(g, cl + 8, ctop - 9, 8, 5, p.grayLight); rect(g, cl + 8, ctop - 10, 8, 1, p.gray);                       // water tanks on the roof
  rect(g, cl + 20, ctop - 8, 6, 4, p.gray);
  rect(g, cl + cw - 14, ctop - 16, 1, 12, p.grayDark);                                                          // flagpole
  rect(g, cl + cw - 13, ctop - 16, 6, 3, p.red);
  rect(g, cx - 56, ctop + 3, 112, 18, p.ink); rect(g, cx - 55, ctop + 4, 110, 16, p.white);                      // black-and-white name board
  for (let x = cx - 55; x < cx + 55; x += 2) { px(g, x, ctop + 4, x & 2 ? p.ink : p.white); px(g, x, ctop + 19, x & 2 ? p.white : p.ink); }
  drawText2x(g, 'SHOLOSOHOR JN', cx - 51, ctop + 6, p.ink);
  for (const wx of [cx - 44, cx - 28, cx + 22, cx + 38]) {                                                       // first-floor windows
    rect(g, wx, ctop + 26, 6, 11, lit ? PALETTE.amber : p.brownDark); rect(g, wx - 1, ctop + 25, 8, 1, p.white); rect(g, wx - 1, ctop + 37, 8, 1, p.white);
    rect(g, wx + 2, ctop + 26, 1, 11, p.white);
  }
  for (const wx of [cx - 44, cx - 28, cx + 22, cx + 38]) { rect(g, wx, base - 22, 6, 12, lit ? PALETTE.amber : p.brownDark); rect(g, wx - 1, base - 23, 8, 1, p.white); rect(g, wx - 1, base - 10, 8, 1, p.white); }
  for (let dx = -10; dx < 10; dx++) {                                                                            // the big arched entrance
    const y0 = base - 26 + Math.round(10 - Math.sqrt(Math.max(0, 100 - (dx + 0.5) * (dx + 0.5))));
    rect(g, cx + dx, y0, 1, base - 3 - y0, p.white);
  }
  for (let dx = -8; dx < 8; dx++) {
    const y0 = base - 24 + Math.round(8 - Math.sqrt(Math.max(0, 64 - (dx + 0.5) * (dx + 0.5))));
    rect(g, cx + dx, y0, 1, base - 3 - y0, lit ? PALETTE.amber : p.brownDark);
  }
  rect(g, cx - 5, base - 17, 10, 14, lit ? PALETTE.glow : p.indigo);

  // --- the signal cabin: brick ground floor, upper floor wrapped in glass
  const sx = 238, ground = 14, upper = 13, utop = base - ground - upper;
  rect(g, sx, base - ground, 26, ground, p.rust);                                         // brick ground floor with the interlocking-room door
  for (let y = base - ground + 2; y < base - 2; y += 3) rect(g, sx, y, 26, 1, p.brown);
  rect(g, sx + 3, base - 10, 5, 10, p.brownDark); rect(g, sx + 14, base - 9, 6, 5, lit ? PALETTE.amber : p.indigo);
  rect(g, sx - 5, utop, 36, upper, p.grayDark);                                           // glazed upper floor, wider than the one below
  for (let x = sx - 4; x < sx + 29; x += 5) {
    rect(g, x, utop + 2, 4, upper - 4, lit ? PALETTE.amber : p.skyLight);
    if (!lit) { px(g, x, utop + 2, p.white); px(g, x + 1, utop + 3, p.white); px(g, x + 3, utop + upper - 3, p.skyMid); }
    else rect(g, x + 1, utop + 3, 2, upper - 6, PALETTE.glow);
  }
  rect(g, sx - 5, utop + upper - 2, 36, 2, p.white);                                      // sill band
  rect(g, sx - 7, utop - 2, 40, 2, p.brown); rect(g, sx - 6, utop - 4, 38, 2, p.rust); rect(g, sx - 5, utop - 5, 36, 1, p.brownDark);   // tin roof
  rect(g, sx + 22, utop - 9, 2, 4, p.rust); px(g, sx + 22, utop - 9, p.ink); px(g, sx + 23, utop - 9, p.ink);    // chimney
  rect(g, sx + 2, utop - 11, 1, 7, p.grayDark); px(g, sx + 2, utop - 12, p.gray);                                // lightning rod
  for (let k = 0; k < 12; k++) { px(g, sx - 6 - k, base - 3 - k, p.grayLight); px(g, sx - 6 - k, base - 2 - k, p.gray); }   // outside stair up to the cabin
  rect(g, sx - 7, utop + upper - 1, 3, 1, p.grayLight);
  if (lit) glowHalo(g, sx + 13, utop + 6, 12, 26, 5);

  // --- mechanical semaphores all round the yard: masts with ladders, red arms (up = clear), lamps lit at night
  const signal = (x, top, foot, arms) => {
    rect(g, x, top, 2, foot - top, p.grayDark);
    for (let y = top + 4; y < foot; y += 3) px(g, x - 1, y, p.gray);
    rect(g, x - 2, top + 1, 6, 1, p.gray);                                                // top platform
    arms.forEach(([dy, up], i) => {
      const y0 = top + 3 + dy;
      for (let k = 0; k < 10; k++) {
        const y = y0 + (up ? -(k >> 1) : k >> 3);
        px(g, x + 2 + k, y, p.red); px(g, x + 2 + k, y + 1, k % 4 === 3 ? p.white : p.red);
      }
      rect(g, x + 10, y0 + (up ? -4 : 1), 2, 2, p.ink);
      rect(g, x - 2, y0 + 1, 2, 2, p.grayDark);                                           // counterweight
      if (lit) { const lamp = up ? PALETTE.green : PALETTE.red; rect(g, x - 1, y0 - 3 + i, 2, 2, lamp); glowHalo(g, x, y0 - 2 + i, 1.5, 5, 5); }
    });
    if (lit && !arms.length) rect(g, x, top - 2, 2, 2, PALETTE.red);
  };
  signal(8, 22, 72, [[0, false], [10, true]]);                                            // two-arm home signal at the left end
  signal(216, 28, 70, [[0, true]]);
  signal(274, 18, 72, [[0, false], [9, false]]);                                          // right by the cabin
  signal(312, 34, 66, [[0, true]]);
  signal(352, 30, 62, [[0, false]]);
  signal(392, 38, 58, [[0, true], [8, false]]);
  for (let x = 0; x < 28; x++) for (let y = 46; y < H; y++) {                             // the yard peters out at both ends
    if (bayer(x, y) < (28 - x) / 28 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(W - 1 - x, y) < (28 - x) / 28 * 16) g.clearRect(W - 1 - x, y, 1, 1);
  }
  return c;
}
