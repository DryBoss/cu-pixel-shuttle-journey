'use strict';
// js/13-driver/reset.js
// Defines: resetDrive, setDriveMode

function resetDrive() {
  const P = drive.pts;
  P.stops = P.time = P.pax = P.penalty = 0;
  drive.comfort = 100; drive.pax = 0; drive.final = null; drive.tripT = 0;
  drive.lever = drive.throttle = drive.brake = 0; drive.brakeAcc = drive.brakeCmd = drive.brakeEff = drive.brakeWait = 0; drive.over = false;
  drive.vel = 0; drive.slip = drive.climbing = false; drive.heavy = null; drive.heavyAge = drive.neutralT = drive.neutralMax = drive.bangCd = 0;
  toasts.length = 0; popPool.n = 0;
  hornOff();
  if (drive.on) { setEngine('OFF'); drive.rpm = 0; }
}

// AUTO hands the train to the driver, or takes it back, wherever it is
function setDriveMode(on) {
  if (on === drive.on) return;
  drive.on = on;
  ui.speed = 1;
  toasts.length = 0;
  if (on) {
    drive.lever = drive.throttle = drive.brake = 0; drive.brakeAcc = drive.brakeCmd = drive.brakeEff = drive.brakeWait = 0;
    drive.vel = sim.speed; drive.slip = false; drive.heavy = null; drive.heavyAge = drive.neutralT = drive.neutralMax = 0;
    drive.tripT = (journeyHour() - CONFIG.HOUR_START) / HOURS_PER_S;     // the clock carries on
    if (sim.state !== 'STOPPED') sim.state = 'DRIVING';
    else if (sim.stopPhase === 'HORN') setStopPhase('CLEAR');
    toast('YOU HAVE THE CONTROLS', 'glow');
  } else {
    hornOff();
    if (drive.engine === 'OFF' || drive.engine === 'SHUTDOWN') startEngine();
    closeManual();
    auto.tick = 0; auto.n = drive.brake;                // the autopilot picks up wherever the driver left the train
    if (sim.state === 'DRIVING') {
      const st = STATIONS[sim.station + 1], o = st ? sim.dist - st.dist : 0, w = st && stopWindow(st);
      if (st && (sim.speed < 1 || st.index === LAST_STATION) && o >= w[0] && o <= w[1]) {
        arrive(st.index, o);                             // standing at (or rolling into) the platform
      } else if (st && o > w[1]) missStation(false);     // already past the platform: on to the next stop
    }
  }
  syncButtons();
}
