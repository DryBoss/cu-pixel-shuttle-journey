'use strict';
// js/09-sky-life/birds.js
// Defines: birdPool, fluffPool, trySpawnBird, updateBirds, WING_LIFT, drawBirds

// --- screen-space visitors: birds crossing the sky, kash seed fluff -------
const birdPool = makePool(CONFIG.BIRD_MAX[0], () => ({ kind: '', x: 0, y: 0, vx: 0, depth: 0, age: 0, ph: 0 }));
const fluffPool = makePool(CONFIG.FLUFF_MAX[0], () => ({ x: 0, y: 0, vx: 0, depth: 0, age: 0, life: 0, ph: 0, big: false }));

function trySpawnBird(si, w, dt) {
  const b = SECTIONS[TERRAIN[si].id].birds, rng = sim.fxRng;
  if (!b || w <= 0 || rng() >= b[1] * w * dt) return;
  const q = poolSpawn(birdPool, cap('BIRD_MAX'));
  if (!q) return;
  const left = rng() < 0.3, sp = 14 + rng() * 22;
  q.kind = b[0]; q.x = left ? -6 : W + 6; q.y = 64 + rng() * 40; q.vx = left ? sp : -sp;
  q.depth = 0.4 + rng() * 0.3; q.age = 0; q.ph = rng() * 4;
}

function updateBirds(dt) {
  const here = terrainAt(sim.dist), a = here.a, b = here.b, t = here.t;
  trySpawnBird(a, 1 - t, dt);
  if (b !== a) trySpawnBird(b, t, dt);
  for (let i = 0; i < birdPool.n; ) {
    const q = birdPool.items[i];
    q.age += dt;
    q.x += (q.vx - sim.speed * q.depth) * dt;          // air is still relative to the ground
    q.y += Math.sin(q.age * 0.9 + q.ph) * 3 * dt;
    if (q.x > -12 && q.x < W + 12) i++;
    else poolKill(birdPool, i);
  }
}

const WING_LIFT = [-1, 0, 1, 0];
function drawBirds(g, v) {
  const p = v.p;
  for (let n = 0; n < birdPool.n; n++) {
    const q = birdPool.items[n], x = Math.round(q.x), y = Math.round(q.y), face = Math.sign(q.vx);
    const span = q.kind === 'egret' ? 3 : 2, rate = q.kind === 'hawk' ? 1.5 : q.kind === 'egret' ? 4 : 7;
    let f = Math.floor(q.age * rate + q.ph) % 4;
    if (q.kind === 'hawk' && f !== 2) f = 1;           // mostly gliding
    const lift = WING_LIFT[f];
    const body = q.kind === 'hawk' ? p.brownDark : p.white, tip = q.kind === 'gull' ? p.grayDark : q.kind === 'hawk' ? p.ink : p.white;
    for (let i = 1; i <= span; i++) {
      const yy = y + (i === span ? lift : Math.round(lift / 2));
      px(g, x - i, yy, i === span ? tip : body);
      px(g, x + i, yy, i === span ? tip : body);
    }
    px(g, x, y, body);
    px(g, x + face, y - (q.kind === 'egret' ? 1 : 0), body);
    if (q.kind === 'egret') { px(g, x + 2 * face, y - 1, p.amber); px(g, x - 2 * face, y + 1, p.ink); }
  }
}
