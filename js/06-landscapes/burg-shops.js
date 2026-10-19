'use strict';
// js/06-landscapes/burg-shops.js
// Defines: burgPoster, posterFence, burgShop, teaTong, burgFolk, folkEnt, standEnt, burgShopEnt

// --- the university town's trackside bazaar: photocopy shops, snack stalls, tea 'tongs' under tin roofs,
// fences plastered with political posters, tuition ads and graffiti, and the students who crowd between them.
const SHOP_WALLS = ['cream', 'tan', 'cloudShade', 'white', 'peach', 'skyLight', 'paddy'];
const SIGN_COLS = ['red', 'blue', 'green', 'orange', 'purple', 'rose', 'skyDeep'];
const POSTER_COLS = ['red', 'white', 'glow', 'skyMid', 'rose', 'orange', 'grassLight', 'purple', 'paddy', 'blue'];

// One poster: a political leaflet with a face, a tuition ad, a flag-striped banner or a notice
function burgPoster(g, p, x, y, w, h, rng) {
  const bg = POSTER_COLS[Math.floor(rng() * POSTER_COLS.length)], kind = Math.floor(rng() * 4);
  rect(g, x, y, w, h, p[bg]);
  if (kind === 0) { rect(g, x + 1, y + 1, w - 2, 2, p.white); rect(g, x + 1, y + h - 3, w - 2, 1, p.ink); rect(g, x + 1, y + h - 2, w - 3, 1, p.grayDark); }       // tuition ad: big headline, small print
  else if (kind === 1) { rect(g, x + (w >> 1) - 1, y + 1, 3, 3, p.tan); px(g, x + (w >> 1), y + 1, p.ink); rect(g, x + 1, y + h - 3, w - 2, 1, p.white); rect(g, x + 1, y + h - 2, w - 2, 1, p.ink); }   // a candidate's face
  else if (kind === 2) for (let i = 0; i < w - 2; i += 2) rect(g, x + 1 + i, y + 1, 1, h - 2, (i >> 1) & 1 ? p.white : p.ink);                                      // a striped banner
  else { rect(g, x + 1, y + 1, w - 2, 1, p.ink); for (let yy = y + 3; yy < y + h - 1; yy += 2) rect(g, x + 1, yy, w - 2 - (yy & 1), 1, p.white); }                // a notice
  px(g, x + w - 1, y + h - 1, p.gray);                                                                                                                              // a torn corner
}

// A fence or wall between two shops, plastered with overlapping posters and scrawled with graffiti
function posterFence(g, p, x, base, w, seed) {
  const rng = mulberry32(seed), fh = randInt(rng, 9, 12), top = base - fh, kind = Math.floor(rng() * 3);
  if (kind === 0) {                                                                                   // corrugated tin sheets
    for (let i = 0; i < w; i++) rect(g, x + i, top, 1, fh, i & 1 ? p.grayLight : p.gray);
    ditherRect(g, x, top, w, fh, p.rust, 2); rect(g, x, top, w, 1, p.grayDark);
  } else if (kind === 1) {                                                                            // old brick
    rect(g, x, top, w, fh, p.rust);
    for (let y = top; y < base; y += 2) { rect(g, x, y, w, 1, p.brownDark); for (let i = (y >> 1) & 1 ? 0 : 2; i < w; i += 4) px(g, x + i, y + 1, p.brownDark); }
    rect(g, x - 1, top - 1, w + 2, 1, p.gray);
  } else {                                                                                            // whitewash gone grey
    rect(g, x, top, w, fh, p.cloudShade); ditherRect(g, x, top, w, fh, p.grayLight, 4); rect(g, x, top, w, 1, p.white);
  }
  ditherRect(g, x, base - 3, w, 3, p.brownDark, 4);
  for (let k = 0, n = 2 + (w > 6 ? 2 : 0); k < n; k++)                                                // overlapping posters
    burgPoster(g, p, x + randInt(rng, -1, Math.max(0, w - 5)), top + 1 + randInt(rng, 0, fh - 8), randInt(rng, 4, 6), randInt(rng, 5, 7), rng);
  const gy = top + randInt(rng, 2, fh - 3), gc = [p.red, p.ink, p.blue, p.white][Math.floor(rng() * 4)];   // graffiti: a wobbly tag and a slogan
  for (let i = 0; i < Math.min(w, 9); i++) px(g, x + i, gy + ((i * 5) & 1), gc);
}

// A shop with an open front under a tin roof. kind: 'copy' | 'food' | 'book' | 'mobile' | 'tin'
function burgShop(g, p, lit, x, base, w, kind, seed, wallH) {
  if (kind === 'tea') return teaTong(g, p, lit, x, base, w, seed);
  const rng = mulberry32(seed), wh = wallH || randInt(rng, 9, 12), top = base - wh, wall = p[SHOP_WALLS[Math.floor(rng() * SHOP_WALLS.length)]];
  rect(g, x, top, w, wh, wall); ditherRect(g, x, top, w, wh, p.cloudShade, 2);
  ditherRect(g, x + w - 3, top, 3, wh, p.grayDark, 4);
  ditherRect(g, x, base - 3, w, 3, p.brown, 4);                                                       // dirt thrown up at the foot
  for (let i = 0; i < w / 5; i++) { const sx = x + randInt(rng, 1, w - 2), sl = randInt(rng, 2, wh - 3); for (let j = 0; j < sl; j++) px(g, sx, top + 1 + j, p.gray); }   // rain streaks
  const sc = p[kind === 'copy' ? 'blue' : kind === 'book' ? 'green' : SIGN_COLS[Math.floor(rng() * SIGN_COLS.length)]];
  rect(g, x, top + 1, w, 4, sc); rect(g, x, top + 1, w, 1, p.ink);                                       // the sign band
  const word = kind === 'copy' ? 'COPY' : kind === 'food' ? 'FOOD' : kind === 'book' ? 'BOOK' : kind === 'mobile' ? 'MOBILE' : '';
  if (word && textWidth(word) <= w - 2) drawText(g, word, x + ((w - textWidth(word)) >> 1), top, p.white);
  else for (let sx = x + 2; sx < x + w - 2; sx += 2) px(g, sx, top + 3, p.white);
  const bx = x + 2, bw = w - 4, by = top + 5;
  rect(g, bx, by, bw, base - by - 3, lit ? PALETTE.amber : p.ink);                                       // the open front
  if (lit) rect(g, bx + 1, by + 1, bw - 2, 2, PALETTE.glow);
  if (kind === 'copy') {                                                                              // a photocopier, paper reams, a green LED
    rect(g, bx + 1, base - 7, 6, 4, p.cloudShade); rect(g, bx + 1, base - 7, 6, 1, p.white); px(g, bx + 5, base - 6, p.grassLight);
    for (let i = 0; i < bw - 9; i += 2) rect(g, bx + 8 + i, base - 6, 2, 3, i & 2 ? p.white : p.cream);
  } else if (kind === 'food') {                                                                       // pots and a frying pan, hanging snacks
    for (let i = 0; i + 4 <= bw; i += 5) { rect(g, bx + i, base - 6, 4, 3, p.grayLight); rect(g, bx + i, base - 6, 4, 1, p.white); }
    for (let i = 1; i < bw - 1; i += 3) px(g, bx + i, by, p.orange);
  } else if (kind === 'book') {                                                                       // shelves of coloured spines, a stack of guides
    for (let i = 0; i < bw; i++) rect(g, bx + i, by + 1, 1, 3, p[POSTER_COLS[(i * 3 + seed) % POSTER_COLS.length]]);
    rect(g, bx, by + 4, bw, 1, p.brown);
  } else if (kind === 'mobile') {                                                                     // glowing handset boards and recharge cards
    for (let i = 0; i + 2 <= bw; i += 3) { rect(g, bx + i, by + 1, 2, 3, lit ? PALETTE.glow : p.skyMid); px(g, bx + i, by + 1, p.white); }
    for (let i = 1; i < bw - 2; i += 4) rect(g, bx + i, base - 6, 3, 2, p[['red', 'orange', 'green'][i % 3]]);
  } else {                                                                                            // a general tin shop: sacks and jars
    for (let i = 0; i + 3 <= bw; i += 4) { rect(g, bx + i, base - 6, 3, 3, p.cream); px(g, bx + i, base - 6, p.tan); }
    for (let i = 1; i + 2 <= bw; i += 5) { rect(g, bx + i, by + 1, 2, 2, p.skyLight); }
  }
  if (rng() < 0.35) { rect(g, bx, by, bw, 2, p.gray); for (let sx = bx; sx < bx + bw; sx += 2) px(g, sx, by + 1, p.grayDark); }   // a rolling shutter half down
  rect(g, bx - 1, base - 3, bw + 2, 3, p.brown); rect(g, bx - 1, base - 3, bw + 2, 1, p.tan);            // the counter
  const tin = [[p.rust, p.brown, p.orange], [p.grayLight, p.gray, p.cloudShade], [p.skyMid, p.blue, p.skyLight]][Math.floor(rng() * 3)];   // the tin roof, overhanging
  for (let r = 0; r < 4; r++) {
    const rx = x - 2 + r, rw = w + 4 - 2 * r, ry = top - 1 - r;
    for (let i = 0; i < rw; i++) px(g, rx + i, ry, ((rx + i) & 1) ? tin[0] : tin[1]);
    if (r === 0) rect(g, rx, ry + 1, rw, 1, p.ink);
    else for (let i = 0; i < rw; i += 3) px(g, rx + i, ry, tin[2]);
  }
  if (rng() < 0.4) { rect(g, x + 2 + randInt(rng, 0, w - 8), top - 7, 2, 3, p.grayDark); }                // a stove flue
  if (rng() < 0.45) {                                                                                 // a tuition banner strung across the front
    const bw2 = Math.min(w, randInt(rng, 9, 14)), ty = top + 6;
    rect(g, x + w - bw2, ty - 6, bw2, 3, [p.red, p.glow, p.green, p.white][Math.floor(rng() * 4)]); rect(g, x + w - bw2 + 1, ty - 5, bw2 - 2, 1, p.ink);
  }
}

// A tea 'tong': bamboo posts, a tarpaulin or tin lean-to, a glowing clay stove and kettle, bananas, jars, a bench
function teaTong(g, p, lit, x, base, w, seed) {
  const rng = mulberry32(seed), tarp = [['red', 'white'], ['blue', 'white'], ['green', 'cream'], ['orange', 'white']][Math.floor(rng() * 4)];
  rect(g, x + 1, base - 10, 1, 10, p.paddy); rect(g, x + w - 2, base - 10, 1, 10, p.paddy);              // bamboo posts
  rect(g, x + 1, base - 10, 1, 10, p.tan); px(g, x + 1, base - 5, p.brownDark); px(g, x + w - 2, base - 5, p.brownDark);
  rect(g, x + 2, base - 9, w - 4, 6, p.brownDark);                                                      // the dim back wall
  for (let i = -1; i < w + 1; i++) rect(g, x + i, base - 12, 1, 3, ((i + 2) >> 1) & 1 ? p[tarp[1]] : p[tarp[0]]);   // striped tarpaulin roof
  for (let i = -1; i < w + 1; i += 2) px(g, x + i, base - 9, p[tarp[0]]);
  rect(g, x - 1, base - 13, w + 2, 1, p.ink);
  rect(g, x + 3, base - 4, 5, 2, p.rust); px(g, x + 4, base - 3, PALETTE.amber); px(g, x + 5, base - 3, PALETTE.glow); px(g, x + 6, base - 3, PALETTE.red);   // clay stove
  rect(g, x + 4, base - 7, 3, 3, p.grayLight); rect(g, x + 5, base - 8, 1, 1, p.gray); px(g, x + 7, base - 6, p.grayLight);                                  // the kettle
  if (lit) glowHalo(g, x + 5, base - 3, 2, 6, 5);
  for (let bxx = x + 9; bxx < x + w - 3; bxx += 3) { rect(g, bxx, base - 9, 1, 1, p.brown); rect(g, bxx - 1, base - 8, 3, 3, p.paddy); px(g, bxx - 1, base - 8, p.glow); }   // hanging bananas
  rect(g, x + 2, base - 3, w - 4, 3, p.brown); rect(g, x + 2, base - 3, w - 4, 1, p.tan);                // counter
  for (let jx = x + 9; jx + 2 < x + w - 2; jx += 4) { rect(g, jx, base - 5, 2, 2, p.skyLight); px(g, jx, base - 5, p.red); }                                 // jars of biscuits
  rect(g, x - 2, base - 2, w + 4, 1, p.brownDark);                                                      // a long plank bench out front
  if (w >= 13) { const sx = x + ((w - 11) >> 1); rect(g, sx - 1, base - 19, 13, 6, p.red); rect(g, sx - 1, base - 19, 13, 1, p.ink); drawText(g, 'TEA', sx + 1, base - 18, p.white); }   // the hand-painted sign above
}

// A small pool of people shared by every walker, so sprites are cached once and reused: mostly students
function burgFolk(rng) {
  const folk = { students: [], locals: [], vendors: [] };
  for (let i = 0; i < 14; i++) folk.students.push(makeStudentDesign(rng));
  for (let i = 0; i < 4; i++) { const d = makeDesign(rng, pick(rng, ['lungi', 'lungi', 'elder'])); d.carry = null; folk.locals.push(d); }
  for (let i = 0; i < 5; i++) { const d = makeDesign(rng, i % 3 === 2 ? 'hawker' : 'vendor'); if (d.kind === 'vendor') d.carry = pick(rng, ['kettle', 'papers', 'tray']); folk.vendors.push(d); }
  return folk;
}

// Someone walking to and fro along the dirt path beside the line, a few layer-px at a time
function folkEnt(a, b, y, d, sp, ph) {
  const len = Math.max(8, b - a);
  return { x0: a - 8, x1: b + 8, z: y, warm: v => personSprite(v, d, 0, 1), draw(g, v, ox, oy, t) {
    const s = (t * sp + ph) % (2 * len), fwd = s < len, x = a + (fwd ? s : 2 * len - s);
    g.drawImage(personSprite(v, d, Math.floor(t * 5 + ph) & 3, fwd ? 1 : -1), Math.round(x) + ox - PERSON_CX, Math.round(y) + oy - PERSON_FY);
  } };
}

// Someone standing about: chatting in a knot, or sipping tea at a stall (frames 5 and 6 raise a glass)
function standEnt(x, y, d, dir, sipping, ph) {
  return { x0: x - 8, x1: x + 8, z: y, warm: v => personSprite(v, d, 0, dir), draw(g, v, ox, oy, t) {
    const frame = sipping ? ((t + ph) % 3.4 > 2.3 ? 6 : 5) : 0;
    g.drawImage(personSprite(v, d, frame, dir), Math.round(x) + ox - PERSON_CX, Math.round(y) + oy - PERSON_FY);
  } };
}

// A shop as a live sprite (so walkers sort in front of and behind it by depth); lit shops glow at night
function burgShopEnt(lx, y, w, kind, seed, glow, wallH) {
  const e = spriteEnt(lx, y, w + 8, 30, 4, 28, 'burg' + kind + seed + '_' + w + '_' + (wallH || 0), (g, p, lit) => burgShop(g, p, lit, 4, 28, w, kind, seed, wallH));
  if (glow) e.light = [lx + (w >> 1), y - 6];
  return e;
}
