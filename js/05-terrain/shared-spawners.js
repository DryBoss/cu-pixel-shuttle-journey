'use strict';
// js/05-terrain/shared-spawners.js
// Defines: treeLine, farBank, addTufts, fogBands, fogSprite

// --- shared spawners ------------------------------------------------------
// Distant tree line with coconut palms, all one haze colour (far layer)
function treeLine(ctx, base = 52) {
  const { rng } = ctx;
  for (let x = ctx.from; x < ctx.to; ) {
    if (rng() < 0.12) { x += randInt(rng, 8, 26); continue; }       // open gap
    const r = randInt(rng, 2, 6), cy = base - randInt(rng, 0, 5) - r + 1, cx = x;
    if (ctx.ok(cx)) ctx.stat(cx - r, cx + r, 0, (g, p, lit, ox) => {
      disc(g, cx + ox, cy, r, p.haze);
      rect(g, cx - r + 1 + ox, cy, 2 * r - 1, base - cy, p.haze);
    });
    if (rng() < 0.06) {
      const h = randInt(rng, 12, 18), lean = randInt(rng, -2, 2), tx = x + randInt(rng, -3, 3);
      if (ctx.ok(tx)) ctx.stat(tx - 8, tx + 8, 1, (g, p, lit, ox) => palm(g, tx + ox, base, h, lean, p.haze, p.haze, p.haze));
    }
    x += r + randInt(rng, 0, 3);
  }
}

// The low far shore of a wide river, tiny sails, shimmer on the open water
function farBank(ctx, y) {
  const { rng } = ctx, dashes = [];
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 2, 6)) {
    if (!ctx.ok(x)) continue;
    const r = randInt(rng, 1, 2), tx = x, isPalm = rng() < 0.08, h = randInt(rng, 5, 8);
    ctx.stat(tx - 7, tx + 7, 0, (g, p, lit, ox) =>
      isPalm ? palm(g, tx + ox, y + 1, h, 0, p.haze, p.haze, p.haze) : disc(g, tx + ox, y - r + 1, r, p.haze));
  }
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 4, 12))
    if (ctx.ok(x)) dashes.push([x, randInt(rng, y + 5, Math.min(59, y + 14)), randInt(rng, 2, 4), rng() * 6, 1 + rng() * 2]);
  chunkedShimmer(ctx, dashes, 0);
  for (let x = ctx.from + randInt(rng, 20, 80); x < ctx.to; x += randInt(rng, 70, 160))
    if (ctx.ok(x)) ctx.live(tinySailEnt(x, randInt(rng, y + 5, y + 9), rng));
}

function addTufts(ctx, every, y0, y1, tall = 7) {
  const { rng } = ctx;
  for (let x = ctx.from + randInt(rng, 0, every); x < ctx.to; x += randInt(rng, every >> 1, (every * 1.5) | 0)) {
    const base = randInt(rng, y0, y1), h = randInt(rng, 3, tall), blades = [];
    for (let b = randInt(rng, 3, 6); b > 0; b--) blades.push([randInt(rng, -2, 2), randInt(rng, Math.max(2, h - 3), h), randInt(rng, -2, 2), rng()]);
    const flower = rng() < 0.12 ? (rng() < 0.5 ? 'red' : 'white') : null, tx = x;
    if (!ctx.ok(x)) continue;
    ctx.stat(tx - 4, tx + 4, base, (g, p, lit, ox) => {
      for (const [dx, bh, lean, cr] of blades) {
        const col = cr < 0.3 ? p.greenDark : cr < 0.7 ? p.grass : p.grassLight;
        for (let k = 0; k < bh; k++) px(g, tx + ox + dx + Math.round(lean * k / bh), base - k, col);
      }
      if (flower) { const [dx, bh, lean] = blades[0]; px(g, tx + ox + dx + lean, base - bh, p[flower]); }
    });
  }
}

// Fog banks drifting slowly back and forth (pre-dithered sprites)
function fogBands(ctx, y0, y1, gap, dens) {
  const { rng } = ctx;
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, gap, gap * 2)) {
    const w = randInt(rng, 60, 150), h = randInt(rng, 4, 8), y = randInt(rng, y0, y1), ph = rng() * 6, drift = randInt(rng, 20, 50), lx = x;
    if (!ctx.ok(x + (w >> 1))) continue;
    const key = 'fog' + w + '|' + h + '|' + dens;
    ctx.live({ x0: lx - drift, x1: lx + w + drift, z: 100 + y, warm: v => fogSprite(v, key, w, h, dens), draw(g, v, ox, oy, t) {
      g.drawImage(fogSprite(v, key, w, h, dens), Math.round(lx + Math.sin(t * 0.03 + ph) * drift) + ox, y + oy);
    } });
  }
}

function fogSprite(v, key, w, h, dens) {
  return cached(v, key, w, h, (g, p) => {
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const ex = Math.min(1, Math.min(x, w - 1 - x) / (w * 0.3)), ey = 1 - Math.abs((y + 0.5) / h * 2 - 1);
        if (bayer(x, y) < dens * ex * (0.4 + 0.6 * ey)) px(g, x, y, p.white);
      }
  });
}
