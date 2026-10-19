'use strict';
// js/15-ui/title.js
// Defines: TITLE, TITLE_OPTS, TITLE_HITS, buildTitle, drawTitle, titleHit, beginTrip

// --- title card: WATCH the journey or DRIVE it ------------------------------
const TITLE = { w: 208, h: 100, y: 38, bn: textMask('বটতলী থেকে চবি', CONFIG.BN_SIZE), sprite: null, best: readBest() };
const TITLE_OPTS = [['WATCH', 'SIT BACK AND ENJOY'], ['DRIVE', 'YOU ARE THE DRIVER']];
const TITLE_HITS = TITLE_OPTS.map(() => ({ x: 0, y: 0, w: 80, h: 15 }));

function buildTitle() {
  const { w, h, bn } = TITLE, [c, g] = makeCanvas(w, h), P = PALETTE;
  rect(g, 0, 0, w, h, P.slate);
  rect(g, 1, 1, w - 2, h - 2, P.ink);
  rect(g, 1, h - 2, w - 2, 1, P.green);
  const t = 'CU PIXEL SHUTTLE';
  drawText2x(g, t, (w - t.length * 8 + 2) >> 1, 6, P.glow);
  drawMask(g, bn, (w - bn.w) >> 1, 20, P.white);
  const route = STATIONS.map(s => s.code).join('-') + '   ' + STATIONS[LAST_STATION].km + ' KM';
  drawText(g, route, (w - textWidth(route)) >> 1, 23 + bn.h, P.grayLight);
  const keys = 'E ENGINE  W/S POWER  A/D BRAKE  H HORN';
  drawText(g, keys, (w - textWidth(keys)) >> 1, h - 19, P.slate);
  const foot = '←→ CHOOSE   ENTER START' + (TITLE.best ? '   BEST ' + TITLE.best : '');
  drawText(g, foot, (w - textWidth(foot)) >> 1, h - 11, P.grayLight);
  return c;
}

function drawTitle(g) {
  const x0 = (W - TITLE.w) >> 1, y0 = TITLE.y, P = PALETTE;
  g.drawImage(TITLE.sprite || (TITLE.sprite = buildTitle()), x0, y0);
  for (let i = 0; i < TITLE_OPTS.length; i++) {
    const [label, sub] = TITLE_OPTS[i], r = TITLE_HITS[i], sel = ui.titleSel === i;
    r.x = x0 + 16 + i * 96; r.y = y0 + 48;
    rect(g, r.x, r.y, r.w, r.h, sel ? P.glow : P.slate);
    rect(g, r.x + 1, r.y + 1, r.w - 2, r.h - 2, sel ? (i ? P.green : P.blue) : P.navy);
    drawText2x(g, label, r.x + ((r.w - label.length * 8 + 2) >> 1), r.y + 3, sel ? P.white : P.grayLight);
    drawText(g, sub, r.x + ((r.w - textWidth(sub)) >> 1), r.y + 19, sel ? P.white : P.gray);
  }
}

function titleHit(x, y) {
  for (let i = 0; i < TITLE_HITS.length; i++) {
    const r = TITLE_HITS[i];
    if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return i;
  }
  return -1;
}

// Leave the title card: AUTO cranks the engine and carries on as before;
// DRIVE leaves the engine cold for the driver
function beginTrip(driving) {
  if (!ui.title) return;
  ui.title = false;
  if (driving) { setDriveMode(true); resetDrive(); }
  else if (drive.engine === 'OFF') startEngine();
  announceScenario();                                    // SCENARIO: MONSOON DUSK ...
  syncButtons();
}
