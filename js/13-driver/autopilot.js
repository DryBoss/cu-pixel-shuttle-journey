'use strict';
// js/13-driver/autopilot.js
// Defines: auto, autopilot, autoLights

// =====================================================================
// AUTO MODE = THE SAME PHYSICS AS DRIVE MODE, WITH AN AUTOPILOT AT THE CONTROLS
// =====================================================================
// AUTO no longer follows a scripted speed curve. updateDrive() (13-driver/update.js) runs the real model for both
// modes: traction that follows the engine and fades with speed, rolling + air drag, air brakes that take their time,
// wheel slip, coupler slack, the climb into the hills. In AUTO this file works the throttle and the brake handle (and
// the headlight) in place of a person, the way a careful driver would:
//   - power off the mark (gentle while the wheels could slip, wetter rails = gentler),
//   - hold the line speed limit, braking early enough for every slower zone ahead (the brakes lag),
//   - brake smoothly for the platform and stop inside the stopping window,
//   - hold the brakes while standing, release them as the guard waves the flag,
//   - headlight on in the dark and in rain; off in daylight (fog alone does not switch it on).
const auto = {
  tick: 0,                  // s until the controller may change its mind again (no flicker of the handles)
  n: 0,                     // the brake step currently asked for, 0 = released
  stopping: false,          // braking for the platform ahead
  light: false,
  lightT: 0,
};
const AUTO_BRAKE = 2.3, AUTO_LAG = 2.3, AUTO_MARGIN = 6, AUTO_CRUISE = 88;   // design braking (px/s2 per step used), brake-pipe lead time (s), km/h kept under every limit

// The speed the train may have right now so that it can still meet every slower limit ahead and stop at the platform
function autoAllowed(d, v, tgt) {
  const D = CONFIG.DRIVE, ab = D.BRAKE * AUTO_BRAKE, lead = v * AUTO_LAG;
  let allow = Math.min(AUTO_CRUISE, speedLimitAt(d) - AUTO_MARGIN);
  for (let s = 40; s <= 760; s += 40) {                  // every slower zone ahead: v^2 = v_zone^2 + 2 a s (the brakes need their lead time first)
    const lim = Math.max(8, speedLimitAt(d + s) - AUTO_MARGIN);
    allow = Math.min(allow, Math.sqrt(lim * lim + 2 * ab * Math.max(0, s - lead)));
  }
  const rem = tgt - d;                                   // and the platform: down to nothing at the mark
  return Math.min(allow, Math.sqrt(2 * ab * Math.max(0, rem - lead * 0.6 - 2)));
}

function autoSetBrake(n) {
  if (n === drive.brake) return;
  if (n > drive.brake) playAir(0.35, 0.04); else if (n === 0) playAir(0.55, 0.05);   // the pssh of the brake valve
  drive.brake = n;
}

function autoLights(dt) {
  const rain = weather.level, dark = sim.night;                // (mist alone does not count: a Winter morning, noon or afternoon runs with the headlight off)
  const want = auto.light ? (dark > 0.12 || rain > 0.18) : (dark > 0.3 || rain > 0.35);   // hysteresis: no flicker at dusk or in a passing shower
  auto.lightT = Math.max(0, auto.lightT - dt);
  if (want !== auto.light && auto.lightT <= 0) {
    auto.light = want; auto.lightT = 4;
    toast(want ? (dark > 0.3 ? 'HEADLIGHT ON - DARK' : 'HEADLIGHT ON - RAIN') : 'HEADLIGHT OFF', 'white', false, true);
  }
  drive.headlight = auto.light;
}

function autopilot(dt) {
  const D = CONFIG.DRIVE, wet = sim.season === 'Monsoon';
  autoLights(dt);
  if (drive.engine !== 'ON') { drive.throttle = 0; autoSetBrake(drive.engine === 'OFF' ? 0 : 3); return; }
  auto.tick -= dt;

  if (sim.state === 'STOPPED') {                         // standing at a platform: brakes held, released as the flag goes up
    drive.throttle = 0;
    auto.stopping = false;
    const releasing = sim.stopPhase === 'FLAG' || sim.stopPhase === 'HORN';
    autoSetBrake(releasing ? 0 : 3);
    return;
  }

  // ---- on the line
  const st = STATIONS[sim.station + 1], d = sim.dist, v = sim.speed;
  let tgt = Infinity;
  if (st) {
    const w = stopWindow(st);
    tgt = st.dist + w[0] + (w[1] - w[0]) * (st.index === LAST_STATION ? 0.3 : 0.45);   // aim for the middle of the window: any stop inside it counts
  }
  const allow = autoAllowed(d, v, tgt), over = v - allow;

  if (auto.tick > 0 && over < 6) return;                 // keep the handles where they are for a moment, unless clearly too fast
  auto.tick = 0.35;

  // brake: a step for how far over the allowed speed we are; keep a light brake on while stopping so it never rolls on
  let n = 0;
  if (over > 12) n = 4; else if (over > 6) n = 3; else if (over > 2.5) n = 2; else if (over > 0.6) n = 1;
  if (st && tgt - d < 150 && v > 0.4) n = Math.max(n, 1);                // the last stretch: never let go of the brakes while still rolling
  if (auto.n > 0 && n === 0 && over > -2.5 && v > 2) n = 1;              // hysteresis: step down gently, do not flick the brakes on and off
  if (n < auto.n && n > 0 && over > 0 && auto.n - n > 1) n = auto.n - 1; // release one step at a time
  if (st && tgt - d < 3 && v < 1.2) n = Math.max(n, 2);                  // there: hold it
  auto.n = n;
  autoSetBrake(n);

  // power: only while under the allowed speed and with no brake on
  let thr = 0;
  const room = allow - v;
  if (n === 0 && room > 1.5 && drive.brakeAcc < 0.5) {
    thr = room > 12 ? 8 : room > 6 ? 6 : room > 3 ? 4 : 2;
    if (v < D.SLIP_SPEED + 3) thr = Math.min(thr, wet ? D.SLIP_NOTCH[1] - 1 : D.SLIP_NOTCH[0] - 1);   // never enough to break the wheels loose
    if (v < 1.5 && drive.brakeAcc > 0.15) thr = 0;                        // let the brakes bleed off before pulling away
  }
  drive.throttle = thr;
}
