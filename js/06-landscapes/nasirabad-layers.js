'use strict';
// js/06-landscapes/nasirabad-layers.js
// Defines: nasirabadProg, nasirabadFar, nasirabadMid, nasirabadFg, nasirabadCol, nasirabadMidGround, nasirabadFgGround

// --- Nasirabad and the 2 No. Gate: the quiet institutional walls give way to the hyper-dense
//     commercial zone, and the railway itself starts to widen into the Sholosohor yard. ------------
const nasirabadProg = (ctx, lx) => Math.max(0, Math.min(1, (lx - ctx.from) / Math.max(1, ctx.to - ctx.from)));

function nasirabadFar(ctx) {                             // a dense, smoggy skyline of water tanks and cell towers
  const { rng } = ctx, base = 52;
  for (let rank = 0; rank < 2; rank++)
    for (let x = ctx.from; x < ctx.to; ) {
      const w = randInt(rng, 4, 12), tall = rng() < 0.1, h = (rank ? randInt(rng, 8, 24) : randInt(rng, 14, 38)) + (tall ? 10 : 0), tx = x;
      const tank = w > 5 && rng() < 0.4, r = randInt(rng, 3, 5), shed = rng() < 0.2;
      if (ctx.ok(tx)) ctx.stat(tx, tx + w, rank, (g, p, lit, ox) => {
        rect(g, tx + ox, base - h, w, h, p.haze);
        if (!rank) ditherRect(g, tx + ox, base - h, w, h, p.skyMid, 6);
        else if (h > 10) ditherRect(g, tx + ox + 1, base - h + 2, w - 2, h - 3, p.slate, 3);
        if (tank) rooftopTank(g, p, tx + ox + 1, base - h, r);
        else if (shed) rect(g, tx + ox + 1, base - h - 2, 3, 2, p.haze);
      });
      x += w;
    }
  for (let x = ctx.from + randInt(rng, 20, 60); x < ctx.to; x += randInt(rng, 90, 180)) {       // cell towers, each with a single blinking red pixel on top
    const h = randInt(rng, 46, 62), tx = x, phase = rng();
    if (ctx.ok(tx)) {
      ctx.stat(tx - 3, tx + 4, 6, (g, p, lit, ox) => cellTower(g, p, tx + ox, base - 20, h - 20));
      ctx.live(blinkingBeacon(tx, base - h - 1, phase));
    }
  }
  for (let x = ctx.from + randInt(rng, 30, 90); x < ctx.to; x += randInt(rng, 140, 260)) {      // billboards in the haze
    const bw = randInt(rng, 16, 24), bh = randInt(rng, 8, 11), top = randInt(rng, 6, 14), tx = x;
    if (ctx.ok(tx)) ctx.stat(tx, tx + bw, 3, (g, p, lit, ox) => slumBillboard(g, p, tx + ox, top, bw, bh, base));
  }
  for (let x = ctx.from; x < ctx.to; x += 64) {                                                  // smog and dust, thicker than the clean Khulshi air
    const tx = x; ctx.stat(tx, tx + 66, 8, (g, p, lit, ox) => smogBand(g, p, tx + ox, 66, base));
  }
  return { from: ctx.from, to: ctx.to };
}

function nasirabadMid(ctx) {                             // three ranks of commercial blocks shoulder to shoulder, billboards on stilts over them
  const { rng, L } = ctx, G = 34;
  for (let row = 0; row < 3; row++)
    for (let x = ctx.from + randInt(rng, 0, 8); x < ctx.to; ) {
      const base = G + 2 + (row === 0 ? randInt(rng, 0, 2) : row === 1 ? randInt(rng, 5, 8) : randInt(rng, 11, 14)), kind = rng(), tx = x, seed = randInt(rng, 1, 1e6);
      let w;
      if (kind < 0.14) {                                 // a leftover shack
        w = randInt(rng, 8, 14);
        const h = randInt(rng, 6, 9), lamp = rng() < 0.5;
        if (ctx.ok(tx)) ctx.stat(tx - 1, tx + w + 1, base, (g, p, lit, ox) => slumShack(g, p, lit, tx + ox, base, w, h, lamp, seed));
      } else if (kind < 0.96) {                          // a concrete commercial block, three to five floors up front
        w = randInt(rng, 16, 28);
        const floors = row === 0 ? randInt(rng, 3, 5) : randInt(rng, 2, 4);
        if (ctx.ok(tx)) ctx.stat(tx - 1, tx + w + 1, base, (g, p, lit, ox) => commercialBlock(g, p, lit, tx + ox, base, w, floors, seed));
      } else {                                           // a lone palm squeezed between them
        w = 6;
        if (ctx.ok(tx)) ctx.live(swayer(L, tx + 3, base, 'coco', randInt(rng, 13, 19), randInt(rng, -2, 2)));
      }
      x += w;
    }
  for (let x = ctx.from + randInt(rng, 20, 60); x < ctx.to; x += randInt(rng, 70, 140)) {       // 2 No. Gate's big billboards on tall iron stilts
    const w = randInt(rng, 26, 36), h = randInt(rng, 13, 17), tx = x, base = G + 2 + randInt(rng, 8, 12), kind = randInt(rng, 0, 5), seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx)) ctx.stat(tx, tx + w, base + 4, (g, p, lit, ox) => billboardStilts(g, p, lit, tx + ox, base, w, h, kind, seed));
  }
  return { from: ctx.from, to: ctx.to };
}

function nasirabadFg(ctx) {
  const { rng, L } = ctx;
  for (let x = ctx.from - 20; x < ctx.to; x += 60) {                                             // signal cables along the ballast, never quite continuous
    const tx = x, len = randInt(rng, 70, 120), seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx + 30)) ctx.stat(tx, tx + len, 13, (g, p, lit, ox) => cableRun(g, p, tx + ox, len, seed));
  }
  const from = ctx.from + 40, to = ctx.to - 40;                                                  // the disused siding peels off and drifts away from the main line
  for (let x = from; x < to; x += 32) {
    const tx = x, len = 33, seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx + 16)) ctx.stat(tx, tx + len, 16, (g, p, lit, ox) => rustySideTrack(g, p, tx + ox, len, from, to, 15, 24, seed));
  }
  for (let x = ctx.from + randInt(rng, 20, 90); x < ctx.to; x += randInt(rng, 110, 230)) {       // discarded wooden sleepers
    const tx = x, y = randInt(rng, 18, 28), seed = randInt(rng, 1, 1e6);
    if (ctx.ok(tx)) ctx.stat(tx, tx + 14, y, (g, p, lit, ox) => sleeperPile(g, p, tx + ox, y, seed));
  }
  const labels = ['KM6', 'KM7', 'KM8'];
  for (let x = ctx.from + randInt(rng, 60, 160), i = 0; x < ctx.to; x += randInt(rng, 520, 780), i++) {   // concrete mileage markers
    const tx = x, lab = labels[i % labels.length];
    if (ctx.ok(tx)) ctx.stat(tx, tx + 14, 14, (g, p, lit, ox) => mileageMarker(g, p, tx + ox, 17, lab));
  }
  for (let x = ctx.from + randInt(rng, 0, 150); x < ctx.to; x += randInt(rng, 260, 520)) {       // the odd rickshaw and walker on the path below the siding
    const len = randInt(rng, 200, 400), a = x;
    if (ctx.ok(a + (len >> 1))) ctx.live(rng() < 0.6 ? rickshawEnt(a, a + len, randInt(rng, 26, 29), rng, rng() < 0.4) : walkerEnt(a, a + len, randInt(rng, 26, 29), rng));
  }
  addTufts(ctx, 20, 13, 14, 4);
  return { from: ctx.from, to: ctx.to };
}

const nasirabadCol = (lx, D) => D ? Math.max(0, Math.min(1, (lx - D.from) / Math.max(1, D.to - D.from))) : 0;

function nasirabadMidGround(t, y, lx) {                  // hard-packed, dusty, dark: no greenery to speak of
  if (y < 34) return null;
  const k = hash2(lx, y);
  return y === 34 ? (bayer(lx, y) < 8 ? 'brownDark' : 'ink') : k < 0.3 ? 'brownDark' : k < 0.5 ? 'grayDark' : k < 0.6 ? 'ink' : k < 0.66 ? 'tan' : 'brown';
}

function nasirabadFgGround(t, y, lx) {                   // dark gravel, dust and cinders, wider and darker the nearer the yard
  if (y < 12) return null;
  if (y === 12) return bayer(lx, y) < 9 ? 'gray' : 'grayDark';
  const k = hash2(lx, y), dark = 0.35 + 0.3 * t;
  if (y <= 26) return k < dark ? (k < dark * 0.45 ? 'ink' : 'grayDark') : k < dark + 0.18 ? 'brownDark' : k < dark + 0.26 ? 'gray' : k < 0.95 ? 'brown' : 'greenDark';
  return k < 0.25 ? 'brownDark' : k < 0.4 ? 'tan' : k < 0.5 ? 'grayDark' : k < 0.97 ? 'brown' : 'greenDark';
}
