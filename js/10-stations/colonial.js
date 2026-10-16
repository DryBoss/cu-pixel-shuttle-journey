'use strict';
// js/10-stations/colonial.js
// Defines: colonialBuilding

// Two-storey colonial station block in red brick: arcaded ground floor,
// shuttered upper windows, a pediment with a clock, hipped slate roof
function colonialBuilding(g, p, lit, bx, base, w) {
  const gfTop = base - 27, ufTop = gfTop - 22, cornY = ufTop - 2, rh = 12, roofTop = cornY - rh, cx = bx + (w >> 1), trim = p.cream;
  rect(g, bx, ufTop, w, base - ufTop, p.red);                            // deep red exposed brick
  for (let y = ufTop + 1; y < base - 3; y += 3) rect(g, bx, y, w, 1, p.rust);
  rect(g, bx + w - 3, ufTop, 3, base - ufTop, p.rust);
  rect(g, bx, base - 3, w, 3, p.grayLight);                              // stone plinth
  rect(g, bx, gfTop - 1, w, 1, trim);                                    // cream string course
  rect(g, bx, gfTop, w, 1, p.rust);
  for (let r = 0; r < rh; r++) {                                         // hipped slate roof
    const inset = Math.floor(r * 1.3), x0 = bx - 1 + inset, rw = w + 2 - inset * 2, y = cornY - 1 - r;
    rect(g, x0, y, rw, 1, r === rh - 1 ? p.ink : r % 2 ? p.grayDark : p.gray);
    if (r % 2 === 0) for (let x = x0 + (r % 4); x < x0 + rw; x += 4) px(g, x, y, p.grayDark);
  }
  for (const x of [bx + 38, bx + w - 52]) {                              // chimneys
    rect(g, x, roofTop - 4, 5, 10, p.red);
    rect(g, x - 1, roofTop - 5, 7, 1, p.grayDark);
  }
  rect(g, bx - 1, cornY, w + 2, 2, trim);                                // cream cornice
  rect(g, bx - 1, cornY + 2, w + 2, 1, p.rust);
  const cw = 80, cl = cx - (cw >> 1);                                    // the centre block stands a little proud of the wings
  rect(g, cl, ufTop - 1, cw, base - ufTop + 1, p.red);
  for (let y = ufTop + 1; y < base - 3; y += 3) rect(g, cl, y, cw, 1, p.rust);
  rect(g, cl - 2, ufTop + 1, 2, base - ufTop - 3, p.rust); rect(g, cl + cw, ufTop + 1, 2, base - ufTop - 3, p.brown);
  rect(g, cl - 2, gfTop - 1, cw + 4, 1, trim);
  rect(g, cl - 2, cornY - 1, cw + 4, 2, trim); rect(g, cl - 2, cornY + 1, cw + 4, 1, p.rust);
  for (let r = 0; r < 11; r++) {                                         // triangular pediment
    const hw = 31 - Math.floor(r * 2.8), y = cornY - 2 - r;
    rect(g, cx - hw, y, hw * 2, 1, r === 10 ? trim : p.red);
    px(g, cx - hw, y, trim); px(g, cx + hw - 1, y, trim);
  }
  rect(g, cx - 32, cornY - 2, 64, 1, trim);
  disc(g, cx, cornY - 7, 5, trim); disc(g, cx, cornY - 7, 4, p.white);    // the round station clock
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; px(g, cx + Math.round(Math.cos(a) * 3.4), cornY - 7 + Math.round(Math.sin(a) * 3.4), p.grayDark); }
  cabLine(g, cx, cornY - 7, cx, cornY - 10, p.ink); cabLine(g, cx, cornY - 7, cx + 2, cornY - 6, p.ink);
  if (lit) px(g, cx, cornY - 7, PALETTE.glow);
  const n = Math.floor((w - 8) / 12), start = bx + 4 + (((w - 8) % 12) >> 1), mid = (n - 1) >> 1;
  const dark = lit ? PALETTE.amber : p.brownDark, ay = base - 20;
  for (let i = 0; i < n; i++) {
    const ax = start + i * 12;
    if (i === mid) {                                                     // main entrance and balcony window
      rect(g, ax - 4, ay - 3, 16, 20, trim);
      rect(g, ax - 2, ay - 1, 12, 18, dark);
      ditherRect(g, ax - 2, ay + 8, 12, 9, PALETTE.amber, lit ? 16 : 7);
      rect(g, ax + 3, ay - 1, 2, 18, p.brown);
      rect(g, ax - 2, ufTop + 4, 12, 11, lit ? PALETTE.glow : p.indigo);
      rect(g, ax + 3, ufTop + 4, 2, 11, trim);
      rect(g, ax - 4, ufTop + 4, 2, 11, p.greenDark); rect(g, ax + 10, ufTop + 4, 2, 11, p.greenDark);
      rect(g, ax - 4, ufTop + 15, 16, 1, trim);
      continue;
    }
    rect(g, ax - 1, ay - 1, 10, 18, trim);                                // cream arch surround
    rect(g, ax + 2, ay, 4, 1, dark); rect(g, ax + 1, ay + 1, 6, 1, dark); rect(g, ax, ay + 2, 8, 15, dark);   // tall arched booking window / waiting room
    ditherRect(g, ax, ay + 4, 8, 4, PALETTE.amber, lit ? 16 : 2);         // a warm glow behind the glass, day and night
    ditherRect(g, ax, ay + 8, 8, 4, PALETTE.amber, lit ? 16 : 5);
    ditherRect(g, ax, ay + 12, 8, 5, PALETTE.amber, lit ? 16 : 9);
    px(g, ax + 3, ay - 2, p.rust); px(g, ax + 4, ay - 2, p.rust);
    const wx = ax + 2, wy = ufTop + 4;                                    // upstairs: shuttered rectangular windows
    rect(g, wx - 1, wy - 1, 6, 1, trim);
    rect(g, wx, wy, 4, 11, lit ? PALETTE.glow : p.indigo);
    if (lit) rect(g, wx, wy + 8, 4, 3, PALETTE.amber); else px(g, wx, wy, p.skyLight);
    rect(g, wx - 2, wy, 2, 11, p.greenDark); rect(g, wx + 4, wy, 2, 11, p.greenDark);
    for (let y = wy + 1; y < wy + 11; y += 2) { px(g, wx - 2, y, p.green); px(g, wx + 5, y, p.green); }     // shutter slats
    rect(g, wx - 2, wy + 11, 8, 1, trim);
  }
}
