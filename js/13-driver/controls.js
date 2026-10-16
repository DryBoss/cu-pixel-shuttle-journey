'use strict';
// js/13-driver/controls.js
// Defines: syncLever, setThrottle, setBrake, setLever, toggleLight, toggleDoors

// --- controls ---------------------------------------------------------------
function syncLever() {                                  // the engine sees one signal: brake wins over power
  drive.lever = drive.brake > 0 ? -drive.brake : drive.throttle;
  syncButtons();
}
function setThrottle(n) {
  n = Math.max(0, Math.min(CONFIG.DRIVE.NOTCHES, n));
  if (n === drive.throttle) return;
  const was = drive.throttle;
  drive.throttle = n;
  playNotch();
  syncLever();
  if (n > 0 && was === 0) {
    if (drive.engine === 'OFF' || drive.engine === 'SHUTDOWN') toast('START THE ENGINE [E]', 'amber');
    else if (drive.brake > 0) toast('RELEASE THE BRAKE FIRST', 'amber');
  }
}
function setBrake(n) {
  n = Math.max(0, Math.min(5, n));
  if (n === drive.brake) return;
  const was = drive.brake;
  drive.brake = n;
  playNotch();
  syncLever();
  if (n === 5) { toast('EMERGENCY BRAKE!', 'red'); playAir(1.3, 0.14); }
  else if (n > was) playAir(0.4, 0.05);
  else if (n === 0) playAir(0.6, 0.05);                 // brakes released
}

function setLever(n) {
  const was = drive.lever;
  drive.lever = Math.max(EB, Math.min(CONFIG.DRIVE.NOTCHES, n));
  if (drive.lever === was) return;
  playNotch();
  if (drive.lever === EB) { toast('EMERGENCY BRAKE!', 'red'); playAir(1.3, 0.14); }
  else if (was < 0 && drive.lever >= 0 && sim.speed < 1) playAir(0.5, 0.04);    // brakes released
  if (drive.lever > 0 && was <= 0) {
    if (drive.engine === 'OFF' || drive.engine === 'SHUTDOWN') toast('START THE ENGINE [E]', 'amber');
  }
}

function toggleLight() {
  drive.headlight = !drive.headlight;
  playNotch();
  toast(drive.headlight ? 'HEADLIGHT ON' : 'HEADLIGHT OFF', 'white');
}

// The doors button: open them at a platform once stopped, close them after boarding
function toggleDoors() {
  if (sim.state === 'STOPPED') {
    switch (sim.stopPhase) {
      case 'SETTLE': case 'READY': setStopPhase('DOORS_OPEN'); playAir(0.6, 0.06); break;
      case 'BOARDING': toast('PASSENGERS STILL BOARDING', 'amber'); break;
      case 'BOARDED': setStopPhase('DOORS_CLOSE'); playChime(); break;
      case 'WAIT': case 'FLAG': case 'CLEAR': case 'PARKED': toast('DOORS LOCKED', 'grayLight'); break;
    }
    return;
  }
  if (sim.speed > 0.3) { toast('STOP THE TRAIN FIRST', 'amber'); return; }
  const st = STATIONS[sim.station + 1];
  if (!st) return;
  const o = sim.dist - st.dist, w = stopWindow(st);
  if (o < -400) toast('NO PLATFORM HERE', 'amber');
  else if (o < w[0]) toast('PLATFORM AHEAD - ' + Math.ceil(w[0] - o) + ' M', 'amber');
  else if (o > w[1]) toast('OVERSHOT THE PLATFORM', 'red');
  else {
    arrive(st.index, o);
    scoreArrival(st.index, o);
    setStopPhase('DOORS_OPEN');
    playAir(0.6, 0.06);
  }
}
