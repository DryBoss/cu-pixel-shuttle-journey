'use strict';
// js/17-input/actions.js
// Defines: actions, holdTimer, endHold, skipToNextStation, timeScale

const actions = {
  mode() { if (ui.title) beginTrip(true); else setDriveMode(!drive.on); },
  pause() { ui.paused = !ui.paused; if (ui.paused) hornOff(); },
  speed() { ui.speed = SPEEDS[(SPEEDS.indexOf(ui.speed) + 1) % SPEEDS.length]; },
  skip() { skipToNextStation(); },
  time() { if (!drive.on) cycleTimePhase(); },                  // WATCH only: Morning > Midday > Afternoon > Dusk > Night
  season() { if (!drive.on) cycleSeason(); },                   // WATCH only: Winter > Summer > Monsoon
  mute() {
    // the tap that starts the audio should not also mute it
    if (performance.now() - audio.unlockedAt < 700) { setMuted(false); return; }
    setMuted(!audio.muted);
  },
  engine() { toggleEngine(); },
  power() { setLever(drive.lever + 1); },
  brake() { setLever(drive.lever - 1); },
  light() { toggleLight(); },
};
for (const [id, act] of [['b-mode', 'mode'], ['b-pause', 'pause'], ['b-speed', 'speed'], ['b-skip', 'skip'], ['b-time', 'time'],
                         ['b-season', 'season'], ['b-mute', 'mute']])
  btn(id).addEventListener('click', () => { unlockAudio(); actions[act](); syncButtons(); });

// Power and brake step once per tap and keep stepping while held; the horn
// sounds while held. A click with no pointer (keyboard on the button) taps.
let holdTimer = 0;
const endHold = () => { clearTimeout(holdTimer); holdTimer = 0; };

function skipToNextStation() {
  if (ui.complete || sim.station >= LAST_STATION || drive.on) return;
  sim.doorOpen = 1;
  smokePool.n = sparkPool.n = 0;
  arrive(sim.station + 1, 0);
}

const timeScale = () => (ui.paused ? 0 : ui.speed) * (input.fast ? CONFIG.FAST_FACTOR : 1);
