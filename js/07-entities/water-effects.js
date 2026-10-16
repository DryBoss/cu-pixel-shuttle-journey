'use strict';
// js/07-entities/water-effects.js
// Defines: shimmerEnt, chunkedShimmer, streamFlowEnt

// --- live entities -----------------------------------------------------------
// Every entity: { x0, x1 (layer columns it may cover), z (draw order),
// draw(g, v, ox, oy, t) } with screen x = lx + ox and screen y = y + oy.

// Glints on water: [lx, y, w, phase, rate] dashes that wink on and off
function shimmerEnt(dashes, z, cols = ['skyLight', 'white']) {
  let x0 = Infinity, x1 = -Infinity;
  for (const d of dashes) { x0 = Math.min(x0, d[0]); x1 = Math.max(x1, d[0] + d[2] + 1); }
  return { x0, x1, z, draw(g, v, ox, oy, t) {
    for (const [x, y, w, ph, rate] of dashes) {
      const s = Math.sin(t * rate + ph);
      if (s > 0.35) rect(g, x + ox + (s > 0.8 ? 1 : 0), y + oy, w, 1, v.p[s > 0.8 ? cols[1] : cols[0]]);
    }
  } };
}

// Split a long run of dashes into entities of ~64 px so culling stays cheap
function chunkedShimmer(ctx, dashes, z, cols) {
  dashes.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < dashes.length; ) {
    const grp = [], end = dashes[i][0] + 64;
    while (i < dashes.length && dashes[i][0] < end) grp.push(dashes[i++]);
    ctx.live(shimmerEnt(grp, z, cols));
  }
}

// Water running downhill: bright points travel along the path
function streamFlowEnt(pts, rng) {
  const ph = rng() * 6;
  let x0 = Infinity, x1 = -Infinity;
  for (const [x] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x + 1); }
  return { x0, x1, z: 1, draw(g, v, ox, oy, t) {
    for (let k = 0; k < pts.length; k++)
      if ((((k - t * 6 + ph) % 5) + 5) % 5 < 1) px(g, pts[k][0] + ox, pts[k][1] + oy, v.p.white);
  } };
}
