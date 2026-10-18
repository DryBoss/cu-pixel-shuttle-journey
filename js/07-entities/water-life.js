'use strict';
// js/07-entities/water-life.js
// Defines: hyacinthEnt, duckEnt

function hyacinthEnt(lx, y, rng) {
  const w = randInt(rng, 4, 8), ph = rng() * 6, flower = rng() < 0.85;
  return { x0: lx - 6, x1: lx + w + 6, z: y, draw(g, v, ox, oy, t) {
    const p = v.p, x = Math.round(lx + Math.sin(t * 0.12 + ph) * 4) + ox, yy = y + oy;
    rect(g, x, yy, w, 1, p.greenDark);
    rect(g, x + 1, yy - 1, w - 2, 1, p.green);
    px(g, x + 2, yy - 2, p.grass);
    if (flower) { px(g, x + w - 2, yy - 2, p.purple); px(g, x + 1, yy - 2, p.purple); px(g, x + 2, yy - 3, p.white); }
    px(g, x - 1, yy + 1, p.skyLight);
  } };
}

function duckEnt(pd, rng) {
  const ph = rng() * 6, sp = 0.15 + rng() * 0.2, range = pd.rx - 5, y = pd.cy + randInt(rng, -pd.ry + 2, pd.ry - 1), white = rng() < 0.6;
  return { x0: pd.cx - pd.rx, x1: pd.cx + pd.rx, z: y, draw(g, v, ox, oy, t) {
    const a = t * sp + ph, dir = Math.cos(a) >= 0 ? 1 : -1, body = white ? 'white' : 'tan';
    mpAt(g, v.p, Math.round(pd.cx + Math.sin(a) * range) + ox, y + oy - (Math.sin(t * 2.3 + ph) > 0.7 ? 1 : 0), dir);
    mp(1, -2, white ? body : 'greenDark');                                   // head
    mp(2, -2, 'orange');                                                     // bill
    mpRect(-1, -1, 3, 1, body);
    mp(-2, -2, body);                                                        // tail up
    if (Math.abs(Math.cos(a)) > 0.3) { mp(-3, 0, 'white'); mp(-4, 1, 'white'); mp(-5, 1, 'skyLight'); mp(-6, 0, 'skyLight'); }   // a white wake
  } };
}
