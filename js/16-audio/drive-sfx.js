'use strict';
// js/16-audio/drive-sfx.js
// Defines: playCrank, playThump, playAir, playNotch, playBeep, playChime, playScore, playThunder, playScreech, playBang

// Starter motor: a rising whine and the engine turning over, faster and faster
function playCrank() {
  if (!audioOn()) return;
  const ac = audio.ctx, t = ac.currentTime + 0.02, dur = CONFIG.DRIVE.CRANK_TIME;
  const o = ac.createOscillator(), lp = ac.createBiquadFilter(), g = ac.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(70, t);
  o.frequency.exponentialRampToValueAtTime(240, t + dur * 0.7);
  lp.type = 'lowpass'; lp.frequency.value = 900;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.025, t + 0.15);
  g.gain.setValueAtTime(0.025, t + dur - 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(lp); lp.connect(g); g.connect(audio.master);
  o.start(t); o.stop(t + dur + 0.05);
  for (let k = 0, tp = t + 0.1; tp < t + dur - 0.05; k++, tp += Math.max(0.09, 0.22 - k * 0.012))
    noiseHit(tp, 0.12, 'bandpass', 260, 1.2, 0.1 + Math.min(0.1, k * 0.008));
}
function playThump(v) {
  if (!audioOn()) return;
  const ac = audio.ctx, t = ac.currentTime + 0.01, o = ac.createOscillator(), g = ac.createGain();
  o.frequency.setValueAtTime(80, t);
  o.frequency.exponentialRampToValueAtTime(32, t + 0.3);
  g.gain.setValueAtTime(v, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  o.connect(g); g.connect(audio.master);
  o.start(t); o.stop(t + 0.45);
  noiseHit(t, 0.25, 'lowpass', 500, 0, v * 0.6);
}
function playAir(dur, vol) { if (audioOn()) noiseHit(audio.ctx.currentTime + 0.01, dur, 'highpass', 2200, 0, vol); }   // pneumatics: pssssh
function playNotch() { if (audioOn()) noiseHit(audio.ctx.currentTime + 0.005, 0.04, 'bandpass', 2600, 4, 0.12); }    // the lever clicking into a notch
function playBeep() { if (audioOn()) tone(audio.ctx.currentTime + 0.01, 1250, 0.09, 0.035, 'square'); }               // overspeed warning
function playChime() {                                                                                                 // doors closing
  if (!audioOn()) return;
  const t = audio.ctx.currentTime + 0.01;
  tone(t, 784, 0.45, 0.06); tone(t + 0.32, 622, 0.6, 0.06);
}
function playScore(good) {
  if (!audioOn()) return;
  const t = audio.ctx.currentTime + 0.05, notes = good ? [523, 659, 784, 1047] : [523, 659, 784];
  notes.forEach((f, i) => tone(t + i * 0.08, f, 0.3, 0.045, 'triangle'));
}

function playThunder(strength) {
  if (!audioOn()) return;
  const ac = audio.ctx, t = ac.currentTime, src = ac.createBufferSource(), lp = ac.createBiquadFilter(), g = ac.createGain();
  src.buffer = audio.noise; src.loop = true;
  lp.type = 'lowpass'; lp.frequency.setValueAtTime(380, t); lp.frequency.exponentialRampToValueAtTime(90, t + 2.5);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5 * strength, t + 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
  src.connect(lp); lp.connect(g); g.connect(audio.master);
  src.start(t, Math.random()); src.stop(t + 3.3);
}

// Wheel slip: steel wheels spinning on steel rails - a harsh, shrieking, metallic scream
function playScreech() {
  if (!audioOn()) return;
  const ac = audio.ctx, t = ac.currentTime + 0.01, dur = 0.6;
  for (const [f0, f1, vol] of [[1850, 2450, 0.06], [2780, 3500, 0.035], [1240, 1500, 0.04]]) {
    const o = ac.createOscillator(), bp = ac.createBiquadFilter(), g = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f0, t);
    o.frequency.linearRampToValueAtTime(f1, t + dur * 0.45);
    o.frequency.linearRampToValueAtTime(f0 * 0.88, t + dur);
    bp.type = 'bandpass'; bp.frequency.value = f0 * 1.25; bp.Q.value = 5;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(bp); bp.connect(g); g.connect(audio.master);
    o.start(t); o.stop(t + dur + 0.05);
  }
  noiseHit(t, dur, 'bandpass', 3400, 3, 0.14);
}

// Coupler slack: a violent iron BANG and the rattle of the rake running in
function playBang() {
  if (!audioOn()) return;
  const t = audio.ctx.currentTime + 0.005;
  playThump(0.9);
  tone(t, 150, 0.5, 0.16, 'square');
  tone(t + 0.005, 1180, 0.4, 0.08, 'sawtooth');
  tone(t + 0.01, 1760, 0.28, 0.05, 'square');
  noiseHit(t, 0.4, 'bandpass', 900, 0.8, 0.4);
  for (let k = 1; k <= 4; k++) {                                                      // carriage after carriage taking up the slack
    tone(t + 0.07 * k, 130 + k * 22, 0.22, 0.09 / k, 'square');
    noiseHit(t + 0.07 * k, 0.2, 'bandpass', 1300, 1, 0.2 / k);
  }
}
