#!/usr/bin/env python3
"""Independent reproduction of every number in Chapter 27 (classical-frameworks).

Run from the repository root:
    python3 -I docs/publication-batch7-assets/classical-frameworks-reproduce.py

Loads the compiled shipping chapter (compiled-classical-frameworks.json), recomputes
values with Fraction/Decimal, and compares them with the prose, tables, figures,
practice solutions and quiz. Comparisons are counted as numeric, text or structural.
Mismatches are listed; the exit status is 1 if any comparison fails.

Revision 2 (2026-10-12): follows the owner's revision of PUB7 findings 1-6 and 8-14
(reaction-extremes table now first in the Wyckoff section; breach-session close inside
the window; same-event clause; provisional step-12 claims and frozen invalidation;
new layer-sorting practice).
"""
import itertools
import json
import pathlib
import re
import sys
from decimal import Decimal, ROUND_HALF_UP
from fractions import Fraction as F

ROOT = pathlib.Path.cwd()
DATA = ROOT / "docs/publication-batch7-assets/compiled-classical-frameworks.json"
book = json.loads(DATA.read_text(encoding="utf-8"))
ch = book["chapter"]

counts = {"numeric": 0, "text": 0, "structural": 0}
mismatches = []


def check(kind, ok, label):
    counts[kind] += 1
    if not ok:
        mismatches.append(f"[{kind}] {label}")


def num(label, got, expected):
    check("numeric", F(str(got)) == F(str(expected)), f"{label}: got {got}, expected {expected}")


def has(text, phrase, label):
    check("text", phrase in text, f"{label}: phrase not found: {phrase!r}")


def lacks(text, phrase, label):
    check("text", phrase not in text, f"{label}: superseded phrase still present: {phrase!r}")


def pct(fr, places=2):
    return (Decimal(fr.numerator) / Decimal(fr.denominator) * 100).quantize(Decimal(1).scaleb(-places), ROUND_HALF_UP)


def table(section, title_start):
    found = [t for t in section.get("tables", []) if t["title"].startswith(title_start)]
    check("structural", len(found) == 1, f"exactly one table titled {title_start!r} in {section['id']}")
    return found[0]


sec = {s["id"]: s for s in ch["sections"]}
check("structural", list(sec) == [
    "what-this-optional-chapter-covers", "dow-theory-each-average-against-its-own-reference-high",
    "wyckoff-a-range-a-spring-candidate-and-a-breakdown-branch", "elliott-wave-an-impulse-must-pass-three-rules",
    "alternate-counts-and-the-timing-of-a-label", "from-vocabulary-to-an-honest-test"], "stable section ids and order")
S_INTRO = sec["what-this-optional-chapter-covers"]
S_DOW = sec["dow-theory-each-average-against-its-own-reference-high"]
S_WY = sec["wyckoff-a-range-a-spring-candidate-and-a-breakdown-branch"]
S_EW = sec["elliott-wave-an-impulse-must-pass-three-rules"]
S_ALT = sec["alternate-counts-and-the-timing-of-a-label"]
S_TEST = sec["from-vocabulary-to-an-honest-test"]
dow_text = " ".join(S_DOW["paragraphs"])
wy_text = " ".join(S_WY["paragraphs"])
ew_text = " ".join(S_EW["paragraphs"])
alt_text = " ".join(S_ALT["paragraphs"])

# ---------------------------------------------------------------- structure
layers = table(S_INTRO, "Three layers")
check("structural", len(layers["rows"]) == 3 and all(len(r) == 4 for r in layers["rows"]), "three-layer table 3x4")
check("structural", len(ch["outcomes"]) == 4, "four outcomes")
check("structural", ch["optional"] is True and ch["status"] == "draft", "optional draft chapter")

# ---------------------------------------------------------------- Dow
dow_fig = ch["figures"][0]
pa, pb = dow_fig["panels"]
A = [F(str(v)) for v in pa["series"][0]["values"]]
B = [F(str(v)) for v in pb["series"][0]["values"]]
refA_series, refB_series = pa["series"][1]["values"], pb["series"][1]["values"]
check("structural", len(A) == len(B) == len(refA_series) == len(refB_series) == 14, "Dow panels share 14 steps (0-13)")
check("structural", pa["xStart"] == 0 and pb["xStart"] == 0, "Dow panels start at step 0")
REF_A, REF_B = A[3], B[3]
num("A reference = step-3 close", REF_A, 110)
num("B reference = step-3 close", REF_B, 106)
check("structural", refA_series[:3] == [None] * 3 and all(v == 110 for v in refA_series[3:]), "A reference line from step 3")
check("structural", refB_series[:3] == [None] * 3 and all(v == 106 for v in refB_series[3:]), "B reference line from step 3")
num("A start", A[0], 100); num("B start", B[0], 100)
num("A step-5 low", A[5], 103); num("B step-5 low", B[5], 100)
# rise to step 3 is the treated upward secondary reaction: monotone rise 0->3, then decline to 5
check("structural", all(A[i] < A[i + 1] for i in range(3)) and all(B[i] < B[i + 1] for i in range(3)), "both averages rise from step 0 to step 3")
check("structural", A[5] == min(A[3:8]) and B[5] == min(B[3:8]), "step 5 is the low of the following decline")
check("structural", A[3] == max(A[:8]) and B[3] == max(B[:8]), "step-3 closes are the highest closes before the walk-forward")
has(dow_text, "a primary uptrend is signaled when both rise above their respective highs of previous upward secondary reactions", "Dow source paraphrase (finding 2)")
has(dow_text, "treat the rise to step 3 as the previous upward secondary reaction", "Dow reference role (finding 2)")
lacks(dow_text, "whether a decline qualifies", "Dow superseded wording (finding 2)")
first_a = next(i for i in range(4, 14) if A[i] > REF_A)
first_b = next(i for i in range(4, 14) if B[i] > REF_B)
first_both = next(i for i in range(4, 14) if A[i] > REF_A and B[i] > REF_B)
num("first A crossing step", first_a, 8)
num("first B crossing step", first_b, 11)
num("first simultaneous crossing", first_both, 11)
num("observations between A crossing and confirmation", first_both - first_a, 3)
has(dow_text, "three observations after A’s first crossing", "Dow prose: three observations")
num("A at confirmation", A[first_both], 113)
num("A rise from step-8 close to confirmation (finding 1)", A[first_both] - A[first_a], 1)
has(dow_text, "with A at 113, one point above its step-8 close", "Dow prose (finding 1)")
lacks(dow_text, "two points higher", "Dow superseded wording (finding 1)")
dtab = table(S_DOW, "The confirmation test")["rows"]
check("structural", [r[0] for r in dtab] == [7, 8, 9, 10, 11], "Dow table steps 7-11")
for step, a_close, a_yes, b_close, b_yes, record in dtab:
    num(f"Dow table A close step {step}", a_close, A[step])
    num(f"Dow table B close step {step}", b_close, B[step])
    check("text", a_yes == ("Yes" if A[step] > REF_A else "No"), f"Dow table A flag step {step}")
    check("text", b_yes == ("Yes" if B[step] > REF_B else "No"), f"Dow table B flag step {step}")
    a_up, b_up = A[step] > REF_A, B[step] > REF_B
    expect = "Confirmed" if a_up and b_up else ("Nonconfirmation" if a_up != b_up else "No crossing")
    check("text", record.startswith(expect), f"Dow table record step {step}: {record!r} vs {expect}")
for phrase in ["At step 3, A closes at 110 and B at 106", "A to 103 and B to 100", "At step 7, A closes at 109 and B at 103",
               "At step 8, A closes at 112", "B closes at 104", "B reaches only 103 and 105", "At step 11, B closes at 107 while A closes at 113"]:
    has(dow_text, phrase, "Dow prose")
for i, v in ((7, 109), (8, 112), (9, 111), (10, 112), (11, 113)):
    num(f"A step {i}", A[i], v)
for i, v in ((7, 103), (8, 104), (9, 103), (10, 105), (11, 107)):
    num(f"B step {i}", B[i], v)
check("structural", all(A[i] > REF_A for i in (8, 9, 10, 11)), "A stays above 110 through steps 8-11")
num("A % gain at step 8", (A[8] - 100) / 100 * 100, 12)
num("B % gain at step 8", (B[8] - 100) / 100 * 100, 4)
has(dow_text, "A is up 12% from the start and B is up 4%", "Dow prose percentages")
num("counterfactual: B ref 103 -> confirmation step", next(i for i in range(4, 14) if A[i] > REF_A and B[i] > 103), 8)
for p, ser, ref in ((pa, A, REF_A), (pb, B, REF_B)):
    for an in p["annotations"]:
        i = an["index"]
        nums = [F(x) for x in re.findall(r"\d+(?:\.\d+)?", an["label"])]
        if an["seriesIndex"] == 1:
            check("numeric", ref in nums and 3 in nums and i == 3, f"reference annotation {an['label']}")
            check("text", an["label"] == f"Reference high {ref} (step-3 close)", f"reference annotation wording (finding 9): {an['label']}")
        else:
            check("numeric", F(i) in nums and ser[i] in nums, f"annotation {an['label']} vs series[{i}]={ser[i]}")
            claims_not = "not above" in an["label"] or "<" in an.get("shortLabel", "")
            check("structural", (not ser[i] > ref) if claims_not else ser[i] > ref, f"annotation above/below claim: {an['label']}")
cap = dow_fig["caption"]
has(cap, "A first closes above 110 at step 8", "Dow caption"); has(cap, "B closes above 106 at step 11", "Dow caption")
has(cap, "becomes that average’s reference high", "Dow caption recognition wording")

# Quiz
q = ch["quiz"]
check("structural", len(q["options"]) == 3 and len(q["feedback"]) == 3 and q["answer"] == 0, "quiz shape and zero-based answer 0")
qa, qb, ra, rb = F(112), F(104), F(110), F(106)
correct = 0 if (qa > ra and not qb > rb) else (1 if (qa > 100 and qb > 100) else 2)
num("quiz computed answer index", correct, q["answer"])
check("structural", F("106.50") > rb, "quiz distractor 2 premise: intraday 106.50 above 106")
check("text", "$" not in q["options"][2] and "106.50" in q["options"][2], "quiz option 2 index level without dollar sign (finding 8)")
has(q["feedback"][0], "112 > 110, but 104 is not above 106", "quiz feedback 0")

# Practice 1 (Dow)
p1 = ch["practice"][0]
check("text", p1["title"] == "Two versions of confirmation", "practice-1 title preserved")
refC, refD = F(220), F(85)
C = [F("218.0"), F("221.0"), F("219.5"), F("222.4")]
D = [F("85.0"), F("84.2"), F("85.4"), F("85.3")]
for i, (c, d) in enumerate(zip(C, D)):
    has(p1["question"], f"t{i} C {float(c):.1f}, D {float(d):.1f}", "practice-1 inputs")
has(p1["question"], "since the reference highs were set", "practice-1 wording (finding 2)")
simul = next(i for i in range(4) if C[i] > refC and D[i] > refD)
num("practice-1 (a) simultaneous confirmation", simul, 3)
fc = next(i for i in range(4) if C[i] > refC); fd = next(i for i in range(4) if D[i] > refD)
num("practice-1 (b) C first above", fc, 1); num("practice-1 (b) D first above", fd, 2)
num("practice-1 (b) either-time confirmation", max(fc, fd), 2)
num("practice-1 (b) one observation earlier", simul - max(fc, fd), 1)
check("structural", D[0] == refD and not D[0] > refD, "practice-1 (c) equality does not count")
sol1 = " ".join(p1["solution"])
for ph in ["C 221.0 > 220", "D 84.2 is not above 85", "D 85.4 > 85", "C 219.5 has fallen back below 220", "C 222.4 > 220 and D 85.3 > 85",
           "confirmation is recorded at t3", "records confirmation at t2", "D’s 85.0 equals its reference"]:
    has(sol1, ph, "practice-1 solution")

# ---------------------------------------------------------------- Wyckoff
SUP = F("30.00")
THR = SUP * F(99, 100)
num("breach threshold 1% below 30", THR, F("29.70"))
has(wy_text, "$29.70 or lower", "Wyckoff prose threshold")
wy_fig = ch["figures"][1]
spring = [None if v is None else F(str(v)) for v in wy_fig["series"][0]["values"]]
brk = [None if v is None else F(str(v)) for v in wy_fig["series"][1]["values"]]
check("structural", len(spring) == len(brk) == 20 and wy_fig["xStart"] == 1, "20 sessions starting at 1")
check("structural", all(v is None for v in brk[:16]) and brk[16] == spring[16], "breakdown branch starts at shared session 17")
pre = spring[:16]  # sessions 1..16
close = lambda s: pre[s - 1]
zones = {z["label"]: z for z in wy_fig["zones"]}

# Reaction-extremes table (now first table in sections[2]; finding 6)
check("structural", S_WY["tables"][0]["title"].startswith("Reaction extremes"), "reaction-extremes table is the first Wyckoff table")
check("structural", S_WY["tables"][1]["title"].startswith("The frozen spring rule"), "spring-rule table is the second Wyckoff table")
rx = table(S_WY, "Reaction extremes")
check("structural", rx["columns"] == ["Session", "Close ($)", "Reaction low ($)", "Reaction high ($)"], "reaction table columns")
dash = "—"
rlow, rhigh = {}, {}
for s, c, lo, hi in rx["rows"]:
    s = int(s)
    num(f"reaction table close s{s} = figure close", F(c), close(s))
    check("structural", (lo == dash) != (hi == dash), f"session {s} lists exactly one extreme")
    if lo != dash:
        rlow[s] = F(lo)
        check("structural", rlow[s] <= close(s), f"session {s} low {lo} <= close {c}")
        check("structural", close(s) < close(s - 1) and close(s) < close(s + 1), f"session {s} close is a local close minimum")
    else:
        rhigh[s] = F(hi)
        check("structural", rhigh[s] >= close(s), f"session {s} high {hi} >= close {c}")
        check("structural", close(s) > close(s - 1) and close(s) > close(s + 1), f"session {s} close is a local close maximum")
check("structural", sorted(rlow) == [4, 9, 14] and sorted(rhigh) == [2, 7, 12], "reaction sessions 4/9/14 and 2/7/12")
check("numeric", [rlow[s] for s in (4, 9, 14)] == [F("30.00"), F("30.20"), F("30.40")], "reaction lows in session order")
check("numeric", [rhigh[s] for s in (2, 7, 12)] == [F("34.00"), F("33.80"), F("33.60")], "reaction highs in session order")
has(wy_text, "the reaction lows are $30.00, $30.20, and $30.40 (sessions 4, 9, and 14)", "Wyckoff prose lows")
has(wy_text, "the reaction highs are $34.00, $33.80, and $33.60 (sessions 2, 7, and 12)", "Wyckoff prose highs")
num("support zone low = min reaction low", zones["Support zone"]["low"], min(rlow.values()))
num("support zone high = max reaction low", zones["Support zone"]["high"], max(rlow.values()))
num("resistance zone low = min reaction high", zones["Resistance zone"]["low"], min(rhigh.values()))
num("resistance zone high = max reaction high", zones["Resistance zone"]["high"], max(rhigh.values()))
num("frozen support = lowest reaction low", min(rlow.values()), SUP)
# every session-1..16 close lies strictly inside the range bounded by the extremes
check("structural", all(min(rlow.values()) < c < max(rhigh.values()) for c in pre), "all session 1-16 closes lie within $30.00-$34.00")
# all six close-based local extremes near the range edges are listed (no omitted reaction)
loc_min = [s for s in range(2, 16) if close(s) < close(s - 1) and close(s) < close(s + 1)]
loc_max = [s for s in range(2, 16) if close(s) > close(s - 1) and close(s) > close(s + 1) and close(s) >= 33]
check("structural", loc_min == [4, 9, 14] and loc_max == [2, 7, 12], f"close-based reaction sessions {loc_min}/{loc_max} match the table")
has(wy_fig["caption"], "reaction extremes behind the zones are listed in the chapter’s table", "Wyckoff caption (finding 6)")

# Spring-rule table
rows = table(S_WY, "The frozen spring rule")["rows"]
def ohlc(s):
    return tuple(F(x.strip()) for x in s.split("/"))
sp = {17: ohlc(rows[0][1])}
bd = {17: sp[17]}
check("text", rows[0][2] == "Same session", "session 17 shared")
for r in rows[1:]:
    sp[r[0]] = ohlc(r[1]); bd[r[0]] = ohlc(r[2])
check("structural", sorted(sp) == [17, 18, 19, 20] and sorted(bd) == [17, 18, 19, 20], "sessions 17-20 in both branches")
for name, br in (("spring", sp), ("breakdown", bd)):
    for s, (o, h, l, c) in br.items():
        check("structural", h >= max(o, c) and l <= min(o, c), f"{name} session {s} OHLC internally consistent")
for lab, v, e in (("open", sp[17][0], "30.50"), ("high", sp[17][1], "30.60"), ("low", sp[17][2], "29.50"), ("close", sp[17][3], "29.80")):
    num(f"session-17 {lab}", v, F(e))
breach = (SUP - sp[17][2]) / SUP
num("breach fraction", breach, F(1, 60))
check("numeric", str(pct(breach)) == "1.67", f"breach % rounds to 1.67 (got {pct(breach)})")
check("numeric", str((Decimal(1) / Decimal(60)).quantize(Decimal("0.0001"), ROUND_HALF_UP)) == "0.0167", "breach 0.0167")
has(wy_text, "(30.00 − 29.50) ÷ 30.00 = 1.67%", "Wyckoff prose breach")
for s in range(17, 21):
    num(f"figure spring close s{s}", spring[s - 1], sp[s][3])
    num(f"figure breakdown close s{s}", brk[s - 1], bd[s][3])

# Frozen rule as revised (finding 3/4): window = breach session's own close + three later closes;
# later lows <= threshold inside an open window belong to the same event.
has(wy_text, "counting from the breach session’s own close through the three sessions after it", "rule window wording (finding 3)")
has(wy_text, "none of those four closes is above $30.00", "breakdown wording (finding 3)")
has(wy_text, "further lows at or below $29.70 belong to the same breach event and do not open a new window", "same-event clause (finding 4)")
has(wy_text, "its $29.70 low belongs to the open session-17 event rather than starting a new one", "session-18 low handling (finding 4)")
has(wy_text, "is an undercut smaller than this rule’s breach threshold and is not classified", "undercut wording (finding 12)")
lacks(wy_text, "test of support", "Wyckoff superseded label (finding 12)")


def run_rule(bars, sessions, window=3):
    """Return the list of classified/open events: (breach session, class, record session)."""
    events, open_ev = [], None
    for s in sessions:
        o, h, l, c = bars[s]
        if open_ev is None and l <= THR:
            open_ev = s
        if open_ev is not None:
            if c > SUP:
                events.append((open_ev, "spring candidate", s)); open_ev = None
            elif s == open_ev + window:
                events.append((open_ev, "breakdown", s)); open_ev = None
    if open_ev is not None:
        events.append((open_ev, "open", None))
    return events


ev_sp, ev_bd = run_rule(sp, range(17, 21)), run_rule(bd, range(17, 21))
check("structural", ev_sp == [(17, "spring candidate", 18)], f"spring branch: one event, spring candidate at 18 ({ev_sp})")
check("structural", ev_bd == [(17, "breakdown", 20)], f"breakdown branch: one event, breakdown at 20 ({ev_bd})")
check("structural", sp[18][2] <= THR and all(bd[s][2] <= THR for s in (18, 19, 20)), "later in-window lows meet the breach threshold (clause is needed)")
num("spring s18 low", sp[18][2], F("29.70")); num("spring s18 high", sp[18][1], F("30.80"))
# record at session 17 close: breach, close not above support, window open for 18-20
check("structural", not sp[17][3] > SUP, "session-17 close below support: window open")
has(rows[0][3], "window open for sessions 18–20", "spring table session-17 record")
for ph in ["session 18 trades between $29.70 and $30.80 and closes at $30.60", "the later closes of $31.00 and $31.40",
           "sessions 18 to 20 close at $29.40, $29.10, and $28.60"]:
    has(wy_text, ph, "Wyckoff prose")
# Same-session alternative is a strict subset (finding 3): enumerate close-above patterns of the 4 window closes.
subset_ok = True
for pattern in itertools.product([False, True], repeat=4):
    same_session = pattern[0]
    frozen = any(pattern)
    subset_ok &= (not same_session) or frozen
check("structural", subset_ok, "every same-session spring is a frozen-rule spring")
check("structural", (not sp[17][3] > SUP) and ev_sp[0][1] == "spring candidate", "the spring branch is a frozen-rule spring but not a same-session spring (strictness is proper)")
an = wy_fig["annotations"]
check("structural", len(an) == 2, "Wyckoff figure has two annotations (session-20 label moved to caption)")
num("ann0 index -> session", an[0]["index"] + 1, 17); num("ann0 value", an[0]["value"], F("29.5"))
check("structural", an[0]["value"] == float(sp[17][2]) and an[0]["value"] < float(spring[16]), "ann0 marks the session-17 low below its close")
num("ann1 index -> session", an[1]["index"] + 1, 18); num("ann1 series value", spring[an[1]["index"]], F("30.6"))
has(an[0]["label"], "1.67%", "Wyckoff annotation breach")
has(an[1]["label"], "$30.60", "Wyckoff annotation reentry close")
wcap = wy_fig["caption"]
num("caption: breakdown close at session 20", brk[19], F("28.60"))
has(wcap, "closes at $28.60 at session 20", "Wyckoff caption session-20 close")
has(wcap, "Session 17 breaches it with a $29.50 low (marked)", "Wyckoff caption breach")
has(wcap, "closes back above $30.00 at session 18", "Wyckoff caption reentry")
check("structural", all(brk[s - 1] <= SUP for s in (18, 19, 20)), "caption: breakdown branch never closes above $30.00 in sessions 18-20")
has(wcap, "reaction lows ($30.00–$30.40) and highs ($33.60–$34.00)", "Wyckoff caption zones")
sol = " ".join(ch["solution"])
for ph in ["(30.00 − 29.50) ÷ 30.00 = 0.0167, or 1.67%", "29.50 ≤ 29.70", "breach session’s own close of 29.80 is not above 30.00",
           "window stays open through sessions 18–20", "session-18 close of 30.60", "(31.00, 31.40)", "closes of 29.40, 29.10, and 28.60",
           "session 17 closes at 29.80", "so the alternative is strictly stricter"]:
    has(sol, ph, "exercise solution")
has(ch["exercise"], "stricter teaching rule", "exercise calls same-session rule stricter")
has(ch["example"]["text"], "1.67% breach", "example breach")

# ---------------------------------------------------------------- Elliott
ew_fig = ch["figure"]
P = [F(str(v)) for v in ew_fig["series"][0]["values"]]
check("structural", len(P) == 17 and ew_fig["xStart"] == 0, "Elliott schematic 17 steps from 0")
idx = [a["index"] for a in ew_fig["annotations"]]
labels = [a["label"] for a in ew_fig["annotations"]]
check("structural", idx == [2, 4, 6, 8, 10, 12, 14, 16] and labels == list("12345ABC"), "annotation indices/labels")
ends = [P[0]] + [P[i] for i in idx]
check("numeric", ends == [F(x) for x in (40, 44, 42, 50, 47, 53, 49, 51, 46)], f"swing endpoints {ends}")
has(ew_text, "$40 (the start, step 0), $44, $42, $50, $47, and $53, followed by $49, $51, and $46", "Elliott prose endpoints")
for i in range(1, 17, 2):
    num(f"filler step {i} midpoint", P[i], (P[i - 1] + P[i + 1]) / 2)
for a in ew_fig["annotations"]:
    i = a["index"]
    peak = i < 16 and P[i] > P[i - 1] and P[i] > P[i + 1]
    trough = i == 16 or (P[i] < P[i - 1] and P[i] < P[i + 1])
    check("structural", (a["placement"] == "above") == peak and (a["placement"] == "below") == trough, f"label {a['label']} placement")
has(ew_text, "the no-overlap form holds for all non-leveraged cash markets", "EWI cash-market attribution (finding 11)")
has(ew_text, "subdivide 5-3-5-3-5, with waves 1, 3, and 5 themselves motive waves", "subdivision wording (finding 11)")
has(ew_text, "Diagonals are a separate pattern family with their own rules, which this chapter does not review", "diagonal pointer (finding 13)")


def rules(pts, path=None):
    w0, w1, w2, w3, w4, w5 = pts
    L = (w1 - w0, w3 - w2, w5 - w4)
    r1 = w2 >= w0
    r2 = not (L[1] < L[0] and L[1] < L[2])
    r3 = (w4 if path is None else min(path)) > w1
    return L, r1, r2, r3


countA = [F(x) for x in (40, 44, 42, 50, 47, 53)]
countB = [F(x) for x in (40, 44, 42, 53, 49, 51)]
countC = [F(x) for x in (42, 50, 47, 53, 49, 51)]
LA, *ra_ = rules(countA, path=P[6:9])
LB, *rb_ = rules(countB, path=P[10:13])
LC, *rc_ = rules(countC, path=P[10:13])
check("numeric", LA == (4, 8, 6), f"count A lengths {LA}"); check("structural", ra_ == [True] * 3, "count A passes")
check("numeric", LB == (4, 11, 2), f"count B lengths {LB}"); check("structural", rb_ == [True] * 3, "count B passes")
check("numeric", LC == (8, 6, 2), f"count C lengths {LC}"); check("structural", rc_ == [True, True, False], "count C fails rule 3 only")
num("count A wave-2 retracement %", (countA[1] - countA[2]) / (countA[1] - countA[0]) * 100, 50)
has(ew_text, "it retraces $2 of a $4 advance, or 50%", "Elliott prose retracement")
has(ew_text, "waves 1, 3, and 5 measure $4, $8, and $6", "Elliott prose lengths")
check("structural", countB[5] < countB[3], "count B truncation: wave 5 end 51 below wave 3 end 53")
check("structural", countC[4] < countC[1], "count C wave 4 (49) inside wave 1 territory below 50")
check("structural", countB[2] < F(47) < F(50) < countB[3], "count B internal swings 50/47 lie within its wave 3")
has(alt_text, "Its lengths are $4, $11, and $2", "count B prose"); has(alt_text, "wave 4 ends at $49, above $44", "count B prose")
has(alt_text, "Its wave 4 ends at $49, inside wave 1’s territory below $50", "count C prose")
rt = table(S_ALT, "Rule check for three counts")
check("text", rt["columns"][5] == "Rule 3: wave 4 low above wave 1 high (no overlap)", "rule-3 column header (finding 10)")
for row, pts, L, res in ((rt["rows"][0], countA, LA, ra_), (rt["rows"][1], countB, LB, rb_), (rt["rows"][2], countC, LC, rc_)):
    check("numeric", [F(x.strip()) for x in row[1].split(",")] == pts, f"table endpoints {row[0]}")
    check("numeric", tuple(F(x.strip()) for x in row[2].split("/")) == L, f"table lengths {row[0]}")
    check("text", row[3].endswith("pass") == res[0], f"table rule1 {row[0]}")
    check("text", row[4].startswith("pass") == res[1], f"table rule2 {row[0]}")
    check("text", row[5].endswith("pass") == res[2], f"table rule3 {row[0]}")
    check("numeric", [F(x) for x in re.findall(r"\d+", row[5])] == [pts[4], pts[1]], f"table rule3 numbers {row[0]}")
    check("numeric", [F(x) for x in re.findall(r"\d+", row[3])] == [pts[2], pts[0]], f"table rule1 numbers {row[0]}")
check("text", "(2 is shortest)" in rt["rows"][2][4] and min(LC) == 2, "count C '2 is shortest'")

# Step-12 provisional claims and frozen invalidation (finding 5)
num("step 12 price", P[12], 49); num("step 10 price", P[10], 53)
check("structural", P[13] > P[12], "$49 becomes a visible swing low only after the later step-13 bar")
has(alt_text, "At step 12, with price at $49 and no later bar", "step-12 cutoff wording")
has(alt_text, "a possible wave A of a correction and expects a wave-B rally followed by a wave-C decline", "count A provisional claim")
has(alt_text, "Count B treats it as a possible wave 4 and expects a fifth advance", "count B provisional claim")
has(alt_text, "Both expect the next swing to be up", "shared expectation")
has(alt_text, "neither can yet know that $49 is a completed low", "recognition timing")
lacks(alt_text, "has just finished", "superseded hindsight wording")
# count B: only rule 3 can still fail at step 12 (rule 1 fixed at 42 >= 40; rule 2 cannot fail since wave 3 = 11 > wave 1 = 4)
check("structural", countB[2] >= countB[0], "count B rule 1 already settled")
check("structural", countB[3] - countB[2] > countB[1] - countB[0], "count B rule 2 cannot fail whatever wave 5 does")
invalid_B = countB[1]
num("count B invalidation level = wave-1 high", invalid_B, 44)
has(alt_text, "count B would be invalidated by any trade at or below $44", "count B invalidation wording")
check("structural", P[12] > invalid_B, "count B still valid at step 12 ($49 > $44)")
check("structural", all(P[i] > invalid_B for i in range(10, 17)), "count B never invalidated within the schematic (min after step 10 > $44)")
has(alt_text, "The three impulse rules give count A no invalidation level", "count A invalidation statement")

ecap = ew_fig["caption"]
for ph in ["wave 2 ends at 42, above the 40 start", "wave 4 ends at 47, above the wave-1 high of 44", "impulse lengths are 4, 8, and 6"]:
    has(ecap, ph, "Elliott caption")
check("structural", min(P[6:9]) == P[8], "wave-4 endpoint is its lowest point in schematic")

# Practice 2 (Elliott)
p2 = ch["practice"][1]
check("text", p2["title"] == "Check a new count before forecasting", "practice-2 title preserved")
X = [F(x) for x in ("20", "26", "21.50", "30", "25.50", "31")]
has(p2["question"], "$20 (start), $26, $21.50, $30, $25.50, and $31", "practice-2 inputs")
L2, r1, r2, r3 = rules(X)
check("numeric", L2 == (6, F("8.5"), F("5.5")), f"practice-2 lengths {L2}")
num("practice-2 retracement %", (X[1] - X[2]) / (X[1] - X[0]) * 100, 75)
num("practice-2 retrace amount", X[1] - X[2], F("4.5"))
check("structural", (r1, r2, r3) == (True, True, False), "practice-2 passes 1-2, fails 3")
sol2 = " ".join(p2["solution"])
for ph in ["26 − 20 = $6", "30 − 21.50 = $8.50", "31 − 25.50 = $5.50", "4.50 ÷ 6 = 75%", "wave 4 ends at 25.50, below wave 1’s $26 high",
           "taken from the rules of whichever structure they choose"]:
    has(sol2, ph, "practice-2 solution")

# Practice 3 (layers; finding 14)
p3 = ch["practice"][2]
check("text", p3["title"] == "Sort framework statements into layers" and p3["level"] == "guided", "practice-3 title/level")
check("structural", len(p3["solution"]) == 4 and all(f"({k})" in p3["question"] for k in "abcd"), "practice-3 four parts with four solutions")
expected_layers = ["Descriptive convention", "Causal story", "Empirical claim", "A descriptive label, but a provisional one"]
for k, (s, lay) in enumerate(zip(p3["solution"], expected_layers)):
    check("text", s.startswith(f"({'abcd'[k]}) {lay}"), f"practice-3 ({'abcd'[k]}) layer")
# facts quoted in practice-3 statements agree with the worked examples
check("structural", first_both == 11, "practice-3 (a) step 11 is the simultaneous-close confirmation")
has(p3["question"], "count B labels $49 as the end of wave 4", "practice-3 (d) input")
has(p3["solution"][3], "$49 is not yet a recognized low at step 12", "practice-3 (d) timing")
# each layer in the intro table appears in the solutions' evidence demands
has(p3["solution"][0], "two readers should agree", "practice-3 reproducibility evidence")
has(p3["solution"][2], "a stated comparator", "practice-3 empirical evidence")

# Evidence records
ev = next(e for e in ch["evidence"] if e["type"] == "arithmetic")
for ph in ["step 8", "step 11", "0.5 ÷ 30 = 1.67%", "$29.70", "session 18", "session 20", "4/8/6, 4/11/2, and 8/6/2", "6/8.5/5.5", "75%", "25.50 < 26"]:
    has(ev["summary"], ph, "arithmetic evidence record")
for e in ch["evidence"]:
    for sid in e["sourceIds"]:
        check("structural", sid in book["sources"], f"evidence source {sid} present")
for sid in ch["sources"]:
    check("structural", sid in book["sources"], f"chapter source {sid} present")

# ---------------------------------------------------------------- summary
total = sum(counts.values())
print(f"classical-frameworks reproduction: {counts['numeric']} numeric, {counts['text']} text, {counts['structural']} structural = {total} comparisons")
print(f"mismatches: {len(mismatches)}")
for m in mismatches:
    print("  MISMATCH", m)
sys.exit(1 if mismatches else 0)
