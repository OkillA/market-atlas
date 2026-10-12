"""Independent reproduction of Chapter 24 (`testing`) numbers.

Run from the repository root:
    python3 -I docs/publication-batch7-assets/testing-reproduce.py

Reads only docs/publication-batch7-assets/compiled-testing.json (plus content/*.json
for cross-reference ID existence). Every number is recomputed with Fraction/Decimal
from the stated inputs and compared with the shipped text, tables and figures.
This script does not reuse scripts/verify-revision.cjs.
"""
import glob
import json
import os
import re
import sys
from decimal import Decimal, ROUND_HALF_UP, ROUND_FLOOR
from fractions import Fraction as F

ROOT = os.getcwd()
PATH = os.path.join(ROOT, "docs", "publication-batch7-assets", "compiled-testing.json")
data = json.load(open(PATH, encoding="utf-8"))
ch = data["chapter"]
srcs = data["sources"]

counts = {"numeric": 0, "text": 0, "structural": 0}
mismatches = []


def check(kind, ok, label):
    counts[kind] += 1
    if not ok:
        mismatches.append(f"[{kind}] {label}")


def num(s):
    """Parse a displayed number such as '+1,600.00', '−18.25', '50.70 (S+1 open)'."""
    if isinstance(s, (int, float)):
        return F(str(s))
    s = str(s).replace("−", "-").replace(",", "").replace("$", "").replace("+", "").strip()
    m = re.match(r"-?\d+(\.\d+)?", s)
    return F(m.group(0))


def d2(x, places="0.01"):
    """Round half away from zero (displayed convention) to the given places."""
    d = Decimal(x.numerator) / Decimal(x.denominator)
    return F(str(d.quantize(Decimal(places), rounding=ROUND_HALF_UP)))


def eqnum(label, computed, shown, places="0.01"):
    check("numeric", d2(F(computed), places) == d2(num(shown), places),
          f"{label}: computed {float(computed):.6f} vs shown {shown}")


def has(label, text, token):
    check("text", token in text, f"{label}: missing token {token!r}")


def money(x):
    """Format like the book: $1,234.56 with U+2212 for negatives."""
    q = d2(F(x))
    sign = "−" if q < 0 else ""
    return f"{sign}${abs(Decimal(q.numerator) / Decimal(q.denominator)):,.2f}"


secs = {s["id"]: s for s in ch["sections"]}
P = lambda sid, i: secs[sid]["paragraphs"][i]
alltext = json.dumps(ch, ensure_ascii=False)

# ---------------------------------------------------------------- structure
check("structural", len(ch["sections"]) == 9, "nine sections")
check("structural", ch["quiz"]["answer"] == 1 and len(ch["quiz"]["options"]) == 3
      and len(ch["quiz"]["feedback"]) == 3, "quiz answer index/option/feedback counts")
check("structural", ch["quiz"]["feedback"][1].startswith("Correct"), "feedback for answer index marked correct")
check("structural", all(not fb.startswith("Correct") for i, fb in enumerate(ch["quiz"]["feedback"]) if i != 1),
      "only the answer option is marked correct")
for sid in ch["sources"]:
    check("structural", sid in srcs, f"source {sid} present in compiled records")
for ev in ch["evidence"]:
    for sid in ev["sourceIds"]:
        check("structural", sid in ch["sources"], f"evidence source {sid} listed in chapter sources")
known_ids = set()
for f in glob.glob(os.path.join(ROOT, "content", "*.json")):
    try:
        dd = json.load(open(f, encoding="utf-8"))
    except Exception:
        continue
    if isinstance(dd, dict):
        for c in dd.get("chapters", []):
            known_ids.add(c.get("id"))
for cid in ch["prerequisites"] + ch["related"]:
    check("structural", cid in known_ids, f"cross-reference chapter id {cid} exists")
for fig in [ch["figure"]] + ch["figures"]:
    check("structural", 0 <= fig.get("afterSection", 0) < len(ch["sections"]), f"figure {fig['title']} afterSection in range")

# ---------------------------------------------------------------- spec / ceiling
spec = P("start-with-a-reproducible-question", 1)
has("spec", spec, "strictly above the highest high of days t−20 through t−1")
has("spec", spec, "floor($100 ÷ (entry − stop))")
# Revised 2026-10-12: one inclusive holding clock; halt rule after the exit definitions; sizing disclosure
has("spec", spec, "the close of holding session 10, counting the entry session as session 1")
has("spec", spec, "the E10 close, not E11")
check("text", "tenth session after entry" not in alltext, "no 'tenth session after entry' wording remains")
check("structural", spec.index("Exits:") < spec.index("E10 close") < spec.index("If a halt prevents"),
      "E10/halt sentences follow the exit definitions")
check("text", "E10" not in P("start-with-a-reproducible-question", 0), "paragraph 0 no longer carries the halt rule")
has("spec", spec, "Because the quantity uses the opening price itself, this is a signal-study simplification")
# Sizing at a ceiling above the open gives filled 1R below the $100 budget (worked on trade 1 inputs with a hypothetical ceiling)
q_ceil = int((F(100) / (F("50.30") - F("48.20"))).__floor__())
check("numeric", q_ceil * (F("50.20") - F("48.20")) < 100, "ceiling sizing → filled 1R below $100 when the open is lower")
ceiling_raw = F("50.40") * F(101, 100)
check("numeric", ceiling_raw == F("50.904"), "50.40 × 1.01 = 50.904")
ceiling = F(int((ceiling_raw * 100).__floor__()), 100)
check("numeric", ceiling == F("50.90"), "ceiling rounds down to 50.90")
has("look-ahead prose", P("use-only-information-that-existed-then", 1), "$50.904")

# ---------------------------------------------------------------- look-ahead table
la_sec = secs["use-only-information-that-existed-then"]
ohlc = {r[0]: tuple(F(x) for x in r[1:5]) for r in la_sec["tables"][0]["rows"]}
for day, (o, h, l, c) in ohlc.items():
    check("numeric", l <= min(o, c) and max(o, c) <= h, f"{day} OHLC geometry valid")
channel = F("50.00")
check("numeric", ohlc["S−1"][3] < channel, "S−1 close below 50.00")
check("numeric", ohlc["S−1"][1] < channel, "S−1 high below 50.00 (consistent with 50.00 lying in S−20..S−2)")
check("numeric", ohlc["S"][3] > channel, "S close strictly above 50.00")
check("numeric", ohlc["S+1"][0] <= ceiling, "S+1 open within ceiling")
la_text = " ".join(la_sec["paragraphs"])
for tok in ["$49.80", "$50.90", "$50.40", "$50.70", "$51.50", "50 shares"]:
    has("look-ahead prose", la_text, tok)
check("numeric", ohlc["S"][0] == F("49.80") and ohlc["S"][1] == F("50.90") and ohlc["S"][3] == F("50.40"),
      "prose S open/high/close agree with table")
check("numeric", ohlc["S+1"][0] == F("50.70") and ohlc["S+2"][3] == F("51.50"), "prose S+1 open and S+2 close agree with table")
shares = 50
exitp = ohlc["S+2"][3]
entries = {"A": ohlc["S+1"][0], "B": ohlc["S"][3], "C": ohlc["S"][0]}
gross_la = {k: shares * (exitp - e) for k, e in entries.items()}
impl = {r[0][0]: r for r in la_sec["tables"][1]["rows"]}
for k in "ABC":
    eqnum(f"impl {k} channel", channel, impl[k][1])
    eqnum(f"impl {k} entry", entries[k], impl[k][3])
    eqnum(f"impl {k} gross", gross_la[k], impl[k][4])
check("numeric", gross_la["A"] == 40 and gross_la["B"] == 55 and gross_la["C"] == 85, "A/B/C = $40/$55/$85")
has("prose", la_text, "50 × ($51.50 − $50.70) = $40")
has("prose", la_text, "reports $55")
has("prose", la_text, "It reports $85")
check("numeric", gross_la["C"] > 2 * gross_la["A"], "C is more than double A")
check("numeric", gross_la["B"] - gross_la["A"] == 15 and gross_la["C"] - gross_la["A"] == 45, "B overstates by $15, C by $45")
has("prose", la_text, "Implementation B overstates this trade by $15 and C by $45")
d_channel = max(channel, ohlc["S"][1])
eqnum("impl D channel = own high", d_channel, impl["D"][1])
check("numeric", ohlc["S"][3] < d_channel, "D: close below its own-bar channel")
check("text", impl["D"][2].startswith("No") and "50.40 < 50.90" in impl["D"][2], "D signal cell")
# Candle figure agrees with the table
cf = ch["figures"][1]
for cand, day in zip(cf["candles"], ["S", "S+1", "S+2"]):
    o, h, l, c = ohlc[day]
    check("numeric", (F(str(cand["open"])), F(str(cand["high"])), F(str(cand["low"])), F(str(cand["close"]))) == (o, h, l, c),
          f"candle {day} equals table")
check("numeric", F(str(cf["annotations"][0]["value"])) == ohlc["S"][3] and cf["annotations"][0]["index"] == 0, "candle annotation S close")
check("numeric", F(str(cf["annotations"][1]["value"])) == ohlc["S+1"][0] and cf["annotations"][1]["index"] == 1, "candle annotation S+1 open")
for tok in ["$50.40", "$50.00", "$50.70", "$49.80"]:
    has("candle caption", cf["caption"], tok)

# ---------------------------------------------------------------- survivorship
surv = P("preserve-the-original-opportunity-set", 1)
avg_all = (8 * F(12) + 2 * F(-70)) / 10
check("numeric", avg_all == F("-4.4"), "survivorship average −4.4%")
has("survivorship", surv, "= −4.4%")
has("survivorship", surv, "(96% − 140%)")
has("survivorship", surv, "reports +12%")

# ---------------------------------------------------------------- variant log and lock rule
vl = secs["do-not-hide-the-search-behind-the-winner"]["tables"][0]["rows"]
check("structural", len(vl) == 6, "six variants logged")
look = sorted({int(r[1]) for r in vl})
check("structural", look == [10, 20, 55] and len({r[2] for r in vl}) == 2, "3 lookbacks × 2 exit styles")
by_look = {}
for r in vl:
    by_look.setdefault(r[1], set()).add(r[3])
check("structural", all(len(v) == 1 for v in by_look.values()), "trade counts depend only on lookback (signal study)")
eligible = [r for r in vl if r[3] >= 30]
best = max(eligible, key=lambda r: num(r[4]))
check("numeric", best[0] == "v1-b" and num(best[4]) == F("0.21") and best[3] == 41, "lock rule selects v1-b (+0.21R, 41 trades)")
overall = max(vl, key=lambda r: num(r[4]))
check("numeric", overall[0] == "v1-c" and overall[3] == 22 and num(overall[4]) == F("0.34"), "most impressive is v1-c +0.34R, 22 trades")
for r in vl:
    status_ok = r[5].startswith("Excluded") == (r[3] < 30)
    check("text", status_ok, f"{r[0]} lock-rule status consistent with trade count")
vtext = " ".join(secs["do-not-hide-the-search-behind-the-winner"]["paragraphs"])
for tok in ["+0.34R", "22 trades", "+0.21R over 41 trades", "six variants", "12 trades", "+0.03R"]:
    has("variant prose", vtext, tok)

# ---------------------------------------------------------------- held-out ledger
ex = secs["execution-assumptions-belong-in-the-result"]
ledger, costt, tot = ex["tables"][0]["rows"], ex["tables"][1]["rows"], ex["tables"][2]["rows"]
check("structural", len(ledger) == 12 and len(costt) == 12, "12 ledger and cost rows")
A = lambda q: F(2)
B = lambda q: F(2) + F("0.04") * q
C = lambda q: F(2) + F("0.10") * q
calc = []
for row, crow in zip(ledger, costt):
    t, stock, e, s, q_shown, oneR_shown, x, typ, g_shown, gR_shown = row
    e, s, x = F(e), F(s), F(x)
    q = int((F(100) / (e - s)).__floor__())
    oneR = q * (e - s)
    g = q * (x - e)
    check("numeric", q == q_shown, f"trade {t} shares floor(100/(e−s))")
    eqnum(f"trade {t} 1R", oneR, oneR_shown)
    check("numeric", F(99) <= oneR <= F(100), f"trade {t} 1R about $100")
    eqnum(f"trade {t} gross", g, g_shown)
    eqnum(f"trade {t} gross R", g / oneR, gR_shown)
    target = e + 2 * (e - s)
    if typ.startswith("Target"):
        check("numeric", x == target, f"trade {t} target exit = entry + 2×risk")
    elif typ == "Stop":
        check("numeric", x == s, f"trade {t} stop exit at stop")
    elif typ.startswith("Gap"):
        check("numeric", x < s, f"trade {t} gap exit below stop")
    elif typ == "Time exit":
        check("numeric", s < x < target, f"trade {t} time exit strictly between stop and target")
    else:
        check("text", False, f"trade {t} unknown exit type {typ}")
    check("numeric", crow[0] == t and crow[1] == q, f"cost row {t} trade/shares")
    eqnum(f"trade {t} cost A", A(q), crow[2])
    eqnum(f"trade {t} cost B", B(q), crow[3])
    eqnum(f"trade {t} cost C", C(q), crow[4])
    eqnum(f"trade {t} net B", g - B(q), crow[5])
    eqnum(f"trade {t} net C", g - C(q), crow[6])
    eqnum(f"trade {t} net R C", (g - C(q)) / oneR, crow[7])
    calc.append(dict(t=t, stock=stock, e=e, s=s, q=q, oneR=oneR, g=g, x=x))

Q = sum(c["q"] for c in calc)
G = sum(c["g"] for c in calc)
costs = {"Gross": F(0), "A": sum(A(c["q"]) for c in calc), "B": sum(B(c["q"]) for c in calc), "C": sum(C(c["q"]) for c in calc)}
fn = {"Gross": lambda q: F(0), "A": A, "B": B, "C": C}
sumR = {k: sum((c["g"] - fn[k](c["q"])) / c["oneR"] for c in calc) for k in costs}
check("numeric", Q == 854, "total shares 854")
check("numeric", G == F("91.15"), "gross $91.15")
check("text", "854 shares" in ex["tables"][2]["title"], "totals table title shares")
for row in tot:
    k = row[0]
    eqnum(f"total cost {k}", costs[k], row[2])
    eqnum(f"net P&L {k}", G - costs[k], row[3])
    eqnum(f"net per trade {k}", (G - costs[k]) / 12, row[4])
    eqnum(f"sum net R {k}", sumR[k], row[5])
# Narrative claims in the execution section
p0, p1, p2, p3, p4 = ex["paragraphs"]
has("costs prose", p0, "$2 + $0.04 × shares")
has("costs prose", p0, "$2 + $0.10 × shares")
check("numeric", 2 * F("0.02") == F("0.04") and 2 * (F("0.02") + F("0.03")) == F("0.10"), "per-side → per-round-trip per-share costs")
t2, t8 = calc[1], calc[7]
check("numeric", t2["stock"] == "BRDG" and t2["e"] == F("31.10") and t2["s"] == F("29.60") and t2["q"] == 66 and t2["oneR"] == 99, "trade 2 prose inputs")
for tok in ["floor(100 ÷ 1.50) = 66", "66 × $1.50 = $99", "−1.00R", "$25.90", "$26.30", "66 × ($25.90 − $27.80) = −$125.40", "−1.27R"]:
    has("ledger prose", p2, tok)
eqnum("trade 8 R", t8["g"] / t8["oneR"], "-1.27")
fern, iris = calc[5], calc[8]
eqnum("FERN cost C", C(fern["q"]), "15.30"); eqnum("IRIS cost C", C(iris["q"]), "4.50")
has("cost prose", p3, "FERN’s 133 shares cost $15.30"); has("cost prose", p3, "IRIS’s 25 shares cost $4.50")
cheap = [c for c in calc if c["e"] < 25]
check("numeric", len(cheap) == 4 and sum(c["q"] for c in cheap) == 458, "four sub-$25 stocks, 458 shares")
eqnum("sub-$25 model C cost", sum(C(c["q"]) for c in cheap), "53.80")
has("cost prose", p3, "458 of the 854 shares"); has("cost prose", p3, "$53.80 of the $109.40")
for tok in ["$91.15", "+0.90R", "$67.15", "$32.99", "−$18.25 (−0.20R)"]:
    has("totals prose", p4, tok)
eqnum("held-out mean net R, B", sumR["B"] / 12, "0.03")
# Lines separate steadily: every gap between successive cost models is nondecreasing over trades
series = ch["figure"]["series"]
paths = {k: [F(0)] for k in ["Gross", "A", "B", "C"]}
for c in calc:
    for k in paths:
        paths[k].append(paths[k][-1] + c["g"] - fn[k](c["q"]))
for k, s in zip(["Gross", "A", "B", "C"], series):
    check("structural", len(s["values"]) == 13, f"series {k} length 13")
    for i, (a, b) in enumerate(zip(paths[k], s["values"])):
        eqnum(f"figure {k} point {i}", a, b)
for k1, k2 in [("Gross", "A"), ("A", "B"), ("B", "C")]:
    gaps = [paths[k1][i] - paths[k2][i] for i in range(13)]
    check("numeric", all(gaps[i] < gaps[i + 1] for i in range(12)), f"gap {k1}−{k2} widens every trade")
fig = ch["figure"]
check("structural", fig["xStart"] == 0, "figure xStart 0 (initial point)")
an = fig["annotations"]
eqnum("annotation gross end", paths["Gross"][an[0]["index"]] if an[0]["seriesIndex"] == 0 else 0, "91.15")
eqnum("annotation C end", paths["C"][an[1]["index"]] if an[1]["seriesIndex"] == 3 else 0, "-18.25")
eqnum("annotation C after trade 8", paths["C"][an[2]["index"]] if an[2]["seriesIndex"] == 3 else 0, "-57.85")
check("structural", calc[an[2]["index"] - 1]["stock"] == "HALO", "trade-8 annotation index points to HALO")
has("annotation", an[2]["label"], "−$57.85"); has("annotation", an[0]["label"], "+$91.15"); has("annotation", an[1]["label"], "−$18.25")
for tok in ["+$91.15", "+$67.15", "+$32.99", "−$18.25"]:
    has("figure caption", fig["caption"], tok)
eqnum("look-ahead/held-out ratio", F(15) / (G / 12), "1.97")   # 'roughly twice'
has("look-ahead prose", la_text, "about $7.60 gross per trade")

# ---------------------------------------------------------------- break-even
be = secs["find-the-cost-that-would-erase-the-result"]["paragraphs"]
flat_be = G / 12
eqnum("flat break-even", flat_be, "7.60")
eqnum("flat break-even 3dp", flat_be, "7.596", "0.001")
ps_be = (G - costs["A"]) / Q
eqnum("per-share break-even", ps_be, "0.079", "0.001")
eqnum("per-share break-even 4dp", ps_be, "0.0786", "0.0001")
eqnum("per-side break-even", ps_be / 2, "0.039", "0.001")
check("numeric", F("0.04") < ps_be < F("0.10"), "B below, C above per-share break-even")
for tok in ["$91.15 ÷ 12 ≈ $7.60", "($91.15 − $24.00) ÷ 854 shares ≈ $0.079", "$0.039 per share on each side"]:
    has("break-even prose", be[0], tok)
be200 = F(1600) / 200
net5, net9 = F(1600) - 200 * 5, F(1600) - 200 * 9
check("numeric", be200 == 8 and net5 == 600 and net9 == -200 and 5 < be200 < 9, "200-trade example")
check("numeric", 9 - 5 == 4, "cost assumptions $4 apart")
for tok in ["$1,600 ÷ 200 = $8", "$1,600 − $1,000 = $600", "$1,600 − $1,800 = −$200", "a $4 difference per trade", "about $7.60 per round trip"]:
    has("200-trade example", ch["example"]["text"], tok)
# Revised 2026-10-12: the section now points to the worked example instead of repeating it.
has("break-even section", be[1], "The worked example at the end of this chapter")
check("text", "$1,600" not in be[1], "section no longer repeats the 200-trade numbers")
check("structural", 200 > 12, "worked example study is 'larger' than the 12-trade ledger")
# Revised exercise (d): fresh 150-trade, $975 study
be150 = F(975) / 150
n5, n8 = F(975) - 150 * 5, F(975) - 150 * 8
eqnum("150-trade break-even", be150, "6.50")
eqnum("150-trade net at $5", n5, "225"); eqnum("150-trade net at $8", n8, "-225")
eqnum("150 × $5", F(150 * 5), "750"); eqnum("150 × $8", F(150 * 8), "1200")
check("numeric", 5 < be150 < 8, "$6.50 lies between $5 and $8")
check("numeric", 8 - 5 == 3, "$3 cost difference reverses the sign")
for tok in ["150 round trips", "$975 gross", "at $5 and $8 per round trip"]:
    has("exercise d", ch["exercise"], tok)
for tok in ["$975 ÷ 150 = $6.50", "$975 − 150 × $5 = $975 − $750 = +$225", "$975 − 150 × $8 = $975 − $1,200 = −$225",
            "The $6.50 break-even lies between the two assumptions", "a $3 difference in cost per trade"]:
    has("solution d", ch["solution"][3], tok)
interp = secs["interpret-the-evidence-at-the-right-level"]["paragraphs"][1]
for tok in ["+$67.15 to −$18.25", "$7.60 per round trip", "six logged variants", "twelve held-out trades"]:
    has("interpret prose", interp, tok)
# Revised 2026-10-12: decision criteria written at stage one and applied in the interpretation
stage1 = P("put-the-research-on-a-timeline", 1)
has("stage one", stage1, "and the decision criteria: what held-out result would justify a paper forward study, and what result would end the idea")
has("stage six", P("put-the-research-on-a-timeline", 2), "criteria written at stage one")
has("figure step 1", ch["figures"][0]["steps"][0]["text"], "and the decision criteria")
has("figure step 6", ch["figures"][0]["steps"][5]["text"], "step-1 criteria")
has("criteria", interp, "Her stage-one criteria said to begin a paper forward study only if the locked rule’s held-out result was positive under model B")
has("criteria", interp, "negative even under model A, and otherwise to measure costs before deciding")
has("entry-day rule", spec, "counts as a stop; this applies on the entry day too")
has("criteria", interp, "The model B result, +$32.99, meets the first condition")
check("numeric", G - costs["B"] > 0, "model B held-out net is positive (first condition met)")
check("numeric", G - costs["A"] > 0, "model A held-out net is positive (set-aside condition not met)")

# ---------------------------------------------------------------- exercise solution
sol = ch["solution"]
for tok in ["$31.10 − $29.60 = $1.50", "floor(66.67) = 66", "66 × $1.50 = $99.00", "−$99.00 ÷ $99.00 = −1.00R",
            "$27.80 − $26.30 = $1.50", "−$125.40 ÷ $99.00 ≈ −1.27R"]:
    has("solution a", sol[0], tok)
eqnum("100/1.5", F(100) / F("1.50"), "66.67")
for tok in ["854", "+$91.15", "12 × $2 = $24.00", "$0.04 × 854 = $24.00 + $34.16 = $58.16", "+$32.99",
            "$0.10 × 854 = $24.00 + $85.40 = $109.40", "−$18.25", "+0.90R", "+0.66R", "+0.32R", "−0.20R"]:
    has("solution b", sol[1], tok)
eqnum("0.04×854", F("0.04") * 854, "34.16"); eqnum("0.10×854", F("0.10") * 854, "85.40")
for tok in ["$7.596", "$67.15 ÷ 854 ≈ $0.0786", "$0.039"]:
    has("solution c", sol[2], tok)

# ---------------------------------------------------------------- practice
pr = ch["practice"]
f0, f1, f2 = pr[0]["solution"]
eqnum("FERN risk", fern["e"] - fern["s"], "0.75"); eqnum("FERN 1R", fern["oneR"], "99.75")
eqnum("FERN gross", fern["g"], "-99.75"); eqnum("FERN net", fern["g"] - C(fern["q"]), "-115.05")
eqnum("FERN net R", (fern["g"] - C(fern["q"])) / fern["oneR"], "-1.15")
for tok in ["$0.75", "= 133", "133 × $0.75 = $99.75", "$2 + 133 × $0.10 = $15.30", "−$99.75", "−$115.05", "≈ −1.15R"]:
    has("practice 1 FERN", f0, tok)
eqnum("IRIS net R 3dp", (iris["g"] - C(iris["q"])) / iris["oneR"], "1.955", "0.001")
for tok in ["$4.00", "shares = 25", "1R = $100", "$2 + 25 × $0.10 = $4.50", "+$200", "+$195.50", "+1.955R", "+1.96R"]:
    has("practice 1 IRIS", f1, tok)
check("numeric", F(fern["q"], iris["q"]) > 5, "FERN more than five times IRIS shares")
eqnum("FERN cost in R", C(fern["q"]) / fern["oneR"], "0.15")
eqnum("IRIS cost in R", C(iris["q"]) / iris["oneR"], "0.045", "0.001")
has("practice 1", f2, "0.15R"); has("practice 1", f2, "0.045R"); has("practice 1", f2, "five times")
c0, c1, c2 = pr[1]["solution"]
col_cost = Q * 2 * F("0.05")
eqnum("colleague cost", col_cost, "85.40"); eqnum("colleague net", G - col_cost, "5.75"); eqnum("colleague per trade", (G - col_cost) / 12, "0.48")
for tok in ["2 × $0.05 = $0.10", "854 × $0.10 = $85.40", "$91.15 − $85.40 = +$5.75", "$0.48 per trade"]:
    has("practice 2", c0, tok)
hs_be = G / (2 * Q)
eqnum("half-spread break-even", hs_be, "0.053", "0.001")
has("practice 2", c1, "$91.15 ÷ (2 × 854) ≈ $0.053")
gap_cents = (hs_be - F("0.05")) * 100
check("numeric", F(3, 10) <= gap_cents <= F(4, 10), f"'about a third of a cent' = {float(gap_cents):.3f} cent")
audit = pr[2]["solution"][0]
for tok in ["(1) Survivorship", "(2) A definition error", "(3) Timing", "(4) Selection", "(5) Look-ahead"]:
    has("practice 3", audit, tok)

# ---------------------------------------------------------------- evidence records (numbers restated)
evb = {e["id"]: e for e in ch["evidence"]}
bs = [e for e in ch["evidence"] if e["sourceIds"] == ["rc-bs"]][0]
has("rc-bs costs", bs["study"]["costs"], "30–35, 0–5, 0–5 basis points")
has("rc-bs sample", bs["study"]["sample"], "January 1897–July 2011")
has("rc-bs rule", bs["study"]["rule"], "7,846")
has("rc-bs location", bs["location"], "Table 5, p. 49")
lo = [e for e in ch["evidence"] if e["sourceIds"] == ["rc-lo"]][0]
has("rc-lo sample", lo["study"]["sample"], "1962–1996")
has("rc-lo rule", lo["study"]["rule"], "ten algorithmically defined pattern classes")
has("chapter LMW", secs["interpret-the-evidence-at-the-right-level"]["paragraphs"][0], "1962 to 1996")
ar = [e for e in ch["evidence"] if e["type"] == "arithmetic"]
for tok in ["$91.15", "$24.00", "$58.16", "$109.40", "+$67.15/+$32.99/−$18.25", "+0.90/+0.66/+0.32/−0.20"]:
    has("ledger evidence summary", ar[0]["summary"], tok)
for tok in ["$91.15 ÷ 12 ≈ $7.60", "≈ $0.0786", "$91.15 ÷ 1,708 ≈ $0.053", "$1,600 ÷ 200 = $8", "$975 ÷ 150 = $6.50",
            "+$225 and −$225 at $5 and $8"]:
    has("break-even evidence summary", ar[1]["summary"], tok)
# Revised rc-bs summary: Table 5 levels are the authors' ex ante break-evens
has("rc-bs summary", bs["summary"], "computed ex ante (pp. 22, 24)")
has("rc-bs summary", bs["summary"], "as ex post (p. 21)")
check("text", "These thresholds are ex post" not in bs["summary"], "rc-bs summary no longer calls Table 5 ex post")
has("rc-bs title", srcs["rc-bs"]["title"], "sample to July 2011")
check("numeric", 2 * Q == 1708, "1,708 = 2 × 854")
for tok in ["50 × (51.50 − 50.70) = $40", "50 × (51.50 − 50.40) = $55", "50 × (51.50 − 49.80) = $85", "50.40 × 1.01 = 50.904"]:
    has("look-ahead evidence summary", ar[2]["summary"], tok)

# ---------------------------------------------------------------- observations (not mismatches)
observations = []
reading = {r[0]: r[6] for r in tot}
if reading["A"] == "Positive" and reading["Gross"] == "Mildly positive":
    observations.append("Totals 'Reading' column calls model A 'Positive' but the larger gross result 'Mildly positive'.")
if ohlc["S"][1] == ceiling:
    observations.append("Day-S high ($50.90) coincides with the entry ceiling ($50.90); Implementation D's channel and the ceiling share one number.")
if "tenth session after entry" in spec and "session count’s tenth close" in spec:
    observations.append("Spec states an inclusive E1..E10 clock and also 'the close of the tenth session after entry' (literally E11).")
if "criteria written at stage one" in P("put-the-research-on-a-timeline", 2) and "criteria" not in P("put-the-research-on-a-timeline", 1):
    observations.append("Stage six compares with 'criteria written at stage one', but stage one's list contains no criteria.")

if all(B(c["q"]) >= A(c["q"]) for c in calc) and "negative under both models A and B" in interp:
    observations.append("Criteria: model B cost ≥ model A cost on every trade, so 'negative under both A and B' equals 'negative under A'; "
                        "the case A positive / B negative is left without a stated decision.")
if "the same stop-first convention" in spec and spec.index("the same stop-first convention") < spec.index("counts as a stop"):
    observations.append("Spec: 'Entry-day stop/target conflicts use the same stop-first convention' precedes the sentence that defines that convention.")

print(f"Chapter 24 `testing` reproduction: {counts['numeric']} numeric, {counts['text']} text, {counts['structural']} structural comparisons; "
      f"{len(mismatches)} mismatches.")
for m in mismatches:
    print("MISMATCH", m)
print(f"Totals: shares {Q}, gross {money(G)}, costs A/B/C {money(costs['A'])}/{money(costs['B'])}/{money(costs['C'])}, "
      f"sum net R gross/A/B/C {[float(d2(sumR[k])) for k in ['Gross','A','B','C']]}, flat BE {float(flat_be):.4f}, "
      f"per-share BE {float(ps_be):.5f}, half-spread BE {float(hs_be):.5f}")
for o in observations:
    print("OBSERVATION", o)
sys.exit(1 if mismatches else 0)
