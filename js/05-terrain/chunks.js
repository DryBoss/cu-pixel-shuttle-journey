'use strict';
// js/05-terrain/chunks.js
// Defines: groundCol, terrainChunk

// --- chunks: ground pixels via ImageData, then the static objects --------
function groundCol(L, si, lx) {
  const id = TERRAIN[si].id, spec = SECTIONS[id][L.key];
  if (!spec || !spec.ground) return null;
  return { spec, c: spec.column ? spec.column(lx, L.data[id], uOf(L, lx)) : null };
}

function terrainChunk(v, L, k) {
  const cache = v.chunks[L.key];
  let ch = cache.get(k);
  if (ch) return ch;
  const x0 = k * CHUNK_W, w = CHUNK_W, h = L.h;
  const [c, g] = makeCanvas(w, h);
  const img = g.createImageData(w, h), out = new Uint32Array(img.data.buffer);
  let hi = null;
  for (let i = 0; i < w; i++) {
    const lx = x0 + i, tw = terrainAt(uOf(L, lx));
    const A = groundCol(L, tw.a, lx), B = tw.t > 0 ? groundCol(L, tw.b, lx) : A;
    for (let y = 0; y < h; y++) {
      const s = bayer(lx, y) < tw.t * 16 ? B : A;
      if (!s) continue;
      const key = s.spec.ground(s.c, y, lx);
      if (key) out[y * w + i] = v.rgba[key];
      const hk = key && s.spec.hl && s.spec.hl(s.c, y, lx);
      if (hk) (hi || (hi = new Uint32Array(w * h)))[y * w + i] = v.rgba[hk];
    }
  }
  g.putImageData(img, 0, 0);
  const statics = L.statics.filter(s => s.x1 >= x0 && s.x0 < x0 + w);
  for (const s of statics) s.draw(g, v.p, v.lit, -x0, 0);
  ch = { c, hi: null };
  if (hi) {
    let hg;
    [ch.hi, hg] = makeCanvas(w, h);
    const himg = hg.createImageData(w, h);
    new Uint32Array(himg.data.buffer).set(hi);
    hg.putImageData(himg, 0, 0);
    hg.globalCompositeOperation = 'destination-out';     // no wind highlights over props
    for (const s of statics) s.draw(hg, v.p, v.lit, -x0, 0);
  }
  cache.set(k, ch);
  return ch;
}
