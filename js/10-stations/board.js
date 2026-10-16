'use strict';
// js/10-stations/board.js
// Defines: buildBoard

// Yellow name board on two posts: Bangla above English
function buildBoard(p, st) {
  const m = st.bnMask, ew = textWidth(st.en);
  const bw = Math.max(m.w, ew) + 8, bh = m.h + 13, h = 160 - BOARD_TOP;
  const [c, g] = makeCanvas(bw, h);
  for (const x of [3, bw - 5]) { rect(g, x, bh, 2, h - bh, p.grayDark); rect(g, x, bh, 1, h - bh, p.gray); }
  rect(g, 0, 0, bw, bh, p.ink);
  rect(g, 1, 1, bw - 2, bh - 2, p.glow);
  drawMask(g, m, (bw - m.w) >> 1, 3, p.ink);
  drawText(g, st.en, (bw - ew) >> 1, m.h + 6, p.ink);
  return c;
}
