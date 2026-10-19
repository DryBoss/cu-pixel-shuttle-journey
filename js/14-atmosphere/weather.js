'use strict';
// js/14-atmosphere/weather.js
// Defines: weather, rainPool, splashPool, resetWeather, updateWeather, drawBolt

// --- weather: rain, splashes, ripples, lightning - all decided by sim.season ----
const weather = { level: 0, target: 0, acc: 0, flash: 0, flashT: 9, bolt: new Int16Array(48), boltN: 0, fork: new Int16Array(24), forkN: 0, thunderIn: -1 };
const rainPool = makePool(CONFIG.RAIN_MAX[0], () => ({ x: 0, y: 0, vx: 0, vy: 0, depth: 0, gy: 0 }));
const splashPool = makePool(CONFIG.SPLASH_MAX[0], () => ({ x: 0, y: 0, age: 0, water: false }));

function resetWeather() {
  weather.level = weather.target = 0;                  // the scenario roll (scenario.js) sets the real values
  weather.flash = 0; weather.flashT = 9; weather.thunderIn = -1;
  rainPool.n = splashPool.n = 0;
}

function updateWeather(dt) {
  const rng = sim.wxRng, S = seasonDef();
  weather.target = S.rain;                              // strictly the season's: Monsoon 1, everything else 0
  weather.level += Math.max(-0.2 * dt, Math.min(0.2 * dt, weather.target - weather.level));

  weather.acc += weather.level * (quality.low ? 170 : 300) * (1 + 0.5 * S.rain) * dt;   // monsoon pours harder
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
    r.vx = -(sim.speed * r.depth * 0.8) - 30 * r.depth * (1 + 1.7 * sim.wind);  // wind plus the train's own speed
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
  if (weather.level > 0.5 && rng() < S.lightning * weather.level * dt) {
    weather.flashT = 0;
    let x = randInt(rng, 30, W - 30), y = -2;           // strikes from the very top of the cloud deck
    weather.boltN = weather.forkN = 0;
    while (y < 104 && weather.boltN < 22) {
      weather.bolt[weather.boltN * 2] = x; weather.bolt[weather.boltN * 2 + 1] = y; weather.boltN++;
      x += randInt(rng, -7, 7); y += randInt(rng, 5, 10);
      if (weather.boltN === 7 + (rng() * 3 | 0)) {      // a branch splits off, leaning to one side
        let fx = x, fy = y, dir = rng() < 0.5 ? -1 : 1;
        while (fy < 90 && weather.forkN < 10) {
          weather.fork[weather.forkN * 2] = fx; weather.fork[weather.forkN * 2 + 1] = fy; weather.forkN++;
          fx += dir * randInt(rng, 3, 8); fy += randInt(rng, 5, 9);
        }
      }
    }
    weather.thunderIn = 1 + rng() * 2;
  }
  weather.flashT += dt;
  const ft = weather.flashT;                            // two quick pulses
  weather.flash = ft > 0.6 ? 0 : Math.max(0, 1 - ft / 0.12) + (ft > 0.18 ? Math.max(0, 1 - (ft - 0.18) / 0.3) * 0.7 : 0);
  if (weather.thunderIn > 0 && (weather.thunderIn -= dt) <= 0) playThunder(0.6 + weather.level * 0.4);
}

// The bolt: a bright white core with a cold blue glow, over the clouds and untinted. It flickers with the flash.
function drawBolt(g) {
  if (weather.flashT > 0.42 || !weather.boltN || weather.flash < 0.05) return;
  const a = Math.min(1, weather.flash * 1.1);
  const trace = (pts, n, fn) => {
    for (let i = 0; i < n - 1; i++) {
      const x0 = pts[i * 2], y0 = pts[i * 2 + 1], x1 = pts[i * 2 + 2], y1 = pts[i * 2 + 3];
      for (let y = y0; y < y1; y++) fn(Math.round(x0 + (x1 - x0) * (y - y0) / (y1 - y0)), y);
    }
  };
  g.globalAlpha = a * 0.35; g.fillStyle = '#8fa0f0';
  trace(weather.bolt, weather.boltN, (x, y) => g.fillRect(x - 3, y, 7, 1));
  trace(weather.fork, weather.forkN, (x, y) => g.fillRect(x - 2, y, 5, 1));
  g.globalAlpha = a; g.fillStyle = '#ffffff';
  trace(weather.bolt, weather.boltN, (x, y) => g.fillRect(x - 1, y, 2, 1));
  trace(weather.fork, weather.forkN, (x, y) => g.fillRect(x, y, 1, 1));
  g.globalAlpha = 1;
}
