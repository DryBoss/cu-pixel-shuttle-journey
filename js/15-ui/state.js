'use strict';
// js/15-ui/state.js
// Defines: canvas, ui, input, updateUI

// =====================================================================
// 9. UI, SOUND AND INPUT
// =====================================================================
const canvas = document.getElementById('screen');
const ui = { bannerY: -40, bannerSt: 1, complete: false, panelY: -150, hover: false, debugW: 0,
             paused: false, speed: 1, timeMode: 0, rainMode: 0,      // toolbar state
             title: true, titleSel: 1 };                              // title card: 0 WATCH, 1 DRIVE
const input = { debug: false, fast: false };

function updateUI(dt) {
  const next = sim.station + 1;
  const show = next <= LAST_STATION && (sim.state === 'ARRIVING' ||
    ((sim.state === 'TRAVELING' || sim.state === 'DRIVING') && sim.nextStop - sim.dist < 900));
  if (show) ui.bannerSt = next;                           // latched while it slides out
  // slides out under the route map (under the driver's panels in DRIVE)
  ui.bannerY += ((show ? (drive.on ? 50 : 19) : -40) - ui.bannerY) * Math.min(1, dt * 5);
  ui.panelY += ((ui.complete ? (drive.final ? 24 : 44) : -150) - ui.panelY) * Math.min(1, dt * 4);
}
