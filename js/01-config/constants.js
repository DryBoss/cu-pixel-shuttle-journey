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
    // A heavy diesel with a full rake of steel carriages: slow to get going, slow to stop, loath to lose its speed
    ACCEL: 3.4, KNEE: 45,               // px/s² at full power (0 to cruise takes the better part of a minute); tractive effort fades above KNEE px/s
    DRAG: [0.12, 0.00012],              // rolling + air resistance: c0 + c1 * v² (steel on steel: it coasts for minutes)
    BRAKE: 1.6, EMERGENCY: 12,          // px/s² per brake step, emergency brake
    // air brakes: the pressure has to travel down the pipe before anything bites (s), then builds / bleeds off at a rate (1/s)
    BRAKE_DELAY: 1.1, EMG_DELAY: 0.35, RELEASE_DELAY: 1.4,
    BRAKE_APPLY: 0.55, BRAKE_EMG_RATE: 2.4, BRAKE_RELEASE: 0.3,
    // wheel slip: too much power at low speed (and on wet rails much sooner) spins the wheels
    SLIP_SPEED: 15,                     // km/h: below this the wheels can break away
    SLIP_NOTCH: [7, 5],                 // lever notch that makes them slip: dry rails, Monsoon (wet rails)
    SLIP_CLEAR: [3, 2],                 // drop to this notch to grip again: dry, wet
    SLIP_TRAC: 0.06,                    // the traction left while slipping
    // the climb into the Chittagong University hills, from just past Foteyabad to the platform at CU
    GRAVITY: 2.0, GRADE_RAMP: 450, GRADE_EASE: 320,   // px/s² dragging the train back on the slope; px the slope takes to steepen / to flatten before CU
    // coupler slack: slamming from heavy power to heavy brake (or back) without pausing at notch 0
    SLACK_POWER: 5, SLACK_BRAKE: 3,     // lever positions that count as "heavy"
    SLACK_NEUTRAL: 0.8, SLACK_WINDOW: 6, SLACK_MIN_SPEED: 4, SLACK_COMFORT: 30,   // s at notch 0 that keeps the slack in; s the train remembers; km/h; comfort lost
    CRANK_TIME: 2.2, SHUTDOWN_TIME: 2.5,
    LIMIT: 100, LIMIT_HILLS: 80, LIMIT_CU_HILLS: 50, LIMIT_BRIDGE: 60, LIMIT_STATION: 60,   // km/h (= px/s)
    COMFORT_ACCEL: 5,                   // px/s² passengers put up with
    FIRST_DEP: 32, DWELL: 16, SLACK: 10, // timetable: s to first departure, per stop, per leg
    SCHED_MARGIN: 1.15,                 // the timetable allows a sensible driver this much longer than the ideal run
    ON_TIME: 8,                         // game minutes either side that count as on time
  },

  // time of day follows the trip: early morning at Kamalapur, night at Sylhet
  HOUR_START: 7.25, HOUR_END: 8.25,
  HOUR_EASE: 3,                         // max game hours per second when time jumps (skip, T)

  // weather is no longer random: the season decides it (see scenario.js)

  TRAIN_FRONT_X: 273,                   // screen x of the headlight
  LOCO_W: 46, CAR_W: 39, CAR_GAP: 2, CAR_COUNT: 5,
  WHEEL_R: 3.5, WHEEL_FRAMES: 6,
  BN_SIZE: 11,                          // px size Bangla text is rasterised at

  // particle pools [normal, low quality]; nothing is allocated while running
  SMOKE_MAX: [70, 40], RAIN_MAX: [260, 130], SPLASH_MAX: [60, 30],
  SPARK_MAX: [70, 36], BIRD_MAX: [8, 5], FLUFF_MAX: [60, 30],
  LOW_QUALITY_MS: 11,                   // average frame cost that switches to low quality
};
