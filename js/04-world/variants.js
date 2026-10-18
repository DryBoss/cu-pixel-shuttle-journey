'use strict';
// js/04-world/variants.js
// Defines: tintPattern, buildVariant

// 4x4 ordered-dither pattern of one colour; with lines, every other row is
// fourth row is filled solid as well (the ripple lines of a reflection)
function tintPattern(col, level, lines) {
  const [c, g] = makeCanvas(4, 4);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if (bayer(x, y) < level || (lines && y === 3)) px(g, x, y, col);
  return g.createPattern(c, 'repeat');
}

// --- lighting variants: every sprite and tile, once per lighting -----
function buildVariant(name) {
  const def = LIGHTING[name], p = {}, rgba = {};
  for (const k in PALETTE) p[k] = PALETTE[def.map[k] || k];
  for (const k in p) {                                    // ImageData words (little-endian ABGR)
    const [r, gr, b] = hexToRgb(p[k]);
    rgba[k] = ((255 << 24) | (b << 16) | (gr << 8) | r) >>> 0;
  }
  const backdrops = {};
  for (const key in BACKDROPS) backdrops[key] = BACKDROPS[key].build(p, def.lit);
  return {
    name, lit: def.lit, p, rgba, puffs: [], people: new Map(),
    sprites: new Map(),                                   // terrain sprites, painted on first use
    chunks: { far: new Map(), tall: new Map(), mid: new Map(), fg: new Map() },
    clouds: buildClouds(p),
    cumulus: buildCumulus(p),
    poles: buildPoles(p),
    track: buildTrack(p),
    trackRust: buildTrackRusty(p),
    deck: buildDeck(p),
    pier: buildPier(p),
    abutment: [buildAbutment(p, false), buildAbutment(p, true)],
    trussNear: buildTruss(p, true),
    trussFar: buildTruss(p, false),
    waterTint: tintPattern(p.skyMid, 3, true),
    waterFade: Array.from({ length: 17 }, (_, l) => tintPattern(p.skyMid, l)),
    loco: buildLoco(p, def.lit),
    cars: Array.from({ length: CONFIG.CAR_COUNT }, (_, i) => buildCar(p, def.lit, i)),
    wheels: buildWheels(p),
    backdrops,
    props: buildProps(p, def.lit),
    stations: STATIONS.map(st => buildStationSprites(st, p)),
  };
}
