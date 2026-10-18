'use strict';
// js/11-people/spawn.js
// Defines: gone, nearestDoor, randWalkY, spawnPerson, populateStation

// --- behaviour ---------------------------------------------------------
// People follow a list of waypoints; a waypoint may clip them to a door
// column (climbing in or out) and may run a callback when reached.
const gone = q => { q.gone = true; };
const nearestDoor = x => DOORS.reduce((a, b) => Math.abs(b + 2 - x) < Math.abs(a + 2 - x) ? b : a);
const randWalkY = (rng, halt) => PLAT.WALK_MIN + Math.floor(rng() * ((halt ? 164 : PLAT.WALK_MAX) - PLAT.WALK_MIN + 1));

function spawnPerson(st, d, x, y, dir, mode) {
  const speed = d.kind === 'elder' ? 7 : d.kind === 'child' ? 13 : 11 + Math.random() * 5;
  const q = { st: st.index, d, x, y, dir, mode, speed, path: [], anim: 0, t: Math.random() * 3,
              delay: 0, clip: null, hidden: false, walking: false, turnAt: 2 + Math.random() * 6 };
  sim.people.push(q);
  return q;
}

function populateStation(st) {
  sim.populated.add(st.index);
  const rng = mulberry32((Math.random() * 1e9) | 0);    // a different crowd every trip
  const [L, R] = st.platform;
  const seated = kind => { const d = makeDesign(rng, kind); d.carry = null; return d; };
  const locals = st.extras.includes('locals');                       // a couple of locals in lungis or casual shirts, no luggage
  const localDesign = r => { const d = makeDesign(r, pick(r, ['lungi', 'lungi', 'trousers'])); d.carry = null; return d; };
  const waiting = Array.isArray(st.crowd) ? st.crowd[0] + Math.floor(rng() * (st.crowd[1] - st.crowd[0] + 1)) : st.crowd;
  const studentDesign = r => {                           // CU students: trousers and kameez, nearly all with a backpack or bag
    const d = makeDesign(r, r() < 0.55 ? 'trousers' : 'kameez');
    d.carry = d.kind === 'trousers' ? (r() < 0.82 ? 'backpack' : 'bag') : (r() < 0.55 ? 'bag' : 'backpack');
    return d;
  };
  const villageMix = () => { const r = rng(); return r < 0.4 ? studentDesign(rng) : r < 0.58 ? makeDesign(rng, 'elder') : localDesign(rng); };   // students in kameez and trousers, elders, villagers in lungis
  let vi = 0;
  const villageDesign = () => { const i = vi++; return i < 2 ? studentDesign(rng) : i === 2 ? makeDesign(rng, 'elder') : i === 3 ? seated('sari') : localDesign(rng); };   // a couple of students, an elder with a cane, mostly lungi-clad locals
  for (let i = 0; i < waiting; i++) {                  // waiting to board, spread along the train
    const q = spawnPerson(st, st.village ? villageDesign() : st.villagers ? villageMix() : locals ? localDesign(rng) : st.students && rng() < (st.studentShare || 1) ? studentDesign(rng) : makeDesign(rng),
                st.village ? 226 + (rng() * 2 - 1) * 34 :           // quietly gathered on the dirt path under the shelter
                st.shade && rng() < 0.6 ? Math.max(24, Math.min(268, pick(rng, st.shade) + (rng() * 2 - 1) * 26)) : 24 + rng() * 244,   // some stand in the trees' shade, the rest in the open sun
                st.edgeCrowd && rng() < 0.4 ? PLAT.WALK_MIN + Math.floor(rng() * 4) : randWalkY(rng, st.tight), rng() < 0.5 ? 1 : -1, 'wait');
    if (st.edgeCrowd && q.y <= 157) q.edge = true;     // right up at the safety line: they step back when the train comes in
  }
  for (let i = 0; i < st.idle; i++) {                   // just standing about
    let x;
    do x = L + 10 + rng() * (R - L - 20); while (x > PLAT.STALL_X - 4 && x < PLAT.STALL_X + 34);
    spawnPerson(st, makeDesign(rng), x, randWalkY(rng, st.tight), rng() < 0.5 ? 1 : -1, 'idle');
  }
  for (const it of st.layout)                           // someone resting on a bench
    if ((it.type === 'bench' && rng() < 0.5) || ((it.type === 'sleeper' || it.type === 'bricks') && rng() < 0.4))
      spawnPerson(st, seated(pick(rng, ['lungi', 'trousers', 'sari', 'kameez', 'elder'])), it.x + (it.key === 'woodbench' ? 5 : 3), it.y, rng() < 0.5 ? 1 : -1, 'sit');
  if (!st.halt && !st.bare) spawnPerson(st, seated(pick(rng, ['lungi', 'trousers'])), PLAT.STALL_X + 31, PLAT.STALL_Y + 2, -1, 'sip');
  if (st.liveStall)                                        // students queueing for tea at both sides of the stall
    for (const [dx, dy, dir, kind] of [[37, 7, -1, 'trousers'], [-7, 4, 1, 'kameez'], [-14, 9, 1, 'trousers']]) {
      const d = makeDesign(rng, kind); d.carry = null;
      spawnPerson(st, d, PLAT.STALL_X + dx, PLAT.STALL_Y + dy, dir, 'sip');
    }
  if (st.extras.includes('swarm'))                         // a swarm of hawkers and vendors working the crowd: jhalmuri, tea, newspapers, snacks
    for (let i = 0; i < 22; i++) {
      const d = makeDesign(rng, i % 3 === 0 ? 'hawker' : 'vendor');
      if (d.kind === 'vendor') d.carry = pick(rng, ['kettle', 'papers', 'tray', 'kettle', 'papers']);
      const q = spawnPerson(st, d, 10 + rng() * 300, randWalkY(rng, st.tight), rng() < 0.5 ? 1 : -1, i % 5 === 0 ? 'idle' : 'patrol');
      if (q.mode === 'patrol') { q.ax = 4 + rng() * 120; q.bx = Math.min(R - 40, q.ax + 80 + rng() * 200); q.speed = 7 + rng() * 6; }
    }
  if (st.extras.includes('hawkers'))                       // snack hawkers pacing the open platform with baskets
    for (let i = 0; i < 2; i++) {
      const q = spawnPerson(st, makeDesign(rng, 'hawker'), 40 + rng() * 220, randWalkY(rng, st.tight), i ? -1 : 1, 'patrol');
      q.ax = L + 30 + i * 90; q.bx = Math.min(R - 60, 250 + i * 70); q.speed = 7 + rng() * 3;
    }
  if (!st.bare && !st.village && !st.extras.includes('army')) {          // no sellers in a restricted military zone, or at a quiet village halt
  const vendor = spawnPerson(st, makeDesign(rng, st.extras.includes('peanuts') ? 'peanut' : 'vendor'), 60 + rng() * 150, st.tight ? 164 : PLAT.WALK_MAX, 1, 'patrol');
  vendor.ax = Math.max(L + 20, -120);
  vendor.bx = Math.min(R - 46, 440);
  vendor.speed = 9;
  }
  if (!st.village) spawnPerson(st, makeDesign(rng, 'guard'), 14, st.tight ? 163 : 167, 1, 'guard');   // front of the platform, flag against concrete
  if (st.extras.includes('porter')) {
    const q = spawnPerson(st, makeDesign(rng, 'porter'), 300, 169, -1, 'porterWait');   // in front of the stall
    q.d2 = { ...q.d, id: ++designId, carry: null };     // same porter, luggage delivered
  }
  if (st.extras.includes('army'))                          // soldiers on the platform
    for (const [x, i] of [[34, 0], [96, 1], [150, 2], [214, 3], [262, 4], [300, 5]]) {
      const q = spawnPerson(st, makeDesign(rng, 'soldier'), x, randWalkY(rng, st.tight), rng() < 0.5 ? 1 : -1, i < 3 ? 'idle' : 'patrol');
      if (q.mode === 'idle') q.turnAt = Infinity;                                       // standing rigid
      else { q.ax = Math.max(L + 20, x - 70); q.bx = Math.min(R - 40, x + 90); q.speed = 4.5 + rng() * 1.5; }   // pacing slowly
    }
  if (st.extras.includes('vendors'))                       // the platform is full of vendors and hawkers
    for (let i = 0; i < 14; i++) {
      const q = spawnPerson(st, makeDesign(rng, i % 3 === 0 ? 'hawker' : 'vendor'), 10 + rng() * 330, randWalkY(rng, st.tight), rng() < 0.5 ? 1 : -1, i % 4 === 0 ? 'idle' : 'patrol');
      if (q.mode === 'patrol') { q.ax = 4 + rng() * 140; q.bx = q.ax + 60 + rng() * 170; q.speed = 7 + rng() * 5; }
    }
  if (st.extras.includes('clutter'))                       // more porters (kulies) working the long platform
    for (let i = 0; i < 6; i++) {
      const q = spawnPerson(st, makeDesign(rng, 'porter'), -300 + rng() * 600, randWalkY(rng, st.tight), rng() < 0.5 ? 1 : -1, 'patrol');
      q.ax = -300 + rng() * 500; q.bx = q.ax + 120 + rng() * 220; q.speed = 8 + rng() * 4;
    }
}
