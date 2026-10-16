'use strict';
// js/18-main/cab-input.js
// Defines: cabDrag, cabXY, cabMove

let cabDrag = null;
const cabXY = e => { const r = cab.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * CAB_H / r.height]; };
function cabMove(y) {
  if (cabDrag === 'throttle') setThrottle(Math.max(0, Math.min(CONFIG.DRIVE.NOTCHES, Math.round((82 - y) / 7.5))));
  else if (cabDrag === 'brake') setBrake(Math.max(0, Math.min(5, Math.round((y - 22) / 12))));
}
cab.addEventListener('pointerdown', e => {
  unlockAudio();
  const [x, y] = cabXY(e);
  if (x >= 140 && x < 180) cabDrag = 'throttle';
  else if (x >= 184 && x < 224) cabDrag = 'brake';
  else if (x >= 276 && x < 316) { cabDrag = 'horn'; hornOn(); }
  else if (x >= 230 && x < 272 && y >= 10 && y < 50) toggleEngine();
  else if (x >= 230 && x < 272 && y >= 50 && y < 90) toggleLight();
  if (cabDrag) { try { cab.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ } cabMove(y); }
  e.preventDefault();
});
cab.addEventListener('pointermove', e => { if (cabDrag) cabMove(cabXY(e)[1]); });
for (const ev of ['pointerup', 'pointercancel']) cab.addEventListener(ev, () => { if (cabDrag === 'horn') hornOff(); cabDrag = null; });
