'use strict';
// js/13-driver/hint.js
// Defines: driveHint

// What the driver should do next, shown under the route map
function driveHint() {
  const e = drive.engine;
  if (ui.complete) return '';
  if (e === 'CRANK') return 'STARTING THE ENGINE...';
  const power = drive.lever < 0 ? 'RELEASE THE BRAKE' : 'OPEN THE THROTTLE';
  if (sim.state === 'STOPPED') {
    const term = sim.station === LAST_STATION;
    switch (sim.stopPhase) {
      case 'SETTLE': case 'READY': case 'DOORS_OPEN': case 'BOARDING':
        return e === 'OFF' && sim.station === 0 ? 'START THE ENGINE [E]' : term ? 'PASSENGERS GETTING OFF...' : 'PASSENGERS BOARDING...';
      case 'BOARDED': return !term ? 'CLOSE THE DOORS [O]' : e === 'ON' ? 'STOP THE ENGINE [E]' : '';
      case 'DOORS_CLOSE': return 'DOORS CLOSING...';
      case 'WAIT': return 'DEPARTS AT ' + hhmm(tripHour(SCHEDULE[sim.station].dep)) + ' - WAIT';
      case 'FLAG': return 'WAIT FOR THE GUARD...';
      case 'CLEAR': return e === 'OFF' ? 'START THE ENGINE [E]' : e === 'ON' ? power : '';
      case 'PARKED': return e === 'ON' ? 'STOP THE ENGINE [E]' : '';
    }
    return '';
  }
  if (drive.over) return 'SLOW DOWN! LIMIT ' + drive.limit;
  const st = STATIONS[sim.station + 1];
  if (!st) return '';
  const o = sim.dist - st.dist, w = stopWindow(st);
  if (sim.speed < 0.3) {
    if (o >= w[0] && o <= w[1]) return 'OPEN THE DOORS [O]';
    if (e === 'OFF') return 'START THE ENGINE [E]';
    if (o > w[1]) return 'OVERSHOT! DRIVE ON';
    if (o > -160) return 'CREEP UP ' + Math.ceil(w[0] - o) + ' M';
    return power;
  }
  if (o > -440 && o < w[0]) return 'BRAKE FOR ' + st.en + '';
  return '';
}
