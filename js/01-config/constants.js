'use strict';
// js/01-config/constants.js
// Defines: W, CONFIG

// =====================================================================
// 1. CONFIG
// =====================================================================
const W = 320, H = 180;                 // internal resolution

const CONFIG = {
  STEP: 1 / 60,                         // fixed simulation timestep (s)
  MAX_FRAME: 0.25,                      // clamp long frames (tab switches)
  FAST_FACTOR: 4,                       // hold F to fast-forward

  CRUISE_SPEED: 80,                     // world px per second
  ACCEL_TIME: 7,                        // s, 0 -> cruise
  BRAKE_TIME: 6,                        // s, cruise -> 0 (nominal)
  PX_PER_KM: 2135,                        // route km -> world px (compressed)
  TERRAIN_BLEND: 300,                   // world px over which one landscape fades into the next

  // station stop sequence (seconds)
  SETTLE_TIME: 0.8,                     // brakes settle before doors open
  DOOR_TIME: 0.7,                       // doors slide open / closed
  BOARD_TIMEOUT: 26,                    // safety cap on the boarding phase
  FLAG_TIME: 2.2,                       // guard waves the green flag
  HORN_TIME: 1.6,                       // horn, then depart

  // DRIVE mode: the player drives with one combined lever, -5 (emergency
  // brake) .. -1 brake steps, 0 coast, 1 .. 8 power notches
  DRIVE: {
    NOTCHES: 8, BRAKES: 4,
    ACCEL: 15, KNEE: 45,                // px/s² at full power; tractive effort fades above KNEE px/s
    DRAG: [0.5, 0.00035],               // rolling + air resistance: c0 + c1 * v²
    BRAKE: 4.5, EMERGENCY: 28,          // px/s² per brake step, emergency brake
    CRANK_TIME: 2.2, SHUTDOWN_TIME: 2.5,
    LIMIT: 100, LIMIT_HILLS: 80, LIMIT_CU_HILLS: 50, LIMIT_BRIDGE: 60, LIMIT_STATION: 60,   // km/h (= px/s)
    COMFORT_ACCEL: 16,                  // px/s² passengers put up with
    FIRST_DEP: 32, DWELL: 16, SLACK: 6, // timetable: s to first departure, per stop, per leg
    SCHED_SPEED: 84,                    // px/s the timetable assumes on open line
    ON_TIME: 8,                         // game minutes either side that count as on time
  },

  // time of day follows the trip: early morning at Kamalapur, night at Sylhet
  HOUR_START: 7.25, HOUR_END: 8.25,
  HOUR_EASE: 3,                         // max game hours per second when time jumps (skip, T)

  // weather: light monsoon spells (seeded, so every trip gets the same ones)
  RAIN_GAP: [35, 80],                   // s of dry weather between spells
  RAIN_SPELL: [14, 28],                 // s a spell lasts
  LIGHTNING_RATE: 0.05,                 // strikes per second while it pours

  TRAIN_FRONT_X: 273,                   // screen x of the headlight
  LOCO_W: 46, CAR_W: 39, CAR_GAP: 2, CAR_COUNT: 5,
  WHEEL_R: 3.5, WHEEL_FRAMES: 6,
  BN_SIZE: 11,                          // px size Bangla text is rasterised at

  // particle pools [normal, low quality]; nothing is allocated while running
  SMOKE_MAX: [70, 40], RAIN_MAX: [180, 100], SPLASH_MAX: [60, 30],
  SPARK_MAX: [70, 36], FIREFLY_MAX: [40, 20], BIRD_MAX: [8, 5], FLUFF_MAX: [60, 30],
  LOW_QUALITY_MS: 11,                   // average frame cost that switches to low quality
};
