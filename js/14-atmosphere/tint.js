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
  tintKey(7.6, '#fbfaff', '#dfe8f4', 0.1), tintKey(9.0, '#ffffff', '#dfe8f4', 0),            // morning: pale, hazy light
  tintKey(14.5, '#ffffff', '#f0a030', 0), tintKey(15.3, '#fff5e4', '#f0a030', 0.04),         // afternoon: the light warms up
  tintKey(16.2, '#fbead2', '#f0a030', 0.07), tintKey(17.0, '#f6dcc0', '#f09a3c', 0.15),
  tintKey(17.5, '#f0d0b0', '#f08a30', 0.24),                                                 // golden hour: heavy amber wash
  tintKey(18.2, '#e6bcaa', '#e8875a', 0.18),
  tintKey(19.0, '#a496b8', '#b85d6e', 0.06), tintKey(20.0, '#7a84b4', '#1b1f3b', 0),
  tintKey(24, '#7a84b4', '#1b1f3b', 0),
];
const tint = { v: new Float32Array(7), mul: '', wash: '', washA: 0, key: -1, plain: false };
function applyTint(g) {
  const k = (Math.round(sim.hour * 40) * 64 + Math.round(weather.level * 20)) * 8 + seasonIndex();
  if (k !== tint.key) {                                 // rebuild the colour strings only when they change
    tint.key = k;
    const c = keyedColours(TINT_KEYS, sim.hour, tint.v), r = weather.level * 0.35, S = seasonDef().mul;
    const m = i => Math.round((c[i] + (172 - c[i]) * r) * S[i] / 255);   // rain greys things down, the season grades them
    tint.mul = 'rgb(' + m(0) + ',' + m(1) + ',' + m(2) + ')';
    tint.wash = 'rgb(' + Math.round(c[3]) + ',' + Math.round(c[4]) + ',' + Math.round(c[5]) + ')';
    tint.washA = (c[6] / 255) * (1 - weather.level);
    tint.plain = m(0) > 252 && m(1) > 252 && m(2) > 252;
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
  const bloom = seasonDef().bloom * (1 - sim.night) * (1 - weather.level);   // summer: bright, blown-out daylight
  if (bloom > 0.004) {
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = bloom;
    g.fillStyle = 'rgb(255,240,200)';
    g.fillRect(-2, -2, W + 4, H + 4);
    g.globalAlpha = 1;
  }
  g.globalCompositeOperation = 'source-over';
}
