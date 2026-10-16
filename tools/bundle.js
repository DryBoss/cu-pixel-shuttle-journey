#!/usr/bin/env node
// Builds ONE self-contained file (dist/index.html) from index.html + css/ + js/.
// Usage:  node tools/bundle.js        (no dependencies)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// 1. inline the stylesheet
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/, (_, href) =>
  '<style>\n' + fs.readFileSync(path.join(root, href), 'utf8').trimEnd() + '\n</style>');

// 2. replace every <script src> (in order) with one inline script
const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const code = srcs.map(f => fs.readFileSync(path.join(root, f), 'utf8').replace(/^'use strict';\n/, '')).join('\n');
html = html.replace(/<!-- \d\d-[^>]*-->\n/g, '').replace(/<script src="[^"]+"><\/script>\n?/g, '');
html = html.replace('</body>', '<script>\n\'use strict\';\n' + code + '\n</script>\n</body>');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
console.log('dist/index.html written:', srcs.length, 'scripts,', (html.length / 1024).toFixed(0), 'KB');
