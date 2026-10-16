'use strict';
// js/13-driver/passengers.js
// Defines: screenXOf, passengerIn, passengerOut

// Passengers in and out: a head count, and a fare for the driver
const screenXOf = q => Math.round(q.x + STATIONS[q.st].dist - Math.floor(sim.dist));
function passengerIn(q) {
  q.gone = true;
  drive.pax++;
  if (drive.on) { drive.pts.pax += 10; popup(screenXOf(q), PLAT.DOOR_TOP - 6, '+10', 'glow'); }
}
function passengerOut(q) {
  drive.pax = Math.max(0, drive.pax - 1);
  if (drive.on) { drive.pts.pax += 10; popup(screenXOf(q), PLAT.DOOR_TOP - 6, '+10', 'white'); }
}
