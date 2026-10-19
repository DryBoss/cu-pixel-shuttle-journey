'use strict';
// js/01-config/time.js
// Defines: LIGHT_KEYS

// Palette lighting by hour of day: [hour, lighting]. Between two different
// lightings the world cross-fades with an ordered dither; the sky, the
// colour tint and the glow of lamps follow the hour smoothly on top.
// (Dusk lighting - lit windows and lamps - starts at 17.0 so the 17.5
// golden-hour scenario already has its station lights on.)
const LIGHT_KEYS = [[0, 'night'], [4.6, 'night'], [5.4, 'dusk'], [6.4, 'dusk'], [7.4, 'day'],
                    [16.2, 'day'], [17.0, 'dusk'], [18.9, 'dusk'], [19.9, 'night'], [24, 'night']];
// The time-of-day button / T key cycles TIME_PHASES (see scenario.js)
