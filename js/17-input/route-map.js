'use strict';
// js/17-input/route-map.js
// Defines: MAP, buildMap, drawMap

// --- route map: the whole line, coloured by landscape, with a little train -
const MAP = { x: 0, y: 2, w: 150, sprite: null };
function buildMap() {
  const w = MAP.w, h = 15, [c, g] = makeCanvas(w + 12, h);
  const d0 = STATIONS[0].dist, d1 = STATIONS[LAST_STATION].dist;
  const SEC_COL = { village: PALETTE.grass, river: PALETTE.skyMid, kash: PALETTE.cream, tea: PALETTE.green, hills: PALETTE.haze,
                    slum: PALETTE.tan, closed: PALETTE.grayLight, mill: PALETTE.rust, cantt: PALETTE.greenDark };
  rect(g, 0, 0, w + 12, 9, PALETTE.slate);
  rect(g, 1, 1, w + 10, 7, PALETTE.ink);
  for (let i = 0; i <= w; i++) {
    const tw = terrainAt(d0 + (d1 - d0) * i / w);
    rect(g, 6 + i, 4, 1, 1, SEC_COL[TERRAIN[bayer(i, 4) < tw.t * 16 ? tw.b : tw.a].id]);
  }
  let mapLabelEnd = -9;
  for (const st of STATIONS) {
    const x = 6 + Math.round((st.dist - d0) / (d1 - d0) * w);
    rect(g, x - 1, 3, 3, 3, PALETTE.white);
    const code = st.code || st.en.slice(0, 3), lx = Math.max(0, Math.min(w + 12 - textWidth(code), x - 5));
    if (lx > mapLabelEnd + 2) { drawText(g, code, lx, 10, PALETTE.grayLight); mapLabelEnd = lx + textWidth(code); }
  }
  MAP.x = (W - w - 12) >> 1;
  MAP.sprite = c;
}

function drawMap(g) {
  if (!MAP.sprite) buildMap();
  const d0 = STATIONS[0].dist, d1 = STATIONS[LAST_STATION].dist, ox = MAP.x + 6, oy = MAP.y;
  g.drawImage(MAP.sprite, MAP.x, oy);
  for (let i = 0; i <= LAST_STATION; i++) {              // stations reached glow, the next one blinks
    const x = ox + Math.round((STATIONS[i].dist - d0) / (d1 - d0) * MAP.w);
    const next = i === sim.station + (sim.state === 'STOPPED' ? 0 : 1);
    if (i <= sim.station || (next && Math.floor(sim.clock * 3) & 1)) { g.fillStyle = PALETTE.glow; g.fillRect(x, oy + 4, 1, 1); }
  }
  const tx = ox + Math.round((sim.dist - d0) / (d1 - d0) * MAP.w);
  g.fillStyle = PALETTE.green; g.fillRect(tx - 5, oy + 2, 3, 2);       // carriage
  g.fillStyle = PALETTE.blue;  g.fillRect(tx - 1, oy + 1, 3, 3);       // locomotive
  g.fillStyle = PALETTE.glow;  g.fillRect(tx + 2, oy + 2, 1, 1);       // headlight
}
