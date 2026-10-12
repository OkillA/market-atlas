#!/usr/bin/env python3
"""Independent reproduction of the Part 6 ("Question, test, refine") cumulative review.

Run from the repository root:
    python3 -I docs/publication-batch7-assets/part6-reproduce.py

Reads only docs/publication-batch7-assets/compiled.json (extracted from the
shipping content/book.js). Every number in the three task prompts/solutions is
recomputed with exact Fraction/Decimal arithmetic and compared against the text.
Rule references are checked against the compiled Chapter 24-28 text the tasks
depend on. Observations that are not arithmetic mismatches (wording, rounding
convention, terminology) are reported separately and do not fail the run.
"""
import json
import math
import re
import sys
from decimal import Decimal, ROUND_DOWN, ROUND_HALF_UP
from fractions import Fraction as F
from pathlib import Path

ROOT = Path.cwd()
DATA = ROOT / "docs/publication-batch7-assets/compiled.json"
d = json.loads(DATA.read_text(encoding="utf-8"))
tasks = d["partPractice"]["tasks"]
chapters = {c["id"]: c for c in d["chapters"]}

counts = {"numeric": 0, "text": 0, "structural": 0}
mismatches = []
observations = []


def numeric(label, got, expected, tol=F(0)):
    counts["numeric"] += 1
    if abs(F(got) - F(expected)) > tol:
        mismatches.append(f"NUMERIC {label}: computed {float(got)!r}, text {float(expected)!r}")


def text(label, haystack, needle):
    counts["text"] += 1
    if needle not in haystack:
        mismatches.append(f"TEXT {label}: {needle!r} not found")


def structural(label, cond):
    counts["structural"] += 1
    if not cond:
        mismatches.append(f"STRUCT {label}")


def cents(x):
    return Decimal(x.numerator) / Decimal(x.denominator)


def floor_cent(x):
    return F(cents(F(x)).quantize(Decimal("0.01"), rounding=ROUND_DOWN))


def money(x):
    return f"{cents(F(x)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP):,}"


def plain(s):
    return s.replace("−", "-").replace("×", "x")


def chapter_text(cid):
    return json.dumps(chapters[cid], ensure_ascii=False)


# ---------------------------------------------------------------- structure
structural("Part id is advanced", d["part"]["id"] == "advanced")
structural("Part chapter order 24-28",
           d["part"]["chapters"] == ["testing", "statistics", "system-design", "classical-frameworks", "case-studies"])
structural("three tasks", len(tasks) == 3)
titles = [t["title"] for t in tasks]
structural("task titles preserved", titles == [
    "Convert a performance claim into checkable arithmetic",
    "Allocate simultaneous candidates",
    "Identify the research clock",
])
for t in tasks:
    structural(f"'{t['title']}' has no input tables (all inputs inline)", not t.get("tables"))
    structural(f"'{t['title']}' has a non-empty concealed solution", bool(t["solution"]) and all(s.strip() for s in t["solution"]))

# ---------------------------------------------------------------- Task 1
t1q, t1s = plain(tasks[0]["question"]), plain(" ".join(tasks[0]["solution"]))
R = F(80); n = 10; cost = F(4); start = F(10000)
outcomes_gross = [F(2)] * 4 + [F(-1)] * 5 + [F(-2)]
for needle in ["10 nonoverlapping trades", "1R $80", "four gross +2R", "five -1R", "one -2R gap",
               "$4/trade", "$10,000", "fixed-dollar", "gross/net expectancy", "net account return",
               "flat break-even cost", "Can it validate the rule?"]:
    text("T1 prompt input", t1q, needle)
structural("T1 prompt no longer says 'total return'", "total return" not in t1q.lower())
structural("T1 outcome count equals stated trades", len(outcomes_gross) == n)
gross_R = sum(outcomes_gross)
numeric("T1 gross R (8-5-2)", gross_R, 1)
numeric("T1 gross R components", F(8) - 5 - 2, gross_R)
numeric("T1 gross $", gross_R * R, 80)
total_cost = cost * n
numeric("T1 costs $", total_cost, 40)
numeric("T1 costs in R", total_cost / R, F(1, 2))
net_dollars = gross_R * R - total_cost
numeric("T1 net $", net_dollars, 40)
numeric("T1 net R", net_dollars / R, F(1, 2))
numeric("T1 gross expectancy", gross_R / n, F(1, 10))
numeric("T1 net expectancy", (net_dollars / R) / n, F(5, 100))
net_R_list = [g - cost / R for g in outcomes_gross]
numeric("T1 net expectancy, direct per-trade average", sum(net_R_list) / n, F(5, 100))
numeric("T1 net account return %", net_dollars / start * 100, F(4, 10))
numeric("T1 gross account return %", gross_R * R / start * 100, F(8, 10))
numeric("T1 flat break-even $/round trip", gross_R * R / n, 8)
numeric("T1 break-even equals gross $ expectancy", gross_R * R / n, gross_R / n * R)
numeric("T1 break-even / assumed cost = 2", (gross_R * R / n) / cost, 2)
eq = start
for x in net_R_list:
    eq += x * R
numeric("T1 ending equity", eq, start + 40)
# Per-trade net R values quoted in the solution.
numeric("T1 winner net R +1.95", F(2) - cost / R, F(195, 100))
numeric("T1 stop net R -1.05", F(-1) - cost / R, F(-105, 100))
numeric("T1 gap net R -2.05", F(-2) - cost / R, F(-205, 100))
# Chapter 25 uncertainty arithmetic.
mean = sum(net_R_list) / n
var = sum((x - mean) ** 2 for x in net_R_list) / (n - 1)
numeric("T1 sample variance net R (24.9/9)", var, F(249, 90))
sd = math.sqrt(var); se = sd / math.sqrt(n)
r2 = lambda x: F(round(x, 2)).limit_denominator(100)
numeric("T1 sample SD about 1.66R", r2(sd), F(166, 100))
numeric("T1 SE about 0.53R", r2(se), F(53, 100))
numeric("T1 band low about -1.00R", r2(float(mean) - 2 * se), F(-100, 100))
numeric("T1 band high about +1.10R", r2(float(mean) + 2 * se), F(110, 100))
structural("T1 band includes zero", float(mean) - 2 * se < 0 < float(mean) + 2 * se)
drop_winner = (sum(net_R_list) - F(195, 100)) / 9
numeric("T1 drop-one-winner mean -0.16R", r2(float(drop_winner)), F(-16, 100))
for needle in ["Gross R = 8-5-2 = 1R", "gross $80", "Costs $40 = 0.5R", "net $40 = 0.5R",
               "gross expectancy 0.10R", "net 0.05R", "Net account return $40 ÷ $10,000 = 0.4% (gross 0.8%)",
               "break-even $80 ÷ 10 = $8 per round trip", "not merely because the data are invented",
               "+1.95 (x4), -1.05 (x5) and -2.05", "SD is about 1.66R", "standard error about 0.53R",
               "about -1.00R to +1.10R", "includes zero", "mean -0.16R", "only twice the assumed $4 cost",
               "no comparator or independent window"]:
    text("T1 solution", t1s, needle)
st, te = plain(chapter_text("statistics")), plain(chapter_text("testing"))
text("Ch25 teaches direct-average expectancy", st, "total net R ÷ number of trades")
text("Ch25 defines account return", st, "Account return (ending equity ÷ starting equity - 1) is $605 ÷ $20,000")
text("Ch25 teaches the +/-2 SE band", st, "plus or minus two standard errors")
text("Ch24 teaches flat break-even = gross / trades", te, "gross profit ÷ number of trades")
structural("Ch25 no longer uses 'total return' for the equity change", "total return" not in st.lower())

# ---------------------------------------------------------------- Task 2
t2q, t2s = plain(tasks[1]["question"]), plain(" ".join(tasks[1]["solution"]))
E, cash, risk_pct, notional_pct, stop_dist, fee = F(50000), F(12000), F(5, 1000), F(10, 100), F(2), F(5, 2)
for needle in ["equity E = $50,000", "$12,000 is cash", "four held positions have risen since entry",
               "they occupy four of the five slots", "$2 stop distance", "0.5% price-risk allowance",
               "10% notional cap measured at the limit price", "(cash - $2.50 entry fee) ÷ limit",
               "A: close 40.00, prior-20 high 39.00", "B: close 20.40, prior-20 high 20.00",
               "100 x (close - prior-20 high) ÷ prior-20 high, rounded to 0.01 percentage point",
               "close x 1.01, rounded down to the cent"]:
    text("T2 prompt input", t2q, needle)
A_close, A_high, B_close, B_high = F(40), F(39), F(2040, 100), F(20)
mA = 100 * (A_close - A_high) / A_high
mB = 100 * (B_close - B_high) / B_high
numeric("T2 A raw margin 2.5641 (4dp)", F(round(float(mA), 4)).limit_denominator(10000), F(25641, 10000))
numeric("T2 B margin 2.00%", mB, 2)
def rule_round(m):
    return F(str(cents(m).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)))
numeric("T2 A rule-rounded margin 2.56%", rule_round(mA), F(256, 100))
numeric("T2 B rule-rounded margin 2.00%", rule_round(mB), 2)
structural("T2 A ranks first on the rule-rounded margin", rule_round(mA) > rule_round(mB))
LA = floor_cent(A_close * F(101, 100)); LB = floor_cent(B_close * F(101, 100))
numeric("T2 A limit $40.40", LA, F(4040, 100))
numeric("T2 B limit (not needed; completeness)", LB, F(2060, 100))
risk_allow = math.floor(risk_pct * E / stop_dist)
notional_allow = math.floor(notional_pct * E / LA)
cash_allow = math.floor((cash - fee) / LA)
numeric("T2 risk budget $250", risk_pct * E, 250)
numeric("T2 risk allowance 125", risk_allow, 125)
numeric("T2 notional $5,000", notional_pct * E, 5000)
numeric("T2 notional allowance 123", notional_allow, 123)
numeric("T2 cash numerator $11,997.50", cash - fee, F(1199750, 100))
numeric("T2 cash allowance 296", cash_allow, 296)
qty = min(risk_allow, notional_allow, cash_allow)
numeric("T2 order quantity 123", qty, 123)
structural("T2 binding allowance is notional", qty == notional_allow and notional_allow < risk_allow < cash_allow)
planned_1R = qty * stop_dist
numeric("T2 planned 1R $246", planned_1R, 246)
structural("T2 planned 1R within $250 budget", planned_1R <= risk_pct * E)
reserve = qty * LA + fee
numeric("T2 reserve $4,971.70", reserve, F(497170, 100))
numeric("T2 available $7,028.30", cash - reserve, F(702830, 100))
structural("T2 B inside $20-$100 price band", F(20) <= B_close <= F(100))
structural("T2 A inside $20-$100 price band", F(20) <= A_close <= F(100))
for needle in ["100 x (40.00 - 39.00) ÷ 39.00 = 2.5641..., which rounds to 2.56%",
               "100 x 0.40 ÷ 20.00 = 2.00%", "A ranks first", "40.00 x 1.01 = $40.40",
               "floor(0.5% x $50,000 ÷ $2) = floor(250 ÷ 2) = 125 shares",
               "floor($5,000 ÷ $40.40) = 123", "floor($11,997.50 ÷ $40.40) = 296",
               "the notional cap binds", "planned 1R = 123 x $2 = $246, inside the $250 budget",
               "123 x $40.40 + $2.50 = $4,971.70", "leaving $7,028.30 available",
               "B stays eligible but gets no slot and is not re-offered"]:
    text("T2 solution", t2s.replace("…", "..."), needle)
sd_txt = plain(chapter_text("system-design"))
for needle in ["rounded to 0.01 percentage point; larger ranks first",
               "1.01 x signal close, rounded down to the cent",
               "floor(0.5% x E ÷ $2.00) shares",
               "floor(10% x E ÷ L) shares",
               "floor((cash - cash already reserved at this close - $2.50) ÷ L) shares",
               "Smallest of the three allowances",
               "Shares x L + $2.50, held from order placement",
               "Not re-offered. A stock needs a new signal at a later close.",
               "1R = filled shares x $2.00, frozen at the fill",
               "At most 5 = open positions"]:
    text("Ch26 rule used by T2", sd_txt, needle)
structural("T2 is not a copy of the D0 worked example", "32.27" not in t2q and "100,000" not in t2q)
text("Ch26 opening now points to Chapter 24's one-trade study", sd_txt, "Chapter 24 tested a twenty-session breakout signal one trade at a time")
structural("Ch26 no longer claims earlier chapters described Atlas-20", "Earlier chapters described" not in sd_txt)

# ---------------------------------------------------------------- Task 3
t3q, t3s = plain(tasks[2]["question"]), plain(" ".join(tasks[2]["solution"]))
for needle in ["logs six variants on 2015-19 data", "locks one by a pre-written rule",
               "+0.02R over 14 trades", "After charting the held-out losers",
               "at least 1% below range support frozen before that low", "within the breach session or the next three sessions", "no later than the breakout's decision close",
               "+0.31R over 8 trades", "Chapter 25's independence model", "5% test"]:
    text("T3 prompt", t3q.replace("–", "-").replace("’", "'"), needle)
structural("T3 meta-question about Chapter 27 removed", "Chapter 27" not in t3q and "core path" not in t3q)
structural("T3 prompt self-contained (no undefined 'spring')", "spring" not in t3q.lower())
n_variants = 6 + 1
numeric("T3 variant count 7", n_variants, 7)
p7 = 1 - F(95, 100) ** n_variants
numeric("T3 1-0.95^7 = 0.302 (3dp)", F(round(float(p7), 3)).limit_denominator(1000), F(302, 1000))
numeric("T3 about 30%", F(round(float(p7) * 100)), 30)
p6 = 1 - F(95, 100) ** 6
numeric("Ch25 1-0.95^6 about 26%", F(round(float(p6) * 100)), 26)
structural("T3 search growth raises the familywise figure", p7 > p6)
numeric("T3 filter removed trades (14 -> 8)", 14 - 8, 6)
for needle in ["+0.02R over 14 trades, stays the held-out result for v1", "development evidence for a new version, v2",
               "it is not a held-out test", "Seven variants", "1 - 0.95⁷ ≈ 0.302, about 30%",
               "variants that share trades make the true figure different",
               "known only at the close that returns above support", "using it earlier is look-ahead",
               "Only a fresh window or a paper forward study",
               "freeze the filter definition and its recognition time, the comparator (v1 on the same window), the cost model and the decision criteria"]:
    text("T3 solution", t3s.replace("–", "-"), needle)
text("Ch25 multiple-testing passage", st, "1 - 0.95⁶ ≈ 26%")
structural("T3 no longer mirrors the Ch24 quiz numbers", "30 sessions" not in t3q and "Six variants were logged" not in t3q)
cf, cs = plain(chapter_text("classical-frameworks")), plain(chapter_text("case-studies"))
structural("Ch27 is optional", chapters["classical-frameworks"]["optional"] is True)
text("Ch27 states nothing later in the core path depends on it", cf, "Nothing later in the core path depends on it")
structural("Ch28 prerequisites exclude Ch27", "classical-frameworks" not in chapters["case-studies"]["prerequisites"])
text("Ch28 restates the breach definition inline", cs, "a breach is a completed session whose low is at least 1% below support")
text("Ch28 RR1 window includes the breach session's own close", cs, "from the breach session's own close through the next three sessions".replace("'", "’"))
text("Ch27 window includes the breach session's own close", cf, "counting from the breach session’s own close through the three sessions after it")
text("Ch27 'Chapter 9' capitalized", cf, "breakout plan in Chapter 9")
structural("Ch27 lowercase 'chapter 9' removed", "breakout plan in chapter 9" not in cf)
text("Ch25 appendix naming", st, "Research and evidence appendix at the end of the book")
if "research section" in st:
    observations.append("Ch25 evidence[7].claim still says 'summarized in the research section' (residual of finding 8).")
if "a later close within three sessions" in t3q:
    observations.append("T3 filter window ('a later close within three sessions returned above it') differs from Ch27/Ch28's window, which counts the breach session's own close and requires a close strictly above support.")
if "rounded down" not in t2q.split("cash allowance")[1][:80] and "floor" not in t2q:
    observations.append("T2 prompt states no whole-share rounding for the allowances and no reservation formula (shares x limit + $2.50); both come only from Ch26.")

# ---------------------------------------------------------------- report
print(f"Part 6 reproduction: {counts['numeric']} exact numeric comparisons, {counts['text']} text checks, "
      f"{counts['structural']} structural checks; {len(mismatches)} mismatches.")
for m in mismatches:
    print("  MISMATCH", m)
print(f"Observations (not arithmetic errors): {len(observations)}")
for o in observations:
    print("  -", o)
sys.exit(1 if mismatches else 0)
