'use strict';
// js/11-people/palettes.js
// Defines: SKINS, SHIRTS, TROUSERS, LUNGIS, SARIS, KAMEEZ, BAGS, PASSENGER_KINDS

// =====================================================================
// 7. PEOPLE
// =====================================================================
// Each person is a procedural "design" (clothes, skin, what they carry),
// painted into small sprites on demand and cached per lighting.
// Frames: 0-3 walk cycle, 4 sitting, 5/6 sipping tea, 7/8 waving a flag.
const SKINS = ['tan', 'brown', 'rust', 'brown'];
const SHIRTS = ['white', 'cream', 'skyLight', 'skyMid', 'grayLight', 'paddy', 'rose', 'orange', 'blue', 'tan'];
const TROUSERS = ['navy', 'grayDark', 'brown', 'gray', 'indigo'];
const LUNGIS = [['blue', 'navy'], ['green', 'greenDark'], ['purple', 'indigo'], ['skyMid', 'blue'],
                ['red', 'rust'], ['grayLight', 'white']];                         // checked cotton
const SARIS = [['red', 'glow'], ['rose', 'white'], ['orange', 'red'], ['purple', 'glow'], ['blue', 'skyLight'],
               ['green', 'glow'], ['glow', 'red'], ['skyMid', 'white'], ['amber', 'green']];  // [body, border]
const KAMEEZ = [['rose', 'white', 'skyMid'], ['skyMid', 'navy', 'white'], ['paddy', 'green', 'red'],
                ['purple', 'white', 'rose'], ['orange', 'cream', 'red'], ['green', 'white', 'glow']]; // [kameez, salwar, dupatta]
const BAGS = ['brown', 'ink', 'red', 'navy', 'grassLight'];
const PASSENGER_KINDS = ['trousers', 'trousers', 'trousers', 'trousers', 'trousers', 'trousers', 'trousers', 'trousers', 'trousers',
                         'kameez', 'kameez', 'kameez', 'kameez', 'kameez', 'kameez', 'kameez'];   // every passenger is a student
