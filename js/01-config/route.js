'use strict';
// js/01-config/route.js
// Defines: ROUTE, STATION_DEFAULTS

// The route, in travel order. To add a station, add an entry: only en,
// bn and km are required, everything else falls back to STATION_DEFAULTS.
//   en / bn   English and Bangla names shown on the board and banner
//   code      three letters for the route map
//   km        distance from Kamalapur along the line (approximate)
//   platform  [left, right] screen x of the platform while stopped here
//   roof      'umbrella' | 'canopy' | 'shelter'
//   crowd     passengers waiting to board, alight: passengers getting off
//   idle      extra people standing around
//   backdrop  extra scenery from BACKDROPS drawn near the station (the
//             landscape along the line itself comes from TERRAIN below)
//   extras    station-specific props / characters ('porter', 'fish', 'chests')
const ROUTE = [
  // km = distance from Bottoli along the line (whole-km figures from rail station listings; Dewanhat is an estimate)
  { en: 'BOTTOLI', bn: 'বটতলী', code: 'BTL', km: 0,
    platform: [-330, 650], roof: 'shed', roofColor: 'rust', oldSlab: true, crowd: 44, alight: 0, idle: 10,
    backdrop: ['city', 'bottoli'], extras: ['porter', 'clutter'] },
  { en: 'DEWANHAT', bn: 'দেওয়ানহাট', code: 'DWH', km: 2,           // only a stoppage: no platform, no roof, nothing
    platform: [-40, 360], roof: 'shelter', halt: true, crowd: [0, 2], alight: 1, idle: 0,
    backdrop: ['dewanhat'], extras: ['peanuts', 'locals'] },
  { en: 'JHAWTOLA', bn: 'ঝাউতলা', code: 'JHT', km: 5,
    platform: [-40, 360], roof: 'shelter', noRoof: true, crowd: 16, alight: 6, idle: 2,   // a solid station building, but no shed over the platform
    backdrop: ['jhawtola'], extras: ['hawkers'],
    slab: 'bleached',              // cracked, sun-bleached concrete with a faded safety line
    ironLamps: true,               // tall free-standing iron lamp posts and wood-and-iron benches (no roof to hang them from)
    students: true,                // the crowd is mostly CU students with backpacks and bags
    liveStall: true,               // the tea stall: glowing clay stove, jars, hanging snacks, students sipping
    jhau: [8, 302, 317] },       // x of the Jhau trees at the platform's ends (they dapple the slab)
  { en: 'POLYTECHNIC', bn: 'পলিটেকনিক', code: 'PLT', km: 6,
    platform: [4, 318], roof: 'shelter', bare: true, crowd: [4, 8], alight: 4, idle: 0,     // just the platform: nothing on it, no shed
    backdrop: ['polytechnic'],     // the institute's long boundary wall, with mango and jackfruit crowns over it
    slab: 'weathered',             // heavily weathered concrete: mould, puddles, bleached patches, weeds in the cracks
    shade: [60, 175, 285],         // screen x of the crowns' shade on the slab (must match POLY_CROWNS in polytechnic.js, minus 100)
    students: true },              // Polytechnic students waiting in the open, mostly near the shade
  { en: 'SHOLOSOHOR', bn: 'ষোলশহর', code: 'SLS', km: 8,
    platform: [-90, 420], roof: 'junction', roofColor: 'blue', crowd: 78, alight: 8, idle: 4,
    backdrop: ['sholoshahar'],
    span: [-70, 390],              // the long, wide blue canopy covers the whole platform on thick concrete pillars
    extras: ['shops', 'swarm'],    // a row of platform shops, and a swarm of pacing hawkers and vendors
    furnished: true,               // plenty of benches, cast-iron bins and several water taps
    shopKinds: [2, 5, 0, 2, 6, 1, 2, 5, 6, 2],   // snack stalls, bookstall (5), tea, cold drinks (6), fruit
    students: true, studentShare: 0.9,           // a sea of students, nine in ten
    edgeCrowd: true },             // the crowd spills right up to the safety line and steps back as the train pulls in
  { en: 'CANTONMENT', bn: 'ক্যান্টনমেন্ট', code: 'CNT', km: 14,
    platform: [-40, 360], roof: 'military', roofColor: 'green', crowd: 16, alight: 8, idle: 2,
    span: [-10, 330],              // a long, neat deep-green shed on white concrete pillars
    slab: 'clean',                 // a spotless platform: no litter, no grime
    hedges: true,                  // straight, square-clipped hedges along the front edge
    shade: [30, 120, 210, 300],    // deep shade under the old rain trees
    backdrop: ['cantt'], extras: ['army'] },       // an army train stands behind ours, with guards; no vendors in a restricted zone
  { en: 'CHOUDHURY HAT', bn: 'চৌধুরীহাট', code: 'CDH', km: 17,
    platform: [-40, 360], roof: 'shelter', halt: true, green: true, crowd: 7, alight: 4, idle: 1,   // a stoppage in the greenery, like Dewanhat
    village: true,                 // a quiet village stop: lush grass, a beaten path, a rusty little shelter on bamboo and wooden posts, nobody selling
    grove: true },                 // swaying palms, bamboo and bananas choking the area behind and beside it
  { en: 'FOTEYABAD', bn: 'ফতেয়াবাদ', code: 'FTB', km: 19,
    platform: [-60, 380], roof: 'shelter', noRoof: true, crowd: 8, alight: 5, idle: 2,     // a better Jhawtola: red brick, no shed
    backdrop: ['foteyabad'],
    slab: 'baked',                 // an open, sun-baked platform: cleaner than the city stops, but bleached and hairline-cracked
    ironLamps: true,               // tall free-standing iron lamp posts along the back edge, a few wooden benches, a tap
    villagers: true },             // villagers in lungis and elders, mixed with students in kameez and trousers
  { en: 'CHITTAGONG UNIV.', bn: 'চট্টগ্রাম বিশ্ববিদ্যালয়', code: 'CU', km: 22,
    platform: [-60, 380], roof: 'shelter', noRoof: true, crowd: 0, alight: 40, idle: 2,
    backdrop: ['cu'], extras: ['shops', 'vendors', 'swarm'],   // no building at all: hills, jungle, a row of tong stalls and the swarm of sellers
    ironLamps: true, manyTaps: true,   // free-standing old iron lamp posts, benches, and water taps scattered along the open slab
    shopKinds: [7, 0, 7, 2, 1, 7, 0, 2, 7, 1],   // 'tong' shops: tea stalls with glowing clay stoves and hanging bananas, snacks, fruit
    swarmCount: 10,                // hawkers and vendors pacing among the stalls
    canopy: true,                  // old trees meeting overhead: leafy shade everywhere
    shade: [20, 70, 120, 170, 220, 270, 320],
    students: true },              // the alighting flood is all students in kameez and trousers with bags and backpacks
];
const STATION_DEFAULTS = { platform: [-40, 360], roof: 'canopy', roofColor: 'green',
                           crowd: 4, alight: 3, idle: 3, backdrop: [], extras: [] };
