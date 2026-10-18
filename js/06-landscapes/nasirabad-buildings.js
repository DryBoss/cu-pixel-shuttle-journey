'use strict';
// js/06-landscapes/nasirabad-buildings.js
// Defines: commercialBlock, adBoard, billboardStilts

// A multi-storey concrete commercial block backing onto the line in Nasirabad: an open godown or
// storefront on the ground floor (dark bays with stacked boxes and sacks), small cantilevered
// balconies above with laundry, potted plants and the odd air conditioner, a water tank on the roof
function commercialBlock(g, p, lit, x, base, w, floors, seed) {
  const rng = mulberry32(seed), fh = 7, gh = 10, h = gh + (floors - 1) * fh + 2, top = base - h;
  const tone = [p.grayLight, p.cloudShade, p.tan, p.peach][seed % 4];
  rect(g, x, top, w, h, tone);
  ditherRect(g, x, top, w, h, p.gray, 3);
  ditherRect(g, x + w - 3, top, 3, h, p.grayDark, 5);
  for (let i = 0; i < w / 4; i++) { const sx = x + randInt(rng, 1, w - 2), l = randInt(rng, 4, h - 6); for (let j = 0; j < l; j++) if (j < l * 0.6 || bayer(sx, top + j) < 8) px(g, sx, top + 2 + j, p.grayDark); }   // rain streaks
  rect(g, x - 1, top - 2, w + 2, 2, p.white); rect(g, x - 1, top, w + 2, 1, p.gray);                          // roof slab and parapet
  // --- ground floor: open bays between pillars, goods stacked inside
  const gy = base - gh;
  rect(g, x, gy, w, 2, p[['red', 'blue', 'green', 'orange', 'purple'][seed % 5]]);                           // shop sign band
  for (let sx = x + 1; sx < x + w - 2; sx += 3) if (rng() < 0.7) px(g, sx, gy, p.white);
  for (let bx = x + 1; bx + 6 <= x + w - 1; bx += 8) {
    const bw = Math.min(6, x + w - 1 - bx);
    rect(g, bx, gy + 2, bw, gh - 2, lit ? PALETTE.amber : p.ink);                                           // the open bay
    if (lit) rect(g, bx + 1, gy + 3, bw - 2, 2, PALETTE.glow);
    const kind = Math.floor(rng() * 3);
    if (kind === 0) for (let i = 0; i < 3; i++) { rect(g, bx + (i & 1), base - 3 - i * 3, 3, 3, p.tan); px(g, bx + (i & 1) + 1, base - 3 - i * 3, p.cream); rect(g, bx + 3, base - 3 - (i & 1) * 3, 3, 3, p.brown); }   // stacked boxes
    else if (kind === 1) for (let i = 0; i < 3; i++) { rect(g, bx + i * 2, base - 3, 2, 3, p.cream); px(g, bx + i * 2, base - 3, p.tan); rect(g, bx + i, base - 6, 3, 3, p.white); px(g, bx + i + 1, base - 6, p.tan); }   // sacks
    else { rect(g, bx, base - 4, 3, 4, p.blue); rect(g, bx + 3, base - 4, 3, 4, p.skyMid); rect(g, bx + 1, base - 7, 3, 3, p.blue); }   // drums
    if (rng() < 0.4) { rect(g, bx, gy + 2, bw, 2, p.gray); for (let sx = bx; sx < bx + bw; sx += 2) px(g, sx, gy + 3, p.grayDark); }   // a rolling shutter half down
    rect(g, bx + bw, gy + 2, 2, gh - 2, tone);                                                              // pillar
  }
  rect(g, x, base - 1, w, 1, p.grayDark);
  // --- upper floors: windows, cantilevered balconies, washing, plants
  for (let f = 1; f < floors; f++) {
    const y = top + 2 + (floors - 1 - f) * fh;
    rect(g, x, y + fh - 1, w, 1, p.white);                                                                  // slab edge
    for (let bx = x + 2; bx + 5 <= x + w - 2; bx += 7) {
      const on = lit && rng() < 0.5;
      rect(g, bx + 1, y, 3, 3, on ? PALETTE.glow : p.indigo);
      rect(g, bx - 1, y + 4, 7, 1, p.white); px(g, bx - 1, y + 3, p.grayDark); px(g, bx + 5, y + 3, p.grayDark);   // balcony slab sticking out, with railing posts
      rect(g, bx, y + 3, 5, 1, p.gray);
      const r = rng();
      if (r < 0.4) {                                                                                         // washing on a line
        for (let k = 0; k < 3; k++) rect(g, bx + k * 2, y + 1, 1, 2, p[['red', 'blue', 'glow', 'rose', 'white', 'green'][Math.floor(rng() * 6)]]);
        rect(g, bx, y, 5, 1, p.grayDark);
      } else if (r < 0.7) { px(g, bx + 1, y + 2, p.green); px(g, bx + 1, y + 3, p.rust); px(g, bx + 3, y + 2, p.grassLight); px(g, bx + 3, y + 3, p.brown); }   // potted plants
      else if (r < 0.8) { rect(g, bx + 1, y + 1, 3, 2, p.cloudShade); px(g, bx + 2, y + 2, p.grayDark); }  // an air conditioner
    }
  }
  if (w > 18 && rng() < 0.7) { rect(g, x + 3, top - 6, 5, 4, p.grayLight); rect(g, x + 3, top - 7, 5, 1, p.gray); px(g, x + 4, top - 2, p.grayDark); px(g, x + 7, top - 2, p.grayDark); }   // water tank on legs
}

// A big colourful ad: abstract, loud, faded by the sun. kind picks the design
function adBoard(g, p, x, y, w, h, kind, seed) {
  const rng = mulberry32(seed), bg = [p.red, p.blue, p.glow, p.green, p.purple, p.orange][kind % 6], fg = [p.white, p.glow, p.red, p.white, p.paddy, p.ink][kind % 6];
  rect(g, x, y, w, h, p.ink); rect(g, x + 1, y + 1, w - 2, h - 2, bg);
  switch (kind % 6) {
    case 0: disc(g, x + (w >> 1), y + (h >> 1), (h >> 1) - 2, p.white); rect(g, x + 2, y + h - 4, w - 4, 1, p.white); rect(g, x + 3, y + 3, 4, 2, p.white); break;       // a fizzy-drink disc
    case 1: for (let i = 0; i < w - 4; i += 3) rect(g, x + 2 + i, y + 2, 2, h - 4, i % 6 ? p.white : p.glow); disc(g, x + w - 8, y + 6, 4, p.glow); break;               // a phone-company burst
    case 2: rect(g, x + 3, y + 3, w - 6, 3, p.red); rect(g, x + 3, y + h - 6, w - 6, 3, p.red); rect(g, x + (w >> 1) - 2, y + 4, 4, h - 8, p.brown); break;                   // a cooking-oil bottle
    case 3: for (let i = 0; i < 4; i++) rect(g, x + 2, y + 3 + i * 3, w - 4 - i * 2, 2, i & 1 ? p.white : p.glow); break;                                                    // SALE stripes
    case 4: disc(g, x + 8, y + (h >> 1), 5, p.tan); rect(g, x + 3, y + (h >> 1) - 6, 11, 4, p.ink); rect(g, x + 16, y + 3, w - 19, 2, p.white); rect(g, x + 16, y + 7, w - 21, 2, p.white); break;   // a face and slogan
    default: rect(g, x + 3, y + 3, 6, h - 6, p.ink); rect(g, x + 11, y + 4, 6, h - 8, p.ink); rect(g, x + 20, y + 3, w - 23, 2, p.white); break;                              // two phones
  }
  for (let i = 0; i < w * h * 0.12; i++) px(g, x + 1 + Math.floor(rng() * (w - 2)), y + 1 + Math.floor(rng() * (h - 2)), rng() < 0.5 ? p.cloudShade : bg);   // sun-faded, peeling
}

// A billboard on tall iron stilts: catwalk, braces and floodlights that glow at night
function billboardStilts(g, p, lit, x, base, w, h, kind, seed) {
  const top = base - 18 - h;
  for (const sx of [x + 3, x + w - 5]) { rect(g, sx, top + h, 2, base - top - h, p.grayDark); rect(g, sx, top + h, 1, base - top - h, p.gray); }
  for (let k = 0; k < 12; k++) { px(g, x + 5 + Math.floor(k * (w - 12) / 12), base - 4 - k, p.grayDark); px(g, x + w - 6 - Math.floor(k * (w - 12) / 12), base - 4 - k, p.grayDark); }   // cross braces
  rect(g, x + 1, top + h, w - 2, 1, p.grayDark);                                                              // catwalk
  adBoard(g, p, x, top, w, h, kind, seed);
  for (let lx = x + 4; lx < x + w - 2; lx += 9) { px(g, lx, top - 1, lit ? PALETTE.glow : p.grayLight); px(g, lx, top - 2, p.grayDark); if (lit) glowHalo(g, lx, top - 1, 1, 4, 5); }
}
