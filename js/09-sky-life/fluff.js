'use strict';
// js/09-sky-life/fluff.js
// Defines: updateFluff, drawFluff

function updateFluff(dt) {
  const rng = sim.fxRng;
  sim.fluffAcc += 9 * sectionWeight('kash', sim.dist) * dt;
  while (sim.fluffAcc >= 1) {
    sim.fluffAcc -= 1;
    const f = poolSpawn(fluffPool, cap('FLUFF_MAX'));
    if (!f) continue;
    f.depth = 0.5 + rng() * 0.8;                       // nearer seeds sail past faster and lower
    f.x = rng() * (W + 60); f.y = f.depth > 1 ? 140 + rng() * 34 : 100 + rng() * 22;
    f.vx = -(sim.speed * f.depth) - 6; f.age = 0; f.life = 4 + rng() * 5; f.ph = rng() * 6; f.big = rng() < 0.3;
  }
  for (let i = 0; i < fluffPool.n; ) {
    const f = fluffPool.items[i];
    f.age += dt;
    f.vx += (-(sim.speed * f.depth) - 6 - f.vx) * Math.min(1, dt * 1.5);
    f.x += f.vx * dt;
    f.y += (-3 + Math.sin(f.age * 1.7 + f.ph) * 7) * dt;
    if (f.age < f.life && f.x > -4 && f.y > -4) i++;
    else poolKill(fluffPool, i);
  }
}

function drawFluff(g, v) {
  for (let i = 0; i < fluffPool.n; i++) {
    const f = fluffPool.items[i], x = Math.round(f.x), y = Math.round(f.y);
    if (bayer(x, y) >= (f.life - f.age) * 16) continue;   // dissolves in its last second
    px(g, x, y, v.p.white);
    if (f.big) { px(g, x - 1, y, v.p.cloudShade); px(g, x + 1, y - 1, v.p.cloudShade); }
  }
}
