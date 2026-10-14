// Pin the READ1 wording batch; prior checkpoints remain immutable history.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto'), cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const priorPath = 'docs/PROJECT_CHECKPOINT_20261014_004703.json';
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
for (const file of files) if (file.startsWith('docs/read1-wording-assets/') || file.startsWith('assets/figures/') || ['docs/READ1_WORDING_20261014.md', 'docs/FEEDBACK.md', 'docs/FEEDBACK_RESOLVED.md', 'docs/PUBLICATION_REVIEW.md', 'docs/PROJECT_STATUS.md', 'index.html'].includes(file)) pinned.add(file);
const sha256 = Object.fromEntries([...pinned].filter(file => fs.existsSync(path.join(root, file))).sort().map(file => [file, hash(file)]));
const recheck = { reviewer: 'claude-code-read1b', date: '2026-10-14', report: 'docs/READ1_WORDING_20261014.md' };
const checkpoint = {
  checked: '2026-10-14', reviewer: 'claude-code-read1b', edition: book.manuscript.edition,
  scope: 'READ1 wording batch: READ1-005 (plain-language R in Ch 9/18/20 and glossary) and READ1-009 (Ch 11 MACD indexing, section order, referent) resolved. Four chapter fingerprints changed (9, 11, 18, 20), re-accepted for wording; Parts 2–5 re-accepted for chapter dependency only; only momentum-2.svg desc text changed.',
  inventory: { ...previous.inventory, sectionProseWords: book.chapters.reduce((n, c) => n + c.sections.flatMap(s => s.paragraphs).join(' ').trim().split(/\s+/).length, 0), portableFigures: fs.readdirSync(path.join(root, 'assets/figures')).filter(f => f.endsWith('.svg')).length },
  checks: finalChecks.map(check => ({ command: check.command, result: 'passed; output in docs/read1-wording-assets/final-checks.json' })),
  chapters: book.chapters.map((chapter, index) => {
    const now = fingerprints.chapters[index];
    if (now.id !== chapter.id) throw new Error('Chapter order mismatch');
    if (!now.changed) return { ...previous.chapters[index], status: chapter.status };
    const scope = 'READ1 wording batch: changed wording and affected arithmetic/referents rechecked; earlier acceptance and 2026-10-13 figure recheck inherited.';
    return { ...previous.chapters[index], status: chapter.status, sha256: now.after, wordingRecheck: { ...recheck, scope } };
  }),
  partReviews: previous.partReviews.map(part => {
    const now = fingerprints.parts.find(item => item.id === part.id);
    return now.changed ? { ...part, sha256: now.after, dependencyRecheck: { ...recheck, scope: 'Constituent chapter wording changed; part tasks unchanged.' } } : part;
  }),
  sha256,
  changedSincePrior: Object.keys(sha256).filter(file => previous.sha256[file] !== sha256[file]),
  reviewReport: 'docs/READ1_WORDING_20261014.md', priorCheckpoint: priorPath,
  fingerprintMethod: previous.fingerprintMethod,
  pending: ['READ1-004, 006, 007, 010–012 open editorial findings', 'CA1-026 / ROAD-005 deferred actual human reader validation'],
  createdAt: new Date().toISOString(), reviewDateTimezone: 'America/New_York',
  inheritedChecks: { checkpoint: priorPath, scope: 'Native print, browser, release and deployment evidence retain their recorded scope; the public alpha is unchanged until a push.' }
};
const filename = process.argv[2];
if (!filename || fs.existsSync(path.join(root, filename))) throw new Error('Pass an unused checkpoint path');
fs.writeFileSync(path.join(root, filename), JSON.stringify(checkpoint, null, 2) + '\n');
console.log(JSON.stringify({ filename, pinnedFiles: Object.keys(sha256).length, changedSincePrior: checkpoint.changedSincePrior.length }));
