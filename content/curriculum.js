/* Authored content is separate from the reading interface. No network requests are needed. */
window.ATLAS = {
  parts: [
    { id: 'foundations', number: '01', title: 'Start with the foundations', short: 'The foundations', level: 'BEGINNER', description: 'Meet the market. Learn the language of price, time, and participation.', chapters: ['market-language', 'chart-anatomy', 'volume', 'timeframes'] },
    { id: 'price-action', number: '02', title: 'Read the story of price', short: 'Price & structure', level: 'BEGINNER', description: 'Recognize trends, map important areas, and put patterns into context.', chapters: ['trends', 'support-resistance', 'candlestick-patterns', 'chart-patterns', 'breakouts'] },
    { id: 'indicators', number: '03', title: 'Look beneath the surface', short: 'Indicators & tools', level: 'INTERMEDIATE', description: 'Understand what an indicator measures before asking what it means.', chapters: ['moving-averages', 'momentum', 'volatility', 'volume-tools', 'fibonacci'] },
    { id: 'context', number: '04', title: 'See the bigger picture', short: 'Market context', level: 'INTERMEDIATE', description: 'Connect a stock to its sector, the broad market, and the trading session.', chapters: ['relative-strength', 'breadth', 'multi-timeframe', 'events', 'market-microstructure'] },
    { id: 'risk', number: '05', title: 'Build a repeatable process', short: 'Risk & process', level: 'ALL LEVELS', description: 'Translate an observation into a clear hypothesis, with a defined risk budget.', chapters: ['risk-sizing', 'trade-plans', 'psychology', 'journaling'] },
    { id: 'advanced', number: '06', title: 'Question, test, refine', short: 'Advanced study', level: 'ADVANCED', description: 'Study evidence, test ideas honestly, and separate a good story from a useful method.', chapters: ['testing', 'statistics', 'system-design', 'classical-frameworks', 'case-studies'] }
  ],
  sources: {
    intro: { title: 'Fidelity · What is technical analysis?', url: 'https://www.fidelity.com/learning-center/trading-investing/technical-analysis/what-is-technical-analysis', supports: 'Definition and limits of technical analysis.' },
    charts: { title: 'Fidelity · What are charts?', url: 'https://www.fidelity.com/learning-center/trading-investing/technical-analysis/what-are-charts', supports: 'Chart types and price representation.' },
    trends: { title: 'Fidelity · Basic concepts of trend', url: 'https://www.fidelity.com/learning-center/trading-investing/technical-analysis/basic-concepts-trend', supports: 'Peaks, troughs, and trend direction.' },
    levels: { title: 'Fidelity · Support and resistance', url: 'https://www.fidelity.com/learning-center/trading-investing/technical-analysis/support-and-resistance', supports: 'Supply, demand, and support/resistance concepts.' },
    sma: { title: 'Fidelity · Simple moving average', url: 'https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/sma', supports: 'SMA calculation and interpretation.' },
    volume: { title: 'Fidelity · Volume oscillator', url: 'https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/volume-oscillator', supports: 'Comparing volume with its recent history.' },
    orders: { title: 'SEC / Investor.gov · Types of orders', url: 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders', supports: 'Stop orders and execution-price uncertainty.' },
    performance: { title: 'SEC / Investor.gov · Performance claims', url: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-47', supports: 'Hypothetical backtests and evaluating performance claims.' }
  },
  chapters: [
    {
      id: 'market-language', title: 'The language of the market', subtitle: 'Before you interpret a chart, know what you are looking at.', minutes: 3, status: 'starter', diagram: 'overview', tags: ['stocks', 'price', 'technical analysis', 'fundamental analysis'],
      takeaway: 'A chart records transactions. Your interpretation is a hypothesis about what may happen next.',
      sections: [
        { title: 'A stock, a price, a question', paragraphs: ['A share is a small ownership interest in a company. Its market price is the price at which buyers and sellers transact. The company and its stock chart are related, but a price chart is not a complete description of the business.', 'Technical analysis studies price and trading activity. Fundamental analysis studies the business and its value. Start by naming your question: are you investigating business quality, describing recent price behavior, or designing a trading rule? Different questions need different evidence.'] },
        { title: 'Observation comes before interpretation', paragraphs: ['Imagine a fictional stock, ATLS, trading from $40 to $46 over ten sessions. “The closing price rose 15%” is an observation. “Buyers will keep pushing it higher” is an interpretation. “Buy tomorrow if a specific condition occurs” is a proposed rule. Keep these three layers separate.', 'In this book, describe what is visible before guessing why it happened. You will often find more than one plausible explanation. A useful analysis says what could disprove it.'] },
        { title: 'What a chart cannot promise', paragraphs: ['The next trade has not happened yet. An attractive pattern is not a guarantee, and a name for a pattern is not evidence that trading it earns money. Treat chart reading as a way to organize questions that you can later test.'] }
      ],
      example: { title: 'A small change in language', text: 'Instead of “this stock must bounce,” write “price has reacted near $40 before; another reaction is possible, but a sustained move below that area would weaken my hypothesis.” The second sentence describes uncertainty and a way to update your view.' },
      exercise: 'Write one observation and one interpretation about the fictional chart. Could another reader agree with your observation but disagree with your interpretation?',
      quiz: { question: 'Which statement is an observation?', options: ['The stock will rally next week.', 'The last close was above the first close.', 'This pattern guarantees a profitable trade.'], answer: 1, explanation: 'Closing prices are observable. The future rally and guaranteed profit are claims about outcomes that have not happened.' }, sources: ['intro'], related: ['chart-anatomy', 'testing']
    },
    {
      id: 'chart-anatomy', title: 'Anatomy of a stock chart', subtitle: 'One candle. Four prices. A much clearer picture.', minutes: 4, status: 'starter', diagram: 'candle', tags: ['candlestick', 'OHLC', 'open', 'close', 'high', 'low'],
      takeaway: 'Each candle summarizes one time interval; its body and wick answer different questions.',
      sections: [
        { title: 'Start with the axes', paragraphs: ['Time runs from left to right. Price runs vertically. Read the instrument, interval, currency, and session definition before studying the shape. One daily candle summarizes one trading day; a five-minute candle summarizes five minutes. The same number of candles can represent very different amounts of time.'] },
        { title: 'Four prices inside one candle', paragraphs: ['The open is the first price of the interval; the close is the last. The high and low are its extremes. A candle’s body spans open to close, while its wick spans the high and low. Our green candles close above the open and our rust candles close below it; other platforms may use different colors.', 'Suppose ATLS opens at $100, trades as high as $108 and as low as $98, then closes at $105. The body spans $100–$105. The upper wick extends to $108, and the lower wick reaches $98. The interval’s high-to-low range is $10.'] },
        { title: 'A summary leaves things out', paragraphs: ['That candle does not reveal whether the high occurred before the low. Many sequences of transactions can produce identical open, high, low, and close values. Do not invent an intraday story that the data cannot establish.', 'A line chart of closes is useful for a simple view of direction. A candlestick chart adds the within-interval range. Neither view is universally better; choose the view that fits your question.'] }
      ],
      example: { title: 'A green candle can still be a down day', text: 'Yesterday’s close was $110. Today opens at $100 and closes at $105. Today’s candle is green because close exceeds open, but the stock is still down $5 from yesterday’s close. Candle color and close-to-close return are different comparisons.' },
      exercise: 'In the candle experiment, move the close below the open. Which parts change? Which prices can stay the same?',
      quiz: { question: 'A candle opens at $100 and closes at $105 after yesterday’s $110 close. What is true?', options: ['It closed higher than yesterday.', 'It rose from its open but fell from yesterday’s close.', 'It never traded below $100.'], answer: 1, explanation: 'Open-to-close change is +$5; close-to-close change is −$5. The low cannot be inferred from those three prices.' }, sources: ['charts'], related: ['volume', 'trends']
    },
    {
      id: 'volume', title: 'Volume: participation behind price', subtitle: 'Ask how much traded, then ask what that number can actually tell you.', minutes: 3, status: 'starter', diagram: 'volume', tags: ['volume', 'participation', 'liquidity'],
      takeaway: 'Compare volume with a relevant baseline. Volume alone does not tell you who is right.',
      sections: [
        { title: 'What the bars count', paragraphs: ['Share volume counts shares traded over an interval. A trade of 100 shares adds 100 shares of volume, rather than 200 because both a buyer and seller participated. The bars below a price chart summarize this activity.', 'Volume and liquidity are related concepts, but they are not synonyms. Liquidity concerns the ability to transact at a reasonable cost and with limited price impact. A daily volume total does not, by itself, describe the spread or depth available at this moment.'] },
        { title: 'Use a fair comparison', paragraphs: ['A million shares might be unusual for one stock and routine for another. Compare activity with the same stock’s recent history and a similar interval. Intraday comparisons should consider time of day rather than comparing an unfinished morning with a full session.', 'For a fictional example, today’s 2 million shares divided by a previous 20-session average of 1 million gives a ratio of 2.0. This describes activity relative to that baseline. It does not prove the next price move.'] },
        { title: 'Avoid a story the data cannot support', paragraphs: ['Every completed trade has a buyer and a seller. A high-volume rise can be described as a rise accompanied by unusually active trading. Calling it proof that informed investors are accumulating shares goes beyond what these bars reveal. News, rebalancing, and other events can also change volume.'] }
      ],
      example: { title: 'The same breakout, different participation', text: 'Compare two fictional moves above $50. One trades 0.8 times its normal daily volume; the other trades 2.0 times. The second has greater relative participation. Both can fail, and neither comparison establishes a tested trading edge.' },
      exercise: 'Find an interval with a tall volume bar in the illustration. Describe price and volume without assigning motives to buyers or sellers.',
      quiz: { question: 'What does a high-volume price rise establish?', options: ['There were no sellers.', 'The next session will rise.', 'Price rose during an interval with relatively high trading activity.'], answer: 2, explanation: 'It describes activity and price over the observed interval. Motives and future returns require additional evidence.' }, sources: ['volume'], related: ['support-resistance', 'testing']
    },
    {
      id: 'trends', title: 'Trends & market structure', subtitle: 'Follow the sequence of swings, rather than the last exciting candle.', minutes: 3, status: 'starter', diagram: 'trend', tags: ['uptrend', 'downtrend', 'swing', 'higher high', 'higher low'],
      takeaway: 'A trend describes a sequence on a chosen timeframe. Always name that timeframe.',
      sections: [
        { title: 'Read the sequence', paragraphs: ['A common description of an uptrend is a sequence of higher swing highs and higher swing lows. A downtrend has lower highs and lower lows. A range has overlapping movement without a clear directional sequence. A swing is a local turning area; identifying it depends on your observation rule and interval.', 'In a fictional series, peaks at $42, $46, and $49 with intervening troughs at $39 and $43 describe rising structure. One red candle within that sequence does not, on its own, erase the larger pattern.'] },
        { title: 'Your timeframe changes the view', paragraphs: ['A daily pullback can sit inside a rising weekly trend. Rather than deciding one chart is “the truth,” say what each interval describes. Consistent language makes it easier to compare two analyses and understand why they differ.'] },
        { title: 'Be honest about hindsight', paragraphs: ['The final swing high is easy to identify after a decline. At the time, you may not know that a high is finished. If you build a rule around confirmed swings, record how many later bars you need to confirm them. A test must respect that delay.', 'Trend lines are visual aids connecting selected turning points. They are sensitive to your choices. Crossing one is an event to investigate, not a universal definition of a reversal.'] }
      ],
      example: { title: 'A broken sequence is a question', text: 'After higher lows at $39 and $43, price closes at $42. Your earlier structure has weakened. That does not establish a new downtrend by itself. Write down what additional evidence would support a reversal or a temporary interruption.' },
      exercise: 'Switch the trend experiment between rising, falling, and ranging data. Name the swing sequence you see before reading its label.',
      quiz: { question: 'What is the most precise description?', options: ['This stock is always bullish.', 'The daily chart currently shows higher swing highs and lows.', 'A red candle means the weekly trend has reversed.'], answer: 1, explanation: 'It names the timeframe and describes visible structure without making a permanent or unsupported claim.' }, sources: ['trends'], related: ['support-resistance', 'moving-averages']
    },
    {
      id: 'support-resistance', title: 'Support & resistance', subtitle: 'Map areas of interest, then leave room for being wrong.', minutes: 3, status: 'starter', diagram: 'levels', tags: ['support', 'resistance', 'zone', 'breakout'],
      takeaway: 'A price zone is a place to observe behavior, not a barrier that price must obey.',
      sections: [
        { title: 'Areas with a history', paragraphs: ['Support describes an area where declines have previously met enough demand to interrupt the move. Resistance describes an area where advances have previously met enough supply to interrupt the move. These are descriptions of behavior, not guarantees of a future response.', 'Use a zone when past reactions cluster around slightly different prices. Precision on your screen does not mean the market recognizes an exact line. Document how you chose the area so another reader can reproduce your method.'] },
        { title: 'Separate a touch from a rule', paragraphs: ['Consider fictional reactions around $49–$51. You might label that an area of resistance. Now specify what “breakout” means for your question: an intraday print above $51, a daily close above $51, or something else? Different definitions produce different observations.', 'A move through the area can continue or reverse. Analysts sometimes look for former resistance to act as support on a later return. That is a hypothesis to observe and test, rather than a requirement.'] },
        { title: 'What would change your view?', paragraphs: ['Before looking at the next candle, write what would weaken your interpretation. If every outcome is explained as confirming the same idea, the idea cannot be meaningfully tested. A well-defined invalidation condition makes learning possible.'] }
      ],
      example: { title: 'Do not redraw the past to fit the result', text: 'Mark your $49–$51 zone before revealing later prices. If price falls after touching $52, record the miss under your original definition. Quietly expanding the zone afterward makes the illustration look better and the method less useful.' },
      exercise: 'Toggle the zones on the illustration. Explain why a zone conveys uncertainty better than an infinitely thin line in this example.',
      quiz: { question: 'What should a support zone mean?', options: ['A price area where prior declines encountered demand.', 'A guaranteed floor.', 'A place to buy regardless of risk.'], answer: 0, explanation: 'It summarizes prior reactions. Future reactions, execution, and risk are separate questions.' }, sources: ['levels'], related: ['trends', 'risk-sizing']
    },
    {
      id: 'moving-averages', title: 'Moving averages', subtitle: 'Smooth the noise. Notice the delay.', minutes: 4, status: 'starter', diagram: 'average', tags: ['SMA', 'EMA', 'moving average', 'lag', 'indicator'],
      takeaway: 'Smoothing reduces short-term variation by using past data. It cannot remove uncertainty about future prices.',
      sections: [
        { title: 'Make the calculation tangible', paragraphs: ['An N-period simple moving average (SMA) is the arithmetic mean of the most recent N prices. This experiment uses closing prices. For closes of $10, $11, $12, $13, and $14, a five-period SMA is $12. After a new $15 close, drop $10: the average becomes $13.', 'Before N observations exist, this edition leaves the SMA undefined. Charting platforms can differ in warm-up and price-field conventions, so check the settings before comparing results.'] },
        { title: 'The tradeoff you can see', paragraphs: ['A shorter lookback responds more quickly to recent price changes. A longer lookback smooths more variation but responds more slowly. Move the slider in the experiment and compare the two. Neither setting becomes “correct” simply because its line looks attractive.'] },
        { title: 'A crossing is an event, not a conclusion', paragraphs: ['Price crossing an average is an observable event. Whether a rule based on that event is useful requires a defined entry, exit, cost model, and test. Repeated crossings in a range can generate many reversals of a rule’s position.', 'An exponential moving average (EMA) weights recent observations more heavily. Its calculation and initialization deserve their own treatment in the full indicator chapter. Avoid treating several closely related averages as independent evidence.'] }
      ],
      example: { title: 'Do the first calculation yourself', text: 'In the lab, choose a five-session average. The line starts at session 5 because five closes are needed. Compare its first value with the average of the first five entries in the expandable data table.' },
      exercise: 'Choose 5, then 20 sessions. Where does the longer average react later to a change in direction? What information does it hide?',
      quiz: { question: 'The last five closes are $10, $11, $12, $13, and $14. What is the SMA?', options: ['$14', '$12', '$10'], answer: 1, explanation: 'Their sum is $60; dividing by five gives $12. Each observation receives equal weight.' }, sources: ['sma'], related: ['trends', 'testing']
    },
    {
      id: 'risk-sizing', title: 'Risk & position sizing', subtitle: 'Decide what a wrong idea could cost before focusing on what it could earn.', minutes: 4, status: 'starter', diagram: 'risk', tags: ['risk', 'position sizing', 'stop', 'drawdown', 'capital'],
      takeaway: 'Position sizing connects a planned loss per share to a budget. Actual losses can exceed the plan.',
      sections: [
        { title: 'Define the hypothetical trade', paragraphs: ['For a simple long-stock example, let entry be $100 and planned exit if wrong be $95. Planned price risk is $5 per share. With a $200 risk budget, the simple calculation is floor($200 ÷ $5) = 40 shares. Their entry cost is $4,000.', 'This is arithmetic, not a recommended allocation. A usable plan also considers available capital, concentration, transaction costs, liquidity, and how the position relates to other positions. In our unleveraged lab, the result cannot exceed the available account balance.'] },
        { title: 'The planned exit is not a promise', paragraphs: ['A stop order generally becomes a market order when triggered; it does not guarantee a fill at the stop price. Gaps and fast markets can produce a different execution price. A stop-limit order constrains price but may not execute.', 'If the 40-share example instead exits at $90 after a gap, the price loss is $400 before fees. The original $200 budget was a planning estimate. This distinction belongs in the analysis itself.'] },
        { title: 'Measure a sequence, too', paragraphs: ['A plan should examine losses across a series of trades, not only one carefully chosen example. Several positions can move together. Repeating a small per-trade budget does not automatically produce a small portfolio loss.'] }
      ],
      example: { title: 'Planned risk and capital are different limits', text: 'With $1,000 cash, a $100 entry, and a $95 planned stop, a $200 risk budget implies 40 shares—but cash only allows 10. The lab uses the smaller limit. Those 10 shares have a planned price risk of $50 before fees and gaps.' },
      exercise: 'Keep the risk budget fixed and move the stop closer to entry. The risk-based share count rises. Explain why a tighter stop does not, by itself, improve a strategy.',
      quiz: { question: 'A planned stop is $95. What price is guaranteed if it triggers?', options: ['$95 exactly.', 'At least $95.', 'No exact execution price is guaranteed by a stop-market order.'], answer: 2, explanation: 'Triggering and execution are different events. The actual market price can differ from the stop price.' }, sources: ['orders'], related: ['testing', 'support-resistance']
    },
    {
      id: 'testing', title: 'Evidence before conviction', subtitle: 'An appealing chart is the beginning of an investigation.', minutes: 4, status: 'starter', diagram: 'testing', tags: ['backtest', 'evidence', 'bias', 'overfitting', 'look-ahead', 'survivorship'],
      takeaway: 'A historical result is a measurement under assumptions, not a promise about future returns.',
      sections: [
        { title: 'Turn the story into a rule', paragraphs: ['“Buy strong stocks” is too vague to test. Specify the universe, the available data, the signal, when the trade can execute, position size, and exit conditions. Save the rules before examining the result.', 'If the signal needs today’s closing price, do not assume you could observe the final close and already have traded at that price without an explicitly justified execution model. Timing is part of the strategy.'] },
        { title: 'Three ways a test can fool you', paragraphs: ['Look-ahead bias uses information unavailable at the decision time. Survivorship bias omits securities that disappeared from the current universe. Overfitting tunes rules to historical accidents. A visually impressive result can contain all three.', 'Use a documented, point-in-time universe and data treatment. Separate rule development from evaluation on held-out data. If you repeatedly inspect and tune against that evaluation set, it is no longer untouched.'] },
        { title: 'Ask what the result left out', paragraphs: ['Backtested performance is hypothetical. Costs, spreads, gaps, data quality, and execution assumptions matter. Compare with an appropriate benchmark and look at the loss path, not just a final return. A method can have a positive return and still be unattractive after costs or relative to a simpler alternative.', 'For the full textbook, each strategy example needs a reproducible specification, failure cases, and an evidence discussion. A handful of winning chart screenshots cannot substitute for that work.'] }
      ],
      example: { title: 'A future high cannot trigger a past trade', text: 'A rule buys “two days before a local high.” That high is only recognizable after later prices arrive. Unless the rule uses an independently available forecast, it asks a historical test to know the future.' },
      exercise: 'Write an entry rule that another person could implement without asking you what “good-looking” means. List the information it needs and when that information becomes available.',
      quiz: { question: 'Which decision introduces look-ahead bias?', options: ['Buying at tomorrow’s open after observing today’s close.', 'Choosing a universe using records available at the time.', 'Buying before a high because later candles confirm it was a high.'], answer: 2, explanation: 'The confirmation comes from future data. A historical trade cannot use that confirmation before it exists.' }, sources: ['performance'], related: ['risk-sizing', 'moving-averages']
    },
    ...[
      ['timeframes', 'Timeframes, sessions & chart scales', 'Daily versus intraday bars; regular and extended sessions; linear and logarithmic scales; split-adjusted and total-return series.'],
      ['candlestick-patterns', 'Candlestick patterns in context', 'Doji, hammer, engulfing patterns; objective definitions; trend context; failed examples; empirical limitations.'],
      ['chart-patterns', 'Classical chart patterns', 'Ranges, triangles, flags, double tops and bottoms, head and shoulders; measurable rules; ambiguity and failed patterns.'],
      ['breakouts', 'Breakouts, pullbacks & failed moves', 'Define a breakout; retests; gaps; false breaks; trade execution; avoid selecting only successful examples.'],
      ['momentum', 'Momentum: RSI, MACD & stochastics', 'Exact formulas and initialization; bounded versus unbounded measures; divergence; persistent extremes; correlated signals.'],
      ['volatility', 'Volatility: ATR & Bollinger Bands', 'True range; smoothing; dispersion; gap risk; volatility regimes; distinguish a band touch from a trading edge.'],
      ['volume-tools', 'OBV, VWAP & volume profile', 'Calculation conventions; session resets; anchored VWAP; feed completeness; what volume cannot reveal.'],
      ['fibonacci', 'Retracements & measured moves', 'Construction, anchor sensitivity, common ratios, evidence quality, and alternatives to subjective level selection.'],
      ['relative-strength', 'Relative strength & sector context', 'Stock-to-benchmark ratios; relative versus absolute performance; distinction from RSI; sector comparisons.'],
      ['breadth', 'Market breadth & participation', 'Advance/decline measures; new highs and lows; percent above averages; universe choices and survivorship.'],
      ['multi-timeframe', 'Working across timeframes', 'Top-down context; conflicting signals; bar aggregation; only use completed information at each decision time.'],
      ['events', 'Earnings, gaps & corporate actions', 'Earnings calendars, dividends, stock splits, halts, gaps, adjusted data, and overnight risk.'],
      ['market-microstructure', 'Liquidity & market microstructure', 'Bid/ask spread, depth, slippage, order types, execution uncertainty, and limits of daily bars.'],
      ['trade-plans', 'From an observation to a trade plan', 'Setup, trigger, invalidation, sizing, exits, correlation, capital limits, and a pre-trade decision record.'],
      ['psychology', 'Judgment, uncertainty & trading psychology', 'Confirmation bias, loss aversion, recency, outcome bias, probabilistic language, and structured review.'],
      ['journaling', 'A useful trading journal', 'Record decisions before outcomes; distinguish rule adherence from profitability; review errors and opportunity costs.'],
      ['statistics', 'Expectancy, drawdowns & uncertainty', 'Return distributions, sample size, confidence intervals, autocorrelation, risk of ruin, and multiple testing.'],
      ['system-design', 'Designing & validating a system', 'Point-in-time data; walk-forward evaluation; cost sensitivity; regime dependence; reproducible specifications.'],
      ['classical-frameworks', 'Dow, Wyckoff & Elliott: a critical survey', 'Historical context; precise versus discretionary interpretations; evidence quality; disagreements and limits.'],
      ['case-studies', 'Annotated stock case studies', 'Licensed historical data; known timestamps; bullish, bearish, range, and failed setups; hindsight controls.']
    ].map(([id, title, outline]) => ({ id, title, subtitle: outline, status: 'planned', tags: outline.toLowerCase().split(/[;,]/), outline }))
  ],
  glossary: [
    ['Backtest', 'A simulation of a defined rule using historical data. Its result depends on the data, timing, costs, and execution assumptions.', 'testing'],
    ['Breakout', 'A move beyond a previously defined price area. A useful rule specifies what counts as crossing it.', 'support-resistance'],
    ['Candlestick', 'A chart mark summarizing open, high, low, and close for one interval.', 'chart-anatomy'],
    ['Close', 'The final recorded price for the chosen interval and session convention.', 'chart-anatomy'],
    ['Drawdown', 'A decline from a prior peak in the value of an account or strategy.', 'risk-sizing'],
    ['EMA', 'Exponential moving average: an average that assigns greater weight to recent observations.', 'moving-averages'],
    ['Gap', 'A discontinuity between price intervals, such as an opening price beyond the prior session’s range.', 'risk-sizing'],
    ['Liquidity', 'The ability to transact with limited cost and price impact; volume alone is not a complete measure.', 'volume'],
    ['Look-ahead bias', 'Using information in a historical decision before that information would have been available.', 'testing'],
    ['OHLC', 'Open, high, low, and close: four prices that summarize an interval.', 'chart-anatomy'],
    ['Overfitting', 'Adapting a rule to historical noise so closely that its apparent success may not generalize.', 'testing'],
    ['Resistance', 'An area where previous advances have encountered enough supply to interrupt them.', 'support-resistance'],
    ['Risk budget', 'An amount selected for a planned loss calculation. Actual losses can exceed it.', 'risk-sizing'],
    ['SMA', 'Simple moving average: the arithmetic mean of a fixed number of recent observations.', 'moving-averages'],
    ['Stop order', 'An order triggered at a specified price; a stop-market order does not guarantee that execution price.', 'risk-sizing'],
    ['Support', 'An area where previous declines have encountered enough demand to interrupt them.', 'support-resistance'],
    ['Survivorship bias', 'Distortion caused by leaving failed, delisted, or otherwise missing securities out of historical study.', 'testing'],
    ['Timeframe', 'The time interval represented by each chart bar or candle.', 'chart-anatomy'],
    ['Trend', 'A description of the direction of price structure over a chosen timeframe.', 'trends'],
    ['Volume', 'The number of shares traded over a specified interval.', 'volume']
  ]
};
