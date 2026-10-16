'use strict';
// js/15-ui/overlays.js
// Defines: drawPaused, landLabel, drawDebug

function drawPaused(g) {
  const s = 'PAUSED', w = s.length * 8 + 8, x = (W - w) >> 1;
  hudBox(g, x, 84, w, 16);
  drawText2x(g, s, x + 5, 87, PALETTE.white);
}

function landLabel() {
  const w = terrainAt(sim.dist);
  return SECTIONS[TERRAIN[w.t > 0.5 ? w.b : w.a].id].name;
}

function drawDebug(g) {
  const stopped = sim.state === 'STOPPED';
  const st = STATIONS[stopped ? sim.station : Math.min(sim.station + 1, LAST_STATION)];
  const lines = [
    'STATE ' + sim.state + (stopped ? ' ' + sim.stopPhase.replace('_', ' ') : ''),
    'SPEED ' + sim.speed.toFixed(1) + ' PX/S',
    'DIST  ' + Math.floor(sim.dist) + ' PX',
    (stopped ? 'AT    ' : 'NEXT  ') + st.en,
    stopped ? 'PEOPLE ' + sim.people.length : 'IN    ' + Math.ceil(sim.nextStop - sim.dist) + ' PX',
    'TIME  ' + hhmm(sim.hour) + ' ' + TIME_MODES[ui.timeMode][0] + (weather.level > 0.05 ? ' RAIN ' + Math.round(weather.level * 100) : ''),
    'LAND  ' + landLabel() + (sim.onBridge ? ' BRIDGE' : ''),
  ];
  if (drive.on) lines.push('DRIVE ' + drive.engine + ' ' + leverLabel(drive.lever) + ' RPM ' + Math.round(drive.rpm * 100) +
                           ' A ' + drive.accel.toFixed(1), 'TRIP ' + Math.round(drive.tripT) + ' S  OFFSET ' + Math.round(sim.dist - (STATIONS[sim.station + 1] || STATIONS[sim.station]).dist));
  if (timeScale() !== 1) lines.push(ui.paused ? 'PAUSED' : 'SPEED X' + timeScale());
  if (quality.low) lines.push('LOW QUALITY ' + quality.ema.toFixed(1) + ' MS');
  lines.push('P PAUSE  N NEXT  T TIME  W RAIN  C DRIVE', 'M SOUND  1/2/4 SPEED  R RESTART');
  const w = Math.max(...lines.map(textWidth)) + 6, h = lines.length * 7 + 4;
  rect(g, 2, 2, w, h, PALETTE.slate);
  rect(g, 3, 3, w - 2, h - 2, PALETTE.ink);
  lines.forEach((s, i) =>
    drawText(g, s, 5, 5 + i * 7, i >= lines.length - 2 ? PALETTE.grayLight : i === 0 ? PALETTE.glow : PALETTE.white));
  ui.debugW = w + 2;
}
