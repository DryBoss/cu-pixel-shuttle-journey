'use strict';
// js/05-terrain/sampling.js
// Defines: setupTerrain, TERRAIN_TMP, halfOf, terrainAt, sectionWeight, windAt, leanAt

function setupTerrain() {
  const at = a => STATIONS[a[0]].dist + a[1];
  TERRAIN.forEach((s, i) => { s.u = i ? at(s.at) : -Infinity; });
  BRIDGE.u0 = at(BRIDGE.at);
  BRIDGE.u1 = BRIDGE.u0 + BRIDGE.spans * BRIDGE.span;
}

// Sections at world position u: a, b are TERRAIN indices, t the weight of b.
// Writes into out (a shared scratch object unless one is passed), so read
// the result before the next call.
const TERRAIN_TMP = { a: 0, b: 0, t: 0 }, TERRAIN_SW = { a: 0, b: 0, t: 0 };
const halfOf = i => (TERRAIN[i].blend || CONFIG.TERRAIN_BLEND) / 2;     // a section may set its own, shorter blend ('blend: 30' is a hard border)
function terrainAt(u, out = TERRAIN_TMP) {
  const n = TERRAIN.length;
  out.a = out.b = n - 1; out.t = 0;
  for (let i = 1; i < n; i++) {
    const b = TERRAIN[i].u, half = halfOf(i);
    if (u < b - half) { out.a = out.b = i - 1; break; }
    if (u < b + half) { out.a = i - 1; out.b = i; out.t = smoothstep((u - b + half) / (2 * half)); break; }
  }
  return out;
}

function sectionWeight(id, u) {
  const w = terrainAt(u, TERRAIN_SW);
  return (TERRAIN[w.a].id === id ? 1 - w.t : 0) + (TERRAIN[w.b].id === id ? w.t : 0);
}

// Breeze: waves of wind sweeping back along the line, roughly -1..1
const windAt = (u, t) => Math.sin(u * 0.016 + t * 1.7) * 0.65 + Math.sin(u * 0.043 + t * 2.9 + 1.7) * 0.35;
// How far a plant at u leans right now: -1..2 (the breeze mostly blows one way)
// (sim.wind 0..1 from the season: monsoon gales push every plant to full lean)
const leanAt = (u, t) => Math.max(-1, Math.min(2, Math.round(windAt(u, t) * 1.7 * (1 + 0.5 * sim.wind) + 0.4 + 0.9 * sim.wind)));
