'use strict';
// js/13-driver/update.js
// Defines: updateDrive, depart, checkArrival, checkSpeed, checkLine

// --- driving ----------------------------------------------------------------
// Traction follows the engine (it has to spool up), fades at speed and is
// cut while a door is open; brakes, rolling and air resistance oppose it
function updateDrive(dt) {
  const D = CONFIG.DRIVE, v = sim.speed;
  drive.tripT += dt;
  drive.lever = drive.brake > 0 ? -drive.brake : drive.throttle;
  if (sim.state === 'STOPPED') updateStop(dt);
  const boarding = sim.state === 'STOPPED' && (sim.stopPhase === 'SETTLE' || sim.stopPhase === 'DOORS_OPEN' || sim.stopPhase === 'BOARDING');   // no pulling out mid-boarding
  const power = drive.lever > 0 && drive.engine === 'ON' && !boarding && !ui.complete ? drive.lever / D.NOTCHES : 0;
  const trac = Math.min(power, Math.max(0, (drive.rpm - 0.3) / 0.7)) * D.ACCEL * Math.min(1, D.KNEE / Math.max(v, 1));
  if (sim.state === 'STOPPED') {
    drive.accel = 0;
    if (trac <= 0 || !depart()) return;
  }
  const brakeWant = drive.lever === EB ? D.EMERGENCY : drive.lever < 0 ? -drive.lever * D.BRAKE : 0;       // air brakes take a moment to bite, and to let go
  const bk = brakeWant > drive.brakeAcc ? (drive.lever === EB ? 6 : 1.1) : 0.8;
  drive.brakeAcc += (brakeWant - drive.brakeAcc) * Math.min(1, dt * bk);
  if (Math.abs(brakeWant - drive.brakeAcc) < 0.02) drive.brakeAcc = brakeWant;
  const brake = drive.brakeAcc;
  const resist = v > 0 ? D.DRAG[0] + D.DRAG[1] * v * v + brake : 0;
  sim.speed = Math.max(0, v + (trac - resist) * dt);
  sim.dist += (v + sim.speed) / 2 * dt;
  drive.accel = (sim.speed - v) / dt;
  if (v > 1.5 && sim.speed === 0) sim.shake = Math.max(sim.shake, drive.lever <= -3 ? 1.2 : 0.5);   // the brakes hold
  const harsh = Math.abs(drive.accel) - D.COMFORT_ACCEL;  // passengers thrown about
  if (harsh > 0) drive.comfort = Math.max(0, drive.comfort - harsh * dt * 1.5);
  checkSpeed(dt);
  checkLine();
  checkArrival();
}

// Pulling out of a station: anyone still waiting on the platform is left behind
function depart() {
  if (sim.station === LAST_STATION) return false;
  const st = STATIONS[sim.station];
  let waiting = 0;
  for (const q of sim.people) if (q.st === st.index && q.mode === 'wait') waiting++;
  if (waiting) penalty(waiting * 40, 'LEFT ' + waiting + ' BEHIND');
  else if (sim.stopPhase === 'FLAG' || sim.stopPhase === 'WAIT') penalty(150, 'LEFT BEFORE THE FLAG');
  sim.state = 'DRIVING';
  sim.stopPhase = null;
  sim.shake = Math.max(sim.shake, 0.5 + drive.lever * 0.12);   // couplings snatch
  return true;
}

function checkArrival() {                              // doors never close, so standing at the platform is enough
  const st = STATIONS[sim.station + 1];
  if (!st || sim.speed > 0.3) return;
  const o = sim.dist - st.dist, w = stopWindow(st);
  if (o < w[0] || o > w[1]) return;
  arrive(st.index, o);
  scoreArrival(st.index, o);
}

function checkSpeed(dt) {
  drive.limit = speedLimitAt(sim.dist);
  const over = sim.speed > drive.limit + 3;
  if (over && !drive.over) toast('OVERSPEED! LIMIT ' + drive.limit, 'red');
  drive.over = over;
  if (!over) return;
  drive.pts.penalty -= 20 * dt;
  if ((drive.beepT -= dt) <= 0) { drive.beepT = 0.45; playBeep(); }
}

// Rolling past a platform without stopping, or into the buffers at Sylhet
function checkLine() {
  const st = STATIONS[sim.station + 1];
  if (!st) return;
  const o = sim.dist - st.dist;
  if (st.index !== LAST_STATION) { if (o > stopWindow(st)[1] + 40) missStation(true); return; }
  if (o < BUFFER_O) return;
  const hard = sim.speed > 12, bump = sim.speed > 3;
  sim.dist = st.dist + BUFFER_O;
  sim.speed = 0;
  if (!bump) return;                                    // just leaning on them
  sim.shake = hard ? 3 : 1;
  playThump(hard ? 0.6 : 0.2);
  if (hard) { drive.comfort = Math.max(0, drive.comfort - 35); penalty(300, 'HIT THE BUFFERS!'); }
}
