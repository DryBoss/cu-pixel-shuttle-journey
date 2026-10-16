'use strict';
// js/14-atmosphere/sparks.js
// Defines: sparkPool, updateSparks

// --- brake sparks --------------------------------------------------------------
const sparkPool = makePool(CONFIG.SPARK_MAX[0], () => ({ x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0 }));
function updateSparks(dt) {
  const effort = brakeEffort();                         // AUTO: hardest braking mid-way
  if (effort > 0 && sim.speed > 4) {
    sim.sparkAcc += 90 * effort * dt;
    while (sim.sparkAcc >= 1) {
      sim.sparkAcc -= 1;
      const s = poolSpawn(sparkPool, cap('SPARK_MAX'));
      if (!s) break;
      const veh = TRAIN.vehicles[(Math.random() * TRAIN.vehicles.length) | 0];
      s.x = veh.x + veh.wheels[(Math.random() * 4) | 0]; s.y = LAYER_Y.wheel + 6;
      s.vx = -(20 + Math.random() * 50); s.vy = -(15 + Math.random() * 45);
      s.age = 0; s.life = 0.15 + Math.random() * 0.3;
    }
  }
  for (let i = 0; i < sparkPool.n; ) {
    const s = sparkPool.items[i];
    s.age += dt;
    s.vy += 220 * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.age < s.life) i++;
    else poolKill(sparkPool, i);
  }
}
