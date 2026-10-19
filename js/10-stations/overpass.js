'use strict';
// js/10-stations/overpass.js
// Defines: flyoverLeft, drawOverpassBack, drawOverpassFront, drawOverpassShade

// The Dewanhat flyover is fixed to the line (it scrolls with the track, not with the far hills): its left edge
// sits FLY.X0 px past the stop mark. The back pier frame and the deck are drawn BEFORE the train, the front
// pier frame AFTER it, so the train passes between them, under the deck.
const flyoverLeft = () => STATIONS[1].dist + FLY.X0 - Math.floor(sim.dist);

function drawOverpassBack(g, v) {
  const x = flyoverLeft();
  if (x > W + 4 || x + FLY.W < -4) return;
  g.drawImage(v.flyover.back, x, FLY.TOP_BACK);
  addLight(x + 6, FLY.TOP_BACK + 4, LIGHT_LAMP); addLight(x + FLY.W - 5, FLY.TOP_BACK + 4, LIGHT_LAMP);
}

function drawOverpassFront(g, v) {
  const x = flyoverLeft();
  if (x > W + 4 || x + FLY.W < -4) return;
  g.drawImage(v.flyover.front, x, FLY.TOP_FRONT);
}

function drawOverpassShade(g, v) {                                      // the deck's shadow lies over the train and the tracks
  const a = flyoverLeft() - 6, b = a + FLY.W + 12;
  if (b < 0 || a > W) return;
  g.fillStyle = v.p.ink;
  for (let x = Math.max(0, a); x < Math.min(W, b); x++) {
    g.globalAlpha = 0.32 * Math.max(0, Math.min(1, (x - a) / 8, (b - x) / 8));
    g.fillRect(x, 108, 1, 54);
  }
  g.globalAlpha = 1;
}
