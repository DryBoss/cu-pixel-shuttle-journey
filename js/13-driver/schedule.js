'use strict';
// js/13-driver/schedule.js
// Defines: SCHEDULE, HOURS_PER_S, legTime, buildSchedule, tripHour, lateMinutes, DOORS_LO, STOP_WIN, stopWindow, speedLimitAt

// Timetable: each leg as long as a sensible driver needs (legTime), a margin and
// some slack; a dwell at each stop. Built once the
// terrain (and so the speed limits) is laid out. The day's clock runs on
// it, so a late train arrives later in the evening.
const SCHEDULE = [];
let HOURS_PER_S = 0;
// How long a sensible driver needs for one leg with THIS train: modest power off the mark, full power up
// to the limit, a coast, then brakes in good time (they lag). The timetable follows from it, so it
// stays honest whatever the locomotive's weight.
function legTime(d0, d1) {
  const D = CONFIG.DRIVE, dt = 0.25;
  let v = 0, d = d0, t = 0;
  while (d < d1 - 12 && t < 3000) {
    const lim = speedLimitAt(d) - 6, ahead = speedLimitAt(d + v * 7) - 6, rem = d1 - d;
    const braking = rem < v * D.BRAKE_DELAY + v * v / (2 * D.BRAKE * 2.6) + 12 || v > Math.max(ahead, 14);
    const power = !braking && v < lim ? (v < D.SLIP_SPEED ? 6 : 8) / D.NOTCHES : 0;
    const a = power * D.ACCEL * Math.min(1, D.KNEE / Math.max(v, 1)) - D.GRAVITY * gradeAt(d) - (D.DRAG[0] + D.DRAG[1] * v * v) - (braking && v > 0 ? D.BRAKE * 2.6 : 0);
    const nv = Math.max(braking && rem > 12 ? 3 : 0, v + a * dt);
    d += (v + nv) / 2 * dt; v = nv; t += dt;
  }
  return t;
}

function buildSchedule() {
  const D = CONFIG.DRIVE;
  SCHEDULE.push({ arr: 0, dep: D.FIRST_DEP });
  for (let i = 1; i < STATIONS.length; i++) {
    const arr = SCHEDULE[i - 1].dep + legTime(STATIONS[i - 1].dist, STATIONS[i].dist) * D.SCHED_MARGIN + D.SLACK;
    SCHEDULE.push({ arr, dep: arr + D.DWELL });
  }
  HOURS_PER_S = (CONFIG.HOUR_END - CONFIG.HOUR_START) / SCHEDULE[LAST_STATION].arr;
}
const tripHour = t => CONFIG.HOUR_START + sim.hourOffset + t * HOURS_PER_S;   // the day's clock starts at the scenario's hour
const lateMinutes = (t, due) => (t - due) * HOURS_PER_S * 60;

// Where the train may stand at a station and still have every door on the
// platform: [lo, hi] px around the stop mark. The terminus ends in a buffer stop.
const DOORS_LO = Math.min(...DOORS), DOORS_HI = Math.max(...DOORS) + 4, BUFFER_O = 34;
const STOP_WIN = [0, 0];
function stopWindow(st) {
  const [L, R] = st.platform;
  STOP_WIN[0] = Math.max(-60, L + 2 - DOORS_LO);
  STOP_WIN[1] = st.index === LAST_STATION ? BUFFER_O : Math.min(60, R - 2 - DOORS_HI);
  return STOP_WIN;
}

// Line speed: slower through the tea and hill curves, over the Meghna
// bridge and through stations
function speedLimitAt(d) {
  const D = CONFIG.DRIVE;
  let lim = sectionWeight('tea', d) > 0.5 ? D.LIMIT_HILLS : D.LIMIT;
  if (gradeAt(d) > 0.5) lim = D.LIMIT_CU_HILLS;                                      // the steep winding track into the University hills
  if (BRIDGE.spans && d > BRIDGE.u0 - 460 && d < BRIDGE.u1 + 140) lim = Math.min(lim, D.LIMIT_BRIDGE);   // from Bhairab over the Meghna
  for (let i = 0; i < STATIONS.length; i++)
    if (d > STATIONS[i].dist - 280 && d < STATIONS[i].dist + 160) return Math.min(lim, D.LIMIT_STATION);
  return lim;
}
