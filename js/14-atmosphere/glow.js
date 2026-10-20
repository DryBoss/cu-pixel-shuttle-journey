'use strict';
// js/14-atmosphere/glow.js
// Defines: haloSprite, GLOW, drawGlow

function haloSprite(r, rgb, a0) {
  const [c, g] = makeCanvas(r * 2, r * 2);
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, 'rgba(' + rgb + ',' + a0 + ')');
  grad.addColorStop(0.35, 'rgba(' + rgb + ',' + a0 * 0.35 + ')');
  grad.addColorStop(1, 'rgba(' + rgb + ',0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, r * 2, r * 2);
  return c;
}

const GLOW = (() => {
  const warm = '255,196,96';
  const halos = [haloSprite(14, warm, 0.75), haloSprite(6, warm, 0.6), haloSprite(7, '255,214,120', 0.7)];   // by LIGHT_*
  // every lit carriage and cab window of the rake, pre-composed
  const [train, tg] = makeCanvas(W, 40), small = haloSprite(5, warm, 0.5), y0 = LAYER_Y.car - 10;
  tg.globalCompositeOperation = 'lighter';
  TRAIN.vehicles.forEach((veh, i) => {
    if (i === 0) { tg.drawImage(haloSprite(7, warm, 0.55), veh.x + 40 - 7, LAYER_Y.loco + 9 - 7 - y0); return; }
    for (let k = 0; k < 5; k++) tg.drawImage(small, veh.x + 9 + k * 5 - 5, 6 + 10 - 5);
  });
  // headlight: a cone of light thrown forward and down onto the track
  const [cone, cg] = makeCanvas(90, 50), lin = cg.createLinearGradient(0, 0, 90, 0);
  lin.addColorStop(0, 'rgba(255,236,170,0.55)');
  lin.addColorStop(0.5, 'rgba(255,226,150,0.2)');
  lin.addColorStop(1, 'rgba(255,220,140,0)');
  cg.fillStyle = lin;
  cg.beginPath(); cg.moveTo(0, 6); cg.lineTo(90, 2); cg.lineTo(90, 50); cg.lineTo(0, 9); cg.closePath(); cg.fill();
  // a second, wider and fainter cone behind it: the glowing air around the beam
  const [cone2, c2g] = makeCanvas(76, 64), lin2 = c2g.createLinearGradient(0, 0, 76, 0);
  lin2.addColorStop(0, 'rgba(255,240,190,0.3)');
  lin2.addColorStop(1, 'rgba(255,230,160,0)');
  c2g.fillStyle = lin2;
  c2g.beginPath(); c2g.moveTo(0, 7); c2g.lineTo(76, 0); c2g.lineTo(76, 64); c2g.closePath(); c2g.fill();
  return { halos, train, trainY: y0, cone, cone2, flare: haloSprite(9, '255,240,190', 0.9), door: haloSprite(8, warm, 0.6),
           moon: haloSprite(22, '190,200,255', 0.35),
           sun: haloSprite(40, '255,170,90', 0.45), spark: haloSprite(3, '255,190,90', 0.9) };
})();

function drawGlow(g) {
  const n = sim.night, t = sim.clock;
  g.globalCompositeOperation = 'lighter';
  if (n > 0.02) {
    g.globalAlpha = n * 0.9;
    g.drawImage(GLOW.train, 0, GLOW.trainY);
    if (sim.doorOpen > 0.3) for (let i = 0; i < DOORS.length; i++) g.drawImage(GLOW.door, DOORS[i] + 2 - 8, PLAT.DOOR_TOP + 4 - 8);
    for (let i = 0; i < lights.n; i++) {
      const spr = GLOW.halos[lights.k[i]], r = spr.width >> 1;
      g.drawImage(spr, Math.round(lights.x[i]) - r, Math.round(lights.y[i]) - r);
    }
    if (celestial.moonUp) { g.globalAlpha = n * (1 - weather.level); g.drawImage(GLOW.moon, celestial.moonX - 22, celestial.moonY - 22); }
  }
  // headlight: a cone thrown forward and down onto the track. It needs the engine, works day or night
  // (a driver can switch it on in daylight; in WATCH it comes on by itself in the dark and in murk)
  const murk = Math.max(weather.level, fog.level), beam = drive.on ? 1 : Math.max(n, 0.7 * murk, 0.5);   // AUTO: the autopilot switches the headlight (autoLights) for darkness, rain and fog
  if (beam > 0.02 && drive.engine !== 'OFF' && drive.headlight) {
    g.globalAlpha = Math.min(1, beam * (1 + 0.7 * murk));   // rain and fog catch the beam
    g.drawImage(GLOW.cone2, CONFIG.TRAIN_FRONT_X, LAYER_Y.loco - 2);
    g.drawImage(GLOW.cone, CONFIG.TRAIN_FRONT_X, LAYER_Y.loco);
    g.drawImage(GLOW.flare, CONFIG.TRAIN_FRONT_X - 8, LAYER_Y.loco - 3);
    if (n < 0.5) {                                      // in daylight the beam needs more punch to show against the bright sky
      g.drawImage(GLOW.cone, CONFIG.TRAIN_FRONT_X, LAYER_Y.loco);
      g.drawImage(GLOW.flare, CONFIG.TRAIN_FRONT_X - 8, LAYER_Y.loco - 3);
    }
  }
  if (celestial.sunUp && celestial.sunLow > 0.5) {      // the low sun blooms
    g.globalAlpha = (celestial.sunLow - 0.5) * 2 * (1 - weather.level);
    g.drawImage(GLOW.sun, celestial.sunX - 40, celestial.sunY - 40);
  }
  g.globalAlpha = 1;
  for (let i = 0; i < sparkPool.n; i++) {               // brake sparks
    const s = sparkPool.items[i], x = Math.round(s.x), y = Math.round(s.y), k = s.age / s.life;
    g.drawImage(GLOW.spark, x - 3, y - 3);
    g.fillStyle = k < 0.3 ? PALETTE.white : k < 0.7 ? PALETTE.glow : PALETTE.amber;
    g.fillRect(x, y, 1, 1);
    g.fillRect(Math.round(s.x - s.vx * 0.015), Math.round(s.y - s.vy * 0.015), 1, 1);
  }
  drawBolt(g);
  if (weather.flash > 0.01) {                           // lightning lights up everything for an instant
    g.globalAlpha = weather.flash * 0.45;
    g.fillStyle = '#9aa4d8';
    g.fillRect(-2, -2, W + 4, H + 4);
    g.globalAlpha = 1;
  }
  g.globalCompositeOperation = 'source-over';
}
