'use strict';
// js/11-people/sprites.js
// Defines: personSprite, personFrame, drawPersonAt

function personSprite(v, d, frame, dir) {
  let set = v.people.get(d.id);
  if (!set) v.people.set(d.id, set = []);
  const key = frame * 2 + (dir < 0 ? 1 : 0);
  if (!set[key]) {
    const [c, g] = makeCanvas(PERSON_W, PERSON_H);
    if (dir < 0) { g.translate(PERSON_W, 0); g.scale(-1, 1); }   // exact pixel mirror
    paintPerson(g, d, v.p, frame);
    set[key] = c;
  }
  return set[key];
}

function personFrame(q) {
  if (q.walking) return Math.floor(q.anim) % 4;
  if (q.mode === 'sit') return 4;
  if (q.mode === 'sip') return q.t % 3.4 > 2.3 ? 6 : 5;
  if (q.mode === 'guard' && sim.state === 'STOPPED' && sim.station === q.st &&
      (sim.stopPhase === 'FLAG' || sim.stopPhase === 'HORN' || sim.stopPhase === 'CLEAR')) return 7 + (Math.floor(sim.clock * 4) & 1);
  return 0;
}

function drawPersonAt(g, v, q, off) {
  const spr = personSprite(v, q.d, personFrame(q), q.dir);
  const x = Math.round(q.x) + off - PERSON_CX, y = Math.round(q.y) - PERSON_FY;
  if (q.clip === null) { g.drawImage(spr, x, y); return; }
  // stepping through a doorway: only the part inside the door column shows
  g.save();
  g.beginPath();
  g.rect(q.clip + off, PLAT.DOOR_TOP, 4, PLAT.EDGE_Y - PLAT.DOOR_TOP + 1);
  g.clip();
  g.drawImage(spr, x, y);
  g.restore();
}
