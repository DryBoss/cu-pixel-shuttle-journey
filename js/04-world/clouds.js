'use strict';
// js/04-world/clouds.js
// Defines: buildClouds, buildCumulus

// --- 2. far clouds (0.05x) -------------------------------------------
function buildClouds(p) {
  const TW = 640, TH = 64, rng = mulberry32(7);
  const [c, g] = makeCanvas(TW, TH);
  for (let i = 0; i < 8; i++) {
    const x0 = i * 80 + randInt(rng, 0, 40), base = randInt(rng, 14, 54), n = randInt(rng, 3, 6);
    const puffs = [];
    let x = x0;
    for (let j = 0; j < n; j++) {
      const mid = 1 - Math.abs(j - (n - 1) / 2) / n;
      const r = Math.max(2, Math.round((3 + rng() * 4) * (0.6 + mid * 0.6)));
      puffs.push([x, base - r + 2, r]);
      x += r + randInt(rng, 1, 3);
    }
    wrapX(TW, o => {
      for (const [cx, cy, r] of puffs) disc(g, cx + o, cy, r, p.cloudShade);
      g.clearRect(x0 - 12 + o, base + 2, x - x0 + 24, 12);            // flat underside
      for (const [cx, cy, r] of puffs) disc(g, cx - 1 + o, cy - 1, r - 1, p.white);
    });
  }
  for (let i = 0; i < 6; i++) {                                         // thin high streaks
    const x = randInt(rng, 0, TW - 1), y = randInt(rng, 2, 20), w = randInt(rng, 12, 30);
    wrapX(TW, o => { rect(g, x + o, y, w, 1, p.white); rect(g, x + 4 + o, y + 1, w - 6, 1, p.cloudShade); });
  }
  return c;
}

// Big, bright cumulus for the kash section's autumn sky (0.07x)
function buildCumulus(p) {
  const TW = 576, TH = 60, rng = mulberry32(13);
  const [c, g] = makeCanvas(TW, TH);
  for (let i = 0; i < 5; i++) {
    const x0 = i * 115 + randInt(rng, 0, 50), base = randInt(rng, 34, 54), n = randInt(rng, 4, 6);
    const puffs = [];
    let x = x0;
    for (let j = 0; j < n; j++) {
      const mid = 1 - Math.abs(j - (n - 1) / 2) / n;
      const r = Math.max(4, Math.round((6 + rng() * 6) * (0.5 + mid * 0.7)));
      puffs.push([x, base - r + 2, r]);
      x += r + randInt(rng, 0, 3);
    }
    wrapX(TW, o => {
      for (const [cx, cy, r] of puffs) disc(g, cx + o, cy, r, p.cloudShade);
      for (const [cx, cy, r] of puffs) disc(g, cx + o, cy - 1, r, p.white);   // shade only on the underside
      g.clearRect(x0 - 16 + o, base + 2, x - x0 + 32, 20);
    });
  }
  return c;
}
