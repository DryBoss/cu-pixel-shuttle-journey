'use strict';
// js/13-driver/scoring.js
// Defines: missStation, penalty, scoreArrival, finishJourney

function missStation(announce) {
  sim.station++;
  sim.nextStop = sim.station < LAST_STATION ? STATIONS[sim.station + 1].dist : Infinity;
  if (announce) penalty(400, 'MISSED ' + STATIONS[sim.station].en);
}

function penalty(n, msg) {
  drive.pts.penalty -= n;
  toast(msg + ' -' + n, 'red');
}

// Doors opened at a platform: how close to the mark, how close to time
function scoreArrival(i, o) {
  const a = Math.abs(o), late = lateMinutes(drive.tripT, SCHEDULE[i].arr), ok = CONFIG.DRIVE.ON_TIME;
  const tp = late <= ok ? 200 : Math.max(-200, Math.round(200 - 6 * (late - ok)));   // early is fine: departure waits
  drive.pts.time += tp;
  toast((late < -ok ? 'EARLY ' + Math.round(-late) + ' MIN' : late <= ok ? 'ON TIME' : 'LATE ' + Math.round(late) + ' MIN') +
        (tp < 0 ? ' ' : ' +') + tp, tp >= 150 ? 'grassLight' : tp > 0 ? 'amber' : 'red');
  const [label, pts, col] = a <= 3 ? ['PERFECT STOP', 500, 'glow'] : a <= 10 ? ['GREAT STOP', 300, 'grassLight']
                          : a <= 25 ? ['GOOD STOP', 150, 'skyLight'] : ['STOPPED', 50, 'white'];
  drive.pts.stops += pts;
  toast(label + ' +' + pts, col, true);
  playScore(a <= 10);
}

function finishJourney() {
  ui.complete = true;
  panelSprites = null;
  hornOff();
  if (!drive.on) return;
  const P = drive.pts, comfort = Math.round(drive.comfort * 4);
  const total = Math.round(P.stops + P.time + P.pax + comfort + P.penalty);
  const best = readBest();
  if (total > best) try { localStorage.setItem('cups-best', String(total)); } catch (e) { /* storage blocked */ }
  drive.final = { total, comfort, best, record: total > best && best > 0,
                  stars: total >= 720 * STATIONS.length ? 3 : total >= 500 * STATIONS.length ? 2 : total >= 270 * STATIONS.length ? 1 : 0 };
  playScore(true);
}
