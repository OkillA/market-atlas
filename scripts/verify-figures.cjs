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
const inside = (x, y, b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
const overlapArea = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
// Data hidden by label backgrounds: share of each line's sampled centreline, bar and candle-body area, and wick pixels.
function hiddenData(svg, labels) {
  let worstSeries = 0, barArea = 0, barHidden = 0, wickHidden = 0;
  for (const m of svg.matchAll(/<path data-series="\d+" d="([^"]+)"/g)) {
    const points = []; let x = 0, y = 0;
    for (const [, command, a, b] of m[1].matchAll(/([MLHV])([\d.-]+)(?:,([\d.-]+))?/g)) { if (command === 'H') x = +a; else if (command === 'V') y = +a; else { x = +a; y = +b; } points.push([command, x, y]); }
    let total = 0, covered = 0;
    for (let i = 1; i < points.length; i++) {
      if (points[i][0] === 'M') continue;
      const [, ax, ay] = points[i - 1], [, bx, by] = points[i], n = Math.max(2, Math.ceil(Math.hypot(bx - ax, by - ay)));
      for (let k = 0; k < n; k++) { const t = (k + .5) / n; total++; if (labels.some(l => inside(ax + t * (bx - ax), ay + t * (by - ay), l))) covered++; }
    }
    if (total) worstSeries = Math.max(worstSeries, covered / total);
  }
  const bars = [...svg.matchAll(/<rect\b[^>]*opacity="\.75"[^>]*>/g)].map(m => box(attrs(m[0])));
  const candles = [...svg.matchAll(/<line x1="([\d.-]+)" y1="([\d.-]+)" x2="[\d.-]+" y2="([\d.-]+)" stroke="[^"]+" stroke-width="1\.8"\/>(<rect\b[^>]*>)/g)];
  for (const b of [...bars, ...candles.map(m => box(attrs(m[4])))]) { barArea += b.w * b.h; barHidden += Math.min(b.w * b.h, labels.reduce((sum, l) => sum + overlapArea(b, l), 0)); }
  for (const m of candles) for (let yy = Math.min(+m[2], +m[3]); yy <= Math.max(+m[2], +m[3]); yy++) if (labels.some(l => inside(+m[1], yy, l))) wickHidden++;
  return {worstSeriesPercent: +(100 * worstSeries).toFixed(2), barBodyPercent: barArea ? +(100 * barHidden / barArea).toFixed(2) : 0, wickPixels: wickHidden};
}
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
      const hidden = hiddenData(svg, labels);
      records.push({id, panel, title: spec.title, width, markerCount: markers.length, obscuredMarkers, barCount: rectangles.filter(a => a.opacity === '.75').length, barsOutsidePlot, integerTicks: !!spec.integerTicks, tickLabels, badIntegerTicks, hidden});
    }
  }
}
const summary = {renders: records.length, markers: records.reduce((n, r) => n + r.markerCount, 0), obscuredMarkers: records.reduce((n, r) => n + r.obscuredMarkers.length, 0), barRenders: records.filter(r => r.barCount).length, barsOutsidePlot: records.reduce((n, r) => n + r.barsOutsidePlot.length, 0), integerTickRenders: records.filter(r => r.integerTicks).length, badIntegerTicks: records.reduce((n, r) => n + r.badIntegerTicks.length, 0),
  // Wide (exported) renders must hide no data; compact renders may hide at most a 5% sliver of any line, bar or body, and 3px of wick.
  wideRendersHidingData: records.filter(r => r.width === 760 && (r.hidden.worstSeriesPercent || r.hidden.barBodyPercent || r.hidden.wickPixels)).length,
  compactRendersOverLimit: records.filter(r => r.width < 760 && (r.hidden.worstSeriesPercent > 5 || r.hidden.barBodyPercent > 5 || r.hidden.wickPixels > 3)).length,
  maxCompactSeriesPercent: Math.max(...records.filter(r => r.width < 760).map(r => r.hidden.worstSeriesPercent))};
const output = process.argv.find(a => a.startsWith('--output='));
if (output) fs.writeFileSync(path.resolve(root, output.slice(9)), JSON.stringify({summary, records}, null, 2) + '\n');
console.log(JSON.stringify(summary));
if (!process.argv.includes('--record-only')) {
  assert.equal(summary.obscuredMarkers, 0, 'Annotation background covers a marker');
  assert.equal(summary.barsOutsidePlot, 0, 'Data bar escapes the horizontal plot bounds');
  assert.equal(summary.badIntegerTicks, 0, 'Count tick is fractional');
  assert.equal(summary.wideRendersHidingData, 0, 'A label background hides plotted data in a wide render');
  assert.equal(summary.compactRendersOverLimit, 0, 'A label background hides more than a sliver of plotted data in a compact render');
}
