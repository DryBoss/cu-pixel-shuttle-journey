'use strict';
// js/14-atmosphere/celestial.js
// Defines: STARS, celestialSprite, SUN_SPRITES, MOON, celestial, placeCelestial, drawCelestial

// --- sun, moon, stars, lightning bolt (behind everything) -----------------
const STARS = (() => {
  const rng = mulberry32(3), s = [];
  for (let i = 0; i < 110; i++) s.push({ x: randInt(rng, 0, W - 1), y: randInt(rng, 0, 100), th: rng(), ph: rng() * 6, big: rng() < 0.08 });
  return s;
})();

function celestialSprite(r, rim, core, coreR) {
  const [c, g] = makeCanvas(r * 2 + 1, r * 2 + 1);
  disc(g, r, r, r, rim);
  disc(g, r - (r > 5 ? 1 : 0), r - (r > 5 ? 1 : 0), coreR, core);
  return c;
}
const SUN_SPRITES = [celestialSprite(6, PALETTE.glow, PALETTE.white, 4),     // high
                     celestialSprite(7, PALETTE.amber, PALETTE.peach, 5),    // getting low
                     celestialSprite(8, PALETTE.orange, PALETTE.peach, 5)];  // on the horizon
const MOON = (() => {
  const [c, g] = makeCanvas(11, 11);
  disc(g, 5, 5, 5, PALETTE.cloudShade);
  disc(g, 6, 4, 4, PALETTE.white);
  for (const [x, y] of [[3, 6], [4, 3], [6, 7], [2, 4]]) px(g, x, y, PALETTE.grayLight);
  return c;
})();

const celestial = { sunX: 0, sunY: 0, sunLow: 0, sunUp: false, moonX: 0, moonY: 0, moonUp: false };
function placeCelestial() {
  const h = sim.hour;
  celestial.sunUp = h > 5.4 && h < 18.8;
  if (celestial.sunUp) {
    const t = (h - 5.6) / 13, s = Math.sin(Math.max(0, Math.min(1, t)) * Math.PI);
    celestial.sunX = Math.round(24 + t * (W - 48));
    celestial.sunY = Math.round(116 - s * 94);
    celestial.sunLow = 1 - s;
  }
  celestial.moonUp = h > 18.2 || h < 6.2;
  if (celestial.moonUp) {
    const t = ((h - 18.4 + 24) % 24) / 11.6, s = Math.sin(Math.max(0, Math.min(1, t)) * Math.PI);
    celestial.moonX = Math.round(30 + t * (W - 60));
    celestial.moonY = Math.round(110 - s * 84);
  }
}

function drawCelestial(g) {
  const n = sim.night * (1 - weather.level * 0.85), t = sim.clock;
  if (n > 0.02) {                                       // stars: fade in by threshold, some twinkle
    for (let i = 0; i < STARS.length; i++) {
      const s = STARS[i];
      if (s.th > n * 1.15 - 0.1) continue;
      const tw = Math.sin(t * 2.3 + s.ph);
      g.fillStyle = tw > 0.8 ? PALETTE.white : tw > -0.4 ? PALETTE.cloudShade : PALETTE.grayLight;
      g.fillRect(s.x, s.y, 1, 1);
      if (s.big && tw > 0.3) { g.fillRect(s.x - 1, s.y, 3, 1); g.fillRect(s.x, s.y - 1, 1, 3); }
    }
  }
  if (celestial.moonUp && n > 0.05) {
    g.globalAlpha = Math.min(1, n * 1.4);
    g.drawImage(MOON, celestial.moonX - 5, celestial.moonY - 5);
    g.globalAlpha = 1;
  }
  if (celestial.sunUp) {
    const low = celestial.sunLow, spr = SUN_SPRITES[low > 0.82 ? 2 : low > 0.55 ? 1 : 0], r = spr.width >> 1;
    g.globalAlpha = 1 - weather.level * 0.8;            // the sun hides behind rain clouds
    g.drawImage(spr, celestial.sunX - r, celestial.sunY - r);
    g.globalAlpha = 1;
  }
  if (weather.flash > 0 && weather.boltN) {            // a far-off bolt, behind the hills
    g.fillStyle = PALETTE.white;
    for (let i = 0; i < weather.boltN - 1; i++) {
      const x0 = weather.bolt[i * 2], y0 = weather.bolt[i * 2 + 1], x1 = weather.bolt[i * 2 + 2], y1 = weather.bolt[i * 2 + 3];
      for (let y = y0; y < y1; y++) g.fillRect(Math.round(x0 + (x1 - x0) * (y - y0) / (y1 - y0)), y, 1, 1);
    }
  }
}
