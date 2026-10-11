# Market Atlas

An illustrated, interactive textbook about technical analysis for **stocks**, written for someone who knows investing basics but is new to chart analysis. It combines a guided book with a searchable reference.

Current progress and next work: [project tracker](docs/PROJECT_STATUS.md) · [roadmap](docs/EDITORIAL_ROADMAP.md). Run `npm run status` for a live inventory and verification-checkpoint freshness.

## Open it

Double-click **index.html**, or open it in any modern browser. Everything needed to read is in this folder. No installation, internet connection, API key, or build step is needed.

For a local web address, run from this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then visit **http://localhost:4173**. If you have Node, `npm run dev` does the same thing. Stop the server with Ctrl+C.

## What is here

- 28 draft chapters across foundations, price structure, indicators, market context, risk/process, and advanced study.
- Substantial prose, explicit formulas/conventions, original fictional examples, failed/ambiguous cases, source notes, exercises, and quizzes.
- A labeled figure with inspectable data for every chapter, plus candle anatomy and pattern illustrations.
- Four interactive experiments: candles, trend structure, moving averages, and unleveraged long-stock position sizing.
- Search across chapter prose and glossary definitions.
- Reading progress, bookmarks, and chapter notes, stored locally in the browser.
- Notebook export/import for backups and moving to another browser or a future hosted edition.
- Responsive layout, light/dark themes, keyboard navigation, and chapter print styles.

The independently readable [full manuscript](docs/MANUSCRIPT.md) includes portable illustrations in `assets/figures/`. It is generated from the same chapter files as the website, so the prose is also easy to review outside the browser.

This is a **draft manuscript under revision**. All 28 chapters include worked solutions and graded practice, with cumulative reviews for six parts. Teaching examples are fictional unless labelled historical; Chapter 28 includes documented observations and a 36-window AAPL/MSFT/SPY archive gallery with preserved inputs, cutoffs and selection limits. The research appendix compares selected original studies, and the evidence matrix traces chapter claims and all 105 glossary terms. Source-linked terminology does not establish a trading edge. The historical gallery is complete within its stated educational/archive limits. A full [reader-study packet](docs/READER_PROTOCOL.md) is prepared; actual human participation and reader-driven revisions remain pending. See the current [feedback queue](docs/FEEDBACK.md), [gallery and study preparation report](docs/HISTORICAL_AND_READER_PREP_20261002.md), and [source-audit status](docs/SOURCE_AUDIT_20261002.md).

## Why a static website

HTML, CSS, and JavaScript fit both goals: reading locally today and publishing later. Separate files keep the book maintainable without requiring a framework. Classic scripts avoid the restrictions that module imports and fetched JSON can encounter when opening a local file.

The site has no remote fonts, analytics, accounts, CDN dependencies, or live market feeds. External source links are optional further reading. Browser storage may be unavailable in privacy-restricted environments; the notebook explains when it cannot persist notes.

To publish, run `npm run build:site` and upload the resulting `_site/` folder (the six files above, with their relative paths) to any static host. Pushing to `main` on GitHub deploys it to GitHub Pages through `.github/workflows/pages.yml` after the verifiers and content checks pass. The current public build is an alpha draft; see [release notes](docs/RELEASE_ALPHA.md). Hash URLs currently handle chapter navigation without server rewrites. Before a large public reference launch, generate individual HTML chapter URLs for search engines, add contributor/review workflows, and validate content and data rights. A backend is only needed for features such as accounts, synchronized notes, or collaborative editing.

## Editing the book

The authoring files are:

```text
content/foundations-price.json   Chapters 01–09
content/indicators-context.json  Chapters 10–19
content/risk-advanced.json       Chapters 20–28
content/research-context.json    Research appendix, glossary support and chapter additions
content/curriculum.js            Part structure and original starter catalog
content/book.js                  Generated complete browser edition
```

Part order, rather than JSON file order, determines chapter numbering. Source IDs are namespaced by authoring group. Each chapter has narrative sections, a takeaway, worked example, exercise, quiz, related links, source IDs, and an illustration specification. See [CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md).

After editing authoring JSON, rebuild and check using Node:

```sh
npm run build:content
npm run check
node scripts/check-content.cjs --strict-revision
```

Before the shared rebuild, run `node scripts/verify-early-chapters.cjs`, `node scripts/verify-revision.cjs`, and `node scripts/verify-historical.cjs` to check the supplied calculations. One integrating agent owns the rebuild; reviewers do not run competing builds. Content and source inspection remain separate from these automated checks.

Reading the book does not require Node. `book.js` is already built. The checker validates chapter references, source references, figures, quizzes, glossary links, and minimum manuscript length. It does not prove factual correctness; editorial review remains necessary.

## Research-agent handoff

Use [RESEARCH_AGENT_PROMPT.md](docs/RESEARCH_AGENT_PROMPT.md) to expand and review the manuscript. It specifies the audience, coverage, writing standard, evidence policy, required illustrations, structured output, and review process. The priority is content quality and depth.

## Notes and backups

Use **My notebook → Export notebook** to save a JSON backup. Import merges bookmarks/progress and preserves both versions of conflicting notes. Notes saved under a `file://` location, `localhost`, and a future public domain are separate stores; export/import bridges them. Keep backups before changing browser profiles or clearing browsing data.

## Project status

The complete revised draft is ready for local reading. The [project tracker](docs/PROJECT_STATUS.md) records completed milestones and their evidence; the [roadmap](docs/EDITORIAL_ROADMAP.md) lists remaining work, owners, dependencies and completion criteria. [Batch 1](docs/PUBLICATION_BATCH1_20261002.md), [batch 2](docs/PUBLICATION_BATCH2_20261002.md), [batch 3](docs/PUBLICATION_BATCH3_20261003.md) and [batch 4](docs/PUBLICATION_BATCH4_20261003.md) record current editorial acceptance of Chapters 1–14, 20 and 21 (16/28), plus Parts 1–3 (3/6). Next is Chapters 15–19 and Part 4. The other 12 chapters and three part reviews, source/rights release checks, native browser/print release QA and chapter review/version metadata remain pending. The human-study packet is ready, but actual participants and reader-driven revisions remain deferred under CA1-026. No public deployment or user account system has been created.

Run `npm run status` to inspect current counts, active feedback and changes since the dated verification checkpoint. This command is read-only; matching file hashes do not establish factual accuracy or publication acceptance.
