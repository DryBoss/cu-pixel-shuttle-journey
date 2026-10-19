'use strict';
// js/13-driver/traction.js
// Defines: gradeAt, updateSlip

// The climb into the Chittagong University hills: nothing until just past Foteyabad, then the
// slope steepens over GRADE_RAMP px and holds, easing off over the last GRADE_EASE px so the
// terminus platform can be reached. 0 = level, 1 = the full gradient (CONFIG.DRIVE.GRAVITY).
function gradeAt(d) {
  const D = CONFIG.DRIVE, from = STATIONS[LAST_STATION - 1].dist + 170, to = STATIONS[LAST_STATION].dist;
  if (d <= from || d >= to) return 0;
  return Math.min(smoothstep(Math.min(1, (d - from) / D.GRADE_RAMP)), smoothstep(Math.min(1, (to - d) / D.GRADE_EASE)));
}

// Wheel slip: power thrown on at low speed breaks the wheels loose. Nearly all traction is lost, the
// whole train shudders and the rails scream until the driver eases off. Wet rails (Monsoon) slip far sooner.
function updateSlip(dt, power) {
  const D = CONFIG.DRIVE, wet = sim.season === 'Monsoon', thr = D.SLIP_NOTCH[wet ? 1 : 0], clear = D.SLIP_CLEAR[wet ? 1 : 0];
  if (!drive.slip) {
    if (power > 0 && drive.lever >= thr && sim.speed < D.SLIP_SPEED) {
      drive.slip = true; drive.slipT = 0;
      toast('WHEEL SLIP! EASE TO NOTCH ' + clear, 'red', true);
      sim.shake = Math.max(sim.shake, 2.6);
      playScreech();
    }
    return;
  }
  if (drive.lever <= clear || power <= 0 || sim.speed >= D.SLIP_SPEED + 6) {          // grip again
    drive.slip = false;
    toast('GRIP REGAINED', 'grassLight');
    return;
  }
  sim.shake = Math.max(sim.shake, 1.7 + Math.random() * 0.9);                          // the whole train shudders
  drive.comfort = Math.max(0, drive.comfort - 6 * dt);
  if ((drive.slipT -= dt) <= 0) { drive.slipT = 0.45; playScreech(); }
}
