'use strict';
// js/15-ui/hud.js
// Defines: hudBox, textRight, drawDriveHUD

// --- DRIVE mode: the driver's panels, the next-step hint, messages ----------
function hudBox(g, x, y, w, h) {
  rect(g, x, y, w, h, PALETTE.slate);
  rect(g, x + 1, y + 1, w - 2, h - 2, PALETTE.ink);
}
const textRight = (g, s, xr, y, col) => drawText(g, s, xr - textWidth(s), y, col);

function drawDriveHUD(g) {
  const P = PALETTE, D = CONFIG.DRIVE, blink = Math.floor(sim.clock * 4) & 1, E = drive.engine;
  // left: speedometer, limit board, the lever, engine, passengers
  let x = 2, y = 2;
  hudBox(g, x, y, 76, 44);
  const v = String(Math.round(sim.speed));
  drawText2x(g, v, x + 28 - v.length * 8, y + 4, drive.over && blink ? P.red : P.white);
  drawText(g, 'KM/H', x + 30, y + 9, P.grayLight);
  const lim = String(drive.limit);
  rect(g, x + 52, y + 3, 21, 13, P.red);
  rect(g, x + 54, y + 5, 17, 9, P.white);
  drawText(g, lim, x + 52 + ((21 - textWidth(lim)) >> 1), y + 7, P.ink);
  const ly = y + 18, l = drive.lever;                    // brake steps on the left, power on the right
  for (let n = EB; n <= D.NOTCHES; n++) {
    const cx = x + 4 + (n - EB) * 4, on = l > 0 ? n > 0 && n <= l : l < 0 ? n < 0 && n >= l : n === 0;
    rect(g, cx, ly, 3, 5, n > 0 ? (on ? P.grassLight : P.greenDeep) : n < 0 ? (on ? (n === EB ? P.red : P.amber) : P.brownDark)
                         : on ? P.white : P.grayDark);
    if (n === l) rect(g, cx, ly + 6, 3, 1, P.glow);
  }
  textRight(g, leverLabel(l), x + 73, ly, l === EB ? P.red : P.white);
  const ey = y + 28;
  drawText(g, 'ENG', x + 4, ey, P.grayLight);
  drawText(g, E === 'OFF' ? 'OFF' : E === 'ON' ? 'ON' : E === 'CRANK' ? 'START' : 'STOP', x + 20, ey,
           E === 'OFF' ? P.red : E === 'ON' ? P.grassLight : blink ? P.amber : P.peach);
  rect(g, x + 44, ey, 29, 5, P.navy);
  rect(g, x + 44, ey, Math.round(29 * drive.rpm), 5, drive.rpm > 0.85 ? P.orange : P.green);
  drawText(g, 'PAX ' + drive.pax, x + 4, y + 36, P.white);
  textRight(g, 'LAMP', x + 73, y + 36, drive.headlight && E !== 'OFF' ? P.glow : P.grayDark);

  // right: score, clock and timetable, the next stop, comfort
  x = W - 78;
  hudBox(g, x, y, 76, 44);
  const S = drive.pts, score = String(Math.round(S.stops + S.time + S.pax + S.penalty));
  drawText(g, 'SCORE', x + 4, y + 4, P.grayLight);
  textRight(g, score, x + 72, y + 4, P.glow);
  const stopped = sim.state === 'STOPPED', i = stopped ? sim.station : Math.min(LAST_STATION, sim.station + 1);
  const leaving = stopped && i < LAST_STATION, dueT = leaving ? SCHEDULE[i].dep : SCHEDULE[i].arr;
  drawText(g, hhmm(sim.hour), x + 4, y + 12, P.white);
  textRight(g, (leaving ? 'DEP ' : 'ARR ') + hhmm(tripHour(dueT)), x + 72, y + 12,
            drive.tripT > dueT && !(stopped && !leaving) ? P.red : P.grayLight);
  const st = STATIONS[sim.station + 1];
  if (stopped) {
    drawText(g, 'AT ' + STATIONS[sim.station].code, x + 4, y + 20, P.white);
    textRight(g, st ? 'NEXT ' + st.code : 'TERMINUS', x + 72, y + 20, P.grayLight);
  } else if (st) {
    const togo = st.dist - sim.dist;
    drawText(g, st.code, x + 4, y + 20, P.white);
    textRight(g, togo > 400 ? (togo / CONFIG.PX_PER_KM).toFixed(1) + ' KM' : 'STOP ' + Math.round(togo) + ' M', x + 72, y + 20,
              togo > 400 ? P.white : P.glow);
  }
  if (!stopped && st && st.dist - sim.dist < 400) {      // stop gauge: the window, the mark, the train
    const w = stopWindow(st), o = sim.dist - st.dist, bx = x + 4, bw = 68;
    const at = u => bx + Math.round((Math.max(-160, Math.min(80, u)) + 160) / 240 * (bw - 1));
    rect(g, bx, y + 29, bw, 3, P.navy);
    rect(g, at(w[0]), y + 29, at(w[1]) - at(w[0]) + 1, 3, P.greenDark);
    rect(g, at(0), y + 28, 1, 5, P.white);
    rect(g, at(o) - 1, y + 28, 3, 5, P.glow);
  } else {
    const ahead = speedLimitAt(sim.dist + 320);
    if (!stopped && ahead < drive.limit) drawText(g, 'LIMIT ' + ahead + ' AHEAD', x + 4, y + 28, blink ? P.amber : P.peach);
    else drawText(g, 'LIMIT ' + drive.limit, x + 4, y + 28, P.grayLight);
  }
  const cf = Math.round(drive.comfort);
  drawText(g, 'COMFORT', x + 4, y + 36, P.grayLight);
  textRight(g, cf + '%', x + 72, y + 36, cf > 80 ? P.grassLight : cf > 50 ? P.amber : P.red);
}
