'use strict';
// js/02-core/primitives.js
// Defines: rect, px, disc, ditherRect, stamp, wrapX, drawTiled, hexToRgb

function rect(g, x, y, w, h, col) {
  g.fillStyle = col;
  g.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function px(g, x, y, col) {
  g.fillStyle = col;
  g.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

// Filled pixel circle built from horizontal spans (no anti-aliasing)
function disc(g, cx, cy, r, col) {
  cx = Math.floor(cx); cy = Math.floor(cy);
  g.fillStyle = col;
  for (let dy = -r; dy <= r; dy++) {
    const hw = Math.floor(Math.sqrt((r + 0.5) * (r + 0.5) - dy * dy));
    g.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
  }
}

// Ordered-dither fill: paints pixels whose Bayer value is below level (0..16)
function ditherRect(g, x, y, w, h, col, level) {
  g.fillStyle = col;
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++)
      if (bayer(xx, yy) < level) g.fillRect(xx, yy, 1, 1);
}

// Paint a character template: each char maps to a colour (or is skipped)
function stamp(g, tpl, x, y, colors) {
  for (let r = 0; r < tpl.length; r++)
    for (let c = 0; c < tpl[r].length; c++) {
      const col = colors[tpl[r][c]];
      if (col) px(g, x + c, y + r, col);
    }
}

// Run a draw call at -tw, 0 and +tw so shapes wrap across a tile seam
function wrapX(tw, fn) { fn(-tw); fn(0); fn(tw); }

// Repeat a pre-rendered tile across the screen at a scroll offset
function drawTiled(g, tile, offset, y) {
  const tw = tile.width;
  for (let x = -(((Math.floor(offset) % tw) + tw) % tw); x < W; x += tw) g.drawImage(tile, x, y);
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
