'use strict';
// js/13-driver/schedule.js
// Defines: SCHEDULE, HOURS_PER_S, buildSchedule, tripHour, lateMinutes, DOORS_LO, STOP_WIN, stopWindow, speedLimitAt

// Timetable: each leg run a little under the line speed, plus time to get
// going and to stop, plus some slack; a dwell at each stop. Built once the
// terrain (and so the speed limits) is laid out. The day's clock runs on
// it, so a late train arrives later in the evening.
const SCHEDULE = [];
let HOURS_PER_S = 0;
function buildSchedule() {
  const D = CONFIG.DRIVE;
  SCHEDULE.push({ arr: 0, dep: D.FIRST_DEP });
  for (let i = 1; i < STATIONS.length; i++) {
    let run = 0;
    for (let d = STATIONS[i - 1].dist; d < STATIONS[i].dist; d += 10) run += 10 / Math.min(D.SCHED_SPEED, speedLimitAt(d) - 6);
    const arr = SCHEDULE[i - 1].dep + run + (CONFIG.ACCEL_TIME + CONFIG.BRAKE_TIME) / 2 + D.SLACK;
    SCHEDULE.push({ arr, dep: arr + D.DWELL });
  }
  HOURS_PER_S = (CONFIG.HOUR_END - CONFIG.HOUR_START) / SCHEDULE[LAST_STATION].arr;
}
const tripHour = t => CONFIG.HOUR_START + t * HOURS_PER_S;
const lateMinutes = (t, due) => (t - due) * HOURS_PER_S * 60;

// Where the train may stand at a station and still have every door on the
// platform: [lo, hi] px around the stop mark. The terminus ends in a buffer stop.
const DOORS_LO = Math.min(...DOORS), DOORS_HI = Math.max(...DOORS) + 4, BUFFER_O = 72;
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
  let lim = sectionWeight('tea', d) + sectionWeight('hills', d) > 0.5 ? D.LIMIT_HILLS : D.LIMIT;
  if (BRIDGE.spans && d > BRIDGE.u0 - 460 && d < BRIDGE.u1 + 140) lim = Math.min(lim, D.LIMIT_BRIDGE);   // from Bhairab over the Meghna
  for (let i = 0; i < STATIONS.length; i++)
    if (d > STATIONS[i].dist - 280 && d < STATIONS[i].dist + 160) return Math.min(lim, D.LIMIT_STATION);
  return lim;
}
