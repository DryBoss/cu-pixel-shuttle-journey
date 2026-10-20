'use strict';
// js/10-stations/cantt-flora.js
// Defines: rainTree, hedgeRow, canttBarracksLong, canttStationHouse, canttLowWall

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

// A low whitewashed boundary wall with square piers: the line between the station's lawn and the railway.
// The wall face spans rows base-h .. base-1
function canttLowWall(g, p, x, len, base, h = 4) {
  rect(g, x, base - h, len, h, p.white);
  rect(g, x, base - h, len, 1, p.cloudShade);                                                                  // coping shadow line
  rect(g, x, base - 1, len, 1, p.cloudShade);
  for (let xx = x; xx < x + len; xx += 14) { rect(g, xx, base - h - 2, 3, h + 2, p.white); rect(g, xx + 2, base - h - 2, 1, h + 2, p.cloudShade); rect(g, xx, base - h - 2, 3, 1, p.grayLight); }   // piers with caps
}

// The Cantonment station building: a long single-storey whitewashed house with an arcaded verandah, a projecting
// porch under a pediment with a round clock, a deep-green tin hip roof, a name board and a flag. (x, base) = left
// foot of the building and the ground row; w = width. The central porch is centred on the building.
function canttStationHouse(g, p, lit, x, base, w) {
  const wallH = 19, top = base - wallH, cx = x + (w >> 1), amber = lit ? PALETTE.amber : p.indigo;
  rect(g, x, top, w, wallH, p.cream);                                                                          // warm whitewash
  rect(g, x, top, w, 1, p.tan);                                                                                // shadow under the eaves
  rect(g, x, base - 3, w, 3, p.cloudShade); rect(g, x, base - 3, w, 1, p.grayLight);                            // plinth
  for (let xx = x; xx < x + w; xx++) if (bayer(xx, top + 1) < 6) px(g, xx, top + 1, p.tan);
  // the verandah arcade: round-headed openings between slim white piers
  for (let ax = x + 6; ax + 9 <= x + w - 6; ax += 14) {
    if (Math.abs(ax + 4 - cx) < 24) continue;                                                                  // the porch stands here
    rect(g, ax, top + 6, 9, 11, p.brownDark);                                                                  // deep shadow of the verandah
    rect(g, ax + 1, top + 5, 7, 1, p.brownDark); rect(g, ax + 2, top + 4, 5, 1, p.brownDark);                  // the arch head
    rect(g, ax + 2, top + 9, 5, 7, amber); rect(g, ax + 4, top + 9, 1, 7, p.brown);                            // a shuttered door/window behind
    if (lit) rect(g, ax + 2, top + 9, 5, 1, PALETTE.glow);
    rect(g, ax - 2, top + 3, 2, 14, p.white); rect(g, ax + 9, top + 3, 2, 14, p.white);                        // piers
    rect(g, ax - 2, top + 3, 13, 1, p.white); rect(g, ax - 2, top + 2, 13, 1, p.cloudShade);                    // the beam over them
  }
  // the hip roof, deep green corrugated tin
  for (let r = 0; r < 8; r++) {
    const y = top - 1 - r, x0 = x - 4 + r * 2, rw = w + 8 - 4 * r;
    if (rw <= 0) break;
    rect(g, x0, y, rw, 1, p.greenDark);
    for (let xx = x0 + (r & 1); xx < x0 + rw; xx += 3) px(g, xx, y, p.greenDeep);
    if (r === 0) rect(g, x0, y, rw, 1, p.green);
  }
  rect(g, x + 8, top - 10, 2, 3, p.brownDark); rect(g, x + 7, top - 11, 4, 1, p.gray);                          // a chimney
  rect(g, x + w - 24, top - 10, 2, 3, p.brownDark); rect(g, x + w - 25, top - 11, 4, 1, p.gray);
  // the projecting porch with its pediment
  const pw = 40, px0 = cx - (pw >> 1), ptop = top - 7;
  rect(g, px0, ptop, pw, wallH + 7, p.white);
  rect(g, px0, ptop, 1, wallH + 7, p.cloudShade); rect(g, px0 + pw - 1, ptop, 1, wallH + 7, p.cloudShade);
  rect(g, px0 - 2, base - 3, pw + 4, 3, p.cloudShade);
  rect(g, cx - 7, top + 3, 14, 14, p.brownDark); rect(g, cx - 6, top + 2, 12, 1, p.brownDark); rect(g, cx - 4, top + 1, 8, 1, p.brownDark);   // the big arched entrance
  rect(g, cx - 5, top + 6, 10, 11, amber); rect(g, cx, top + 6, 1, 11, p.brown);
  if (lit) { rect(g, cx - 5, top + 6, 10, 1, PALETTE.glow); }
  for (let k = 0; k < 4; k++) rect(g, px0 + 2 + k * 9, top + 17 - (k & 1 ? 0 : 0), 1, 1, p.cloudShade);
  for (let r = 0; r < 8; r++) {                                                                                // the pediment: a shallow gable
    const rw = pw + 4 - r * 5;
    if (rw <= 0) break;
    rect(g, cx - (rw >> 1), ptop - 1 - r, rw, 1, r === 0 ? p.cloudShade : p.white);
  }
  rect(g, cx - (pw >> 1) - 2, ptop, pw + 4, 1, p.cloudShade);
  disc(g, cx, ptop - 4, 4, p.cloudShade); disc(g, cx, ptop - 4, 3, p.white);                                  // the round clock
  rect(g, cx, ptop - 6, 1, 3, p.ink); rect(g, cx, ptop - 4, 2, 1, p.ink);
  // name board across the porch
  rect(g, cx - 22, ptop + 4, 44, 8, p.greenDark); rect(g, cx - 22, ptop + 4, 44, 1, p.green); rect(g, cx - 22, ptop + 11, 44, 1, p.greenDeep);
  drawText(g, 'CANTONMENT', cx - 20, ptop + 5, p.white);
  // flagpole over the pediment with the red-and-green flag
  rect(g, cx, ptop - 22, 1, 12, p.grayLight);
  rect(g, cx + 1, ptop - 22, 9, 6, p.green); disc(g, cx + 5, ptop - 19, 2, p.red);
}
