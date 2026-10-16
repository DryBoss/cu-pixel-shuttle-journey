'use strict';
// js/06-landscapes/colony-layers.js
// Defines: colonyProg, colonyFar, colonyMid, colonyFg, colonyCol, colonyMidGround, colonyFgGround

// --- the old Railway Colony stretch: the closed city loosens up into greener, older housing ------
// Everything here is driven by progress t (0 at the dense city end, 1 at the open suburb of
// Jhawtola): fewer blocks, more quarters, more gaps, more green, more hills, more Jhau trees.
const colonyProg = (ctx, lx) => Math.max(0, Math.min(1, (lx - ctx.from) / Math.max(1, ctx.to - ctx.from)));

function colonyFar(ctx) {                                // the receding city: a jagged skyline with Batali's hills behind it
  const { rng } = ctx, base = 52;
  for (let rank = 0; rank < 2; rank++)                   // low, dark green hill silhouettes (Batali Hill, Tiger Pass), more of them as the city thins
    for (let x = ctx.from - 80; x < ctx.to; ) {
      const t = colonyProg(ctx, x), w = randInt(rng, 70, 170), h = randInt(rng, 10, 18 + Math.round(t * 12)) + (rank ? 0 : 6), tx = x, keep = rng() < 0.15 + t * 0.85;
      if (keep && ctx.ok(tx + (w >> 1))) ctx.stat(tx, tx + w, rank ? -1 : -2, (g, p, lit, ox) => rank ? hump(g, tx + ox, 53, w, h, p.greenDark, p.green, p.haze) : hump(g, tx + ox, 53, w, h, p.haze, null, p.skyMid));
      x += randInt(rng, 40, 110) - Math.round(t * 20);
    }
  for (let rank = 0; rank < 2; rank++)                   // the skyline: uneven, gappy, with the odd tower and set-backs
    for (let x = ctx.from; x < ctx.to; ) {
      const t = colonyProg(ctx, x);
      if (rng() < 0.05 + 0.5 * t) { x += randInt(rng, 6, 22 + Math.round(t * 30)); continue; }
      const w = randInt(rng, 4, 11), tall = rng() < 0.12, tx = x, setback = rng() < 0.3;
      const h = (rank ? randInt(rng, 6, 20) : randInt(rng, 8, 30)) + (tall ? randInt(rng, 8, 16) : 0) - Math.round(t * 6);
      const tank = w > 6 && rng() < 0.25;
      if (ctx.ok(tx)) ctx.stat(tx, tx + w, rank, (g, p, lit, ox) => {
        rect(g, tx + ox, base - h, w, h, p.haze);
        if (!rank) ditherRect(g, tx + ox, base - h, w, h, p.skyMid, 6);
        else if (h > 10) ditherRect(g, tx + ox + 1, base - h + 2, w - 2, h - 3, p.slate, 3);
        if (setback) rect(g, tx + ox + 1, base - h - 3, w - 3, 3, p.haze);
        if (tall) rect(g, tx + ox + (w >> 1), base - h - 6, 1, 6, p.haze);
        if (tank) rect(g, tx + ox + 1, base - h - 2, 3, 2, p.haze);
      });
      x += w + (rng() < 0.2 ? randInt(rng, 1, 3) : 0);
    }
  for (let x = ctx.from + randInt(rng, 20, 60); x < ctx.to; x += randInt(rng, 36, 90)) {   // small hazy Jhau silhouettes, the first hint of Jhawtola
    const t = colonyProg(ctx, x), h = randInt(rng, 12, 22), tx = x, keep = rng() < t * t;
    if (keep && ctx.ok(tx)) ctx.stat(tx - 4, tx + 4, 2, (g, p, lit, ox) => {
      for (let y = 0; y < h; y++) { const hw = 1 + Math.round(y / h * 2.4); rect(g, tx + ox - hw + (y & 1 ? 0 : 1), base - h + y, hw * 2 - 1, 1, y % 3 ? p.greenDark : p.haze); }
    });
  }
  for (let x = ctx.from + randInt(rng, 5, 30); x < ctx.to; ) {                                    // utility poles with drooping wires
    const gap = randInt(rng, 48, 90), ptop = randInt(rng, 18, 28), tx = x, keep = rng() < 0.9 - 0.4 * colonyProg(ctx, x);
    if (keep && ctx.ok(tx)) ctx.stat(tx - 2, tx + gap + 3, 4, (g, p, lit, ox) => {
      for (const px0 of [tx, tx + gap]) { rect(g, px0 + ox, ptop, 1, base - ptop, p.slate); rect(g, px0 + ox - 3, ptop + 1, 7, 1, p.slate); }
      for (let k = 0; k < 3; k++)
        for (let i = 0; i <= gap; i++) px(g, tx + ox + i, ptop + 1 + k * 2 + Math.round(Math.sin(i / gap * Math.PI) * 5), p.slate);
    });
    x += gap;
  }
  return { from: ctx.from, to: ctx.to };
}

function colonyMid(ctx) {
  const { rng, L } = ctx, G = 34;
  for (let row = 0; row < 2; row++)
    for (let x = ctx.from + randInt(rng, 0, 8); x < ctx.to; ) {
      const t = colonyProg(ctx, x), base = G + 2 + (row === 0 ? randInt(rng, 0, 2) : randInt(rng, 6, 9)), kind = rng(), tx = x, seed = randInt(rng, 1, 1e6);
      const pBlock = 0.04 + 0.30 * (1 - t), pQ = pBlock + 0.20 + 0.18 * t, pHouse = pQ + 0.16, pShack = pHouse + 0.03 + 0.12 * (1 - t);
      let w;
      if (kind < pBlock) {                               // a concrete block, fewer and lower as we go
        w = randInt(rng, 12, 20);
        const floors = row === 0 ? randInt(rng, 1, t < 0.5 ? 3 : 2) : randInt(rng, 1, 2), tone = randInt(rng, 0, 2);
        const lamps = Array.from({ length: floors * 6 }, () => rng() < 0.45), tank = rng() < 0.5, ant = rng() < 0.5;
        if (ctx.ok(tx)) {
          ctx.stat(tx - 1, tx + w + 1, base, (g, p, lit, ox) => slumBlock(g, p, lit, tx + ox, base, w, floors, tone, lamps, tank, ant, seed));
          if (rng() < 0.4) ctx.live(clotheslineEnt(tx + 1, tx + w - 1, base - (floors * 7 + 2) - 4, base, rng));
        }
      } else if (kind < pQ) {                            // an old Railway Quarter: long, faded yellow or red brick, tin roof, porch, fenced
        w = randInt(rng, 30, 46);
        const brick = rng() < 0.5, bera = rng() < 0.55, px0 = quartersPorchX(tx, w, seed);
        if (ctx.ok(tx)) {
          ctx.stat(tx - 2, tx + w + 3, base, (g, p, lit, ox) => railwayQuarters(g, p, lit, tx + ox, base, w, brick, seed));
          const fence = (fx, fl) => ctx.stat(fx, fx + fl, base + 1, (g, p, lit, ox) => (bera ? beraFence : wireFence)(g, p, fx + ox, fl, base + 1, seed + 3, bera ? 4 : 5));
          fence(tx - 3, px0 - tx + 1); fence(px0 + 11, tx + w + 3 - (px0 + 11));      // a gap for the gate in front of the porch
        }
      } else if (kind < pHouse) {                        // a bamboo-and-tin house with its bera fence
        w = randInt(rng, 10, 16);
        const tin = rng() < 0.85, on = rng() < 0.6, fence = randInt(rng, 4, 8);
        if (ctx.ok(tx)) ctx.stat(tx - 2, tx + w + fence + 2, base, (g, p, lit, ox) => house(g, tx + ox, base, w, p, tin, lit && on, fence));
        w += fence;
      } else if (kind < pShack) {                        // a makeshift shack, ever rarer
        w = randInt(rng, 8, 14);
        const h = randInt(rng, 6, 9), lamp = rng() < 0.5;
        if (ctx.ok(tx)) ctx.stat(tx - 1, tx + w + 1, base, (g, p, lit, ox) => slumShack(g, p, lit, tx + ox, base, w, h, lamp, seed));
      } else {                                           // greenery between the roofs
        w = 6;
        const r = rng();
        if (ctx.ok(tx)) ctx.live(r < 0.45 ? swayer(L, tx + 3, base, 'coco', randInt(rng, 14, 22), randInt(rng, -2, 2)) : r < 0.8 ? swayer(L, tx + 3, base, 'banana')
                                 : swayer(L, tx + 3, base, 'jhau', randInt(rng, 26, 36), randInt(rng, 0, 5)));
      }
      x += w + randInt(rng, 0, 3 + Math.round(t * 5));
    }
  for (let x = ctx.from + randInt(rng, 10, 60); x < ctx.to; x += randInt(rng, 55, 120)) {      // clumps of vegetation breaking up the buildings
    const t = colonyProg(ctx, x);
    for (let n = randInt(rng, 2, 4), cx = x; n > 0; n--, cx += randInt(rng, 5, 10)) {
      const base = G + 2 + randInt(rng, 0, 12), r = rng(), jh = randInt(rng, 26, 40), ch = randInt(rng, 16, 24), tr = randInt(rng, 0, 5), lean = randInt(rng, -2, 2);
      if (!ctx.ok(cx)) continue;
      if (r < 0.04 + 0.6 * Math.pow(t, 1.5)) ctx.live(swayer(L, cx, base, 'jhau', jh, tr));            // the first few Jhau trees, more and more of them
      else if (r < 0.55) ctx.live(swayer(L, cx, base, 'coco', ch, lean));
      else if (r < 0.82) ctx.live(swayer(L, cx, base, 'banana'));
      else if (r < 0.9) ctx.live(swayer(L, cx, base, 'bamboo', randInt(rng, 14, 20), randInt(rng, 3, 5)));
      else ctx.live(swayer(L, cx, base, 'fern'));
    }
  }
  return { from: ctx.from, to: ctx.to };
}

function colonyFg(ctx) {
  const { rng, L } = ctx;
  for (let x = ctx.from; x < ctx.to; ) {                 // the boundary wall: broken and intermittent, swallowed by creepers
    const t = colonyProg(ctx, x), len = randInt(rng, 12, 44 - Math.round(t * 16)), gap = randInt(rng, 6, 20 + Math.round(t * 36)), tx = x;
    const seed = randInt(rng, 1, 1e6), present = rng() < 0.85 - 0.4 * t, vine = rng() < 0.4 + 0.5 * t;
    if (ctx.ok(tx + (len >> 1))) {
      if (present) {
        ctx.stat(tx, tx + len, 20, (g, p, lit, ox) => brokenWall(g, p, tx + ox, len, 20, seed, t));
        if (vine) ctx.stat(tx - 2, tx + len + 2, 21, (g, p, lit, ox) => vineGrowth(g, p, tx + ox, len, 20, seed + 5, 0.5 + 0.45 * t));
      } else ctx.stat(tx, tx + len, 20, (g, p, lit, ox) => rubble(g, p, tx + ox, len, 20, seed));
    }
    x += len + gap;
  }
  for (let x = ctx.from + randInt(rng, 0, 200); x < ctx.to; ) {      // cycle rickshaws and bicycles on the widening path
    const len = randInt(rng, 220, 480), a = x;
    if (ctx.ok(a + (len >> 1))) {
      for (let n = randInt(rng, 1, 2); n > 0; n--) ctx.live(rng() < 0.55 ? rickshawEnt(a, a + len, randInt(rng, 16, 18), rng, rng() < 0.4) : walkerEnt(a, a + len, randInt(rng, 16, 18), rng));
    }
    x += len + randInt(rng, 40, 200);
  }
  for (let x = ctx.from + randInt(rng, 0, 120); x < ctx.to; ) {      // pedestrians using the line as a footpath, alone or in twos
    const len = randInt(rng, 160, 420), a = x;
    if (ctx.ok(a + (len >> 1))) {
      const y = randInt(rng, 15, 19);
      ctx.live(pedestrianEnt(a, a + len, y, rng));
      if (rng() < 0.4) ctx.live(pedestrianEnt(a + randInt(rng, 6, 16), a + len + randInt(rng, 6, 16), Math.min(19, y + 1), rng));
    }
    x += randInt(rng, 90, 220);
  }
  for (let x = ctx.from + randInt(rng, 0, 20); x < ctx.to; ) {       // tall swaying grass and little ferns, right up to the ballast
    const t = colonyProg(ctx, x), r = rng(), y = randInt(rng, 13, 20);
    if (ctx.ok(x)) {
      if (r < 0.65) ctx.live(swayer(L, x, y, 'grass', y < 15 ? randInt(rng, 5, 8) : randInt(rng, 6, 14), randInt(rng, 0, 3)));
      else ctx.live(swayer(L, x, y, 'fern'));
    }
    x += randInt(rng, 8, Math.round(30 - 14 * t));
  }
  addTufts(ctx, 18, 13, 14, 6);                          // low tufts on the ballast shoulder
  return { from: ctx.from, to: ctx.to };
}

const colonyCol = (lx, D) => D ? Math.max(0, Math.min(1, (lx - D.from) / Math.max(1, D.to - D.from))) : 0;

function colonyMidGround(t, y, lx) {
  if (y < 34) return null;
  const g = 0.12 + 0.55 * t, n = hash2(lx >> 2, y >> 1);
  if (y === 34) return hash2(lx >> 1, 34) < 0.2 + 0.5 * t ? 'greenDark' : bayer(lx, y) < 8 ? 'brown' : 'brownDark';
  if (n < g) { const k = hash2(lx, y); return k < 0.35 ? 'greenDark' : k < 0.8 ? 'grass' : 'grassLight'; }
  return hash2(lx >> 1, y) < 0.22 ? 'brownDark' : hash2(lx, y + 5) < 0.14 ? 'tan' : 'brown';
}

function colonyFgGround(t, y, lx) {                      // rows 12..20: ballast edge, a widening dirt path, grass; 21+: the near verge
  if (y < 12) return null;
  if (y === 12) return bayer(lx, y) < 9 ? 'gray' : 'grayDark';
  const k = hash2(lx, y), gr = 0.18 + 0.5 * t;
  if (y === 13) return k < 0.04 ? 'white' : k < gr ? (hash2(lx >> 1, 13) < 0.5 ? 'greenDark' : 'grass') : k < 0.6 ? 'brownDark' : 'ink';
  if (y <= 19) {
    if (y === 15 && hash2(lx >> 4, 15) < 0.5 * (1 - t)) return lx % 24 < 3 ? 'grayLight' : 'ink';           // the open drain, fading out
    if ((y === 14 || y === 19) && k < gr * 0.7) return k < gr * 0.3 ? 'grassLight' : 'grass';               // grass fringe either side of the path
    if (y >= 17 && y <= 18 && hash2(lx >> 3, y) < 0.35) return 'brown';                                      // wheel ruts
    return k < 0.06 ? 'cream' : k < 0.3 ? 'brown' : k < 0.45 ? 'brownDark' : 'tan';
  }
  if (y === 20) return k < gr + 0.2 ? (k < 0.1 ? 'grassLight' : 'greenDark') : 'brownDark';
  if (hash2(lx >> 2, y >> 1) < 0.25 + 0.6 * t) return k < 0.03 ? 'white' : k < 0.3 ? 'greenDark' : k < 0.75 ? 'grass' : 'grassLight';
  return k < 0.03 ? 'red' : k < 0.2 ? 'brownDark' : k < 0.35 ? 'tan' : 'brown';
}
