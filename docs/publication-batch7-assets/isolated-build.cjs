// Build in an isolated directory and compare every shipping output.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const cp = require('node:child_process'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'market-atlas-batch7-'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
let result;
try {
  for (const directory of ['content', 'scripts', 'docs']) fs.mkdirSync(path.join(temp, directory));
  for (const file of ['figure-renderer.js', 'scripts/build-content.cjs', 'content/curriculum.js', 'content/foundations-price.json', 'content/indicators-context.json', 'content/risk-advanced.json', 'content/research-context.json']) fs.copyFileSync(path.join(root, file), path.join(temp, file));
  cp.execFileSync(process.execPath, ['scripts/build-content.cjs'], { cwd: temp });
  const figures = fs.readdirSync(path.join(temp, 'assets/figures')).filter(f => f.endsWith('.svg')).sort();
  assert.deepEqual(figures, fs.readdirSync(path.join(root, 'assets/figures')).filter(f => f.endsWith('.svg')).sort());
  const files = ['content/book.js', 'docs/MANUSCRIPT.md', 'docs/EVIDENCE_MATRIX.md', ...figures.map(f => 'assets/figures/' + f)];
  const mismatches = files.filter(f => sha(path.join(root, f)) !== sha(path.join(temp, f)));
  assert.equal(mismatches.length, 0);
  const previous = JSON.parse(fs.readFileSync(path.join(root, 'docs/PROJECT_CHECKPOINT_20261012_021708.json'), 'utf8'));
  const changedSvgExports = figures.filter(f => sha(path.join(root, 'assets/figures', f)) !== previous.sha256['assets/figures/' + f]);
  result = { generatedOutputs: files.length, mismatches, changedSvgExports, unchangedSvgExports: figures.length - changedSvgExports.length };
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
fs.writeFileSync(path.join(__dirname, 'isolated-build.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
