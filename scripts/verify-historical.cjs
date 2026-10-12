#!/usr/bin/env node
'use strict';
// Recompute from the preserved decimal CSV inputs, not the reported case labels.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const selection = json('data/historical/selection.json');
const provenance = json('data/historical/provenance.json');
const ledger = json('data/historical/cases.json');
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
assert.deepEqual(selection.symbols, ['AAPL', 'MSFT', 'SPY']);
assert.equal(selection.recorded_before_price_download, true);
assert.equal(provenance.dataset_version, 3);
assert.equal(json('data/historical/kaggle-metadata.json').info.licenses[0].name, 'CC0-1.0');
const computed = [];
for (const source of provenance.files) {
  const raw = read(`data/historical/${source.file}`);
  assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), source.extract_sha256);
  const lines = raw.trim().split('\n'), keys = lines.shift().split(',');
  const rows = lines.map(line => Object.fromEntries(line.split(',').map((value, i) => [keys[i], value])));
  assert.equal(rows.length, source.extract_rows);
  rows.forEach((row, i) => {
    assert.ok(!i || rows[i-1].Date < row.Date, 'Source dates must be unique and ascending');
    const [o,h,l,c] = ['Open','High','Low','Close'].map(key => Number(row[key]));
    assert.ok(l <= Math.min(o,c) && h >= Math.max(o,c) && l <= h);
  });
  for (let month = 1; month <= 12; month++) {
    const scheduleDate = `2016-${String(month).padStart(2,'0')}-01`;
    const index = rows.findIndex(row => row.Date >= scheduleDate);
    assert.ok(index >= 5 && index + 5 < rows.length);
    const window = rows.slice(index-5,index+6);
    const close = Number(rows[index].Close);
    const mean = rows.slice(index-5,index).reduce((sum,row) => sum + Number(row.Close),0) / 5;
    const upper = close * 1.01, lower = close * .99;
    let category = close > mean ? 'ordinary' : 'skipped', date = null, phase = null;
    if (category !== 'skipped') {
      for (const row of rows.slice(index+1,index+6)) {
        const open = Number(row.Open), hits = [Number(row.High) >= upper, Number(row.Low) <= lower];
        if (open >= upper || open <= lower) {
          category = open >= upper ? 'favorable' : 'adverse'; phase = 'open';
        } else if (hits[0] || hits[1]) {
          category = hits.every(Boolean) ? 'ambiguous' : hits[0] ? 'favorable' : 'adverse'; phase = 'range';
        } else continue;
        date = row.Date; break;
      }
    }
    const id = `${source.symbol}-${scheduleDate.slice(0,7)}`;
    const saved = ledger.cases.find(candidate => candidate.id === id);
    assert.ok(saved, `Missing fixed calendar cell ${id}`);
    assert.equal(saved.cutoff, rows[index].Date);
    assert.equal(saved.category, category); assert.equal(saved.decisive_date, date); assert.equal(saved.decisive_phase, phase);
    near(Number(saved.prior_mean), mean); near(Number(saved.close), close);
    near(Number(saved.upper), upper); near(Number(saved.lower), lower);
    assert.deepEqual(saved.rows, window);
    computed.push(saved);
  }
}
assert.equal(ledger.cases.length, 36);
computed.sort((a,b) => a.cutoff.localeCompare(b.cutoff) || a.symbol.localeCompare(b.symbol));
assert.deepEqual(computed.map(c => c.id), ledger.cases.map(c => c.id));
const counts = {}, reps = {};
for (const c of computed) { counts[c.category] = (counts[c.category] || 0)+1; reps[c.category] ??= c.id; }
assert.deepEqual(counts, {skipped:18,adverse:11,favorable:6,ordinary:1});
assert.deepEqual(reps, ledger.representatives);
const additions = json('content/research-context.json').chapterAdditions['case-studies'];
const gallery = additions.sections.find(s => s.title.includes('calendar-selected historical gallery'));
assert.equal(gallery.tables[0].rows.length,36);
gallery.tables[0].rows.forEach((row,i) => {
  const c = computed[i];
  assert.deepEqual(row.slice(0,4), [c.symbol,c.cutoff,`${c.close} / ${c.prior_mean}`,c.category]);
});
for (const c of Object.values(reps).map(id => computed.find(c => c.id === id))) {
  const section = additions.sections.find(s => s.tables?.[0]?.title.startsWith(c.id));
  assert.ok(section);
  assert.ok(section.paragraphs.join(' ').includes(c.prior_mean), `Prose mean ${c.id}`);
  assert.deepEqual(section.tables[0].rows.map(row => row.slice(1)), c.rows.map(row => ['Open','High','Low','Close'].map(key => row[key])));
  const figure = additions.figures.find(f => f.title.endsWith(c.cutoff));
  assert.equal(figure.historical,true);
  assert.equal(figure.afterAddedSection, additions.sections.indexOf(section));
  assert.deepEqual(figure.panels.flatMap(panel => panel.candles.map(({open,high,low,close}) => [open,high,low,close])), c.rows.map(row => ['Open','High','Low','Close'].map(key => Number(row[key]))));
}
const dualBars = computed.flatMap(c => c.rows.slice(6).filter(row => Number(row.Open) > Number(c.lower) && Number(row.Open) < Number(c.upper) && Number(row.High) >= Number(c.upper) && Number(row.Low) <= Number(c.lower)).map(row => ({c,row})));
dualBars.sort((a,b) => a.row.Date.localeCompare(b.row.Date) || a.c.symbol.localeCompare(b.c.symbol));
assert.equal(dualBars[0].c.id,'AAPL-2016-02'); assert.equal(dualBars[0].row.Date,'2016-02-05');
assert.equal(dualBars[0].c.category,'skipped');
const diagnostic = additions.sections.find(s => s.title.includes('ambiguous candle inside'));
assert.ok(diagnostic.paragraphs.join(' ').includes(dualBars[0].c.prior_mean));
const diagnosticFigure = additions.figures.find(f => f.title === 'One historical candle, two possible orders');
assert.equal(diagnosticFigure.afterAddedSection, additions.sections.indexOf(diagnostic));
assert.deepEqual(diagnosticFigure.panels[1].series[0].values,[93.429,93.816,90.69,91.009]);
assert.deepEqual(diagnosticFigure.panels[2].series[0].values,[93.429,90.69,93.816,91.009]);
// Chapter 28 transfer task: its SPY rows must equal the archive, and its stated levels and open-stage resolution must follow.
{
  const spyRows = Object.fromEntries(read('data/historical/spy.csv').trim().split('\n').slice(1).map(line => line.split(',')).map(([d,o,h,l,c]) => [d, [o,h,l,c].map(Number)]));
  const caseChapter = JSON.parse(read('content/risk-advanced.json')).chapters.find(c => c.id === 'case-studies');
  const task = caseChapter.practice.find(t => t.title === 'Audit a calendar-selected historical cutoff');
  for (const row of task.tables[0].rows) assert.deepEqual(row.slice(1).map(Number), spyRows[row[0].slice(0, 10)], `SPY task row ${row[0]}`);
  const priorFive = task.tables[0].rows.slice(0, 5).map(r => Number(r[4])), cutoffClose = Number(task.tables[0].rows[5][4]);
  near(priorFive.reduce((a, b) => a + b, 0), 992.52); near(priorFive.reduce((a, b) => a + b, 0) / 5, 198.504); assert.ok(cutoffClose > 198.504);
  near(1.01 * cutoffClose, 202.7777); near(0.99 * cutoffClose, 198.7623);
  const spyCase = ledger.cases.find(c => c.id === 'SPY-2016-04'); assert.equal(spyCase.category, 'adverse'); assert.equal(spyCase.decisive_phase, 'open');
  assert.equal(ledger.cases.filter(c => c.decisive_phase === 'open').length, 1);
  assert.match(task.solution.join(' '), /198\.504/); assert.match(task.solution.join(' '), /202\.7777/); assert.match(task.solution.join(' '), /198\.7623/);
}
console.log('Historical gallery verified: source hashes/OHLC, all 36 fixed windows, exact means/levels/clock, four first representatives, tables/figures, and separately selected sequence diagnostic.');
