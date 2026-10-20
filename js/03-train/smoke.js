'use strict';
// js/03-train/smoke.js
// Defines: smokePool, emitPuff, updateSmoke, SMOKE_SHADES, puffSprite, drawSmoke

// --- exhaust smoke -----------------------------------------------------
// Puffs live in screen space. Air is still relative to the world, so a
// puff's x velocity relaxes towards -speed: faster train, faster drift.
const smokePool = makePool(CONFIG.SMOKE_MAX[0], () => ({ x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, r0: 0, grow: 0, shade: 0 }));

function emitPuff(heavy) {
  const s = poolSpawn(smokePool, cap('SMOKE_MAX'));
  if (!s) return;
  s.x = TRAIN.stackX + Math.random(); s.y = TRAIN.stackY;
  s.vx = 0; s.vy = -(heavy ? 26 : 16) - Math.random() * 8;
  s.age = 0; s.life = (heavy ? 3.2 : 2.2) + Math.random();
  s.r0 = heavy ? 1.5 : 0.8; s.grow = (heavy ? 2.4 : 1.6) + Math.random();
  s.shade = heavy ? 0 : 1;
}

function updateSmoke(dt) {
  const st = sim.state, e = drive.engine;
  // idling engine puffs gently; it revs up (darker smoke) for the horn and departure.
  // A cold engine makes none; the driver's notch sets the rate in DRIVE mode.
  let rate = 0, revving = false;
  if (e === 'CRANK') rate = 2.5;
  else if (e === 'SHUTDOWN') rate = 0.6;
  else if (e === 'ON' && (drive.on || st === 'DRIVING')) { rate = 1.5 + Math.max(0, drive.rpm - 0.3) * 16; revving = drive.rpm > 0.72; }
  else if (e === 'ON') {                                 // standing at a platform in AUTO
    revving = sim.stopPhase === 'HORN';
    rate = revving ? 12 : sim.stopPhase === 'TERMINUS' ? 0.8 : 1.5;
  }
  sim.smokeAcc += rate * dt;
  while (sim.smokeAcc >= 1) { sim.smokeAcc -= 1; emitPuff(revving); }
  const windX = -(sim.speed + 4), kx = Math.min(1, dt * 2.2), ky = Math.min(1, dt * 1.5);
  for (let i = 0; i < smokePool.n; ) {
    const s = smokePool.items[i];
    s.age += dt;
    s.vx += (windX - s.vx) * kx;
    s.vy += (-5 - s.vy) * ky;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.age < s.life && s.x > -16 && s.y > -16) i++;
    else poolKill(smokePool, i);
  }
}

const SMOKE_SHADES = ['grayDark', 'gray', 'grayLight', 'cloudShade'];

// Dithered puff sprites, cached per lighting / radius / density / shade
function puffSprite(v, r, dens, shade) {
  const key = (r * 17 + dens) * 4 + shade;
  let c = v.puffs[key];
  if (!c) {
    let g;
    [c, g] = makeCanvas(r * 2 + 1, r * 2 + 1);
    g.fillStyle = v.p[SMOKE_SHADES[shade]];
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++)
        if (x * x + y * y <= (r + 0.5) * (r + 0.5) && bayer(x + r, y + r) < dens) g.fillRect(x + r, y + r, 1, 1);
    v.puffs[key] = c;
  }
  return c;
}

function drawSmoke(g, v) {
  for (let i = 0; i < smokePool.n; i++) {
    const s = smokePool.items[i], t = s.age / s.life;
    const r = Math.min(7, Math.floor(s.r0 + s.age * s.grow));
    const dens = 16 - Math.min(3, Math.floor(t * 4)) * 4;          // 16, 12, 8, 4 -> fades out
    const shade = Math.min(3, s.shade + Math.floor(t * 3));
    g.drawImage(puffSprite(v, r, dens, shade), Math.round(s.x) - r, Math.round(s.y) - r);
  }
}
