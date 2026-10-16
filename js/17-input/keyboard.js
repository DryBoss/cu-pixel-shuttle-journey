'use strict';
// js/17-input/keyboard.js
// Defines: titleKey, driveKey

// Keys on the title card, and the driver's keys; true when the key was used
function titleKey(key) {
  if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Tab') ui.titleSel ^= 1;
  else if (key === 'Enter' || key === 'Space') beginTrip(ui.titleSel === 1);
  else if (key === 'KeyC') beginTrip(true);
  else return false;
  return true;
}
function driveKey(key) {
  if (ui.complete) return false;
  switch (key) {
    case 'KeyE': toggleEngine(); break;
    case 'ArrowUp': case 'KeyW': setThrottle(drive.throttle + 1); break;               // throttle handle
    case 'ArrowDown': case 'KeyS': setThrottle(drive.throttle - 1); break;
    case 'ArrowRight': case 'KeyD': setBrake(Math.min(4, drive.brake + 1)); break;     // brake handle
    case 'ArrowLeft': case 'KeyA': setBrake(drive.brake - 1); break;
    case 'KeyB': setBrake(5); break;                                                    // emergency
    case 'KeyL': toggleLight(); break;
    case 'KeyH': break;                                  // held: see keydown
    default: return false;
  }
  return true;
}
addEventListener('keydown', e => {
  unlockAudio();
  const key = e.code;
  if (key === 'KeyF') input.fast = true;
  if (key === 'KeyH' && drive.on && !ui.title && !ui.paused) hornOn();
  if (e.repeat) { if (key === 'Space' || key.startsWith('Arrow')) e.preventDefault(); return; }
  if ((ui.title && titleKey(key)) || (drive.on && !ui.title && driveKey(key))) { e.preventDefault(); syncButtons(); return; }
  if (key === 'KeyD') input.debug = !input.debug;
  else if (key === 'KeyC') actions.mode();
  else if (key === 'KeyT') actions.time();
  else if (key === 'KeyM') setMuted(!audio.muted);
  else if (key === 'KeyW') actions.rain();
  else if (key === 'KeyN') actions.skip();
  else if (key === 'KeyP' || (key === 'Space' && !ui.complete)) { actions.pause(); e.preventDefault(); }
  else if (!drive.on && (key === 'Digit1' || key === 'Digit2' || key === 'Digit4')) ui.speed = +key.slice(5);
  else if (key === 'KeyR' || (ui.complete && (key === 'Enter' || key === 'Space'))) startJourney();
  syncButtons();
});
addEventListener('keyup', e => {
  if (e.code === 'KeyF') input.fast = false;
  if (e.code === 'KeyH') hornOff();
});
addEventListener('blur', () => { input.fast = false; hornOff(); endHold(); });
addEventListener('pointerdown', unlockAudio);
