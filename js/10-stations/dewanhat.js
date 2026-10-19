'use strict';
// js/10-stations/dewanhat.js
// Defines: FLY, buildFlyover

// --- the Dewanhat road flyover. It crosses the line at a right angle: we see its END, a short deck
// (FLY.W px along the rails) with its parapet, street lamps, slab edge and the ends of four girders. It
// stands on two pier frames, one BEHIND the train (drawn before it) and one in FRONT of it (drawn
// after it), so the train runs between them and under the deck. See overpass.js for where it is drawn.
const FLY = {
  W: 72,                // deck width along the line
  X0: -6,               // screen x of its left edge while a train stands at the stop mark: on the left, over the tail of the train
  TOP_BACK: 62,         // screen y of the back sprite's first row (the lamp tops)
  TOP_FRONT: 98,        // screen y of the front sprite's first row (the cap beam)
  GROUND_BACK: 142,     // where the back piers meet the ground, just behind the track
  GROUND_FRONT: 161,    // where the front piers meet the ground, just in front of it
};

function buildFlyover(p, lit) {
  const W = FLY.W, rng = mulberry32(31);
  // a concrete pier: stained, moss at the foot, formwork lines, damp streaks, a faded poster or two
  const pier = (g, x, y0, y1, w, posters) => {
    rect(g, x, y0, w, y1 - y0, p.gray);
    rect(g, x, y0, 1, y1 - y0, p.grayLight); rect(g, x + w - 1, y0, 1, y1 - y0, p.grayDark);
    ditherRect(g, x + 1, y0, w - 2, y1 - y0, p.cloudShade, 3);
    for (let y = y0 + 8; y < y1 - 3; y += 8) rect(g, x, y, w, 1, p.grayDark);                          // formwork lines
    for (let n = 0; n < 3; n++) { const sx = x + randInt(rng, 1, w - 2), sl = randInt(rng, 8, 22); for (let j = 0; j < sl && y0 + 1 + j < y1; j++) px(g, sx, y0 + 1 + j, p.grayDark); }   // damp streaks
    for (let y = y1 - 14; y < y1 - 2; y++) for (let xx = 0; xx < w; xx++)                              // moss creeping up from the bottom
      if (rng() < (y - (y1 - 16)) / 14) px(g, x + xx, y, rng() < 0.5 ? p.greenDark : rng() < 0.6 ? p.green : p.grass);
    for (let n = 0; n < posters; n++) {                                                                  // faded election posters
      const py = y0 + 6 + n * 12 + randInt(rng, 0, 3), pxx = x + randInt(rng, 1, Math.max(1, w - 8)), faded = rng() < 0.5;
      rect(g, pxx, py, 6, 8, faded ? p.cloudShade : p.white);
      rect(g, pxx + 1, py + 1, 4, 2, faded ? p.grayDark : p.ink); rect(g, pxx + 1, py + 4, 4, 1, p.grayDark); rect(g, pxx + 1, py + 6, 3, 1, p.grayDark);
      px(g, pxx + 5, py + 7, p.gray); px(g, pxx, py, p.gray);
    }
    rect(g, x - 2, y1 - 3, w + 4, 3, p.grayDark); rect(g, x - 2, y1 - 3, w + 4, 1, p.gray);              // plinth
  };

  // ---- BACK sprite: lamps, parapet, slab edge, girder ends, the back pier frame ----------------------
  const BH = FLY.GROUND_BACK - FLY.TOP_BACK + 1, [bc, b] = makeCanvas(W, BH), Y = y => y - FLY.TOP_BACK;
  for (const lx of [5, W - 7]) {                                                                         // street lamps on the deck
    rect(b, lx, Y(66), 2, 15, p.grayDark); rect(b, lx, Y(66), 1, 15, p.gray);
    rect(b, lx - (lx < W / 2 ? 0 : 3), Y(64), 5, 2, p.grayDark);                                          // the arm
    rect(b, lx - (lx < W / 2 ? 0 : 3), Y(66), 5, 1, lit ? PALETTE.glow : p.grayLight);                    // the lamp head
  }
  for (let x = 1; x < W; x += 8) rect(b, x, Y(77), 1, 4, p.grayLight);                                   // railing posts above the barrier
  rect(b, 0, Y(77), W, 1, p.grayLight);
  rect(b, 0, Y(80), W, 5, p.cloudShade); rect(b, 0, Y(80), W, 1, p.white); rect(b, 0, Y(84), W, 1, p.gray);   // the jersey barrier
  for (let x = 11; x < W; x += 12) rect(b, x, Y(80), 1, 5, p.gray);
  rect(b, 0, Y(85), W, 5, p.gray); rect(b, 0, Y(85), W, 1, p.grayLight); rect(b, 0, Y(89), W, 1, p.grayDark);   // the slab edge
  rect(b, 0, Y(85), 1, 5, p.grayLight); rect(b, W - 1, Y(85), 1, 5, p.grayDark);
  for (let i = 0; i < 4; i++) {                                                                          // the ends of four I-girders
    const gx = 4 + i * 17;
    rect(b, gx, Y(90), 11, 8, p.grayLight); rect(b, gx + 2, Y(91), 7, 6, p.gray);                        // flanges and web seen end-on
    rect(b, gx, Y(90), 11, 1, p.cloudShade); rect(b, gx, Y(97), 11, 1, p.grayDark);
    rect(b, gx + 10, Y(90), 1, 8, p.grayDark);
  }
  ditherRect(b, 0, Y(90), W, 8, p.ink, 6);                                                               // the dark underside of the deck
  rect(b, 4, Y(98), W - 8, 5, p.gray); rect(b, 4, Y(98), W - 8, 1, p.grayLight); rect(b, 4, Y(102), W - 8, 1, p.grayDark);   // the back pier's cap beam
  pier(b, 11, Y(103), Y(FLY.GROUND_BACK), 8, 1);
  pier(b, W - 19, Y(103), Y(FLY.GROUND_BACK), 8, 0);
  ditherRect(b, 0, Y(103), W, FLY.GROUND_BACK - 103, p.ink, 4);                                          // everything under the deck is in shade

  // ---- FRONT sprite: the nearer pier frame (bigger, brighter) ---------------------------------------
  const FH = FLY.GROUND_FRONT - FLY.TOP_FRONT + 1, [fc, f] = makeCanvas(W, FH), F = y => y - FLY.TOP_FRONT;
  rect(f, 1, 0, W - 2, 6, p.gray); rect(f, 1, 0, W - 2, 1, p.grayLight); rect(f, 1, 5, W - 2, 1, p.grayDark);   // the cap beam
  rect(f, 1, 0, 1, 6, p.grayLight); rect(f, W - 2, 0, 1, 6, p.grayDark);
  for (let x = 14; x < W - 6; x += 14) rect(f, x, 1, 1, 4, p.grayDark);
  pier(f, 7, F(104), F(FLY.GROUND_FRONT), 10, 2);
  pier(f, W - 17, F(104), F(FLY.GROUND_FRONT), 10, 1);
  for (let k = 0; k < 22; k++) { px(f, 17 + k, F(110) + k, p.gray); px(f, W - 18 - k, F(110) + k, p.gray); }   // a cross brace between the piers
  return { back: bc, front: fc };
}
