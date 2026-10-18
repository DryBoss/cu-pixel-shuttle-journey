'use strict';
// js/11-people/design.js
// Defines: makeStudentDesign, PERSON_W, pick, designId, makeDesign

const PERSON_W = 13, PERSON_H = 20, PERSON_CX = 6, PERSON_FY = 19;   // sprite box, centre column, feet row
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

let designId = 0;
// A university student: trousers or kameez, nearly always with a backpack or bag
function makeStudentDesign(r) {
  const d = makeDesign(r, r() < 0.55 ? 'trousers' : 'kameez');
  d.carry = d.kind === 'trousers' ? (r() < 0.82 ? 'backpack' : 'bag') : (r() < 0.55 ? 'bag' : 'backpack');
  return d;
}

function makeDesign(rng, kind) {
  kind = kind || pick(rng, PASSENGER_KINDS);
  const d = { id: ++designId, kind, skin: pick(rng, SKINS), hair: rng() < 0.85 ? 'ink' : 'brownDark', h: 12, carry: null };
  switch (kind) {
    case 'lungi':    d.top = pick(rng, SHIRTS); [d.cloth, d.cloth2] = pick(rng, LUNGIS); break;
    case 'trousers': d.top = pick(rng, SHIRTS); d.bottom = pick(rng, TROUSERS); break;
    case 'sari':     [d.cloth, d.accent] = pick(rng, SARIS); d.covered = rng() < 0.6; break;
    case 'kameez':   [d.top, d.bottom, d.accent] = pick(rng, KAMEEZ); break;
    case 'child':    d.h = 8; d.girl = rng() < 0.5; d.bottom = pick(rng, TROUSERS);
                     d.top = d.girl ? pick(rng, ['rose', 'red', 'glow', 'skyMid', 'purple']) : pick(rng, SHIRTS); break;
    case 'elder':    d.hair = 'white'; d.top = rng() < 0.6 ? 'white' : 'cream'; d.bottom = 'white'; break;
    case 'porter':   d.top = 'red'; d.cloth = 'grayLight'; d.cloth2 = 'white'; d.carry = 'case'; d.load = pick(rng, ['crate', 'chest', 'sack', 'chest']); break;
    case 'vendor':   d.top = 'white'; [d.cloth, d.cloth2] = pick(rng, LUNGIS); d.carry = 'tray'; break;
    case 'guard':    d.top = 'white'; d.bottom = 'navy'; break;
    case 'soldier':  d.top = 'greenDark'; d.bottom = 'greenDark'; d.carry = 'rifle'; break;   // dark green uniform, black boots, rifle slung on the shoulder
    case 'peanut':   d.top = pick(rng, SHIRTS); [d.cloth, d.cloth2] = pick(rng, LUNGIS); d.carry = 'badam'; break;     // a lone peanut seller
    case 'hawker':   d.top = pick(rng, SHIRTS); [d.cloth, d.cloth2] = pick(rng, LUNGIS); d.carry = 'basket'; break;
  }
  if (['lungi', 'trousers', 'sari', 'kameez'].includes(kind)) {
    const r = rng();
    if (kind === 'trousers') d.carry = r < 0.72 ? 'backpack' : r < 0.84 ? 'bag' : null;         // students: mostly backpacks
    else if (kind === 'kameez') d.carry = r < 0.42 ? 'bag' : r < 0.68 ? 'backpack' : null;       // girls: handbags, sometimes a backpack
    else if (r < 0.3) d.carry = 'bag';
    else if (r < 0.42) d.carry = 'bundle';
    d.bagColor = pick(rng, BAGS);
  }
  return d;
}
