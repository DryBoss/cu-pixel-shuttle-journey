'use strict';
// js/14-atmosphere/weather.js
// Defines: weather, rainPool, splashPool, resetWeather, updateWeather

// --- weather: monsoon spells, rain, splashes, ripples, lightning ----------------
const weather = { level: 0, target: 0, timer: 0, acc: 0, flash: 0, flashT: 9, bolt: new Int16Array(24), boltN: 0, thunderIn: -1 };
const rainPool = makePool(CONFIG.RAIN_MAX[0], () => ({ x: 0, y: 0, vx: 0, vy: 0, depth: 0, gy: 0 }));
const splashPool = makePool(CONFIG.SPLASH_MAX[0], () => ({ x: 0, y: 0, age: 0, water: false }));

function resetWeather() {
  weather.level = weather.target = 0;
  weather.timer = CONFIG.RAIN_GAP[1] * 0.6;            // dry at Kamalapur; the first spell comes on the way
  weather.flash = 0; weather.flashT = 9; weather.thunderIn = -1;
  rainPool.n = splashPool.n = 0;
}

function updateWeather(dt) {
  const rng = sim.wxRng;
  if ((weather.timer -= dt) <= 0) {                     // next spell, or the end of this one
    const raining = weather.target > 0;
    weather.target = raining ? 0 : 0.55 + rng() * 0.45;
    weather.timer = raining ? randInt(rng, ...CONFIG.RAIN_GAP) : randInt(rng, ...CONFIG.RAIN_SPELL);
  }
  const target = ui.rainMode === 1 ? 1 : ui.rainMode === 2 ? 0 : weather.target;
  weather.level += Math.max(-0.2 * dt, Math.min(0.2 * dt, target - weather.level));

  weather.acc += weather.level * (quality.low ? 170 : 300) * dt;
  while (weather.acc >= 1) {
    weather.acc -= 1;
    const r = poolSpawn(rainPool, cap('RAIN_MAX'));
    if (!r) { weather.acc = 0; break; }
    r.depth = 0.5 + Math.random() * 0.8;
    r.x = -10 + Math.random() * (W + 30 + sim.speed * 0.8);
    r.y = -Math.random() * 30;
    r.vy = 170 + r.depth * 90;
    r.gy = r.depth > 0.95 ? 158 + (r.depth - 0.95) * 60 : 112 + r.depth * 40;
  }
  for (let i = 0; i < rainPool.n; ) {
    const r = rainPool.items[i];
    r.vx = -(sim.speed * r.depth * 0.8) - 30 * r.depth;  // wind plus the train's own speed
    r.x += r.vx * dt;
    r.y += r.vy * dt;
    if (r.y < r.gy && r.x > -12) { i++; continue; }
    if (r.y >= r.gy && r.depth > 0.95 && r.x >= 0 && r.x < W) {
      const s = poolSpawn(splashPool, cap('SPLASH_MAX'));
      if (s) { s.x = Math.round(r.x); s.y = Math.round(r.gy); s.age = 0; s.water = isWater(s.x, s.y); }
    }
    poolKill(rainPool, i);
  }
  for (let i = 0; i < splashPool.n; ) {
    const s = splashPool.items[i];
    s.age += dt;
    s.x -= sim.speed * PARALLAX.fg * dt;
    if (s.age < (s.water ? 0.5 : 0.25)) i++;
    else poolKill(splashPool, i);
  }

  // rare, distant lightning while it pours; thunder follows a moment later
  if (weather.level > 0.5 && rng() < CONFIG.LIGHTNING_RATE * weather.level * dt) {
    weather.flashT = 0;
    let x = randInt(rng, 30, W - 30), y = randInt(rng, 6, 30);
    weather.boltN = 0;
    while (y < 108 && weather.boltN < 12) {
      weather.bolt[weather.boltN * 2] = x; weather.bolt[weather.boltN * 2 + 1] = y; weather.boltN++;
      x += randInt(rng, -5, 5); y += randInt(rng, 6, 12);
    }
    weather.thunderIn = 1 + rng() * 2;
  }
  weather.flashT += dt;
  const ft = weather.flashT;                            // two quick pulses
  weather.flash = ft > 0.6 ? 0 : Math.max(0, 1 - ft / 0.12) + (ft > 0.18 ? Math.max(0, 1 - (ft - 0.18) / 0.3) * 0.7 : 0);
  if (weather.thunderIn > 0 && (weather.thunderIn -= dt) <= 0) playThunder(0.6 + weather.level * 0.4);
}
