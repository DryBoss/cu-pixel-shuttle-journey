'use strict';
// js/16-audio/synth.js
// Defines: noiseHit, tone

// --- DRIVE sound effects: all short, synthesised one-shots ------------------
function noiseHit(t, dur, type, freq, q, vol) {
  const ac = audio.ctx, src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  src.buffer = audio.noise; src.loop = true;
  f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + Math.min(0.03, dur * 0.2));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(audio.master);
  src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.05);
}
function tone(t, freq, dur, vol, type = 'sine') {
  const ac = audio.ctx, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(audio.master);
  o.start(t); o.stop(t + dur + 0.05);
}
