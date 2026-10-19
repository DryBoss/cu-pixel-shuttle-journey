'use strict';
// js/14-atmosphere/update-all.js
// Defines: update, villageHorn

function update(dt) {
  updateEngine(dt);
  updateJourney(dt);
  updatePeople(dt);
  updatePopups(dt);
  updateUI(dt);
  sim.clock += dt;
  sim.cloudDrift += dt * 1.5;
  sim.wheelAngle = (sim.wheelAngle + sim.speed * dt / CONFIG.WHEEL_R) % (Math.PI / 2);
  sim.swayPhase += sim.speed * dt * 0.09;
  sim.hornWave = Math.max(0, sim.hornWave - dt);
  updateSmoke(dt);
  updateBridge();
  updateBirds(dt);
  updateFluff(dt);
  updateSparks(dt);
  updateWeather(dt);
  trackSound(dt);
  villageHorn(dt);
  crossingBell(dt);
}

// Now and then the driver sounds the horn passing a village
function villageHorn(dt) {                             // (a driver blows their own horn)
  if (sim.state !== 'TRAVELING' || sectionWeight('village', sim.dist) < 0.5) return;
  if ((sim.hornTimer -= dt) > 0) return;
  sim.hornTimer = 12 + sim.fxRng() * 14;
  playHorn(true);
}
