'use strict';
// js/10-stations/sprites.js
// Defines: buildStationSprites, slabFor

// --- per-station sprites: platform slab, roof, name board -------------
function buildStationSprites(st, p) {
  const [L, R] = st.platform, roof = ROOFS[st.roof];
  const span = roof.span || [L, R];
  return {
    slab: st.halt ? buildHaltGround(p, R - L, st.index, st.green) : slabFor(st, p, R - L),
    roof: (st.halt || st.noRoof || st.bare) ? null : st.roof === 'umbrella' ? buildUmbrellaRoof(p, span[0], span[1])
                                 : (st.roof === 'shed' ? buildShedRoof : buildTinRoof)(p, span[1] - span[0], st.roofColor),
    roofX: span[0], roofY: roof.y0,
    board: buildBoard(p, st),
  };
}

function slabFor(st, p, w) {
  const slab = (st.slab === 'bleached' ? buildBleachedSlab : st.oldSlab ? buildOldSlab : buildSlab)(p, w, st.index);
  if (st.jhau) dappleSlab(slab, p, st.platform[0], st.jhau);
  return slab;
}
