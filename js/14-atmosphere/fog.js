'use strict';
// js/14-atmosphere/fog.js
// Defines: fog, FOG_BACK, FOG_FRONT, fogTarget, setFog, terrainFogScale, fogWash, drawFog

// --- fog: drifting mist bands over the whole line, thick on a Winter morning ---
// fog.level (0..1) comes from the season and time phase (SEASONS[].fog). The bands are
// pre-dithered sprites in the lighting's own white, so fog turns slate at night and
// peach at dusk. Level also decides how many bands are drawn.
const fog = { level: 0 };
const FOG_SIZES = [[150, 8], [120, 7], [96, 6], [72, 5]];
const FOG_BACK = [], FOG_FRONT = [];
(() => {
  const rng = mulberry32(77);
  for (let i = 0; i < 26; i++) {
    const back = i < 15, [w, h] = FOG_SIZES[(rng() * FOG_SIZES.length) | 0];
    (back ? FOG_BACK : FOG_FRONT).push({
      w, h, x: rng() * (W + 220), y: Math.round(back ? 74 + rng() * 52 : 132 + rng() * 40),
      par: back ? 0.3 + rng() * 0.25 : 1.1 + rng() * 0.4, ph: rng() * 6, dr: 8 + rng() * 14, dens: back ? 10 : 8,
    });
  }
})();

function fogTarget() {
  const f = seasonDef().fog;
  return f[sim.timePhase] !== undefined ? f[sim.timePhase] : f.other;
}
const setFog = () => { fog.level = fogTarget(); };

// The mist that is already baked into the hills and tea gardens: off entirely when the air is dry and clear
const terrainFogScale = () => fog.level > 0.01 ? Math.min(1, 0.3 + fog.level) : 0;

// How much of the mist the picture can take: the dense city sections (and the mill) are busy
// pixel art, so fog thins out there instead of smothering it
const cityCalm = () => {
  const d = sim.dist;
  return 1 - 0.7 * Math.min(1, sectionWeight('closed', d) + sectionWeight('nasirabad', d) + sectionWeight('slum', d) + sectionWeight('mill', d));
};

// A smooth haze over the lower picture (horizon down), one sprite per lighting
function fogWash(v) {
  return cached(v, 'fogwash2', W, H, (g, p) => {
    const [r, gr, b] = hexToRgb(p.white);
    for (let y = 70; y < H; y++) {
      const d = y < 118 ? (y - 70) / 48 : 1 - (y - 118) / 62 * 0.5;
      g.fillStyle = `rgba(${r},${gr},${b},${(d * 0.5).toFixed(3)})`;
      g.fillRect(0, y, W, 1);
    }
  });
}

// front = false: bands behind the train. front = true: low mist in front of everything + the haze
function drawFog(g, v, front) {
  const calm = cityCalm(), L = fog.level * (front ? calm : 0.4 + 0.6 * calm);
  if (L < 0.02) return;
  if (front) {                                          // in front of the train: only the smooth haze, never noisy bands over the foreground
    g.globalAlpha = Math.min(1, L) * 0.6; g.drawImage(fogWash(v), 0, 0); g.globalAlpha = 1;
    return;
  }
  const list = FOG_BACK, n = Math.min(list.length, Math.ceil(L * list.length)), span = W + 220, t = sim.clock;
  g.globalAlpha = Math.min(1, L * 0.7);
  for (let j = 0; j < n; j++) {
    const b = list[j], spr = fogSprite(v, 'fog' + b.w + '|' + b.h + '|' + b.dens, b.w, b.h, b.dens);
    const x = (((b.x - sim.dist * b.par + Math.sin(t * 0.35 + b.ph) * b.dr) % span) + span) % span - 110;
    g.drawImage(spr, Math.round(x), b.y);
  }
  g.globalAlpha = 1;
}
