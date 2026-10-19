'use strict';
// js/12-journey/state.js
// Defines: sim, smoothstep, setState, setStopPhase, arrive

// =====================================================================
// 8. JOURNEY STATE MACHINE
// =====================================================================
//   STOPPED --(stop routine)--> DEPARTING --(ACCEL_TIME)--> TRAVELING
//      ^                                                        |
//      +-------- ARRIVING <--(braking distance reached)---------+
//
// While STOPPED, a sub-phase runs the station routine:
//   SETTLE > DOORS_OPEN > BOARDING > DOORS_CLOSE > FLAG > HORN > (depart)
// and at the last station DOORS_CLOSE leads to PARKED > TERMINUS instead.
// In DRIVE mode (section 8a) the driver owns some steps, which wait for
// input: READY (open the doors), BOARDED (close them), CLEAR (depart),
// PARKED (stop the engine); between stations the state is DRIVING.
//
// Departing and arriving follow a smoothstep velocity curve (zero
// acceleration at both ends). Position is the exact integral of that
// curve, so the train always comes to rest exactly at the platform.
const sim = {
  state: 'STOPPED', stopPhase: 'SETTLE', phaseT: 0, timer: 0,
  speed: 0, dist: 0,                       // dist = world px travelled = camera x
  segStart: 0, segSpeed: 0, segDur: 0,     // current accel / brake segment
  station: 0,                              // index of the last station stopped at (or passed)
  stopOffset: 0,                           // how far past the stop mark the train stands (DRIVE)
  nextStop: 0,
  doorOpen: 1,                             // always open: this old local train's doors never close
  riders: null,                            // passengers standing in the doorways
  roof: null,                              // students on the engine's steps (the carriage roofs stay empty)
  wheelAngle: 0, swayPhase: 0, clock: 0, cloudDrift: 0,
  hour: CONFIG.HOUR_START, night: 1,       // time of day (0..24) and how dark it is (0..1)
  season: 'Winter', timePhase: 'Morning',  // the scenario: chosen independently (scenario.js)
  hourOffset: 0, wind: 0,                  // trip clock = journeyHour() + hourOffset; wind 0..1 from the season
  smokeAcc: 0, fluffAcc: 0, sparkAcc: 0,
  people: [], populated: new Set(),
  fxRng: null, wxRng: null,                // seeded: same birds, fluff and weather every trip
  onBridge: false, bridgeMix: 0,           // see updateBridge(); drives the bridge rumble
  shake: 0, hornWave: 0, hornTimer: 8, jointAcc: 0,
};

const smoothstep = u => u * u * (3 - 2 * u);

function setState(s) {
  sim.state = s;
  sim.timer = 0;
  sim.segStart = sim.dist;
  sim.stopPhase = null;
  if (s === 'ARRIVING') {
    // fit the braking curve to the remaining distance: d = v0 * T / 2
    sim.segSpeed = sim.speed;
    sim.segDur = Math.max(0.2, 2 * (sim.nextStop - sim.dist) / Math.max(1, sim.speed));
  } else if (s === 'DEPARTING') {
    sim.shake = 1.6;                                     // couplings snatch as the train pulls away
  } else if (s === 'STOPPED') {
    sim.speed = 0;
    setStopPhase('SETTLE');
    sim.nextStop = sim.station < LAST_STATION ? STATIONS[sim.station + 1].dist : Infinity;
  }
}

function setStopPhase(ph) {
  sim.stopPhase = ph;
  sim.phaseT = 0;
  if (drive.on) syncButtons();                          // the doors button says OPEN or CLOSE
}

// Come to rest at station i, o px past its stop mark
function arrive(i, o) {
  sim.station = i;
  sim.dist = STATIONS[i].dist + o;
  sim.stopOffset = o;
  setState('STOPPED');
}
