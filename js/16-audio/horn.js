'use strict';
// js/16-audio/horn.js
// Defines: playHorn, hornBlast, hornVoice, hornRelease, hornOn, hornOff

// Two-tone chord, three detuned saws per tone, a brassy peak and vibrato.
// Long blast on departure; two short toots passing villages.
function playHorn(short) {
  sim.hornWave = short ? 1 : 1.6;
  if (!audioOn()) return;
  const t0 = audio.ctx.currentTime + 0.02;
  if (short) { hornBlast(t0, 0.3); hornBlast(t0 + 0.42, 0.5); }
  else hornBlast(t0, 1.3);
}

function hornBlast(t0, dur) { hornRelease(hornVoice(t0), t0 + dur - 0.15); }

// One horn voice, sounding from t0 until hornRelease()
function hornVoice(t0) {
  const ac = audio.ctx, out = ac.createGain(), lp = ac.createBiquadFilter(), pk = ac.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 2400;
  pk.type = 'peaking'; pk.frequency.value = 900; pk.gain.value = 6;
  out.gain.setValueAtTime(0, t0);
  out.gain.linearRampToValueAtTime(0.09, t0 + 0.07);
  lp.connect(pk); pk.connect(out); out.connect(audio.master);
  const vib = ac.createOscillator(), vg = ac.createGain(), oscs = [vib];
  vib.frequency.value = 5.5; vg.gain.value = 2.5; vib.connect(vg);
  for (const f of HORN_TONES)
    for (const det of [-7, 0, 6]) {
      const o = ac.createOscillator();
      o.type = 'sawtooth';
      o.detune.value = det;
      o.frequency.setValueAtTime(f * 0.94, t0);
      o.frequency.exponentialRampToValueAtTime(f, t0 + 0.09);
      vg.connect(o.frequency);
      o.connect(lp);
      oscs.push(o);
    }
  for (const o of oscs) o.start(t0);
  return { out, oscs };
}
function hornRelease(h, t) {
  h.out.gain.setValueAtTime(0.09, t);
  h.out.gain.linearRampToValueAtTime(0, t + 0.15);
  for (const o of h.oscs) o.stop(t + 0.2);
}

// DRIVE: the horn sounds for as long as it is held (at least a short toot)
function hornOn() {
  if (drive.horn) return;
  drive.horn = true;
  sim.hornWave = 99;
  if (!audioOn()) return;
  audio.hornT0 = audio.ctx.currentTime + 0.01;
  audio.horn = hornVoice(audio.hornT0);
}
function hornOff() {
  if (!drive.horn) return;
  drive.horn = false;
  sim.hornWave = Math.min(sim.hornWave, 0.3);
  if (!audio.horn) return;
  hornRelease(audio.horn, Math.max(audio.ctx.currentTime, audio.hornT0 + 0.3));
  audio.horn = null;
}
