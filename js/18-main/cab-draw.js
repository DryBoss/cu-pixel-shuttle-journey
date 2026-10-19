'use strict';
// js/18-main/cab-draw.js
// Defines: cabBackdrop, drawCab

// =====================================================================
// THE LOCO MASTER'S DESK: a weathered BR diesel console.
// The static part (painted steel, grime, rivets, plates, lever slots and the wear around them)
// is drawn once into a backdrop; drawCab() adds the moving parts on top every frame.
// =====================================================================
const CAB_PLATES = [[144, 10, 32, 80], [188, 10, 32, 80], [232, 12, 38, 36], [232, 52, 38, 36], [278, 8, 36, 82]];
const LEVER_X = { throttle: 160, brake: 204 }, SLOT_Y0 = 17, SLOT_Y1 = 87;

// Paint rubbed through to bare steel along a lever's path, scratches, and rust where hands and weather got at it
function cabWear(g, rng, cx) {
  const P = PALETTE;
  for (let y = SLOT_Y0 + 2; y <= SLOT_Y1 + 4; y++) for (let x = cx - 12; x <= cx + 12; x++) {
    const k = 1 - Math.abs(x - cx) / 12, pr = k * k * (x < cx - 3 ? 0.12 : 0.4);   // thickest right at the slot; the label side stays legible
    if (rng() < pr) px(g, x, y, rng() < 0.55 ? P.gray : rng() < 0.6 ? P.grayLight : P.grayDark);
  }
  for (let i = 0; i < 30; i++) {                                                   // scratches along the stroke of the hand
    const x = cx + ((rng() * 22) | 0) - 11, y = SLOT_Y0 + ((rng() * (SLOT_Y1 - SLOT_Y0)) | 0), len = 3 + ((rng() * 9) | 0);
    cabLine(g, x, y, x + ((rng() * 3) | 0) - 1, y + len, rng() < 0.65 ? P.grayLight : P.gray);
  }
  for (let i = 0; i < 9; i++) {                                                    // rust blooming where the paint is gone, and running down
    const ends = i < 5, x = cx + ((rng() * 20) | 0) - 10, y = ends ? SLOT_Y0 + ((rng() * 10) | 0) : SLOT_Y1 - ((rng() * 10) | 0), r = 1 + ((rng() * 2) | 0);
    disc(g, x, y, r, P.rust);
    if (rng() < 0.6) px(g, x + 1, y - 1, P.brown);
    const run = 3 + ((rng() * 9) | 0);
    for (let k = 1; k <= run; k += 2) px(g, x, y + r + k, P.rust);
  }
}

function cabBackdrop() {
  if (cabBackdrop.c) return cabBackdrop.c;
  const [c, g] = makeCanvas(320, CAB_H), P = PALETTE, rng = mulberry32(0xCAB);
  rect(g, 0, 0, 320, CAB_H, P.greenDark);                                          // dark industrial green
  for (let y = 36; y < CAB_H; y++) for (let x = 0; x < 320; x++)                   // sooty and darker towards the floor
    if (bayer(x, y) < (y - 36) / 60 * 0.75 * 16) px(g, x, y, P.greenDeep);
  for (let i = 0; i < 1100; i++) {                                                 // chipped, faded, filthy paint
    const r = rng(), x = (rng() * 320) | 0, y = (rng() * CAB_H) | 0;
    px(g, x, y, r < 0.5 ? P.greenDeep : r < 0.72 ? P.green : r < 0.9 ? P.grayDark : P.rust);
  }
  for (const x of [139, 183, 227, 274]) { rect(g, x, 2, 1, CAB_H - 2, P.greenDeep); rect(g, x + 1, 2, 1, CAB_H - 2, P.green); }   // panel seams
  for (let x = 6; x < 320; x += 14) { px(g, x, CAB_H - 3, P.grayLight); px(g, x + 1, CAB_H - 2, P.ink); px(g, x, 4, P.grayLight); px(g, x + 1, 5, P.ink); }   // rivets
  rect(g, 0, 0, 320, 2, P.grayDark); rect(g, 0, 0, 320, 1, P.slate);              // the top lip
  for (const [x, y, w, h] of CAB_PLATES) {                                         // steel plates, with rust weeping from under them
    cabPlate(g, x, y, w, h);
    for (let i = 0; i < 3; i++) { const sx = x + 4 + ((rng() * (w - 8)) | 0); for (let k = 0; k < 4 + ((rng() * 8) | 0); k += 2) px(g, sx, y + h + k, rng() < 0.7 ? P.rust : P.brownDark); }
  }
  for (const cx of Object.values(LEVER_X)) {                                       // the lever slots: a machined guide in a steel rail
    rect(g, cx - 3, SLOT_Y0 - 1, 7, SLOT_Y1 - SLOT_Y0 + 3, P.ink);
    rect(g, cx - 3, SLOT_Y0 - 1, 1, SLOT_Y1 - SLOT_Y0 + 3, P.grayLight); rect(g, cx + 3, SLOT_Y0 - 1, 1, SLOT_Y1 - SLOT_Y0 + 3, P.slate);
    rect(g, cx - 1, SLOT_Y0, 3, SLOT_Y1 - SLOT_Y0 + 1, P.navy); rect(g, cx, SLOT_Y0, 1, SLOT_Y1 - SLOT_Y0 + 1, P.ink);
    cabWear(g, rng, cx);
  }
  return (cabBackdrop.c = c);
}

// pale-green / amber phosphor: how strongly the dials glow, from the scenario's time of day
const cabGlow = () => sim.timePhase === 'Night' ? 1 : sim.timePhase === 'Dusk' ? 0.6 : 0;
let PHOS;
const phos = () => PHOS || (PHOS = { green: haloSprite(32, '170,255,150', 0.55), amber: haloSprite(24, '255,190,90', 0.55), tip: haloSprite(7, '210,255,190', 0.9), tipA: haloSprite(7, '255,200,100', 0.9) });

function cabKnob(g, cx, y, body, hi, rib, shade) {                                // a chunky lever: slider block, collar and a ribbed grip
  const P = PALETTE;
  rect(g, cx - 6, y - 3, 13, 7, P.ink);                                            // the slider riding in the slot
  rect(g, cx - 5, y - 2, 11, 5, P.gray); rect(g, cx - 5, y - 2, 11, 1, P.grayLight); rect(g, cx - 5, y + 2, 11, 1, P.grayDark);
  rect(g, cx - 11, y - 7, 23, 14, P.ink);                                          // heavy outline
  rect(g, cx - 10, y - 6, 21, 12, body);
  rect(g, cx - 10, y - 6, 21, 2, hi); rect(g, cx - 10, y - 6, 1, 12, hi);          // bevelled top and left
  rect(g, cx - 10, y + 4, 21, 2, shade); rect(g, cx + 10, y - 5, 1, 11, shade);    // shaded underside
  for (let k = 0; k < 5; k++) rect(g, cx - 7 + k * 4, y - 3, 1, 6, rib);           // grip ribs
  px(g, cx - 9, y - 5, P.white);                                                   // a glint
}

function drawCab() {
  const g = cctx, P = PALETTE, blink = Math.floor(sim.clock * 3) & 1, D = CONFIG.DRIVE, gl = cabGlow();
  g.setTransform(1, 0, 0, 1, 0, shake.jolt);                                       // the lever's clunk knocks the whole desk
  g.drawImage(cabBackdrop(), 0, 0);
  rect(g, 0, CAB_H, 320, 2, P.greenDeep);
  rect(g, 0, -2, 320, 2, P.grayDark);

  // throttle handle
  cabLabel(g, 'POWER', 160, 13, P.grayLight);
  for (let n = 0; n <= D.NOTCHES; n++) {
    const y = Math.round(THROTTLE_Y(n));
    rect(g, 166, y, 5, 1, n ? P.grayLight : P.red);
    if (n % 2 === 0) drawText(g, String(n), 148, y - 2, P.grayLight);
  }
  { const y = Math.round(THROTTLE_Y(drive.throttle));
    cabKnob(g, LEVER_X.throttle, y, P.red, P.rose, P.rust, P.brownDark); }
  // brake handle
  cabLabel(g, 'BRAKE', 204, 13, P.grayLight);
  ['REL', '1', '2', '3', '4', 'EMG'].forEach((txt, n) => {
    const y = Math.round(BRAKE_Y(n));
    rect(g, 210, y, 5, 1, n === 5 ? P.red : P.grayLight);
    drawText(g, txt, 190, y - 2, n === 5 ? P.red : P.grayLight);
  });
  { const y = Math.round(BRAKE_Y(drive.brake)), emg = drive.brake === 5, set = drive.brake > 0;
    cabKnob(g, LEVER_X.brake, y, emg ? P.red : set ? P.amber : P.grassLight, emg ? P.rose : set ? P.peach : P.white, emg ? P.rust : set ? P.rust : P.green, P.grayDark); }
  // engine key, headlight switch, horn cord
  const E = drive.engine;
  cabLabel(g, 'ENGINE', 251, 15, P.grayLight);
  disc(g, 251, 32, 8, P.grayDark); disc(g, 251, 32, 6, P.ink);
  if (E === 'ON') cabLine(g, 251, 32, 256, 26, P.glow); else if (E === 'OFF') cabLine(g, 251, 32, 246, 26, P.grayLight); else cabLine(g, 251, 32, 258, 32, P.amber);
  cabLabel(g, 'LIGHT', 251, 55, P.grayLight);
  rect(g, 249, 63, 4, 20, P.ink);
  rect(g, 247, drive.headlight ? 63 : 74, 8, 9, drive.headlight ? P.glow : P.grayLight); rect(g, 247, drive.headlight ? 63 : 74, 8, 2, P.white);
  const gy = drive.horn ? 50 : 38;
  rect(g, 296, 9, 1, gy - 9, P.grayLight);
  rect(g, 289, gy, 15, 9, P.ink); rect(g, 290, gy + 1, 13, 7, P.amber); rect(g, 290, gy + 1, 13, 2, P.peach);
  cabLabel(g, 'HORN', 296, 80, P.grayLight);

  // dusk and night: the cabin goes dark, only the dials and lamps keep their own light
  if (gl > 0) { g.globalAlpha = 0.55 * gl; rect(g, 0, 0, 320, CAB_H, P.ink); g.globalAlpha = 1; }

  // what to do next, and the lamps
  const hint = driveHint();
  if (hint) drawText(g, hint, 6, 3, P.glow);
  cabLamp(g, 150, 3, drive.slip && blink, 'red'); drawText(g, 'SLIP', 156, 3, P.grayLight);
  cabLamp(g, 178, 3, drive.grade > 0.5, 'amber'); drawText(g, 'GRADE', 184, 3, P.grayLight);
  cabLamp(g, 214, 3, sim.stopPhase === 'CLEAR', 'grassLight'); drawText(g, 'FLAG', 220, 3, P.grayLight);
  cabLamp(g, 246, 3, drive.over && blink, 'red'); drawText(g, 'SPEED', 252, 3, P.grayLight);
  cabLamp(g, 262, 40, E === 'ON' || (E === 'CRANK' && blink), E === 'ON' ? 'grassLight' : 'amber');
  cabLamp(g, 262, 56, drive.headlight && E !== 'OFF', 'glow');

  // speedometer: pale-green phosphor at dusk and night
  const cx = 50, cy = 54, v = sim.speed, ph = gl > 0;
  const gcol = ph ? { major: P.grassLight, minor: P.green, num: P.grassLight } : {};
  cabDial(g, cx, cy, 37, 120, 10, true, gcol);
  const lim = dialAngle(drive.limit, 120);
  for (let k = -1; k <= 1; k++) cabLine(g, cx + Math.cos(lim + k * 0.03) * 27, cy + Math.sin(lim + k * 0.03) * 27, cx + Math.cos(lim + k * 0.03) * 32, cy + Math.sin(lim + k * 0.03) * 32, P.red);
  const va = dialAngle(v, 120);
  cabNeedle(g, cx, cy, 29, va, drive.over && blink ? P.white : ph ? P.grassLight : P.glow);
  const t = String(Math.round(v));
  drawText2x(g, t, cx - t.length * 4 + 1, cy + 8, ph ? P.grassLight : P.white);
  cabLabel(g, 'KM/H', cx, cy + 21, ph ? P.green : P.grayLight);

  // brake gauge: a hollow needle for where the handle has asked the pressure to be,
  // a solid one for the pressure in the cylinders, lagging behind as the air moves
  const bx = 116, by = 46, want = drive.lever === EB ? D.EMERGENCY : drive.lever < 0 ? -drive.lever * D.BRAKE : 0;
  const tgt = Math.min(1, want / D.EMERGENCY), act = Math.min(1, drive.brakeAcc / D.EMERGENCY);
  cabLabel(g, 'BRAKE', bx, 12, ph ? P.amber : P.grayLight);
  cabDial(g, bx, by, 21, 5, 1, false, ph ? { major: P.glow, minor: P.amber } : {});
  cabNeedleHollow(g, bx, by, 17, dialAngle(5 * tgt, 5), ph ? P.glow : P.white);
  cabNeedle(g, bx, by, 14, dialAngle(5 * act, 5), ph ? P.amber : P.red);
  rect(g, 96, 71, 3, 3, ph ? P.glow : P.white); rect(g, 97, 72, 1, 1, P.ink);       // hollow marker = the set pressure
  drawText(g, 'SET', 100, 71, ph ? P.glow : P.white);
  rect(g, 117, 71, 3, 3, ph ? P.amber : P.red); drawText(g, 'AIR', 121, 71, ph ? P.amber : P.red);

  if (ph) {                                                                         // the phosphor itself: additive halos on the dial faces and needle tips
    const H = phos();
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = 0.5 * gl; g.drawImage(H.green, cx - 32, cy - 32);
    g.globalAlpha = 0.45 * gl; g.drawImage(H.amber, bx - 24, by - 24);
    g.globalAlpha = 0.9 * gl;
    g.drawImage(H.tip, Math.round(cx + Math.cos(va) * 29) - 7, Math.round(cy + Math.sin(va) * 29) - 7);
    g.drawImage(H.tipA, Math.round(bx + Math.cos(dialAngle(5 * act, 5)) * 14) - 7, Math.round(by + Math.sin(dialAngle(5 * act, 5)) * 14) - 7);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
}
