'use strict';
// js/14-atmosphere/lighting.js
// Defines: LIGHT_TMP, lightingAt, nightAt, hhmm

const LIGHT_TMP = { a: 'day', b: 'day', f: 0 };
function lightingAt(h) {
  for (let i = 0; i < LIGHT_KEYS.length - 1; i++) {
    const k0 = LIGHT_KEYS[i], k1 = LIGHT_KEYS[i + 1];
    if (h >= k0[0] && h < k1[0]) {
      LIGHT_TMP.a = k0[1]; LIGHT_TMP.b = k1[1];
      LIGHT_TMP.f = k0[1] === k1[1] ? 0 : (h - k0[0]) / (k1[0] - k0[0]);
      return LIGHT_TMP;
    }
  }
  LIGHT_TMP.a = LIGHT_TMP.b = 'night'; LIGHT_TMP.f = 0;
  return LIGHT_TMP;
}

// 0 in daylight .. 1 at night: stars, lamps
function nightAt(h) {
  if (h >= 7 && h <= 16.8) return 0;
  if (h > 16.8 && h < 19.8) { const u = (h - 16.8) / 3; return 1 - (1 - u) * (1 - u); }   // lamps are already glowing at 17:30
  if (h >= 4.5 && h < 7) return 1 - smoothstep((h - 4.5) / 2.5);
  return 1;
}

const hhmm = h => { const m = Math.floor(h * 60) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
