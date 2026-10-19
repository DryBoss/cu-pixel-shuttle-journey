'use strict';
// js/06-landscapes/burg-layers.js
// Defines: burgProg, cuProg, cuFarHills, villageFarCU, burgFar, burgMid, burgFg, burgMidGround, burgFgGround

// --- the last stretch into Chittagong University. There is no deep forest here: it stays open countryside
// (the same 'village' terrain as Chowdhury Hat, see villageFarCU) while the CU hills grow and darken far away,
// then, about 1000 scaled px from the terminus, it turns into the packed 'burg' of the campus outskirts:
// rows of shops and tin-roofed stalls close against the ballast on BOTH sides, plastered with posters,
// and students and vendors thronging the dirt paths.

// How far along the burg itself we are in this layer's coordinates: 0 at its start .. 1 at the terminus
function burgProg(ctx, lx) {
  const L = ctx.L, a = lxOf(L, TERRAIN[TERRAIN.length - 1].u), b = lxOf(L, STATIONS[LAST_STATION].dist);
  return Math.max(0, Math.min(1, (lx - a) / Math.max(1, b - a)));
}
// How far along the whole approach: 0 at the start of the open countryside after Foteyabad .. 1 at the terminus
function cuProg(L, lx) {
  const a = lxOf(L, STATIONS[LAST_STATION - 1].dist + 300 * SCALE), b = lxOf(L, STATIONS[LAST_STATION].dist);
  return Math.max(0, Math.min(1, (lx - a) / Math.max(1, b - a)));
}

// The hills far behind the fields: a low hazy swell at first, then bigger and darker silhouettes the closer
// the campus gets. Painted per column, with the colour stepping haze -> dark green -> deep green by dithering.
function cuFarHills(ctx) {
  const { rng, L } = ctx, base = 53, start = lxOf(L, STATIONS[LAST_STATION - 1].dist + 300 * SCALE) - 120;
  for (let rank = 0; rank < 2; rank++)
    for (let x = start; x < L.lx1; ) {
      const t = cuProg(L, x), k = rank ? 0.6 : 1;
      const w = Math.round((70 + 190 * Math.pow(t, 0.85)) * (0.8 + rng() * 0.45) * (rank ? 0.75 : 1));
      const h = Math.max(5, Math.round((7 + 45 * Math.pow(t, 1.15)) * (0.75 + rng() * 0.5) * k)), hx = x;
      ctx.stat(hx, hx + w, rank ? -3 : -5, (g, p, lit, ox) => {
        const cols = [p.haze, p.greenDark, p.greenDeep];
        for (let i = 0; i < w; i++) {
          const X = hx + ox + i;
          if (X < -1 || X > CHUNK_W) continue;
          const top = humpTop(i, w, h, base);
          if (top >= base) continue;
          const pos = Math.min(1.999, cuProg(L, hx + i) * 2 * (rank ? 0.85 : 1)), c0 = pos | 0, f = pos - c0;
          for (let y = top; y < base; y++) {
            let col = bayer(hx + i, y) < f * 16 ? cols[c0 + 1] : cols[c0];
            if (y - top < 5 && pos < 1 && bayer(hx + i, y) < 6 - (y - top)) col = p.skyMid;           // distant haze along the ridge
            else if (pos > 0.7 && hash2((hx + i) >> 1, y >> 1) < 0.1 * pos) col = p.greenDeep;       // dense jungle texture on the near hills
            px(g, X, y, col);
          }
        }
      });
      x += Math.round(w * (rank ? 0.5 : 0.42) + rng() * w * 0.2);
    }
}

// Open countryside, exactly like Chowdhury Hat's, with the CU hills rising behind it
function villageFarCU(ctx) {
  villageFar(ctx);
  cuFarHills(ctx);
}

// A hazy skyline of low campus blocks and tin sheds in front of the hills, thickening towards the terminus
function burgFar(ctx) {
  const { rng } = ctx, base = 52;
  for (let x = ctx.from; x < ctx.to; x += randInt(rng, 5, 16)) {
    const t = burgProg(ctx, x);
    if (rng() > 0.15 + 0.85 * t) continue;
    const w = randInt(rng, 5, 12), h = randInt(rng, 4, 8 + Math.round(10 * t)), tx = x;
    if (ctx.ok(tx)) ctx.stat(tx, tx + w, 2, (g, p, lit, ox) => {
      rect(g, tx + ox, base - h, w, h, p.haze); ditherRect(g, tx + ox, base - h, w, h, p.skyMid, 5);
      if (h > 7) for (let wy = base - h + 2; wy < base - 2; wy += 3) for (let wx = tx + ox + 1; wx < tx + ox + w - 1; wx += 3) px(g, wx, wy, lit ? PALETTE.glow : p.slate);
    });
  }
}

// MID layer (behind the line): a back rank of concrete blocks and tall tin-roofed shops, shoulder to shoulder, and in
// front of it, hard against the ballast, a rank of small shops, stalls and tongs with posters on every wall
function burgMid(ctx) {
  const { rng, L } = ctx, G = 34, folk = burgFolk(rng);
  const backKinds = ['copy', 'food', 'tin', 'mobile', 'book'], frontKinds = ['copy', 'food', 'book', 'mobile', 'tin', 'tea', 'tea', 'food'];
  for (let x = ctx.from; x < ctx.to; ) {                                    // the back rank
    const t = burgProg(ctx, x), w = randInt(rng, 14, 26), tx = x, seed = randInt(rng, 1, 1e6), base = G + 6 + randInt(rng, 0, 3), kind = rng();
    x += w + Math.round(rng() * 30 * (1 - t) * (1 - t));
    if (rng() > 0.4 + 0.6 * t) {                                           // early on, the odd palm or a bare plot instead
      if (ctx.ok(tx) && rng() < 0.5) ctx.live(swayer(L, tx + (w >> 1), base, 'coco', randInt(rng, 13, 19), randInt(rng, -2, 2)));
      continue;
    }
    if (!ctx.ok(tx + (w >> 1))) continue;
    if (kind < 0.6) {                                                       // a concrete block of two to four floors, sometimes with a tuition banner on its roof
      const floors = randInt(rng, 2, 4), banner = rng() < 0.3, top = base - (10 + (floors - 1) * 7 + 2), bk = randInt(rng, 0, 5);
      ctx.stat(tx - 1, tx + w + 1, base, (g, p, lit, ox) => { commercialBlock(g, p, lit, tx + ox, base, w, floors, seed); if (banner && w > 16) adBoard(g, p, tx + ox + 2, top - 11, w - 4, 9, bk, seed); });
    } else {                                                                // a tall tin-roofed shop
      const k = backKinds[Math.floor(rng() * backKinds.length)], wh = randInt(rng, 13, 18);
      ctx.stat(tx - 2, tx + w + 2, base, (g, p, lit, ox) => burgShop(g, p, lit, tx + ox, base, w, k, seed, wh));
    }
  }
  for (let x = ctx.from; x < ctx.to; ) {                                    // the front rank, close to the ballast
    const t = burgProg(ctx, x), w = randInt(rng, 12, 20), tx = x, seed = randInt(rng, 1, 1e6), base = G + 19 + randInt(rng, 0, 1);
    x += w;
    const gap = Math.round(rng() * 22 * (1 - t) * (1 - t) * (1 - t));
    if (rng() > 0.3 + 0.7 * t) { x += gap; continue; }
    if (!ctx.ok(tx + (w >> 1))) continue;
    const kind = frontKinds[Math.floor(rng() * frontKinds.length)], tw = kind === 'tea' ? randInt(rng, 11, 15) : w;
    ctx.live(burgShopEnt(tx, base, tw, kind, seed, rng() < 0.7));
    if (rng() < 0.6) {                                                      // a poster-plastered fence between this shop and the next
      const fw = randInt(rng, 4, 9);
      ctx.stat(x, x + fw, base, (g, p, lit, ox) => posterFence(g, p, x + ox, base, fw, seed + 7));
      x += fw;
    }
    x += gap;
  }
  for (let x = ctx.from; x < ctx.to; ) {                                    // the crowd on the dirt path between the shops and the track
    const t = burgProg(ctx, x);
    x += Math.round(randInt(rng, 14, 40) * (1.6 - 1.2 * t));
    if (!ctx.ok(x)) continue;
    const y = G + randInt(rng, 21, 24), r = rng();
    if (r < 0.5) {                                                          // students strolling, in twos and threes
      for (let n = randInt(rng, 1, 3), k = 0; k < n; k++) { const a = x + k * 5, len = randInt(rng, 25, 70); ctx.live(folkEnt(a, a + len, y + (k & 1), pick(rng, folk.students), 3 + rng() * 3, rng() * 30)); }
    } else if (r < 0.7) {                                                   // vendors with trays, kettles and papers, working the path
      const a = x, len = randInt(rng, 30, 80); ctx.live(folkEnt(a, a + len, y, pick(rng, folk.vendors), 3 + rng() * 2, rng() * 30));
    } else if (r < 0.9) {                                                   // a knot of students chatting, one with a glass of tea
      for (let n = randInt(rng, 2, 4), k = 0; k < n; k++) ctx.live(standEnt(x + k * 6, y + (k & 1), pick(rng, folk.students), k & 1 ? -1 : 1, k === 0 && rng() < 0.6, rng() * 3));
    } else {                                                                // a rickshaw or a bicycle picking its way along
      const len = randInt(rng, 110, 190), a = x; ctx.live(rickshawEnt(a, a + len, G + 24, rng, rng() < 0.4));
    }
  }
  return { from: ctx.from, to: ctx.to };
}

// FOREGROUND (the near side of the line): low stalls and tin shacks, fences thick with posters, and walkers on the path
function burgFg(ctx) {
  const { rng } = ctx, folk = burgFolk(rng), kinds = ['copy', 'food', 'tin', 'tea', 'tea', 'mobile', 'food'];
  for (let x = ctx.from; x < ctx.to; ) {                                    // near-side fences, tight against the ballast
    const t = burgProg(ctx, x), fw = randInt(rng, 10, 26), tx = x, seed = randInt(rng, 1, 1e6);
    x += fw + Math.round(rng() * 40 * (1 - t));
    if (ctx.ok(tx) && rng() < 0.3 + 0.5 * t) ctx.stat(tx, tx + fw, 20, (g, p, lit, ox) => posterFence(g, p, tx + ox, 20, fw, seed));
  }
  for (let x = ctx.from; x < ctx.to; ) {                                    // low shops and stalls right at the path
    const t = burgProg(ctx, x), w = randInt(rng, 11, 17), tx = x, seed = randInt(rng, 1, 1e6), y = 21 + randInt(rng, 0, 2);
    x += w + Math.round(rng() * 60 * (1 - t) * (1 - t)) + 2;
    if (rng() > 0.25 + 0.75 * t || !ctx.ok(tx + (w >> 1))) continue;
    const kind = kinds[Math.floor(rng() * kinds.length)], tw = kind === 'tea' ? randInt(rng, 11, 15) : w;
    ctx.live(burgShopEnt(tx, y, tw, kind, seed, rng() < 0.6, randInt(rng, 8, 10)));
  }
  for (let x = ctx.from; x < ctx.to; ) {                                    // walkers: students, vendors, locals on the near-side path
    const t = burgProg(ctx, x);
    x += Math.round(randInt(rng, 10, 30) * (1.5 - 1.1 * t));
    if (!ctx.ok(x)) continue;
    const y = randInt(rng, 23, 31), r = rng(), a = x, len = randInt(rng, 30, 75);
    if (r < 0.55) ctx.live(folkEnt(a, a + len, y, pick(rng, folk.students), 4 + rng() * 4, rng() * 30));
    else if (r < 0.75) ctx.live(folkEnt(a, a + len, y, pick(rng, folk.vendors), 3 + rng() * 3, rng() * 30));
    else if (r < 0.9) ctx.live(folkEnt(a, a + len, y, pick(rng, folk.locals), 2 + rng() * 2, rng() * 30));
    else for (let n = randInt(rng, 2, 3), k = 0; k < n; k++) ctx.live(standEnt(x + k * 6, y + (k & 1), pick(rng, folk.students), k & 1 ? -1 : 1, false, 0));
  }
  addTufts(ctx, 60, 14, 22, 3);
  return { from: ctx.from, to: ctx.to };
}

function burgMidGround(c, y, lx) {                      // concrete forecourts and drains behind the shops, then trodden dust right up to the ballast
  if (y < 34) return null;
  const k = hash2(lx, y);
  if (y < 48) return k < 0.4 ? 'grayDark' : k < 0.75 ? 'gray' : k < 0.9 ? 'brown' : 'tan';
  return k < 0.45 ? 'tan' : k < 0.7 ? 'brown' : k < 0.82 ? 'grayLight' : k < 0.94 ? 'brownDark' : 'cream';
}

function burgFgGround(c, y, lx) {                       // the near-side dirt path, scuffed by a thousand sandals
  if (y < 12) return null;
  if (y === 12) return bayer(lx, y) < 9 ? 'gray' : 'grayDark';
  const k = hash2(lx, y);
  if (y < 24) return k < 0.12 ? 'brownDark' : k < 0.2 ? 'cream' : k < 0.5 ? 'brown' : 'tan';
  return k < 0.3 ? 'brownDark' : k < 0.4 ? 'gray' : 'brown';
}
