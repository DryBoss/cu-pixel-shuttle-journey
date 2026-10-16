'use strict';
// js/16-audio/beds.js
// Defines: updateAudioBeds, trackSound, playClick

// Ten times a second, steer the continuous beds towards the scene
function updateAudioBeds(dt) {
  if (!audio.ctx || audio.ctx.state !== 'running' || (audio.bedT += dt) < 0.1) return;
  audio.bedT = 0;
  const now = audio.ctx.currentTime, run = ui.paused ? 0 : 1, sp = Math.min(1, sim.speed / CONFIG.CRUISE_SPEED) * run;
  const st = STATIONS[sim.state === 'STOPPED' ? sim.station : Math.min(LAST_STATION, sim.station + 1)];
  const near = Math.max(0, 1 - Math.abs(st.dist - sim.dist) / 500) * Math.min(1, sim.people.length / 8) * run;
  const set = (node, v) => node.gain.setTargetAtTime(v, now, 0.15);
  set(audio.rumble, sp * (0.16 + 0.12 * sim.bridgeMix));
  set(audio.metal, sp * sim.bridgeMix * 0.05);
  set(audio.boom, sp * sim.bridgeMix * 0.35);
  set(audio.murmur, near * 0.09);
  set(audio.rain, weather.level * 0.16 * run);
  set(audio.patter, weather.level * 0.05 * run);
  const rpm = drive.rpm, f = 24 + rpm * 52;
  audio.engOsc.frequency.setTargetAtTime(f, now, 0.2);
  audio.engSub.frequency.setTargetAtTime(f / 2, now, 0.2);
  audio.engLfo.frequency.setTargetAtTime(f / 5, now, 0.2);
  set(audio.engine, rpm > 0.02 ? (0.05 + 0.09 * rpm) * (drive.on ? 1 : 0.55) * run : 0);
  set(audio.squeal, squealLevel() * 0.02 * run);
}

// Rail joints: every JOINT_PX of travel, the four axles of a carriage click
// over it in turn - so the rhythm follows the speed exactly
function trackSound(dt) {
  sim.jointAcc += sim.speed * dt;
  if (sim.jointAcc < JOINT_PX) return;
  sim.jointAcc -= JOINT_PX;
  if (!audioOn() || sim.speed < 3) return;
  const now = audio.ctx.currentTime, rate = sim.speed * timeScale();
  for (let i = 0; i < AXLES.length; i++) playClick(now + 0.02 + AXLES[i] / rate, i === 0 || i === 2);
}

function playClick(t, strong) {
  const ac = audio.ctx, metal = sim.bridgeMix > 0.3, peak = (strong ? 0.32 : 0.22) * (1 + sim.bridgeMix * 0.7);
  const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain();
  src.buffer = audio.noise;
  bp.type = 'bandpass'; bp.frequency.value = metal ? 3200 : 1700; bp.Q.value = metal ? 9 : 1.6;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (metal ? 0.14 : 0.06));
  src.connect(bp); bp.connect(g); g.connect(audio.master);
  src.start(t, Math.random() * 1.8, 0.16);
  const o = ac.createOscillator(), og = ac.createGain();               // the thump under the click
  o.frequency.setValueAtTime(95, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.07);
  og.gain.setValueAtTime(peak * 0.9, t);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  o.connect(og); og.connect(audio.master);
  o.start(t); o.stop(t + 0.1);
}
