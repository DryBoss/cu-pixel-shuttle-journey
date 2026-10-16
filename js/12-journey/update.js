'use strict';
// js/12-journey/update.js
// Defines: updateJourney

function updateJourney(dt) {
  const V = CONFIG.CRUISE_SPEED;
  if (ui.title) return;                                 // the train waits behind the title card
  if (drive.on) { updateDrive(dt); return; }
  switch (sim.state) {
    case 'STOPPED':
      updateStop(dt);
      break;

    case 'DEPARTING': {
      sim.timer += dt;
      const T = CONFIG.ACCEL_TIME, u = Math.min(1, sim.timer / T);
      sim.speed = V * smoothstep(u);
      sim.dist = sim.segStart + V * T * (u ** 3 - u ** 4 / 2);         // integral of smoothstep
      if (u >= 1) setState('TRAVELING');
      break;
    }

    case 'TRAVELING':                                   // (eases back to cruise when the driver hands over)
      sim.speed += Math.max(-12 * dt, Math.min(12 * dt, V - sim.speed));
      sim.dist += sim.speed * dt;
      if (sim.nextStop - sim.dist <= V * CONFIG.BRAKE_TIME / 2) setState('ARRIVING');
      break;

    case 'ARRIVING': {
      sim.timer += dt;
      const T = sim.segDur, u = Math.min(1, sim.timer / T);
      sim.speed = sim.segSpeed * (1 - smoothstep(u));
      sim.dist = sim.segStart + sim.segSpeed * T * (u - u ** 3 + u ** 4 / 2);
      if (u >= 1) {
        arrive(sim.station + 1, 0);
        sim.shake = 1.4;                                 // the last jolt as the brakes hold
      }
      break;
    }
  }
}
