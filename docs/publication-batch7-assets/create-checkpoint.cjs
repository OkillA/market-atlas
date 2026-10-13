// Retain prior checkpoints as immutable history; pin final reviewed inputs/outputs.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const crypto = require('node:crypto'), cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const priorPath = 'docs/PROJECT_CHECKPOINT_20261012_021708.json';
const previous = JSON.parse(fs.readFileSync(path.join(root, priorPath), 'utf8'));
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'content/book.js'), 'utf8'), context);
const book = context.window.ATLAS;
const fingerprints = JSON.parse(fs.readFileSync(path.join(__dirname, 'fingerprints.json'), 'utf8'));
const changedFigures = JSON.parse(fs.readFileSync(path.join(__dirname, 'renderer-review.json'), 'utf8'));
const finalChecks = JSON.parse(fs.readFileSync(path.join(__dirname, 'final-checks.json'), 'utf8'));
if (finalChecks.some(c => c.exitCode)) throw new Error('Failed final verification');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const files = cp.execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).trim().split('\n');
const pinned = new Set(Object.keys(previous.sha256));
for (const file of files) if (file.startsWith('docs/publication-batch7-assets/') || ['index.html', 'docs/CONTENT_GUIDE.md', 'docs/PUBLICATION_BATCH7_20261012.md', 'docs/PUBLICATION_BATCH7_HANDOFF.md', 'docs/PROJECT_STATUS.md', 'docs/EDITORIAL_ROADMAP.md', 'docs/PUBLICATION_REVIEW.md', 'docs/FEEDBACK.md', 'docs/FEEDBACK_RESOLVED.md'].includes(file)) pinned.add(file);
const sha256 = Object.fromEntries([...pinned].sort().map(file => [file, hash(file)]));
const checkpoint = {
  checked: '2026-10-12', reviewer: '/root', edition: book.manuscript.edition,
  scope: 'Publication batch 7 handoff completion: Chapters 24–28 and Part 6 accepted; all 28 chapters and six part reviews accepted for scoped editorial content. Current prose reviewed against inherited full-review/source evidence; 3,885 reproduction comparisons rerun; 42 compact/wide figure pairs plus six dense-panel closeups inspected; 18 native top-level route/width cases at 320/390/1280; 568 native light/dark SVG fixtures; focused keyboard and print display-policy checks. No new source fetch, native printer pagination or human observations. 17 earlier accepted chapters have changed figures rechecked; Chapters 6–8 whitespace and Chapter 10 study locator re-accepted.',
  inventory: {
    chapters: book.chapters.length, parts: book.parts.length,
    sections: book.chapters.reduce((n, c) => n + c.sections.length, 0),
    sectionProseWords: book.chapters.reduce((n, c) => n + c.sections.flatMap(s => s.paragraphs).join(' ').trim().split(/\s+/).length, 0),
    glossaryTerms: book.glossary.length, sourceEntries: Object.keys(book.sources).length,
    uniqueSourceURLs: new Set(Object.values(book.sources).map(s => s.url)).size,
    practiceTasks: book.chapters.reduce((n, c) => n + c.practice.length, 0),
    partReviews: Object.keys(book.partPractice).length,
    partReviewTasks: Object.values(book.partPractice).reduce((n, p) => n + p.tasks.length, 0),
    attemptPackets: book.chapters.filter(c => c.learnerAttempt).length,
    portableFigures: fs.readdirSync(path.join(root, 'assets/figures')).filter(f => f.endsWith('.svg')).length
  },
  checks: finalChecks.map(c => ({ command: c.command, result: 'passed; complete output retained in docs/publication-batch7-assets/final-checks.json' })),
  chapters: book.chapters.map((chapter, i) => {
    const old = previous.chapters.find(c => c.id === chapter.id);
    const result = { ...old, number: i + 1, id: chapter.id, title: chapter.title, status: chapter.status, publicationAcceptance: 'accepted', sha256: fingerprints.chapters.find(c => c.id === chapter.id).sha256 };
    if (changedFigures.acceptedChapterIds.includes(chapter.id)) result.figureRecheck = { reviewer: '/root', date: '2026-10-12', report: 'docs/PUBLICATION_BATCH7_20261012.md', scope: 'Changed compact/wide figures inspected; substantive earlier acceptance inherited except documented text/source-locator changes.' };
    if (i >= 23 || fingerprints.chapters.find(c => c.id === chapter.id).changed) result.review = { reviewer: '/root', date: '2026-10-12', report: 'docs/PUBLICATION_BATCH7_20261012.md', scope: i >= 23 ? 'Full chapter final review with inherited initial reviewer/source evidence; final arithmetic, actual figures and native reader checks.' : 'Re-accepted for documented whitespace or shared study locator/date correction; earlier substantive review retained.' };
    return result;
  }),
  partReviews: book.parts.map(part => {
    const old = previous.partReviews.find(p => p.id === part.id);
    return { ...old, id: part.id, publicationAcceptance: 'accepted', sha256: fingerprints.parts.find(p => p.id === part.id).sha256, ...(part.id === 'advanced' || ['price-action', 'indicators'].includes(part.id) ? { reviewer: '/root', date: '2026-10-12', report: 'docs/PUBLICATION_BATCH7_20261012.md' } : {}) };
  }),
  sha256, reviewReport: 'docs/PUBLICATION_BATCH7_20261012.md', priorCheckpoint: priorPath,
  fingerprintMethod: previous.fingerprintMethod, createdAt: new Date().toISOString(), reviewDateTimezone: 'America/New_York'
};
const filename = process.argv[2];
if (!filename || fs.existsSync(path.join(root, filename))) throw new Error('Pass an unused checkpoint path');
fs.writeFileSync(path.join(root, filename), JSON.stringify(checkpoint, null, 2) + '\n');
console.log(JSON.stringify({ filename, inventory: checkpoint.inventory, chapterAcceptance: checkpoint.chapters.length, partAcceptance: checkpoint.partReviews.length, pinnedFiles: pinned.size }));
