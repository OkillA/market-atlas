# Project status

Updated **2026-10-11** by `/root` after publication batch 6. This is the current project tracker. [The roadmap](EDITORIAL_ROADMAP.md) owns the remaining work and its completion criteria; [the feedback queue](FEEDBACK.md) owns actionable review findings; [the resolution history](FEEDBACK_RESOLVED.md) preserves their evidence. Dated completion reports describe their own snapshots.

**Where we are:** the complete revised draft is available for local reading and as a public alpha at https://okilla.github.io/market-atlas/. The major recorded content and interface findings are resolved. Twenty-three of 28 chapters and Parts 1–5 have current editorial acceptance; 5 chapters and one part review remain pending. Release QA and human reader validation have not been completed. Work can continue while readers are unavailable.

## Current inventory

| Deliverable | Current state |
| --- | --- |
| Browser book and standalone manuscript | Edition 0.4; all 28 chapters remain labelled draft |
| Structure | Six parts; 210 narrative sections |
| Section prose | 41,241 words; excludes examples, practice, quizzes and research appendix |
| Practice | 28 chapter exercise solutions; 65 graded chapter tasks; six cumulative reviews with 18 tasks |
| Illustrations | 71 portable SVGs generated from shared figure specifications |
| Attempt packets | Seven: Chapters 6–9, 22, 26 and 28; Chapter 26 is an accounting replay |
| Reference and evidence | 105 glossary terms; 73 source entries; eight research-appendix sections |
| Historical gallery | 36 fixed AAPL/MSFT/SPY windows, with documented archive/selection limitations |
| Human validation | Packet prepared; zero participants and zero observations |
| Public release | Alpha draft 0.4.0-alpha.1 deployed 2026-10-11 to GitHub Pages from OkillA/market-atlas ([release notes](RELEASE_ALPHA.md)); reviewed edition pending |

Run `npm run status` for a fresh read-only inventory and comparison with [the verification checkpoint](PROJECT_CHECKPOINT_20261012_021708.json). The numbers above belong to the dated checkpoint; update them after substantive changes. Matching hashes show that checked files have not changed, rather than establishing new factual or publication approval.

## Completed milestones

“Complete” below applies to the described revision scope. Further evidence can reopen an existing finding.

| Milestone | Status | Completion evidence and boundary |
| --- | --- | --- |
| Full manuscript, worked solutions, graded practice and six part reviews | Complete | [Early/whole-book teaching acceptance](TEACHING_ACCEPTANCE_20261001.md), [Chapters 20–28 integration](REVISION_COMPLETION_20261001.md); editorial and mathematical checks, not demonstrated human learning |
| Empirical synthesis and claim/glossary support | Complete for selected scope | CA1-018/019; [source audit](SOURCE_AUDIT_20261002.md), [evidence matrix](EVIDENCE_MATRIX.md); selected studies and inspected passages, not an exhaustive literature audit |
| Historical transfer gallery | Complete for educational archive scope | CA1-022; [gallery completion](HISTORICAL_AND_READER_PREP_20261002.md), [data provenance](../data/historical/README.md); retrospectively adjusted archive, not a historical execution trial |
| Critical re-audit corrections and reader interface | Complete for recorded findings | Reopened CA1-015/016/024 and AUD2-001–019; [audit resolution](AUDIT_RESOLUTION_20261002.md); native browser/portable-figure checks and sampled WeasyPrint output have stated limits |
| LARK order instructions, Atlas accounting attempt and print fixes | Complete | AUD2-003/010 and CONT3-001; [follow-through](FOLLOW_THROUGH_20261002.md) |
| Fresh independent MACD, breadth and event tasks | Complete | CA1-015; [practice transfer](PRACTICE_TRANSFER_20261002.md) |
| Chapters 7–9 cutoff staging and attempt search | Complete | AUD2-003/006; [price-action staging](PRICE_ACTION_STAGING_20261002.md) |
| Human-study preparation | Complete | [Protocol](READER_PROTOCOL.md), two unfamiliar forms, scoring key, facilitator sheet and empty results record; CA1-026 remains deferred |
| Current tracker and publication-review preparation | Complete | TRACK1-001; this page, sequenced roadmap, [chapter ledger](PUBLICATION_REVIEW.md), status command and pinned checkpoint |
| Publication review batch 1 | Complete for five chapters | [Chapters 1, 2, 9, 20 and 21](PUBLICATION_BATCH1_20261002.md); PUB1-001, CA1-024 and AUD2-002 resolved; release QA, metadata and human validation remain separate |
| Publication review batch 2 | Complete for four chapters and Part 1 | [Chapters 3–6 and cumulative review](PUBLICATION_BATCH2_20261002.md); AUD2-018 reopened label occlusion and PUB2-001 locator corrected; native phone-frame/print limits remain explicit |
| Publication review batch 3 | Complete for two chapters and Part 2 | [Chapters 7–8 and cumulative review](PUBLICATION_BATCH3_20261003.md); PUB3-001 locators and PUB3-002 mirror wording corrected; native viewport/frame coverage and NBER retrieval limits recorded |
| Publication review batch 4 | Complete for five chapters and Part 3; Chapter 3 and Part 1 re-accepted | [Chapters 10–14 and cumulative review](PUBLICATION_BATCH4_20261003.md); PUB4-001–008 resolved, including the renderer bar-axis floor; PUB4-009 later resolved 2026-10-11 |
| Public alpha | Deployed | [Release notes](RELEASE_ALPHA.md); GitHub Pages workflow reruns all verifiers/checks before each deploy |
| Publication review batch 5 | Complete for five chapters and Part 4 | [Chapters 15–19 and cumulative review](PUBLICATION_BATCH5_20261011.md); PUB5-001–011 resolved; PUB5-012/013 residuals subsequently resolved in the renderer batch |
| Illustration renderer correction batch | Complete for three recorded findings | [Renderer batch](RENDERER_BATCH_20261011.md); ALPHA1-001, PUB5-012 and PUB5-013 resolved; changed accepted figures rechecked, Chapter 16/Part 4 re-accepted for a count-axis option |
| Publication review batch 6 | Complete for two chapters and Part 5 | [Chapters 22–23 and cumulative review](PUBLICATION_BATCH6_20261011.md); reopened CA1-015 and PUB6-001 resolved; current totals 23/28 chapters and 5/6 part reviews |

## Work remaining

| Work ID | Status | Owner | Next concrete action |
| --- | --- | --- | --- |
| ROAD-002: chapter publication acceptance | Ready; 23/28 chapters and 5/6 part reviews accepted | Unassigned | Review Chapters 24–28 and Part 6; record current fingerprints and substantive evidence |
| ROAD-003: source access and data-rights review | Ready | Unassigned | Inventory every source URL and historical reuse/convention record; distinguish retrieval failure from unsupported claims |
| ROAD-004: native browser and print release QA | Ready | Unassigned | Extend existing QA with native printer checks for all seven packets and both print policies; retain actual output and report coverage gaps |
| ROAD-005: human reader validation / CA1-026 | Deferred: participants unavailable | /root, preparation only; session facilitator unassigned | Resume the prepared protocol when actual target readers are available; record observations, revisions and rechecks |
| ROAD-006: chapter review/version metadata | Planned | Unassigned | After current reviews, add truthful per-chapter review/version data to authoring and carry it through the build and reader |
| ROAD-007: public release packaging | In progress: alpha draft deployed to GitHub Pages | claude-code-alpha | Reviewed edition after ROAD-002/003/004/006; each push to `main` redeploys, so push only with authorization |

The [roadmap](EDITORIAL_ROADMAP.md) records dependencies and exit criteria for these IDs. These are planned work packages, not demonstrated defects or duplicate feedback findings. `Ready` means independent work can start; it does not imply a claim. Claim a package before implementation and record concrete progress before releasing it.

## Verification at this checkpoint

All three documented numerical verifiers, normal/strict content checks, the figure regression gate and twenty JavaScript syntax checks passed on 2026-10-11 after batch 6's coordinated rebuilds. The early verifier reports **617 comparisons**. Batch 6 independently reproduces **117 exact numeric comparisons**, plus 38 text and 25 structural checks, with zero mismatches. An isolated build matches **all 74 generated outputs byte for byte**.

[Batch 6](PUBLICATION_BATCH6_20261011.md) accepts Chapters 22–23 and Part 5 after full editorial review, eleven scoped source-passage checks over four URLs, eight final portable figure rasters and nine browser route checks. The browser coverage is native top-level 1280/390px plus 320px child frames; text/table inputs, solution staging, quiz feedback and light/dark geometry pass. Actual print CSS/callbacks preserve inputs and apply the learner/answer solution policy; native printer pagination remains unverified. Final browser screenshot capture failed, so the final figure evidence is explicitly Quick Look SVG rasters.

Only `psychology.svg` changes in this batch; the other 70 exported SVGs are unchanged from the renderer checkpoint. Its fixed-dollar path label coverage falls from 44–45% compact / 14.30% wide to zero. The fresh journal task and complete Part 5 fill/cancellation/review inputs are rebuilt into the reader and manuscript. The section-prose inventory stays 41,241 words because the new task lives in practice, not narrative sections.

The [current checkpoint](PROJECT_CHECKPOINT_20261012_021708.json) pins Chapters 22/23 and Part 5 at their accepted fingerprints, current shared dependencies and outputs. All 21 earlier accepted chapters and Parts 1–4 retain their fingerprints. Earlier checkpoints remain immutable history; the checkpoint filename uses UTC and the review date uses America/New_York.

Chapters 24–28/Part 6, source/rights release review, broader release/browser/printer QA, metadata and human learning remain pending. CA1-026 is the only active feedback finding and remains deferred for actual reader participation. Batch 6 changes are local and unpushed.

## Keeping this tracker useful

1. Start with this page and the active feedback queue; claim the next ready roadmap package or an actionable finding.
2. For a concrete content issue, reuse/reopen its feedback ID where appropriate. Planning status belongs in the roadmap; full findings and closure evidence belong in the feedback files.
3. Edit authoring JSON for content changes and coordinate one shared rebuild. Verify affected teaching, calculations, source claims and actual figures according to [CONTENT_GUIDE.md](CONTENT_GUIDE.md).
4. Update the roadmap's owner, progress and exit evidence, plus affected chapter-ledger rows. Refresh this inventory and create a new dated checkpoint after checks pass; retain old reports as history.
5. If `npm run status` reports changed files, determine which checks and reviews are affected. A checkpoint match is a freshness signal; publication acceptance and reader observations require their own evidence.
