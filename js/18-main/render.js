'use strict';
// js/18-main/render.js
// Defines: render

function render() {
  updateSky(ctx);
  placeCelestial();
  ctx.setTransform(1, 0, 0, 1, shake.x, shake.y);
  ctx.fillStyle = sky.pattern;                                           // 1. sky, sun, moon, stars
  ctx.fillRect(-2, -2, W + 4, H + 4);
  drawCelestial(ctx);
  const { a, b, f } = lightingAt(sim.hour), level = Math.round(f * 16);
  lights.n = 0;
  lights.collect = true;
  renderWorld(ctx, VARIANTS[level >= 16 ? b : a]);
  lights.collect = false;
  if (level > 0 && level < 16) {
    // keep lighting B only on pixels of the Bayer mask, then lay it over A
    bctx.setTransform(1, 0, 0, 1, shake.x, shake.y);
    bctx.clearRect(-2, -2, W + 4, H + 4);
    renderWorld(bctx, VARIANTS[b]);
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.globalCompositeOperation = 'destination-in';
    bctx.fillStyle = DITHER_MASKS[level];
    bctx.fillRect(0, 0, W, H);
    bctx.globalCompositeOperation = 'source-over';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bufB, 0, 0);
    ctx.setTransform(1, 0, 0, 1, shake.x, shake.y);
  }
  drawRain(ctx);
  applyTint(ctx);                                                        // 7. time-of-day colour
  drawGlow(ctx);                                                         // 8. lamps, windows, sparks
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const driving = drive.on && !ui.title;
  ui.debugW = 0;
  if (driving) drawPopups(ctx);
  drawMap(ctx);
  if (driving) { drawDriveHUD(ctx); drawHint(ctx); }
  if (input.debug) drawDebug(ctx);
  drawBanner(ctx);
  if (driving) drawToasts(ctx);
  drawPanel(ctx);
  if (ui.title) drawTitle(ctx);
  else if (driving && ui.paused) drawPaused(ctx);
  if (cabOn) drawCab();
}
