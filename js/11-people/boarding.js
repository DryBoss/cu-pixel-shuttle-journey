'use strict';
// js/11-people/boarding.js
// Defines: startBoarding, boardingDone

// Doors are open: a few passengers step off, then the waiting ones board.
// A driver rarely stops exactly on the mark, so the doors stand at
// DOORS + sim.stopOffset in stop coordinates.
function startBoarding(st) {
  const terminus = st.index === LAST_STATION, o = Math.round(sim.stopOffset);
  // Nobody gets off anywhere on the way (every stop's alight is 0): the shuttle is for students going TO the
  // university. At the end of the line EVERYONE aboard gets off - the whole carried head count (plus the few standing
  // in the doorways), so a full train empties out and an empty one still releases a handful.
  const alight = terminus ? Math.min(220, Math.max(st.alight, drive.pax + 12)) : drive.on ? Math.min(st.alight, drive.pax) : st.alight;
  if (terminus) sim.riders = null;                       // the students holding the doorways step off with the rest
  for (let i = 0; i < alight; i++) {
    const door = DOORS[Math.floor(Math.random() * DOORS.length)] + o, x = door + 2;
    const q = spawnPerson(st, makeStudentDesign(Math.random), x, PLAT.DOOR_FLOOR, x - o < 150 ? -1 : 1, 'alight');
    const y = randWalkY(Math.random, st.tight), exit = (x - o < 150 ? -24 : W + 24) + o;   // just off screen
    q.hidden = true;
    q.delay = i * (terminus ? 0.075 : 0.4) + Math.random() * 0.6;   // at the terminus the wave of students is nearly unbroken
    q.path = [{ x, y: PLAT.EDGE_Y, clip: door, speed: 18, then: passengerOut },
              { x: x + Math.sign(exit - x) * 4, y },
              { x: exit, y, then: gone }];
  }
  for (const q of sim.people) {
    if (q.st !== st.index) continue;
    if (q.mode === 'wait') {
      const door = nearestDoor(q.x - o) + o, x = door + 2;
      q.mode = 'board';
      q.delay = (st.alight ? 1.4 : 0.3) + Math.random() * 3;
      q.path = [{ x, y: q.y }, { x, y: PLAT.EDGE_Y }, { x, y: PLAT.DOOR_FLOOR, clip: door, speed: 18, then: passengerIn }];
    } else if (q.mode === 'porterWait') {
      const door = DOORS[9] + o, x = door + 2;
      q.mode = 'porter';
      q.delay = 0.5;
      q.path = [{ x, y: q.y }, { x, y: PLAT.EDGE_Y, then: r => { r.delay = 1.2; r.handed = true; } }];
    }
  }
}

function boardingDone(st) {
  return !sim.people.some(q => q.st === st.index &&
    (q.mode === 'board' || q.mode === 'porter' ||
     (q.mode === 'alight' && (q.hidden || q.path.length > 2))));
}
