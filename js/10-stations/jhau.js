'use strict';
// js/10-stations/jhau.js
// Defines: jhauTree

// Jhau (casuarina): a tall, slim tree with a bare, slightly leaning trunk and drooping,
// needle-like branchlets that make a wispy, ragged cone. (cx, base) is the foot of the trunk,
// h its height. dim = 1 paints it darker for trees standing behind others. lean -1..2 bends the
// crown with the wind (the swaying mid-ground trees).
function jhauTree(g, p, cx, base, h, seed, dim = 0, lean = 0) {
  const rng = mulberry32(seed), top = base - h, bare = Math.round(h * 0.2);
  const bend = y => Math.round(lean * Math.pow((base - y) / h, 2) * 2.5);                  // the crown leans downwind
  const wander = y => cx + Math.round(Math.sin((base - y) * 0.05 + seed) * 1.2) + bend(y);   // the trunk wanders a little
  for (let y = top + 3; y < base; y++) px(g, wander(y), y, y > base - 5 ? p.brown : p.brownDark);
  px(g, cx - 1, base - 1, p.brownDark); px(g, cx + 1, base - 1, p.brownDark);
  const cols = dim ? [p.greenDeep, p.greenDeep, p.greenDark] : [p.greenDeep, p.greenDark, p.green, p.greenDark];
  for (let y = top; y < base - bare; y++) {
    const t = (y - top) / (h - bare), hw = 1 + Math.round(Math.pow(t, 0.85) * (h * 0.115));
    const mid = wander(y), n = 2 + Math.round(hw * 1.7);
    for (let k = 0; k < n; k++) {
      const dx = Math.round((rng() * 2 - 1) * hw * (0.55 + 0.45 * rng())), col = cols[Math.floor(rng() * cols.length)];
      px(g, mid + dx, y, col);
      if (rng() < 0.75) px(g, mid + dx + (dx > 0 ? 1 : dx < 0 ? -1 : 0) * (rng() < 0.3 ? 1 : 0), y + 1, col);   // needles droop
      if (Math.abs(dx) >= hw - 1 && rng() < 0.55) px(g, mid + dx, y + 2, col);                                 // ragged tips hang lower
    }
    if (!dim && rng() < 0.2) px(g, mid + Math.round((rng() * 2 - 1) * hw), y, p.grass);                      // a sunlit tuft
  }
}
