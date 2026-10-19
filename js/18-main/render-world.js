'use strict';
// js/18-main/render-world.js
// Defines: renderWorld

// Everything that belongs to the landscape and lighting variant v. The sky
// is drawn once beforehand; this is drawn twice while two lightings blend.
function renderWorld(g, v) {
  const d = sim.dist;
  drawTiled(g, v.clouds, d * PARALLAX.clouds + sim.cloudDrift, LAYER_Y.clouds);   // 2. clouds
  drawCumulus(g, v, sectionWeight('kash', d));
  drawBackdrops(g, v, 'far');                                             //    Dhaka skyline
  drawTerrain(g, v, TL.far);                                              // 3. distant land
  drawTerrain(g, v, TL.tall);                                             //    chimneys and other tall things behind the mid layer
  drawTerrain(g, v, TL.mid);                                              // 4. fields, river, hills
  drawBackdrops(g, v, 'mid');
  drawOverpassBack(g, v);                                                //    Dewanhat flyover: the deck and the pier frame behind the train
  drawBirds(g, v);
  drawLine(g, v);                                                         // 5. poles, track, bridge
  drawTrain(g, v);
  drawOverpassFront(g, v);                                                //    the flyover's near pier frame, in front of the train
  drawSmoke(g, v);
  drawTruss(g, v, true);
  drawOverpassShade(g, v);                                                  //    lattice over the train
  drawTerrain(g, v, TL.fg, drawReflection);                               // 6. near ground / water
  drawExtraTracks(g, v);
  drawCrossings(g, v);                                                  //    the other lines at Bottoli
  drawStationFront(g, v);                                                 //    platform, people
  drawFluff(g, v);
}
