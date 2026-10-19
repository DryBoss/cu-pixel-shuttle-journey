'use strict';
// js/13-driver/state.js
// Defines: drive, EB, leverLabel

// =====================================================================
// 8a. DRIVER MODE
// =====================================================================
// The player at the controls: start the engine, work one combined lever
// (power notches up, brake steps down), stop with every door along the
// platform, open and close the doors, wait for the guard's flag, keep to
// the speed limits and the timetable. Score: stopping accuracy,
// punctuality, passengers carried and their comfort, minus penalties.
const drive = {
  on: false,                               // DRIVE mode; AUTO when false
  engine: 'OFF', engineT: 0, rpm: 0,       // OFF | CRANK | ON | SHUTDOWN; rpm 0..1 (0.3 = idle)
  lever: 0, accel: 0,                      // derived: -5 emergency, -4..-1 brake, 0 coast, 1..8 power
  throttle: 0, brake: 0, brakeAcc: 0,      // the two handles: throttle 0..8; brake 0 release, 1..4 service, 5 emergency
  vel: 0,                                  // signed speed along the line (sim.speed is its size): negative = rolling back down the hill
  brakeCmd: 0, brakeEff: 0, brakeWait: 0,  // what the handle asks for, what the pipe has delivered, s until it arrives; brakeAcc is the pressure in the cylinders
  grade: 0, climbing: false,               // the slope under the train 0..1, and whether we have said so
  slip: false, slipT: 0,                   // wheel slip
  heavy: null, heavyAge: 0, neutralT: 0, neutralMax: 0, bangCd: 0,   // coupler slack bookkeeping
  headlight: true, horn: false,
  tripT: 0,                                // s since the trip began: the timetable clock
  limit: CONFIG.DRIVE.LIMIT, over: false, beepT: 0,
  pts: { stops: 0, time: 0, pax: 0, penalty: 0 }, comfort: 100, pax: 0,
  final: null,                             // the score card once the trip is complete
};
const EB = -CONFIG.DRIVE.BRAKES - 1;       // the emergency brake position
const leverLabel = n => n > 0 ? 'P' + n : n === EB ? 'EB' : n < 0 ? 'B' + -n : 'N';
