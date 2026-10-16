'use strict';
// js/10-stations/roof-styles.js
// Defines: ROOFS, BOARD_TOP

// =====================================================================
// 6. STATIONS
// =====================================================================
// Platforms are on the near side of the line, so passengers, benches and
// pillars stand in front of the train. Station content is laid out in
// "stop coordinates" - its screen x while the train stands there - so
//   screen x = stopX + station.dist - camera.

// Roof styles: y0/h of the roof sprite, pillarTop where pillars start
const ROOFS = {
  umbrella: { y0: 78, h: 14, pillarTop: 84 },            // Kamalapur's concrete umbrellas
  canopy:   { y0: 86, h: 7, pillarTop: 93, span: [30, 258] },
  shelter:  { y0: 93, h: 7, pillarTop: 100, span: [186, 266] },
  shed:     { y0: 78, h: 7, pillarTop: 85, span: [-300, 610] },     // Bottoli's long rusty shed on iron posts
};
const BOARD_TOP = 93;
