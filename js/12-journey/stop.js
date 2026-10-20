'use strict';
// js/12-journey/stop.js
// Defines: updateStop

function updateStop(dt) {
  const st = STATIONS[sim.station], terminus = sim.station === LAST_STATION, auto = !drive.on;
  sim.phaseT += dt;
  switch (sim.stopPhase) {
    case 'SETTLE':
      if (sim.phaseT >= CONFIG.SETTLE_TIME) setStopPhase('DOORS_OPEN');
      break;
    case 'READY':                                         // the driver opens the doors
      if (auto) setStopPhase('DOORS_OPEN');
      break;
    case 'DOORS_OPEN':
      startBoarding(st); setStopPhase('BOARDING');
      break;
    case 'BOARDING':
      if ((sim.phaseT > 1 && boardingDone(st)) || sim.phaseT >= (terminus ? CONFIG.BOARD_TIMEOUT * 2.5 : CONFIG.BOARD_TIMEOUT)) setStopPhase(terminus ? 'PARKED' : 'WAIT');
      break;
    case 'BOARDED':                                       // the driver closes the doors
      if (auto) setStopPhase('DOORS_CLOSE');
      else if (terminus && drive.engine === 'OFF') setStopPhase('TERMINUS');
      break;
    case 'DOORS_CLOSE':
      sim.doorOpen = Math.max(0, 1 - sim.phaseT / CONFIG.DOOR_TIME);
      if (sim.doorOpen <= 0) setStopPhase(terminus ? 'PARKED' : 'WAIT');
      break;
    case 'WAIT':                                          // a driver early on the timetable waits for departure time
      if (auto || drive.tripT >= SCHEDULE[sim.station].dep - CONFIG.FLAG_TIME) setStopPhase('FLAG');
      break;
    case 'FLAG':                                          // guard waves the green flag
      if (sim.phaseT < CONFIG.FLAG_TIME) break;
      if (auto) { setStopPhase('HORN'); playHorn(false); }
      else { setStopPhase('CLEAR'); toast('ALL CLEAR - DEPART', 'grassLight'); }
      break;
    case 'CLEAR':                                         // the driver takes the train out
      if (auto) { setStopPhase('HORN'); playHorn(false); }
      break;
    case 'HORN':
      if (sim.phaseT >= CONFIG.HORN_TIME) { setState('DRIVING'); sim.shake = Math.max(sim.shake, 1.2); }   // AUTO pulls out: the autopilot opens the power
      break;
    case 'PARKED':                                        // the driver shuts the engine down
      if (auto || drive.engine === 'OFF') setStopPhase('TERMINUS');
      break;
    case 'TERMINUS':
      if (sim.phaseT >= 1.5 && !ui.complete) finishJourney();
      break;
  }
}
