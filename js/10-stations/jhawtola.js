'use strict';
// js/10-stations/jhawtola.js
// Defines: buildJhawtola

// Jhawtola ("under the Jhau trees"): a solid post-colonial two-storey station block across the
// tracks, faded cream with a thick blue band, dark-green shuttered upper windows, an open arched
// entrance flanked by grilled booking windows, and the name on the flat roof, all weathered by
// monsoon streaks. Tall wispy Jhau trees flank it and rise above the roof. (The platform in front
// has no shed.)
function buildJhawtola(p, lit) {
  const W = 360, H = 90, [c, g] = makeCanvas(W, H), bx = 75, w = 210, base = 76, rng = mulberry32(5), cx = bx + (w >> 1), top = base - 48, bh = 48;
  // rows: band top+4..9 | wall | upper windows top+14..23 | wall | booking windows base-20..base-8 | wall | plinth
  const wallRow = y => y <= top + 13 || (y >= top + 24 && y <= top + 27) || y >= base - 7;   // where rain stains can show
  const stain = (x, y0, len, dark) => {                                                  // a monsoon streak running down the wall
    for (let i = 0; i < len; i++) {
      const y = y0 + i, fade = i > len * 0.6;
      if (!wallRow(y) || (y > top + 23 && Math.abs(x - cx) < 11) || (fade && bayer(x, y) > 8)) continue;
      const onBand = y >= top + 4 && y <= top + 9;                                      // a wet streak across the blue band just darkens it
      px(g, x, y, onBand ? p.navy : dark && i < len * 0.7 ? p.brown : p.tan);
      if (dark && !fade && !onBand && rng() < 0.6) px(g, x + 1, y, rng() < 0.5 ? p.brown : p.tan);
    }
  };
  rect(g, 0, base, W, H - base, p.gray);                                                 // gravel yard under it
  ditherRect(g, 0, base - 2, W, 2, p.gray, 8);
  for (let i = 0; i < W * 4; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, base, H - 1), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  jhauTree(g, p, bx - 26, base, 70, 101, 1);                                              // the back row of Jhau trees, darker
  jhauTree(g, p, bx + w + 24, base, 66, 103, 1);
  jhauTree(g, p, bx - 3, base, 64, 107, 1);
  jhauTree(g, p, bx + w + 4, base, 68, 109, 1);

  // --- walls: faded cream, bleached by sun, damp creeping up from the plinth
  rect(g, bx, top, w, bh, p.cream);
  ditherRect(g, bx, top + 10, w, 16, p.white, 3);
  ditherRect(g, bx, base - 13, w, 10, p.tan, 3);
  rect(g, bx + w - 3, top, 3, bh, p.tan);
  for (let x = bx + 4; x < bx + w - 2; x += 30) rect(g, x, top, 2, bh, p.white);       // pilasters
  rect(g, bx - 2, top - 1, w + 4, 3, p.white);                                          // flat roof parapet
  rect(g, bx - 2, top + 2, w + 4, 1, p.tan);
  for (let x = bx - 2; x < bx + w + 2; x += 4) if (rng() < 0.4) px(g, x, top - 1, p.cloudShade);   // chipped coping

  // --- the thick blue band, itself faded and flaking
  rect(g, bx, top + 4, w, 6, p.blue);
  rect(g, bx, top + 4, w, 1, p.skyDeep);
  rect(g, bx, top + 9, w, 1, p.navy);
  for (let i = 0; i < 70; i++) px(g, randInt(rng, bx, bx + w - 1), randInt(rng, top + 4, top + 9), rng() < 0.6 ? p.skyDeep : p.cloudShade);
  rect(g, bx, top + 10, w, 1, p.white);
  rect(g, bx, top + 25, w, 1, p.white);                                                  // floor line
  rect(g, bx, base - 3, w, 3, p.grayLight);                                              // plinth

  // --- windows: green-shuttered above, grilled booking windows below
  for (let x = bx + 10; x + 8 <= bx + w - 6; x += 15) {
    if (Math.abs(x + 4 - cx) < 12) continue;
    rect(g, x - 1, top + 14, 10, 1, p.white);                                            // upper window: lintel, glass, sill
    rect(g, x, top + 15, 8, 8, lit ? PALETTE.glow : p.skyMid);
    rect(g, x + 4, top + 15, 1, 8, p.white);
    rect(g, x - 1, top + 23, 10, 1, p.white);
    const open = rng() < 0.3;                                                            // some shutters stand half open
    for (const sx of [x - 3, x + 8]) {                                                   // dark green louvred shutters
      rect(g, sx, top + 14, 3, 10, p.greenDark);
      for (let y = top + 15; y < top + 23; y += 2) rect(g, sx, y, 3, 1, p.greenDeep);
      rect(g, sx, top + 14, 1, 10, p.green);
    }
    if (open) rect(g, x + 5, top + 15, 3, 8, p.greenDark);
    rect(g, x, base - 19, 8, 12, lit ? PALETTE.amber : p.indigo);                        // booking windows with grilles
    for (let gx = x + 1; gx < x + 8; gx += 2) rect(g, gx, base - 19, 1, 12, p.grayLight);
    rect(g, x, base - 13, 8, 1, p.grayLight);
    rect(g, x - 1, base - 20, 10, 1, p.white); rect(g, x - 1, base - 7, 10, 1, p.white);
  }

  // --- the open arched entrance
  for (let dx = -10; dx < 10; dx++) {                                                    // white surround
    const y0 = base - 25 + Math.round(10 - Math.sqrt(Math.max(0, 100 - (dx + 0.5) * (dx + 0.5))));
    rect(g, cx + dx, y0, 1, base - 3 - y0, p.white);
  }
  for (let dx = -8; dx < 8; dx++) {                                                      // the opening, no doors
    const y0 = base - 23 + Math.round(8 - Math.sqrt(Math.max(0, 64 - (dx + 0.5) * (dx + 0.5))));
    rect(g, cx + dx, y0, 1, base - 3 - y0, lit ? PALETTE.amber : p.brownDark);
  }
  rect(g, cx - 5, base - 17, 10, 14, lit ? PALETTE.glow : p.indigo);                     // the booking hall beyond
  rect(g, cx - 5, base - 17, 10, 1, p.grayDark);
  rect(g, cx - 1, base - 17, 2, 14, p.grayDark);                                         // a pillar inside
  rect(g, cx - 5, base - 4, 10, 1, p.grayLight);
  rect(g, cx - 2, base - 26, 4, 2, p.tan);                                               // keystone
  rect(g, cx - 14, top + 14, 28, 1, p.white);                                            // window over the entrance
  rect(g, cx - 13, top + 15, 26, 8, lit ? PALETTE.glow : p.skyMid);
  for (let x = cx - 13 + 6; x < cx + 13; x += 7) rect(g, x, top + 15, 1, 8, p.white);
  rect(g, cx - 14, top + 23, 28, 1, p.white);
  for (const sx of [cx - 17, cx + 14]) {
    rect(g, sx, top + 14, 3, 10, p.greenDark);
    for (let y = top + 15; y < top + 23; y += 2) rect(g, sx, y, 3, 1, p.greenDeep);
  }

  // --- years of monsoon rain: dark streaks running down from under the name board and the parapet,
  //     lighter ones from the sills and the plinth
  for (let x = cx - 34; x < cx + 34; x += 3 + Math.floor(rng() * 4)) stain(x, top, 10 + Math.floor(rng() * 28), true);
  for (let i = 0; i < 30; i++) stain(randInt(rng, bx + 2, bx + w - 4), top, 6 + Math.floor(rng() * 20), rng() < 0.4);
  for (let x = bx + 10; x + 8 <= bx + w - 6; x += 15) {
    stain(x + 2, top + 24, 3 + Math.floor(rng() * 3), false); stain(x + 6, top + 24, 2 + Math.floor(rng() * 4), false);
    stain(x + 3, base - 7, 3, true);
  }

  // --- the name on the roof: block letters, weathered
  rect(g, cx - 36, top - 15, 72, 14, p.white);
  rect(g, cx - 35, top - 14, 70, 12, p.blue);
  drawText2x(g, 'JHAWTOLA', cx - 31, top - 13, p.white);
  for (let i = 0; i < 34; i++) px(g, randInt(rng, cx - 35, cx + 34), randInt(rng, top - 14, top - 3), rng() < 0.5 ? p.skyDeep : p.blue);   // sun-faded paint, flaked letters
  for (let x = cx - 36; x < cx + 36; x++) if (bayer(x, 0) < 9) px(g, x, top - 2, p.tan);   // rain-washed lower edge
  for (const sx of [cx - 30, cx - 12, cx + 7, cx + 25]) for (let i = 0; i < 3 + (sx & 3); i++) px(g, sx, top - 2 + i, i ? p.tan : p.brown);   // drips under the board

  rect(g, bx + 20, top - 6, 8, 5, p.grayLight); rect(g, bx + 21, top - 7, 6, 1, p.gray);   // water tank
  jhauTree(g, p, bx - 24, base, 76, 113);                                                 // the front row: taller than the building and its sign
  jhauTree(g, p, bx + w + 10, base, 80, 127);
  jhauTree(g, p, bx - 44, base, 62, 131);
  jhauTree(g, p, bx + w + 38, base, 60, 137);
  for (let x = 0; x < 28; x++) for (let y = base - 4; y < H; y++) {                      // the yard peters out at both ends
    if (bayer(x, y) < (28 - x) / 28 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(W - 1 - x, y) < (28 - x) / 28 * 16) g.clearRect(W - 1 - x, y, 1, 1);
  }
  return c;
}
