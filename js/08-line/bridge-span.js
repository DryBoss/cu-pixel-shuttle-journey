'use strict';
// js/08-line/bridge-span.js
// Defines: bridgeX0, bridgeX, clipBegin, drawLand

// --- the line: poles and ballast on land, the bridge over the Meghna -------
let bridgeX0 = 0, bridgeX1 = 0;                  // screen x of the abutments, set by bridgeX()
function bridgeX() {
  const cam = Math.floor(sim.dist);
  bridgeX0 = BRIDGE.u0 - cam + ANCHOR_X;
  bridgeX1 = BRIDGE.u1 - cam + ANCHOR_X;
}

// Clip to a band of screen columns; call g.restore() when it returns true
function clipBegin(g, xa, xb) {
  xa = Math.max(xa, -64); xb = Math.min(xb, W + 64);
  if (xb <= xa) return false;
  g.save();
  g.beginPath();
  g.rect(xa, 0, xb - xa, H);
  g.clip();
  return true;
}

function drawLand(g, v, d) {
  drawTiled(g, v.track, d, LAYER_Y.track);
  drawCrossingDecks(g, v);
}
