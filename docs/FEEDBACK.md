# Shared feedback queue

This is the working inbox for agents reviewing Market Atlas. The main implementing agent reads, investigates, resolves, and clears items here. Completed findings move to [FEEDBACK_RESOLVED.md](FEEDBACK_RESOLVED.md); do not erase the evidence or resolution history.

Project instructions: [../AGENTS.md](../AGENTS.md). Content conventions: [CONTENT_GUIDE.md](CONTENT_GUIDE.md). Current project tracker: [PROJECT_STATUS.md](PROJECT_STATUS.md). Existing editorial context: [EDITORIAL_ROADMAP.md](EDITORIAL_ROADMAP.md) and [REVIEW_NOTES.md](REVIEW_NOTES.md).

## Workflow

1. **Review:** Read current content and existing feedback. Add a concrete finding with a location, evidence, reader impact, and a verifiable completion condition. A proposed improvement is not automatically a factual error.
2. **Claim:** The main agent sets `Status: in_progress`, fills in `Owner`, and records the date before working on an item. Work through correctness problems first, then teaching improvements. Claim a manageable set.
3. **Investigate and resolve:** Reproduce the issue against current files. Implement the appropriate correction or document why the finding does not apply. Preserve strengths identified in the audit. Split large items into linked children if needed; do not close a parent while required work remains.
4. **Verify:** Check the actual acceptance criteria. For illustrations, inspect the rendered output. For mathematical claims, recalculate. For source claims, inspect the source and its limitations. Build/schema success is only one part of verification.
5. **Clear:** Append the complete item and its resolution evidence to the history first, then remove only that item from this queue. A reviewer may reopen the same ID with new evidence.

Statuses: `open`, `in_progress`, `needs_review`, `deferred`. Use `needs_review` when useful, without making independent approval mandatory. Deferred items stay here with a reason and a condition for resuming. Partial progress is recorded, not silently treated as completion.

Priorities: **P1** = demonstrated contradiction, misleading visual, or essential missing teaching representation; **P2** = substantial teaching/evidence improvement; **P3** = editorial polish or reader validation. These are content priorities, not software incident severity levels.

### Concurrent editing

- Re-read immediately before writing and edit individual entries rather than replacing the entire file.
- Respect another agent's claimed work. Add review notes or coordinate a handoff instead of overlapping edits.
- Use a distinct reviewer/batch prefix for new IDs, such as `CA2-001` or `CODE1-001`, after checking both files. `CA1` is reserved for the initial content audit below.
- Preserve attribution, dates, and original findings. Append dated replies under `Discussion / progress`.
- Findings refer to the reviewed snapshot. If another agent has already fixed one, verify and archive it with evidence rather than repeating the work.

### New-item template

```md
### PREFIX-001 — Short, specific finding
- Priority / type: P1 | P2 | P3 / defect | teaching gap | editorial recommendation | source support
- Status: open
- Owner: unassigned
- Reviewer / date: identity / YYYY-MM-DD
- Location: file, chapter, section, figure; line numbers are optional snapshot hints.
- Finding and evidence: What is observed and why it matters to the reader.
- Proposed resolution: A concrete option, not an obligation to accept the reviewer's implementation.
- Acceptance criteria: What would demonstrate that the issue is addressed.
- Discussion / progress: None yet.
```

## Initial audit context — CA1, 2026-10-01

Reviewer: Codex content-audit agent in the user's review thread. This queue records the audit already shared with the user; it does not claim independent review by additional agents.

Reviewed [MANUSCRIPT.md](MANUSCRIPT.md), all 28 chapters and the glossary, and all 28 exported SVG figures. Selected citations were checked against primary/official sources. Representative arithmetic and the displayed SMA, ROC, ATR, VWAP, breadth, and loss-compounding series were recalculated. This was a content/illustration audit, not a general code audit or an exhaustive verification of every claim and URL.

Reviewed manuscript SHA-256: `97b53a8d89c89055caa6bdf2a9b54a113b448dda8d834290c99cb3f074f1f6e6`. The same hash was confirmed when creating this queue. Line numbers below describe that snapshot; chapter and section names are the durable locators.

**Overall assessment:** Credible, intellectually careful first draft. Core calculations and distinctions are generally strong. It teaches skepticism more fully than independent chart analysis. The largest gaps are topic-specific illustrations, guided application, complete worked cases, exercise solutions, and empirical evidence synthesis. It is not yet an exceptional beginner textbook.

**Preserve:** Observation/interpretation/action separation (ch. 1); OHLC sequence ambiguity (ch. 2); swing recognition timing (ch. 5); indicator initialization and formulas (chs. 10–12); relative versus absolute performance (ch. 15); execution uncertainty, costs, and planned versus actual risk; retention of failed, skipped, and ambiguous outcomes. Keep fictional cases clearly labeled and avoid unsupported performance probabilities.

**Suggested order:** Correct CA1-001–008; develop exemplary versions of chapters 2, 9, and 25; strengthen practice and solutions; complete Atlas-20 and the casebook; broaden evidence and historical cases; validate with target readers. Do not increase word count or indicator count for its own sake.

## Recovery handoff — 2026-10-01

The user requested resumption after the prior implementation stopped. `/root` preserved a recovery archive, rebuilt current authoring sources, completed the interrupted Chapter 9 integration, and verified/archived CA1-001–008, CA1-012, and CA1-024. See [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md) for recovered artifacts, verification limits, and the next implementation sequence.

The remaining entries below are reopened for a deliberate next claim; earlier progress notes and authorship are retained. Reopening does not undo the preserved source work or assert that every proposed improvement is still entirely absent. Chapters 1–19 have solutions/practice, and selected empirical/historical additions exist. Chapters 20–28 and whole-book acceptance checks remain the main unfinished scope. No item is marked complete merely because it builds.

## Handoff — claude-code-main, 2026-10-01

This agent claimed CA1-009–011, 013–021, 023 and 025 for the chapters 20–28 revision, then released them unfinished when the usage budget ran out. No authoring or generated files changed. Unreviewed drafts of chapters 24–27 and the drafting brief were supplied in `handoff/README.md`; the original inputs are now preserved in the [handoff archive](REVISION_COMPLETION_20261001.md#handoff-archive). Chapters 20–23, chapter 28, the part 5–6 reviews, and the cross-book review of chapters 1–19 were not started. A target-reader protocol for CA1-026 was added in [READER_PROTOCOL.md](READER_PROTOCOL.md); no reader study has been run. For CA1-022, additional historical cases need a market-data source whose reuse is permitted, and the user has not yet supplied one.

## Completion pass — /root, 2026-10-01

Chapters20–28 and the part5–6 reviews are integrated, with calculations, source support and actual illustrations checked. CA1-020,021 and023 are archived with their complete findings and verification. The remaining whole-book parents retain their original criteria and dated partial-progress records; their claims have been released. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md) for scope, checks, browser limitations, the extra correction rebuild and preserved original handoff inputs.

## Teaching acceptance completion — /root, 2026-10-01

CA1-009–011,013–017 and025 are verified and archived after substantive chapters1–19/parts1–4 review, arithmetic recalculation, actual figure inspection and final reader-edition checks. One shared rebuild. See [TEACHING_ACCEPTANCE_20261001.md](TEACHING_ACCEPTANCE_20261001.md). CA1-018/019 evidence alignment, CA1-022 historical transfer cases and CA1-026 actual reader validation remain open.

## Source audit and recovery completion — /root, 2026-10-02

CA1-018/019 are resolved and archived with their complete findings after original-study/provider passage inspection, glossary support alignment and one coordinated rebuild. Interrupted generated outputs, hidden study/table exports, stale status notes and cached script assets were reconciled. Scope, backup and verification limits: [SOURCE_AUDIT_20261002.md](SOURCE_AUDIT_20261002.md). The two remaining items below are not complete.

## Active findings

### CA1-026 — Validate learning with target readers
- Priority / type: P3 / editorial recommendation
- Status: deferred
- Owner: /root (study preparation, 2026-10-02; actual participation pending)
- Reviewer / date: CA1 / 2026-10-01
- Location: Publication-readiness process after the substantive revisions.
- Finding and evidence: The existing review notes document mathematical and browser checks, but not demonstrated learning by investing-literate beginners. Editorial judgment alone cannot establish that the teaching sequence works for that audience.
- Proposed resolution: Prepare a short reader protocol using unfamiliar charts, calculation tasks, an analysis note, and an evidence-evaluation task. When actual readers are available, record misunderstandings and revise accordingly. Do not fabricate reader participation or treat another model's review as a human learning study.
- Acceptance criteria: A protocol and explicit learning rubric exist; actual reader observations and resulting revisions are recorded before claiming reader validation. If participants are unavailable, keep the remaining study deferred with that reason visible.
- Discussion / progress: /root, 2026-10-02 — [READER_PROTOCOL.md](READER_PROTOCOL.md) supplies a prepared task sequence, learning rubric and revision rule. No human participants are available in this session and no study has been run. Deferred until target readers can participate and actual observations can be recorded; model/editorial checks are not reader validation.
- Preparation completed / 2026-10-02: /root — The user confirmed that readers are unavailable and requested preparation of materials. Added unfamiliar parallel [Form A](reader-study/FORM_A.md)/[Form B](reader-study/FORM_B.md), native candle charts and exact inputs, independently checked numerical [scoring key](reader-study/SCORING_KEY.md), [facilitator run sheet](reader-study/FACILITATOR.md) and empty [results/observation/revision record](READER_RESULTS.md). Both charts were visually inspected at 300/760px; Decimal calculations and chart/table values agree. Record form order, actual reading exposure, timing, independent scorer disagreements and new-reader rechecks. Forms are uncalibrated and the unequal pre/post time allowances limit causal claims. Zero participants or observations are recorded; actual validation remains deferred. See [preparation report](HISTORICAL_AND_READER_PREP_20261002.md).

## Gallery and study-packet completion — /root, 2026-10-02

CA1-022 is verified and archived with its full finding and disposition. CA1-026 has a complete prepared packet; actual reader observations and resulting revisions remain deferred because the user confirmed participants are unavailable. The [completion report](HISTORICAL_AND_READER_PREP_20261002.md) records data/reuse boundaries, arithmetic, actual illustration checks and browser limits. Both coordinated builds belonged to /root; no work or file review by another agent is claimed.

## Reader outcomes to preserve across resolutions

The finished core guide should enable a reader to verify chart settings; describe trend and relevant areas with defensible reasons; reproduce and explain a small set of indicators; separate signals from executable opportunities; calculate size and explain larger-than-planned losses; assess a performance claim against its evidence; and write a coherent analysis another person can follow.

Remaining findings stay visible until their acceptance criteria are verified. Prior to the critical re-audit, twenty-five initial findings had been archived; those records and their later reopening evidence are preserved in the history.

## Critical re-audit — /root, 2026-10-02

This pass audits current content first, then the actual reader interface. New findings use `AUD2`; demonstrated regressions in a previously closed finding reopen its existing ID. Findings are review inputs, not implemented fixes. Detailed scope and evidence are recorded in [AUDIT_20261002.md](AUDIT_20261002.md). CA1-015, CA1-016 and CA1-024 are reopened; their original closure history remains preserved. CA1-026 remains deferred. The UI priorities extend the existing content rubric to loss of access, instructional material or recoverable reader work.

## Critical re-audit implementation completion — /root, 2026-10-02

CA1-015, CA1-016, CA1-024 and AUD2-001–019 are resolved and archived with complete findings, disposition and verification. Content corrections, learner cutoff packets and reader-interface fixes are rebuilt and checked. See [AUDIT_RESOLUTION_20261002.md](AUDIT_RESOLUTION_20261002.md) for arithmetic, actual browser interactions, portable figure inspection, A4 print samples and QA limits. The only remaining active finding is CA1-026, deferred until human readers can participate. No reader observations or independent agent review are claimed.

## Follow-through review — /root, 2026-10-02

The user requested continued substantive work. New evidence reopens AUD2-003 rather than duplicating it; the prior closure remains in history.

## Follow-through implementation completion — /root, 2026-10-02

AUD2-003, CONT3-001 and AUD2-010 are resolved and archived with full findings, reopening evidence and actual verification. See [FOLLOW_THROUGH_20261002.md](FOLLOW_THROUGH_20261002.md). CA1-026 remains deferred for actual human participation. Further editorial work is not contingent on that study.

## Independent-practice implementation completion — /root, 2026-10-02

CA1-015’s residual Chapter 11/16/18 transfer gap is resolved and archived with the full reopening evidence and disposition. Fresh task inputs, worked solutions and optional practice-table support are built and checked. See [PRACTICE_TRANSFER_20261002.md](PRACTICE_TRANSFER_20261002.md) for calculations, primary source inspection, actual browser/packet checks and native preview limitations. CA1-026 remains deferred for human participation; no learner observations or independent agent review are claimed.

## Price-action staging implementation completion — /root, 2026-10-02

AUD2-003’s Chapter 7–9 prospective staging and AUD2-006’s cutoff-search omission are resolved and archived with full findings and verification. See [PRICE_ACTION_STAGING_20261002.md](PRICE_ACTION_STAGING_20261002.md) for teaching changes, actual native viewport checks, chart inspection, focused print samples and their limits. Earlier resolutions and all four existing packets are preserved. CA1-026 remains deferred for human participation; this focused batch does not establish that further editorial work is exhausted.

## Project tracking completion — /root, 2026-10-02

TRACK1-001 is resolved and archived with its full finding and verification. [PROJECT_STATUS.md](PROJECT_STATUS.md) is the current inventory and milestone tracker; [EDITORIAL_ROADMAP.md](EDITORIAL_ROADMAP.md) owns the sequenced remaining work. The read-only `npm run status` command reports live inventory, active findings, roadmap status and checkpoint freshness. Publication acceptance is pending in [PUBLICATION_REVIEW.md](PUBLICATION_REVIEW.md); CA1-026 remains deferred for actual human participation.

## Publication batch 1 completion — /root, 2026-10-02

PUB1-001 and the Chapter 20 CA1-024 / Chapter 21 AUD2-002 reopenings are verified and archived with their full findings, disposition and evidence. [Batch 1](PUBLICATION_BATCH1_20261002.md) accepts current editorial content of Chapters 1, 2, 9, 20 and 21 at pinned fingerprints. Twenty-three chapters and six part reviews remain pending; source/rights release review, broader native browser/print QA and shipping review/version metadata stay on the roadmap. CA1-026 remains deferred for actual human participation.

## Publication batch 2 completion — /root, 2026-10-02

AUD2-018’s Chapter 5 label-occlusion reopening and PUB2-001’s Osler source locator are verified and archived with their full findings and evidence. [Batch 2](PUBLICATION_BATCH2_20261002.md) accepts Chapters 3–6 and Part 1; current totals are 9/28 chapters and 1/6 part reviews. Nineteen chapters and five part reviews remain pending. Native printer and broader release QA, source/rights dispositions and shipping metadata remain on the roadmap. CA1-026 remains deferred for actual human participation.

## Publication batch 3 completion — /root, 2026-10-03

PUB3-001 source locators and PUB3-002 mirror wording are verified and archived with full findings and dispositions. [Batch 3](PUBLICATION_BATCH3_20261003.md) accepts Chapters 7–8 and Part 2: totals 11/28 chapters and 2/6 part reviews. Seventeen chapters and four part reviews remain pending. Native printer, whole-edition access/rights review and shipping metadata remain on the roadmap; NBER retrieval follow-up and browser/frame coverage limits are recorded. CA1-026 remains deferred for actual human participation.

## Publication batch 4 review — claude-code-main, 2026-10-03

ROAD-002 batch 4 claim: Chapters 10–14 and Part 3. Findings below come from a full read of the authoring JSON, 552 independent Fraction/Decimal comparisons, primary-source page checks and 260/760px rasters of all nine Part 3 figures. PUB4-001–008 are claimed for this batch; PUB4-009 is outside its scope and left open for Chapter 26's publication batch.

### Batch 4 completion — claude-code-main, 2026-10-03

PUB4-001–008 are resolved and archived with their full findings and verification. [Batch 4](PUBLICATION_BATCH4_20261003.md) accepts Chapters 10–14 and Part 3, and re-accepts Chapter 3 and Part 1 at their new fingerprints. PUB4-009 below stays open and unclaimed for Chapter 26's batch. CA1-026 remains deferred.

## Alpha release preparation — claude-code-alpha, 2026-10-11

The user requested a public alpha on GitHub with free static hosting. PUB4-009 is resolved and archived. ALPHA1-001 was found while verifying it and was left open at the alpha checkpoint; the renderer batch below subsequently resolved it. CA1-026 remains deferred.

## Publication batch 5 — claude-code-alpha, 2026-10-11

ROAD-002 batch 5: Chapters 15–19 and Part 4. PUB5-001–011 were found by five read-only reviewer agents and by claude-code-alpha's figure pass; all were verified against current files, implemented and archived with full findings in the [resolution history](FEEDBACK_RESOLVED.md). [Batch 5](PUBLICATION_BATCH5_20261011.md) accepts Chapters 15–19 and Part 4. PUB5-012 and PUB5-013 were left open at the batch-5 checkpoint; the renderer batch below subsequently resolved them with ALPHA1-001. CA1-026 remains deferred.

## Renderer batch completion — /root, 2026-10-11

ALPHA1-001, PUB5-012 and PUB5-013 are resolved and archived with their full findings, dispositions and verification. [The batch report](RENDERER_BATCH_20261011.md) records all current chart panels at four widths, portable figure screenshots, native light/dark checks, reader integration and an identical isolated rebuild. Accepted chapters’ affected figures were rechecked; totals remain 21/28 chapters and 4/6 part reviews. CA1-026 remains deferred; ROAD-002 Chapters 22–28, broader release QA, source/rights review and metadata remain pending. Changes are local; no push or deployment.

## Publication batch 6 review — /root, 2026-10-11

Claimed ROAD-002 scope: Chapters 22–23 and Part 5. The findings reused CA1-015 for worked-solution/unfamiliar-practice criteria and added PUB6-001 for the chart defect. Both are now archived; earlier fixes remain preserved.

## Publication batch 6 completion — /root, 2026-10-11

Reopened CA1-015 and PUB6-001 are verified and archived with their full findings and dispositions. [Batch 6](PUBLICATION_BATCH6_20261011.md) accepts Chapters 22–23 and Part 5 at current fingerprints, bringing totals to 23/28 chapters and 5/6 part reviews. Chapters 24–28 and Part 6 remain pending. Source/rights release review, broader browser/printer QA and metadata remain on the roadmap. CA1-026 remains deferred for actual readers. Changes are local and unpushed.

## Publication batch 7 handoff completion — /root, 2026-10-12

The Chapter 24 AUD2-002 reopening and PUB7-001–010 are verified and archived with full findings, dispositions and evidence. [Batch 7](PUBLICATION_BATCH7_20261012.md) completes scoped editorial acceptance of all 28 chapters and six part reviews, including the changed earlier-chapter dependencies. PUB7-011 below and CA1-026 remain deferred. Release source/rights review, native printer/broader browser QA and shipping metadata remain pending. Changes are local and unpushed.


## Release-readiness completion — /root, 2026-10-12

PUB7-011 and RELEASE1-001–003 are verified and archived with full findings, dispositions and boundaries. [The report](RELEASE_READINESS_20261012.md) completes ROAD-003 access/support/reuse dispositions and ROAD-006 metadata/invalidation. ROAD-004 native print/desktop coverage remains in progress; ROAD-007 has a local preflight candidate but no new deployment. CA1-026 is the only active finding, deferred until actual readers participate. Original reader storage was restored. Changes remain local and unpushed.

## Native print slice — claude-code-print, 2026-10-13

At the user's request, took the ROAD-004 Chapter 7–8 learner/answer slice. PRINT1-001 (multi-panel figures shrunk to 30–99% in print) and PRINT1-002 (split headings/stranded labels) were found in actual native exports, fixed in the reader print path only and archived with verification. Four current native PDFs are retained; the Chapter 6 pair is superseded by the layout change. The agent cannot operate the modal print dialog, so the user completed each Save as PDF. CA1-026 remains deferred. Changes are local and unpushed.
