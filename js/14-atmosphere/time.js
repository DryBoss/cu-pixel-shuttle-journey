'use strict';
// js/14-atmosphere/time.js
// Defines: journeyHour, updateHour

// =====================================================================
// 8b. ATMOSPHERE: time of day, sky, weather, glow and effects
// =====================================================================
// --- time of day -------------------------------------------------------
// sim.hour eases towards its target - the trip's own clock, which starts at
// the scenario's hour (sim.hourOffset) - so it never jumps
function journeyHour() {
  const d0 = STATIONS[0].dist, d1 = STATIONS[LAST_STATION].dist;
  const p = Math.max(0, Math.min(1, (sim.dist - d0) / (d1 - d0)));
  return CONFIG.HOUR_START + p * (CONFIG.HOUR_END - CONFIG.HOUR_START);
}

function updateHour(dt) {
  // WATCH follows the distance travelled; a driver's day runs on the timetable clock.
  // Both start from the hour of the chosen time phase.
  const target = drive.on ? Math.min(23.9, tripHour(drive.tripT)) : (journeyHour() + sim.hourOffset) % 24;
  const diff = ((target - sim.hour + 36) % 24) - 12, step = CONFIG.HOUR_EASE * dt;   // shortest way round
  sim.hour = (sim.hour + Math.max(-step, Math.min(step, diff)) + 24) % 24;
  sim.night = nightAt(sim.hour);
}
