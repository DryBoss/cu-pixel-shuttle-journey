'use strict';
// js/07-entities/rickshaw.js
// Defines: rickshawEnt, WHEEL_RING, cycleWheel, cycleRider, drawRickshaw

// Cycle rickshaw (painted hood, a passenger) or a bicycle, pedalling along
// the dirt road and turning round at its ends
function rickshawEnt(a, b, y, rng, bike) {
  const len = b - a - 30, ph = rng() * len * 2, sp = bike ? randInt(rng, 12, 18) : randInt(rng, 8, 12);
  const o = { bike, hood: pick(rng, ['red', 'blue', 'green', 'purple', 'orange']), shirt: pick(rng, SHIRTS),
              lungi: pick(rng, LUNGIS)[0], skin: pick(rng, SKINS), pax: !bike && rng() < 0.6,
              paxCol: pick(rng, SARIS)[0], cargo: bike && rng() < 0.4 };
  return { x0: a, x1: b, z: y, draw(g, v, ox, oy, t) {
    const s = (t * sp + ph) % (2 * len), fwd = s < len;
    drawRickshaw(g, v.p, Math.round(a + 15 + (fwd ? s : 2 * len - s)) + ox, y + oy, fwd ? 1 : -1, t, o);
  } };
}

const WHEEL_RING = [-1, -2, 0, -2, 1, -2, -2, -1, 2, -1, -2, 0, 2, 0, -2, 1, 2, 1, -1, 2, 0, 2, 1, 2];
function cycleWheel(cx, cy, spin) {
  for (let i = 0; i < WHEEL_RING.length; i += 2) mp(cx + WHEEL_RING[i], cy + WHEEL_RING[i + 1], 'ink');
  mp(cx, cy, 'grayLight');
  if (spin) { mp(cx, cy - 1, 'gray'); mp(cx, cy + 1, 'gray'); } else { mp(cx - 1, cy, 'gray'); mp(cx + 1, cy, 'gray'); }
}

function cycleRider(rx, o, pedal) {
  mpRect(rx, -11, 2, 4, o.shirt);
  mpRect(rx, -13, 2, 1, 'ink');
  mpRect(rx, -12, 2, 1, o.skin);
  mpRect(rx, -7, 2, 2, o.lungi);
  if (pedal) { mp(rx + 1, -5, o.skin); mp(rx, -4, o.skin); } else { mp(rx, -5, o.skin); mp(rx + 1, -4, o.skin); }
  mp(rx + 2, -10, o.skin);
}

function drawRickshaw(g, p, x, y, dir, t, o) {
  mpAt(g, p, x, y, dir);
  const spin = Math.floor(t * 8) & 1, pedal = Math.floor(t * 5) & 1;
  if (o.bike) {
    cycleWheel(-3, -2, spin); cycleWheel(4, -2, spin);
    mpRect(-2, -4, 6, 1, 'grayDark'); mp(0, -5, 'grayDark'); mpRect(3, -7, 1, 3, 'grayDark'); mp(4, -8, 'grayDark');
    if (o.cargo) { mpRect(-5, -6, 3, 2, 'grayLight'); mp(-4, -7, 'gray'); }   // milk cans on the carrier
    cycleRider(0, o, pedal);
  } else {
    cycleWheel(-4, -2, spin); cycleWheel(5, -2, spin);
    mpRect(-4, -4, 9, 1, 'grayDark'); mpRect(5, -9, 1, 6, 'grayDark'); mp(5, -10, 'grayDark');
    if (o.pax) { mp(-5, -11, 'ink'); mp(-5, -10, o.skin); mpRect(-6, -9, 2, 3, o.paxCol); }
    mpRect(-7, -6, 5, 1, o.hood); mpRect(-7, -5, 5, 1, 'ink'); mp(-5, -4, 'glow');    // seat and painted panel
    mpRect(-7, -13, 5, 1, o.hood); mpRect(-8, -12, 1, 6, o.hood); mp(-3, -12, 'glow'); // folded hood
    cycleRider(2, o, pedal);
  }
}
