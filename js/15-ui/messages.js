'use strict';
// js/15-ui/messages.js
// Defines: drawHint, drawToasts, drawPopups

function drawHint(g) {
  const s = driveHint();
  if (!s) return;
  const w = textWidth(s) + 8, x = (W - w) >> 1, y = 20;
  hudBox(g, x, y, w, 11);
  drawText(g, s, x + 4, y + 3, PALETTE.glow);
}

function drawToasts(g) {
  const b = bannerCache[ui.bannerSt];                   // under the HUD, or under the banner while it shows
  let y = b && ui.bannerY > -b.height ? Math.max(50, Math.round(ui.bannerY) + b.height + 3) : 50;
  for (let i = toasts.length - 1; i >= 0; i--) {
    const t = toasts[i], h = t.big ? 16 : 11, w = (t.big ? t.text.length * 8 - 2 : textWidth(t.text)) + 10, x = (W - w) >> 1;
    const yy = y - Math.round(Math.max(0, 1 - t.t / 0.15) * 6);      // pops in from above
    g.globalAlpha = Math.max(0, Math.min(1, (TOAST_LIFE - t.t) / 0.4));
    hudBox(g, x, yy, w, h);
    (t.big ? drawText2x : drawText)(g, t.text, x + 5, yy + 3, PALETTE[t.col]);
    g.globalAlpha = 1;
    y += h + 2;
  }
}

function drawPopups(g) {
  for (let i = 0; i < popPool.n; i++) {
    const q = popPool.items[i], x = q.x - (textWidth(q.text) >> 1), y = Math.round(q.y - q.t * 12);
    drawText(g, q.text, x + 1, y + 1, PALETTE.ink);
    drawText(g, q.text, x, y, PALETTE[q.col]);
  }
}
