'use strict';
// js/17-input/manual.js
// Defines: manual, openManual, closeManual, toggleManual

// The driver's manual: a paper sheet over the game (index.html #manual). Drive mode only. The train is paused while
// it is open and the pause is given back (unless the player had paused already) when it closes.
const manual = { open: false, wasPaused: false };
function openManual() {
  if (manual.open || !drive.on || ui.title) return;
  manual.open = true; manual.wasPaused = ui.paused;
  ui.paused = true; hornOff();
  btn('manual').hidden = false;
  btn('manual').scrollTop = 0;
  btn('b-manual').classList.add('on');
}
function closeManual() {
  if (!manual.open) return;
  manual.open = false;
  btn('manual').hidden = true;
  btn('b-manual').classList.remove('on');
  ui.paused = manual.wasPaused;
  syncButtons();
}
function toggleManual() { if (manual.open) closeManual(); else openManual(); }
btn('b-manual').addEventListener('click', () => { unlockAudio(); toggleManual(); });
btn('manual-x').addEventListener('click', closeManual);
btn('manual').addEventListener('click', e => { if (e.target === btn('manual')) closeManual(); });   // a tap outside the paper closes it
