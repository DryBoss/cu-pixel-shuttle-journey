'use strict';
// js/07-entities/boats.js
// Defines: tinySailEnt, NOUKA, noukaEnt

function tinySailEnt(lx, y, rng) {
  const ph = rng() * 6;
  return { x0: lx - 12, x1: lx + 12, z: y, draw(g, v, ox, oy, t) {
    const p = v.p, x = Math.round(lx + Math.sin(t * 0.04 + ph) * 8) + ox, yy = y + oy;
    rect(g, x - 2, yy, 5, 1, p.brownDark);
    rect(g, x, yy - 3, 1, 3, p.cream);
    px(g, x + 1, yy - 2, p.cream);
  } };
}

// Country boats (nouka): sails patched with odd bits of cloth, or a
// bamboo-hooded cargo boat poled along
const NOUKA = {
  sail: ['.....s......', '.....ss.....', '.....sps....', '.....ssqs...', '.....sspss..', '.....sssqss.',
         '.....m......', 'h....m.....h', 'hhhhhhhhhhhh', '.dddddddddd.'],
  hood: ['...tttt..b..', '..tttttt.b..', 'h.tttttt.b.h', 'hhhhhhhhhhhh', '.dddddddddd.'],
};

function noukaEnt(lx, wl, rng, type) {
  const tpl = NOUKA[type], ph = rng() * 6, drift = randInt(rng, 10, 26);
  return { x0: lx - drift - 7, x1: lx + drift + 8, z: wl, draw(g, v, ox, oy, t) {
    const p = v.p, x = Math.round(lx + Math.sin(t * 0.035 + ph) * drift) - 6 + ox;
    const y = wl + oy - tpl.length + 1 + (Math.sin(t * 1.3 + ph) > 0.75 ? 1 : 0);
    stamp(g, tpl, x, y, { s: p.cream, p: p.tan, q: p.rust, m: p.brownDark, t: p.tan, b: p.ink, h: p.brown, d: p.brownDark });
    if (type === 'sail' && Math.sin(t * 2.1 + ph) > 0.3) px(g, x + 11, y + 5, p.cream);   // the sail's edge flutters
    px(g, x - 1, wl + oy, p.skyLight);
    px(g, x + 12, wl + oy, p.skyLight);
  } };
}
