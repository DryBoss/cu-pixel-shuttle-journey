'use strict';
// js/03-train/draw.js
// Defines: drawBogie, swayOffset, drawTrain, drawRoofRiders

function drawBogie(g, p, a, b) {
  rect(g, a - 3, 143, b - a + 7, 1, p.gray);          // side frame
  rect(g, a - 2, 144, b - a + 5, 1, p.grayDark);
  const m = (a + b) >> 1;
  rect(g, m - 1, 140, 3, 3, p.ink);                   // bolster spring
  px(g, m, 141, p.grayDark);
}

// Body bounce relative to the bogies: -1, 0 or +1 px, only while moving
function swayOffset(i) {
  const k = Math.min(1, sim.speed / CONFIG.CRUISE_SPEED);
  if (k < 0.05) return 0;
  const s = (Math.sin(sim.swayPhase + i * 2.1) + 0.6 * Math.sin(sim.swayPhase * 2.3 + i * 1.3)) * k;
  return s > 1.05 ? -1 : s < -1.3 ? 1 : 0;
}

function drawTrain(g, v) {
  const p = v.p, vehicles = TRAIN.vehicles;
  const wf = v.wheels[Math.floor(sim.wheelAngle / (Math.PI / 2) * CONFIG.WHEEL_FRAMES) % CONFIG.WHEEL_FRAMES];
  // couplings (behind bodies): gangway bellows between carriages + coupler
  for (let i = 0; i < vehicles.length - 1; i++) {
    const gx = vehicles[i + 1].x + vehicles[i + 1].w;
    if (i > 0) rect(g, gx, 125, CONFIG.CAR_GAP, 11, p.grayDark);
    rect(g, gx - 1, 137, CONFIG.CAR_GAP + 2, 1, p.ink);
  }
  vehicles.forEach((veh, i) => {
    for (const wx of veh.wheels) g.drawImage(wf, veh.x + wx - 3, LAYER_Y.wheel);
    for (let k = 0; k < veh.wheels.length; k += 2) drawBogie(g, p, veh.x + veh.wheels[k], veh.x + veh.wheels[k + 1]);
    g.drawImage(i === 0 ? v.loco : v.cars[i - 1], veh.x, veh.y + swayOffset(i));
  });
  drawDoors(g, v);
  drawRoofRiders(g, v);
  if (sim.hornWave > 0) drawHornWaves(g, p);
}

// Students on the engine's steps (sim.roof holds only those; nobody rides on top of
// the carriages): the fuller the train, the more of them (each has its own threshold)
function drawRoofRiders(g, v) {
  if (!sim.roof) return;
  const load = Math.min(1, drive.pax / 150);
  for (let n = 0; n < sim.roof.length; n++) {
    const r = sim.roof[n];
    if (r.t > load) continue;
    const veh = TRAIN.vehicles[r.car];
    g.drawImage(personSprite(v, r.d, 4, r.dir), Math.round(veh.x + r.x - PERSON_CX), veh.y + r.fy + swayOffset(r.car) - PERSON_FY);
  }
}
