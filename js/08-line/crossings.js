'use strict';
// js/08-line/crossings.js
// Defines: crossingX, crossingClosed, drawCrossingDecks, drawCrossings, bellT, crossingBell

const crossingX = cr => Math.round(cr.u - Math.floor(sim.dist) + ANCHOR_X) - 17;     // left edge of a standard 34 px road, screen x
const crossingW = cr => cr.wide ? 54 : 34;                                            // a wide, three-lane crossing is 54 px
const crossingLeft = cr => crossingX(cr) - ((crossingW(cr) - 34) >> 1);               // left edge of this crossing's road
function crossingClosed(cr) {                          // gates are down while the train is on or near the crossing
  const x = crossingX(cr) + 17;
  return x > TRAIN.vehicles[TRAIN.vehicles.length - 1].x - 70 && x < CONFIG.TRAIN_FRONT_X + 130;
}

// The road over the rails: asphalt across the ballast, rails running through it
function drawCrossingDecks(g, v) {
  const p = v.p;
  for (const cr of crossings()) {
    const rw = crossingW(cr), x0 = crossingLeft(cr);
    if (x0 > W + 6 || x0 + rw + 2 < -6) continue;
    rect(g, x0, 143, rw, 16, cr.dirt ? p.brown : p.grayDark);
    for (let i = 0; i < rw * 0.7; i++) px(g, x0 + 1 + ((hash2(i, cr.u | 0) * (rw - 2)) | 0), 144 + ((hash2(cr.u | 0, i) * 13) | 0), cr.dirt ? (i % 3 ? p.tan : p.rust) : p.gray);
    rect(g, x0 - 1, 143, 2, 16, p.brown); rect(g, x0 + rw - 1, 143, 2, 16, p.brown);
    rect(g, x0 - 1, 146, rw + 2, 1, p.grayLight); rect(g, x0 - 1, 147, rw + 2, 1, p.grayDark);
    rect(g, x0 - 1, 151, rw + 2, 1, p.grayLight); rect(g, x0 - 1, 152, rw + 2, 1, p.grayDark);
  }
}

// The road coming towards us, the gates, the warning lights, and the queue
function drawCrossings(g, v) {
  const p = v.p, t = sim.clock;
  for (const cr of crossings()) {
    const rw = crossingW(cr), x0 = crossingLeft(cr);
    if (x0 > W + 30 || x0 + rw < -30) continue;
    rect(g, x0, 158, rw, H - 158, cr.dirt ? p.brown : p.grayDark);
    rect(g, x0 - 1, 158, 1, H - 158, cr.dirt ? p.tan : p.grayLight); rect(g, x0 + rw, 158, 1, H - 158, cr.dirt ? p.tan : p.grayLight);
    if (!cr.dirt) for (const lx of cr.wide ? [x0 + 18, x0 + 35] : [x0 + 16]) { if (cr.neat) rect(g, lx, 158, 2, H - 158, p.white); else for (let y = 161; y < H; y += 6) rect(g, lx, y, 2, 3, p.white); }
    if (cr.neat) for (let y = 159; y < H; y += 4) { const c2 = (y >> 2) & 1 ? p.white : p.grayLight; rect(g, x0 - 3, y, 2, 3, c2); rect(g, x0 + rw + 1, y, 2, 3, c2); }   // painted kerb stones
    for (let i = 0; i < rw * 1.2; i++) px(g, x0 + 1 + ((hash2(i, cr.u | 0) * (rw - 2)) | 0), 158 + ((hash2(cr.u | 0, i + 50) * 22) | 0), cr.dirt ? (i % 3 ? p.tan : p.rust) : p.gray);   // dirt: tan dust and broken brick
    const closed = crossingClosed(cr), on = Math.floor(t * 2 + cr.phase) % 2;
    rect(g, x0 + rw + 1, 148, 2, 11, p.grayDark);                                   // gate post, far side of the road
    rect(g, x0 - 3, 146, 2, 13, p.grayDark);                                    // gate post with the warning lamps
    if (closed) {
      px(g, x0 - 3, 145, on ? p.red : p.ink); px(g, x0 - 2, 145, on ? p.ink : p.red);
      for (let x = x0; x < x0 + rw; x += 6) { rect(g, x, 153, 3, 2, p.red); rect(g, x + 3, 153, 3, 2, p.white); }   // boom down
    } else {
      for (let y = 138; y < 154; y += 4) { rect(g, x0 - 2, y, 2, 2, p.red); rect(g, x0 - 2, y + 2, 2, 2, p.white); } // boom up
    }
    for (let i = 0; i < 5; i++) { px(g, x0 - 14 + i, 144 + i, p.white); px(g, x0 - 10 - i, 144 + i, p.white); }      // crossbuck sign
    rect(g, x0 - 12, 149, 1, 9, p.grayLight);
    if (!closed) continue;
    cr.lanes.forEach((lane, li) => lane.forEach((veh, k) => {
      const spr = vehSprite(v, veh), cx = x0 + (cr.wide ? [9, 27, 45][li] : li ? 25 : 9), base = cr.busy === 2 ? 162 + k * 6 : cr.busy ? 163 + k * 7 : 167 + k * 9;   // busy roads: a longer queue fits on screen; gridlock packs it tighter
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
