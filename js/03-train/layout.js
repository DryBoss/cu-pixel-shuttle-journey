'use strict';
// js/03-train/layout.js
// Defines: TRAIN

// =====================================================================
// 4. TRAIN
// =====================================================================
// Bangladeshi intercity rake: Bo-Bo diesel locomotive + 5 carriages,
// heading right. The whole train stays fixed on screen.
const TRAIN = (() => {
  const locoX = CONFIG.TRAIN_FRONT_X - CONFIG.LOCO_W;
  const vehicles = [{ x: locoX, w: CONFIG.LOCO_W, y: LAYER_Y.loco, wheels: [6, 14, 31, 39] }];
  let x = locoX;
  for (let i = 0; i < CONFIG.CAR_COUNT; i++) {
    x -= CONFIG.CAR_GAP + CONFIG.CAR_W;
    vehicles.push({ x, w: CONFIG.CAR_W, y: LAYER_Y.car, wheels: [5, 13, 25, 33] });
  }
  return {
    vehicles,
    centerX: (x + CONFIG.TRAIN_FRONT_X) / 2,
    stackX: locoX + 15, stackY: LAYER_Y.loco - 1,   // exhaust stack on the roof
  };
})();
