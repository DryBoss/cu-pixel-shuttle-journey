'use strict';
// js/10-stations/buffer-stop.js
// Defines: bufferStop

// A heavy steel buffer stop at the end of a yard line: a striped beam on a
// braced post, with the sprung buffer head pointing along the track
function bufferStop(g, p, x, wy, rusty) {
  rect(g, x - 7, wy + 9, 17, 1, rusty ? p.brown : p.grayDark);
  rect(g, x + 4, wy - 3, 3, 12, rusty ? p.rust : p.grayDark); rect(g, x + 4, wy - 3, 1, 12, rusty ? p.brown : p.gray);
  for (let k = 0; k < 9; k++) px(g, x + 7 + (k >> 1), wy + 1 + k, rusty ? p.rust : p.grayDark);
  rect(g, x, wy - 3, 4, 10, rusty ? p.rust : p.red);
  for (let y = wy - 2; y < wy + 7; y += 3) rect(g, x, y, 4, 1, rusty ? p.brown : p.white);
  rect(g, x - 4, wy, 4, 5, rusty ? p.brown : p.grayLight); rect(g, x - 4, wy, 4, 1, rusty ? p.rust : p.white); rect(g, x - 4, wy + 4, 4, 1, rusty ? p.brownDark : p.gray);
  rect(g, x - 2, wy - 2, 1, 2, rusty ? p.rust : p.grayLight);
  if (rusty) for (let j = -6; j < 8; j += 2) { px(g, x + j, wy + 8, p.green); px(g, x + j, wy + 7, p.grass); if (j % 4 === 0) px(g, x + j, wy + 6, p.green); }   // weeds at its feet
}
