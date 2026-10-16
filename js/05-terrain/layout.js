'use strict';
// js/05-terrain/layout.js
// Defines: buildTerrain

// --- layout: run every section's spawner over its stretch of each layer --
function buildTerrain() {
  setupTerrain();
  const half = CONFIG.TERRAIN_BLEND / 2, last = TERRAIN.length - 1;
  for (const L of TLAYERS) {
    L.lx0 = Math.floor(STATIONS[0].dist * L.f) - 48;
    L.lx1 = Math.ceil(STATIONS[LAST_STATION].dist * L.f) + W + 48;
    L.statics = []; L.live = []; L.data = {};
    TERRAIN.forEach((s, i) => {
      const spec = SECTIONS[s.id][L.key];
      const from = i ? Math.max(L.lx0, lxOf(L, s.u - half)) : L.lx0;
      const to = i < last ? Math.min(L.lx1, lxOf(L, TERRAIN[i + 1].u + half)) : L.lx1;
      if (!spec || from >= to) return;
      const rng = mulberry32(L.seed * 1000 + i * 97);
      const weight = lx => sectionWeight(s.id, uOf(L, lx));
      L.data[s.id] = (spec.spawn && spec.spawn({
        L, rng, from, to, weight,
        ok: lx => rng() < weight(lx),
        stat: (x0, x1, z, draw) => L.statics.push({ x0, x1, z, draw }),   // baked into the chunks
        live: e => L.live.push(e),                                          // drawn every frame
      })) || {};
    });
    L.statics.sort((a, b) => a.z - b.z);
    L.live.sort((a, b) => a.x0 - b.x0);
    L.span = L.live.reduce((m, e) => Math.max(m, e.x1 - e.x0), 0);
  }
}
