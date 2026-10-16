'use strict';
// js/15-ui/cab-gauges.js
// Defines: cabLine, dialAngle, cabDial, cabNeedle, cabPlate, cabLabel, cabLamp

function cabLine(g, x0, y0, x1, y1, col) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) px(g, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), col);
}
const dialAngle = (v, max) => (135 + 270 * Math.min(1, Math.max(0, v / max))) * Math.PI / 180;

function cabDial(g, cx, cy, r, max, step, numbers) {
  const P = PALETTE;
  disc(g, cx, cy, r, P.slate); disc(g, cx, cy, r - 2, P.navy); disc(g, cx, cy, r - 4, P.ink);
  for (let v = 0; v <= max + 0.01; v += step) {
    const a = dialAngle(v, max), major = Math.round(v / step) % 2 === 0, r0 = r - (major ? 10 : 8), r1 = r - 5;
    cabLine(g, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, major ? P.white : P.grayLight);
    if (major && numbers) {
      const t = String(v);
      drawText(g, t, Math.round(cx + Math.cos(a) * (r - 15) - (t.length * 4 - 1) / 2), Math.round(cy + Math.sin(a) * (r - 15) - 2), P.grayLight);
    }
  }
}
function cabNeedle(g, cx, cy, len, a, col) {
  cabLine(g, cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len, col);
  disc(g, cx, cy, 2, PALETTE.grayLight);
}
function cabPlate(g, x, y, w, h) {
  rect(g, x, y, w, h, PALETTE.navy);
  rect(g, x, y, w, 1, PALETTE.slate); rect(g, x, y + h - 1, w, 1, PALETTE.ink);
  rect(g, x, y, 1, h, PALETTE.slate); rect(g, x + w - 1, y, 1, h, PALETTE.ink);
}
function cabLabel(g, text, cx, y, col) { drawText(g, text, Math.round(cx - (text.length * 4 - 1) / 2), y, col); }
function cabLamp(g, x, y, on, col) {
  rect(g, x - 1, y - 1, 5, 5, PALETTE.ink);
  rect(g, x, y, 3, 3, on ? PALETTE[col] : PALETTE.grayDark);
}
