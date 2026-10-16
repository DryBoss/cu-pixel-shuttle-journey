'use strict';
// js/04-world/bridge-parts.js
// Defines: buildDeck, TRUSS_Y, buildTruss, buildPier, buildAbutment

// --- 5c. Meghna bridge: open deck, piers, abutments, truss spans (1.0x) --
// Same sleeper spacing as the track tile, but nothing under the sleepers
// except steel and, far below, the river.
function buildDeck(p) {
  const TW = 192, [c, g] = makeCanvas(TW, 20);
  rect(g, 0, 4, TW, 10, p.blue);
  ditherRect(g, 0, 4, TW, 10, p.skyDeep, 5);
  for (const y of [8, 10]) rect(g, 0, y, TW, 1, p.grayDark);           // rail-bearing stringers
  for (let x = 2; x < TW; x += 8) {
    rect(g, x, 5, 4, 9, p.brown);
    rect(g, x + 3, 5, 1, 9, p.brownDark);
    px(g, x, 5, p.tan);
  }
  rect(g, 0, 6, TW, 1, p.grayLight); rect(g, 0, 7, TW, 1, p.grayDark);
  rect(g, 0, 11, TW, 1, p.grayLight); rect(g, 0, 12, TW, 1, p.grayDark);
  rect(g, 0, 14, TW, 1, p.grayDark);
  rect(g, 0, 15, TW, 1, p.ink);
  return c;
}

const TRUSS_Y = 96, PIER_Y = 155, REFLECT_AXIS = 158;

// One camelback through-truss span. The far truss sits behind the train
// (darker, a little higher); the near one is drawn over it.
function buildTruss(p, near) {
  const S = BRIDGE.span, P = 6, pw = S / P, bot = 57;
  const [c, g] = makeCanvas(S + 1, 62);
  const col = near ? p.gray : p.grayDark, hi = near ? p.grayLight : p.gray, dark = near ? p.grayDark : p.navy;
  const top = i => 4 + Math.round(6 * ((i - P / 2) / (P / 2 - 1)) ** 2);
  const line = (x0, y0, x1, y1, k) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let s = 0; s <= n; s++) px(g, Math.round(x0 + (x1 - x0) * s / n), Math.round(y0 + (y1 - y0) * s / n), k);
  };
  rect(g, 0, bot, S + 1, 2, col);                                       // bottom chord
  rect(g, 0, bot + 2, S + 1, 1, dark);
  for (let i = 1; i < P - 1; i++) {                                     // polygonal top chord
    line(i * pw, top(i), (i + 1) * pw, top(i + 1), hi);
    line(i * pw, top(i) + 1, (i + 1) * pw, top(i + 1) + 1, col);
  }
  line(0, bot, pw, top(1), hi); line(1, bot, pw + 1, top(1) + 1, col);  // inclined end posts
  line(S, bot, S - pw, top(P - 1), col); line(S - 1, bot, S - pw - 1, top(P - 1) + 1, dark);
  for (let i = 1; i < P; i++) rect(g, i * pw, top(i) + 2, 1, bot - top(i) - 2, col);   // verticals
  for (let i = 1; i < P - 1; i++) {                                     // diagonals slope down to mid-span
    if (i < P / 2) line(i * pw + 1, top(i) + 2, (i + 1) * pw - 1, bot - 1, col);
    else line((i + 1) * pw - 1, top(i + 1) + 2, i * pw + 1, bot - 1, col);
  }
  for (let i = 0; i <= P; i++) {                                        // gusset plates
    rect(g, i * pw - 1, bot - 1, 3, 3, dark);
    if (i > 0 && i < P) rect(g, i * pw - 1, top(i), 3, 2, dark);
  }
  if (near) for (let x = 3; x < S; x += 6) px(g, x, bot, p.grayLight);  // rivets
  return c;
}

// Concrete pier under a span joint, its foot in the water
function buildPier(p) {
  const [c, g] = makeCanvas(11, 8);
  rect(g, 0, 0, 11, 1, p.grayLight);
  rect(g, 1, 1, 9, 7, p.cloudShade);
  rect(g, 8, 1, 2, 7, p.gray);
  rect(g, 1, 5, 9, 1, p.grayDark);                                     // waterline stain
  px(g, 0, 7, p.skyLight); px(g, 10, 7, p.skyLight);
  return c;
}

// Brick abutment where the embankment meets the river (mirrored for the far bank)
function buildAbutment(p, flip) {
  const [c, g] = makeCanvas(16, 15);
  if (flip) { g.translate(16, 0); g.scale(-1, 1); }
  rect(g, 0, 0, 16, 1, p.cloudShade);
  rect(g, 0, 1, 16, 14, p.rust);
  for (let y = 3; y < 15; y += 3) {
    rect(g, 0, y, 16, 1, p.brown);
    for (let x = (y % 6 ? 1 : 4); x < 16; x += 6) px(g, x, y - 1, p.brown);
  }
  rect(g, 14, 1, 2, 14, p.brownDark);                                  // face towards the water
  return c;
}
