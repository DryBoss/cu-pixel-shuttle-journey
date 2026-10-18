'use strict';
// js/01-config/world.js
// Defines: SCALE, TERRAIN, BRIDGE, PARALLAX, LAYER_Y, PLAT

// The landscape between the stations, in travel order. Each section starts
// at [station index, world px from that station]; neighbouring sections
// cross-fade over CONFIG.TERRAIN_BLEND px. What a section paints and spawns
// in the far, mid and foreground layers is defined in SECTIONS.
const SCALE = CONFIG.PX_PER_KM / 700;                 // the distances below were laid out at 700 px per km
const TERRAIN = [
  { id: 'closed' },                       // out of Bottoli: dense, buildings shoulder to shoulder against the line
  { id: 'colony', at: [1, 300 * SCALE] }, // past Dewanhat: the old Railway Colony, the city opening up into greenery, all the way to Jhawtola
  { id: 'khulshi', at: [2, 150 * SCALE] },       // Jhawtola to Polytechnic: along the Khulshi hills, a closed-in green corridor of boundary walls and shade trees
  { id: 'closed', at: [3, 100 * SCALE] },
  { id: 'nasirabad', at: [4, -750 * SCALE] },    // leaving the quiet institutional walls: the hyper-dense commercial zone of Nasirabad and the 2 No. Gate, the yard widening towards Sholosohor
  { id: 'slum',   at: [4, 150 * SCALE] },        // and out the other side of the junction
  { id: 'mill',   at: [4, 1500 * SCALE] },        // the huge jute mill, midway to Cantonment
  { id: 'cantt',  at: [4, 2900 * SCALE], blend: 30 },   // greenery inside the cantonment, through its station: a hard border, the factory wall just ends
  { id: 'village', at: [5, 500 * SCALE], blend: 40 },        // paddy, ponds and tin roofs beyond
  { id: 'hathazari', at: [6, 200 * SCALE], blend: 200 },     // Choudhury Hat to Foteyabad: the deep, open countryside of Hathazari
  { id: 'village2', at: [7, 300 * SCALE] },                  // and on towards the University
];
// Steel truss railway bridge over the Meghna, just past Bhairab Bazar
const BRIDGE = { at: [1, 600], spans: 0, span: 120 };   // no Meghna bridge on this line

// Scroll speed of each parallax layer relative to the track
const PARALLAX = { clouds: 0.05, far: 0.2, mid: 0.5, track: 1.0, fg: 1.3 };

// Screen y where each layer / sprite is drawn
const LAYER_Y = { clouds: 6, far: 60, mid: 84, poles: 92,
                  track: 140, fg: 146, loco: 116, car: 121, wheel: 144 };

// Near-side platform geometry (screen y). People stand with their feet
// between WALK_MIN and WALK_MAX; doors span DOOR_TOP..DOOR_FLOOR.
const PLAT = { TOP: 148, EDGE_Y: 152, WALK_MIN: 154, WALK_MAX: 169,
               DOOR_TOP: 125, DOOR_FLOOR: 136,
               STALL_X: 280, STALL_Y: 163, BOARD_X: 132 };
