#!/usr/bin/env python3
"""Independent arithmetic reproduction for Chapter 19 `market-microstructure`.

Run from the repository root:
    python3 docs/publication-batch5-assets/market-microstructure-reproduce.py
Reads the compiled chapter (docs/publication-batch5-assets/compiled/market-microstructure.json) and
cross-checks it against the authoring source content/indicators-context.json.
"""
import json
import re
import sys
from fractions import Fraction as F
from decimal import Decimal as D

COMPILED = "docs/publication-batch5-assets/compiled/market-microstructure.json"
AUTHORING = "content/indicators-context.json"

ch = json.load(open(COMPILED, encoding="utf-8"))
auth = next(c for c in json.load(open(AUTHORING, encoding="utf-8"))["chapters"]
            if c["id"] == "market-microstructure")

n = 0
fails = []


def check(label, got, want):
    global n
    n += 1
    if got != want:
        fails.append(f"{label}: got {got!r}, want {want!r}")


def q(x):
    """Exact Fraction from a JSON number or '$1,234.56' string."""
    if isinstance(x, (int, float)):
        return F(D(str(x)))
    return F(D(str(x).replace("$", "").replace(",", "")))


def money(fr, places=2):
    d = D(fr.numerator) / D(fr.denominator)
    return f"{d.quantize(D(10) ** -places):,}"


def text_has(label, s, needle):
    check(f"text contains {needle!r} ({label})", needle in s, True)


# Authoring and compiled must agree (minutes is build-derived).
for k in set(ch) | set(auth):
    if k == "minutes":
        continue
    check(f"authoring==compiled[{k}]", auth.get(k), ch.get(k))

secs = {s["id"]: " ".join(s["paragraphs"]) for s in ch["sections"]}
allsec = " ".join(secs.values())

# ---------- Static book from the ladder figure ----------
fig = ch["figure"]
rows = fig["rows"]
asks = sorted([(q(r[1]), int(r[2]), r) for r in rows if r[0] == "Ask"], key=lambda t: t[0])
bids = sorted([(q(r[1]), int(r[2]), r) for r in rows if r[0] == "Bid"], key=lambda t: -t[0])
best_bid, bid_qty = bids[0][0], bids[0][1]
best_ask, ask_qty = asks[0][0], asks[0][1]
check("best bid", best_bid, F("49.90"))
check("best bid qty", bid_qty, 300)
check("best ask", best_ask, F("50.10"))
check("best ask qty", ask_qty, 100)
mid = (best_bid + best_ask) / 2
spread = best_ask - best_bid
check("midpoint", mid, F(50))
check("spread", spread, F("0.20"))
s1 = secs["last-price-bid-and-ask-describe-different-things"]
text_has("sec1", s1, "best bid $49.90 for 300 shares and best ask $50.10 for 100 shares")
text_has("sec1", s1, "is ($49.90 + $50.10)/2 = $50; the spread is $0.20")  # batch 5 wording (PUB5-011)

# ---------- 100-share round trip, relative spread ----------
rt100 = 100 * best_ask - 100 * best_bid
check("100-share round trip loss", rt100, F(20))
s2 = secs["the-spread-is-a-cost-even-before-price-moves"]
text_has("sec2", s2, "The round trip loses $20")
rel = spread / mid
check("relative spread", rel, F(4, 1000))
text_has("sec2", s2, "$0.20/$50 = 0.4%")

# ---------- Ladder walk: greedy marketable buy of 250 ----------
ORDER = 250
remaining = ORDER
fills = []
for price, qty, row in asks:
    take = min(qty, remaining)
    remaining -= take
    fills.append((price, take))
    check(f"figure consumes @{price}", int(row[3]), take)
    check(f"figure remaining @{price}", int(row[4]), qty - take)
for price, qty, row in bids:
    check(f"bid row untouched consumes @{price}", int(row[3]), 0)
    check(f"bid row untouched remaining @{price}", int(row[4]), qty)
check("unfilled after walk", remaining, 0)
value = sum(p * k for p, k in fills)
avg = value / ORDER
check("fill value", value, F(12540))
check("weighted avg", avg, F("50.16"))
check("leg1 value", fills[0][0] * fills[0][1], F(5010))
check("leg2 value", fills[1][0] * fills[1][1], F(7530))
check("legs", [(str(float(p)), k) for p, k in fills if k], [("50.1", 100), ("50.2", 150)])
s3 = secs["walk-a-250-share-buy-through-the-ladder"]
text_has("sec3", s3, "100 × 50.10 + 150 × 50.20 = $12,540")
text_has("sec3", s3, "weighted fill price $50.16")
text_has("sec3", s3, "50 remain at $50.20, and all 300 at $50.30 remain")
text_has("sec3", s3, "$50.10 for 100 shares, $50.20 for 200, and $50.30 for 300")
check("caption avg", "average price $50.16" in fig["caption"], True)
check("caption legs", "100 shares at $50.10 then 150 at $50.20" in fig["caption"], True)

# Limit $50.10 for 250 (static book)
lim = F("50.10")
lim_fill = sum(k for p, k in [(p, q_) for p, q_, _ in asks] if p <= lim)
lim_fill = min(lim_fill, ORDER)
lim_val = sum(p * min(k, ORDER) for p, k, _ in asks if p <= lim)
tbl = ch["sections"][2]["tables"][0]["rows"]
check("table mkt filled", tbl[0][1], ORDER)
check("table mkt price", q(tbl[0][2]), avg)
check("table mkt unfilled", tbl[0][3], 0)
check("table lim filled", tbl[1][1], lim_fill)
check("table lim price", q(tbl[1][2]), lim_val / lim_fill)
check("table lim unfilled", tbl[1][3], ORDER - lim_fill)
check("table ioc filled", tbl[2][1], lim_fill)
check("table ioc price", q(tbl[2][2]), lim_val / lim_fill)
check("table ioc unfilled", tbl[2][3], f"{ORDER - lim_fill} canceled")
text_has("sec3", s3, "it can take only 100 immediately; the other 150 remain unfilled")

# ---------- Cost references (section 6, practice 1) ----------
s6 = secs["measure-costs-against-a-named-reference"]
check("vs mid per share", avg - mid, F("0.16"))
check("vs mid total", (avg - mid) * ORDER, F(40))
check("vs ask per share", avg - best_ask, F("0.06"))
check("vs ask total", (avg - best_ask) * ORDER, F(15))
text_has("sec6", s6, "$0.16 per share above midpoint, or $40 total")
text_has("sec6", s6, "$0.06 higher on average, or $15")
sale = ORDER * best_bid
check("bid size covers sale", bid_qty >= ORDER, True)
check("sale value", sale, F(12475))
check("round trip 250 loss", value - sale, F(65))
text_has("sec6", s6, "250 × 49.90 = $12,475; purchase value $12,540; price-only round-trip loss is $65")
# Decomposition of $65 vs $20
spread_part = spread * ORDER
depth_part = (fills[1][0] - best_ask) * fills[1][1]
check("spread component on 250", spread_part, F(50))
check("depth component", depth_part, F(15))
check("decomposition sums", spread_part + depth_part, F(65))
check("per-share 250 round trip", (value - sale) / ORDER, F("0.26"))
check("per-share 100 round trip", rt100 / 100, F("0.20"))
# Portion of 65-20=45 that is pure size (same spread, more shares)
check("size-only share of the $45 gap", spread * (ORDER - 100), F(30))
text_has("sec6 record", s6, "fills 100/150; mean $50.16; immediate sale assumption 250@49.90; loss $65 before fees")

p1 = " ".join(ch["practice"][0]["solution"])
check("practice1 vs mid", (avg - 50) * 250, F(40))
check("practice1 vs ask", (avg - F("50.10")) * 250, F(15))
check("practice1 gap", F(40) - F(15), (best_ask - mid) * 250)
check("practice1 gap value", (best_ask - mid) * 250, F(25))
text_has("practice1", p1, "(50.16−50) × 250 = $40")
text_has("practice1", p1, "(50.16−50.10) × 250 = $15")
text_has("practice1", p1, "$25 difference is the original $0.10 midpoint-to-ask distance times 250")

# ---------- Example, exercise solution, quiz ----------
ex = ch["example"]["text"]
text_has("example", ex, "Value $5,010+$7,530 = $12,540; weighted average $50.16")
unweighted = (F("50.10") + F("50.20")) / 2
check("unweighted mean", unweighted, F("50.15"))
text_has("example", ex, "Unweighted mean $50.15")
text_has("example", ex, "receives $12,475, producing a $65 price loss")
sol = " ".join(ch["solution"])
text_has("solution", sol, "$5,010+$7,530 = $12,540; divided by 250 gives $50.16")
text_has("solution", sol, "Remaining asks: 0 at $50.10, 50 at $50.20, 300 at $50.30")
text_has("solution", sol, "sale value is $12,475, so price-only loss is $65")
quiz = ch["quiz"]
check("quiz answer option", q(quiz["options"][quiz["answer"]]), avg)
check("quiz distractor best ask", q(quiz["options"][1]), best_ask)
check("quiz distractor unweighted", q(quiz["options"][2]), unweighted)
check("quiz feedback count", len(quiz["feedback"]), len(quiz["options"]))
check("quiz explanation = feedback[answer]", quiz["explanation"], quiz["feedback"][quiz["answer"]])

# ---------- Practice 2: fresh IOC limit ----------
book2 = [(F("32.05"), 80), (F("32.10"), 120), (F("32.20"), 200)]
p2q = ch["practice"][1]["question"]
for needle in ("80 shares at $32.05", "120 at $32.10", "200 at $32.20",
               "300-share buy limit at $32.10, immediate-or-cancel"):
    text_has("practice2 question", p2q, needle)
lim2, size2 = F("32.10"), 300
filled2, spend2 = 0, F(0)
for p, k in book2:
    if p <= lim2 and filled2 < size2:
        t = min(k, size2 - filled2)
        filled2 += t
        spend2 += p * t
check("practice2 filled", filled2, 200)
check("practice2 spend", spend2, F(6416))
check("practice2 avg", spend2 / filled2, F("32.08"))
check("practice2 canceled", size2 - filled2, 100)
check("practice2 32.20 outside limit", F("32.20") > lim2, True)
p2s = " ".join(ch["practice"][1]["solution"])
text_has("practice2", p2s, "80 + 120 = 200 shares")
text_has("practice2", p2s, "80 × 32.05 + 120 × 32.10 = $6,416")
text_has("practice2", p2s, "6,416/200 = $32.08")
text_has("practice2", p2s, "remaining 100 shares are canceled")

# ---------- Spread-widening figure ----------
f2 = ch["figures"][0]
ser = {s["name"]: [q(v) for v in s["values"]] for s in f2["series"]}
L = {len(v) for v in ser.values()}
check("figure2 equal series lengths", len(L), 1)
for i, (a, m, b) in enumerate(zip(ser["Ask"], ser["Midpoint"], ser["Bid"])):
    check(f"figure2 midpoint snapshot {i + f2.get('xStart', 0)}", (a + b) / 2, m)
    check(f"figure2 ask>=bid snapshot {i}", a > b, True)
ann = f2["annotations"][0]
i = ann["index"]
check("figure2 annotation ask", ser["Ask"][i], F("50.40"))
check("figure2 annotation bid", ser["Bid"][i], F("49.60"))
check("figure2 annotation spread", ser["Ask"][i] - ser["Bid"][i], F("0.80"))
spreads = [a - b for a, b in zip(ser["Ask"], ser["Bid"])]
check("figure2 annotated point is max spread", spreads.index(max(spreads)), i)
check("figure2 first quotes", (ser["Bid"][0], ser["Ask"][0]), (F("49.99"), F("50.01")))
s5 = secs["trading-conditions-vary-across-the-session"]
text_has("sec5", s5, "$49.99/$50.01 to $49.60/$50.40")
check("figure2 label text", "Ask $50.40 and bid $49.60: spread $0.80." == ann["label"], True)
check("figure2 shortLabel <= 18 chars", len(ann["shortLabel"]) <= 18, True)
check("figure2 annotation index within series", 0 <= i < L.pop(), True)

# ---------- Figure placement indices ----------
check("ladder figure afterSection is the ladder section",
      ch["sections"][fig["afterSection"]]["id"], "walk-a-250-share-buy-through-the-ladder")
check("spread figure afterSection is the session section",
      ch["sections"][f2["afterSection"]]["id"], "trading-conditions-vary-across-the-session")

print(f"{n} comparisons, {len(fails)} mismatches")
for f in fails:
    print("MISMATCH", f)
sys.exit(1 if fails else 0)
