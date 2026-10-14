# Content and illustration guide

Audience: basic investing knowledge; new to technical analysis. Scope: primarily stocks, with ETF comparisons where helpful. Tone: an engaging nonfiction textbook, with patient, connected prose. Avoid a collection of trading tips or indicator recipes.

## Chapter contract

Edit the authoring JSON file for the relevant part, then run the content build. A chapter uses:

```json
{
  "id": "unique-stable-slug",
  "title": "A clear topic title",
  "subtitle": "The question this chapter helps answer.",
  "status": "draft",
  "tags": ["search terms", "abbreviations"],
  "takeaway": "One important idea, stated without overstating evidence.",
  "sections": [
    { "id": "stable-section-slug", "title": "Section heading", "paragraphs": ["Connected original prose."] }
  ],
  "example": { "title": "A concrete example", "text": "A worked example or failure case." },
  "exercise": "An observation or calculation the reader can reproduce.",
  "quiz": {
    "question": "A meaningful knowledge check?",
    "options": ["One", "Two", "Three"],
    "answer": 1,
    "explanation": "Why the correct answer is correct."
  },
  "sources": ["namespace-source-id"],
  "related": ["another-stable-chapter-slug"],
  "figure": {
    "title": "What this illustration shows",
    "caption": "Fictional data and the intended lesson, including limitations.",
    "xLabel": "Session",
    "yLabel": "Price ($)",
    "series": [{ "name": "Close", "values": [40, 42, 41, 44, 43, 46] }],
    "annotations": [{ "index": 3, "label": "A precisely described observation." }]
  }
}
```

The answer index and figure annotation indices are zero-based. All series in one figure must have the same number of points and use comparable units. Up to four series are supported; avoid crowding. Use `null` for values not yet defined, such as an SMA warm-up. The renderer does not interpolate across these missing values. Series colors and legends remain in order.

The build computes reading time from narrative prose. Chapter order comes from the parts in `curriculum.js`. The generated `book.js` is the shipping artifact, so do not edit it manually.

## Review metadata

Each authored chapter records `version` and `review: {status, date, reviewer, scope, evidence, contentSha256, rendererSha256}`. `status: "accepted"` describes a recorded **AI editorial review**, not human learning or independent peer review. Preserve the original review/report dates and add the actual scope of later focused changes. The overall edition remains an alpha draft while release QA and human validation are incomplete.

The builder derives `chapter.status` and `review.valid`; it does not accept an authored status label alone. `scripts/review-fingerprint.cjs` hashes the compiled chapter and its linked source records, excluding `version`/`review` and normalizing the derived status to draft. This preserves earlier ledger hashes for unchanged content. A changed paragraph, linked source, missing/incomplete declaration or changed renderer makes the shipping chapter draft with a visible review-needed label. Only update acceptance hashes after reviewing the affected material and recording evidence; generating a new hash is not approval.

Run `npm run check:reviews` after the coordinated content build. It compares all 74 outputs in an isolated baseline build and exercises prose/source/renderer/missing-review invalidation in separate copies. The current accepted baseline must remain consistent with the ledger. Historical batch-specific isolated-build scripts belong to their original builder snapshots; use this current command after adopting the fingerprint helper.

`content/source-access.json` is the authored edition-wide access/support/reuse inventory. Fresh retrieval dates are separate from source `accessed` dates and evidence `checked` dates. Update its URL dispositions when adding/changing sources; a successful download does not reset claim-inspection dates or clear third-party rights.

## Sources

Each authoring file includes a `sources` object:

```json
{
  "namespace-source-id": {
    "title": "Publisher · Specific source title",
    "url": "https://example.org/specific-source",
    "supports": "The exact concepts this source verifies; no unsupported inference.",
    "accessed": "YYYY-MM-DD"
  }
}
```

Prefer regulator/exchange publications for market mechanics, original research for empirical claims, and indicator/platform documentation for exact calculation conventions. A source describing a technique does not establish its effectiveness. Framework proponents are appropriate sources for their own definitions, but not independent evidence of predictive performance.

Empirical evidence records include `study: {sample, rule, comparator, costs, result}` alongside the source location and limitations. Research sections may include the same `tables` format as chapter sections. Both appear in the browser, evidence matrix and manuscript research appendix. Glossary support groups in the research appendix use `evidence[].terms` to list every covered term or alias; distinguish source definitions, original arithmetic and local working vocabulary. Strict checks require complete empirical fields and exactly one glossary support assignment per term. These are traceability checks, not evidence of factual accuracy.

Write original explanations and examples. Do not reproduce copyrighted textbook prose, chart screenshots, proprietary datasets, or long source excerpts. Add historical data only with documented permissions and clear adjustment/session/timestamp conventions.

## Writing standard

Every substantive chapter should answer:

1. What question does this help investigate?
2. What exactly is measured or defined?
3. What information is lost or assumed?
4. How can a reader reproduce a numerical example?
5. When is the information actually available?
6. What are plausible counterexamples or failures?
7. What evidence supports the interpretation, and what remains unsettled?
8. How does this connect to risk, execution, and honest evaluation?

State formula variables and initialization. Separate conventional definitions from subjective judgments. Avoid claims such as “high volume proves institutional buying” or “overbought means price must fall.” Illustrate failed patterns as carefully as successful ones. Do not imply an educational sizing percentage is a recommendation.

## Illustration standard

Preserve explicit section and evidence-record IDs when revising headings; saved reading positions and deep links use those IDs. For a prospective task, use `learnerAttempt: {title, paragraphs, tables, afterSection?, figures?}` to put only cutoff-available inputs before the continuation disclosure. The optional zero-based `afterSection` keeps prerequisite teaching through that section visible before the packet; omit it to place the packet before all sections. Keep outcome-bearing teaching and full-path figures inside the continuation. Optional attempt `figures` use the shared renderer and show only supplied raw inputs or frozen rules, without later observations or computed answer annotations. Keep the complete worked reference after the reveal and describe selection or reuse limits in the attempt packet. Learner print editions omit worked solutions and quiz answers; answer editions include them. Both retain input tables and quiz choices, with continuation reference starting on a separate page where an attempt packet is supplied.

Chapter and part-review practice tasks may include `tables` using the section-table format. Put unfamiliar raw inputs in these tables and computed answers in the concealed `solution`. Input tables remain visible in both learner and answer print editions. Preserve practice titles when possible because the reader’s practice deep links derive from them.

The same attempt-first presentation can hold an accounting replay: label it explicitly as a replay, provide its initial state, unchanged rules and chronological input bars, and hide calculated ledger results. Supplying later bars for accounting is not a prospective forecast exercise. Check restated rule tables against the reference so copied instructions cannot drift.

Each illustration should teach something that prose alone cannot show as efficiently. Specify axes, units, labels, conventions, and source/data status. Teaching illustrations are fictional unless explicitly labeled historical with provenance and data conventions. A price path is insufficient when the concept concerns candle geometry, volume by price, intrabar sequencing, or a distribution: use a suitable additional diagram and explain its reading.

Y-axis ticks use round 1/2/5 × 10ⁿ steps, and x-axes label every observation that fits. Use `yTicks: [..]` only when a figure must show specific values (for example 10/20/40/80 on a log axis to show equal spacing per doubling). When the text asks a reader to compare price with a frozen threshold, stop, target, zone edge or mean, draw it with `references: [{ "value": 39.5, "label": "Break threshold $39.50" }]` on the line, bar or candle panel. Put the value in the label and make it match the text exactly. Labels sit next to their line only where they hide no data; otherwise all of that panel's labels move to a key under the chart.

For linear count panels (such as net issues, trades per bin or occupied slots), set `integerTicks: true` on the panel to display whole-number y-axis ticks. This is explicit: integer-valued price inputs do not imply a count axis. Bar observations occupy inset slots; any accompanying lines, annotations and x-axis labels use the same slot centers. Run `npm run check:figures` after rebuilding to check every chart panel at 260/320/390/760px for annotation backgrounds over markers, bars outside the plot, fractional enabled count ticks, and hidden plotted paths/bars/candle bodies/wicks. The hidden-data gate requires zero sampled coverage at 760px and at most 5% per-series/area coverage at compact widths; passing permits small compact residuals and does not prove legibility. Actual visual inspection remains necessary for labels, leader lines, instructional meaning and axis collisions.

Chapter illustrations use `figure-renderer.js` in both the browser and exported SVGs: `line`, `bars`, `candles`, `table`, `flow`, `profile`, and stacked `panels`. Explicit series styles take precedence over the chart kind, allowing a baseline line over volume bars. Use separate panels for incompatible units and alternative chronological branches. The chart playground provides four reusable experiments. Add chapter figure types to the shared renderer so the browser and manuscript remain consistent.

Use keyed legend swatches and distinguish line series with patterns as well as color. Inspect compact exports for complete prices, wrapped flow labels and axis labels. Print figures use the explicit light palette so their colors remain portable outside a browser.

For a numerical worked analysis, include the inputs needed to reconstruct it in manuscript tables or prose, as well as the browser's expandable figure data. State the cutoff before revealing later observations. Verify calculations before building with `node scripts/verify-early-chapters.cjs`, `node scripts/verify-revision.cjs`, and `node scripts/verify-historical.cjs`; after the coordinated `npm run build:content`, run `npm run check` and `node scripts/check-content.cjs --strict-revision`. These checks supplement substantive reading and inspection of actual figures.

## Glossary

Each authoring file may add `glossary` entries in `["Term", "Concise definition", "chapter-id"]` format. Definitions should remain useful in isolation and link back to a full explanation. Duplicate terms are merged case-insensitively during the build.

## Publication readiness

Keep chapters marked draft until reviewed. A schema checker verifies structure, not financial facts. Review arithmetic, timing, claims, source alignment, and illustrations separately. Record corrections and unresolved disagreements in editorial notes. Before a public launch, add a content review date/version per chapter and verify source access and historical-data rights.
