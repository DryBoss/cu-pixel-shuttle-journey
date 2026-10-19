'use strict';
// js/14-atmosphere/scenario.js
// Defines: setSeason, setTimePhase, cycleSeason, cycleTimePhase, rollScenario, announceScenario

// =====================================================================
// SCENARIO ENGINE: season and time of day are two independent switches.
// Everything below applies a choice IMMEDIATELY (no easing): rain, fog, fluff,
// and the hour all change on the frame the choice is made.
// =====================================================================

// Season: rain target and wind, fog and fluff. Does not touch the hour.
function setSeason(id) {
  sim.season = id;
  const S = seasonDef();
  weather.target = weather.level = S.rain;              // Monsoon snaps to 1; anything else snaps to 0 ...
  sim.wind = S.wind;
  weather.flashT = 9; weather.thunderIn = -1;
  if (S.rain === 0) {                                   // ... and clears the rain, splashes and any bolt on screen
    rainPool.n = splashPool.n = 0;
    weather.flash = 0; weather.boltN = 0; weather.acc = 0;
  }
  setFog();
  if (S.fluff === 0) fluffPool.n = 0;                   // no seeds in the wet
  sky.key = tint.key = -1;
}

// Time of day: snaps sim.hour to the phase's hour; the trip's one-hour clock runs on from there
function setTimePhase(id) {
  sim.timePhase = id;
  const P = phaseDef();
  sim.hourOffset = P.hour - journeyHour();
  sim.hour = P.hour;
  sim.night = nightAt(sim.hour);
  setFog();                                             // a Winter morning is thick with mist, Winter noon is not
  sky.key = tint.key = -1;
}

const SEASON_ORDER = SEASONS.map(s => s.id), PHASE_ORDER = TIME_PHASES.map(p => p.id);

function cycleSeason() {                                // the Season button (WATCH)
  setSeason(SEASON_ORDER[(SEASON_ORDER.indexOf(sim.season) + 1) % SEASON_ORDER.length]);
  const S = seasonDef();
  toast('SEASON: ' + S.name, S.col, false, true);
}
function cycleTimePhase() {                             // the Time button (WATCH)
  setTimePhase(PHASE_ORDER[(PHASE_ORDER.indexOf(sim.timePhase) + 1) % PHASE_ORDER.length]);
  toast('TIME: ' + phaseDef().name, 'white', false, true);
}

// The roll at the start of every journey: one season and one time of day, at random
function rollScenario() {
  setSeason(SEASON_ORDER[(Math.random() * SEASON_ORDER.length) | 0]);
  setTimePhase(PHASE_ORDER[(Math.random() * PHASE_ORDER.length) | 0]);
}

// "SCENARIO: MONSOON DUSK" - shown once the trip is actually under way
function announceScenario() {
  toast('SCENARIO: ' + seasonDef().name + ' ' + phaseDef().name, seasonDef().col, false, true);
}
