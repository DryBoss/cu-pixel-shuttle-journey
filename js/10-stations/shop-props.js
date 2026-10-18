'use strict';
// js/10-stations/shop-props.js
// Defines: shopProp, fishBasket, paintStall

// Small station shops along the front of the platform: striped awning, a counter
// and goods that depend on the kind (0 tea, 1 fruit, 2 snacks, 3 books, 4 cold drinks,
// 5 a bookstall full of colourful magazines, 6 a blue-and-white cold drink stand)
function shopProp(p, lit, kind) {
  const awn = [['red', 'cream'], ['green', 'white'], ['blue', 'cream'], ['orange', 'white'], ['purple', 'cream'], ['orange', 'white'], ['blue', 'white']][kind];
  return prop(24, 16, 12, 15, g => {
    rect(g, 2, 3, 20, 7, p.brownDark);
    for (let x = 0; x < 24; x++) rect(g, x, 0, 1, 3, (x >> 1) & 1 ? p[awn[1]] : p[awn[0]]);
    for (let x = 0; x < 24; x += 2) px(g, x, 3, p[awn[0]]);
    rect(g, 1, 3, 1, 13, p.brown); rect(g, 22, 3, 1, 13, p.brown);
    px(g, 12, 4, lit ? PALETTE.glow : p.cloudShade);
    if (kind === 0) { rect(g, 4, 6, 4, 4, p.grayLight); px(g, 8, 7, p.grayLight); rect(g, 10, 8, 2, 2, p.white); rect(g, 14, 8, 2, 2, p.white); rect(g, 17, 5, 4, 5, p.skyLight); }
    else if (kind === 1) { for (let x = 3; x < 21; x += 4) { rect(g, x, 6, 3, 3, p[['red', 'orange', 'grassLight', 'paddy'][(x >> 2) % 4]]); } }
    else if (kind === 2) { for (let x = 3; x < 21; x += 3) { rect(g, x, 4, 2, 4, p[['red', 'blue', 'glow', 'green'][(x / 3 | 0) % 4]]); } }
    else if (kind === 3) { for (let x = 3; x < 21; x += 2) rect(g, x, 5, 1, 5, p[['red', 'blue', 'green', 'paddy', 'purple'][(x >> 1) % 5]]); }
    else if (kind === 4) { for (let x = 4; x < 21; x += 3) { rect(g, x, 5, 2, 5, p[['green', 'orange', 'red', 'skyMid'][(x / 3 | 0) % 4]]); px(g, x, 4, p.white); } }
    else if (kind === 5) {                                 // magazines in two rows: little blocks of colour, a white title strip on each
      const cols = ['red', 'blue', 'glow', 'green', 'purple', 'orange', 'rose', 'skyMid'];
      for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) {
        const x = 3 + i * 3, y = 4 + r * 3, col = cols[(i * 3 + r * 5) % cols.length];
        rect(g, x, y, 2, 3, p[col]); px(g, x, y, p.white); px(g, x + 1, y + 1, p[cols[(i + r + 3) % cols.length]]);
      }
      rect(g, 21, 4, 1, 6, p.cream); px(g, 21, 5, p.ink); px(g, 21, 7, p.ink);        // newspapers pegged on a string
    } else {                                               // cold drinks: a blue-and-white fridge, bottles and a cooler box
      rect(g, 3, 4, 7, 6, p.white); rect(g, 3, 4, 7, 1, p.blue); rect(g, 4, 5, 5, 4, p.skyLight);
      for (let x = 4; x < 9; x++) { px(g, x, 6, p[['red', 'orange', 'green', 'glow', 'blue'][x % 5]]); px(g, x, 8, p[['green', 'red', 'orange', 'blue', 'glow'][x % 5]]); }
      rect(g, 13, 7, 7, 3, p.blue); rect(g, 13, 7, 7, 1, p.white);
      for (let x = 12; x < 20; x += 2) { rect(g, x, 5, 1, 2, p[['orange', 'red', 'green'][(x >> 1) % 3]]); px(g, x, 5, p.white); }
    }
    rect(g, 2, 10, 20, 6, p.brown); rect(g, 2, 10, 20, 1, p.tan);
    rect(g, 2, 14, 20, 1, p.brownDark);
  });
}

// Woven basket heaped with silver fish (Bhairab is a big fish market)
function fishBasket(p, v) {
  return prop(9, 6, 4, 5, g => {
    rect(g, 1, 2, 7, 1, p.brownDark);
    for (let y = 3; y < 6; y++) for (let x = 1 + (y === 5); x < 8 - (y === 5); x++) px(g, x, y, (x + y) & 1 ? p.tan : p.brown);
    const fish = [p.grayLight, p.white, p.skyLight, v === 2 ? p.rose : p.cloudShade];
    for (let x = 2; x < 7; x++) px(g, x, 1, fish[(x + v) % 4]);
    for (let x = 3 - (v === 1); x < 6 + (v === 1); x++) px(g, x, 0, fish[(x + v + 1) % 4]);
    px(g, 4, 1, p.ink);
  });
}

// Tea stall: striped awning, kettle on a clay stove, glass jars, bulb
function paintStall(g, p, lit, cart, lively) {
  rect(g, 2, 4, 23, 12, p.brownDark);                    // dim interior
  rect(g, 3, 8, 21, 1, p.brown);                         // back shelf
  for (const [x, k] of [[4, 'red'], [6, 'paddy'], [8, 'white'], [22, 'skyMid']]) px(g, x, 7, p[k]);
  stamp(g, ['yy', 'yyy', '.y'], 20, 5, { y: p.paddy });  // hanging banana bunch
  // the tea seller behind the counter
  rect(g, 14, 10, 3, 1, p.ink);
  px(g, 14, 11, p.ink); rect(g, 15, 11, 2, 2, p.brown);
  rect(g, 13, 13, 5, 3, p.white);
  // bare bulb on a cord
  rect(g, 11, 3, 1, 2, p.ink);
  if (lit) glowHalo(g, 11, 5, 1.2, 4.6, 5);
  px(g, 11, 5, lit ? PALETTE.glow : p.cloudShade);
  // striped awning and posts
  rect(g, 0, 0, 27, 1, p.rust);
  for (let x = 0; x < 27; x++) rect(g, x, 1, 1, 2, (x >> 1) & 1 ? p.cream : p.red);
  for (let x = 0; x < 27; x += 2) px(g, x, 3, p.red);
  rect(g, 1, 3, 1, 23, p.brown);
  rect(g, 25, 3, 1, 23, p.brown);
  // clay stove with a glowing fire, aluminium kettle with spout
  rect(g, 3, 14, 6, 2, p.rust);
  px(g, 5, 15, PALETTE.amber);
  rect(g, 4, 11, 4, 3, p.grayLight);
  rect(g, 5, 10, 2, 1, p.gray);
  rect(g, 5, 9, 2, 1, p.ink);
  px(g, 8, 12, p.grayLight);
  px(g, 9, 11, p.grayLight);
  // glass jars of biscuits and sweets
  for (const [x, k, lid] of [[10, 'tan', 'red'], [18, 'red', 'blue'], [21, 'paddy', 'green']]) {
    rect(g, x, 12, 3, 1, p[lid]);
    rect(g, x, 13, 3, 3, p.skyLight);
    rect(g, x + 1, 14, 1, 2, p[k]);
  }
  if (lively) {                                            // a busy stall: hot stove, more jars, snack strings, tumblers
    rect(g, 4, 15, 3, 1, p.ink);                           // firebox mouth
    px(g, 4, 15, PALETTE.amber); px(g, 5, 15, PALETTE.glow); px(g, 6, 15, PALETTE.amber);
    px(g, 5, 14, PALETTE.red); px(g, 8, 13, p.cloudShade); // a spark and curl of smoke
    if (lit) glowHalo(g, 5, 15, 2, 6, 5);
    for (const [x, k, lid] of [[13, 'orange', 'red'], [16, 'tan', 'green']]) {         // jars on the back shelf
      rect(g, x, 5, 2, 1, p[lid]); rect(g, x, 6, 2, 2, p.skyLight); px(g, x, 7, p[k]); px(g, x + 1, 7, p[k]);
    }
    for (let x = 3; x < 10; x += 2) rect(g, x, 4, 1, 2, p[['red', 'glow', 'blue', 'orange'][(x >> 1) & 3]]);   // hanging snack packets
    px(g, 19, 12, p.skyLight); px(g, 21, 12, p.skyLight); px(g, 23, 12, p.skyLight);    // tea glasses on the counter
    px(g, 10, 11, p.white); px(g, 12, 11, p.white);                                      // steaming cups ready to go
  }
  // counter
  rect(g, 0, 16, 27, 1, p.tan);
  rect(g, 1, 17, 25, 9, p.brown);
  rect(g, 2, 19, 23, 2, p.green);
  for (let x = 4; x < 24; x += 3) px(g, x, 20, p.cream);
  rect(g, 2, 23, 23, 1, p.brownDark);
  if (cart) {                                              // a wooden cart: planks, wheels, a glowing clay stove
    for (let x = 4; x < 24; x += 3) rect(g, x, 21, 1, 3, p.brownDark);
    rect(g, 1, 24, 25, 1, p.brownDark);
    for (const wx of [6, 20]) { disc(g, wx, 23, 3, p.ink); disc(g, wx, 23, 2, p.tan); px(g, wx, 23, p.ink); px(g, wx, 21, p.ink); px(g, wx, 25, p.ink); px(g, wx - 2, 23, p.ink); px(g, wx + 2, 23, p.ink); }
    px(g, 5, 15, PALETTE.red); px(g, 4, 15, PALETTE.amber); px(g, 6, 15, PALETTE.amber);
  }
}
