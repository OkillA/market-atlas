// Pin the READ1 figure batch; prior checkpoints remain immutable history.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto'), cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const priorPath = 'docs/PROJECT_CHECKPOINT_20261013_203749.json';
const previous = JSON.parse(fs.readFileSync(path.join(root, priorPath), 'utf8'));
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'content/book.js'), 'utf8'), context);
const book = context.window.ATLAS;
const fingerprints = JSON.parse(fs.readFileSync(path.join(__dirname, 'fingerprints.json'), 'utf8'));
const finalChecks = JSON.parse(fs.readFileSync(path.join(__dirname, 'final-checks.json'), 'utf8'));
if (finalChecks.some(check => check.exitCode)) throw new Error('Failed final verification');
if (book.chapters.some(chapter => !chapter.review.valid)) throw new Error('Chapter review metadata invalid');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const files = cp.execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).trim().split('\n');
const pinned = new Set(Object.keys(previous.sha256));
for (const file of files) if (file.startsWith('docs/read1-assets/') || file.startsWith('assets/figures/') || ['docs/READ1_FIGURES_20261013.md', 'index.html', 'figure-renderer.js', 'scripts/check-content.cjs'].includes(file)) pinned.add(file);
const sha256 = Object.fromEntries([...pinned].filter(file => fs.existsSync(path.join(root, file))).sort().map(file => [file, hash(file)]));
const recheck = { reviewer: '/root', date: '2026-10-13', report: 'docs/READ1_FIGURES_20261013.md' };
const checkpoint = {
  checked: '2026-10-13', reviewer: '/root', edition: book.manuscript.edition,
  scope: 'READ1 figure batch: READ1-001/002/003/008 resolved (round axis ticks and observation labels, 39 labelled reference levels, profile orientation, Chapter 7 hammer-body wording). 54 of 71 SVGs changed and inspected at 760/320px against previous exports; flagged regressions fixed. Ten chapter fingerprints changed (figure specs; Chapter 7 prose); all 28 chapters re-accepted with figure recheck; Parts 1, 2, 3, 5, 6 re-accepted for chapter dependency only.',
  inventory: { ...previous.inventory, sectionProseWords: book.chapters.reduce((n, c) => n + c.sections.flatMap(s => s.paragraphs).join(' ').trim().split(/\s+/).length, 0), portableFigures: fs.readdirSync(path.join(root, 'assets/figures')).filter(f => f.endsWith('.svg')).length },
  checks: finalChecks.map(check => ({ command: check.command, result: 'passed; output in docs/read1-assets/final-checks.json' })).concat([{ command: 'Figure sweep', result: 'docs/read1-assets/figure-sweep.json' }]),
  chapters: book.chapters.map((chapter, index) => {
    const now = fingerprints.chapters[index];
    if (now.id !== chapter.id) throw new Error('Chapter order mismatch');
    const scope = chapter.id === 'candlestick-patterns' ? 'READ1-008 wording and READ1 figure batch figures rechecked; earlier acceptance inherited.' : 'READ1 figure batch: changed compact/wide figures inspected; earlier acceptance inherited.';
    return { ...previous.chapters[index], status: chapter.status, sha256: now.after, figureRecheck: { ...recheck, scope } };
  }),
  partReviews: previous.partReviews.map(part => {
    const now = fingerprints.parts.find(item => item.id === part.id);
    return now.changed ? { ...part, sha256: now.after, dependencyRecheck: { ...recheck, scope: 'Constituent chapter figures/wording changed; part tasks unchanged.' } } : part;
  }),
  sha256,
  changedSincePrior: Object.keys(sha256).filter(file => previous.sha256[file] !== sha256[file]),
  reviewReport: 'docs/READ1_FIGURES_20261013.md', priorCheckpoint: priorPath,
  fingerprintMethod: previous.fingerprintMethod,
  pending: ['READ1-004–007, 009–012 open editorial findings', 'CA1-026 / ROAD-005 deferred actual human reader validation'],
  createdAt: new Date().toISOString(), reviewDateTimezone: 'America/New_York',
  inheritedChecks: { checkpoint: priorPath, scope: 'Native print, browser, release and deployment evidence retain their recorded scope; the public alpha is unchanged until a push.' }
};
const filename = process.argv[2];
if (!filename || fs.existsSync(path.join(root, filename))) throw new Error('Pass an unused checkpoint path');
fs.writeFileSync(path.join(root, filename), JSON.stringify(checkpoint, null, 2) + '\n');
console.log(JSON.stringify({ filename, pinnedFiles: Object.keys(sha256).length, changedSincePrior: checkpoint.changedSincePrior.length }));
