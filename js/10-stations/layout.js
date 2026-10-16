'use strict';
// js/10-stations/layout.js
// Defines: layoutStation

// Fixed furniture positions for one station (same in every lighting)
function layoutStation(st) {
  if (st.bare) return [];
  if (st.halt) return [{ type: 'sleeper', x: 70, y: 165 }, { type: 'bricks', x: 150, y: 166 }, { type: 'sleeper', x: 232, y: 165 }];   // makeshift seats
  const rng = mulberry32(900 + st.index * 77);
  const [L, R] = st.platform, items = [];
  const clear = x => x > L + 6 && x < R - 12 && (x < PLAT.STALL_X - 10 || x > PLAT.STALL_X + 36) &&
                     Math.abs(x - PLAT.BOARD_X) > 34;              // keep the name board unobstructed
  const span = ROOFS[st.roof].span || [L, R];
  // roof pillars sit mid-carriage (41 px apart), clear of every door
  if (!st.noRoof) for (let x = Math.ceil((span[0] + 6) / 41) * 41; x <= span[1] - 6; x += 41) items.push({ type: 'pillar', x, y: 158 });
  if (st.extras.includes('clutter'))                       // tea chests and woven baskets stacked beside the posts
    for (const it of items.slice())
      if (it.type === 'pillar' && rng() < 0.55 && clear(it.x + 7)) {
        if (rng() < 0.55) items.push({ type: 'chests', x: it.x + 8, y: 160 + randInt(rng, 0, 6) });
        else items.push({ type: 'basket', key: 'basket' + randInt(rng, 0, 2), x: it.x - 8, y: 162 + randInt(rng, 0, 5) });
      }
  const every = (start, step, fn) => { for (let x = start + step * Math.ceil((L - start) / step); x < R; x += step) fn(x); };
  if (st.ironLamps) {                                      // no roof to hang lamps from: tall iron posts, evenly spaced, and a few benches
    every(24, 72, x => clear(x) && items.push({ type: 'lamp', key: 'ironlamp', x, y: 161 }));
    for (const x of [58, 130, 204]) items.push({ type: 'bench', key: 'woodbench', x, y: 166 });
  } else {
    every(30, 82, x => clear(x) && items.push({ type: 'lamp', x, y: 161 }));
    every(56, 82, x => clear(x) && clear(x + 10) && items.push({ type: 'bench', x, y: 166 }));
  }
  every(76, 164, x => clear(x) && items.push({ type: 'bin', x, y: 164 }));
  items.push({ type: 'tap', x: 256, y: 165 });
  items.push({ type: 'stall', key: st.oldSlab ? 'stallCart' : st.liveStall ? 'stallTea' : 'stall', x: PLAT.STALL_X, y: PLAT.STALL_Y });
  if (st.jhau) st.jhau.forEach((x, i) => items.push({ type: 'jhau', key: 'jhau' + (i % 3), x, y: 156 }));   // tall Jhau trees at the platform ends
  items.push({ type: 'board', x: PLAT.BOARD_X, y: 159 });
  if (st.extras.includes('shops'))
    for (let x = L + 12, k = 0; x < R - 10; x += 33, k++) items.push({ type: 'shop', key: 'shop' + ((k * 3 + 1) % 5), x, y: 179 });
  if (st.extras.includes('fish'))
    for (const [x, y] of [[228, 160], [236, 165], [246, 161], [-40, 161], [-30, 166], [346, 162], [356, 167]])
      if (clear(x)) items.push({ type: 'basket', key: 'basket' + randInt(rng, 0, 2), x, y });
  if (st.extras.includes('chests'))
    for (const [x, y] of [[212, 159], [-16, 162], [-6, 166]])
      if (clear(x)) items.push({ type: 'chests', x, y });
  return items;
}
