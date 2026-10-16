'use strict';
// js/15-ui/banner.js
// Defines: bannerCache, bannerSprite, drawBanner

// "NEXT STATION: <bangla> / <english>", pre-rendered once per station
const bannerCache = [];
function bannerSprite(i) {
  if (bannerCache[i]) return bannerCache[i];
  const st = STATIONS[i], m = st.bnMask, label = 'NEXT STATION:';
  const lw = textWidth(label), ew = textWidth(st.en), h = Math.max(m.h, 5) + 8;
  const w = 6 + lw + 6 + m.w + 5 + 3 + 5 + ew + 6;
  const [c, g] = makeCanvas(w, h);
  rect(g, 0, 0, w, h, PALETTE.slate);
  rect(g, 1, 1, w - 2, h - 2, PALETTE.ink);
  rect(g, 1, h - 2, w - 2, 1, PALETTE.green);
  const ty = (h - 5) >> 1;
  let x = 6;
  drawText(g, label, x, ty, PALETTE.grayLight);  x += lw + 6;
  drawMask(g, m, x, (h - m.h) >> 1, PALETTE.glow); x += m.w + 5;
  drawText(g, '/', x, ty, PALETTE.slate);          x += 8;
  drawText(g, st.en, x, ty, PALETTE.white);
  return (bannerCache[i] = c);
}

function drawBanner(g) {
  const b = bannerSprite(ui.bannerSt), y = Math.round(ui.bannerY);
  if (y <= -b.height) return;
  g.drawImage(b, Math.max(input.debug ? ui.debugW + 4 : 2, (W - b.width) >> 1), y);
}
