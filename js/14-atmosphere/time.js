'use strict';
// js/14-atmosphere/time.js
// Defines: journeyHour, updateHour

// =====================================================================
// 8b. ATMOSPHERE: time of day, sky, weather, glow and effects
// =====================================================================
// --- time of day -------------------------------------------------------
// sim.hour eases towards its target - the trip's own clock (AUTO) or the
// hour picked with the time button - so it never jumps
function journeyHour() {
  const d0 = STATIONS[0].dist, d1 = STATIONS[LAST_STATION].dist;
  const p = Math.max(0, Math.min(1, (sim.dist - d0) / (d1 - d0)));
  return CONFIG.HOUR_START + p * (CONFIG.HOUR_END - CONFIG.HOUR_START);
}

function updateHour(dt) {
  // AUTO follows the distance travelled; a driver's day runs on the timetable clock
  const fixed = TIME_MODES[ui.timeMode][1];
  const target = fixed !== null ? fixed : drive.on ? Math.min(23.9, tripHour(drive.tripT)) : journeyHour();
  const diff = ((target - sim.hour + 36) % 24) - 12, step = CONFIG.HOUR_EASE * dt;   // shortest way round
  sim.hour = (sim.hour + Math.max(-step, Math.min(step, diff)) + 24) % 24;
  sim.night = nightAt(sim.hour);
}
