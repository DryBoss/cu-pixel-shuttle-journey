'use strict';
// js/03-train/doors.js
// Defines: DOORS, drawDoors

// Left pixel column of every carriage door (two per carriage)
const DOORS = TRAIN.vehicles.slice(1).flatMap(c => [c.x + 1, c.x + CONFIG.CAR_W - 5]);

// Doors slide open into the body: the 4 px doorway is revealed column by column
function drawDoors(g, v) {
  const k = Math.round(sim.doorOpen * 4), p = v.p;
  if (!k) return;
  for (const dx of DOORS) {
    rect(g, dx, PLAT.DOOR_TOP, k, PLAT.DOOR_FLOOR - PLAT.DOOR_TOP + 1, p.ink);
    if (v.lit) rect(g, dx, PLAT.DOOR_TOP, k, 1, PALETTE.amber);         // ceiling light
    if (k < 4) rect(g, dx + k, PLAT.DOOR_TOP, 1, PLAT.DOOR_FLOOR - PLAT.DOOR_TOP + 1, p.greenDark);
    if (k >= 3) rect(g, dx, 138, 4, 1, p.grayLight);                    // folding step
  }
  if (sim.riders)                                        // students standing in the open doorways
    for (let i = 0; i < DOORS.length; i++) {
      const d = sim.riders[i];
      if (!d) continue;
      g.save();
      g.beginPath();
      g.rect(DOORS[i], PLAT.DOOR_TOP, 4, PLAT.DOOR_FLOOR - PLAT.DOOR_TOP + 1);
      g.clip();
      g.drawImage(personSprite(v, d, 0, 1), DOORS[i] + 2 - PERSON_CX, PLAT.DOOR_FLOOR - PERSON_FY);
      g.restore();
    }
}
