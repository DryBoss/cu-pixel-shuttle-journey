'use strict';
// js/05-terrain/entities.js
// Defines: cached, spriteEnt, swayer

// --- sprite helpers for live entities ------------------------------------
function cached(v, key, w, h, paint) {
  let c = v.sprites.get(key);
  if (!c) {
    let g;
    [c, g] = makeCanvas(w, h);
    paint(g, v.p, v.lit);
    v.sprites.set(key, c);
  }
  return c;
}

// A still object that has to sort by depth with the live ones (houses in
// front of swaying palms); painted once per lighting
function spriteEnt(lx, y, w, h, ax, ay, key, paint) {
  return { x0: lx - ax, x1: lx - ax + w, z: y, warm: v => cached(v, key, w, h, paint), draw(g, v, ox, oy) {
    g.drawImage(cached(v, key, w, h, paint), lx - ax + ox, y - ay + oy);
  } };
}

// A plant that leans with the passing wind waves (one sprite per lean)
function swayer(L, lx, y, kind, a = 0, b = 0) {
  const S = SWAY[kind], [w, h, ax, ay] = S.size(a, b), u = uOf(L, lx), key = kind + a + '|' + b;
  const frames = v => {                                // all four leans, painted together
    let f = v.sprites.get(key);
    if (!f) {
      f = [];
      for (let lean = -1; lean <= 2; lean++) {
        const [c, g] = makeCanvas(w, h);
        S.paint(g, v.p, lean, a, b, ax, ay);
        f.push(c);
      }
      v.sprites.set(key, f);
    }
    return f;
  };
  return { x0: lx - ax, x1: lx - ax + w, z: y, warm: frames, draw(g, v, ox, oy, t) {
    g.drawImage(frames(v)[leanAt(u - y * 4, t) + 1], lx - ax + ox, y - ay + oy);
  } };
}
