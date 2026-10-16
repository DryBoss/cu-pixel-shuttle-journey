'use strict';
// js/10-stations/overpass.js
// Defines: DEW_VEH, DEW_TRAFFIC, dewTraffic, overpassLeft, drawOverpassTraffic, drawOverpassShade

const DEW_VEH = {                                                        // side views of what crosses the deck; R paints mirrored for the other direction
  bus:   { w: 24, h: 12, paint: (R, P, lit) => { R(0, 1, 24, 9, P.navy); R(0, 0, 24, 1, P.slate); R(1, 2, 21, 3, lit ? PALETTE.glow : P.skyMid); R(0, 6, 24, 1, P.red); R(2, 10, 4, 2, P.ink); R(17, 10, 4, 2, P.ink); R(23, 7, 1, 2, PALETTE.glow); } },
  cng:   { w: 11, h: 8,  paint: (R, P, lit) => { R(0, 2, 11, 4, P.greenDark); R(1, 0, 8, 2, P.ink); R(9, 2, 2, 2, lit ? PALETTE.glow : P.skyMid); R(1, 6, 3, 2, P.ink); R(7, 6, 3, 2, P.ink); } },
  rick:  { w: 10, h: 11, paint: (R, P, lit) => { R(0, 0, 5, 4, P.rust); R(0, 4, 5, 1, P.ink); R(5, 3, 2, 3, P.ink); R(5, 1, 2, 2, P.brown); R(0, 5, 8, 1, P.grayDark); R(0, 6, 3, 5, P.ink); R(6, 6, 3, 5, P.ink); } },
  truck: { w: 22, h: 13, paint: (R, P, lit) => { R(0, 1, 15, 8, P.grayDark); R(0, 0, 15, 1, P.brown); R(15, 3, 7, 6, P.navy); R(19, 4, 3, 2, lit ? PALETTE.glow : P.skyMid); R(2, 9, 18, 1, P.ink); R(2, 10, 4, 3, P.ink); R(15, 10, 4, 3, P.ink); } },
  bike:  { w: 6,  h: 7,  paint: (R, P, lit) => { R(1, 0, 2, 3, P.ink); R(0, 3, 5, 2, P.red); R(0, 5, 2, 2, P.ink); R(4, 5, 2, 2, P.ink); } },
};
let DEW_TRAFFIC = null;
function dewTraffic() {
  if (!DEW_TRAFFIC) {
    const rng = mulberry32(31), kinds = ['bus', 'cng', 'cng', 'rick', 'truck', 'bike', 'cng', 'rick', 'bus'];
    DEW_TRAFFIC = Array.from({ length: 13 }, (_, i) => ({ kind: kinds[i % kinds.length], dir: i % 3 === 2 ? -1 : 1, speed: 4 + rng() * 11, x0: rng() * DEW_W }));
  }
  return DEW_TRAFFIC;
}
const overpassLeft = () => BACKDROPS.dewanhat.sx + Math.floor(STATIONS[1].dist * 0.5) - Math.floor(sim.dist * 0.5);   // same stepping as drawBackdrops
function drawOverpassTraffic(g, v) {
  const left = overpassLeft();
  if (left > W || left + DEW_W < 0) return;
  const surface = BACKDROPS.dewanhat.y + 12;
  for (const t of dewTraffic()) {
    const V = DEW_VEH[t.kind], pos = (((t.x0 + t.dir * t.speed * sim.clock) % DEW_W) + DEW_W) % DEW_W, x = Math.round(left + pos) - V.w;
    if (x > W || x + V.w < 0) continue;
    const R = (dx, dy, w, h, col) => { g.fillStyle = col; g.fillRect(t.dir > 0 ? x + dx : x + V.w - dx - w, surface - V.h + dy, w, h); };
    V.paint(R, v.p, v.lit);
  }
}
function drawOverpassShade(g, v) {                                      // the deck's shadow lies over the train and the tracks
  const a = overpassLeft(), b = a + DEW_W;
  if (b < 0 || a > W) return;
  g.fillStyle = v.p.ink;
  for (let x = Math.max(0, a); x < Math.min(W, b); x++) {
    g.globalAlpha = 0.3 * Math.max(0, Math.min(1, (x - a) / 40, (b - x) / 40));
    g.fillRect(x, 118, 1, 44);
  }
  g.globalAlpha = 1;
}
