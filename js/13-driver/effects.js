'use strict';
// js/13-driver/effects.js
// Defines: brakeEffort, squealLevel

// How hard the brakes bite, 0..1 (sparks) and how loudly they squeal near a stop. The same for the driver and the autopilot.
function brakeEffort() {
  return sim.state === 'DRIVING' && drive.lever <= -2 ? (-drive.lever - 1) / 4 : 0;
}
function squealLevel() {
  const v = sim.speed, k = drive.lever < 0 ? Math.min(1, -drive.lever / 3) : 0;
  return v > 0.3 && v < 26 ? k * (1 - v / 26) * Math.min(1, v / 2) : 0;
}
