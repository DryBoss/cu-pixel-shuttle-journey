'use strict';
// js/13-driver/slack.js
// Defines: updateSlack, couplerBang

// Coupler slack: the carriages are held together by loose steel couplers. Go from heavy power straight
// to heavy brake (or the other way round) and the whole rake runs in or out against its couplers with a
// bang. Pausing at notch 0 for a moment lets the slack settle, so that is what the driver must do.
function updateSlack(dt) {
  const D = CONFIG.DRIVE, l = drive.lever;
  const kind = l >= D.SLACK_POWER ? 'P' : l <= -D.SLACK_BRAKE ? 'B' : null;
  drive.bangCd = Math.max(0, drive.bangCd - dt);
  drive.neutralT = l === 0 ? drive.neutralT + dt : 0;
  if (kind) {
    if (drive.heavy && drive.heavy !== kind && drive.neutralMax < D.SLACK_NEUTRAL && drive.heavyAge < D.SLACK_WINDOW &&
        sim.speed >= D.SLACK_MIN_SPEED && drive.bangCd <= 0 && sim.state === 'DRIVING' && !ui.complete) couplerBang();
    if (drive.heavy !== kind) { drive.heavy = kind; drive.neutralMax = 0; }
    drive.heavyAge = 0;
  } else if (drive.heavy) {
    drive.heavyAge += dt;
    drive.neutralMax = Math.max(drive.neutralMax, drive.neutralT);                    // how long it rested at notch 0 since the last heavy lever
    if (drive.heavyAge > D.SLACK_WINDOW) drive.heavy = null;
  }
}

function couplerBang() {
  const D = CONFIG.DRIVE;
  drive.bangCd = 4;
  drive.comfort = Math.max(0, drive.comfort - D.SLACK_COMFORT);
  sim.shake = Math.max(sim.shake, 3.6);
  playBang();
  toast('COUPLER SLACK! COMFORT -' + D.SLACK_COMFORT, 'red', true);
  toast('PAUSE AT NOTCH 0 FIRST', 'amber');
}
