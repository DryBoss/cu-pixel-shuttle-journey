'use strict';
// js/14-atmosphere/sky-colours.js
// Defines: hexRgbF, keyedColours, skyKey, SKY_KEYS, SKY_DEEP, SKY_MIST, SKY_RAIN_DAY, SKY_RAIN_NIGHT

// Interpolate a table of [hour, ...hex colours] rows into out (RGB floats)
function hexRgbF(hex) { const [r, g, b] = hexToRgb(hex); return [r, g, b]; }
function keyedColours(keys, h, out) {
  let i = 0;
  while (i < keys.length - 2 && h >= keys[i + 1][0]) i++;
  const k0 = keys[i], k1 = keys[i + 1], t = smoothstep(Math.max(0, Math.min(1, (h - k0[0]) / (k1[0] - k0[0]))));
  for (let c = 0; c < out.length; c++) out[c] = k0[1][c] + (k1[1][c] - k0[1][c]) * t;
  return out;
}
// rows: [hour, [top rgb, mid rgb, horizon rgb] flattened]
const skyKey = (h, top, mid, hor) => [h, [...hexRgbF(top), ...hexRgbF(mid), ...hexRgbF(hor)]];
const SKY_KEYS = [
  skyKey(0, '#0c0e22', '#151a3a', '#262c58'), skyKey(4.6, '#0c0e22', '#151a3a', '#262c58'),
  skyKey(5.4, '#1b1f3b', '#3a3a6e', '#b85d6e'), skyKey(6.1, '#2c4a84', '#a87a9e', '#f4c27a'),
  skyKey(7.0, '#3d7fc4', '#8cc4e8', '#f2e2b8'), skyKey(8.5, '#3d7fc4', '#6aaee0', '#a8d8ef'),
  skyKey(15.6, '#3d7fc4', '#6aaee0', '#a8d8ef'), skyKey(17.0, '#3a6cb0', '#88b2d8', '#f4d08a'),
  skyKey(18.0, '#2c2f5e', '#b85d6e', '#e8875a'), skyKey(18.8, '#1b1f3b', '#4a4f84', '#b85d6e'),
  skyKey(19.8, '#0f1228', '#1b1f3b', '#2c2f5e'), skyKey(24, '#0c0e22', '#151a3a', '#262c58'),
];
// section moods (daylight only) and rain, as targets the sky leans towards
const SKY_DEEP = [...hexRgbF('#2a60b2'), ...hexRgbF('#4a92d8'), ...hexRgbF('#9ccff0')];
const SKY_MIST = [...hexRgbF('#8fb3cf'), ...hexRgbF('#b8c8d6'), ...hexRgbF('#d0d8e0')];
const SKY_RAIN_DAY = [...hexRgbF('#5d6577'), ...hexRgbF('#7d8596'), ...hexRgbF('#9aa1ad')];
const SKY_RAIN_NIGHT = [...hexRgbF('#14161e'), ...hexRgbF('#1c1f2a'), ...hexRgbF('#262a36')];
