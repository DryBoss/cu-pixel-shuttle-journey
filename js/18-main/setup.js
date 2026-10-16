'use strict';
// js/18-main/setup.js
// Defines: ctx, (destructured), DITHER_MASKS, VARIANTS

// =====================================================================
// 10. MAIN LOOP
// =====================================================================
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// second buffer for dithered cross-fades between lightings
const [bufB, bctx] = makeCanvas(W, H);
const [scratch, sctx] = makeCanvas(W, H);       // for dithered overlays inside a scene
const [reflectBuf, rctx] = makeCanvas(W, 48);   // rows mirrored in the river under the bridge
const DITHER_MASKS = [];
for (let level = 0; level <= 16; level++) {
  const [c, g] = makeCanvas(4, 4);
  for (let y = 0; y < 4; y++)
    for (let x = 0; x < 4; x++) if (bayer(x, y) < level) px(g, x, y, PALETTE.ink);   // alpha only
  DITHER_MASKS.push(bctx.createPattern(c, 'repeat'));
}

buildTerrain();
buildSchedule();
const VARIANTS = { day: buildVariant('day'), dusk: buildVariant('dusk'), night: buildVariant('night') };
