'use strict';
// js/10-stations/prop-helpers.js
// Defines: prop, glowHalo

// --- shared furniture sprites; each has an anchor (ax, ay) at its foot --
function prop(w, h, ax, ay, paint) {
  const [c, g] = makeCanvas(w, h);
  paint(g);
  return { c, ax, ay };
}

function glowHalo(g, cx, cy, r0, r1, level) {
  const n = Math.ceil(r1);
  for (let y = -n; y <= n; y++)
    for (let x = -n; x <= n; x++) {
      const d = Math.hypot(x, y);
      if (d > r0 && d <= r1 && bayer(cx + x, cy + y) < level) px(g, cx + x, cy + y, PALETTE.glow);
    }
}
