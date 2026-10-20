'use strict';
// js/10-stations/cantt.js
// Defines: buildCantt

// Cantonment, across the tracks. Reworked from the ground up so nothing stands on the yellow train any more:
//   - the faded yellow, engine-less army rake waits on the line right behind ours, its roofs at screen y 89;
//   - above it, 11 px clear of the roofs, a low whitewashed boundary wall and a mown lawn separate the railway from
//     the station grounds (so the buildings and trees have their own ground, in plain view above the coaches);
//   - on the lawn, behind a clipped hedge: the station building (porch, clock, name board, flag) in the middle,
//     long white barracks to both sides, and the old rain trees with their trunks showing, standing in the gaps and
//     at the ends, not in front of the building;
//   - soldiers on the gravel by the rake, a steel buffer stop at the end of the line and a sandbag sentry box.
// Sprite row 0 is screen y 50 (the sprite is drawn at y 50); screen x -460 is the left edge at the stop. The rows
// from the gravel down are the old ones shifted by 20.
function buildCantt(p, lit) {
  const OFF = 460, W = 1140, H = 82, [c, g] = makeCanvas(W, H), L = x => x + OFF, rng = mulberry32(1971), END = L(262);
  const GB = 30, LAWN0 = 31, SC0 = L(150);                                                                   // ground row of the buildings and trees (screen 80), first lawn row
  // --- the station grounds: a mown lawn from just under the buildings down to the boundary wall
  const LAWN1 = 66;                                                                            // the lawn runs right down to the siding's gravel (row 66 = screen 116): the buildings stand on it, nothing floats
  rect(g, 0, LAWN0, END + 40, LAWN1 - LAWN0, p.green); ditherRect(g, 0, LAWN0, END + 40, LAWN1 - LAWN0, p.grass, 5);
  for (let y = LAWN0 + 1; y < LAWN1; y += 2) ditherRect(g, 0, y, END + 40, 1, p.greenDark, 3);   // mown stripes
  rect(g, SC0 - 7, GB, 14, LAWN1 - GB, p.tan); ditherRect(g, SC0 - 7, GB, 14, LAWN1 - GB, p.brown, 5);   // the gravel path from the porch down to the line
  rect(g, 0, LAWN0 - 3, END + 40, 3, p.greenDark); ditherRect(g, 0, LAWN0 - 4, END + 40, 1, p.green, 6);   // the back lawn in the buildings' shade
  const SC = L(150);                                                                           // the station building stands centred on the platform
  // --- far rank: smaller, darker rain trees between and behind the buildings (trunks hidden by the hedge)
  for (let x = -440, i = 0; x <= 236; x += 52, i++)
    rainTree(g, p, L(x + ((i * 17) % 23)), GB - 1, 20 + (i % 3) * 3, 15 + (i % 2) * 3, 300 + i * 11, GB - 6);
  // --- the buildings, base on row GB
  canttStationHouse(g, p, lit, SC - 78, GB, 156);
  for (const [a, b] of [[-440, -250], [-232, -86]]) {                                          // long white barracks to the left of the station house (the lawn ends at the buffer stop on the right)
    canttBarracksLong(g, p, lit, L(a), GB, b - a, 12);
    hedgeRow(g, p, L(a) - 2, b - a + 4, GB + 3, 4);
  }
  hedgeRow(g, p, SC - 90, 180, GB + 3, 4);                                                    // a clipped hedge along the station house's feet, with a gap at the porch
  rect(g, SC - 8, GB - 1, 16, 4, p.green); ditherRect(g, SC - 8, GB - 1, 16, 4, p.tan, 6);   // the gravel approach to the porch
  // --- front rank: the great domed rain trees stand in the gaps and at the two ends, trunks planted on the lawn
  const bigTree = (x, rw, rh, seed) => rainTree(g, p, L(x), GB + 5, rw, rh, seed, GB - 2);
  for (const [x, rw, rh, seed] of [[-470, 34, 24, 500], [-170, 40, 26, 517], [-60, 26, 22, 534], [246, 24, 21, 551]])
    bigTree(x, rw, rh, seed);
  // --- shade trees and clipped shrubs dotted over the big lawn, so it reads as a kept garden, not a flat band
  for (const [x, i] of [[-400, 0], [-300, 1], [-205, 2], [-110, 3], [-30, 4], [95, 5], [195, 6]]) {
    if (Math.abs(x - 150) < 14) continue;
    rainTree(g, p, L(x), 55 + (i % 2) * 3, 11 + (i % 3), 9, 700 + i * 13, 47 + (i % 2) * 3);
  }
  for (const x of [-350, -250, -160, -70, 40, 110, 230]) { rect(g, L(x) - 5, 59, 11, 4, p.greenDark); ditherRect(g, L(x) - 5, 59, 11, 3, p.green, 6); px(g, L(x) - 2, 59, p.red); px(g, L(x) + 2, 60, p.amber); }
  // --- the boundary wall between the lawn and the railway, and the gate in it
  canttLowWall(g, p, 0, END + 40, LAWN1, 4);                                                  // the low boundary wall along the siding
  for (let x = 0; x < 40; x++) for (let y = 0; y < H; y++) {                                  // the whole lawn thins out into the surrounding ground at both ends
    if (bayer(x, y) < (40 - x) / 40 * 16) g.clearRect(x, y, 1, 1);
    if (bayer(END + 39 - x, y) < (40 - x) / 40 * 16) g.clearRect(END + 39 - x, y, 1, 1);
  }
  g.translate(0, 20);                                                                          // everything below sits where it always did (the old sprite y of 62 is now 50)
  rect(g, 0, 48, END + 40, 12, p.gray);                                       // gravel bed, y 118..129
  ditherRect(g, 0, 46, END + 40, 2, p.gray, 8);
  for (let i = 0; i < END * 3; i++) px(g, randInt(rng, 0, END + 39), randInt(rng, 48, 59), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  for (let x = 2; x < END; x += 8) { rect(g, x, 49, 4, 3, p.brown); px(g, x, 49, p.tan); }
  rect(g, 0, 49, END, 1, p.grayLight); rect(g, 0, 50, END, 1, p.grayDark);

  // (the faded yellow army rake is gone: the siding stands empty, so nothing can look stacked on a train)

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
  for (let k = 0; k < 4; k++) soldier(L(-290 + k * 130 + Math.floor(rng() * 14)), rng() < 0.5);

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
  for (let x = 0; x < 30; x++) for (let y = 44; y < H - 20; y++)                    // the gravel fades out at the right end
    if (bayer(END + 40 - 1 - x, y) < (30 - x) / 30 * 16) g.clearRect(END + 40 - 1 - x, y, 1, 1);
  return c;
}
