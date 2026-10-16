'use strict';
// js/14-atmosphere/fireflies.js
// Defines: fireflyPool, updateFireflies

// --- fireflies ---------------------------------------------------------------
const fireflyPool = makePool(CONFIG.FIREFLY_MAX[0], () => ({ x: 0, y: 0, depth: 0, age: 0, life: 0, ph: 0, rate: 0 }));
function updateFireflies(dt) {
  const n = sim.night, rng = sim.fxRng;
  sim.flyAcc += 7 * Math.max(0, n - 0.4) * (1 - sectionWeight('river', sim.dist)) * (1 - weather.level) * dt;
  while (sim.flyAcc >= 1) {
    sim.flyAcc -= 1;
    const f = poolSpawn(fireflyPool, cap('FIREFLY_MAX'));
    if (!f) continue;
    f.x = rng() * (W + 40); f.y = 118 + rng() * 58; f.depth = 0.5 + rng() * 0.8;
    f.age = 0; f.life = 5 + rng() * 6; f.ph = rng() * 6; f.rate = 2 + rng() * 3;
  }
  for (let i = 0; i < fireflyPool.n; ) {
    const f = fireflyPool.items[i];
    f.age += dt;
    f.x += (-sim.speed * f.depth + Math.sin(f.age * 1.3 + f.ph) * 6) * dt;
    f.y += Math.cos(f.age * 1.1 + f.ph) * 4 * dt;
    if (f.age < f.life && f.x > -8) i++;
    else poolKill(fireflyPool, i);
  }
}
