'use strict';
// js/08-line/crossing-traffic.js
// Defines: VEH_KINDS, VEH_COLORS, CROSSINGS, crossings, VEHICLES, vehSprite

// --- level crossings: a road crosses the line, the gates come down and traffic waits
const VEH_KINDS = ['car', 'cng', 'rick', 'bus', 'truck', 'bike', 'cng', 'car', 'rick'];
const VEH_COLORS = ['red', 'white', 'skyMid', 'grayLight', 'paddy', 'orange', 'blue', 'rose'];
let CROSSINGS = null;                                  // built on first use (the stations are defined further down)
function crossings() {
  // The two crossings between Dewanhat and Jhawtola (through the Railway Colony) are busy local roads:
  // a fixed, colourful queue of white buses, green CNGs and cycle rickshaws waits for the train
  const BUSY = [[[['bus', 'white'], ['cng'], ['rick', 'red']], [['cng'], ['rick', 'skyMid'], ['bus', 'white']]],
                [[['rick', 'orange'], ['bus', 'white'], ['cng']], [['bus', 'white'], ['cng'], ['rick', 'rose']]],
                // Jhawtola crossing: the famous bottleneck, jammed with cycle rickshaws, motorbikes and brightly painted CNGs
                [[['rick', 'red'], ['bike', 'blue'], ['cngc', 'orange'], ['bike', 'red'], ['rick', 'skyMid']],
                 [['cngc', 'skyMid'], ['rick', 'rose'], ['bike', 'orange'], ['cngc', 'red'], ['bike', 'blue']]],
                // (the Cantonment border crossing, the last entry below, is neat and disciplined: one dark green army lorry waiting at the gate)
                // 2 No. Gate: the notorious wide crossing just before Sholosohor, three lanes packed solid with red and green buses, CNGs and motorbikes
                [[['bus', 'red'], ['cng'], ['bike', 'blue'], ['cngc', 'orange'], ['bike', 'red'], ['bus', 'green']],
                 [['bus', 'green'], ['cngc', 'skyMid'], ['bike', 'orange'], ['cng'], ['bike', 'blue'], ['bus', 'red']],
                 [['cng'], ['bus', 'red'], ['bike', 'red'], ['cngc', 'rose'], ['bus', 'green'], ['bike', 'orange']]]];
  if (!CROSSINGS) CROSSINGS = [[1, 650, null, BUSY[0]], [1, 1400, null, BUSY[1]], [2, 260, null, BUSY[2]], [3, 700], [4, 560], [4, 1250], [5, -1000, ['army', 'jeep', 'army', 'car']], [4, -330, null, BUSY[3], true], [4, 2930, null, [[['army']], []], false, true],
    // Hathazari: a brown dirt road, rickshaws and bikes, one lone green CNG
    [6, 520, null, [[['rick', 'red'], ['bike', 'blue'], ['rick', 'skyMid']], [['bike', 'orange'], ['cng'], ['rick', 'rose']]], false, false, true]].map(([si, off, kinds, fixed, wide, neat, dirt], n) => {
    const rng = mulberry32(5150 + n * 31), lanes = wide ? [[], [], []] : [[], []], pool = kinds || VEH_KINDS;
    lanes.forEach((lane, li) => {
      if (fixed) { for (const [kind, col] of fixed[li]) lane.push({ kind, col: col || VEH_COLORS[Math.floor(rng() * VEH_COLORS.length)] }); return; }
      for (let k = randInt(rng, 1, 3); k > 0; k--)
        lane.push({ kind: pool[Math.floor(rng() * pool.length)], col: VEH_COLORS[Math.floor(rng() * VEH_COLORS.length)] });
    });
    return { u: STATIONS[si].dist + off * SCALE, lanes, phase: rng() * 6, busy: wide ? 2 : !!fixed, wide: !!wide, neat: !!neat, dirt: !!dirt };
  });
  return CROSSINGS;
}

// Vehicles seen from behind, queueing for the gate. w x h, feet on the bottom row
const VEHICLES = {
  car: { w: 13, h: 10, paint(g, p, col) {
    rect(g, 2, 0, 9, 4, p[col]); rect(g, 3, 1, 7, 2, p.indigo);
    rect(g, 0, 4, 13, 4, p[col]); rect(g, 0, 5, 2, 2, p.red); rect(g, 11, 5, 2, 2, p.red);
    rect(g, 5, 6, 3, 1, p.white); rect(g, 0, 8, 13, 1, p.grayDark);
    rect(g, 1, 9, 2, 1, p.ink); rect(g, 10, 9, 2, 1, p.ink);
  } },
  cng: { w: 10, h: 13, paint(g, p) {                                // green auto-rickshaw
    rect(g, 1, 0, 8, 2, p.greenDark); rect(g, 0, 2, 10, 8, p.green);
    rect(g, 2, 3, 6, 3, p.indigo); for (let x = 2; x < 8; x += 2) rect(g, x, 3, 1, 3, p.grayDark);
    rect(g, 0, 8, 2, 1, p.red); rect(g, 8, 8, 2, 1, p.red); rect(g, 0, 10, 10, 1, p.greenDark);
    rect(g, 0, 11, 2, 2, p.ink); rect(g, 8, 11, 2, 2, p.ink);
  } },
  cngc: { w: 10, h: 13, paint(g, p, col) {                           // a brightly painted CNG
    rect(g, 1, 0, 8, 2, p.ink); rect(g, 0, 2, 10, 8, p[col]);
    rect(g, 2, 3, 6, 3, p.indigo); for (let x = 2; x < 8; x += 2) rect(g, x, 3, 1, 3, p.grayDark);
    rect(g, 0, 8, 2, 1, p.red); rect(g, 8, 8, 2, 1, p.red); rect(g, 0, 10, 10, 1, p.grayDark);
    rect(g, 0, 11, 2, 2, p.ink); rect(g, 8, 11, 2, 2, p.ink);
  } },
  rick: { w: 9, h: 15, paint(g, p, col) {                           // cycle rickshaw, hood folded
    rect(g, 1, 0, 7, 5, p[col]); rect(g, 1, 4, 7, 1, p.ink);
    rect(g, 3, 6, 3, 2, p.brown); rect(g, 2, 8, 5, 3, p.white);
    rect(g, 1, 11, 7, 1, p.grayDark); rect(g, 0, 12, 1, 3, p.ink); rect(g, 8, 12, 1, 3, p.ink);
  } },
  bus: { w: 22, h: 18, paint(g, p, col) {
    rect(g, 1, 0, 20, 2, p.grayLight); rect(g, 0, 2, 22, 13, p[col]);
    rect(g, 3, 4, 16, 5, p.indigo); px(g, 3, 4, p.skyLight); rect(g, 0, 10, 22, 1, p.cream);
    rect(g, 1, 11, 3, 2, p.red); rect(g, 18, 11, 3, 2, p.red); rect(g, 9, 12, 4, 2, p.white);
    rect(g, 0, 15, 22, 1, p.grayDark); rect(g, 2, 16, 4, 2, p.ink); rect(g, 16, 16, 4, 2, p.ink);
  } },
  truck: { w: 18, h: 16, paint(g, p, col) {
    rect(g, 0, 0, 18, 10, p[col]); rect(g, 0, 0, 18, 2, p.brown);
    for (let x = 3; x < 18; x += 4) rect(g, x, 2, 1, 8, p.brownDark);
    rect(g, 0, 8, 2, 2, p.red); rect(g, 16, 8, 2, 2, p.red);
    rect(g, 0, 10, 18, 2, p.grayDark); rect(g, 1, 12, 4, 4, p.ink); rect(g, 13, 12, 4, 4, p.ink);
  } },
  army: { w: 18, h: 16, paint(g, p) {                                // army lorry, canvas tilt
    rect(g, 0, 0, 18, 10, p.greenDark); for (let x = 3; x < 18; x += 5) rect(g, x, 0, 1, 10, p.green);
    rect(g, 0, 8, 2, 2, p.red); rect(g, 16, 8, 2, 2, p.red);
    rect(g, 0, 10, 18, 2, p.grayDark); rect(g, 1, 12, 4, 4, p.ink); rect(g, 13, 12, 4, 4, p.ink);
  } },
  jeep: { w: 11, h: 9, paint(g, p) {
    rect(g, 1, 0, 9, 3, p.greenDark); rect(g, 0, 2, 11, 5, p.green); rect(g, 4, 3, 3, 3, p.ink);
    rect(g, 0, 4, 2, 2, p.red); rect(g, 9, 4, 2, 2, p.red);
    rect(g, 0, 7, 11, 1, p.grayDark); rect(g, 1, 7, 2, 2, p.ink); rect(g, 8, 7, 2, 2, p.ink);
  } },
  bike: { w: 5, h: 10, paint(g, p, col) {
    rect(g, 1, 0, 3, 2, p.ink); rect(g, 0, 2, 5, 4, p[col]);
    rect(g, 1, 6, 3, 1, p.grayDark); px(g, 2, 7, p.red); rect(g, 2, 7, 1, 3, p.ink);
  } },
};
const vehSprite = (v, veh) => cached(v, 'veh' + veh.kind + veh.col, VEHICLES[veh.kind].w, VEHICLES[veh.kind].h,
                                      (g, p) => VEHICLES[veh.kind].paint(g, p, veh.col));
