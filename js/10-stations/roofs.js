'use strict';
// js/10-stations/roofs.js
// Defines: buildUmbrellaRoof, buildShedRoof, buildTinRoof, buildJunctionRoof, buildMilitaryRoof

// Kamalapur: a row of concrete umbrella shells, one per column, giving the
// roof its wavy outline
function buildUmbrellaRoof(p, L, R) {
  const w = R - L, [c, g] = makeCanvas(w, ROOFS.umbrella.h);
  for (let x = 0; x < w; x++) {
    const sx = x + L, cx = Math.round(sx / 41) * 41, t = (sx - cx) / 20.5;
    const top = 2 + Math.round(5 * t * t);
    px(g, x, top, p.white);
    rect(g, x, top + 1, 1, 2, sx < cx ? p.cloudShade : p.grayLight);
    px(g, x, top + 3, p.gray);
    const cap = 3 - Math.abs(sx - cx);                   // flared column capital
    if (cap > 0) rect(g, x, top + 4, 1, cap, p.grayLight);
  }
  return c;
}

// Bottoli's long corrugated-iron shed: weathered to a patchy rusty red and brown
function buildShedRoof(p, w) {
  const [c, g] = makeCanvas(w, 7), rng = mulberry32(77);
  rect(g, 0, 0, w, 1, p.brown);
  for (let x = 0; x < w; x++) {
    const k = hash2(x >> 2, 3), col = k < 0.55 ? p.rust : k < 0.8 ? p.brown : k < 0.93 ? p.red : p.orange;
    rect(g, x, 1, 1, 4, x % 3 === 0 ? p.brownDark : col);                 // corrugations
  }
  for (let i = 0; i < w * 0.8; i++) px(g, randInt(rng, 0, w - 1), randInt(rng, 1, 4), rng() < 0.6 ? p.brownDark : p.orange);   // pitting and rust blooms
  rect(g, 0, 5, w, 1, p.rust); rect(g, 0, 6, w, 1, p.brownDark);
  for (let x = 2; x < w; x += randInt(rng, 5, 12)) px(g, x, 6, p.rust);
  return c;
}

function buildTinRoof(p, w, color) {
  const [c, g] = makeCanvas(w, 7);
  const base = p[color], dark = p[{ red: 'rust', blue: 'navy', rust: 'brown' }[color] || 'greenDark'];
  rect(g, 1, 0, w - 2, 1, dark);
  rect(g, 0, 1, w, 4, base);
  for (let x = 1; x < w; x += 3) rect(g, x, 1, 1, 4, dark);   // corrugations
  rect(g, 0, 5, w, 1, p.grayLight);
  rect(g, 0, 6, w, 1, p.grayDark);
  return c;
}

// Sholosohor's canopy: a long, deep blue corrugated roof with a heavy fascia, gutter and dark soffit,
// weathered with rust streaks and bird marks
function buildJunctionRoof(p, w) {
  const [c, g] = makeCanvas(w, ROOFS.junction.h), rng = mulberry32(88);
  rect(g, 1, 0, w - 2, 1, p.navy);
  rect(g, 0, 1, w, 6, p.blue);
  for (let x = 1; x < w; x += 3) rect(g, x, 1, 1, 6, p.navy);                            // corrugations
  for (let i = 0; i < w * 0.9; i++) px(g, randInt(rng, 0, w - 1), randInt(rng, 1, 6), rng() < 0.6 ? p.skyDeep : p.cloudShade);   // sun-faded sheets
  for (let x = 4; x < w; x += randInt(rng, 9, 22)) { const l = randInt(rng, 2, 4); for (let j = 0; j < l; j++) px(g, x, 2 + j, p.rust); }   // rust streaks
  for (let i = 0; i < w / 14; i++) px(g, randInt(rng, 0, w - 1), randInt(rng, 1, 5), p.white);                                     // bird marks
  rect(g, 0, 7, w, 1, p.grayLight);                                                       // gutter
  rect(g, 0, 8, w, 2, p.navy); rect(g, 0, 8, w, 1, p.blue);                               // fascia board
  rect(g, 0, 10, w, 1, p.ink);                                                            // soffit shadow
  for (let x = 3; x < w; x += 41) rect(g, x, 8, 1, 3, p.skyDeep);                         // bracket heads
  return c;
}

// Cantonment's shed: very neat deep-green corrugated sheeting, white trim, nothing out of place
function buildMilitaryRoof(p, w) {
  const [c, g] = makeCanvas(w, ROOFS.military.h);
  rect(g, 1, 0, w - 2, 1, p.greenDeep);
  rect(g, 0, 1, w, 5, p.greenDark);
  for (let x = 1; x < w; x += 3) { rect(g, x, 1, 1, 5, p.greenDeep); px(g, x + 1, 1, p.green); }          // regular corrugations with a lit crest
  rect(g, 0, 6, w, 1, p.white);                                                                           // white gutter line
  rect(g, 0, 7, w, 1, p.greenDark);                                                                       // fascia
  rect(g, 0, 8, w, 1, p.ink);                                                                             // soffit shadow
  return c;
}
