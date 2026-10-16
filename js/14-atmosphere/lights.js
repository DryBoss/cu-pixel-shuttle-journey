'use strict';
// js/14-atmosphere/lights.js
// Defines: LIGHT_LAMP, lights, addLight

// --- glow: light sources added on top after dark ---------------------------
// Lamps and windows register themselves while the world is drawn; the glow
// pass then adds soft halos with the 'lighter' (additive) blend.
const LIGHT_LAMP = 0, LIGHT_WINDOW = 1, LIGHT_BULB = 2, LIGHT_MAX = 96;
const lights = { n: 0, collect: true, x: new Float32Array(LIGHT_MAX), y: new Float32Array(LIGHT_MAX), k: new Uint8Array(LIGHT_MAX) };
function addLight(x, y, kind) {
  if (!lights.collect || lights.n >= LIGHT_MAX || x < -20 || x > W + 20) return;
  lights.x[lights.n] = x; lights.y[lights.n] = y; lights.k[lights.n++] = kind;
}
