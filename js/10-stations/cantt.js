'use strict';
// js/10-stations/cantt.js
// Defines: buildCantt

// Cantonment, across the tracks: a long rake of faded yellow army coaches, no engine, waiting idle on
// the line behind ours; long low white barracks with dark green roofs and rows of identical square
// windows behind them; huge dome-shaped old rain trees; soldiers on the gravel; a solid steel buffer
// stop at the end of the line, and next to it a sandbag sentry box with a camouflage tin roof and a
// flag. Row 0 is screen y 70; screen x -460 is the left edge at the stop.
function buildCantt(p, lit) {
  const OFF = 460, W = 1140, H = 72, [c, g] = makeCanvas(W, H), L = x => x + OFF, rng = mulberry32(1971), END = L(262);
  rect(g, 0, 22, END + 40, 36, p.green); ditherRect(g, 0, 22, END + 40, 36, p.grass, 5);      // the lawns behind: they run right down to the gravel, so the barracks stand on the ground
  for (let y = 36; y < 58; y += 2) ditherRect(g, 0, y, END + 40, 1, p.greenDark, 3);          // mown stripes, a little darker towards the line
  for (let x = 0; x < 40; x++) for (let y = 22; y < 58; y++) {                                  // the lawn thins out into the surrounding ground at both ends, so it never ends in a hard-edged slab
    if (bayer(x, y) < (40 - x) / 40 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(END + 39 - x, y) < (40 - x) / 40 * 16) g.clearRect(END + 39 - x, y, 1, 1);
  }
  for (let y = 22; y < 28; y++) for (let x = 40; x < END; x++) if (bayer(x, y) < (28 - y) / 6 * 12) g.clearRect(x, y, 1, 1);   // and softly along the top, where the hedges and trees hide it
  for (const [a, b] of [[-440, -262], [-248, -70], [-56, 122], [136, 258]]) {                  // the barracks, high enough to show above the canopy roof
    canttBarracksLong(g, p, lit, L(a), 22, b - a, 12);
    hedgeRow(g, p, L(a) - 2, b - a + 4, 25, 4);                                                // a clipped hedge along their feet
  }
  for (let x = -420, i = 0; x <= 200; x += 110, i++)                                           // the old rain trees: huge neat domes
    rainTree(g, p, L(x + (i % 2) * 8), 33, 40 + (i % 3) * 4, 24 + (i % 2) * 3, 500 + i * 17, 27);
  g.translate(0, 8);                                                                           // everything below sits where it always did (sprite y is now 62)
  rect(g, 0, 48, END + 40, 12, p.gray);                                       // gravel bed, y 118..129
  ditherRect(g, 0, 46, END + 40, 2, p.gray, 8);
  for (let i = 0; i < END * 3; i++) px(g, randInt(rng, 0, END + 39), randInt(rng, 48, 59), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  for (let x = 2; x < END; x += 8) { rect(g, x, 49, 4, 3, p.brown); px(g, x, 49, p.tan); }
  rect(g, 0, 49, END, 1, p.grayLight); rect(g, 0, 50, END, 1, p.grayDark);


  const wheel = buildWheels(p)[0], yellow = { ...p, green: p.peach, greenDark: p.tan, cream: p.cream, red: p.orange };   // faded yellow
  for (let i = 0; i < 14; i++) {                                              // fourteen faded yellow coaches, no locomotive
    const x = L(-316) + i * 41;
    g.drawImage(buildCar(yellow, lit, 40 + i), x, 19);
    for (const wx of [5, 13, 25, 33]) g.drawImage(wheel, x + wx - 3, 42);
    rect(g, x + 2, 41, 13, 1, p.gray); rect(g, x + 24, 41, 13, 1, p.gray);
  }

  // --- a solid steel buffer stop at the end of the line
  rect(g, END - 2, 50, 18, 3, p.cloudShade);
  rect(g, END, 38, 3, 12, p.grayDark); rect(g, END, 38, 1, 12, p.gray);
  rect(g, END - 1, 40, 5, 7, p.gray); rect(g, END - 1, 40, 5, 1, p.grayLight);
  for (const by of [41, 44]) { rect(g, END - 5, by, 4, 2, p.gray); rect(g, END - 6, by - 1, 1, 4, p.grayLight); }   // the two buffers
  for (let k = 0; k < 11; k++) { px(g, END + 3 + k, 40 + k, p.grayDark); px(g, END + 3 + k, 41 + k, p.grayDark); }   // heavy diagonal braces
  rect(g, END + 1, 36, 2, 2, p.red);

  const [pc, pg] = makeCanvas(PERSON_W, PERSON_H), [fc, fg] = makeCanvas(PERSON_W, PERSON_H);
  const soldier = (x, flip, fy = 51) => {                                     // painted standing, feet on the gravel
    const d = makeDesign(rng, 'soldier');
    pg.clearRect(0, 0, PERSON_W, PERSON_H); paintPerson(pg, d, p, 0);
    fg.clearRect(0, 0, PERSON_W, PERSON_H); fg.save(); fg.translate(PERSON_W, 0); fg.scale(-1, 1); fg.drawImage(pc, 0, 0); fg.restore();
    g.drawImage(flip ? fc : pc, x - PERSON_CX, fy - PERSON_FY);
  };
  for (let k = 0; k < 8; k++) soldier(L(-290 + k * 66 + Math.floor(rng() * 14)), rng() < 0.5);

  // --- the sentry box: sandbag walls (staggered courses), a camouflage tin roof, a flag nearby
  const sx = L(272);
  for (let r = 0; r < 4; r++) for (let x = sx + (r & 1) * 2; x < sx + 24; x += 4) {
    if (r < 3 && x > sx + 7 && x < sx + 16) continue;                         // the opening
    rect(g, x, 51 - r * 2, 4, 2, p.tan); px(g, x, 52 - r * 2, p.brown); px(g, x + 3, 51 - r * 2, p.cream);
  }
  rect(g, sx + 8, 44, 8, 6, p.ink);
  rect(g, sx + 1, 43, 2, 5, p.brownDark); rect(g, sx + 21, 43, 2, 5, p.brownDark);
  rect(g, sx - 2, 40, 28, 3, p.greenDark); rect(g, sx - 2, 40, 28, 1, p.green);
  for (let i = 0; i < 16; i++) rect(g, sx - 2 + Math.floor(rng() * 25), 40 + Math.floor(rng() * 3), 3, 1, [p.greenDeep, p.green, p.brown][i % 3]);   // camouflage
  rect(g, sx - 2, 43, 28, 1, p.greenDeep);
  if (lit) rect(g, sx + 10, 44, 4, 2, PALETTE.amber);
  soldier(sx + 12, false, 53);
  rect(g, sx + 34, 22, 1, 31, p.grayLight);                                   // flagpole with a tiny red-and-green flag
  rect(g, sx + 35, 22, 10, 6, p.green); disc(g, sx + 39, 25, 2, p.red);
  for (let x = 0; x < 30; x++) for (let y = 44; y < H; y++)                    // the gravel fades out at the right end
    if (bayer(END + 40 - 1 - x, y) < (30 - x) / 30 * 16) g.clearRect(END + 40 - 1 - x, y, 1, 1);
  return c;
}
