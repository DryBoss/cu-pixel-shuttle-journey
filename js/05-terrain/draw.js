'use strict';
// js/05-terrain/draw.js
// Defines: liveScratch, drawTerrain, byZ, crestX, drawWindCrests

// --- per frame: chunks, wind-wave highlights, then live entities ---------
const liveScratch = [];
function drawTerrain(g, v, L, afterGround) {
  const cam = Math.floor(sim.dist * L.f), t = sim.clock;
  const k0 = Math.floor(cam / CHUNK_W), k1 = Math.floor((cam + W - 1) / CHUNK_W);
  for (let k = k0; k <= k1; k++) g.drawImage(terrainChunk(v, L, k).c, k * CHUNK_W - cam, L.y);
  if (afterGround) afterGround(g, v);
  if (L.hiRows) drawWindCrests(g, v, L, cam, k0, k1);
  const list = liveScratch, live = L.live;
  list.length = 0;
  let lo = 0, hi = live.length;
  const start = cam - L.span - 4;
  while (lo < hi) { const m = (lo + hi) >> 1; if (live[m].x0 < start) lo = m + 1; else hi = m; }
  for (let i = lo; i < live.length && live[i].x0 <= cam + W + 4; i++)
    if (live[i].x1 >= cam - 4 && !(live[i].lod && quality.low)) list.push(live[i]);
  list.sort(byZ);
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    e.draw(g, v, -cam, L.y, t);
    if (e.light) addLight(e.light[0] - cam, e.light[1] + L.y, LIGHT_WINDOW);
  }
}
const byZ = (a, b) => a.z - b.z;

// Pixels flagged by a section's hl() light up under the crests of the wind
// waves: strips of rows, each a little behind the one above, so the bands
// sweep diagonally across paddy, kash and tea.
const crestX = [], crestHi = [];
function drawWindCrests(g, v, L, cam, k0, k1) {
  crestX.length = crestHi.length = 0;
  for (let k = k0; k <= k1; k++) { const ch = terrainChunk(v, L, k); if (ch.hi) { crestX.push(k * CHUNK_W - cam); crestHi.push(ch.hi); } }
  if (!crestX.length) return;
  const [r0, r1] = L.hiRows, t = sim.clock;
  for (let y = r0; y < r1; y += 3) {
    const rows = Math.min(3, r1 - y);
    let run = -1;
    for (let x = 0; x <= W; x += 2) {
      const on = x < W && windAt(uOf(L, x + cam) - (y - r0) * 7, t) > 0.38;
      if (on && run < 0) run = x;
      else if (!on && run >= 0) {
        for (let j = 0; j < crestX.length; j++) {
          const cx = crestX[j], a = Math.max(run, cx), b = Math.min(x, cx + CHUNK_W);
          if (b > a) g.drawImage(crestHi[j], a - cx, y, b - a, rows, a, L.y + y, b - a, rows);
        }
        run = -1;
      }
    }
  }
}
