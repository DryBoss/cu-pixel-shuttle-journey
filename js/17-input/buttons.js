'use strict';
// js/17-input/buttons.js
// Defines: SPEEDS, ICONS, SEASON_ICONS, PHASE_ICONS, btn, syncButtons

// --- controls: toolbar buttons and keys --------------------------------------
const SPEEDS = [1, 2, 4];
const ICONS = {
  pause: '<path d="M4 3h3v10H4zM9 3h3v10H9z"/>',
  play: '<path d="M4 3h2v1h2v1h2v1h2v1h1v2h-1v1h-2v1H8v1H6v1H4z"/>',
  sun: '<path d="M6 5h4v1h1v4h-1v1H6v-1H5V6h1zM7 1h2v2H7zM7 13h2v2H7zM1 7h2v2H1zM13 7h2v2h-2zM3 3h2v2H3zM11 3h2v2h-2zM3 11h2v2H3zM11 11h2v2h-2z"/>',
  dusk: '<path d="M5 7h6v1h1v2H4V8h1zM1 11h14v1H1zM3 13h10v1H3zM7 2h2v3H7zM2 5h2v2H2zM12 5h2v2h-2z"/>',
  moon: '<path d="M7 2h4v1H8v1H7v1H6v6h1v1h1v1h3v1H7v-1H5v-1H4V9H3V6h1V4h1V3h2z"/>',
  dawn: '<path d="M5 8h6v1h1v2H4V9h1zM1 12h14v1H1zM7 3h2v3H7zM2 6h2v2H2zM12 6h2v2h-2z"/>',
  rain: '<path d="M5 2h5v1h2v1h1v2h1v3H1V6h1V4h1V3h2zM3 11h1v2H3zM7 11h1v2H7zM11 11h1v2h-1zM5 13h1v2H5zM9 13h1v2H9z"/>',
  snow: '<path d="M7 1h2v14H7zM1 7h14v2H1zM3 3h2v2H3zM11 3h2v2h-2zM3 11h2v2H3zM11 11h2v2h-2z"/>',
  auto: '<path d="M6 2h4v1h2v1h1v2h1v4h-1v2h-1v1h-2v1H6v-1H4v-1H3v-2H2V6h1V4h1V3h2zM7 4v5h4V8H8V4z"/>',
  sound: '<path d="M2 6h3l3-3h1v10H8l-3-3H2zM11 5h1v6h-1zM13 3h1v10h-1z"/>',
  mute: '<path d="M2 6h3l3-3h1v10H8l-3-3H2zM11 5h1v1h-1zM12 6h1v1h-1zM13 7h1v1h-1zM14 8h1v1h-1zM14 5h1v1h-1zM13 6h1v1h-1zM12 7h1v1h-1zM11 8h1v1h-1z"/>',
};
const SEASON_ICONS = { Winter: ICONS.snow, Summer: ICONS.sun, Monsoon: ICONS.rain };
const PHASE_ICONS = { Morning: ICONS.dawn, Midday: ICONS.sun, Afternoon: ICONS.sun, Dusk: ICONS.dusk, Night: ICONS.moon };
const btn = id => document.getElementById(id);

function syncButtons() {
  // AUTO and DRIVE each show their own set of buttons
  const driving = drive.on && !ui.title;
  let relayout = false;
  if (driving !== cabOn) { cabOn = driving; relayout = true; }                // the cab shows while you drive
  for (const b of bar.children) {
    const hide = b.classList.contains('drv') ? !driving : b.classList.contains('aut') && driving;
    if (b.hidden !== hide) { b.hidden = hide; relayout = true; }
  }
  if (relayout) fit();
  const set = (id, icon, label, on, aria) => {
    const b = btn(id);
    if (icon && b.dataset.icon !== icon) { b.firstElementChild.innerHTML = icon; b.dataset.icon = icon; }
    if (label !== null && b.lastChild.textContent !== label) b.lastChild.textContent = label;
    b.classList.toggle('on', !!on);
    b.setAttribute('aria-label', aria);
  };
  set('b-pause', ui.paused ? ICONS.play : ICONS.pause, ui.paused ? 'PLAY' : 'PAUSE', ui.paused, ui.paused ? 'Resume' : 'Pause');
  const sp = btn('b-speed');
  if (sp.textContent !== ui.speed + 'x') sp.textContent = ui.speed + 'x';
  sp.classList.toggle('on', ui.speed > 1);
  sp.setAttribute('aria-label', 'Speed ' + ui.speed + 'x');
  const ph = phaseDef(), se = seasonDef();             // WATCH only: step through the scenario by hand
  set('b-time', PHASE_ICONS[ph.id], ph.short, false, 'Time of day: ' + ph.name + ' (tap for the next)');
  set('b-season', SEASON_ICONS[se.id], se.short, false, 'Season: ' + se.name + ' (tap for the next)');
  const live = audio.ctx && audio.ctx.state === 'running';
  set('b-mute', live && !audio.muted ? ICONS.sound : ICONS.mute, !live ? 'TAP' : audio.muted ? 'OFF' : 'ON', live && !audio.muted,
      !live ? 'Turn sound on' : audio.muted ? 'Unmute' : 'Mute');
  set('b-mode', null, driving ? 'DRIVE' : 'AUTO', driving, driving ? 'Driver mode on: hand back to autopilot' : 'Drive the train yourself');
}
