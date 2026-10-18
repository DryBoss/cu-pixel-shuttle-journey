'use strict';
// js/10-stations/cantt-flora.js
// Defines: rainTree, hedgeRow, canttBarracksLong

// A huge old rain tree of the Cantonment: a thick short trunk and a very wide, neat dome of crown,
// full and dense, lit from the upper left. (cx, base) = foot of the trunk, rw = half-width of the
// dome, rh = its height above the springing line cy
function rainTree(g, p, cx, base, rw, rh, seed, cy = base - 6) {
  const rng = mulberry32(seed);
  rect(g, cx - 2, cy - 2, 5, base - cy + 2, p.brownDark); rect(g, cx - 2, cy - 2, 1, base - cy + 2, p.brown);   // thick trunk
  rect(g, cx - 3, base - 2, 7, 2, p.brownDark);                                                               // flared roots
  for (let h = 0; h <= rh; h++) {                                                                             // the dome, row by row from the flat underside up
    const hw = Math.round(rw * Math.sqrt(1 - (h / rh) * (h / rh)) + (hash2(h, seed & 255) - 0.5) * 2.4), y = cy - h;
    for (let x = -hw; x <= hw; x++) {
      const u = x / rw, v = h / rh, light = -u * 0.45 + v * 0.55 + (hash2((x + 99) >> 1, y + seed) - 0.5) * 0.35;
      px(g, cx + x, y, h < 2 ? p.greenDeep : light > 0.72 ? (rng() < 0.3 ? p.grass : p.green) : light > 0.38 ? p.green : light > 0.1 ? p.greenDark : (bayer(x, y) < 8 ? p.greenDeep : p.greenDark));
    }
  }
  for (let i = 0; i < rw * 2; i++) {                                                                          // leaf clumps, a touch of sun on the left
    const x = Math.round(cx - rw * 0.8 + rng() * rw * 1.3), y = cy - 2 - Math.floor(rng() * (rh - 3));
    if (((x - cx) / rw) ** 2 + ((cy - y) / rh) ** 2 < 0.8) { px(g, x, y, p.grass); px(g, x + 1, y, p.green); px(g, x, y + 1, p.greenDark); }
  }
}

// A perfectly straight, low, square-clipped hedge: a flat top, a plumb face, clipped lines, a clean
// shadow underneath. The face spans rows base-h+1 .. base-1
function hedgeRow(g, p, x, len, base, h) {
  rect(g, x, base - h, len, 1, p.grass);
  rect(g, x, base - h + 1, len, h - 1, p.greenDark);
  for (let y = base - h + 2; y < base; y += 2) for (let xx = x + (y & 2); xx < x + len; xx += 4) px(g, xx, y, p.green);   // clipped texture
  rect(g, x, base - h, 1, h, p.greenDeep); rect(g, x + len - 1, base - h, 1, h, p.greenDeep);                 // squared-off ends
  rect(g, x, base, len, 1, p.greenDeep);
}

// A long, low, single-storey barrack: pristine white walls, a dark green tin roof, and a neat row
// of identical square windows. Wall rows are base-wallH .. base-1
function canttBarracksLong(g, p, lit, x, base, w, wallH = 13) {
  const top = base - wallH;
  rect(g, x, top, w, wallH, p.white);
  rect(g, x, base - 3, w, 3, p.cloudShade);                                                                    // plinth
  rect(g, x, top, w, 1, p.cloudShade);                                                                         // shadow under the eaves
  for (let wx = x + 5; wx + 4 <= x + w - 4; wx += 9) {
    if ((wx - x - 5) / 9 % 6 === 5) { rect(g, wx, base - 8, 4, 8, p.greenDark); rect(g, wx, base - 8, 4, 1, p.greenDeep); continue; }   // a door every sixth bay
    rect(g, wx - 1, top + 3, 6, 6, p.cloudShade);
    rect(g, wx, top + 4, 4, 4, lit ? PALETTE.amber : p.indigo);
    rect(g, wx + 2, top + 4, 1, 4, p.cloudShade); rect(g, wx, top + 6, 4, 1, p.cloudShade);
    if (lit) px(g, wx, top + 4, PALETTE.glow);
  }
  for (let r = 0; r < 6; r++) {                                                                                // corrugated dark green roof, overhanging the walls
    const y = top - 1 - r, x0 = x - 3 + r, rw = w + 6 - 2 * r;
    rect(g, x0, y, rw, 1, p.greenDark);
    for (let xx = x0 + (r & 1); xx < x0 + rw; xx += 3) px(g, xx, y, p.greenDeep);
    if (r === 5) rect(g, x0, y, rw, 1, p.greenDeep);
    else if (r === 0) rect(g, x0, y, rw, 1, p.green);
  }
}
