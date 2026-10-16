'use strict';
// js/10-stations/props.js
// Defines: buildProps

function buildProps(p, lit) {
  return {
    // lamp post: lantern head, warm dithered halo after dark
    lamp: prop(15, 64, 7, 63, g => {
      if (lit) glowHalo(g, 7, 8, 2, 7, 4);
      rect(g, 7, 9, 1, 52, p.grayDark);
      rect(g, 6, 61, 3, 3, p.gray);
      rect(g, 5, 6, 5, 1, p.grayDark);
      rect(g, 6, 7, 3, 2, lit ? PALETTE.glow : p.cloudShade);
      rect(g, 6, 9, 3, 1, p.grayDark);
    }),
    bench: prop(10, 5, 0, 4, g => {
      rect(g, 0, 0, 10, 1, p.brown);                     // backrest
      rect(g, 0, 1, 10, 1, p.brownDark);
      rect(g, 0, 2, 10, 1, p.tan);                       // seat
      rect(g, 1, 3, 1, 2, p.grayDark);
      rect(g, 8, 3, 1, 2, p.grayDark);
    }),
    bin: prop(4, 6, 1, 5, g => {
      rect(g, 0, 0, 4, 1, p.grayLight);
      rect(g, 0, 1, 4, 5, p.blue);
      rect(g, 3, 1, 1, 5, p.navy);
      px(g, 1, 2, p.white);
    }),
    // water tap: standpipe, spout, basin and a drip
    tap: prop(7, 9, 3, 8, g => {
      rect(g, 3, 1, 1, 6, p.grayDark);
      rect(g, 3, 0, 3, 1, p.gray);
      px(g, 5, 1, p.gray);
      px(g, 2, 0, p.red);
      px(g, 5, 3, p.skyLight);
      rect(g, 0, 7, 7, 1, p.grayLight);
      rect(g, 1, 8, 5, 1, p.gray);
    }),
    // old railway lamp post: fluted cast-iron foot, collar, ladder bar, glass lantern with a cap and finial
    ironlamp: prop(15, 70, 7, 69, g => {
      if (lit) glowHalo(g, 7, 10, 2, 8, 4);
      rect(g, 4, 67, 7, 3, p.grayDark); rect(g, 5, 65, 5, 2, p.gray);                    // stepped plinth
      rect(g, 6, 50, 3, 15, p.grayDark); rect(g, 6, 50, 1, 15, p.gray);                  // fluted lower shaft
      rect(g, 5, 49, 5, 1, p.gray); rect(g, 5, 48, 5, 1, p.grayDark);                    // collar
      rect(g, 7, 14, 1, 34, p.grayDark);                                                 // slim upper shaft
      rect(g, 4, 24, 7, 1, p.grayDark); px(g, 3, 23, p.grayDark); px(g, 11, 23, p.grayDark);   // ladder bar
      px(g, 6, 16, p.grayDark); px(g, 8, 16, p.grayDark); px(g, 5, 15, p.grayDark); px(g, 9, 15, p.grayDark);   // scroll brackets
      rect(g, 5, 14, 5, 1, p.grayDark);                                                  // lantern seat
      rect(g, 5, 8, 1, 6, p.grayDark); rect(g, 9, 8, 1, 6, p.grayDark);                  // lantern frame
      rect(g, 6, 8, 3, 6, lit ? PALETTE.glow : p.skyLight);                              // glass
      if (!lit) { px(g, 6, 9, p.white); px(g, 8, 12, p.skyMid); }
      rect(g, 4, 7, 7, 1, p.grayDark); rect(g, 5, 6, 5, 1, p.grayDark); rect(g, 6, 5, 3, 1, p.grayDark);   // pointed cap
      px(g, 7, 4, p.grayDark); px(g, 7, 3, p.gray);                                      // finial
    }),
    // wooden slats on cast-iron ends with scrolled arms
    woodbench: prop(14, 7, 0, 6, g => {
      rect(g, 1, 0, 12, 1, p.brown); rect(g, 1, 1, 12, 1, p.tan);                        // backrest slats
      rect(g, 1, 3, 12, 1, p.tan); rect(g, 1, 4, 12, 1, p.brown);                        // seat slats
      rect(g, 0, 0, 1, 7, p.grayDark); rect(g, 13, 0, 1, 7, p.grayDark);                 // iron ends
      px(g, 1, 2, p.grayDark); px(g, 12, 2, p.grayDark); px(g, 1, 5, p.grayDark); px(g, 12, 5, p.grayDark);
      rect(g, 0, 6, 2, 1, p.grayDark); rect(g, 12, 6, 2, 1, p.grayDark);
      px(g, 4, 0, p.brownDark); px(g, 9, 4, p.brownDark);                                // weathered knots
    }),
    // Jhau trees at the platform ends
    jhau0: prop(27, 80, 13, 79, g => jhauTree(g, p, 13, 79, 76, 11)),
    jhau1: prop(27, 74, 13, 73, g => jhauTree(g, p, 13, 73, 70, 23)),
    jhau2: prop(27, 62, 13, 61, g => jhauTree(g, p, 13, 61, 58, 37)),
    stall: prop(27, 26, 0, 25, g => paintStall(g, p, lit)),
    stallTea: prop(27, 26, 0, 25, g => paintStall(g, p, lit, false, true)),
    stallCart: prop(27, 26, 0, 25, g => paintStall(g, p, lit, true)),
    basket0: fishBasket(p, 0), basket1: fishBasket(p, 1), basket2: fishBasket(p, 2),
    sleeper: prop(13, 4, 1, 3, g => {                                   // a discarded wooden railway sleeper
      rect(g, 0, 0, 13, 3, p.brown); rect(g, 0, 0, 13, 1, p.tan); rect(g, 0, 2, 13, 1, p.brownDark);
      px(g, 3, 1, p.brownDark); px(g, 8, 1, p.brownDark); rect(g, 12, 0, 1, 3, p.brownDark);
    }),
    bricks: prop(11, 7, 0, 6, g => {                                    // a pile of old bricks
      for (const [x, y, w] of [[0, 4, 3], [4, 4, 3], [8, 4, 3], [2, 2, 3], [6, 2, 3], [4, 0, 3]]) { rect(g, x, y, w, 2, (x + y) % 3 ? p.rust : p.red); px(g, x, y, p.brown); }
      rect(g, 0, 6, 11, 1, p.brownDark);
    }),
    shop0: shopProp(p, lit, 0), shop1: shopProp(p, lit, 1), shop2: shopProp(p, lit, 2), shop3: shopProp(p, lit, 3), shop4: shopProp(p, lit, 4),
    // plywood tea chests, banded and stencilled, waiting for the goods train
    chests: prop(11, 10, 5, 9, g => {
      for (const [x, y, w] of [[0, 5, 11], [2, 0, 7]]) {
        rect(g, x, y, w, 5, p.tan);
        rect(g, x, y, w, 1, p.cream);
        rect(g, x + w - 1, y, 1, 5, p.brown);
        rect(g, x, y + 2, w - 1, 1, p.brown);                 // metal band
        px(g, x + 2, y + 3, p.brownDark); px(g, x + 3, y + 3, p.brownDark);   // stencil
      }
      rect(g, 0, 9, 11, 1, p.brownDark);
    }),
  };
}
