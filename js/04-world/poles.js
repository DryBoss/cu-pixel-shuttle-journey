'use strict';
// js/04-world/poles.js
// Defines: buildPoles

// --- 5a. telegraph poles with sagging wires (1.0x) --------------------
function buildPoles(p) {
  const TW = 192, TH = 56, SPACING = 96, TOP = 6, FOOT = 51, SAG = 5;
  const [c, g] = makeCanvas(TW, TH);
  for (let x = 48; x < TW; x += SPACING) {
    for (const ax of [-4, 5]) {                                         // catenary to the next pole
      for (let i = 0; i <= SPACING; i++) {
        const t = i / SPACING, y = TOP + Math.round(SAG * 4 * t * (1 - t));
        wrapX(TW, o => px(g, x + ax + i + o, y, p.grayDark));
      }
    }
    rect(g, x, TOP, 2, FOOT - TOP, p.brown);
    rect(g, x + 1, TOP, 1, FOOT - TOP, p.brownDark);
    rect(g, x - 4, TOP + 1, 10, 1, p.brownDark);                        // cross-arm
    px(g, x - 4, TOP, p.cloudShade);
    px(g, x + 5, TOP, p.cloudShade);                                    // insulators
  }
  return c;
}
