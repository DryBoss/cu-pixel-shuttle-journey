'use strict';
// js/14-atmosphere/shake.js
// Defines: shake, updateShake

// --- camera shake: a jolt when the train starts or stops, a rumble on the bridge
const shake = { x: 0, y: 0 };
function updateShake(dt) {
  sim.shake = Math.max(0, sim.shake - dt * 2.5);
  const amp = sim.shake + (sim.onBridge ? 0.9 * sim.bridgeMix * sim.speed / CONFIG.CRUISE_SPEED : 0);
  if (amp < 0.35) { shake.x = shake.y = 0; return; }
  shake.x = Math.round(Math.sin(sim.clock * 41.3) * amp);
  shake.y = Math.round(Math.abs(Math.sin(sim.clock * 29.7 + 1)) * amp * 0.8);
}
