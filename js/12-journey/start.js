'use strict';
// js/12-journey/start.js
// Defines: startJourney

// Back to Kamalapur with a fresh crowd
function startJourney() {
  for (const q of sim.people) forgetPerson(q);
  sim.people.length = 0;
  sim.populated.clear();
  smokePool.n = birdPool.n = fluffPool.n = fireflyPool.n = sparkPool.n = 0;
  sim.fxRng = mulberry32(2024);
  sim.wxRng = mulberry32(1971);
  resetWeather();
  sim.hornTimer = 8;
  sim.doorOpen = 1;
  sim.riders = DOORS.map(() => Math.random() < 0.8 ? makeDesign(Math.random, Math.random() < 0.58 ? 'trousers' : 'kameez') : null);
  const student = () => makeDesign(Math.random, Math.random() < 0.62 ? 'trousers' : 'kameez');
  sim.roof = [];
  for (let car = 1; car < TRAIN.vehicles.length; car++)
    for (let k = 0; k < 6; k++)
      if (Math.random() < 0.85) sim.roof.push({ car, x: 4 + k * 6 + Math.floor(Math.random() * 2), fy: -1, dir: Math.random() < 0.8 ? 1 : -1, t: Math.random(), d: student() });
  for (const x of [41, 5]) sim.roof.push({ car: 0, x, fy: 23, dir: 1, t: Math.random() * 0.5, d: student() });
  arrive(0, 0);
  resetDrive();
  ui.complete = false;
  panelSprites = null;
}
