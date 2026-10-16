'use strict';
// js/10-stations/cantt.js
// Defines: buildCantt

// Cantonment: another train stands on the line behind ours, a rake of yellow
// coaches with no engine, soldiers guarding it, a buffer stop and a sentry post
// at its end. Row 0 is screen y 70; screen x -420 is the left edge at the stop.
function buildCantt(p, lit) {
  const W = 1100, H = 64, [c, g] = makeCanvas(W, H), L = x => x + 420, rng = mulberry32(1971), END = L(300);
  rect(g, 0, 48, END + 40, 12, p.gray);                                       // gravel bed, y 118..129
  ditherRect(g, 0, 46, END + 40, 2, p.gray, 8);
  for (let i = 0; i < END * 3; i++) px(g, randInt(rng, 0, END + 39), randInt(rng, 48, 59), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  for (let x = 2; x < END; x += 8) { rect(g, x, 49, 4, 3, p.brown); px(g, x, 49, p.tan); }
  rect(g, 0, 49, END, 1, p.grayLight); rect(g, 0, 50, END, 1, p.grayDark);
  const wheel = buildWheels(p)[0], yellow = { ...p, green: p.glow, greenDark: p.amber, cream: p.glow, red: p.amber };
  for (let i = 0; i < 14; i++) {                                              // fourteen yellow coaches, no locomotive
    const x = L(-276) + i * 41;
    g.drawImage(buildCar(yellow, lit, 40 + i), x, 19);
    for (const wx of [5, 13, 25, 33]) g.drawImage(wheel, x + wx - 3, 42);
    rect(g, x + 2, 41, 13, 1, p.gray); rect(g, x + 24, 41, 13, 1, p.gray);
  }
  rect(g, END, 38, 2, 12, p.grayDark); rect(g, END - 1, 38, 4, 4, p.red);      // buffer stop
  const [pc, pg] = makeCanvas(PERSON_W, PERSON_H), [fc, fg] = makeCanvas(PERSON_W, PERSON_H);
  const soldier = (x, flip, fy = 51) => {                                              // painted standing, feet on the gravel
    const d = makeDesign(rng, 'soldier');
    pg.clearRect(0, 0, PERSON_W, PERSON_H); paintPerson(pg, d, p, 0);
    fg.clearRect(0, 0, PERSON_W, PERSON_H); fg.save(); fg.translate(PERSON_W, 0); fg.scale(-1, 1); fg.drawImage(pc, 0, 0); fg.restore();
    g.drawImage(flip ? fc : pc, x - PERSON_CX, fy - PERSON_FY);
  };
  for (let k = 0; k < 8; k++) soldier(L(-232 + k * 70 + Math.floor(rng() * 14)), rng() < 0.5);
  soldier(L(286), true, 52);
  const sx = L(306);                                                          // sentry post: sandbags, a box, a flag
  rect(g, sx, 50, 22, 4, p.tan); rect(g, sx + 2, 47, 18, 3, p.tan);
  for (let x = sx; x < sx + 22; x += 4) px(g, x, 51, p.brown);
  rect(g, sx + 24, 36, 11, 18, p.greenDark); rect(g, sx + 23, 35, 13, 2, p.grayDark); rect(g, sx + 26, 40, 5, 5, lit ? PALETTE.amber : p.ink);
  rect(g, sx + 40, 24, 1, 30, p.grayLight); rect(g, sx + 41, 24, 10, 6, p.greenDark); disc(g, sx + 45, 27, 2, p.red);
  soldier(sx + 12, false, 53);
  for (let x = 0; x < 30; x++) for (let y = 44; y < H; y++)                     // the gravel fades out at the right end
    if (bayer(END + 40 - 1 - x, y) < (30 - x) / 30 * 16) g.clearRect(END + 40 - 1 - x, y, 1, 1);
  return c;
}
