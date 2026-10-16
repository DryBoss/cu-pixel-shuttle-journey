'use strict';
// js/07-entities/fisher.js
// Defines: fisherEnt, MP, mpAt, mp, mpRect, drawFisher, netRing

// A fisherman in a small boat throwing a cast net (jal), on a loop:
// hold, swing it up, throw, let it sink, haul it back in
function fisherEnt(lx, wl, rng, big) {
  const ph = rng() * 7, dir = rng() < 0.5 ? 1 : -1, s = big ? 2 : 1;
  const d = big ? makeDesign(rng, 'lungi') : null;
  const shirt = pick(rng, ['white', 'skyLight', 'paddy', 'rose']), lungi = pick(rng, LUNGIS)[0];
  if (d) d.carry = null;
  const reach = 15 * s;
  return { x0: lx - reach, x1: lx + reach, z: wl, draw(g, v, ox, oy, t) {
    drawFisher(g, v, lx + ox, wl + oy, (t + ph) % 7, dir, s, d, shirt, lungi);
  } };
}

// Mirror painter for the small figures drawn live: set origin and facing
// once, then plot offsets in palette keys (no closures in the frame loop)
const MP = { g: null, p: null, x: 0, y: 0, dir: 1 };
function mpAt(g, p, x, y, dir) { MP.g = g; MP.p = p; MP.x = x; MP.y = y; MP.dir = dir; }
function mp(dx, dy, key) { MP.g.fillStyle = MP.p[key]; MP.g.fillRect(MP.x + dx * MP.dir, MP.y + dy, 1, 1); }
function mpRect(dx, dy, w, h, key) {
  MP.g.fillStyle = MP.p[key];
  MP.g.fillRect(MP.dir > 0 ? MP.x + dx : MP.x - dx - w + 1, MP.y + dy, w, h);
}

function drawFisher(g, v, x, y, c, dir, s, d, shirt, lungi) {
  mpAt(g, v.p, x, y, dir);
  const hl = 5 * s;
  mpRect(-hl, 0, 2 * hl + 1, 1, 'brownDark');                               // hull, raised at both ends
  mpRect(-hl + 1, -1, 2 * hl - 1, 1, 'brown');
  for (let e = -1; e <= 1; e += 2) { mp(e * (hl + 1), -1, 'brown'); mp(e * (hl + 1), -2, 'brown'); mp(e * (hl + 2), 1, 'skyLight'); }
  const phase = c < 2.5 ? 0 : c < 3.1 ? 1 : c < 3.8 ? 2 : c < 5.5 ? 3 : 4;   // hold, raise, throw, wait, haul
  const fx = -hl + 2 * s, up = phase === 1 || phase === 2;                   // he stands at the stern
  let hx, hy;                                                                // his hand
  if (d) {
    g.drawImage(personSprite(v, d, up ? 6 : 0, dir), x + fx * dir - PERSON_CX, y - 1 - PERSON_FY);
    hx = fx + (up ? 2 : 1); hy = up ? -10 : -5;          // hand position in personSprite frames 6 / 0
  } else {
    const bent = phase === 4;
    mp(fx, -2, lungi); mp(fx, -3, lungi); mp(fx, -4, shirt);
    mp(fx + (bent ? 1 : 0), -5, bent ? 'brown' : shirt);
    if (!bent) mp(fx, -6, 'brown');
    hx = fx + 1; hy = up ? -7 : -4;
    mp(hx, hy, 'brown');
  }
  const D = 9 * s, R = 4 * s;
  if (phase === 0) mp(hx, hy + 1, 'grayDark');
  else if (phase === 1) mp(hx, hy - 1, 'grayLight');
  else if (phase === 2) {
    const k = (c - 3.1) / 0.7;
    netRing(hx + k * (D - hx), hy * (1 - k) - Math.sin(k * Math.PI) * 4 * s, 1 + k * (R - 1), -1);
  } else {
    const k = phase === 3 ? 0 : (c - 5.5) / 1.5;
    const cx = Math.round(D + (hx - D) * k), r = Math.max(1, Math.round(R * (1 - k * 0.8)));
    netRing(cx, -1, r, phase === 3 ? (c - 3.8) / 1.7 : 0.9);
    for (let i = 1; i < 4; i++) mp(Math.round(hx + (cx - hx) * i / 4), Math.round(hy + (-1 - hy) * i / 4), 'grayDark');   // the line
  }
}

// The cast net as a half ellipse of knots; sink 0..1 dissolves it
function netRing(cx, cy, r, sink) {
  const n = Math.round(6 + r * 2);
  for (let i = 0; i < n; i++) {
    const a = Math.PI * i / (n - 1), qx = Math.round(cx + Math.cos(a) * r), qy = Math.round(cy - Math.sin(a) * r * 0.45);
    if (sink < 0 || bayer(qx + MP.x, qy + MP.y) >= sink * 12) mp(qx, qy, 'grayLight');
  }
}
