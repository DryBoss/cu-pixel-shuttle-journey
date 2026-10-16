'use strict';
// js/03-train/car.js
// Defines: windowPane, buildCar, weatherTrain

function windowPane(g, p, lit, x, y, w, h) {
  if (lit) {
    rect(g, x, y, w, h, PALETTE.glow);
    rect(g, x, y + h - 1, w, 1, PALETTE.amber);
  } else {
    rect(g, x, y, w, h, p.indigo);
    px(g, x, y, p.skyLight);
  }
}

// Passenger carriage, 39x19. Row 0 is the roof (screen y 121).
function buildCar(p, lit, seed) {
  const rng = mulberry32(100 + seed);
  const w = CONFIG.CAR_W;
  const [c, g] = makeCanvas(w, 19);
  rect(g, 3, 0, w - 6, 1, p.grayLight);               // roof crown
  rect(g, 1, 1, w - 2, 1, p.gray);                    // roof
  rect(g, 0, 2, w, 1, p.grayDark);                    // rain gutter
  rect(g, 0, 3, w, 13, p.green);                      // green body
  rect(g, 0, 9, w, 2, p.cream);                       // cream stripe
  rect(g, 0, 11, w, 1, p.red);                        // thin red line
  rect(g, 0, 15, w, 1, p.greenDark);
  rect(g, 0, 3, 1, 13, p.greenDark);
  rect(g, w - 1, 3, 1, 13, p.greenDark);
  // a door at each end
  for (const dx of [1, w - 5]) {
    rect(g, dx, 4, 4, 1, p.greenDark);
    rect(g, dx, 4, 1, 12, p.greenDark);
    rect(g, dx + 3, 4, 1, 12, p.greenDark);
    windowPane(g, p, lit, dx + 1, 5, 2, 2);
    px(g, dx === 1 ? dx + 2 : dx + 1, 12, p.grayLight);
  }
  // row of small windows, some with passengers
  for (let i = 0; i < 5; i++) {
    const wx = 8 + i * 5;
    windowPane(g, p, lit, wx, 5, 3, 3);
    if (rng() < 0.7) {
      const hx = wx + randInt(rng, 0, 2), col = lit ? PALETTE.rust : p.ink;
      px(g, hx, 6, col);
      const x0 = Math.max(wx, hx - 1), x1 = Math.min(wx + 2, hx + 1);
      rect(g, x0, 7, x1 - x0 + 1, 1, col);
    }
  }
  // underframe and equipment box between the bogies
  rect(g, 1, 16, w - 2, 1, p.grayDark);
  rect(g, 2, 17, w - 4, 1, p.ink);
  rect(g, 17, 17, 5, 2, p.grayDark);
  for (let i = 0; i < 5; i++) rect(g, 8 + i * 5 + 1, 5, 1, 3, p.ink);              // window bars
  weatherTrain(g, p, rng, w, 3, 15);
  return c;
}

// Years of service: faded patches, rust, streaks running down from the rivets
function weatherTrain(g, p, rng, w, y0, y1) {
  for (let i = 0; i < w * 1.3; i++) {
    const r = rng(), x = randInt(rng, 0, w - 1), y = randInt(rng, y0, y1);
    px(g, x, y, r < 0.4 ? p.rust : r < 0.7 ? p.grayDark : p.brownDark);
  }
  for (let k = 0; k < Math.floor(w / 9); k++) {
    const x = randInt(rng, 2, w - 3), y = randInt(rng, y0 + 4, y1 - 3);
    for (let j = 0, n = randInt(rng, 2, 5); j < n; j++) px(g, x, y + j, p.rust);
  }
}
