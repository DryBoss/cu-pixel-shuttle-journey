'use strict';
// js/08-line/crossings.js
// Defines: crossingX, crossingClosed, drawCrossingDecks, drawCrossings, bellT, crossingBell

const crossingX = cr => Math.round(cr.u - Math.floor(sim.dist) + ANCHOR_X) - 17;     // left edge of the road, screen x
function crossingClosed(cr) {                          // gates are down while the train is on or near the crossing
  const x = crossingX(cr) + 17;
  return x > TRAIN.vehicles[TRAIN.vehicles.length - 1].x - 70 && x < CONFIG.TRAIN_FRONT_X + 130;
}

// The road over the rails: asphalt across the ballast, rails running through it
function drawCrossingDecks(g, v) {
  const p = v.p;
  for (const cr of crossings()) {
    const x0 = crossingX(cr);
    if (x0 > W + 6 || x0 + 36 < -6) continue;
    rect(g, x0, 143, 34, 16, p.grayDark);
    for (let i = 0; i < 24; i++) px(g, x0 + 1 + ((hash2(i, cr.u | 0) * 32) | 0), 144 + ((hash2(cr.u | 0, i) * 13) | 0), p.gray);
    rect(g, x0 - 1, 143, 2, 16, p.brown); rect(g, x0 + 33, 143, 2, 16, p.brown);
    rect(g, x0 - 1, 146, 36, 1, p.grayLight); rect(g, x0 - 1, 147, 36, 1, p.grayDark);
    rect(g, x0 - 1, 151, 36, 1, p.grayLight); rect(g, x0 - 1, 152, 36, 1, p.grayDark);
  }
}

// The road coming towards us, the gates, the warning lights, and the queue
function drawCrossings(g, v) {
  const p = v.p, t = sim.clock;
  for (const cr of crossings()) {
    const x0 = crossingX(cr);
    if (x0 > W + 30 || x0 + 34 < -30) continue;
    rect(g, x0, 158, 34, H - 158, p.grayDark);
    rect(g, x0 - 1, 158, 1, H - 158, p.grayLight); rect(g, x0 + 34, 158, 1, H - 158, p.grayLight);
    for (let y = 161; y < H; y += 6) rect(g, x0 + 16, y, 2, 3, p.white);
    for (let i = 0; i < 40; i++) px(g, x0 + 1 + ((hash2(i, cr.u | 0) * 32) | 0), 158 + ((hash2(cr.u | 0, i + 50) * 22) | 0), p.gray);
    const closed = crossingClosed(cr), on = Math.floor(t * 2 + cr.phase) % 2;
    rect(g, x0 + 35, 148, 2, 11, p.grayDark);                                   // gate post, far side of the road
    rect(g, x0 - 3, 146, 2, 13, p.grayDark);                                    // gate post with the warning lamps
    if (closed) {
      px(g, x0 - 3, 145, on ? p.red : p.ink); px(g, x0 - 2, 145, on ? p.ink : p.red);
      for (let x = x0; x < x0 + 34; x += 6) { rect(g, x, 153, 3, 2, p.red); rect(g, x + 3, 153, 3, 2, p.white); }   // boom down
    } else {
      for (let y = 138; y < 154; y += 4) { rect(g, x0 - 2, y, 2, 2, p.red); rect(g, x0 - 2, y + 2, 2, 2, p.white); } // boom up
    }
    for (let i = 0; i < 5; i++) { px(g, x0 - 14 + i, 144 + i, p.white); px(g, x0 - 10 - i, 144 + i, p.white); }      // crossbuck sign
    rect(g, x0 - 12, 149, 1, 9, p.grayLight);
    if (!closed) continue;
    cr.lanes.forEach((lane, li) => lane.forEach((veh, k) => {
      const spr = vehSprite(v, veh), cx = x0 + (li ? 25 : 9), base = cr.busy ? 164 + k * 8 : 167 + k * 9;   // busy roads: a longer queue fits on screen
      if (base - spr.height < H) g.drawImage(spr, cx - (spr.width >> 1), base - spr.height + 1);
    }));
  }
}

let bellT = 0;
function crossingBell(dt) {
  if ((bellT -= dt) > 0) return;
  bellT = 0.42;
  if (!audioOn()) return;
  for (const cr of crossings()) {
    const x = crossingX(cr) + 17;
    if (x > -40 && x < W + 40 && crossingClosed(cr)) { tone(audio.ctx.currentTime + 0.01, 1480, 0.16, 0.025, 'triangle'); return; }
  }
}
