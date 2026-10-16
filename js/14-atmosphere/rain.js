'use strict';
// js/14-atmosphere/rain.js
// Defines: isWater, RAIN_SPRITES, drawRain

// Is this screen pixel open water in the near layer (river or a village pond)?
function isWater(x, y) {
  const u = sim.dist + (x - ANCHOR_X) / PARALLAX.fg, ly = y - LAYER_Y.fg;
  if (sectionWeight('river', u) > 0.5) return ly >= 12 + Math.max(3, bankRows(u));
  const D = TL.fg.data.village;
  if (!D || !D.ponds) return false;
  const lx = x + Math.floor(sim.dist * PARALLAX.fg);
  for (let i = 0; i < D.ponds.length; i++) {
    const pd = D.ponds[i];
    if (Math.abs(lx - pd.cx) <= pd.rx) { const k = pondPixel(pd, lx, ly); return k !== null && k.charCodeAt(0) === 115; }   // 's'ky...
  }
  return false;
}

// Rain streak sprites by slant (0..8) and length (short far, long near)
const RAIN_SPRITES = (() => {
  const out = [];
  for (let s = 0; s <= 8; s++)
    for (const len of [4, 7]) {
      const dx = Math.round(len * s / 8), [c, g] = makeCanvas(dx + 1, len);
      for (let i = 0; i < len; i++) px(g, dx - Math.round(dx * i / (len - 1 || 1)), i, i === len - 1 ? PALETTE.white : PALETTE.cloudShade);
      out.push(c);
    }
  return out;
})();

function drawRain(g) {
  if (!rainPool.n && !splashPool.n) return;
  g.globalAlpha = 0.75;
  for (let i = 0; i < rainPool.n; i++) {
    const r = rainPool.items[i], s = Math.min(8, Math.round(-r.vx / r.vy * 8)), spr = RAIN_SPRITES[s * 2 + (r.depth > 0.95 ? 1 : 0)];
    g.drawImage(spr, Math.round(r.x), Math.round(r.y) - spr.height);
  }
  g.globalAlpha = 1;
  for (let i = 0; i < splashPool.n; i++) {
    const s = splashPool.items[i], x = Math.round(s.x), y = s.y;
    if (s.water) {                                      // a ring spreading on the water
      const rr = 1 + s.age * 9;
      g.fillStyle = PALETTE.skyLight;
      for (let a = 0; a < 8; a++) g.fillRect(Math.round(x + Math.cos(a * 0.785) * rr), Math.round(y + Math.sin(a * 0.785) * rr * 0.35), 1, 1);
    } else {                                            // a little crown of droplets
      g.fillStyle = PALETTE.cloudShade;
      const k = s.age < 0.1 ? 1 : 2;
      g.fillRect(x - k, y - k, 1, 1); g.fillRect(x + k, y - k, 1, 1);
      if (k === 1) g.fillRect(x, y, 1, 1); else g.fillRect(x, y - 3, 1, 1);
    }
  }
}
