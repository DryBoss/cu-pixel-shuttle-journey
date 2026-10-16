'use strict';
// js/14-atmosphere/sky.js
// Defines: sky, updateSky

// The sky is a vertical gradient dithered to 4x4 Bayer steps, so it only
// varies with x & 3: a 4 px strip, repeated as a pattern
const sky = { strip: null, sg: null, img: null, pattern: null, key: -1, cols: new Float32Array(9), tmp: new Float32Array(9) };
function updateSky(g) {
  const d = sim.dist, day = 1 - sim.night, deep = sectionWeight('kash', d) * day, mist = sectionWeight('hills', d) * day;
  const rain = weather.level;
  const key = ((Math.round(sim.hour * 60) * 21 + Math.round(deep * 20)) * 21 + Math.round(mist * 20)) * 21 + Math.round(rain * 20);
  if (key === sky.key) return;
  sky.key = key;
  if (!sky.strip) { [sky.strip, sky.sg] = makeCanvas(4, H); sky.img = sky.sg.createImageData(4, H); }
  const c = keyedColours(SKY_KEYS, sim.hour, sky.cols), t = sky.tmp;
  for (let i = 0; i < 9; i++) {
    let v = c[i];
    v += (SKY_DEEP[i] - v) * deep;
    v += (SKY_MIST[i] - v) * mist * 0.7;
    t[i] = SKY_RAIN_NIGHT[i] + (SKY_RAIN_DAY[i] - SKY_RAIN_NIGHT[i]) * day;
    c[i] = v + (t[i] - v) * rain * 0.65;
  }
  const out = new Uint32Array(sky.img.data.buffer), Q = 6;
  for (let y = 0; y < H; y++) {
    const a = y < 60 ? 0 : 3, b = y < 60 ? 3 : 6, f = y < 60 ? y / 60 : Math.min(1, (y - 60) / 52);
    for (let x = 0; x < 4; x++) {
      const dz = (bayer(x, y) / 16 - 0.5) * Q;
      const r = Math.round((c[a] + (c[b] - c[a]) * f + dz) / Q) * Q, gg = Math.round((c[a + 1] + (c[b + 1] - c[a + 1]) * f + dz) / Q) * Q,
            bb = Math.round((c[a + 2] + (c[b + 2] - c[a + 2]) * f + dz) / Q) * Q;
      out[y * 4 + x] = (255 << 24 | Math.min(255, bb) << 16 | Math.min(255, gg) << 8 | Math.min(255, r)) >>> 0;
    }
  }
  sky.sg.putImageData(sky.img, 0, 0);
  sky.pattern = g.createPattern(sky.strip, 'repeat');
}
