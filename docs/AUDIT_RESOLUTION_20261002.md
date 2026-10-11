# Critical re-audit resolution — 2026-10-02

Implemented and verified the 22 actionable findings in [AUDIT_20261002.md](AUDIT_20261002.md): reopened CA1-015, CA1-016, CA1-024 and AUD2-001–019. The complete findings, acceptance criteria and closure evidence are appended to [FEEDBACK_RESOLVED.md](FEEDBACK_RESOLVED.md). CA1-026 remains deferred: its prepared protocol exists, but no human participants or learning observations are available. This pass does not establish reader learning or publication readiness.

All work and coordinated rebuilds in this pass were performed by `/root`. No independent agent review is claimed. Authoring changes are in the four content JSON files; manuscript, browser book and 68 SVGs were rebuilt from them. Initial affected-file copies are preserved in `/tmp/market-atlas-audit-before/` on this machine. The workspace has no Git metadata, so no commit or pull request was created.

| Finding | Resolution and substantive verification |
| --- | --- |
| CA1-015 | Chapter 6 guided resistance solution now gives 54.90–55.30, threshold 55.50, and visit / edge crossing / buffered break. Independent practice uses 72.10–72.60 with threshold 72.85 and an equality case. Fresh independent inputs also replace answer reuse in Chapters 10, 13, 17 and 19. Reviewed 28 chapter exercise/solution pairs, 63 practice pairs and 18 part-review tasks; no further mismatches identified. Decimal calculations verify the new means, VWAP, fill value and R examples. |
| CA1-016 | Varied correct positions across the book: 9 first, 10 second, 9 third, maximum repeated-position run two. Original correct-answer text, distractors and option-specific feedback mappings are preserved. Exercised all 84 option-feedback interactions in the native browser. |
| CA1-024 | Isolated R glossary entry states net P&L after costs divided by frozen actual-filled-position price-risk; costs stay outside that denominator. An unfilled order has no position R. Recalculated cost-inclusive and partial-fill examples and checked the live deep-linked definition. |
| AUD2-001 | Historical MSFT boundary 51.82353 rounds to 51.82; open 51.830 remains inside. A separately labeled fictional 51.826 boundary / 51.828 open demonstrates a change under nearest-cent rounding. Historical inputs and classification remain intact. |
| AUD2-002 | Entry E1 counts as holding session one; scheduled exit is E10 close. Earnings horizon is the planned window. After a halt spanning the deadline, opening gap exits take precedence, otherwise the first resumed open executes the overdue time exit before intraday tests. A meaningful simulator regression exercises both gap and overdue branches; ordinary Atlas-20 results remain unchanged. |
| AUD2-003 | Chapters 6, 22 and 28 begin with cutoff-only learner packets, followed by an explicit continuation reveal. Chapter 22 uses a fresh LARK path rather than pretending the already-discussed BRDG failure is prospective. Chapter 28 shows four six-row context/cutoff tables with neutral headings and upfront selection/adjustment limits; complete gallery, ledgers and provenance remain behind the reveal. Native `checkVisibility` confirms zero visible outcome headings before reveal in all three chapters. Print cutoff and continuation are separated by page boundaries. |
| AUD2-004 | Keyed legend swatches match series; solid/dashed/dotted patterns distinguish overlapping averages without relying solely on hue. Inspected compact and wide portable averages and multiseries figures; native SVG geometry passes. |
| AUD2-005 | Skip link moves focus to current main content without changing the route. Actual native keyboard Enter/Tab checks pass on home, Chapter 2 and glossary. |
| AUD2-006 | Search covers tables, examples, figures, tasks/solutions, quizzes, part reviews, glossary and evidence/study fields. Results disclose counts, show snippets and retain all matches. Live queries find 2016-03-03 (2), 9.29% (4), fresh fill value 32.08 (1), and broad risk (100 accessible results). |
| AUD2-007–008 | Sticky compact contents/search controls work from the middle of the long casebook at 320/390/768px. Desktop contents is bounded to the viewport with internal scrolling; last link is reachable at an 800px laptop height. Dialog navigation focuses the destination. |
| AUD2-009 | Essential tables have full-height document flow, readable captions and a visible horizontal-scroll hint. A table workspace supplies a large scrolling comparison area with sticky headers. All 36 ledger rows and visible headers checked at 320/390px; desktop remains usable. |
| AUD2-010 | Explicit learner/answer print buttons preserve full tables and static A/B/C quiz choices. Answer policy is stated on each printout; solutions/quiz answers are omitted or included accordingly. Print uses a fixed wide figure layout and explicit light palette, restoring screen disclosures/colors afterward. Actual native print DOM/CSS was rendered to A4 PDFs and all 62 pages inspected via contact sheets. Every one of the 36 calendar-ledger rows matches authoring text. |
| AUD2-011–012 | Darkened light muted/gold/rust tokens; harmonized SVG export palette. Lowest checked light normal-text contrast is 5.724:1 and gold series contrast 4.070:1; dark counterparts pass. Essential supporting text is 13–14px and SVG labels at least 12px in their authored viewboxes, with wrapping rather than shrinking compact labels. Inspected supporting material and affected exported labels. |
| AUD2-013 | Import bounds follow known chapter count and permitted UTF-16 note lengths, allowing worst-case JSON escaping. Validate before mutation and reject invalid recognized notes explicitly. Actual empty-session restore recovers all 28 maximum-length multilingual notes: mixed Unicode export 2,504,745 bytes; Chinese export 4,200,921 bytes. Small notebook round-trip also preserves notes/progress/bookmarks, and reading positions survive import. Tests used isolated localhost:4174 storage. |
| AUD2-014–016 | Primary evidence navigation, contextual chapter links, appendix contents/filter and stable section/term/record routes support precise references. Fresh-document links focus actual content, all study fields remain available, and evidence IDs are unique. Saved section positions power Continue reading; same-chapter back/forward preserves notes and quiz state. Explicit Start at beginning remains available. |
| AUD2-017 | Labels say “About N min of prose · practice takes additional time.” The estimate is not claimed as measured learning-session time; actual timing remains part of CA1-026. |
| AUD2-018 | Flow titles and long axis labels wrap by measured browser text width (conservative export fallback); resulting heights expand. Compact candle OHLC values stack. Native checks cover all 68 figures at 320/390/768/1280px, with no text outside SVG bounds or page-width overflow. Visually inspected affected price-branch, research-timeline, distribution, averages and candle exports at compact/wide sizes. |
| AUD2-019 | Mapped candle, trend, average and risk chapters link to the relevant experiment; other chapters use a general experiment label. Native average and risk destinations select matching controls. |

Verification evidence: [content calculations](audit-resolution-assets/content-checks.json), [native browser measurements/interactions](audit-resolution-assets/browser-checks.json), [print checks](audit-resolution-assets/print-checks.json), and affected PNGs/contact sheets in [audit-resolution-assets](audit-resolution-assets/). Representative print samples are retained there solely for QA: Chapter 6 learner/answer and Chapter 28 learner.

Passed the documented checks after the final changes:

```sh
node scripts/verify-early-chapters.cjs
node scripts/verify-revision.cjs
node scripts/verify-historical.cjs
npm run build:content
npm run check
node scripts/check-content.cjs --strict-revision
node --check app.js
node --check figure-renderer.js
```

These verify 524 early arithmetic comparisons, later worked accounting/statistics/Atlas-20 branches, all 36 archived historical windows and source hashes, valid authoring/reference structure, and JavaScript syntax. They supplement the substantive question/solution review and visual inspection; they do not verify every empirical claim anew.

QA limits: browser measurements and interactions used the product-native T3 preview. The 768px pass used a same-origin iframe within that preview; screenshot capture remained unreliable, so new native screenshots are not claimed. Portable figures were visually inspected as rendered PNGs. Print PDFs used WeasyPrint against the actual native-browser print DOM and project CSS; native browser printer pagination was not available for comparison. All sampled print pages retain material and have no out-of-page text, but pagination may differ by browser/printer. Human learning, unfamiliar-chart transfer and reading times still require actual participants under CA1-026.
