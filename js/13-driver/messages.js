'use strict';
// js/13-driver/messages.js
// Defines: toasts, toast, updateToasts, popPool, popup, updatePopups

// --- messages: toasts across the sky, +10s over the doors -------------------
const toasts = [], TOAST_LIFE = 2.6;
function toast(text, col = 'white', big = false) {
  if (!drive.on) return;
  const last = toasts[toasts.length - 1];
  if (last && last.text === text) { last.t = 0; return; }
  toasts.push({ text, col, big, t: 0 });
  if (toasts.length > 3) toasts.shift();
}
function updateToasts(dt) {
  for (let i = toasts.length - 1; i >= 0; i--) if ((toasts[i].t += dt) > TOAST_LIFE) toasts.splice(i, 1);
}

const popPool = makePool(24, () => ({ x: 0, y: 0, t: 0, text: '', col: '' }));
function popup(x, y, text, col) {
  const q = poolSpawn(popPool, 24);
  if (q) { q.x = x; q.y = y; q.t = 0; q.text = text; q.col = col; }
}
function updatePopups(dt) {
  for (let i = 0; i < popPool.n; ) { if ((popPool.items[i].t += dt) < 1.2) i++; else poolKill(popPool, i); }
}
