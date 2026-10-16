'use strict';
// js/10-stations/bottoli.js
// Defines: buildBottoli

// Bottoli, the old Chattogram terminal (1896): the red colonial building
// across the tracks and two more trains on yard lines in front of it, a green
// rake with its own engine right behind ours and a maroon rake one line
// further back (only their roofs and window rows show over our train). Both
// lines run on a gravel yard with sleepers and end at buffer stops near
// Dewanhat. Sprite row 0 is screen y 56; screen x -420 is its left edge
// while we stand here.
function buildBottoli(p, lit) {
  const W = Math.round(792 + STATIONS[1].dist / 2), H = 90, [c, g] = makeCanvas(W, H), L = x => x + 420, rng = mulberry32(1896), END = W - 72;
  rect(g, 0, 70, W, H - 70, p.gray);                                     // yard ballast, y 126..145
  ditherRect(g, 0, 68, W, 2, p.gray, 8);
  for (let i = 0; i < W * 4; i++) px(g, randInt(rng, 0, W - 1), randInt(rng, 70, H - 1), rng() < 0.5 ? p.grayDark : rng() < 0.5 ? p.grayLight : p.brownDark);
  const RUST = 420;                                                      // the last stretch is abandoned: rusty and overgrown
  const line = wy => {                                                   // sleepers, two rails right under the wheels, a buffer stop
    for (let x = 2; x < END; x += 8) { rect(g, x, wy + 7, 4, 3, p.brown); px(g, x, wy + 7, p.tan); }
    rect(g, 0, wy + 7, END - RUST, 1, p.grayLight); rect(g, 0, wy + 8, END - RUST, 1, p.grayDark);
    for (let x = END - RUST; x < END; x++) {
      const k = (x - (END - RUST)) / RUST;                               // 0 .. 1 towards the end
      px(g, x, wy + 7, k > 0.35 || hash2(x, wy) < k * 2 ? p.rust : p.grayLight); px(g, x, wy + 8, k > 0.35 ? p.brown : p.grayDark);
      if (hash2(x, wy + 3) < 0.1 + 0.5 * k) {                            // weeds growing up through the sleepers
        const top = 1 + Math.floor(hash2(x, wy + 9) * (2 + 4 * k));
        for (let j = 0; j <= top; j++) px(g, x, wy + 6 - j, hash2(x + j, wy) < 0.5 ? p.green : p.grass);
      }
    }
    bufferStop(g, p, END, wy, true);
  };
  line(68); line(79);
  colonialBuilding(g, p, lit, L(20), 72, 262);
  const signal = x => {                                                  // mechanical semaphore: lattice post, red arm down (clear), a lamp hole
    rect(g, x, 20, 2, 52, p.grayDark);
    for (let y = 24; y < 70; y += 4) { px(g, x - 1, y, p.gray); px(g, x + 2, y + 2, p.gray); }
    rect(g, x - 3, 70, 8, 2, p.grayDark);
    rect(g, x - 2, 16, 6, 4, p.ink); px(g, x - 1, 17, lit ? PALETTE.glow : p.amber); px(g, x, 17, lit ? PALETTE.glow : p.amber);   // lamp housing and lens
    for (let k = 0; k < 11; k++) { px(g, x + 2 + k, 25 + k, p.red); px(g, x + 2 + k, 26 + k, p.red); px(g, x + 2 + k, 27 + k, p.red); }
    px(g, x + 9, 32, p.white); px(g, x + 10, 33, p.white); px(g, x + 10, 32, p.white);
    rect(g, x - 3, 25, 4, 4, p.ink); rect(g, x - 2, 26, 2, 2, lit ? PALETTE.glow : p.amber);     // the spectacle plate and its lamp hole
  };
  signal(L(8)); signal(L(300));
  const wheel = buildWheels(p)[0];
  const rake = (hazeLevel, paint) => {                                   // one layer per rake so a haze can push it back
    const [rc, rg] = makeCanvas(W, H);
    paint(rg);
    rg.globalCompositeOperation = 'source-atop';
    ditherRect(rg, 0, 0, W, H, p.haze, hazeLevel);
    g.drawImage(rc, 0, 0);
  };
  const coaches = (rg, pal, wy, x0, n, seed) => {
    for (let i = 0; i < n; i++) {
      const x = x0 + i * 41;
      rg.drawImage(buildCar(pal, lit, seed + i), x, wy - 23);
      for (const wx of [5, 13, 25, 33]) rg.drawImage(wheel, x + wx - 3, wy);
      rect(rg, x + 2, wy - 1, 13, 1, p.gray); rect(rg, x + 24, wy - 1, 13, 1, p.gray);
    }
  };
  const maroon = { ...p, green: p.rust, greenDark: p.brown };                       // the far line: classic maroon intercity livery
  const gy = { ...p, cream: p.glow, red: p.amber }, yellow = { ...p, green: p.glow, greenDark: p.amber, cream: p.glow, red: p.amber };
  const goods = { ...p, blue: p.greenDark, navy: p.greenDeep, cream: p.glow, red: p.amber };   // a green and yellow engine
  rake(5, rg => coaches(rg, maroon, 68, L(-150), 8, 20));                // the far line: a long maroon rake
  rake(2, rg => {                                                        // the near line: engine at the head, coaches behind
    rg.drawImage(buildLoco(goods, lit), L(272), 79 - 28);
    for (const wx of [6, 14, 31, 39]) rg.drawImage(wheel, L(272) + wx - 3, 79);
    for (let i = 0; i < 7; i++) coaches(rg, i % 3 === 2 ? yellow : gy, 79, L(272) - 41 * (i + 1), 1, 30 + i);   // green and yellow coaches
  });
  for (let x = W - 70; x < W; x++)                                       // the yard peters out
    for (let y = 66; y < H; y++) if (bayer(x, y) < (x - (W - 70)) / 70 * 16) g.clearRect(x, y, 1, 1);
  return c;
}
