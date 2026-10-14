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

A follow-up headless print sweep of all 28 chapters and six part reviews (non-native, [record](release-readiness-assets/headless-print-sweep.json)) found PRINT1-003: part-review solutions could not be printed. It is fixed and archived. No other print defects were flagged.

## Wide, zoom, file:// and accessibility-tree slice — claude-code-qa, 2026-10-13

At the user's request, took the ROAD-004 checks that need no human print-dialog step. Native 1440/1920px, 200% and 400% zoom-equivalent sweeps of all 41 routes; offline file:// reading of the built site and of the extracted release ZIP (headless Chrome); and an automated accessibility-tree audit (not a screen reader). The audit found QA1-001 (glossary heading skip); the screenshot review found QA1-002 (glossary term names at link size). Both are fixed and archived. [Record](release-readiness-assets/wide-zoom-file-a11y-checks.json). The release preflight was rebuilt for the current files. CA1-026 remains deferred. Changes are local and unpushed.

A follow-up contrast and text-size audit of both themes found QA1-003 (the "A worked example" label at 8px in every chapter). It is fixed and archived. There were no contrast failures. A new [verification checkpoint](PROJECT_CHECKPOINT_20261013_152853.json) pins the current files after the full check suite.

## Native print QA completion — /root, 2026-10-13

[Completion report](NATIVE_PRINT_COMPLETION_20261013.md): 14 new native PDFs, 237 rendered pages visually inspected, complete remaining ROAD-004 print coverage. No new findings; PRINT1-001–003 received additional native verification recorded in the resolution history. Open in Preview → Save As enabled autonomous dialog completion. Task preview/PDF windows closed at the user's request. Shipping code/content unchanged and `check:reviews` passes. ROAD-007 release finalization remains pending; CA1-026 stays deferred for actual readers. No push or deployment.

## Mobile header correction — /root, 2026-10-13

MOBILE2-001 is resolved locally and archived with the full user finding, resolution and [native browser evidence](mobile-header-assets/browser-checks.json). Mobile branding/home access restored; 36 layout cases and actual header-control actions pass. Content/renderer/app unchanged; current ZIP rebuilt. Preview closed. Physical phone recheck and public deployment not claimed; CA1-026 remains deferred.

## Latest alpha publication — /root, 2026-10-13

The user explicitly requested the latest push. 0.4.1-alpha.1 is deployed to the existing GitHub Pages destination: [release notes](RELEASE_0_4_1_ALPHA_1.md), [successful run 38447943104](https://github.com/OkillA/market-atlas/actions/runs/38447943104), [live files/branding verification](release-readiness-assets/deployment-20261013.json). MOBILE2-001 and PRINT1-001–003 are now included publicly. No new finding; CA1-026 remains deferred for actual readers. Earlier local-only reports retain their dated historical scope.

## Mobile drawer correction — /root, 2026-10-13

MOBILE2-002 is resolved and archived with [48 open-drawer viewport/theme/scroll cases](mobile-header-assets/drawer-checks.json). Drawer starts below the header; all items are scrollable/reachable, including short viewports. Only screen CSS/cache key changed; content/print scope retained. Published as `c3a5cac` via [successful Pages run 38463790656](https://github.com/OkillA/market-atlas/actions/runs/38463790656); [all six hosted files match](mobile-header-assets/drawer-deployment.json). Preview closed; CA1-026 remains deferred.

## Simulated beginner read — READ1, 2026-10-13

At the user's request (human readers unavailable), six AI agents each read one part of [MANUSCRIPT.md](MANUSCRIPT.md) in order, playing an investing-literate chart beginner: every figure rendered and viewed, every exercise attempted before its solution, every relied-on number recalculated. No arithmetic or factual errors were found. This is **AI editorial input, not reader validation**; it does not advance CA1-026. Findings were consolidated by `/root` and the central claims spot-checked against current files (figure SVG text, manuscript lines); priorities are the content rubric above. Line numbers are hints to the manuscript snapshot of 2026-10-13. Cross-cutting issues are single items with per-location lists; claim and split as needed.

**Strengths the readers asked to preserve:** one small checkable dataset carried through text/table/figure/practice in each chapter; near-miss pairs that change one input (Ch 7, Ch 8); cutoff/recognition-time tables (Ch 5, 8, 17); wrong-option explanations in every knowledge check; Ch 2 two-routes-same-candle; Ch 20 common-shock example; Ch 24 "four implementations of one sentence"; Ch 25 same-trades-two-orders; Ch 26 reproducible Atlas-20 ledger; independent practices are fresh and well judged.

### READ1-004 — Many exercises repeat a worked example or prose answer immediately above them
- Priority / type: P2 / teaching gap (practice)
- Status: open
- Owner: unassigned
- Reviewer / date: READ1 parts 3, 5, 6 / 2026-10-13
- Location: "Exercise" after "Worked example" with identical numbers in Ch 10 (~2055→2059), 11 (~2246→2250), 12 (~2427→2431), 13 (~2598→2602), 14 (~2763→2767). Guided/independent tasks answered in prose: Ch 11 RSI companion (~2178 + table), Ch 12 independent downside candle (~2384), Ch 13 OBV guided (table), Ch 14 guided 50% (~2753), Ch 21 halt independent (inside branch worked at ~4011), Ch 26 Exercise (~5480) repeats the session 4–5 worksheet (~5289), Ch 28 GAPS Exercise (~6204; worked at ~5916, ~6200 and in the quiz) and RIVR guided (~6217).
- Finding and evidence: The reader could only copy, not attempt; only independent practices tested them. Not covered by earlier CA1-015 work, which concerned missing/fresh independent tasks.
- Proposed resolution: Change inputs (session, prices or fee) in either the worked example or the exercise; remove prose spoilers of guided/independent answers; replace Ch 26/28 duplicates with variants (e.g. sessions 6–7; GAPS at a different fee).
- Acceptance criteria: No exercise or guided task has its answer stated on the page before its solution; changed tasks recalculated and solutions verified; affected chapter acceptance rechecked.
- Discussion / progress: None yet.

### READ1-006 — Terms used before they are taught
- Priority / type: P2 / teaching gap (halt, support); remainder P3
- Status: open
- Owner: unassigned
- Reviewer / date: READ1 all parts / 2026-10-13
- Location and term: **halt / stale mark** — Ch 21 plan table (~3979), "Resolve the awkward branches" (~4009), halt practice (~4060); explained only at ~5176 (Ch 26). **support/zone/visit** — Ch 6 first-pass packet (~993) precedes the definition (~1023). Ch 1: gap, `floor(…)`, "expectancy", sell stop purpose (~66–92). Ch 3: "covering a short" (~394). Ch 4 / Part 1 review: trendline (~588), breakout (~619, ~644), support-break (~754 solution). Ch 9: tape (~1810). Ch 11: divergence (~2205; clash with MACD's "Divergence"), futures. Ch 10: DJIA, adverse selection (~2053). Ch 15: winner-minus-loser, formation period (~2978). Ch 16: issues. Ch 17: repaint (~3315; not in glossary). Ch 19: slippage (~3653), print (~3582). Ch 22: "short trade" meaning short-term (~4167) while elsewhere it means short-selling (~1454, ~1776). Ch 3: relative volume never stated as a formula (~398).
- Finding and evidence: Each was confirmed absent before its location or only in the glossary. Halt drives a whole section and exercise the reader solved only by pattern-matching.
- Proposed resolution: Brief parenthetical gloss or plain-word substitute at first use; move Ch 6's two-sentence support/resistance definition before the packet; "short-term trade" in Ch 22; add repaint to glossary.
- Acceptance criteria: Each listed term is defined or replaced at or before first use (checked by search of earlier text); Part 1 review solution no longer relies on an untaught term.
- Discussion / progress: None yet.

### READ1-007 — Dense blocks and repeated caveats bury the main point
- Priority / type: P2 / editorial recommendation (pacing)
- Status: open
- Owner: unassigned
- Reviewer / date: READ1 parts 1, 2, 5, 6 / 2026-10-13
- Location: Ch 1 execution/loss-budget primer and evidence pointer (~66–108); Ch 9 "Freeze a small plan…" (~1778–1786); Ch 21 BRDG-P1 table rows "Exit priority", "Entry-bar policy", "Partial / operational policy" (~3966–3981; "earlier holdings" unclear) despite promising a beginner can process it; Ch 24 v1-b rule specification as one ~350-word paragraph (~4583); Ch 28 cold open with a new gate rule and CC0/provenance text before chapter framing (~5824–5830) and compressed shorthand ("C50.40", "1R100", "R4") in cases (~5891–5952); BRDG −$105/−1.05R/$19,895 reconciliation repeated ~8 times across Ch 21–23; per-paragraph "fictional / teaching assumption / not a sample" disclaimers across Ch 6–9, 20–23.
- Finding and evidence: Readers reported skimming hedges and losing the lesson (e.g. that a valid signal can still be a skip). Each caveat is individually accurate; the issue is accumulation.
- Proposed resolution: Rule tables instead of rule paragraphs (Ch 24 like Ch 26; split Ch 21 table into main-path and branch rules); one disclaimer box per chapter; framing sentences before Ch 28's packet with provenance moved into the continuation; spell out shorthand at first use; trim one or two BRDG repeats. Preserve accuracy and the no-unsupported-claims rule; do not raise word count.
- Acceptance criteria: Listed passages restructured without losing any rule; word count not increased overall; affected chapter acceptance rechecked.
- Discussion / progress: None yet.

### READ1-010 — Smaller figure-reading snags
- Priority / type: P3 / teaching gap (figures)
- Status: open
- Owner: unassigned
- Reviewer / date: READ1 parts 1–4 / 2026-10-13
- Location: Ch 3 volume.svg (price and volume x-positions misaligned; outcome promises aligned panels), volume-2.svg (x labels skip D2/D5); Ch 8 chart-patterns-2.svg (symmetrical triangle drawn with two horizontal lines, looks like the rectangle); Ch 13 volume-tools-3.svg (OBV "figure" is the table redrawn; no OBV line); Ch 10 moving-averages.svg range panel marks 3 of 7 side-switches; Ch 15 relative-strength.svg (gold dotted/green solid mean different things in each panel); Ch 16 breadth.svg (daily "Net −2/+2" labels on cumulative points at −3/−1).
- Proposed resolution: Shared x-positions; label every column on short series; faint descriptive converging lines for triangles; plot an OBV line; neutral grey labelled baseline; "daily net → cumulative" labels.
- Acceptance criteria: Each listed figure inspected after rebuild; the stated misreading is no longer invited.
- Discussion / progress: /root, 2026-10-13 — The READ1 figure batch now labels every column of volume-2 at 760px (D2/D5 restored) and keeps "Today" at 320px; the other listed items are untouched. Added from the batch sweep (pre-existing, also in earlier exports): at 320px the Ch 6 construction panel (support-resistance) and Ch 27 range figure (classical-frameworks-3) have zone-name text crossed by the price line and label boxes interrupting shaded zones. Zone labels could move to the key at compact widths. See [figure-sweep.json](read1-assets/figure-sweep.json).

### READ1 figure batch completion — /root, 2026-10-13

READ1-001, 002, 003 and 008 are resolved and archived with full findings and verification ([report](READ1_FIGURES_20261013.md)). Round axis values, labelled reference levels on 39 lines, profile orientation and the Chapter 7 wording are rebuilt and checked; all 28 chapters re-accepted with a figure recheck. READ1-004–007 and 009–012 remain open and unclaimed. CA1-026 remains deferred. Changes are local and unpushed.

### READ1 wording batch completion — claude-code-read1b, 2026-10-14

READ1-005 (plain-language R) and READ1-009 (Chapter 11 MACD indexing/order/referent) are resolved and archived with full findings and verification ([report](READ1_WORDING_20261014.md)). Chapters 9, 11, 18 and 20 re-accepted; Parts 2–5 for dependency only. READ1-004, 006, 007 and 010–012 remain open and unclaimed. CA1-026 remains deferred. Changes are local and unpushed.

Slice 2, same day: READ1-011 (Part 4 relative-strength task) and READ1-012 (local snags; Ch 26 reveal kept with evidence) are resolved and archived. READ1-004, 006, 007 and 010 remain open and unclaimed.
