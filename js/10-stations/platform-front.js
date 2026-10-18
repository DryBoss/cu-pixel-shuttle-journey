'use strict';
// js/10-stations/platform-front.js
// Defines: frontItems, drawStationFront, drawStopMark, drawBuffer, drawProp

// --- near-side platform: slab, then furniture and people sorted by depth
const frontItems = [], byY = (a, b) => a.y - b.y;
function drawStationFront(g, v) {
  const cam = Math.floor(sim.dist);
  for (let i = 0; i < STATIONS.length; i++) {
    const st = STATIONS[i], off = st.dist - cam;
    if (st.platform[0] + off >= W + 40 || st.platform[1] + off <= -40) continue;
    const s = v.stations[i];
    g.drawImage(s.slab, st.platform[0] + off, PLAT.TOP);
    if (st.grove) drawGrove(g, v, st, off);
    if (drive.on && !ui.title) drawStopMark(g, v, off);
    if (i === LAST_STATION) drawBuffer(g, v, off);
    frontItems.length = 0;
    for (let k = 0; k < st.layout.length; k++) frontItems.push(st.layout[k]);
    for (let k = 0; k < sim.people.length; k++) { const q = sim.people[k]; if (q.st === i && !q.hidden) frontItems.push(q); }
    frontItems.sort(byY);
    for (let k = 0; k < frontItems.length; k++) { const it = frontItems[k]; it.d ? drawPersonAt(g, v, it, off) : drawProp(g, v, st, it, off); }
    if (s.roof) g.drawImage(s.roof, s.roofX + off, s.roofY);
  }
}

// Where a driver stops: a board at the platform edge, level with the
// loco's nose when the train stands on the mark
function drawStopMark(g, v, off) {
  const p = v.p, x = CONFIG.TRAIN_FRONT_X + 2 + off;
  if (x < -4 || x > W + 4) return;
  rect(g, x, 149, 1, 8, p.grayDark);
  rect(g, x - 2, 144, 5, 5, p.ink);
  rect(g, x - 1, 145, 3, 3, p.glow);
  px(g, x, 146, p.ink);
}

// The end of the line at Sylhet: a striped buffer beam on a braced frame
function drawBuffer(g, v, off) {
  const p = v.p, x = CONFIG.TRAIN_FRONT_X + BUFFER_O + 2 + off;
  if (x < -16 || x > W + 4) return;
  rect(g, x + 3, 131, 2, 15, p.grayDark);              // post with a lamp on top
  px(g, x + 3, 131, PALETTE.red);
  rect(g, x, 135, 3, 6, p.red);                        // buffer beam at the height of the loco's
  for (let y = 136; y < 141; y += 2) rect(g, x, y, 3, 1, p.white);
  for (let k = 0; k < 8; k++) px(g, x + 5 + k, 138 + k, p.gray);   // brace
  rect(g, x - 1, 146, 16, 1, p.grayDark);
}

function drawProp(g, v, st, it, off) {
  const p = v.p, x = it.x + off;
  if (it.type === 'pillar') {
    const top = ROOFS[st.roof].pillarTop, h = it.y - top + 1;
    if (st.village) {                                    // bamboo culms and treated wooden posts, lashed at the top
      if (it.x === 226) {
        rect(g, x - 1, top, 3, h, p.brown); rect(g, x + 1, top, 1, h, p.brownDark); rect(g, x - 1, top, 1, h, p.tan);
        for (let y = top + 6; y < it.y - 2; y += 7) px(g, x, y, p.brownDark);
        rect(g, x - 2, it.y - 2, 5, 2, p.gray);
      } else {
        rect(g, x - 1, top, 3, h, p.paddy); rect(g, x - 1, top, 1, h, p.cream); rect(g, x + 1, top, 1, h, p.brown);
        for (let y = top + 5; y < it.y - 2; y += 9) { rect(g, x - 2, y, 5, 1, p.brown); px(g, x - 2, y + 1, p.brownDark); }
        px(g, x, it.y - 1, p.greenDark); px(g, x + 1, it.y - 2, p.grass);
      }
      rect(g, x - 2, top, 5, 2, p.brownDark); px(g, x - 2, top + 2, p.tan); px(g, x + 2, top + 2, p.tan);   // rope lashing
    } else if (st.roof === 'umbrella') {                 // round concrete column
      rect(g, x - 1, top, 3, h, p.cloudShade);
      rect(g, x + 1, top, 1, h, p.grayLight);
      rect(g, x - 2, it.y - 1, 5, 2, p.grayLight);
    } else if (st.roof === 'military') {                 // thick concrete pillar painted white with a deep-green base
      rect(g, x - 2, top, 5, h, p.white); rect(g, x + 2, top, 1, h, p.cloudShade);
      rect(g, x - 3, top, 7, 2, p.cloudShade); rect(g, x - 3, top + 1, 7, 1, p.gray);
      rect(g, x - 2, it.y - 12, 5, 12, p.greenDark); rect(g, x - 2, it.y - 12, 5, 1, p.greenDeep); rect(g, x + 2, it.y - 12, 1, 12, p.greenDeep);
      rect(g, x - 3, it.y - 2, 7, 2, p.greenDeep);
    } else if (st.roof === 'junction') {                 // thick, sturdy concrete pillar with a capital, a painted band and a grimy foot
      rect(g, x - 2, top, 5, h, p.cloudShade);
      rect(g, x - 2, top, 1, h, p.white); rect(g, x + 2, top, 1, h, p.gray);
      rect(g, x - 3, top, 7, 2, p.grayLight); rect(g, x - 3, top + 1, 7, 1, p.gray);
      rect(g, x - 2, top + 22, 5, 3, p.blue); rect(g, x - 2, top + 25, 5, 1, p.white);
      rect(g, x - 3, it.y - 3, 7, 3, p.grayLight); rect(g, x - 3, it.y - 1, 7, 1, p.gray);
      ditherRect(g, x - 2, it.y - 12, 5, 9, p.gray, 4);
    } else if (st.roof === 'shed') {                     // thin painted cast-iron post with small triangular brackets
      rect(g, x, top, 2, h, p.greenDark);
      rect(g, x, top, 1, h, p.green);
      rect(g, x - 1, it.y - 2, 4, 2, p.grayDark); rect(g, x - 1, it.y - 7, 4, 1, p.grayLight);
      for (let j = 0; j < 5; j++) { rect(g, x - (5 - j), top + j, 5 - j, 1, p.greenDark); rect(g, x + 2, top + j, 5 - j, 1, p.greenDark); }
    } else {                                             // painted iron post with brackets
      rect(g, x, top, 2, h, p.grayDark);
      rect(g, x, top, 1, h, p.gray);
      px(g, x - 1, top, p.grayDark);
      px(g, x + 2, top, p.grayDark);
    }
  } else if (it.type === 'board') {
    const b = v.stations[st.index].board;
    g.drawImage(b, x - (b.width >> 1), BOARD_TOP);
  } else {
    const spr = v.props[it.key || it.type];
    g.drawImage(spr.c, x - spr.ax, it.y - spr.ay);
    if (it.type === 'lamp') addLight(x, it.y - (it.key === 'ironlamp' ? 62 : 55), LIGHT_LAMP);
    else if (it.type === 'stall') {
      drawSteam(g, v, x + 9, it.y - 15); addLight(x + 11, it.y - 20, LIGHT_BULB);
      if (it.key === 'stallTea') addLight(x + 5, it.y - 10, LIGHT_BULB);               // the clay stove glows too
    }
  }
}
