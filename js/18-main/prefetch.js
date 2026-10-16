'use strict';
// js/18-main/prefetch.js
// Defines: PREFETCH_WANT, prefetchTerrain, warmChunk

// Paint terrain chunks (and the sprites standing on them) a little before
// they scroll into view, at most one per frame, for every lighting that
// is on screen or about to be - so nothing is built mid-frame on demand
const PREFETCH_WANT = ['', '', '', ''];
function prefetchTerrain() {
  const now = lightingAt(sim.hour), na = now.a, nb = now.b;
  const soon = lightingAt((sim.hour + 0.6) % 24), sa = soon.a, sb = soon.b;
  const want = PREFETCH_WANT;
  want[0] = na; want[1] = nb; want[2] = sa; want[3] = sb;
  for (let w = 0; w < 4; w++) {
    if (want.indexOf(want[w]) !== w) continue;
    const v = VARIANTS[want[w]];
    for (const L of TLAYERS) {
      const cam = Math.floor(sim.dist * L.f), k0 = Math.floor(cam / CHUNK_W), k1 = Math.floor((cam + W - 1) / CHUNK_W) + 1;
      for (let k = k0; k <= k1; k++) if (!v.chunks[L.key].has(k)) { terrainChunk(v, L, k); warmChunk(v, L, k); return; }
    }
  }
}

// Paint every sprite of the live entities standing on a chunk
function warmChunk(v, L, k) {
  const x0 = k * CHUNK_W, x1 = x0 + CHUNK_W, live = L.live;
  let lo = 0, hi = live.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (live[m].x0 < x0 - L.span) lo = m + 1; else hi = m; }
  for (let i = lo; i < live.length && live[i].x0 < x1; i++) if (live[i].warm && live[i].x1 >= x0) live[i].warm(v);
}
