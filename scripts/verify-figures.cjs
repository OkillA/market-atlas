#!/usr/bin/env node
'use strict';
// Inspect actual SVG geometry, including compact renders that are not exported by the build.
// --record-only preserves a pre-fix survey without accepting its defects.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'content/book.js'), 'utf8'), context);
const book = context.window.ATLAS, renderer = require('../figure-renderer.js');
const widths = [260, 320, 390, 760], records = [];
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const box = a => ({x: +a.x, y: +a.y, w: +a.width, h: +a.height});
const intersects = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
for (const chapter of book.chapters) {
  const figures = [chapter.figure, ...(chapter.figures || [])].filter(Boolean).map((figure, i) => ({figure, id: chapter.id + (i ? `-${i + 1}` : '')}));
  (chapter.learnerAttempt?.figures || []).forEach((figure, i) => figures.push({figure, id: `${chapter.id}-attempt-${i + 1}`}));
  for (const {figure, id} of figures) for (const [panel, spec] of renderer.flatten(figure).entries()) {
    if (!spec.series && spec.kind !== 'candles') continue;
    for (const width of widths) {
      const svg = renderer.render(spec, {width});
      const rectangles = [...svg.matchAll(/<rect\b[^>]*>/g)].map(m => attrs(m[0]));
      const labels = rectangles.filter(a => a.opacity === '.92' || a.opacity === '.95').map(box);
      const markers = [...svg.matchAll(/<circle\b[^>]*>/g)].map(m => attrs(m[0]));
      const obscuredMarkers = markers.filter(a => {
        const radius = +a.r + +(a['stroke-width'] || 1) / 2;
        return labels.some(b => intersects({x: +a.cx - radius, y: +a.cy - radius, w: 2 * radius, h: 2 * radius}, b));
      }).map(a => ({x: +a.cx, y: +a.cy, value: a['data-value'] || null}));
      const grids = [...svg.matchAll(/<line\b[^>]*>/g)].map(m => attrs(m[0])).filter(a => a.stroke === '#e2e6dd');
      const plotLeft = +grids[0]?.x1, plotRight = +grids[0]?.x2;
      const barsOutsidePlot = rectangles.filter(a => a.opacity === '.75').map(box).filter(b => b.x < plotLeft - .01 || b.x + b.w > plotRight + .01);
      const tickLabels = [...svg.matchAll(/<text\b[^>]*text-anchor="end"[^>]*>([^<]*)<\/text>/g)].map(m => m[1]);
      const badIntegerTicks = spec.integerTicks ? tickLabels.filter(s => !Number.isInteger(Number(s.replace(/k$/, '')) * (s.endsWith('k') ? 1000 : 1))) : [];
      records.push({id, panel, title: spec.title, width, markerCount: markers.length, obscuredMarkers, barCount: rectangles.filter(a => a.opacity === '.75').length, barsOutsidePlot, integerTicks: !!spec.integerTicks, tickLabels, badIntegerTicks});
    }
  }
}
const summary = {renders: records.length, markers: records.reduce((n, r) => n + r.markerCount, 0), obscuredMarkers: records.reduce((n, r) => n + r.obscuredMarkers.length, 0), barRenders: records.filter(r => r.barCount).length, barsOutsidePlot: records.reduce((n, r) => n + r.barsOutsidePlot.length, 0), integerTickRenders: records.filter(r => r.integerTicks).length, badIntegerTicks: records.reduce((n, r) => n + r.badIntegerTicks.length, 0)};
const output = process.argv.find(a => a.startsWith('--output='));
if (output) fs.writeFileSync(path.resolve(root, output.slice(9)), JSON.stringify({summary, records}, null, 2) + '\n');
console.log(JSON.stringify(summary));
if (!process.argv.includes('--record-only')) {
  assert.equal(summary.obscuredMarkers, 0, 'Annotation background covers a marker');
  assert.equal(summary.barsOutsidePlot, 0, 'Data bar escapes the horizontal plot bounds');
  assert.equal(summary.badIntegerTicks, 0, 'Count tick is fractional');
}
