'use strict';
// js/01-config/scenario.js
// Defines: SEASONS, TIME_PHASES, seasonDef, phaseDef, seasonIndex

// =====================================================================
// SCENARIO MATRIX: Season x Time of Day, chosen independently.
// sim.season / sim.timePhase hold the ids below; every atmosphere system
// reads its numbers from these tables instead of from the old random timers.
// =====================================================================
//   rain       weather.target while this season lasts (0 = dry, 1 = downpour)
//   wind       0..1: bends the plants, slants the rain, drifts the fluff
//   lightning  strikes per second at full rain
//   fluff      0 = none, 'kash' = a thin drift of kash seeds over the kash fields
//   fog        fog density 0..1 by time phase ('other' for the rest)
//   mul        colour grade multiplied over the picture (rgb), bloom = blown-out brightening
const SEASONS = [
  { id: 'Winter',  name: 'WINTER',  short: 'WINTER',  bn: 'SHEETKAL',  col: 'skyLight',
    rain: 0, wind: 0.1,  lightning: 0,    fluff: 'kash', fog: { Morning: 1, Dusk: 0.35, Night: 0.45, other: 0.2 },
    mul: [196, 214, 255], bloom: 0 },
  { id: 'Summer',  name: 'SUMMER',  short: 'SUMMER',  bn: 'GRISMO',    col: 'glow',
    rain: 0, wind: 0,    lightning: 0,    fluff: 'kash', fog: { other: 0 },
    mul: [255, 248, 232], bloom: 0.16 },
  { id: 'Monsoon', name: 'MONSOON', short: 'MONSOON', bn: 'BORSHAKAL', col: 'blue',
    rain: 1, wind: 1,    lightning: 0.22, fluff: 0,      fog: { other: 0.25 },
    mul: [172, 182, 198], bloom: 0 },
];

// hour = where sim.hour snaps to (the trip's one-hour clock then runs on from it)
const TIME_PHASES = [
  { id: 'Morning',   name: 'MORNING',   short: 'MORN',  hour: 7.5 },
  { id: 'Midday',    name: 'MIDDAY',    short: 'NOON',  hour: 12.0 },
  { id: 'Afternoon', name: 'AFTERNOON', short: 'AFTN',  hour: 15.0 },
  { id: 'Dusk',      name: 'DUSK',      short: 'DUSK',  hour: 17.5 },
  { id: 'Night',     name: 'NIGHT',     short: 'NIGHT', hour: 20.5 },
];

const seasonIndex = () => Math.max(0, SEASONS.findIndex(s => s.id === sim.season));
const seasonDef = () => SEASONS[seasonIndex()];
const phaseDef = () => TIME_PHASES.find(p => p.id === sim.timePhase) || TIME_PHASES[0];
