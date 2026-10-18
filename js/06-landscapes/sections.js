'use strict';
// js/06-landscapes/sections.js
// Defines: SECTIONS

// --- what each section paints and spawns ---------------------------------
// Per layer: spawn(ctx) lays out objects (returning data for the ground),
// column(lx, data, u) prepares one column, ground(col, y, lx) returns the
// palette key of a pixel, and hl(col, y, lx) the key it takes on under a
// wind crest. Ground rows: far 52, mid 34, fg 12 (all screen y 112 / 118 / 158).
const SECTIONS = {
  village: {
    name: 'VILLAGE', sky: 'normal', birds: ['egret', 0.16],             // egrets over the fields, more of them than the kites of the city
    far: { spawn: villageFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: villageMid, column: paddyColumn, ground: paddyGround, hl: paddyHl },
    fg:  { spawn: villageFg, column: villageFgColumn, ground: villageFgGround, hl: villageFgHl },
  },
  hathazari: {
    name: 'HATHAZARI', sky: 'normal', birds: ['egret', 0.2],
    far: { spawn: hathazariFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: hathazariMid, column: paddyColumn, ground: paddyGround, hl: paddyHl },
    fg:  { spawn: hathazariFg, column: hathazariFgColumn, ground: hathazariFgGround, hl: hathazariFgHl },
  },
  mill: {
    name: 'JUTE MILL', sky: 'normal', birds: ['hawk', 0.05],
    far: { spawn: millFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    tall: { spawn: millTall },
    mid: { spawn: millMid, ground: millMidGround },
    fg:  { spawn: slumFg, ground: slumFgGround },
  },
  cantt: {
    name: 'CANTONMENT', sky: 'normal', birds: ['egret', 0.05],
    far: { spawn: ctx => { treeLine(ctx); }, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: canttMid, ground: canttMidGround },
    fg:  { spawn: canttFg, ground: canttFgGround },
  },
  closed: {
    name: 'CITY', sky: 'normal', birds: ['hawk', 0.05],
    far: { spawn: slumFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: ctx => slumMid(ctx, true), ground: slumMidGround },
    fg:  { spawn: slumFg, ground: slumFgGround },
  },
  slum: {
    name: 'CITY', sky: 'normal', birds: ['hawk', 0.05],
    far: { spawn: slumFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: slumMid, ground: slumMidGround },
    fg:  { spawn: slumFg, ground: slumFgGround },
  },
  colony: {
    name: 'RAILWAY COLONY', sky: 'normal', birds: ['hawk', 0.05],
    far: { spawn: colonyFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: colonyMid, column: colonyCol, ground: colonyMidGround },
    fg:  { spawn: colonyFg, column: colonyCol, ground: colonyFgGround },
  },
  khulshi: {
    name: 'KHULSHI', sky: 'normal', birds: ['egret', 0.05],
    far: { spawn: khulshiFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: khulshiMid, ground: khulshiMidGround },
    fg:  { spawn: khulshiFg, ground: khulshiFgGround },
  },
  nasirabad: {
    name: 'NASIRABAD', sky: 'normal', birds: ['crow', 0.06],
    far: { spawn: nasirabadFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: nasirabadMid, column: nasirabadCol, ground: nasirabadMidGround },
    fg:  { spawn: nasirabadFg, column: nasirabadCol, ground: nasirabadFgGround },
  },
  river: {
    name: 'MEGHNA', sky: 'normal', birds: ['gull', 0.4],
    far: {
      spawn: ctx => { farBank(ctx, 44); },
      ground: (c, y, lx) => y < 44 ? null : y < 47 ? 'haze' : y === 47 ? (bayer(lx, y) < 8 ? 'tan' : 'haze')
        : y < 50 ? 'skyLight' : hash2(lx >> 3, y) < 0.14 ? 'skyLight' : 'skyMid',
    },
    mid: { spawn: riverMid, ground: (c, y, lx) => y < 34 ? null : riverWater(lx, y, 56) },
    fg:  { spawn: riverFg, column: (lx, D, u) => bankRows(u), ground: riverFgGround },
  },
  kash: {
    name: 'KASH PHOOL', sky: 'deep', birds: ['egret', 0.05],
    far: {
      spawn: ctx => { farBank(ctx, 46); },
      ground: (c, y, lx) => y < 46 ? null : y < 49 ? 'haze' : y === 49 ? 'tan'
        : y < 54 ? (y < 51 || hash2(lx >> 3, y) < 0.15 ? 'skyLight' : 'skyMid')
        : y === 54 ? (bayer(lx, y) < 8 ? 'cream' : 'tan')
        : bayer(lx, y) < 4 ? 'white' : hash2(lx, y) < 0.3 ? 'tan' : 'cream',          // distant kash
    },
    mid: { spawn: kashMid, column: lx => 28 + Math.floor(hash2(lx, 3) * 4), ground: kashMidGround,
           hl: (top, y, lx) => y < 34 && bayer(lx, y) < 9 ? 'white' : null },
    fg:  { spawn: kashFg, ground: (c, y, lx) => y < 12 ? null : y === 12 ? (bayer(lx, y) < 8 ? 'tan' : 'cream')
             : hash2(lx, y) < 0.04 ? 'white' : hash2(lx >> 1, y >> 1) < 0.25 ? 'tan' : 'cream' },
  },
  tea: {
    name: 'TEA GARDEN', sky: 'normal', birds: null,
    far: { spawn: teaFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: teaMid, ground: (c, y, lx) => y < 34 ? null : teaHedge(lx, y, 34, 5, TEA_PROF_MID) || 'greenDark' },
    fg:  { spawn: ctx => { addTufts(ctx, 14, 13, 14); }, ground: teaFgGround,
           hl: (c, y, lx) => { if (y < 15) return null; const [rel, bump] = teaFgRow(lx, y); return rel === 2 - bump && bayer(lx, y) < 9 ? 'grassLight' : null; } },
  },
  hills: {
    name: 'SYLHET HILLS', sky: 'mist', birds: ['hawk', 0.05],
    far: { spawn: hillsFar, ground: (c, y) => y >= 52 ? 'haze' : null },
    mid: { spawn: hillsMid, ground: (c, y, lx) => y < 34 ? null : hash2(lx >> 1, y >> 1) < 0.3 ? 'greenDark' : bayer(lx, y) < 3 ? 'grass' : 'green' },
    fg:  { spawn: hillsFg, column: (lx, D) => D.streams.find(s => Math.abs(lx - s.cx) < s.w + 24) || null, ground: hillsFgGround },
  },
};
SECTIONS.village2 = SECTIONS.village;                    // the same countryside again after Foteyabad, with its own field data
