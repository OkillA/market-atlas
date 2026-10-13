const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const crypto = require('node:crypto'), cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const priorPath = 'docs/PROJECT_CHECKPOINT_20261013_005053.json';
const prior = JSON.parse(fs.readFileSync(path.join(root, priorPath)));
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, 'content/book.js'), 'utf8'), ctx);
const book = ctx.window.ATLAS;
const fingerprints = JSON.parse(fs.readFileSync(path.join(__dirname, 'fingerprints.json')));
const checks = JSON.parse(fs.readFileSync(path.join(__dirname, 'final-checks.json')));
if (checks.some(c => c.exitCode !== 0)) throw Error('Failed checks');
if (book.chapters.some(c => !c.review.valid)) throw Error('Unaccepted current metadata');
const filename = process.argv[2];
if (!filename || fs.existsSync(path.join(root, filename))) throw Error('Pass an unused checkpoint path');
const files = cp.execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).trim().split('\n');
const pinned = new Set(Object.keys(prior.sha256));
for (const file of files) if (file.startsWith('docs/release-readiness-assets/') || ['content/source-access.json', 'scripts/review-fingerprint.cjs', 'scripts/verify-review-metadata.cjs', 'docs/RELEASE_READINESS_20261012.md', 'package.json', 'styles.css', 'app.js', 'index.html', 'docs/CONTENT_GUIDE.md', 'docs/PROJECT_STATUS.md', 'docs/EDITORIAL_ROADMAP.md', 'docs/PUBLICATION_REVIEW.md', 'docs/FEEDBACK.md', 'docs/FEEDBACK_RESOLVED.md'].includes(file)) pinned.add(file);
const sha256 = Object.fromEntries([...pinned].sort().map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
const inventory = { ...prior.inventory, sectionProseWords: book.chapters.reduce((n, c) => n + c.sections.flatMap(s => s.paragraphs).join(' ').trim().split(/\s+/).length, 0), sourceEntries: Object.keys(book.sources).length, uniqueSourceURLs: new Set(Object.values(book.sources).map(s => s.url)).size };
const chapters = book.chapters.map((chapter, i) => ({ ...prior.chapters[i], number: i + 1, id: chapter.id, status: chapter.status, publicationAcceptance: 'accepted', sha256: fingerprints.chapters[i].sha256, version: chapter.version, shippingReview: chapter.review, ...(chapter.id === 'classical-frameworks' ? { review: { date: '2026-10-12', reviewer: '/root', report: 'docs/RELEASE_READINESS_20261012.md', scope: chapter.review.scope } } : {}) }));
const partReviews = book.parts.map(part => ({ ...prior.partReviews.find(p => p.id === part.id), sha256: fingerprints.parts.find(p => p.id === part.id).sha256, ...(part.id === 'advanced' ? { reviewer: '/root', date: '2026-10-12', report: 'docs/RELEASE_READINESS_20261012.md', scope: 'Unchanged tasks and bounded Chapter 27 dependency re-accepted; prior substantive review retained.' } : {}) }));
const checkpoint = {
  checked: '2026-10-12', reviewer: '/root', edition: book.manuscript.edition,
  scope: 'Release-readiness completion: ROAD-003 75-source access/support/reuse inventory with actual inherited dates and permission limits; ROAD-006 bound AI editorial review/version metadata. PUB7-011 bounded full-author-manuscript addition re-accepts Chapter 27/Part 6; 27 chapter/five part fingerprints and 71 SVGs unchanged. 21 native packet cases at 320/390/768, 30 routes at 320/768, marked final contents child frames at 390/768/1280, notebook round trip with original storage restored, and actual partial native print artifacts. Native print/desktop/file:// release QA remains incomplete; zero human participants. Reproducible local alpha candidate, no push or deployment.',
  inventory, checks: checks.map(c => ({ command: c.command, result: 'passed; exact output in docs/release-readiness-assets/final-checks.json' })),
  chapters, partReviews, sha256,
  reviewReport: 'docs/RELEASE_READINESS_20261012.md', priorCheckpoint: priorPath,
  fingerprintMethod: { chapter: 'scripts/review-fingerprint.cjs: legacy compiled chapter/source hash with review/version omitted and derived status normalized to draft; every unchanged legacy fingerprint reproduced.', part: prior.fingerprintMethod.part },
  pending: ['ROAD-004 remaining native print/desktop/file:// coverage', 'ROAD-007 reviewed release finalization and explicit push authorization', 'CA1-026 deferred actual human reader validation'],
  createdAt: new Date().toISOString(), reviewDateTimezone: 'America/New_York'
};
fs.writeFileSync(path.join(root, filename), JSON.stringify(checkpoint, null, 2) + '\n');
console.log(JSON.stringify({ filename, inventory, reviewed: chapters.length, pinnedFiles: pinned.size }));
