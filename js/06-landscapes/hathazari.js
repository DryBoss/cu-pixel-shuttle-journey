'use strict';
// js/06-landscapes/hathazari.js
// Defines: ruralMosque, culvert, khalPixel, HATHAZARI_MID, HATHAZARI_FG, hathazariFar, hathazariMid, hathazariFg, hathazariFgColumn, hathazariFgGround, hathazariFgHl

// --- Hathazari: the deep, open countryside between Choudhury Hat and Foteyabad. The same village toolkit
//     (fields, bari, ponds, zebus), tuned wider, quieter and lusher, with khals and culverts, a rare
//     mosque, hints of the University's hills, and a dirt-road crossing ---------------------------------
const HATHAZARI_MID = { fieldW: [90, 260], gap: [150, 380], lush: true, mosque: 0.22 };
const HATHAZARI_FG = { fgFieldW: [120, 300], hay: true, cowStep: [60, 140], fieldCowStep: [70, 190], khals: true, fishers: true };

// A small whitewashed rural mosque: a prayer hall with one simple dome, a green trim, an arched door and a
// slim minaret with a balcony and a loudspeaker
function ruralMosque(g, p, lit, x, base, seed) {
  rect(g, x, base - 9, 18, 9, p.white);
  ditherRect(g, x + 14, base - 9, 4, 9, p.cloudShade, 6); ditherRect(g, x, base - 4, 18, 4, p.cloudShade, 3);        // shaded side, damp at the foot
  rect(g, x - 1, base - 10, 20, 1, p.white); rect(g, x - 1, base - 9, 20, 1, p.cloudShade);
  rect(g, x, base - 8, 18, 1, p.greenDark);                                                                         // green trim band
  rect(g, x, base - 1, 18, 1, p.grayLight);
  for (let r = 0; r < 6; r++) {                                                                                     // the single dome
    const hw = Math.round(5.5 * Math.sqrt(1 - (r / 6) * (r / 6))), y = base - 11 - r;
    rect(g, x + 9 - hw, y, hw * 2, 1, p.white);
    px(g, x + 9 + hw - 1, y, p.cloudShade); if (r > 1) px(g, x + 9 + hw - 2, y, p.cloudShade);
  }
  rect(g, x + 4, base - 11, 10, 1, p.cloudShade);
  rect(g, x + 9, base - 20, 1, 3, p.grayDark); px(g, x + 8, base - 19, p.glow); px(g, x + 10, base - 19, p.glow);     // finial and crescent
  rect(g, x + 7, base - 6, 4, 6, lit ? PALETTE.amber : p.greenDark); px(g, x + 7, base - 6, p.white); px(g, x + 10, base - 6, p.white);   // arched door
  for (const wx of [x + 2, x + 13]) { rect(g, wx, base - 6, 2, 3, lit ? PALETTE.glow : p.greenDark); px(g, wx, base - 6, p.white); }
  const mx = x + 21;                                                                                                // the minaret
  rect(g, mx, base - 23, 3, 23, p.white); rect(g, mx + 2, base - 23, 1, 23, p.cloudShade);
  rect(g, mx - 1, base - 16, 5, 1, p.cloudShade); rect(g, mx - 1, base - 15, 5, 1, p.gray);
  rect(g, mx, base - 19, 3, 1, p.greenDark); rect(g, mx, base - 8, 3, 1, p.greenDark);
  rect(g, mx, base - 25, 3, 2, p.white); px(g, mx + 1, base - 26, p.white); px(g, mx + 1, base - 27, p.glow);
  rect(g, mx - 1, base - 22, 1, 2, p.grayDark);                                                                     // a loudspeaker
}

// A small culvert where a khal passes under the line: a concrete or brick headwall in the embankment with a dark mouth
function culvert(g, p, cx, w, seed) {
  const x = cx - (w >> 1) - 3, bw = w + 6, brick = seed & 1;
  rect(g, x, 12, bw, 5, brick ? p.rust : p.cloudShade);
  if (brick) for (let y = 13; y < 17; y += 2) rect(g, x, y, bw, 1, p.brown);
  else { rect(g, x, 14, bw, 1, p.gray); for (let xx = x + 4; xx < x + bw; xx += 6) rect(g, xx, 12, 1, 5, p.gray); }
  rect(g, x - 1, 11, bw + 2, 1, p.white);                                                                           // coping
  rect(g, cx - (w >> 1) + 1, 13, w - 2, 4, p.ink); px(g, cx - (w >> 1) + 1, 13, brick ? p.rust : p.cloudShade); px(g, cx + (w >> 1) - 2, 13, brick ? p.rust : p.cloudShade);
  for (let xx = cx - (w >> 1) + 2; xx < cx + (w >> 1) - 2; xx++) if (bayer(xx, 16) < 8) px(g, xx, 16, p.skyMid);   // water coming out
  px(g, x, 16, p.greenDark); px(g, x + bw - 1, 16, p.greenDark);
}

// A khal: banks of mud and grass, the sky mirrored in a narrow ribbon of water running across the view
function khalPixel(k, lx, y) {
  const dx = lx - k.cx, hw = k.w / 2;
  if (y < 17) return 'greenDark';                                                // in the embankment, hidden by the culvert
  if (Math.abs(dx) > hw - 1.5) return Math.abs(dx) > hw - 0.5 ? (bayer(lx, y) < 8 ? 'grass' : 'greenDark') : 'brown';
  return bayer(lx + y, y) < 4 ? 'skyLight' : ((y + (lx >> 1)) & 3) === 0 ? 'skyLight' : y < 22 ? 'skyMid' : bayer(lx, y) < 6 ? 'skyDeep' : 'skyMid';
}

function hathazariFar(ctx) {                             // a hazy tree line, and now and then, far behind it, the low dark foothills near the University
  villageFar(ctx);
  const { rng } = ctx;
  for (let x = ctx.from - 60; x < ctx.to; x += randInt(rng, 90, 190)) {
    const t = Math.max(0, Math.min(1, (x - ctx.from) / Math.max(1, ctx.to - ctx.from))), w = randInt(rng, 80, 170), h = randInt(rng, 8, 17), tx = x;
    if (rng() < 0.22 + 0.55 * t && ctx.ok(tx + (w >> 1))) ctx.stat(tx, tx + w, -3, (g, p, lit, ox) => hump(g, tx + ox, 53, w, h, p.greenDark, null, p.haze));
  }
  return { from: ctx.from, to: ctx.to };
}

function hathazariMid(ctx) { return villageMid(ctx, HATHAZARI_MID); }

function hathazariFg(ctx) {
  const D = villageFg(ctx, HATHAZARI_FG);
  return D;
}

function hathazariFgColumn(lx, D) {
  const c = villageFgColumn(lx, D);
  c.khal = D.khals.find(k => Math.abs(lx - k.cx) <= k.w / 2) || null;
  return c;
}
function hathazariFgGround(c, y, lx) { return c.khal && y >= 13 ? khalPixel(c.khal, lx, y) : villageFgGround(c, y, lx); }
function hathazariFgHl(c, y, lx) { return c.khal ? null : villageFgHl(c, y, lx); }
