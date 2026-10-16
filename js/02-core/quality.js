'use strict';
// js/02-core/quality.js
// Defines: quality, cap

// Quality: phones start on the light settings; anything that averages too
// long per frame drops to them too (see frame())
const quality = { low: typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches, ema: 0 };
const cap = name => CONFIG[name][quality.low ? 1 : 0];
