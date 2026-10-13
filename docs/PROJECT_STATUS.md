# Project status

Updated **2026-10-13** by `/root` after publishing 0.4.1-alpha.1 (earlier mobile/print/QA slices and attribution retained). This is the current project tracker. [The roadmap](EDITORIAL_ROADMAP.md) owns the remaining work and its completion criteria; [the feedback queue](FEEDBACK.md) owns actionable review findings; [the resolution history](FEEDBACK_RESOLVED.md) preserves their evidence. Dated completion reports describe their own snapshots.

**Where we are:** the complete revised draft is available for local reading and as a public alpha at https://okilla.github.io/market-atlas/. The major recorded content and interface findings are resolved. All 28 chapters and all six part reviews have current scoped editorial acceptance. Source/access/reuse review and bound AI review/version metadata are complete. The documented browser/print release QA scope (ROAD-004) is complete. The recorded release scope is published as 0.4.1-alpha.1; human reader validation stays deferred. Work can continue while readers are unavailable.

## Current inventory

| Deliverable | Current state |
| --- | --- |
| Browser book and standalone manuscript | Local edition 0.4.1; 28 scoped AI editorial review labels, overall alpha draft |
| Structure | Six parts; 210 narrative sections |
| Section prose | 42,211 words; excludes examples, practice, quizzes and research appendix |
| Practice | 28 chapter exercise solutions; 66 graded chapter tasks; six cumulative reviews with 18 tasks |
| Illustrations | 71 portable SVGs generated from shared figure specifications |
| Attempt packets | Seven: Chapters 6–9, 22, 26 and 28; Chapter 26 is an accounting replay |
| Reference and evidence | 105 glossary terms; 75 source entries / 72 URLs; eight research-appendix sections |
| Historical gallery | 36 fixed AAPL/MSFT/SPY windows, with documented archive/selection limitations |
| Human validation | Packet prepared; zero participants and zero observations |
| Public release | Latest alpha draft 0.4.1-alpha.1 deployed 2026-10-13 to GitHub Pages from OkillA/market-atlas ([release notes](RELEASE_0_4_1_ALPHA_1.md)); 28 scoped AI reviews, human validation deferred |

Run `npm run status` for a fresh read-only inventory and comparison with [the verification checkpoint](PROJECT_CHECKPOINT_20261013_203749.json). The numbers above belong to the dated checkpoint; update them after substantive changes. Matching hashes show that checked files have not changed, rather than establishing new factual or publication approval.

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
| Publication review batch 6 | Complete for two chapters and Part 5 | [Chapters 22–23 and cumulative review](PUBLICATION_BATCH6_20261011.md); reopened CA1-015 and PUB6-001 resolved; then totals 23/28 chapters and 5/6 part reviews |
| Publication review batch 7 | Complete for five chapters and Part 6, plus dependency rechecks | [Chapters 24–28 and cumulative review](PUBLICATION_BATCH7_20261012.md); AUD2-002 reopening and PUB7-001–010 resolved; all 28 chapters and six part reviews accepted. PUB7-011 was subsequently resolved in release readiness |

| Release-readiness batch | Complete source/reuse and metadata scope; QA advanced | [Report](RELEASE_READINESS_20261012.md); PUB7-011 and RELEASE1-001–003 resolved; local reproducible alpha candidate, no push |

## Work remaining

| Work ID | Status | Owner | Next concrete action |
| --- | --- | --- | --- |
| ROAD-002: chapter publication acceptance | Done; 28/28 chapters and 6/6 part reviews accepted | /root, 2026-10-12 | [Batch 7](PUBLICATION_BATCH7_20261012.md) records the final acceptance and dependency rechecks; later changes must recheck affected reviews |
| ROAD-003: source access and data-rights review | Done for recorded release scope | /root, 2026-10-12 | 75 source dispositions and historical reuse limits recorded; update when sources change |
| ROAD-004: native browser and print release QA | Done for documented release-QA scope | /root, 2026-10-13; earlier completed slices by claude-code-print and claude-code-qa retained | [Native print completion](NATIVE_PRINT_COMPLETION_20261013.md): all seven packet chapter pairs, ordinary Chapter 10 and Part 6 in both editions. Earlier desktop/keyboard/wide/zoom/offline/accessibility-tree evidence retained. Optional real screen-reader/cross-browser/physical-printer checks not performed |
| ROAD-005: human reader validation / CA1-026 | Deferred: participants unavailable | /root, preparation only; session facilitator unassigned | Resume the prepared protocol when actual target readers are available; record observations, revisions and rechecks |
| ROAD-006: chapter review/version metadata | Done | /root, 2026-10-12 | Bound version/date/reviewer/scope in authoring and reader; prose/source/renderer changes invalidate acceptance |
| ROAD-007: public release packaging | Done for recorded 0.4.1-alpha.1 release scope | claude-code-alpha (original owner); /root publication contribution, 2026-10-13 | [Release notes](RELEASE_0_4_1_ALPHA_1.md), reproducible bundle, explicit push request, successful deployment and matching public assets. Human validation remains deferred |

The [roadmap](EDITORIAL_ROADMAP.md) records dependencies and exit criteria for these IDs. These are planned work packages, not demonstrated defects or duplicate feedback findings. `Ready` means independent work can start; it does not imply a claim. Claim a package before implementation and record concrete progress before releasing it.

## Verification history and current QA

[Release readiness](RELEASE_READINESS_20261012.md) records all passing current numerical/normal/strict/figure/syntax checks, 74 matching isolated outputs, four invalidation cases, 362 focused Chapter 27 comparisons and 169 Part 6 comparisons. The early verifier passes 617 comparisons. Earlier whole-book source/figure/arithmetic evidence retains its original scope; this pass does not invent a new full read of unchanged chapters.

All 28 declarations match the publication ledger. The bounded Dow addition changes Chapter 27/Part 6 fingerprints only; the other 27 chapters, five parts and all 71 SVGs preserve legacy hashes. Source inventory: 75 entries/72 URLs; 55 direct retrievals including the full Dow manuscript, 16 web-reader fallbacks and one inaccessible listing with saved provider metadata. Original claim-check/access dates remain separate from this fresh access pass. Historical numeric/selection inputs are unchanged.

At the 2026-10-12 release-readiness checkpoint, native evidence included 21 packet cases at top-level 320/390/768 and 30 broader routes at 320/768, search/contents/table-workspace and notebook round-trip checks, plus final contents native child frames at 390/768/1280. Original reader storage is restored. Three real native PDFs are retained; only Chapter 6’s learner/answer pair is current, while Chapter 7’s learner sample predates the new flow table. Native resize/Enter/snapshot/save failures limit remaining desktop and printer claims. No complete native print matrix, native file:// test or human observations are claimed.

**2026-10-13 release-QA update.** [Checkpoint 2026-10-13](PROJECT_CHECKPOINT_20261013_152853.json) pins the current files after the full 13-command check suite ([output](release-readiness-assets/qa-final-checks.json)). Content, figures and acceptance fingerprints are unchanged from the 2026-10-12 checkpoint; only reader-interface files, tracking docs and QA records changed. Native Chapter 7–8 learner/answer PDFs ([record](release-readiness-assets/native-print-checks.json)) and a headless print sweep of every chapter and part review ([record](release-readiness-assets/headless-print-sweep.json)) found and fixed PRINT1-001–003. Also done: a native 1280px desktop/keyboard pass ([record](release-readiness-assets/desktop-keyboard-checks.json)); native 1440/1920px and 200%/400% zoom-equivalent sweeps; offline file:// reading of the site and the extracted release ZIP; and accessibility-tree plus contrast/text-size audits ([record](release-readiness-assets/wide-zoom-file-a11y-checks.json)). These found and fixed QA1-001–003. file:// and the audits used headless Chrome; there was no real screen-reader session. Native printer output for Chapters 6, 9, 22, 26 and 28 and the ordinary/part-review samples remains.

At the earlier release-QA checkpoint, ROAD-002/003/006 were done and ROAD-004 remained in progress; ROAD-007 has a reproducible local 0.4.1-alpha.1 candidate, with its existing owner preserved and no new push/deployment. CA1-026 is the only active feedback finding, deferred until actual readers participate. The public alpha remains 0.4.0-alpha.1. Earlier checkpoints/reports remain immutable history; the current checkpoint uses a UTC filename and America/New_York review date.

**2026-10-13 native print completion.** [The completion report](NATIVE_PRINT_COMPLETION_20261013.md) and [inspection record](release-readiness-assets/native-print-final-inspection.json) retain 14 new native Quartz PDFs, 237 visually inspected pages: Chapters 6/9/22/26/28 and ordinary Chapter 10 learner/answer pairs, plus Part 6 tasks/solutions. Complete input tables, continuation boundaries, figure labels, quiz choices and solution policy checked; no new defects. PRINT1-001–003 receive additional native verification. With inherited Chapter 7–8 pairs, all required native print samples are complete. ROAD-004 is done for documented scope; optional real screen-reader, additional browser and physical-printer coverage is not claimed. Task preview/PDF windows were closed at the user's request. Shipping files and all editorial fingerprints are unchanged; `npm run check:reviews` passes. [PROJECT_CHECKPOINT_20261013_160115.json](PROJECT_CHECKPOINT_20261013_160115.json) pins these artifacts and tracking changes, preserving the previous full-suite checkpoint as history. ROAD-007 reviewed-release finalization and deferred CA1-026 remain; no push or deployment.

**2026-10-13 mobile header follow-up.** User phone Edge feedback MOBILE2-001 exposed that branding/home access disappeared with the closed sidebar. Added a compact mobile brand/home link and checked 36 native viewport/theme/route cases plus actual header interactions ([evidence](mobile-header-assets/browser-checks.json)); no overflow or control overlap. Snapshot limitations and lack of a fresh physical phone test are explicit. Screen-only CSS leaves the original print rules unchanged; content/app/renderer and all 28 review fingerprints are unchanged. `check:reviews` passes; the local release ZIP/preflight is rebuilt for the corrected header. [PROJECT_CHECKPOINT_20261013_183149.json](PROJECT_CHECKPOINT_20261013_183149.json) pins the change. Preview closed; public deployment/ROAD-007 and deferred CA1-026 remain pending.

**2026-10-13 latest alpha published.** The user explicitly requested a push of the latest edition. Shipping commit `ec08f111` includes 13 earlier local commits plus completed native print QA and MOBILE2-001. [Pages run 38447943104](https://github.com/OkillA/market-atlas/actions/runs/38447943104) succeeded; [all six hosted reader files match local SHA-256](release-readiness-assets/deployment-20261013.json), and native live 320/390/1280px branding/route samples pass. [Release notes](RELEASE_0_4_1_ALPHA_1.md) and the reproducible ZIP describe current review, data and study limits. ROAD-007 is done for recorded release scope; CA1-026 / ROAD-005 is the remaining deferred work. No human validation or physical phone recheck is claimed.

**2026-10-13 drawer follow-up.** MOBILE2-002 corrects open navigation content hidden by the sticky header, reported in a second user phone screenshot. Screen-only positioning keeps the drawer below the header and all items reachable; [48 native viewport/theme/scroll cases](mobile-header-assets/drawer-checks.json) pass. App/content/renderer and printed layout unchanged; review metadata and package preflight pass. Published as `c3a5cac` via [successful Pages run 38463790656](https://github.com/OkillA/market-atlas/actions/runs/38463790656); [six hosted assets match local SHA-256](mobile-header-assets/drawer-deployment.json). Actual phone verification and CA1-026 remain outside this check. Preview closed.

## Keeping this tracker useful

1. Start with this page and the active feedback queue; claim the next ready roadmap package or an actionable finding.
2. For a concrete content issue, reuse/reopen its feedback ID where appropriate. Planning status belongs in the roadmap; full findings and closure evidence belong in the feedback files.
3. Edit authoring JSON for content changes and coordinate one shared rebuild. Verify affected teaching, calculations, source claims and actual figures according to [CONTENT_GUIDE.md](CONTENT_GUIDE.md).
4. Update the roadmap's owner, progress and exit evidence, plus affected chapter-ledger rows. Refresh this inventory and create a new dated checkpoint after checks pass; retain old reports as history.
5. If `npm run status` reports changed files, determine which checks and reviews are affected. A checkpoint match is a freshness signal; publication acceptance and reader observations require their own evidence.
