'use strict';
// js/04-world/track.js
// Defines: buildTrackRusty, buildTrack

// --- 5b. track: gravel bed, wooden sleepers, two rails (1.0x) ---------
// The abandoned yard lines: the same track, its rails rusted and weeds coming up through it
function buildTrackRusty(p) {
  const c = buildTrack(p), g = c.getContext('2d'), rng = mulberry32(14), TW = c.width;
  rect(g, 0, 6, TW, 1, p.rust); rect(g, 0, 7, TW, 1, p.brown); rect(g, 0, 11, TW, 1, p.rust); rect(g, 0, 12, TW, 1, p.brown);
  for (let x = 0; x < TW; x++) if (rng() < 0.12) { px(g, x, 6, p.orange); px(g, x, 11, p.orange); }
  for (let i = 0; i < TW * 0.8; i++) {
    const x = randInt(rng, 0, TW - 1), y = randInt(rng, 3, 14);
    for (let j = 0, h = randInt(rng, 1, 3); j < h; j++) px(g, x, y - j, rng() < 0.5 ? p.green : p.greenDark);
  }
  return c;
}

function buildTrack(p) {
  const TW = 192, TH = 20, rng = mulberry32(5);
  const [c, g] = makeCanvas(TW, TH);
  rect(g, 0, 3, TW, 12, p.gray);                                        // ballast top
  rect(g, 0, 15, TW, 3, p.grayDark);                                    // ballast shoulder
  for (let i = 0; i < TW * 8; i++) {
    const x = randInt(rng, 0, TW - 1), y = randInt(rng, 3, 17), r = rng();
    px(g, x, y, y >= 15 ? (r < 0.5 ? p.gray : p.brownDark)
                        : r < 0.4 ? p.grayLight : r < 0.8 ? p.grayDark : p.brown);
  }
  for (let x = 0; x < TW; x++) if (bayer(x, 3) < 8) px(g, x, 3, p.grayLight);
  for (let x = 2; x < TW; x += 8) {                                     // sleepers
    rect(g, x, 5, 4, 9, p.brown);
    rect(g, x + 3, 5, 1, 9, p.brownDark);
    rect(g, x, 13, 4, 1, p.brownDark);
    px(g, x, 5, p.tan);
  }
  rect(g, 0, 6, TW, 1, p.grayLight); rect(g, 0, 7, TW, 1, p.grayDark);  // far rail
  rect(g, 0, 11, TW, 1, p.grayLight); rect(g, 0, 12, TW, 1, p.grayDark); // near rail (y 151)
  return c;
}
