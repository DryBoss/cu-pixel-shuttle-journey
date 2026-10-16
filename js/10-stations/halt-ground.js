'use strict';
// js/10-stations/halt-ground.js
// Defines: buildHaltGround

// An unofficial stop (Dewanhat): no platform, only gravel and trodden earth
function buildHaltGround(p, w, seed, green) {
  const rng = mulberry32(2000 + seed), [c, g] = makeCanvas(w, 19);
  for (let y = 0; y < 19; y++)
    for (let x = 0; x < w; x++) {
      const k = rng(), mix = y < 3 ? 0 : y > 6 ? 1 : (bayer(x, y) < (y - 2) * 4 ? 1 : 0);     // dark ballast above, then dirt
      px(g, x, y, !mix ? (k < 0.45 ? p.grayDark : k < 0.78 ? p.gray : k < 0.9 ? p.ink : p.grayLight)
                       : green ? (k < 0.35 ? p.green : k < 0.65 ? p.grass : k < 0.85 ? p.grassLight : p.greenDark)
                               : (k < 0.22 ? p.brownDark : k < 0.34 ? p.tan : k < 0.38 ? p.rust : p.brown));
    }
  for (let n = 0; n < w / 9; n++) {                                        // patchy, dusty weeds
    const cx = randInt(rng, 0, w - 1), cy = randInt(rng, 8, 17), r = randInt(rng, 2, 4);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r || rng() < 0.5) continue;
      const x = cx + dx, y = cy + dy;
      if (x >= 0 && x < w && y > 6 && y < 19) px(g, x, y, rng() < 0.4 ? p.green : rng() < 0.6 ? p.grass : rng() < 0.5 ? p.greenDark : p.tan);   // dust on the leaves
    }
  }
  for (let n = 0; n < Math.max(3, Math.round(w / 90)); n++) {              // footpaths wind up from the front to the tracks
    const x0 = randInt(rng, 10, w - 10), ph = rng() * 6, pw = randInt(rng, 3, 5);
    for (let y = 18; y >= 0; y--) {
      const cx = x0 + Math.round(Math.sin(y * 0.55 + ph) * 3 + (18 - y) * 0.25);
      for (let dx = -pw; dx <= pw; dx++) {
        const x = cx + dx;
        if (x < 0 || x >= w || Math.abs(dx) > pw - (rng() < 0.3 ? 1 : 0)) continue;
        const k = rng();
        px(g, x, y, y < 5 ? (k < 0.6 ? p.grayLight : p.gray) : k < 0.5 ? p.tan : k < 0.8 ? p.cream : p.brown);   // trodden pale
      }
    }
  }
  for (let i = 0; i < w / 5; i++)                                          // litter: wrappers and plastic bags
    px(g, randInt(rng, 0, w - 1), randInt(rng, 2, 18), p[pick(rng, ['white', 'white', 'blue', 'red', 'skyMid', 'orange'])]);
  return c;
}
