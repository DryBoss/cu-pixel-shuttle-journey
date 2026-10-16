'use strict';
// js/03-train/loco.js
// Defines: buildLoco

// Locomotive body, 48x28. Row 23 is the underframe (screen y 139).
function buildLoco(p, lit) {
  const [c, g] = makeCanvas(48, 28);
  // roof equipment: radiator fan housing, exhaust stack, twin-trumpet horn
  rect(g, 4, 1, 8, 2, p.grayDark);
  rect(g, 5, 1, 6, 1, p.gray);
  for (let x = 5; x < 11; x += 2) px(g, x, 2, p.ink);
  rect(g, 15, 0, 2, 3, p.grayDark);
  rect(g, 15, 0, 2, 1, p.ink);
  rect(g, 37, 2, 2, 1, p.grayDark);
  rect(g, 35, 1, 5, 1, p.grayLight);
  rect(g, 40, 0, 1, 3, p.grayLight);
  // roof and gutter, rounded towards the nose
  rect(g, 1, 3, 41, 1, p.grayLight);
  rect(g, 0, 4, 43, 1, p.gray);
  // boxy body
  rect(g, 0, 5, 44, 1, p.blue);
  rect(g, 0, 6, 45, 17, p.blue);
  rect(g, 0, 5, 1, 18, p.navy);
  rect(g, 0, 22, 45, 1, p.navy);
  // livery: cream band and thin red line (lines up with the carriages)
  rect(g, 1, 14, 44, 2, p.cream);
  rect(g, 1, 16, 44, 1, p.red);
  // hood louvres
  for (const [x0, x1] of [[3, 13], [17, 29]]) {
    rect(g, x0 - 1, 6, x1 - x0 + 3, 1, p.navy);
    for (let x = x0; x <= x1; x += 2) rect(g, x, 7, 1, 5, p.navy);
  }
  rect(g, 32, 5, 1, 9, p.navy);                       // hood / cab seam
  // cab door, door window and grab rail
  rect(g, 33, 6, 3, 1, p.navy);
  rect(g, 33, 6, 1, 16, p.navy);
  rect(g, 35, 6, 1, 16, p.navy);
  px(g, 34, 8, p.skyLight);
  px(g, 34, 9, p.indigo);
  rect(g, 36, 12, 1, 9, p.grayLight);
  // small cab window (warm cab light after dark)
  rect(g, 37, 6, 6, 6, p.navy);
  if (lit) {
    rect(g, 38, 7, 4, 4, PALETTE.amber);
    rect(g, 38, 7, 4, 1, PALETTE.glow);
  } else {
    rect(g, 38, 7, 4, 4, p.indigo);
    rect(g, 38, 7, 4, 1, p.skyLight);
    px(g, 38, 8, p.skyLight);
  }
  rect(g, 44, 6, 1, 5, p.skyLight);                   // windscreen edge
  // headlight housing on the nose
  rect(g, 45, 5, 2, 3, p.grayDark);
  px(g, 45, 6, PALETTE.glow);
  px(g, 46, 6, PALETTE.white);
  // warning stripes on the nose, number plate
  for (let y = 17; y <= 21; y++) px(g, 44, y, y % 2 ? p.amber : p.ink);
  rect(g, 20, 18, 7, 3, p.cream);
  for (const x of [21, 22, 24, 25]) px(g, x, 19, p.ink);
  // underframe, fuel tank, buffer beam and pilot
  rect(g, 1, 23, 43, 1, p.grayDark);
  rect(g, 18, 24, 11, 1, p.gray);
  rect(g, 18, 25, 11, 1, p.grayDark);
  rect(g, 19, 26, 9, 1, p.ink);
  rect(g, 0, 23, 2, 1, p.red);
  rect(g, 41, 23, 5, 1, p.red);
  px(g, 46, 23, p.ink);
  rect(g, 42, 24, 4, 1, p.grayDark);
  rect(g, 43, 25, 4, 1, p.grayDark);
  rect(g, 44, 26, 3, 1, p.ink);
  weatherTrain(g, p, mulberry32(7), 44, 6, 21);
  return c;
}
