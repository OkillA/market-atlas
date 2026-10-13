// Exercise actual isolated builds, including changes outside the chapter prose.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const cp = require('node:child_process'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const fixtures = ['figure-renderer.js', 'scripts/build-content.cjs', 'scripts/review-fingerprint.cjs', 'content/curriculum.js', 'content/foundations-price.json', 'content/indicators-context.json', 'content/risk-advanced.json', 'content/research-context.json', 'content/source-access.json'];
const results = [];
for (const test of ['baseline', 'prose', 'source', 'renderer', 'missing-review']) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-review-test-'));
  try {
    for (const f of fixtures) { fs.mkdirSync(path.dirname(path.join(temp, f)), { recursive: true }); fs.copyFileSync(path.join(root, f), path.join(temp, f)); }
    fs.mkdirSync(path.join(temp, 'docs'));
    const file = path.join(temp, 'content/foundations-price.json');
    const input = JSON.parse(fs.readFileSync(file));
    const chapter = input.chapters.find(c => c.id === 'market-language');
    if (test === 'prose') chapter.sections[0].paragraphs[0] += ' Changed editorial content.';
    if (test === 'source') input.sources['fp-intro'].supports += ' Changed source scope.';
    if (test === 'missing-review') delete chapter.review;
    if (test === 'renderer') fs.appendFileSync(path.join(temp, 'figure-renderer.js'), '\n// Changed renderer dependency.\n');
    fs.writeFileSync(file, JSON.stringify(input));
    cp.execFileSync(process.execPath, ['scripts/build-content.cjs'], { cwd: temp });
    const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(temp, 'content/book.js'), 'utf8'), ctx);
    const book = ctx.window.ATLAS;
    const target = book.chapters.find(c => c.id === chapter.id);
    assert.equal(target.review.valid, test === 'baseline');
    assert.equal(target.status, test === 'baseline' ? 'reviewed' : 'draft');
    if (test === 'renderer') assert.ok(book.chapters.every(c => !c.review.valid));
    if (test === 'prose' || test === 'missing-review') assert.equal(book.chapters.filter(c => c.review.valid).length, 27);
    assert.equal(book.manuscript.status, 'draft');
    if (test === 'baseline') {
      const outputs = ['content/book.js', 'docs/MANUSCRIPT.md', 'docs/EVIDENCE_MATRIX.md', ...fs.readdirSync(path.join(temp, 'assets/figures')).map(f => 'assets/figures/' + f)];
      for (const f of outputs) assert.deepEqual(fs.readFileSync(path.join(temp, f)), fs.readFileSync(path.join(root, f)), f);
      assert.equal(book.chapters.filter(c => c.review.valid).length, 28);
      results.push({ test, comparedOutputs: outputs.length, reviewed: 28, passed: true });
    } else results.push({ test, targetStatus: target.status, reasons: target.review.reasons, passed: true });
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}
fs.writeFileSync(path.join(root, 'docs/release-readiness-assets/review-invalidation.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results));
