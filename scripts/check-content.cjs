#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const generated = path.join(root, 'content/book.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(fs.existsSync(generated) ? generated : path.join(root, 'content/curriculum.js'), 'utf8'), context);
const book = context.window.ATLAS;
const ids = new Set(book.chapters.map(chapter => chapter.id));
assert.equal(ids.size, book.chapters.length, 'Duplicate chapter ID');
const ordered = book.parts.flatMap(part => part.chapters);
assert.equal(new Set(ordered).size, ordered.length, 'Chapter appears in more than one part');
assert.equal(ordered.length, ids.size, 'Catalog and manuscripts have different lengths');
ordered.forEach(id => assert.ok(ids.has(id), `Missing chapter ${id}`));
function checkTable(table,id) {
  assert.ok(table.columns?.length && table.rows?.length, `Empty table ${id}`);
  table.rows.forEach(row=>assert.equal(row.length,table.columns.length, `Table width ${id}`));
}
function checkEvidence(record,id) {
  assert.ok(['definition','arithmetic','mechanism','empirical','teaching-rule','historical','unresolved'].includes(record.type));
  assert.ok(record.claim && record.location && record.summary && record.limits && /^\d{4}-\d{2}-\d{2}$/.test(record.checked), `Incomplete evidence ${id}`);
  record.sourceIds.forEach(source=>assert.ok(book.sources[source],`Missing evidence source ${source}`));
  if (!record.sourceIds.length) assert.ok(['arithmetic','teaching-rule','unresolved'].includes(record.type),`Unsourced evidence ${id}`);
  if (record.type === 'empirical' || record.study) for (const field of ['sample','rule','comparator','costs','result']) assert.ok(typeof record.study?.[field] === 'string' && record.study[field].trim(), `Missing study ${field} in ${id}`);
}
function checkFigure(figure,id) {
  const kind=figure.kind || 'line';
  if (kind==='panels') { assert.ok(figure.panels.length); figure.panels.forEach(panel=>checkFigure(panel,id)); return; }
  if (kind==='table') return checkTable(figure,id);
  if (kind==='flow') { assert.ok(figure.steps.length); return; }
  if (kind==='profile') { figure.levels.forEach(level=>assert.ok(Number.isFinite(level.price)&&Number.isFinite(level.volume)&&level.volume>=0)); return; }
  if (kind==='candles') {
    assert.ok(figure.candles.length);
    figure.candles.forEach(candle=>assert.ok([candle.open,candle.high,candle.low,candle.close].every(Number.isFinite)&&candle.low<=Math.min(candle.open,candle.close)&&candle.high>=Math.max(candle.open,candle.close),`Invalid OHLC ${id}`)); return;
  }
  assert.ok(['line','bars'].includes(kind),`Unsupported kind ${kind}`);
  if (figure.integerTicks !== undefined) {
    assert.equal(typeof figure.integerTicks, 'boolean', `Invalid integerTicks ${id}`);
    assert.ok(!figure.integerTicks || figure.yScale !== 'log', `Integer ticks require a linear scale ${id}`);
  }
  assert.ok(figure.xLabel && figure.yLabel && figure.series.length>=1 && figure.series.length<=4, `Figure labels ${id}`);
  const length=figure.series[0].values.length; assert.ok(length>=2);
  figure.series.forEach(series=>{assert.equal(series.values.length,length,`Series alignment ${id}`);assert.ok(series.name);series.values.forEach(value=>assert.ok(Number.isFinite(value)||value===null));});
  if (figure.xLabels) assert.equal(figure.xLabels.length,length);
  for (const annotation of figure.annotations || []) {
    assert.ok(Number.isInteger(annotation.index)&&annotation.index>=0&&annotation.index<length&&annotation.label,`Invalid annotation ${id}`);
    assert.ok((annotation.seriesIndex ?? 0)<figure.series.length);
    assert.ok(Number.isFinite(require('../figure-renderer.js').annotationValue(figure,annotation)),`Annotation on missing observation ${id}`);
  }
}
const report = [];
for (const chapter of book.chapters) {
  assert.ok(chapter.title && chapter.subtitle, `Missing title/subtitle in ${chapter.id}`);
  if (chapter.status === 'planned') continue;
  assert.ok(chapter.sections?.length >= 3, `Too few sections in ${chapter.id}`);
  const prose = chapter.sections.flatMap(section => {
    assert.ok(section.title && section.paragraphs?.length, `Missing section prose in ${chapter.id}`);
    section.paragraphs.forEach(paragraph => assert.equal(typeof paragraph, 'string'));
    return section.paragraphs;
  }).join(' ');
  const words = prose.trim().split(/\s+/).length;
  if (book.manuscript) assert.ok(words >= 700, `${chapter.id} has only ${words} words of prose`);
  assert.ok(chapter.takeaway && chapter.example?.title && chapter.example?.text && chapter.exercise, `Missing teaching material in ${chapter.id}`);
  assert.ok(chapter.quiz?.question && chapter.quiz?.explanation, `Missing quiz in ${chapter.id}`);
  assert.equal(chapter.quiz.options.length, 3);
  assert.ok(Number.isInteger(chapter.quiz.answer) && chapter.quiz.answer >= 0 && chapter.quiz.answer < 3);
  chapter.related.forEach(id => assert.ok(ids.has(id), `Broken related chapter ${id}`));
  assert.ok(chapter.sources.length > 0, `No sources for ${chapter.id}`);
  chapter.sources.forEach(id => assert.ok(book.sources[id], `Missing source ${id}`));
  if (book.manuscript) assert.ok(chapter.figure || chapter.diagram, `No illustration for ${chapter.id}`);
  if (chapter.outcomes?.length || process.argv.includes('--strict-revision')) {
  assert.ok(chapter.outcomes?.length && chapter.solution?.length, `Missing outcomes/solution in ${chapter.id}`);
  assert.equal(chapter.quiz.feedback?.length, 3, `Missing diagnostic feedback in ${chapter.id}`);
  assert.ok(chapter.practice?.length >= 2, `Missing graded practice in ${chapter.id}`);
  chapter.practice.forEach(task => { assert.ok(task.title && task.question && task.solution?.length); task.tables?.forEach(table => checkTable(table, chapter.id)); });
  chapter.prerequisites?.forEach(id => assert.ok(ids.has(id), `Broken prerequisite ${id}`));
  assert.equal(new Set(chapter.sections.map(section => section.id)).size, chapter.sections.length, `Duplicate section anchors in ${chapter.id}`);
  chapter.sections.forEach(section => { assert.ok(section.id, `Missing stable section id in ${chapter.id}`); section.tables?.forEach(table => checkTable(table, chapter.id)); });
  if (chapter.learnerAttempt) {
    assert.ok(chapter.learnerAttempt.title && chapter.learnerAttempt.paragraphs?.length, `Missing cutoff prompt in ${chapter.id}`);
    const cutoffAfter = chapter.learnerAttempt.afterSection ?? -1;
    assert.ok(Number.isInteger(cutoffAfter) && cutoffAfter >= -1 && cutoffAfter < chapter.sections.length - 1, `Invalid cutoff placement in ${chapter.id}`);
    chapter.learnerAttempt.tables?.forEach(table => checkTable(table, chapter.id));
  }
  [chapter.figure, ...(chapter.figures || []), ...(chapter.learnerAttempt?.figures || [])].filter(Boolean).forEach(figure => {
    assert.ok(figure.title && figure.caption);
    assert.ok((figure.afterSection ?? 0) < chapter.sections.length, `Figure outside chapter ${chapter.id}`);
    checkFigure(figure, chapter.id);
    // Inspect geometry attributes; prose can legitimately describe an undefined warm-up.
    for (const width of [300,760]) assert.ok(!/\b(?:d|x|y|x1|x2|y1|y2|cx|cy|r|width|height|viewBox|transform|points)="[^"]*\b(?:NaN|Infinity|undefined)\b/.test(require('../figure-renderer.js').render(figure,{width})), `Invalid rendered figure in ${chapter.id}`);
  });
  assert.ok(chapter.evidence?.length, `No evidence records in ${chapter.id}`);
  }
  chapter.evidence?.forEach(record => checkEvidence(record,chapter.id));
  report.push({ id: chapter.id, words, sections: chapter.sections.length, sources: chapter.sources.length });
}
Object.values(book.sources).forEach(source => { assert.ok(source.title && source.supports); assert.ok(/^https:\/\//.test(source.url), `Invalid source URL: ${source.url}`); });
book.glossary.forEach(term => { assert.equal(term.length, 3); assert.ok(term[0] && term[1] && ids.has(term[2]), `Broken glossary term ${term[0]}`); });
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const file of ['styles.css', 'app.js', 'favicon.svg', fs.existsSync(generated) ? 'content/book.js' : 'content/curriculum.js']) assert.ok(fs.existsSync(path.join(root, file)), `Missing asset ${file}`);
assert.ok(!/<script[^>]+src="https?:/.test(html), 'Offline edition must not depend on external scripts');
for (const part of book.parts) { const review=book.partPractice?.[part.id]; if (!review && !process.argv.includes('--strict-revision')) continue; assert.ok(review?.tasks?.length,`Missing part review ${part.id}`); review.tasks.forEach(task=>{ assert.ok(task.question && task.solution?.length); task.tables?.forEach(table=>checkTable(table,part.id)); }); }
for (const section of book.research || []) { section.tables?.forEach(table=>checkTable(table,'research')); section.evidence?.forEach(record=>checkEvidence(record,'research')); }
if (process.argv.includes('--strict-revision')) {
  const auditedTerms = (book.research || []).flatMap(section => section.evidence || []).flatMap(record => record.terms || []).map(term => term.toLowerCase());
  assert.equal(new Set(auditedTerms).size, auditedTerms.length, 'Duplicate glossary support record');
  assert.deepEqual([...new Set(auditedTerms)].sort(), [...book.glossary.map(term => term[0].toLowerCase())].sort(), 'Glossary support coverage differs from the glossary');
}
const total = report.reduce((sum, row) => sum + row.words, 0);
console.table(report);
console.log(`Passed: ${report.length} readable chapters, ${total.toLocaleString()} prose words, ${book.glossary.length} glossary terms. All chapter, source, and figure references are valid.`);
