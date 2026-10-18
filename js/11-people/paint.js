'use strict';
// js/11-people/paint.js
// Defines: paintPerson

function paintPerson(g, d, p, frame) {
  const ox = PERSON_CX - 2, oy = PERSON_FY - d.h + 1;
  const P = (x, y, k) => { g.fillStyle = p[k]; g.fillRect(ox + x, oy + y, 1, 1); };
  const R = (x, y, w, h, k) => { g.fillStyle = p[k]; g.fillRect(ox + x, oy + y, w, h); };
  const s = d.skin, walk = frame < 4 ? frame : 0, stride = walk === 1 || walk === 3;

  if (d.kind === 'child') {                               // 8 px tall
    R(1, 0, 3, 1, d.hair); P(1, 1, d.hair); R(2, 1, 2, 1, s); R(1, 2, 3, 1, s);
    if (d.girl) {                                         // frock and a pigtail
      P(0, 1, d.hair); R(1, 3, 3, 4, d.top);
      if (stride) { P(0, 6, d.top); P(4, 6, d.top); }
    } else {
      R(1, 3, 3, 3, d.top);
      if (stride) { P(1, 6, d.bottom); P(3, 6, d.bottom); } else R(2, 6, 2, 1, d.bottom);
    }
    if (stride) { P(0, 7, s); P(4, 7, s); } else { P(2, 7, s); P(3, 7, s); }
    if (walk === 1) P(4, 4, s); else if (walk === 3) P(0, 4, s);
    return;
  }

  const sit = frame === 4, dy = sit ? 3 : 0, lean = d.kind === 'elder' && !sit ? 1 : 0;
  const cover = d.kind === 'sari' && d.covered ? d.cloth : d.kind === 'guard' ? 'navy' : d.kind === 'soldier' ? 'greenDeep' : d.hair;
  const longHair = d.kind === 'sari' || d.kind === 'kameez';
  // 3x3 head facing right; elders stoop forward a pixel
  R(1 + lean, dy, 3, 1, cover);
  P(1 + lean, dy + 1, cover); R(2 + lean, dy + 1, 2, 1, s);
  P(1 + lean, dy + 2, longHair ? cover : s); R(2 + lean, dy + 2, 2, 1, s);
  if (d.kind === 'guard' || d.kind === 'soldier') P(4, 0, d.kind === 'guard' ? 'navy' : 'greenDeep');   // cap peak
  if (d.kind === 'elder') P(3 + lean, dy + 2, 'white');   // white beard

  const checked = d.kind === 'lungi' || d.kind === 'porter' || d.kind === 'vendor' || d.kind === 'hawker' || d.kind === 'peanut';
  const lower = (x, y) => checked ? ((x + y) & 1 ? d.cloth : d.cloth2) : (d.kind === 'sari' ? d.cloth : d.bottom);

  if (sit) {
    R(1, 6, 3, 3, d.kind === 'sari' ? d.cloth : d.top);
    if (d.kind === 'sari') P(1, 6, d.accent);
    if (d.kind === 'kameez') R(1, 6, 3, 1, d.accent);
    for (let x = 1; x <= 4; x++) P(x, 9, lower(x, 9));    // thighs along the seat
    P(4, 10, lower(4, 10));
    P(4, 11, s); P(5, 11, s);
    P(3, 8, s);                                          // hands in the lap
    return;
  }

  switch (d.kind) {
    case 'sari':                                         // drape to the ankles, pallu over the shoulder
      R(1, 3, 3, 8, d.cloth);
      R(1, 3, 1, 3, d.accent);
      R(1, 10, 3, 1, d.accent);
      if (stride) { P(0, 10, d.accent); P(4, 10, d.accent); }
      break;
    case 'kameez':                                       // long tunic, dupatta, salwar
      R(1, 3, 3, 6, d.top);
      R(1, 3, 3, 1, d.accent); R(1, 4, 1, 2, d.accent);
      if (stride) { P(1, 9, d.bottom); P(3, 9, d.bottom); P(0, 10, d.bottom); P(4, 10, d.bottom); }
      else R(2, 9, 2, 2, d.bottom);
      break;
    case 'elder':                                        // long panjabi
      R(1, 3, 3, 7, d.top);
      if (stride) { P(1, 10, d.bottom); P(3, 10, d.bottom); } else R(2, 10, 2, 1, d.bottom);
      break;
    case 'trousers': case 'guard': case 'soldier':
      R(1, 3, 3, 4, d.top);
      R(1, 7, 3, 1, d.bottom);
      if (stride) { R(1, 8, 3, 1, d.bottom); P(1, 9, d.bottom); P(3, 9, d.bottom); P(0, 10, d.bottom); P(4, 10, d.bottom); }
      else R(2, 8, 2, 3, d.bottom);
      break;
    default:                                             // lungi (porter and vendor too)
      R(1, 3, 3, 4, d.top);
      for (let y = 7; y <= 10; y++) for (let x = 1; x <= 3; x++) P(x, y, lower(x, y));
      if (stride) { P(0, 10, lower(0, 10)); P(4, 10, lower(4, 10)); }
  }
  const shoe = d.kind === 'trousers' || d.kind === 'guard' || d.kind === 'soldier' ? 'ink' : s;
  if (stride) { P(0, 11, shoe); P(4, 11, shoe); } else { P(2, 11, shoe); P(3, 11, shoe); }
  if (shoe === 'ink') P(stride ? 5 : 4, 11, shoe);       // shoes point forward

  // arms and whatever they carry
  const hand = frame === 6 ? [4, 3] : frame === 5 ? [4, 5] : walk === 1 ? [4, 6] : walk === 3 ? [0, 6] : [3, 7];
  switch (d.carry) {
    case 'rifle':                                                                     // rifle slung over the shoulder: barrel up behind the head, a strap across the chest
      R(0, 0, 1, 8, 'grayDark'); P(0, -1, 'ink'); R(0, 8, 1, 2, 'ink');
      P(1, 3, 'ink'); P(2, 4, 'ink'); P(3, 5, 'ink'); P(3, 7, s); break;
    case 'badam':    R(3, 6, 4, 3, 'tan'); R(3, 6, 4, 1, 'brown'); P(4, 5, s); P(5, 5, 'brownDark'); P(4, 6, 'paddy'); P(5, 7, 'paddy'); break;   // a small basket of peanuts
    case 'bag':      R(4, 7, 2, 2, d.bagColor); P(4, 6, s); break;
    case 'backpack': R(0, 3, 1, 4, d.bagColor); P(hand[0], hand[1], s); break;
    case 'bundle':   R(0, -2, 5, 2, d.bagColor); P(2, -3, d.bagColor); P(4, 0, s); P(4, 1, s); break;
    case 'basket':   R(0, -3, 5, 3, 'tan'); R(0, -3, 5, 1, 'brown'); P(1, -4, 'red'); P(2, -4, 'paddy'); P(3, -4, 'grassLight'); P(4, 3, d.top); P(4, 2, s); P(4, 1, s); break;
    case 'case':                                                                      // the load a porter carries on his head
      if (d.load === 'sack') { R(0, -3, 5, 3, 'cream'); R(-1, -2, 7, 1, 'tan'); P(1, -4, 'cream'); P(3, -4, 'cream'); P(2, -2, 'brown'); }                       // burlap sack
      else if (d.load === 'chest') { R(-1, -3, 6, 3, 'tan'); R(-1, -3, 6, 1, 'cream'); R(-1, -2, 6, 1, 'grayLight'); P(1, -1, 'brownDark'); P(2, -1, 'brownDark'); }   // plywood tea chest with a metal band
      else { R(-1, -3, 6, 3, 'brown'); R(-1, -3, 6, 1, 'tan'); R(0, -2, 1, 2, 'brownDark'); R(2, -2, 1, 2, 'brownDark'); R(4, -2, 1, 2, 'brownDark'); }          // wooden crate
      P(4, 3, d.top); P(4, 2, s); P(4, 1, s); break;
    case 'kettle':   R(3, 5, 3, 4, 'grayLight'); R(3, 5, 3, 1, 'grayDark'); P(6, 6, 'grayDark'); P(6, 7, 'grayDark'); P(3, 9, 'white'); P(4, 9, 'white'); P(3, 10, s); break;   // a tea seller's kettle and glasses
    case 'papers':   R(3, 3, 4, 6, 'white'); R(3, 3, 4, 1, 'ink'); P(4, 5, 'red'); P(5, 6, 'ink'); P(4, 7, 'ink'); P(3, 9, s); break;                                                // a stack of newspapers
    case 'tray':     R(3, 5, 5, 1, 'tan'); P(4, 4, 'red'); P(5, 4, 'paddy'); P(6, 4, 'white'); P(3, 6, s); break;
    default:
      if (d.kind === 'elder') { R(5, 6, 1, 6, 'brown'); P(4, 6, s); }   // walking cane
      else if (d.kind !== 'guard') P(hand[0], hand[1], s);
  }
  if (frame === 5 || frame === 6) P(hand[0], hand[1] - 1, 'white');      // glass of tea
  if (d.kind === 'guard') {
    if (frame === 7) {                                   // flag out to the right
      P(4, 3, d.top); P(4, 2, s); R(5, -1, 1, 3, 'brownDark');
      R(6, -3, 3, 3, 'grassLight'); R(6, -1, 3, 1, 'greenDark');
    } else if (frame === 8) {                            // flag swung overhead
      P(4, 3, d.top); P(4, 2, s); R(4, -2, 1, 4, 'brownDark');
      R(0, -4, 4, 3, 'grassLight'); R(0, -2, 4, 1, 'greenDark');
    } else {                                             // rolled flag at his side
      P(4, 6, s); R(4, 7, 1, 3, 'grassLight');
    }
  }
}
