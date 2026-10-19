# CU Pixel Shuttle — split source

The original single `index.html` (6,393 lines) is now **156 small script files** plus one stylesheet.
Behaviour is unchanged: every line of the original JavaScript is still here, only moved.

```
index.html          markup + <script> tags in load order
css/style.css       all styles
js/
  01-config/        constants, ROUTE, world constants, time keys, PALETTE, LIGHTING
  02-core/          RNG, pools, canvas, pixel primitives, pixel font, Bangla text
  03-train/         loco, carriages, wheels, doors, horn waves, smoke
  04-world/         scenery sprites, clouds, poles, track, bridge parts, lighting variants
  05-terrain/       terrain engine: layers, sampling, chunks, drawing, sway, shared spawners
  06-landscapes/    village, slum (5 files), mill (2), cantonment, river, kash, tea, hills, SECTIONS table
  07-entities/      boats, fishers, water life, cows, rickshaws, pickers
  08-line/          bridge span, level crossings, extra tracks and wagons, drawLine
  09-sky-life/      birds, seed fluff, cumulus
  10-stations/      layout, props, slabs, roofs, board, ONE FILE PER STATION, overpass, platform front
  11-people/        passenger design, painting, sprites, spawning, boarding, update
  12-journey/       state machine: state, stop, start, update
  13-driver/        DRIVE mode: engine, controls, schedule, scoring, messages, hints
  14-atmosphere/    time, lighting, sky, sun/moon, tint, glow, sparks, weather, rain
  15-ui/            banner, panel, title card, HUD, overlays, cab gauges
  16-audio/         Web Audio engine, beds, horn, synth, drive SFX
  17-input/         route map, toolbar buttons, actions, keyboard, pointer
  18-main/          setup, renderWorld, render, prefetch, cab, fit(), main loop
tools/bundle.js     optional: node tools/bundle.js  ->  dist/index.html (single file)
```

Every file starts with a header listing what it defines.

## Important: load order

These are plain scripts sharing one global scope (no modules), so the order of the `<script>` tags in
`index.html` matters for anything that **runs at load time** (a `const` table that mentions functions,
or a call like `STATIONS = ROUTE.map(... layoutStation ...)`). Inside the original single script,
function hoisting hid this; with separate files, a few files must load later than their original position:

- `06-landscapes/sections.js` — the `SECTIONS` table names functions from every landscape file, so it loads after them.
- `10-stations/stations.js` — builds `STATIONS` by calling `layoutStation`, so it loads after `layout.js`.
- `10-stations/backdrops.js` — the `BACKDROPS` table names every station builder, so it loads after `city.js`.
- `15-ui/cab-gauges.js` — `18-main/setup.js` builds sprites at load and needs the `cab*` helpers.

Code inside functions can call anything from any file, in any order. Only top-level code that runs while loading has this limit.

## Adding a file
Create `js/<folder>/<name>.js`, start it with `'use strict';`, and add a `<script src>` tag in `index.html`
at the right spot (after anything it uses at load time).

## Single-file build
`node tools/bundle.js` inlines the CSS and all scripts, in tag order, into `dist/index.html`.
Capacitor can also just serve the multi-file folder as-is.

## Verification
The original and this split were run headlessly (stubbed canvas/DOM, seeded `Math.random`) through the
title screen, WATCH mode (skip, rain, time-of-day, speed, mute, pause, fast-forward) and DRIVE mode
(engine, throttle, brake, doors, horn) for 900 frames each. All three runs produced the same
sequence of canvas draw calls as the original, and so did the bundled build. I could not test in a real browser here.
