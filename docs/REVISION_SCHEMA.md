# Revision authoring contract

Keep existing chapter IDs and legacy fields. Authors edit their own JSON only; the integrating agent handles the renderer, rebuild, checks, and shared feedback tracker.

New chapter fields:

- `outcomes`: array of concrete learning outcomes.
- `prerequisites`: array of existing chapter IDs.
- `optional`: boolean for advanced extensions; core chapters remain false.
- `solution`: array of paragraphs explaining the existing exercise with intermediate steps and alternatives.
- `practice`: array of `{title, question, tables?: [table specifications], solution: [paragraphs], level: 'guided'|'independent'}`; add two meaningful tasks per chapter where useful. Optional input tables appear before the solution in the browser, manuscript and both print editions; keep answers in `solution`, not in these tables.
- `quiz.feedback`: three strings explaining the misconception behind each answer, in option order.
- `sections[].tables`: array of `{title, columns:[strings], rows:[[string|number,...]]}`. Use supplied data and intermediate calculations rather than burying all values in prose.
- `sections[].id`: unique stable section slug within its chapter, including additions. Preserve it when editing headings; reader URLs and saved positions depend on it.
- `learnerAttempt`: optional `{title, paragraphs:[strings], tables:[table specifications], afterSection?: integer, figures?: [figure specifications]}` containing only inputs available at the decision cutoff, or the initial state, frozen rules and chronological raw inputs for an explicitly labelled accounting replay (never its calculated answers). It precedes the continuation disclosure in the browser and manuscript. `afterSection` is the zero-based last prerequisite section shown before the packet (default −1, before all sections); it must leave at least one section for the continuation. Attempt figures contain raw cutoff inputs or supplied rules, with no future observations or computed answer labels. Normal figures follow their section into the prelude or continuation. Printed continuation begins on a separate page.
- `sections[].optional`: true for a clearly marked advanced extension.
- `evidence`: array of `{claim, type, sourceIds:[IDs], location, summary, limits, checked:'YYYY-MM-DD'}`. Types: definition, arithmetic, mechanism, empirical, teaching-rule, historical, unresolved. Source IDs may be empty only for transparent arithmetic or original teaching rules. Explain exactly what was read and where; do not label successful link retrieval factual verification.
- Empirical records also require `study: {sample, rule, comparator, costs, result}`. Mechanism records may use it for a bounded observational study. Research sections support chapter-style `tables`; they are exported to both the manuscript and matrix. Research glossary-support records add `terms:[exact glossary labels]`; every term and alias is assigned exactly once, including local vocabulary without an external-authority claim. Unsourced `unresolved` records describe an evidence gap, not a teaching calculation.
- Research sections and evidence records have explicit stable `id` fields; evidence IDs are unique across the appendix, including chapter evidence. Preserve them for record-specific links.

Figures:

Existing `figure` remains the primary figure. Add `figures` for additional representations. Every figure has title, caption, and optional `afterSection` (zero-based section index; default 0). Images will appear after the selected narrative section in both website and standalone manuscript.

Supported specifications:

1. **Line / bar chart**: `kind:'line'` (default) or `kind:'bars'`, `xLabel`, `yLabel`, `xStart:0|1` (default 1), optional `xLabels:[strings]`, `showAllXLabels:true` for short category/bin labels, `yScale:'linear'|'log'`, `series:[{name,values:[number|null],style:'line'|'step'|'bar'}]`. Equal series lengths, at most four series. `annotations:[{index,seriesIndex:0-based,label,shortLabel,placement:'above'|'below'}]`. Series index defaults 0; always specify it for alternative paths. Optional `zones:[{low,high,label,from:0-based,to:0-based}]`.
2. **Candles**: `kind:'candles'`, `xLabel`, `yLabel`, `candles:[{open,high,low,close,label}]`, optional `annotations:[{index,value,label,shortLabel,placement}]`, optional `showOHLC:true` to display supplied values. Valid OHLC inequalities required. For one candle, annotate body/wicks with specific values in labels.
3. **Table**: `kind:'table'`, `columns:[strings]`, `rows:[[string|number,...]]`. Add all units to headers.
4. **Flow/timeline**: `kind:'flow'`, `steps:[{title,text}]`.
5. **Price-by-volume profile**: `kind:'profile'`, `levels:[{price,volume}]`, `xLabel:'Volume (shares)'`, `yLabel:'Price ($)'`.
6. **Panels**: `kind:'panels'`, `panels:[any supported figure]`. Each panel needs its own title, axes/data, and optional caption. Use aligned panel stacks for distinct units; never mix price and percent on one unlabeled axis.

Keep labels short on plots; captions can explain the wider lesson. Annotate the actual point/series, not a nearby convenient one. All essential short labels will be visible in exported SVGs; hover titles are supplementary.

Each authoring JSON can add `partPractice` keyed by part ID, with `{title,tasks:[{title,question,solution:[paragraphs]}]}`. The part review appears after that part in the manuscript and as a linked review page in the website.

Add primary source records to your existing namespaced `sources`. Retain stable source IDs. For external historical cases, label the facts/data separately from fictional rule execution and preserve reuse and timestamp conventions.

Do not run the shared build. Deliver a concise revision report with feedback coverage, actual calculations checked, source inspection, and remaining limits. Coordinate any need for new figure types before using them.
