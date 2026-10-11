#!/usr/bin/env node
'use strict';

// Read-only inventory. A matching checkpoint records file identity, not quality.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const context = { window: {} };
vm.runInNewContext(read('content/book.js'), context);
const book = context.window.ATLAS;
// Ignore the fenced new-item template when counting actual queue entries.
const queue = read('docs/FEEDBACK.md').replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm, '');
const findings = [...queue.matchAll(/^### ([A-Z][A-Z0-9]*-\d+) — (.+)\n([\s\S]*?)(?=^#{1,3} |$(?![\s\S]))/gm)].map(match => ({
  id: match[1], title: match[2],
  status: match[3].match(/^- Status: (.+)$/m)?.[1] || 'unspecified',
  owner: match[3].match(/^- Owner: (.+)$/m)?.[1] || 'unassigned'
}));
console.log(`Market Atlas · edition ${book.manuscript.edition} · ${book.manuscript.status}`);
console.log(`${book.chapters.length} chapters · ${book.parts.length} parts · ${book.chapters.reduce((n, c) => n + c.sections.length, 0)} narrative sections`);
const words = book.chapters.reduce((n, c) => n + c.sections.flatMap(s => s.paragraphs).join(' ').trim().split(/\s+/).length, 0);
console.log(`${words.toLocaleString('en-US')} section-prose words · ${book.glossary.length} glossary terms`);
console.log(`${Object.keys(book.sources).length} source entries · ${new Set(Object.values(book.sources).map(s => s.url)).size} unique source URLs`);
console.log(`${book.chapters.reduce((n, c) => n + (c.practice || []).length, 0)} chapter practice tasks · ${Object.keys(book.partPractice).length} part reviews · ${Object.values(book.partPractice).reduce((n, p) => n + p.tasks.length, 0)} part-review tasks`);
console.log(`${fs.readdirSync(path.join(root, 'assets/figures')).filter(f => f.endsWith('.svg')).length} exported SVGs · ${book.chapters.filter(c => c.learnerAttempt).length} attempt packets (includes an accounting replay)`);
console.log(`Chapter labels: ${[...new Set(book.chapters.map(c => c.status))].join(', ')}`);
const chapterReviewRows = read('docs/PUBLICATION_REVIEW.md').split('\n').filter(line => /^\| \d+ \|/.test(line));
const accepted = chapterReviewRows.filter(line => /\| accepted \|/.test(line)).length;
console.log(`Chapter editorial acceptance: ${accepted}/${book.chapters.length} recorded; release QA and human validation are tracked separately`);
const partReviewRows = read('docs/PUBLICATION_REVIEW.md').split('\n').filter(line => /^\| 0\d: /.test(line));
console.log(`Part-review editorial acceptance: ${partReviewRows.filter(line => /\| accepted \|/.test(line)).length}/${book.parts.length} recorded`);
console.log(`Active feedback: ${findings.length}`);
findings.forEach(item => console.log(`  ${item.id}: ${item.status} · ${item.title} · owner ${item.owner}`));
const roadmap = read('docs/EDITORIAL_ROADMAP.md');
console.log('Roadmap work:');
for (const match of roadmap.matchAll(/^### (ROAD-\d+) — (.+)\n\n- Status \/ owner: (.+)\.$/gm)) {
  console.log(`  ${match[1]}: ${match[3]} · ${match[2]}`);
}

const checkpointName = fs.readdirSync(path.join(root, 'docs')).filter(file => /^PROJECT_CHECKPOINT_\d{8}(?:_\d{6})?\.json$/.test(file)).sort().at(-1);
if (checkpointName) {
  const checkpointFile = `docs/${checkpointName}`;
  const checkpoint = JSON.parse(read(checkpointFile));
  const changed = Object.entries(checkpoint.sha256).filter(([file, expected]) => !fs.existsSync(path.join(root, file)) || hash(file) !== expected).map(([file]) => file);
  const expectedFigures = new Set(Object.keys(checkpoint.sha256).filter(file => file.startsWith('assets/figures/')));
  const addedFigures = fs.readdirSync(path.join(root, 'assets/figures')).filter(file => file.endsWith('.svg') && !expectedFigures.has(`assets/figures/${file}`));
  console.log(`Verification checkpoint ${checkpoint.checked}: ${changed.length || addedFigures.length ? 'CHANGED — recheck affected work' : 'MATCH — checked inputs and outputs are unchanged'}`);
  changed.forEach(file => console.log(`  changed/missing: ${file}`));
  addedFigures.forEach(file => console.log(`  new export: assets/figures/${file}`));
  console.log('File identity does not establish source accuracy, reader learning, or publication acceptance.');
} else {
  console.log('Verification checkpoint: missing; inventory alone is not verification.');
}
console.log('Current tracker: docs/PROJECT_STATUS.md · next work: docs/EDITORIAL_ROADMAP.md');
