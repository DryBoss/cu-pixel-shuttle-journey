'use strict';
// js/01-config/time.js
// Defines: LIGHT_KEYS, TIME_MODES

// Palette lighting by hour of day: [hour, lighting]. Between two different
// lightings the world cross-fades with an ordered dither; the sky, the
// colour tint and the glow of lamps follow the hour smoothly on top.
const LIGHT_KEYS = [[0, 'night'], [4.6, 'night'], [5.4, 'dusk'], [6.4, 'dusk'], [7.4, 'day'],
                    [17.0, 'day'], [17.9, 'dusk'], [18.9, 'dusk'], [19.9, 'night'], [24, 'night']];
// The time-of-day button / T key cycles these; AUTO follows the trip
const TIME_MODES = [['AUTO', null], ['DAY', 12], ['DUSK', 18.3], ['NIGHT', 22.5]];
