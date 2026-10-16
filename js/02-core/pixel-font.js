'use strict';
// js/02-core/pixel-font.js
// Defines: FONT, glyphCache, glyph, drawText, textWidth, drawText2x

// 3x5 bitmap font (rows top to bottom) for the debug overlay and signs
const FONT = {
  ' ': '000 000 000 000 000', '.': '000 000 000 000 010', ':': '000 010 000 010 000',
  '-': '000 000 111 000 000', '/': '001 001 010 100 100', '>': '100 010 001 010 100',
  '!': '010 010 010 000 010', '+': '000 010 111 010 000', '%': '101 001 010 100 101',
  '[': '110 100 100 100 110', ']': '011 001 001 001 011',
  '↑': '010 111 010 010 010', '↓': '010 010 010 111 010',
  '←': '010 100 111 100 010', '→': '010 001 111 001 010',
  '0': '111 101 101 101 111', '1': '010 110 010 010 111', '2': '111 001 111 100 111',
  '3': '111 001 011 001 111', '4': '101 101 111 001 001', '5': '111 100 111 001 111',
  '6': '111 100 111 101 111', '7': '111 001 010 010 010', '8': '111 101 111 101 111',
  '9': '111 101 111 001 111',
  A: '010 101 111 101 101', B: '110 101 110 101 110', C: '011 100 100 100 011',
  D: '110 101 101 101 110', E: '111 100 110 100 111', F: '111 100 110 100 100',
  G: '011 100 101 101 011', H: '101 101 111 101 101', I: '111 010 010 010 111',
  J: '001 001 001 101 010', K: '101 101 110 101 101', L: '100 100 100 100 111',
  M: '101 111 111 101 101', N: '110 101 101 101 101', O: '010 101 101 101 010',
  P: '110 101 110 100 100', Q: '010 101 101 110 011', R: '110 101 110 101 101',
  S: '011 100 010 001 110', T: '111 010 010 010 010', U: '101 101 101 101 111',
  V: '101 101 101 101 010', W: '101 101 111 111 101', X: '101 101 010 101 101',
  Y: '101 101 010 010 010', Z: '111 001 010 100 111',
};

const glyphCache = new Map();
function glyph(ch, col) {
  const key = ch + col;
  let c = glyphCache.get(key);
  if (!c) {
    const bits = (FONT[ch] || FONT[' ']).replace(/ /g, '');
    let g;
    [c, g] = makeCanvas(3, 5);
    g.fillStyle = col;
    for (let i = 0; i < 15; i++) if (bits[i] === '1') g.fillRect(i % 3, (i / 3) | 0, 1, 1);
    glyphCache.set(key, c);
  }
  return c;
}

function drawText(g, str, x, y, col) {
  str = String(str).toUpperCase();
  for (let i = 0; i < str.length; i++)
    if (str[i] !== ' ') g.drawImage(glyph(str[i], col), x + i * 4, y);
}
const textWidth = s => s.length * 4 - 1;

// Same font at 2x: glyphs are scaled by drawImage with smoothing off
function drawText2x(g, str, x, y, col) {
  str = String(str).toUpperCase();
  for (let i = 0; i < str.length; i++)
    if (str[i] !== ' ') g.drawImage(glyph(str[i], col), x + i * 8, y, 6, 10);
}
