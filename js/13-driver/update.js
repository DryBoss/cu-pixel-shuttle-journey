'use strict';
// js/13-driver/update.js
// Defines: updateDrive, depart, checkArrival, checkSpeed, checkLine

// --- driving ----------------------------------------------------------------
// A heavy diesel and a full rake of steel carriages. Traction follows the engine (it has to spool up),
// fades at speed, is cut while a door is open and is nearly lost in a wheel slip. Against it: rolling and
// air drag (small: it coasts for minutes), the air brakes (which take their time) and, on the climb
// into the University hills, gravity. The train's speed is signed so it can roll back down the slope.
function updateDrive(dt) {
  const D = CONFIG.DRIVE;
  drive.tripT += dt;
  if (!drive.on) autopilot(dt);                         // AUTO: the autopilot works the handles, everything below is identical
  drive.lever = drive.brake > 0 ? -drive.brake : drive.throttle;
  if (Math.abs(drive.vel) !== sim.speed) drive.vel = (drive.vel < 0 ? -1 : 1) * sim.speed;   // arrive() and friends set sim.speed directly
  const v = drive.vel, av = sim.speed;
  if (sim.state === 'STOPPED') updateStop(dt);
  const boarding = sim.state === 'STOPPED' && (sim.stopPhase === 'SETTLE' || sim.stopPhase === 'DOORS_OPEN' || sim.stopPhase === 'BOARDING');   // no pulling out mid-boarding
  const power = drive.lever > 0 && drive.engine === 'ON' && !boarding && !ui.complete ? drive.lever / D.NOTCHES : 0;
  if (drive.on) updateSlack(dt);                        // (the autopilot always pauses between power and brake: no coupler bang)
  updateSlip(dt, power);
  let trac = Math.min(power, Math.max(0, (drive.rpm - 0.3) / 0.7)) * D.ACCEL * Math.min(1, D.KNEE / Math.max(av, 1));
  if (drive.slip) trac *= D.SLIP_TRAC;                  // the wheels spin, the train hardly moves
  if (sim.state === 'STOPPED') {
    drive.accel = 0;
    if (!drive.on || trac <= 0 || !depart()) return;    // AUTO leaves via the stop routine (stop.js), not through here
  }
  // air brakes: the command takes a moment to travel down the pipe, then the pressure builds (or bleeds off) slowly
  const cmd = drive.lever === EB ? D.EMERGENCY : drive.lever < 0 ? -drive.lever * D.BRAKE : 0;
  if (cmd !== drive.brakeCmd) {
    if (drive.brakeWait <= 0) drive.brakeWait = cmd === D.EMERGENCY ? D.EMG_DELAY : cmd > drive.brakeEff ? D.BRAKE_DELAY : D.RELEASE_DELAY;
    drive.brakeCmd = cmd;
  }
  if (drive.brakeWait > 0) drive.brakeWait -= dt;
  if (drive.brakeWait <= 0) drive.brakeEff = drive.brakeCmd;
  const rate = drive.brakeEff > drive.brakeAcc ? (drive.brakeEff >= D.EMERGENCY ? D.BRAKE_EMG_RATE : D.BRAKE_APPLY) : D.BRAKE_RELEASE;
  drive.brakeAcc += (drive.brakeEff - drive.brakeAcc) * Math.min(1, dt * rate);
  if (Math.abs(drive.brakeEff - drive.brakeAcc) < 0.02) drive.brakeAcc = drive.brakeEff;
  // forces along the line
  const grade = gradeAt(sim.dist);
  drive.grade = grade;
  if (grade > 0.5 && !drive.climbing) { drive.climbing = true; toast('UPHILL TO THE UNIVERSITY - KEEP THE POWER ON', 'amber'); }
  else if (grade < 0.1) drive.climbing = false;
  const push = trac - D.GRAVITY * grade;                // net pull forwards; the slope drags the train back
  const resist = D.DRAG[0] + D.DRAG[1] * v * v + drive.brakeAcc;   // always opposes the motion
  let nv;
  if (v === 0 && Math.abs(push) <= resist) nv = 0;      // held by the brakes and the rails
  else {
    nv = v + (push - (v !== 0 ? Math.sign(v) : Math.sign(push)) * resist) * dt;
    if (v !== 0 && Math.sign(nv) !== Math.sign(v)) nv = 0;   // friction brings it to rest; if the slope wins it then starts back
  }
  drive.vel = nv;
  sim.speed = Math.abs(nv);
  sim.dist += (v + nv) / 2 * dt;
  drive.accel = (nv - v) / dt;
  if (av > 1.5 && sim.speed === 0) sim.shake = Math.max(sim.shake, drive.lever <= -3 ? 1.2 : 0.5);   // the brakes hold
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
  if (o < w[0] || o > w[1] + (drive.on ? 0 : 36)) return;   // (the autopilot is let off if it stops a touch long)
  arrive(st.index, o);
  if (drive.on) scoreArrival(st.index, o);
}

function checkSpeed(dt) {
  drive.limit = speedLimitAt(sim.dist);
  const over = drive.on && sim.speed > drive.limit + 3;   // (the autopilot keeps itself under the limit)
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
  if (st.index !== LAST_STATION) { if (o > stopWindow(st)[1] + (drive.on ? 40 : 70)) missStation(drive.on); return; }
  if (o < BUFFER_O) return;
  const hard = sim.speed > 12, bump = sim.speed > 3;
  sim.dist = st.dist + BUFFER_O;
  sim.speed = 0;
  if (!bump) return;                                    // just leaning on them
  sim.shake = hard ? 3 : 1;
  playThump(hard ? 0.6 : 0.2);
  if (hard) { drive.comfort = Math.max(0, drive.comfort - 35); penalty(300, 'HIT THE BUFFERS!'); }
}
