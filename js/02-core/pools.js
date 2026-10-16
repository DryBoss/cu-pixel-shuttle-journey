'use strict';
// js/02-core/pools.js
// Defines: makePool, poolSpawn, poolKill

// Object pools: items[0 .. n-1] are alive. Spawning reuses a dead slot and
// killing swaps the last live item into the hole, so nothing is allocated
// while the game runs.
function makePool(size, make) { return { items: Array.from({ length: size }, make), n: 0 }; }
function poolSpawn(pool, max) { return pool.n < Math.min(max, pool.items.length) ? pool.items[pool.n++] : null; }
function poolKill(pool, i) {
  const dead = pool.items[i];
  pool.items[i] = pool.items[--pool.n];
  pool.items[pool.n] = dead;
}
