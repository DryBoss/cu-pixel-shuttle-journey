'use strict';
// js/14-atmosphere/tint.js
// Defines: tintKey, TINT_KEYS, tint, applyTint

// --- colour tint over the whole picture -----------------------------------
// [hour, multiply rgb, warm wash rgb + alpha]: a multiply darkens and cools
// the night, a thin warm wash gilds dawn, golden hour and sunset
const tintKey = (h, mul, wash, a) => [h, [...hexRgbF(mul), ...hexRgbF(wash), a * 255]];
const TINT_KEYS = [
  tintKey(0, '#7a84b4', '#1b1f3b', 0), tintKey(4.6, '#7a84b4', '#1b1f3b', 0),
  tintKey(5.6, '#c0a8bc', '#f4c27a', 0.08), tintKey(6.6, '#eadad2', '#f4c27a', 0.12),
  tintKey(7.6, '#ffffff', '#f4c27a', 0), tintKey(16.2, '#ffffff', '#f0a030', 0),
  tintKey(17.2, '#f8ecdc', '#f0a030', 0.1), tintKey(18.2, '#e6bcaa', '#e8875a', 0.14),
  tintKey(19.0, '#a496b8', '#b85d6e', 0.06), tintKey(20.0, '#7a84b4', '#1b1f3b', 0),
  tintKey(24, '#7a84b4', '#1b1f3b', 0),
];
const tint = { v: new Float32Array(7), mul: '', wash: '', washA: 0, key: -1 };
function applyTint(g) {
  const k = Math.round(sim.hour * 40) * 64 + Math.round(weather.level * 20);
  if (k !== tint.key) {                                 // rebuild the colour strings only when they change
    tint.key = k;
    const c = keyedColours(TINT_KEYS, sim.hour, tint.v), r = weather.level * 0.35;
    const m = i => Math.round(c[i] + (172 - c[i]) * r);   // rain greys things down
    tint.mul = 'rgb(' + m(0) + ',' + m(1) + ',' + m(2) + ')';
    tint.wash = 'rgb(' + Math.round(c[3]) + ',' + Math.round(c[4]) + ',' + Math.round(c[5]) + ')';
    tint.washA = (c[6] / 255) * (1 - weather.level);
    tint.plain = c[0] > 252 && c[1] > 252 && c[2] > 252 && r === 0;
  }
  if (!tint.plain) {
    g.globalCompositeOperation = 'multiply';
    g.fillStyle = tint.mul;
    g.fillRect(-2, -2, W + 4, H + 4);
  }
  if (tint.washA > 0.004) {
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = tint.washA;
    g.fillStyle = tint.wash;
    g.fillRect(-2, -2, W + 4, H + 4);
    g.globalAlpha = 1;
  }
  g.globalCompositeOperation = 'source-over';
}
