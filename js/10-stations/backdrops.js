'use strict';
// js/10-stations/backdrops.js
// Defines: BACKDROPS

// --- station backdrops: drawn in a parallax layer behind the line ------
// sx is the sprite's screen x while the train stands at the station.
const BACKDROPS = {
  city:  { layer: 'far', sx: -300, y: 62,  build: buildCity },    // Dhaka skyline
  bottoli: { layer: 'mid', sx: -420, y: 56, build: buildBottoli }, // the old terminal and its yard
  jhawtola: { layer: 'mid', sx: -20, y: 52, build: buildJhawtola }, // Jhawtola's station building
  polytechnic: { layer: 'mid', sx: POLY_SX, y: 46, build: buildPolytechnic }, // Polytechnic's long boundary wall under mango and jackfruit crowns
  foteyabad: { layer: 'mid', sx: -5, y: 60, build: buildFoteyabad }, // Foteyabad's red-brick station
  cu: { layer: 'mid', sx: -100, y: 30, build: buildCU },            // the university station, far side
  sholoshahar: { layer: 'mid', sx: -5, y: 56, build: buildSholoshohor }, // the junction's station building and signal cabin
  cantt: { layer: 'mid', sx: -460, y: 62, build: buildCantt },      // the army's yellow train and its guards
};
