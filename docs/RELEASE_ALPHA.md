# Release notes — 0.4.0-alpha.1

Prepared **2026-10-11** by claude-code-alpha at the user's request for a public alpha. This is a deliberately released **draft**, not the reviewed public edition described by the publication gates in [EDITORIAL_ROADMAP.md](EDITORIAL_ROADMAP.md).

## What ships

The static reader edition: `index.html`, `styles.css`, `app.js`, `figure-renderer.js`, `favicon.svg` and `content/book.js` (manuscript edition 0.4). `npm run build:site` assembles exactly these into `_site/`; `.github/workflows/pages.yml` reruns the three numerical verifiers and both content checks, then deploys `_site/` to GitHub Pages on every push to `main`. All asset paths are relative, so the book works from a project subpath without server rewrites; chapter navigation uses hash URLs.

Contents: 28 chapters in six parts, worked solutions, 65 chapter practice tasks, six cumulative part reviews, 71 figures, seven attempt packets, a 105-term glossary, 73 source entries, the research appendix and the 36-window historical gallery.

## Review state at release

- Editorial publication acceptance: 16/28 chapters (1–14, 20, 21) and Parts 1–3. Chapters 15–19 and 22–28 and Parts 4–6 are pending (ROAD-002). Every chapter is labelled draft in the reader.
- Source-access and data-rights release review (ROAD-003) is not complete. The historical gallery relies on the depositor's recorded CC0-1.0 dedication; see [data/historical/README.md](../data/historical/README.md) for its limits.
- Native browser and printer release QA (ROAD-004) is not complete. For this alpha the bundle was served from a `/market-atlas/` subpath and checked in a native browser at 1280px and 320px: all assets load, 28 chapters present, no console errors or page overflow on the checked chapter.
- Per-chapter review/version metadata (ROAD-006) is not implemented.
- Human reader validation (CA1-026 / ROAD-005) has not been run; zero participants.

## Changes since the 2026-10-03 checkpoint

- PUB4-009 resolved: Chapter 26 equity panel uses session-only labels with trade details in a panel caption (see [FEEDBACK_RESOLVED.md](FEEDBACK_RESOLVED.md)).
- Footer states that this is an alpha draft and educational material, not investment advice.
- Overview page cleanup (HOME1-001, recorded 2026-10-03).

## Known open items

ALPHA1-001 (wide grouped-bar panels can cover y-axis labels) and CA1-026 (deferred) are in [FEEDBACK.md](FEEDBACK.md).

## Reader-facing notes

Notes, bookmarks and progress are stored in each browser per site address. Notes saved from a local copy or `localhost` do not appear on the hosted site automatically; use **My notebook → Export/Import**.
