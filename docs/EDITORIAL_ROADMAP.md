# Editorial roadmap

Updated **2026-10-12** by `/root` after the release-readiness batch. Start with [PROJECT_STATUS.md](PROJECT_STATUS.md) for the current inventory and completed milestones. This roadmap owns future work packages; [FEEDBACK.md](FEEDBACK.md) owns demonstrated defects and actionable editorial findings. Historical reports remain evidence for their original snapshots.

The complete 28-chapter revision, six part reviews, selected-source synthesis, historical gallery and recorded re-audit fixes are complete within their documented scope. All 28 chapters and six part reviews now have scoped editorial acceptance. Source/access/reuse dispositions and accurate review/version metadata are complete; native print/desktop QA and reviewed-release finalization remain. Human-reader participation remains deferred, and independent editorial work can continue.

## Work order and ownership

Claim a manageable package by setting its owner and status before implementation. Record dated progress and evidence. Use `ready`, `in_progress`, `planned`, `deferred` and `done`; `ready` means it can start, while `planned` has an unmet dependency or unresolved scope. Roadmap IDs describe work packages, not separate feedback findings. Record any discovered defect in the feedback workflow and link its ID here.

### ROAD-001 — Establish reliable project tracking

- Status / owner: done / /root, 2026-10-02.
- Result: canonical status page, evidence-backed milestones, live read-only inventory, pinned verification checkpoint and chapter publication-review ledger.
- Verification: current counts agree with the generated book; documented verifiers and normal/strict checks pass; isolated build matches all 74 outputs. TRACK1-001 preserves the full finding and closure evidence.

### ROAD-002 — Complete chapter publication acceptance

- Status / owner: done / /root, 2026-10-12 (batch 7 completion; implementation and initial reviewers inherited from claude-code-pub7).
- Preparation: [PUBLICATION_REVIEW.md](PUBLICATION_REVIEW.md) contains all 28 chapters with inherited evidence and current fingerprints. All 28 chapters and all six part reviews are accepted for current scoped editorial content. Release QA and shipping metadata remain separate gates.
- Dependencies: none. Existing revision evidence is available.
- Completion: [Batch 7](PUBLICATION_BATCH7_20261012.md) accepts Chapters 24–28/Part 6, rechecks changed earlier-chapter figures and re-accepts Chapters 6–8/10 plus Parts 2–3. All cumulative tasks, the unchanged compiled glossary and cross-links are covered. PUB7-011 is explicitly deferred for optional literature review; essential recorded batch findings are resolved.
- Work: review connected prose, unnecessary repetition, terms, exact definitions, information timing, claim support, counterexamples, unfamiliar task inputs and complete worked answers. Inspect the actual affected figures at compact and wide widths. Preserve the book's observation/interpretation/action distinction and honest execution/evidence limits.
- Exit criteria: each chapter has a dated reviewer, current content fingerprint, checked scope, evidence links, disposition and unresolved findings. All discovered essential defects have verified resolutions or explicit deferred treatment; each of the six part reviews is covered. A previous schema pass alone cannot fill the ledger.
- Batch 1 progress / 2026-10-02: /root completed [batch 1](PUBLICATION_BATCH1_20261002.md): 5/28 chapters accepted at current fingerprints. PUB1-001 and reopened Chapter 20 CA1-024 / Chapter 21 AUD2-002 are resolved. Evidence covers prose, source passages, independent calculations, actual compact/wide rasters and native browser content/keyboard checks; native print and human validation remain pending. Claim released for the uncompleted remainder.

- Batch 2 progress / 2026-10-02: /root completed [Chapters 3–6 and Part 1](PUBLICATION_BATCH2_20261002.md): totals 9/28 chapters and 1/6 part reviews accepted. Reopened AUD2-018 compact-chart occlusion and PUB2-001 source locator are corrected and verified. Phone-width content checks used native child frames after top-level resize timeouts; native printer and human validation remain pending. Remaining claim released.

- Batch 3 progress / 2026-10-03: /root completed [Chapters 7–8 and Part 2](PUBLICATION_BATCH3_20261003.md): totals 11/28 chapters and 2/6 part reviews accepted. PUB3-001 source locators and PUB3-002 mirror wording corrected and verified. All nine prior chapter acceptances and Part 1 remain unchanged. Native 390px viewport and 320/1280px child-frame checks, actual figures, arithmetic and manuscript pass; native printer/human validation remain pending. Remaining claim released.

- Batch 4 progress / 2026-10-03: claude-code-main completed [Chapters 10–14 and Part 3](PUBLICATION_BATCH4_20261003.md): totals 16/28 chapters and 3/6 part reviews. PUB4-001–008 resolved; that includes a shared-renderer bar-axis floor (PUB4-005) and a Chapter 3 compact-label fix (PUB4-006), with Chapter 3 and Part 1 re-accepted at new fingerprints. PUB4-009 (Chapter 26 compact labels) is open. Native top-level 1280/390/320px DOM checks; no printer or screenshot evidence. Remaining claim released.

- Batch 5 progress / 2026-10-11: claude-code-alpha completed [Chapters 15–19 and Part 4](PUBLICATION_BATCH5_20261011.md): totals 21/28 chapters and 4/6 part reviews. PUB5-001–011 resolved (five P2 teaching fixes, compact-label fixes and source/locator corrections); PUB5-012/013 open renderer residuals. Reviewer agents did the full reads, 1,069 comparisons and 34 source checks; the owner verified each finding. Native 1280/390/320px DOM checks; no printer output. Remaining claim released.

- Renderer progress / 2026-10-11: /root completed the [shared-renderer correction batch](RENDERER_BATCH_20261011.md): ALPHA1-001, PUB5-012 and PUB5-013 resolved; all 26 changed panels inspected at 260/760px, all chart panels checked at four widths, native light/dark and nine reader-route checks passed. Chapter 16 and Part 4 re-accepted for the count-axis flag; no new chapter acceptances. Totals remain 21/28 and 4/6. Chapters 22–28 and Parts 5–6 remain ready/unassigned for full review.

- Batch 6 progress / 2026-10-11: /root completed [Chapters 22–23 and Part 5](PUBLICATION_BATCH6_20261011.md): totals 23/28 chapters and 5/6 part reviews. Reopened CA1-015 resolves fresh journal transfer and complete execution/cancellation inputs; PUB6-001 resolves path occlusion. All earlier chapter/part fingerprints remain unchanged. Native 1280/390px and 320px child-frame DOM checks; actual portable rasters; no native printer pagination or human observations. Remaining claim released.

- Batch 7 progress / 2026-10-12: /root completed the [handoff](PUBLICATION_BATCH7_20261012.md): totals **28/28 chapters and 6/6 part reviews**. AUD2-002 reopening and PUB7-001–010 are archived with full findings and final evidence. Independent reproduction: 3,885 comparisons, zero mismatches; all documented verifiers/checks pass; 74 isolated build outputs match; 42 actual compact/wide figure pairs and six panel closeups inspected; 18 native top-level route cases at 320/390/1280 and 568 light/dark SVG fixtures. Native print policy and two focused Enter activations are checked, without printer pagination, screenshot or human-study claims. PUB7-011 and CA1-026 remain deferred. Changes are local and unpushed.

### ROAD-003 — Finish source-access and data-rights release review

- Status / owner: done / /root, 2026-10-12.
- Dependencies: none; share findings with ROAD-002 as they arise.
- Access follow-up / 2026-10-03: Batch 3 could inspect the author-hosted original Lo/Mamaysky/Wang paper, but NBER w7613 full-page retrieval failed and its PDF returned 403. Recheck NBER access during the full inventory; this retrieval limitation does not invalidate the supported original-study claim. See [source record](publication-batch3-assets/source-checks.json).
- Work: cover all 75 current source entries, grouping duplicate URLs. Record access method/date and the exact passage supporting each material release claim. Retain earlier passage checks when still applicable; do not reset every check date after a successful fetch. Separate unavailable retrieval, unsupported claims and limited empirical transfer. Recheck historical depositor permission, upstream limits, adjustment/session/time-zone disclosures and systematic selection records.
- Exit criteria: every source has a current access disposition and claim-support locator or explicit limitation; historical reuse/convention decisions are documented; any resulting fixes are rebuilt and substantively verified. Selected-source review and permission declarations retain their actual limits.

- Completion / 2026-10-12: [Release-readiness batch](RELEASE_READINESS_20261012.md) records 75 entries/72 URLs, 140 dated support records plus explicit bibliographic limits, all access/reuse dispositions, original dates retained, bounded historical permission/convention decisions, and PUB7-011 full-author-manuscript review. No chain-of-title or exhaustive new page audit is claimed.

### ROAD-004 — Complete native browser and print release QA

- Status / owner: in_progress / /root, 2026-10-12 (release-readiness batch: broader native reader QA and printer capability investigation).
- Claim / 2026-10-13: claude-code-print, at the user's request, takes the Chapter 7–8 learner/answer native PDF slice (4 of the 12 pending PDFs). /root's recorded progress and remaining scope are preserved; Chapters 9/22/26/28 and the desktop/input/offline checks stay with the existing owner. Attempt / 2026-10-13: the current Chapter 7 learner print opened the native dialog from the T3 Code preview (2 cutoff tables present), but the agent cannot drive the dialog: preview automation stalls while it is modal and macOS System Events scripting timed out. No PDF produced; nothing counted as evidence. Needs a human to complete Save as PDF, or a different print engine accepted as non-native evidence.
- Dependencies: can start now; rerun affected cases after later content or interface changes.
- Work: use the product-native collaborative browser for representative 320/390/768/1280px reading, keyboard access, contents/deep links, search, notebook backup/restore and closed/revealed packets. Check light/dark figures and complete data-table access. Capture native browser printer output for learner and answer editions of Chapters 6–9, 22, 26 and 28; verify complete inputs, quiz choices, solution policy and continuation boundaries. Sample ordinary chapters and part reviews too.
- Exit criteria: retain actual browser/print artifacts and a coverage matrix identifying platform, viewport, print engine, checked content and unresolved gaps. Separate earlier WeasyPrint samples from native printer results. Check factual illustration labels and complete material, not only geometry or lack of runtime errors.

- Progress / 2026-10-12: [Release-readiness batch](RELEASE_READINESS_20261012.md) retains 21 native packet cases at 320/390/768, 30 broader routes at 320/768, search/contents/workspace/notebook checks, final contents child frames at 390/768/1280, and three native PDFs. Only Chapter 6’s learner/answer pair is current; Chapter 7’s learner PDF predates the new flow table. Resumption: current Chapter 7–9/22/26/28 pairs (12 PDFs), ordinary/part-review samples, and remaining native desktop/pointer/keyboard/file:// coverage. Resize/Enter/snapshot/save limitations are recorded; incomplete attempts are not acceptance.

- Progress / 2026-10-13: claude-code-print — current native Chapter 7 and 8 learner/answer PDFs (15/15/25/25 pages) inspected page by page and retained in [the coverage record](release-readiness-assets/native-print-checks.json). The exports exposed PRINT1-001/002 (print-only layout fixes, archived); the Chapter 6 pair is now superseded. Slice complete and claim released. Remaining: Chapter 6 re-export, Chapter 9/22/26/28 pairs (10 PDFs), ordinary/part-review samples, desktop/input/file:// checks. The local 0.4.1-alpha.1 ZIP/preflight predates the app.js/styles.css change and must be rebuilt before release (ROAD-007).
- Headless sweep / 2026-10-13: claude-code-print — non-native headless Chrome print of all 28 chapters (both editions) and six part reviews, with [automated checks](release-readiness-assets/headless-print-sweep.json); found and fixed PRINT1-003 (part reviews now print task and solution editions). This does not satisfy the native-printer exit criteria. The native part-review sample should now cover both editions.

### ROAD-005 — Run human reader validation

- Status / owner: deferred / /root for completed preparation; facilitator unassigned.
- Related feedback: CA1-026; it stays in the active queue.
- Dependency / resumption condition: actual investing-literate beginners become available. The user previously confirmed participants are unavailable.
- Preparation: [protocol](READER_PROTOCOL.md), unfamiliar A/B forms, scoring key and facilitator run sheet are ready; [results](READER_RESULTS.md) contains zero participants and observations.
- Exit criteria: actual observations and two-scorer reconciliations are recorded; misunderstandings have linked revisions or evidence-backed dispositions; new-reader rechecks are recorded. Keep the packet's uncalibrated forms and causal-inference limits explicit. Editorial/model review cannot close this item.

### ROAD-006 — Add truthful chapter review and version metadata

- Status / owner: done / /root, 2026-10-12.
- Dependencies: ROAD-002 supplies chapter-specific review evidence; ROAD-003 supplies source/reuse dispositions. The metadata mechanism may be implemented earlier while leaving unfinished reviews visibly pending.
- Work: define chapter version, review date, reviewer and scope in authoring JSON. Carry these fields through the build, browser edition and manuscript. The builder derives reviewed/draft status from bound review declarations; changing an authoring status alone does not publish a reviewed status. Retain explicit draft/unreviewed states and source access versus evidence-check dates.
- Exit criteria: built metadata matches the actual ledger and current chapter versions; changed chapter content invalidates prior acceptance appropriately; reader-facing labels accurately describe the review. Rebuild once and inspect affected reader/manuscript output.

- Completion / 2026-10-12: All 28 chapters have truthful version/date/reviewer/scope in authoring, manuscript and reader, labeled AI editorial review. Isolated baseline matches all 74 outputs; prose/source/renderer/missing-review copies lose acceptance. Original source/evidence dates retained; overall alpha draft and deferred human validation remain visible. See [report](RELEASE_READINESS_20261012.md) and `npm run check:reviews`.

### ROAD-007 — Prepare a public release

- Status / owner: in_progress (alpha draft) / claude-code-alpha, 2026-10-11.
- Dependencies: ROAD-002/003/004/006 for a reviewed public edition; the existing GitHub Pages destination is available but reviewed-release scope/QA remain unfinished. CA1-026 must be completed before claiming human reader validation. A deliberately released draft must describe any remaining review and study limits.
- Work: prepare a static artifact and release notes with version, content-review date, scope, data limitations and unresolved items. Choose durable topic URLs/static chapter text if search indexing is part of the release scope. Check deployed assets, routing, source links, notebook origin/backup behavior and offline reading as applicable.
- Exit criteria: a reproducible release bundle and concrete preflight record exist; deployment authorization and destination are recorded before publication. No public deployment is included in the current tracking work.
- Alpha progress / 2026-10-11: claude-code-alpha — the user requested a public alpha on GitHub with free static hosting. Prepared `npm run build:site`, a GitHub Pages workflow that reruns all verifiers/checks before deploying, and [alpha release notes](RELEASE_ALPHA.md) stating the incomplete ROAD-002–006 gates. The alpha is a deliberately released draft, not the reviewed public edition; this package stays open for the reviewed release. Deployed with the user's authorization to https://okilla.github.io/market-atlas/ from public repository OkillA/market-atlas (Actions run 38178883640); live URL checked.

- Local preflight contribution / 2026-10-12: /root prepared reproducible 0.4.1-alpha.1 static bundle/ZIP and asset/hash checks, preserving the existing ROAD-007 owner. [Report](RELEASE_READINESS_20261012.md). No push, redeploy or reviewed-public-edition acceptance; ROAD-004 remains incomplete.

## Publication gates

| Claim or release stage | Required evidence | Current state |
| --- | --- | --- |
| Complete local draft | Built chapters, practice, figures, verifiers and current references | Available; overall alpha draft, with 28 scoped AI editorial review labels |
| Reviewed public edition | Chapter acceptance records, source/rights dispositions, release QA and accurate version/review metadata | ROAD-002/003/006 done; ROAD-004 pending |
| Human reader validation | Actual observations, reader-driven dispositions and rechecks under the prepared protocol | Deferred CA1-026 / ROAD-005 |
| Public deployment | Concrete release artifact, destination, authorization and deployment checks | Alpha draft deployed 2026-10-11 ([release notes](RELEASE_ALPHA.md)); reviewed edition pending ROAD-007 |

## Optional later scope

Revisit additional indicators/derivations, portfolio correlation and concentration, shorting/margin, deeper inference and empirical literature, further historical cases, search-indexable topic pages or synchronized accounts only when a reader finding or product decision justifies them. The existing topic-specific diagrams and end-of-part solutions are already implemented; they are not outstanding first-draft tasks. Static hosting remains sufficient for the current reader.

The first edition remains stocks-first. Atlas-20 is a fictional teaching specification without a profitability claim. The historical gallery is an educational archive with explicit provenance/convention limits, rather than a point-in-time strategy trial. Derivatives, tax/account rules, live feeds and a complete treatment of shorting/margin are outside its present coverage.

