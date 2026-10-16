'use strict';
// js/18-main/loop.js
// Defines: acc, frame

// --- fixed-timestep loop ----------------------------------------------
let acc = 0, last = 0, frames = 0;
function frame(now) {
  const dt = Math.min(CONFIG.MAX_FRAME, (now - last) / 1000), t0 = performance.now();
  last = now;
  acc += dt * timeScale();
  let steps = 0;
  while (acc >= CONFIG.STEP && steps < 120) {
    update(CONFIG.STEP);
    acc -= CONFIG.STEP;
    steps++;
  }
  if (!steps && ui.paused) acc = 0;
  updateHour(dt);                                       // also eases while paused (time button)
  updateShake(steps ? dt : 0);
  updateAudioBeds(dt);
  updateToasts(dt);                                     // real time, so they fade while paused too
  render();
  prefetchTerrain();
  // phones and slow machines: drop to the light particle budgets
  const cost = performance.now() - t0;
  quality.ema = quality.ema * 0.95 + cost * 0.05;
  if (!quality.low && ++frames > 180 && quality.ema > CONFIG.LOW_QUALITY_MS) quality.low = true;
  requestAnimationFrame(frame);
}
startJourney();
// A link ending in #watch or #drive skips the title card
if (location.hash === '#watch' || location.hash === '#drive') beginTrip(location.hash === '#drive');
syncButtons();
requestAnimationFrame(now => { last = now; render(); requestAnimationFrame(frame); });
