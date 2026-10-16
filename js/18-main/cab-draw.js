'use strict';
// js/18-main/cab-draw.js
// Defines: drawCab

function drawCab() {
  const g = cctx, P = PALETTE, blink = Math.floor(sim.clock * 3) & 1, D = CONFIG.DRIVE;
  rect(g, 0, 0, 320, CAB_H, P.ink);
  rect(g, 0, 0, 320, 1, P.slate);
  // what to do next, and the lamps
  const hint = driveHint();
  if (hint) drawText(g, hint, 6, 3, P.glow);
  cabLamp(g, 214, 3, sim.stopPhase === 'CLEAR', 'grassLight'); drawText(g, 'FLAG', 220, 3, P.grayLight);
  cabLamp(g, 246, 3, drive.over && blink, 'red'); drawText(g, 'SPEED', 252, 3, P.grayLight);
  // speedometer
  const cx = 50, cy = 54, v = sim.speed;
  cabDial(g, cx, cy, 37, 120, 10, true);
  const lim = dialAngle(drive.limit, 120);
  for (let k = -1; k <= 1; k++) cabLine(g, cx + Math.cos(lim + k * 0.03) * 27, cy + Math.sin(lim + k * 0.03) * 27, cx + Math.cos(lim + k * 0.03) * 32, cy + Math.sin(lim + k * 0.03) * 32, P.red);
  cabNeedle(g, cx, cy, 29, dialAngle(v, 120), drive.over && blink ? P.white : P.glow);
  const t = String(Math.round(v));
  drawText2x(g, t, cx - t.length * 4 + 1, cy + 8, P.white);
  cabLabel(g, 'KM/H', cx, cy + 21, P.grayLight);
  // brake gauge: pipe pressure and cylinder pressure
  const bx = 116, by = 40, bc = Math.min(1, drive.brakeAcc / D.EMERGENCY);
  cabLabel(g, 'BRAKE', bx, 12, P.grayLight);
  cabDial(g, bx, by + 6, 21, 6, 1, false);
  cabNeedle(g, bx, by + 6, 15, dialAngle(5 - 3 * bc, 6), P.white);
  cabNeedle(g, bx, by + 6, 12, dialAngle(5 * bc, 6), P.red);
  drawText(g, 'BP', bx - 12, by + 30, P.white); drawText(g, 'BC', bx + 5, by + 30, P.red);
  // throttle handle
  cabPlate(g, 144, 10, 32, 80);
  cabLabel(g, 'POWER', 160, 13, P.grayLight);
  rect(g, 159, 20, 3, 66, P.ink);
  for (let n = 0; n <= D.NOTCHES; n++) {
    const y = Math.round(THROTTLE_Y(n));
    rect(g, 166, y, 5, 1, n ? P.grayLight : P.red);
    if (n % 2 === 0) drawText(g, String(n), 148, y - 2, P.grayLight);
  }
  { const y = Math.round(THROTTLE_Y(drive.throttle));
    rect(g, 151, y - 4, 19, 9, P.ink); rect(g, 152, y - 3, 17, 7, P.red); rect(g, 152, y - 3, 17, 2, P.rose); rect(g, 153, y + 2, 15, 1, P.rust); }
  // brake handle
  cabPlate(g, 188, 10, 32, 80);
  cabLabel(g, 'BRAKE', 204, 13, P.grayLight);
  rect(g, 203, 20, 3, 66, P.ink);
  ['REL', '1', '2', '3', '4', 'EMG'].forEach((txt, n) => {
    const y = Math.round(BRAKE_Y(n));
    rect(g, 210, y, 5, 1, n === 5 ? P.red : P.grayLight);
    drawText(g, txt, 191, y - 2, n === 5 ? P.red : P.grayLight);
  });
  { const y = Math.round(BRAKE_Y(drive.brake)), body = drive.brake === 5 ? P.red : drive.brake > 0 ? P.amber : P.grassLight;
    rect(g, 195, y - 4, 19, 9, P.ink); rect(g, 196, y - 3, 17, 7, body); rect(g, 196, y - 3, 17, 2, P.white); rect(g, 197, y + 2, 15, 1, P.grayDark); }
  // engine key, headlight switch
  cabPlate(g, 232, 12, 38, 36);
  cabLabel(g, 'ENGINE', 251, 15, P.grayLight);
  const E = drive.engine;
  disc(g, 251, 32, 8, P.grayDark); disc(g, 251, 32, 6, P.ink);
  if (E === 'ON') cabLine(g, 251, 32, 256, 26, P.glow); else if (E === 'OFF') cabLine(g, 251, 32, 246, 26, P.grayLight); else cabLine(g, 251, 32, 258, 32, P.amber);
  cabLamp(g, 262, 40, E === 'ON' || (E === 'CRANK' && blink), E === 'ON' ? 'grassLight' : 'amber');
  cabPlate(g, 232, 52, 38, 36);
  cabLabel(g, 'LIGHT', 251, 55, P.grayLight);
  rect(g, 249, 63, 4, 20, P.ink);
  rect(g, 247, drive.headlight ? 63 : 74, 8, 9, drive.headlight ? P.glow : P.grayLight); rect(g, 247, drive.headlight ? 63 : 74, 8, 2, P.white);
  cabLamp(g, 262, 56, drive.headlight && E !== 'OFF', 'glow');
  // horn cord
  cabPlate(g, 278, 8, 36, 82);
  const gy = drive.horn ? 50 : 38;
  rect(g, 296, 9, 1, gy - 9, P.grayLight);
  rect(g, 289, gy, 15, 9, P.ink); rect(g, 290, gy + 1, 13, 7, P.amber); rect(g, 290, gy + 1, 13, 2, P.peach);
  cabLabel(g, 'HORN', 296, 80, P.grayLight);
}
