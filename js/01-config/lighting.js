'use strict';
// js/01-config/lighting.js
// Defines: LIGHTING

// Palette lighting: each lighting remaps palette keys onto other palette
// keys, and every sprite is pre-rendered once per lighting.
// Light sources (lit windows, lamps, headlight) use PALETTE directly;
// p.glow / p.amber are yellow *paint* (safety line, signs) and do darken.
const LIGHTING = {
  day:   { lit: false, map: {} },
  dusk:  { lit: true, map: {
    slate: 'indigo', orange: 'rose', peach: 'orange', glow: 'peach', amber: 'orange',
    skyDeep: 'slate', skyMid: 'purple', skyLight: 'rose', white: 'peach', cloudShade: 'rose',
    grayLight: 'gray', gray: 'grayDark', grayDark: 'navy',
    brownDark: 'ink', brown: 'brownDark', tan: 'rust', cream: 'peach', red: 'rust', rust: 'brown',
    greenDeep: 'ink', greenDark: 'greenDeep', green: 'greenDark', grass: 'green',
    grassLight: 'grass', paddy: 'tan', haze: 'slate', blue: 'indigo',
  } },
  night: { lit: true, map: {
    navy: 'ink', indigo: 'navy', slate: 'indigo', purple: 'indigo', rose: 'purple',
    orange: 'purple', peach: 'rose', glow: 'tan', amber: 'rust',
    skyDeep: 'navy', skyMid: 'indigo', skyLight: 'slate', white: 'slate', cloudShade: 'indigo',
    grayLight: 'slate', gray: 'indigo', grayDark: 'navy',
    brownDark: 'ink', brown: 'navy', tan: 'purple', cream: 'slate', red: 'purple', rust: 'indigo',
    greenDeep: 'ink', greenDark: 'greenDeep', green: 'greenDeep', grass: 'greenDeep',
    grassLight: 'greenDark', paddy: 'greenDark', haze: 'navy', blue: 'indigo',
  } },
};
