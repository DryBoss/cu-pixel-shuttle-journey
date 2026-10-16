'use strict';
// js/08-line/draw-line.js
// Defines: drawLine, drawTruss, drawReflection, updateBridge

function drawLine(g, v) {
  if (!BRIDGE.spans) { drawLand(g, v, sim.dist); return; }
  const d = sim.dist;
  bridgeX();
  const b0 = bridgeX0, b1 = bridgeX1;
  if (b1 <= -40 || b0 >= W + 40) { drawLand(g, v, d); return; }
  if (clipBegin(g, -64, b0)) { drawLand(g, v, d); g.restore(); }
  if (clipBegin(g, b1, W + 64)) { drawLand(g, v, d); g.restore(); }
  if (clipBegin(g, b0, b1)) { drawTiled(g, v.deck, d, LAYER_Y.track); g.restore(); }
  for (let k = 1; k < BRIDGE.spans; k++) g.drawImage(v.pier, b0 + k * BRIDGE.span - 5, PIER_Y);
  g.drawImage(v.abutment[0], b0 - 14, 147);
  g.drawImage(v.abutment[1], b1 - 2, 147);
  drawTruss(g, v, false);
}

// Far truss behind the train; near truss drawn over it, so the train runs
// behind the lattice
function drawTruss(g, v, near) {
  bridgeX();
  const spr = near ? v.trussNear : v.trussFar;
  for (let k = 0; k < BRIDGE.spans; k++) {
    const x = bridgeX0 + k * BRIDGE.span;
    if (x < W && x + spr.width > 0) g.drawImage(spr, x, near ? TRUSS_Y : TRUSS_Y - 4);
  }
}

// Wavy reflection of the train and bridge in the open water under the deck:
// rows above the axis are copied upside down and squashed 2:1 (so the
// carriage bodies show), each nudged sideways by a ripple, then a
// water-coloured dither knocks them back
function drawReflection(g, v) {
  const d = sim.dist, f = PARALLAX.fg;
  const xa = Math.max(0, Math.ceil(ANCHOR_X + (BRIDGE.u0 - d) * f));
  const xb = Math.min(W, Math.floor(ANCHOR_X + (BRIDGE.u1 - d) * f));
  if (xb <= xa) return;
  const y0 = LAYER_Y.fg + 15, top = REFLECT_AXIS - 2 * (H - y0);
  rctx.clearRect(0, 0, W, REFLECT_AXIS - top);
  rctx.drawImage(g.canvas, 0, top, W, REFLECT_AXIS - top, 0, 0, W, REFLECT_AXIS - top);   // one snapshot
  for (let y = y0; y < H; y++) {
    const wob = Math.round(Math.sin(y * 1.3 + sim.clock * 3.2) * (y - y0 + 4) / 9);
    g.drawImage(reflectBuf, xa, REFLECT_AXIS - 2 * (y - y0) - 1 - top, xb - xa, 1, xa + wob, y, xb - xa, 1);
  }
  g.fillStyle = v.waterTint;
  g.fillRect(xa, y0, xb - xa, H - y0);
  for (let i = 0; i < 12; i++) {                       // fade out towards the banks
    g.fillStyle = v.waterFade[16 - Math.round(i * 4 / 3)];
    if (xa > 0) g.fillRect(xa + i, y0, 1, H - y0);
    if (xb < W) g.fillRect(xb - 1 - i, y0, 1, H - y0);
  }
}

// How much of the train is on the bridge: onBridge as a flag, bridgeMix
// 0..1 so the rumble turns louder and more metallic as the rake runs on
function updateBridge() {
  const rear = sim.dist + TRAIN.vehicles[TRAIN.vehicles.length - 1].x - ANCHOR_X;
  const front = sim.dist + CONFIG.TRAIN_FRONT_X - ANCHOR_X;
  const over = Math.max(0, Math.min(front, BRIDGE.u1) - Math.max(rear, BRIDGE.u0));
  sim.bridgeMix = over / (front - rear);
  sim.onBridge = over > 0;
}
