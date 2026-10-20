'use strict';
// js/12-journey/start.js
// Defines: startJourney

// Back to Kamalapur with a fresh crowd
function startJourney() {
  for (const q of sim.people) forgetPerson(q);
  sim.people.length = 0;
  sim.populated.clear();
  smokePool.n = birdPool.n = fluffPool.n = sparkPool.n = 0;
  sim.fxRng = mulberry32(2024);
  sim.wxRng = mulberry32(1971);
  resetWeather();
  sim.hornTimer = 8;
  sim.doorOpen = 1;
  const student = () => makeStudentDesign(Math.random);
  sim.riders = DOORS.map(() => Math.random() < 0.8 ? student() : null);
  sim.roof = [];                                         // nobody rides on the carriage roofs any more; only the engine's steps carry a few students
  for (const x of [41, 5]) sim.roof.push({ car: 0, x, fy: 23, dir: 1, t: Math.random() * 0.5, d: student() });
  arrive(0, 0);
  rollScenario();                                        // one random season + one random time of day; sets weather, fog, fluff and the hour
  resetDrive();                                          // (clears toasts, so the announcement comes after it)
  auto.n = 0; auto.tick = 0; auto.stopping = false; auto.light = false; auto.lightT = 0;   // the autopilot starts afresh
  ui.complete = false;
  panelSprites = null;
  if (!ui.title) announceScenario();                     // a restart; from the title card it is announced by beginTrip()
}
