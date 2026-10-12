// Measure how much plotted data (line paths, bars, candle bodies and wicks) sits under
// annotation label backgrounds, for every figure in the shipping book at four widths.
// Usage: node docs/publication-batch7-assets/data-coverage.cjs [output.json] [--chapters=id,id]
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const root = path.resolve(__dirname, '../..');
delete require.cache[require.resolve(path.join(root, 'figure-renderer.js'))];
const r = require(path.join(root, 'figure-renderer.js'));
const context = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, 'content/book.js'), 'utf8'), context);
const book = context.window.ATLAS;
const only = (process.argv.find(arg => arg.startsWith('--chapters=')) || '').slice(11).split(',').filter(Boolean);
const widths = [260, 320, 390, 760];

function figuresOf(chapter) {
  const list = [chapter.figure, ...(chapter.figures || [])].filter(Boolean).map((spec, i) => ({ id: chapter.id + (i ? `-${i + 1}` : ''), spec }));
  (chapter.learnerAttempt?.figures || []).forEach((spec, i) => list.push({ id: `${chapter.id}-attempt-${i + 1}`, spec }));
  return list;
}
const inside = (x, y, b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
const areaOverlap = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

function measure(svg) {
  // Split into translated groups (panels) so each label is compared with data in its own panel.
  const groups = []; let offset = 0, current = { labels: [], paths: [], bars: [], bodies: [], wicks: [] }; groups.push(current);
  const token = /<g transform="translate\(0 ([\d.]+)\)">|<\/g>|<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)" fill="[^"]+" opacity="\.(92|95)"\/>|<path data-series="(\d+)" d="([^"]+)"|<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)" fill="[^"]+" opacity="\.75">|<line x1="([\d.-]+)" y1="([\d.-]+)" x2="[\d.-]+" y2="([\d.-]+)" stroke="[^"]+" stroke-width="1\.8"\/><rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)"/g;
  for (const m of svg.matchAll(token)) {
    if (m[1] !== undefined) { offset = +m[1]; current = { labels: [], paths: [], bars: [], bodies: [], wicks: [] }; groups.push(current); }
    else if (m[0] === '</g>') { offset = 0; current = { labels: [], paths: [], bars: [], bodies: [], wicks: [] }; groups.push(current); }
    else if (m[2] !== undefined) current.labels.push({ x: +m[2], y: +m[3], w: +m[4], h: +m[5] });
    else if (m[7] !== undefined) current.paths.push({ series: +m[7], points: [...m[8].matchAll(/([MLHV])([\d.-]+)(?:,([\d.-]+))?/g)] });
    else if (m[9] !== undefined) current.bars.push({ x: +m[9], y: +m[10], w: +m[11], h: +m[12] });
    else if (m[13] !== undefined) { current.wicks.push({ x: +m[13], y1: +m[14], y2: +m[15] }); current.bodies.push({ x: +m[16], y: +m[17], w: +m[18], h: +m[19] }); }
  }
  const result = { pathSamples: 0, pathCovered: 0, maxSeriesPercent: 0, bars: 0, barsTouched: 0, barAreaPercent: 0, bodies: 0, bodiesTouched: 0, bodyAreaPercent: 0, wickSamples: 0, wickCovered: 0 };
  let barArea = 0, barCovered = 0, bodyArea = 0, bodyCovered = 0;
  for (const g of groups) {
    if (!g.labels.length) { for (const b of g.bars) { result.bars++; barArea += b.w * b.h; } for (const b of g.bodies) { result.bodies++; bodyArea += b.w * b.h; } continue; }
    for (const p of g.paths) {
      let cx = 0, cy = 0, covered = 0, total = 0; const pts = [];
      for (const [, cmd, a, b] of p.points) { if (cmd === 'H') cx = +a; else if (cmd === 'V') cy = +a; else { cx = +a; cy = +b; } pts.push([cmd, cx, cy]); }
      for (let i = 1; i < pts.length; i++) {
        if (pts[i][0] === 'M') continue;
        const [, ax, ay] = pts[i - 1], [, bx, by] = pts[i], n = Math.max(2, Math.ceil(Math.hypot(bx - ax, by - ay)));
        for (let k = 0; k < n; k++) { const t = (k + .5) / n, x = ax + t * (bx - ax), y = ay + t * (by - ay); total++; if (g.labels.some(l => inside(x, y, l))) covered++; }
      }
      result.pathSamples += total; result.pathCovered += covered;
      if (total) result.maxSeriesPercent = Math.max(result.maxSeriesPercent, +(100 * covered / total).toFixed(2));
    }
    for (const b of g.bars) { result.bars++; const a = b.w * b.h; barArea += a; const c = Math.min(a, g.labels.reduce((s, l) => s + areaOverlap(b, l), 0)); barCovered += c; if (c > .5) result.barsTouched++; }
    for (const b of g.bodies) { result.bodies++; const a = b.w * b.h; bodyArea += a; const c = Math.min(a, g.labels.reduce((s, l) => s + areaOverlap(b, l), 0)); bodyCovered += c; if (c > .5) result.bodiesTouched++; }
    for (const w of g.wicks) for (let y = Math.min(w.y1, w.y2); y <= Math.max(w.y1, w.y2); y += 1) { result.wickSamples++; if (g.labels.some(l => inside(w.x, y, l))) result.wickCovered++; }
  }
  result.barAreaPercent = barArea ? +(100 * barCovered / barArea).toFixed(2) : 0;
  result.bodyAreaPercent = bodyArea ? +(100 * bodyCovered / bodyArea).toFixed(2) : 0;
  result.pathPercent = result.pathSamples ? +(100 * result.pathCovered / result.pathSamples).toFixed(2) : 0;
  return result;
}

const records = [];
for (const chapter of book.chapters) {
  if (only.length && !only.includes(chapter.id)) continue;
  for (const { id, spec } of figuresOf(chapter)) for (const width of widths) {
    const m = measure(r.render(spec, { width }));
    if (m.pathCovered || m.barsTouched || m.bodiesTouched || m.wickCovered) records.push({ chapter: chapter.id, figure: id, width, ...m });
  }
}
const out = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
if (out) fs.writeFileSync(path.join(__dirname, out), JSON.stringify(records, null, 2) + '\n');
const flagged = records.filter(x => x.maxSeriesPercent >= 2 || x.barsTouched || x.bodiesTouched || x.wickCovered >= 3);
console.log(`${records.length} figure/width cases with any data under a label; ${flagged.length} at ≥2% of a series, a touched bar/body, or ≥3px of wick:`);
for (const x of flagged) console.log(`  ${x.figure} @${x.width}: series max ${x.maxSeriesPercent}%  bars ${x.barsTouched}/${x.bars} (${x.barAreaPercent}%)  bodies ${x.bodiesTouched}/${x.bodies} (${x.bodyAreaPercent}%)  wick px ${x.wickCovered}`);
