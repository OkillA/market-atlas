# Release notes — 0.4.1-alpha.1

Prepared **2026-10-13** by `/root` for the user's explicit request to push the latest edition. This remains an **alpha draft with scoped AI editorial acceptance**, not a human-validated textbook or tested trading strategy. The earlier [0.4.0-alpha.1 release](RELEASE_ALPHA.md) retains its original snapshot.

## Publication

Destination: https://okilla.github.io/market-atlas/ from https://github.com/OkillA/market-atlas, `main`, via `.github/workflows/pages.yml`. The user explicitly authorized the current push on 2026-10-13. Published from shipping commit `ec08f111a245dbe6753c8c0a5e96ddbedc9cf382`. [Pages run 38447943104](https://github.com/OkillA/market-atlas/actions/runs/38447943104) succeeded. [Live asset verification](release-readiness-assets/deployment-20261013.json) confirms HTTP 200 and exact SHA-256 identity for all six reader files; [native browser checks](release-readiness-assets/live-browser-20261013.json) confirm the mobile branding/28 reviewed chapters and no document overflow at 320/390px, plus 1280px overview/chapter samples.

## Current edition

- 28 chapters and all six cumulative reviews have recorded scoped AI editorial acceptance, with bound chapter versions, dates, reviewer/scope and invalidation fingerprints. Overall manuscript edition: 0.4.1.
- Six parts, 210 narrative sections, 42,211 section-prose words, 66 graded chapter tasks, 18 cumulative tasks, 105 glossary terms and 71 portable figures.
- Seven attempt packets, including the Chapter 26 accounting replay; continuation and solution policies remain explicit.
- 75 source entries / 72 URLs, recorded access/support/reuse dispositions, an eight-section research appendix and 36 fixed historical AAPL/MSFT/SPY windows.

## Changes since the public alpha

Completed the remaining chapter/part editorial batches, corrected recorded content/figure findings, and added truthful AI review/version metadata. The recorded source/access/reuse review is complete for this release scope; original claim-check dates and provider limitations remain visible.

Print fixes keep multi-panel figures readable, prevent split headings/stranded labels, and let part reviews print task and solution editions. The [native print matrix](NATIVE_PRINT_COMPLETION_20261013.md) now covers all seven packet chapter pairs plus an ordinary chapter and a part review in both editions. Broader desktop/keyboard, compact/wide/zoom-equivalent, offline and automated accessibility checks are retained with their engine and coverage limits.

The mobile header now retains the Market Atlas logo/wordmark and direct home link when the navigation drawer is closed (MOBILE2-001). Layout/control checks passed across 320–1280px in both themes. Stylesheet cache key: `20261013-mobile1`. The glossary heading/term-size fixes and worked-example label correction (QA1-001–003) are included.

## Validation and artifact

[Publication checks](release-readiness-assets/publish-checks-20261013.json) pass: early/revision/historical verifiers, normal/strict content checks, figure checks and review metadata/invalidation. [Package preflight](release-readiness-assets/package-preflight.json) confirms two matching static builds, seven bundle files, complete local asset references and ZIP integrity. The [offline ZIP](release-readiness-assets/market-atlas-0.4.1-alpha.1.zip) contains the same reader assets as the Pages build.

Only the static reader files are deployed; source authoring, evidence and QA documents remain in the public repository. Source links are optional further reading; the site has no remote fonts, accounts, analytics or market-data service.

## Boundaries and reader notes

CA1-026 / ROAD-005 remains deferred: zero human participants or learning observations. AI editorial acceptance and browser checks do not establish learner outcomes. No real screen-reader, additional browser or physical-printer session is claimed. Mobile checks used native desktop preview CSS viewports; the user's Edge phone screenshot established the branding defect, but a fresh physical phone recheck was unavailable.

Teaching examples are fictional unless labelled historical. The archive has retrospective adjustment, upstream provenance, timestamp and reuse limitations documented in [data/historical/README.md](../data/historical/README.md). Historical gallery classifications are neither executable historical trades nor a performance estimate. Source definitions and arithmetic do not validate a profitable strategy.

Notes, bookmarks and progress remain stored by browser and site address. The hosted site keeps the same origin/path, so ordinary deployment does not reset those records. Use **My notebook → Export/Import** to back up notes or move between local and hosted editions. If a browser retains old assets after deployment, reload the page; the changed stylesheet URL selects the new mobile header styling.

## Mobile drawer correction — 2026-10-13

MOBILE2-002 fixes drawer branding clipped behind the sticky header in the user's Edge phone screenshot. The drawer now starts below the header, omits its redundant brand, puts search first and scrolls within the remaining dynamic viewport. [48 native cases](mobile-header-assets/drawer-checks.json) pass across themes, portrait/landscape, short viewport and page-scroll states; all drawer items pass reachability/hit-testing. Stylesheet key: `20261013-mobile2`. Content/print scope unchanged; physical phone recheck not claimed.
