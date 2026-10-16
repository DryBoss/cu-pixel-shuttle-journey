'use strict';
// js/15-ui/panel.js
// Defines: PANEL, COMPLETE_BN, STAR, panelSprites, readBest, sizePanel, panelButton, buildPanel, drawPanel, buttonHit

// "Journey complete" panel with a restart button (normal + hover sprites).
// After a drive it grows a score card: the breakdown, stars, best score.
const PANEL = { w: 172, h: 64 };
const COMPLETE_BN = textMask('যাত্রা সম্পন্ন', CONFIG.BN_SIZE);
const STAR = ['....x....', '...xxx...', 'xxxxxxxxx', '.xxxxxxx.', '..xxxxx..', '.xxx.xxx.', '.xx...xx.'];
let panelSprites = null;

function readBest() {
  try { return +localStorage.getItem('cups-best') || 0; } catch (e) { return 0; }
}

function sizePanel() {
  PANEL.w = drive.final ? 184 : 172;
  PANEL.h = drive.final ? 134 : 64;
}

function panelButton() {
  const bw = textWidth('RESTART TRIP') + 12, bh = 11;
  return { x: (PANEL.w - bw) >> 1, y: PANEL.h - bh - 6, w: bw, h: bh };
}

function buildPanel(hover) {
  sizePanel();
  const { w, h } = PANEL, [c, g] = makeCanvas(w, h), m = COMPLETE_BN, P = PALETTE;
  const first = STATIONS[0], last = STATIONS[LAST_STATION];
  rect(g, 0, 0, w, h, P.slate);
  rect(g, 1, 1, w - 2, h - 2, P.ink);
  const title = 'JOURNEY COMPLETE';
  drawText2x(g, title, (w - title.length * 8 + 2) >> 1, 7, P.glow);
  drawMask(g, m, (w - m.w) >> 1, 21, P.white);
  const route = first.en + ' > ' + last.en + '  ' + (last.km - first.km) + ' KM';
  drawText(g, route, (w - textWidth(route)) >> 1, 25 + m.h, P.grayLight);
  const F = drive.final;
  if (F) {
    const S = drive.pts, y0 = 36 + m.h;
    const rows = [['STOPS', S.stops], ['PUNCTUALITY', S.time], ['PASSENGERS', S.pax],
                  ['COMFORT ' + Math.round(drive.comfort) + '%', F.comfort], ['PENALTIES', Math.round(S.penalty)]];
    rows.forEach(([label, val], i) => {
      drawText(g, label, 14, y0 + i * 8, P.grayLight);
      drawText(g, String(val), w - 14 - textWidth(String(val)), y0 + i * 8, val < 0 ? P.red : P.white);
    });
    const ty = y0 + rows.length * 8 + 2;
    rect(g, 14, ty - 2, w - 28, 1, P.slate);
    drawText(g, 'TOTAL', 14, ty + 1, P.glow);
    drawText2x(g, String(F.total), w - 12 - String(F.total).length * 8, ty - 1, P.glow);
    for (let i = 0; i < 3; i++) stamp(g, STAR, 14 + i * 11, ty + 12, { x: i < F.stars ? P.glow : P.indigo });
    const best = F.record ? 'NEW RECORD!' : 'BEST ' + Math.max(F.best, F.total);
    drawText(g, best, w - 14 - textWidth(best), ty + 13, F.record ? P.glow : P.grayLight);
  }
  const b = panelButton();
  rect(g, b.x, b.y, b.w, b.h, P.grassLight);
  rect(g, b.x + 1, b.y + 1, b.w - 2, b.h - 2, hover ? P.grass : P.green);
  drawText(g, 'RESTART TRIP', b.x + 6, b.y + 3, P.white);
  return c;
}

function drawPanel(g) {
  const y = Math.round(ui.panelY);
  if (y <= -PANEL.h) return;
  panelSprites = panelSprites || [buildPanel(false), buildPanel(true)];
  g.drawImage(panelSprites[ui.hover ? 1 : 0], (W - PANEL.w) >> 1, y);
}

function buttonHit(x, y) {
  if (!ui.complete) return false;
  const b = panelButton(), bx = ((W - PANEL.w) >> 1) + b.x, by = Math.round(ui.panelY) + b.y;
  return x >= bx && x < bx + b.w && y >= by && y < by + b.h;
}
