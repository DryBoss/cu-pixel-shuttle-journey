'use strict';
// js/16-audio/engine.js
// Defines: audio, JOINT_PX, AXLES, HORN_TONES, audioOn, unlockAudio, buildAudioGraph, setMuted

// --- sound: everything synthesised with Web Audio, no files -----------------
// The context is created on the first click / tap / key (browser rule).
// Continuous beds (rumble, bridge ring, crowd, rain) are looping noise
// through filters whose gains follow the scene; one-shots (rail joints,
// horn, thunder) are scheduled ahead on the audio clock.
const audio = { ctx: null, muted: false, master: null, noise: null, unlockedAt: 0, bedT: 0,
                rumble: null, metal: null, boom: null, murmur: null, rain: null, patter: null,
                engine: null, engOsc: null, engSub: null, engLfo: null, squeal: null,
                horn: null, hornT0: 0 };                // horn: the voice held down in DRIVE
const JOINT_PX = 96;                                    // one rail length between joints
const AXLES = [0, 8, 30, 38];                           // a carriage's two bogies: clickety ... clack
const HORN_TONES = [311.1, 370.0];                      // E-flat and F-sharp: the two-tone chord of a diesel air horn
const audioOn = () => audio.ctx && audio.ctx.state === 'running' && !audio.muted;

function unlockAudio() {
  if (!audio.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { audio.ctx = new AC(); } catch (e) { return; }
    audio.unlockedAt = performance.now();
    buildAudioGraph();
  }
  if (audio.ctx.state === 'suspended') audio.ctx.resume().then(syncButtons, syncButtons);
  syncButtons();
}

function buildAudioGraph() {
  const ac = audio.ctx;
  audio.master = ac.createGain();
  audio.master.gain.value = audio.muted ? 0 : 0.9;
  audio.master.connect(ac.destination);
  const len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;      // 2 s of white noise, shared
  audio.noise = buf;
  const loop = () => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; s.start(0, Math.random() * 2); return s; };
  const filt = (type, f, q) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b; };
  const gain = v => { const n = ac.createGain(); n.gain.value = v; return n; };
  const chain = nodes => { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); };
  const lfo = (hz, depth, param) => { const o = ac.createOscillator(), gn = gain(depth); o.frequency.value = hz; o.connect(gn); gn.connect(param); o.start(); };
  // wheels on rails: low rumble always, a ringing steel note and a hollow boom on the bridge
  audio.rumble = gain(0); chain([loop(), filt('lowpass', 220), audio.rumble, audio.master]);
  audio.metal = gain(0); chain([loop(), filt('bandpass', 2600, 7), audio.metal, audio.master]);
  audio.boom = gain(0); chain([loop(), filt('bandpass', 110, 4), audio.boom, audio.master]);
  // station crowd: two voice-band noises whose loudness wobbles like chatter
  audio.murmur = gain(0);
  const v1 = gain(0.55), v2 = gain(0.3);
  chain([loop(), filt('bandpass', 420, 1.2), v1, audio.murmur]);
  chain([loop(), filt('bandpass', 980, 2.2), v2, audio.murmur]);
  lfo(0.9, 0.3, v1.gain); lfo(2.3, 0.15, v1.gain); lfo(1.7, 0.2, v2.gain);
  chain([audio.murmur, filt('lowpass', 1600), audio.master]);
  // rain: hiss plus a brighter patter
  audio.rain = gain(0); chain([loop(), filt('highpass', 1200), filt('lowpass', 7500), audio.rain, audio.master]);
  audio.patter = gain(0); chain([loop(), filt('bandpass', 3800, 1.5), audio.patter, audio.master]);
  // diesel engine: a low sawtooth, a sub-octave square and some clatter, all
  // pulsing with the firing strokes; pitch and loudness follow the revs
  audio.engine = gain(0);
  const fire = gain(0.6), osc = type => { const o = ac.createOscillator(); o.type = type; o.start(); return o; };
  audio.engOsc = osc('sawtooth'); audio.engSub = osc('square'); audio.engLfo = osc('sine');
  chain([audio.engOsc, filt('lowpass', 300), fire]);
  chain([audio.engSub, filt('lowpass', 150), gain(0.5), fire]);
  chain([loop(), filt('bandpass', 190, 1.4), gain(1.2), fire]);
  const beat = gain(0.4);
  audio.engLfo.connect(beat); beat.connect(fire.gain);
  chain([fire, audio.engine, audio.master]);
  // brake squeal in the last metres before a stop
  audio.squeal = gain(0);
  const sq = osc('sine');
  sq.frequency.value = 3150;
  lfo(6.5, 40, sq.frequency);
  chain([sq, audio.squeal, audio.master]);
}

function setMuted(m) {
  audio.muted = m;
  if (audio.master) audio.master.gain.setTargetAtTime(m ? 0 : 0.9, audio.ctx.currentTime, 0.05);
  syncButtons();
}
