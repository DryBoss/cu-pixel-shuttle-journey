'use strict';
// js/10-stations/stations.js
// Defines: STATIONS, LAST_STATION

const STATIONS = ROUTE.map((r, index) => {
  const st = { ...STATION_DEFAULTS, ...r, index };
  st.dist = Math.round(st.km * CONFIG.PX_PER_KM);
  st.bnMask = textMask(st.bn, CONFIG.BN_SIZE);
  st.layout = layoutStation(st);
  st.tight = !!(st.halt || st.extras.includes('shops'));        // people keep off the very front of the platform
  return st;
});
const LAST_STATION = STATIONS.length - 1;
