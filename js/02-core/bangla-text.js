'use strict';
// js/02-core/bangla-text.js
// Defines: BN_FONT, textMask, drawMask

// Bangla: rasterise with a Bengali-capable system font, then threshold
// the alpha to a hard 1-bit mask. The mask is painted in palette colours,
// so the text stays crisp and never introduces off-palette pixels.
const BN_FONT = '"Nirmala UI", Vrinda, "Shonar Bangla", "Kohinoor Bangla", ' +
                '"Bangla Sangam MN", "Noto Sans Bengali", sans-serif';

function textMask(str, size) {
  const [c, g] = makeCanvas(Math.ceil(size * str.length * 1.4) + 8, size * 3);
  g.font = size + 'px ' + BN_FONT;
  g.fillStyle = '#fff';                     // scratch canvas only, never shown
  g.fillText(str, 4, size * 2);
  const cw = c.width, data = g.getImageData(0, 0, cw, c.height).data;
  let x0 = cw, y0 = c.height, x1 = -1, y1 = -1;
  for (let y = 0; y < c.height; y++)
    for (let x = 0; x < cw; x++)
      if (data[(y * cw + x) * 4 + 3] >= 110) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
  if (x1 < 0) return { w: 0, h: 0, bits: new Uint8Array(0) };   // no Bengali font available
  const w = x1 - x0 + 1, h = y1 - y0 + 1, bits = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) bits[y * w + x] = data[((y + y0) * cw + x + x0) * 4 + 3] >= 110 ? 1 : 0;
  return { w, h, bits };
}

function drawMask(g, m, x, y, col) {
  g.fillStyle = col;
  for (let yy = 0; yy < m.h; yy++)
    for (let xx = 0; xx < m.w; xx++) if (m.bits[yy * m.w + xx]) g.fillRect(x + xx, y + yy, 1, 1);
}
