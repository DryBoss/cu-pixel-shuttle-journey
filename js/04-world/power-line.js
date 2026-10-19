'use strict';
// js/04-world/power-line.js
// Defines: POWER, buildPowerLine, drawPowerLine

// --- the close electricity line that runs beside the railway the whole way: tall concrete poles on the
// near side of the track (drawn in front of the train, at the foreground's parallax), two cross-arms with
// porcelain insulators, a pole-top transformer on every second pole, and sagging conductors that run on
// from pole to pole across the top of the picture. (The thin telegraph poles right behind the train, in
// poles.js, are a separate, far line.)
const POWER = { TW: 400, SPACING: 200, H: 170, FOOT: 163, ARM: 17 };

function buildPowerLine(p) {
  const { TW, SPACING, H, FOOT, ARM } = POWER, [c, g] = makeCanvas(TW, H);
  const poles = [60, 60 + SPACING];
  // conductors first, so the poles stand in front of them: three on the top arm, two on the lower arm
  const wires = [[ARM, -13, 8, p.ink], [ARM, 0, 9, p.ink], [ARM, 13, 8, p.ink], [ARM + 11, -7, 6, p.grayDark], [ARM + 11, 7, 6, p.grayDark]];
  for (const x of poles)
    for (const [y0, ax, sag, col] of wires)
      for (let i = 0; i <= SPACING; i++) {
        const t = i / SPACING, y = y0 - 1 + Math.round(sag * 4 * t * (1 - t));
        wrapX(TW, o => px(g, x + ax + i + o, y, col));
      }
  poles.forEach((x, k) => {
    for (let y = ARM - 4; y < FOOT; y++) {                                  // the pole: concrete, a little thicker towards the foot
      const w = y < 60 ? 3 : y < 110 ? 4 : 5, x0 = x - (w >> 1);
      rect(g, x0, y, w, 1, p.grayLight);
      px(g, x0, y, p.white); px(g, x0 + w - 1, y, p.gray);
      if (w > 3) px(g, x0 + w - 2, y, p.gray);
      if (y % 23 === 0) rect(g, x0, y, w, 1, p.cloudShade);                // cast joints
    }
    rect(g, x - 4, FOOT - 3, 9, 3, p.gray); rect(g, x - 4, FOOT - 3, 9, 1, p.grayLight); rect(g, x - 4, FOOT - 1, 9, 1, p.grayDark);   // footing
    const arm = (y, hw, ins) => {                                           // a galvanised angle-iron cross-arm with braces and insulators
      rect(g, x - hw, y, hw * 2 + 1, 2, p.grayDark); rect(g, x - hw, y, hw * 2 + 1, 1, p.gray);
      for (let j = 1; j < 6; j++) { px(g, x - j - 1, y + 1 + j, p.grayDark); px(g, x + j + 1, y + 1 + j, p.grayDark); }   // braces
      for (const ax of ins) { rect(g, x + ax, y - 3, 1, 3, p.cream); px(g, x + ax, y - 3, p.white); px(g, x + ax, y - 1, p.brown); }
    };
    arm(ARM, 15, [-13, 0, 13]);
    arm(ARM + 11, 9, [-7, 7]);
    if (k === 0) {                                                          // a pole-top transformer drum with its bushings and a fuse box
      rect(g, x - 6, 48, 5, 13, p.grayDark); rect(g, x - 6, 48, 5, 1, p.gray); rect(g, x - 6, 49, 1, 12, p.gray);
      for (let y = 52; y < 61; y += 3) rect(g, x - 6, y, 5, 1, p.ink);
      rect(g, x - 5, 45, 1, 3, p.cream); rect(g, x - 3, 45, 1, 3, p.cream);
      rect(g, x + 2, 52, 4, 6, p.gray); rect(g, x + 2, 52, 4, 1, p.grayLight); px(g, x + 4, 55, p.red);
      rect(g, x - 4, 38, 1, 7, p.ink);                                       // a tap from the top arm
    }
  });
  return c;
}

// Foreground parallax, so the poles sweep past faster than the track: drawn after the foreground ground, in front of the train
function drawPowerLine(g, v) {
  drawTiled(g, v.power, sim.dist * PARALLAX.fg, 0);
}
