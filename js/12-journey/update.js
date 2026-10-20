'use strict';
// js/12-journey/update.js
// Defines: updateJourney

// Both modes run the same train physics (13-driver/update.js): in DRIVE the player works the handles, in AUTO the
// autopilot (13-driver/autopilot.js) does. (The old scripted DEPARTING / TRAVELING / ARRIVING speed curves are gone.)
function updateJourney(dt) {
  if (ui.title) return;                                 // the train waits behind the title card
  updateDrive(dt);
}
