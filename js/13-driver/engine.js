'use strict';
// js/13-driver/engine.js
// Defines: setEngine, startEngine, toggleEngine, updateEngine

// --- engine ---------------------------------------------------------------
function setEngine(s) {
  drive.engine = s;
  drive.engineT = 0;
  syncButtons();
}
function startEngine() { setEngine('CRANK'); playCrank(); }

function toggleEngine() {
  if (drive.engine === 'OFF') {
    if (drive.throttle > 0) { toast('THROTTLE TO IDLE FIRST', 'amber'); return; }
    startEngine();
  } else if (drive.engine === 'ON') {
    if (sim.speed > 0.5) toast('ENGINE OFF - COASTING', 'amber');
    setEngine('SHUTDOWN');
    playThump(0.12);
  }
}

// Engine speed: cranking, idling, revving with the notch (in AUTO with the
// journey phase), winding down
function updateEngine(dt) {
  const D = CONFIG.DRIVE;
  drive.engineT += dt;
  let target = 0, rate = 0.5;
  switch (drive.engine) {
    case 'CRANK':
      target = 0.12;
      if (drive.engineT >= D.CRANK_TIME) {              // it catches: a cough of black smoke
        setEngine('ON');
        drive.rpm = 0.5;
        sim.shake = Math.max(sim.shake, 0.7);
        for (let i = 0; i < 6; i++) emitPuff(true);
        playThump(0.25);
        toast('ENGINE RUNNING', 'grassLight');
      }
      break;
    case 'SHUTDOWN':
      rate = 0.16;
      if (drive.engineT >= D.SHUTDOWN_TIME) { setEngine('OFF'); playAir(0.9, 0.07); }
      break;
    case 'ON':
      target = drive.on ? 0.3 + 0.7 * Math.max(0, drive.lever) / D.NOTCHES
             : sim.state === 'DEPARTING' ? 0.95 : sim.state === 'TRAVELING' ? 0.65 : sim.stopPhase === 'HORN' ? 0.6 : 0.3;
      if (target > drive.rpm) rate = 0.6;               // spools up a little faster than it winds down
      break;
  }
  drive.rpm += Math.max(-rate * dt, Math.min(rate * dt, target - drive.rpm));
}
