'use strict';
// js/11-people/update.js
// Defines: moveAlong, updatePerson, updatePeople, forgetPerson

function moveAlong(q, dt) {
  const wp = q.path[0], dx = wp.x - q.x, dy = wp.y - q.y, dist = Math.hypot(dx, dy);
  const step = (wp.speed || q.speed) * dt;
  q.clip = wp.clip === undefined ? null : wp.clip;
  if (Math.abs(dx) > 0.01) q.dir = dx > 0 ? 1 : -1;
  q.walking = true;
  q.anim += Math.min(dist, step) / 3;
  if (dist <= step) {
    q.x = wp.x; q.y = wp.y;
    q.path.shift();
    q.clip = null;
    if (wp.then) wp.then(q);
  } else {
    q.x += dx / dist * step;
    q.y += dy / dist * step;
  }
}

function updatePerson(q, dt) {
  q.t += dt;
  q.walking = false;
  if (q.delay > 0) {
    q.delay -= dt;
    if (q.delay <= 0) q.hidden = false;
    return;
  }
  if (q.path.length) { moveAlong(q, dt); return; }
  switch (q.mode) {
    case 'idle': case 'wait': case 'porterWait':
      if (q.t > q.turnAt) { q.dir = -q.dir; q.turnAt = q.t + 2 + Math.random() * 6; }
      break;
    case 'patrol':                                       // tray vendor pacing the platform
      q.path = [{ x: q.x < (q.ax + q.bx) / 2 ? q.bx : q.ax, y: q.y }];
      q.delay = 1 + Math.random() * 2;
      break;
    case 'porter':                                       // case handed in at the door; head back
      if (q.handed) {
        forgetPerson({ d: q.d });
        q.d = q.d2;
        q.mode = 'leave';
        q.path = [{ x: q.x, y: 161 }, { x: W + 30 + Math.round(sim.stopOffset), y: 161, then: gone }];
      }
      break;
  }
}

function updatePeople(dt) {
  for (const st of STATIONS)
    if (!sim.populated.has(st.index) && Math.abs(st.dist - sim.dist) < 1000) populateStation(st);
  for (const q of sim.people) updatePerson(q, dt);
  let n = 0;
  for (const q of sim.people) {
    if (q.gone || Math.abs(STATIONS[q.st].dist - sim.dist) > 1200) { forgetPerson(q); continue; }
    sim.people[n++] = q;
  }
  sim.people.length = n;
}

function forgetPerson(q) {
  for (const k in VARIANTS) {
    VARIANTS[k].people.delete(q.d.id);
    if (q.d2) VARIANTS[k].people.delete(q.d2.id);
  }
}
