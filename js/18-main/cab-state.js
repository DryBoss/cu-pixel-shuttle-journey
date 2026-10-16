'use strict';
// js/18-main/cab-state.js
// Defines: bar, CAB_H, cabOn, cab, THROTTLE_Y, BRAKE_Y

// --- layout: canvas and toolbar share the screen --------------------------
// Portrait: toolbar under the picture (in two rows if it must). Wide
// screens: toolbar beside it. If neither leaves room, the toolbar floats
// over the bottom of the picture.
const bar = document.getElementById('bar');
// --- the driver's cab: gauges, a throttle handle, a brake handle, the engine key,
// the headlight switch and a horn cord, all worked by pointer or touch
const CAB_H = 96;
let cabOn = false;
const cab = document.getElementById('cab'), cctx = cab.getContext('2d');
cctx.imageSmoothingEnabled = false;
const THROTTLE_Y = n => 82 - n * 7.5;                    // notch 0 at the bottom, 8 at the top
const BRAKE_Y = n => 22 + n * 12;                        // release at the top, emergency at the bottom
