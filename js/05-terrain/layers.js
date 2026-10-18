'use strict';
// js/05-terrain/layers.js
// Defines: ANCHOR_X, CHUNK_W, TLAYERS, TL, uOf, lxOf, hash2

// =====================================================================
// 5b. TERRAIN SECTIONS
// =====================================================================
// The far, mid and foreground layers are not repeating tiles: they are laid
// out once for the whole line from fixed seeds (so every trip looks the
// same), painted lazily in chunks per lighting, and overlaid every frame
// with live entities (swaying plants, boats, animals, fog, shimmer).
//
// A layer with parallax factor f shows layer column lx at screen
// x = lx - floor(dist * f), and that column stands for the world position
// u = (lx - ANCHOR_X) / f. So every layer agrees on what lies at the centre
// of the screen, and deeper layers see further ahead and behind.
//
// Ground pixels of two neighbouring sections are mixed with an ordered
// dither across the blend zone; objects are spawned with a probability
// equal to their section's weight, so they thin out instead of being cut.
const ANCHOR_X = W / 2;
const CHUNK_W = 64;                                 // multiple of 4: dither lines up across chunks; small = short builds

const TLAYERS = [
  { key: 'far', f: PARALLAX.far, y: LAYER_Y.far, h: 60, seed: 21, hiRows: null },
  { key: 'tall', f: PARALLAX.mid, y: 0, h: 128, seed: 63, hiRows: null },    // shares the mid layer's columns, full screen height: chimneys, towers
  { key: 'mid', f: PARALLAX.mid, y: LAYER_Y.mid, h: 80, seed: 42, hiRows: [16, 78] },
  { key: 'fg',  f: PARALLAX.fg,  y: LAYER_Y.fg,  h: 34, seed: 77, hiRows: [12, 34] },
];
const TL = Object.fromEntries(TLAYERS.map(L => [L.key, L]));
const uOf = (L, lx) => (lx - ANCHOR_X) / L.f;
const lxOf = (L, u) => Math.round(u * L.f + ANCHOR_X);

// Deterministic per-pixel noise in [0, 1)
function hash2(x, y) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
