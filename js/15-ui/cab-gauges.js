'use strict';
// js/15-ui/cab-gauges.js
// Defines: cabLine, dialAngle, cabDial, cabNeedle, cabNeedleHollow, cabPlate, cabLabel, cabLamp

function cabLine(g, x0, y0, x1, y1, col) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) px(g, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), col);
}
const dialAngle = (v, max) => (135 + 270 * Math.min(1, Math.max(0, v / max))) * Math.PI / 180;

// cols (optional): { major, minor, num } tick and number colours - the phosphor glow at dusk and night
function cabDial(g, cx, cy, r, max, step, numbers, cols = {}) {
  const P = PALETTE, cMajor = cols.major || P.white, cMinor = cols.minor || P.grayLight, cNum = cols.num || P.grayLight;
  disc(g, cx, cy, r, P.slate); disc(g, cx, cy, r - 2, P.navy); disc(g, cx, cy, r - 4, P.ink);
  for (let v = 0; v <= max + 0.01; v += step) {
    const a = dialAngle(v, max), major = Math.round(v / step) % 2 === 0, r0 = r - (major ? 10 : 8), r1 = r - 5;
    cabLine(g, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, major ? cMajor : cMinor);
    if (major && numbers) {
      const t = String(v);
      drawText(g, t, Math.round(cx + Math.cos(a) * (r - 15) - (t.length * 4 - 1) / 2), Math.round(cy + Math.sin(a) * (r - 15) - 2), cNum);
    }
  }
}
function cabNeedle(g, cx, cy, len, a, col) {
  cabLine(g, cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len, col);
  disc(g, cx, cy, 2, PALETTE.grayLight);
}
// An outlined needle: two parallel lines with the dial face showing between them
function cabNeedleHollow(g, cx, cy, len, a, col) {
  const dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx, tx = cx + dx * len, ty = cy + dy * len;
  cabLine(g, cx + nx * 1.4, cy + ny * 1.4, tx + nx * 0.6, ty + ny * 0.6, col);
  cabLine(g, cx - nx * 1.4, cy - ny * 1.4, tx - nx * 0.6, ty - ny * 0.6, col);
  cabLine(g, tx + nx * 0.6, ty + ny * 0.6, tx - nx * 0.6, ty - ny * 0.6, col);
  disc(g, cx, cy, 2, PALETTE.grayLight);
}
// A heavy steel plate bolted to the console: bevelled edges and a rivet in each corner
function cabPlate(g, x, y, w, h) {
  const P = PALETTE;
  rect(g, x, y, w, h, P.grayDark);
  rect(g, x, y, w, 1, P.gray); rect(g, x, y, 1, h, P.gray);
  rect(g, x, y + h - 1, w, 1, P.ink); rect(g, x + w - 1, y, 1, h, P.ink);
  rect(g, x + 1, y + h - 2, w - 2, 1, P.navy); rect(g, x + w - 2, y + 1, 1, h - 2, P.navy);
  for (const [rx, ry] of [[x + 2, y + 2], [x + w - 3, y + 2], [x + 2, y + h - 3], [x + w - 3, y + h - 3]]) { px(g, rx, ry, P.grayLight); px(g, rx + 1, ry + 1, P.ink); }
}
function cabLabel(g, text, cx, y, col) { drawText(g, text, Math.round(cx - (text.length * 4 - 1) / 2), y, col); }
function cabLamp(g, x, y, on, col) {
  rect(g, x - 1, y - 1, 5, 5, PALETTE.ink);
  rect(g, x, y, 3, 3, on ? PALETTE[col] : PALETTE.grayDark);
}
