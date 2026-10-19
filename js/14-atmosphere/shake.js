'use strict';
// js/14-atmosphere/shake.js
// Defines: shake, clunk, updateShake

// --- camera shake: a jolt when the train starts or stops, a rumble on the bridge
// shake.jolt is the lever "clunk": one or two frames of a 1px knock, felt in the cab and the world
const shake = { x: 0, y: 0, jolt: 0 };
let clunkF = 0;
function clunk() { sim.shake = Math.max(sim.shake, 0.2); clunkF = 2; }
function updateShake(dt) {
  sim.shake = Math.max(0, sim.shake - dt * 2.5);
  shake.jolt = clunkF > 0 ? 1 : 0;
  if (clunkF > 0) clunkF--;
  const amp = sim.shake + (sim.onBridge ? 0.9 * sim.bridgeMix * sim.speed / CONFIG.CRUISE_SPEED : 0);
  if (amp < 0.35) { shake.x = 0; shake.y = shake.jolt; return; }
  shake.x = Math.round(Math.sin(sim.clock * 41.3) * amp);
  shake.y = Math.max(shake.jolt, Math.round(Math.abs(Math.sin(sim.clock * 29.7 + 1)) * amp * 0.8));
}
