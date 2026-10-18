'use strict';
// js/10-stations/sprites.js
// Defines: buildStationSprites, slabFor

// --- per-station sprites: platform slab, roof, name board -------------
function buildStationSprites(st, p) {
  const [L, R] = st.platform, roof = ROOFS[st.roof];
  const span = st.span || roof.span || [L, R];
  return {
    slab: st.village ? buildVillageGround(p, R - L, st.index, 226 - L) : st.halt ? buildHaltGround(p, R - L, st.index, st.green) : slabFor(st, p, R - L),
    roof: ((st.halt && !st.village) || st.noRoof || st.bare) ? null : st.village ? buildRusticRoof(p, span[1] - span[0]) : st.roof === 'umbrella' ? buildUmbrellaRoof(p, span[0], span[1])
                                 : st.roof === 'junction' ? buildJunctionRoof(p, span[1] - span[0])
                                 : st.roof === 'military' ? buildMilitaryRoof(p, span[1] - span[0])
                                 : (st.roof === 'shed' ? buildShedRoof : buildTinRoof)(p, span[1] - span[0], st.roofColor),
    roofX: span[0], roofY: roof.y0,
    board: buildBoard(p, st),
  };
}

function slabFor(st, p, w) {
  const slab = (st.slab === 'baked' ? buildBakedSlab : st.slab === 'clean' ? buildCleanSlab : st.slab === 'weathered' ? buildWeatheredSlab : st.slab === 'bleached' ? buildBleachedSlab : st.oldSlab ? buildOldSlab : buildSlab)(p, w, st.index);
  if (st.jhau) dappleSlab(slab, p, st.platform[0], st.jhau);
  if ((st.roof === 'junction' || st.roof === 'military') && st.span) shadeSlab(slab, p, st.platform[0], st.span);   // shade under the long canopy
  if (st.shade) dappleSlab(slab, p, st.platform[0], st.shade, st.roof === 'military' ? 30 : 38, st.roof === 'military' ? 0.55 : 0.8);                   // shade under overhanging canopies
  return slab;
}
