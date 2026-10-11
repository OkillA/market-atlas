#!/usr/bin/env python3
"""Independent arithmetic check for Chapter 15 `relative-strength` (publication batch 5).

Run from the repository root:  python3 -I docs/publication-batch5-assets/relative-strength-reproduce.py
Reads docs/publication-batch5-assets/compiled/relative-strength.json (the compiled chapter) and checks
every number derivable from supplied inputs with Fraction / Decimal arithmetic.
"""
import json
from decimal import Decimal, ROUND_HALF_UP
from fractions import Fraction as F

CH = json.load(open('docs/publication-batch5-assets/compiled/relative-strength.json', encoding='utf-8'))
N = 0
FAIL = []


def text_of(path):
    obj = CH
    for p in path:
        obj = obj[p]
    return obj


def rnd(fr, places):
    q = Decimal(1).scaleb(-places)
    return (Decimal(fr.numerator) / Decimal(fr.denominator)).quantize(q, rounding=ROUND_HALF_UP)


def eq(label, got, want):
    """Exact comparison (Fraction/Decimal/int)."""
    global N
    N += 1
    if got != want:
        FAIL.append(f'{label}: got {got!r}, want {want!r}')


def eq_round(label, exact, shown, places):
    """`shown` (as printed, string or number) must equal exact rounded half-up to `places`."""
    global N
    N += 1
    shown_d = Decimal(str(shown))
    if rnd(exact, places) != shown_d.quantize(Decimal(1).scaleb(-places)) or abs(Decimal(exact.numerator) / Decimal(exact.denominator) - shown_d) >= Decimal(1).scaleb(-places):
        FAIL.append(f'{label}: exact {float(exact)!r} -> {rnd(exact, places)}, shown {shown}')


def near(label, got, exact, tol=F(1, 10**12)):
    global N
    N += 1
    if abs(F(got) - exact) > tol:
        FAIL.append(f'{label}: got {got!r}, exact {float(exact)!r}')


def says(path, substring):
    global N
    N += 1
    t = text_of(path)
    if substring not in t:
        FAIL.append(f'text {path} lacks {substring!r}')


def pct(a, b):
    """Percentage change a->b as an exact Fraction."""
    return (F(b) / F(a) - 1) * 100


# ---------------------------------------------------------------- main table
sec = {s['id']: i for i, s in enumerate(CH['sections'])}
tbl = CH['sections'][sec['rebase-the-comparison-so-its-origin-is-visible']]['tables'][0]
eq('table columns', tbl['columns'], ['Session', 'Stock', 'Sector', 'Market', 'Stock/market × 100', 'Stock/sector × 100'])
rows = tbl['rows']
eq('table row count', len(rows), 12)
stock = [F(r[1]) for r in rows]
sector = [F(r[2]) for r in rows]
market = [F(r[3]) for r in rows]
for i, r in enumerate(rows):
    eq(f'table session number row {i}', r[0], i + 1)
    eq_round(f'table stock/market s{i+1}', 100 * stock[i] / market[i] * market[0] / stock[0], r[4], 4)
    eq_round(f'table stock/sector s{i+1}', 100 * stock[i] / sector[i] * sector[0] / stock[0], r[5], 4)
eq('all start values 100', (stock[0], sector[0], market[0]), (100, 100, 100))

# ---------------------------------------------------------------- figure
fig = CH['figure']
p0, p1 = fig['panels']
eq('panel0 series names', [s['name'] for s in p0['series']], ['Stock', 'Sector', 'Market'])
for name, col, ser in (('Stock', stock, p0['series'][0]), ('Sector', sector, p0['series'][1]), ('Market', market, p0['series'][2])):
    for i, v in enumerate(ser['values']):
        eq(f'figure {name} s{i+1} equals table', F(v), col[i])
eq('panel1 series names', [s['name'] for s in p1['series']], ['Stock/market', 'Stock/sector', 'Initial relationship'])
for i in range(12):
    near(f'figure stock/market s{i+1}', p1['series'][0]['values'][i], 100 * stock[i] / market[i])
    near(f'figure stock/sector s{i+1}', p1['series'][1]['values'][i], 100 * stock[i] / sector[i])
    eq(f'figure initial relationship s{i+1}', p1['series'][2]['values'][i], 100)
# annotations
a0 = p0['annotations'][0]
eq('panel0 annotation index/series', (a0['index'], a0['seriesIndex']), (11, 0))
eq('panel0 annotation value 90', stock[a0['index']], 90)
eq('panel0 annotation "loses 10%"', pct(100, stock[11]), -10)
for ann, exact in zip(p1['annotations'], (100 * stock[11] / market[11], 100 * stock[11] / sector[11])):
    eq_round(f'panel1 shortLabel {ann["shortLabel"]}', exact, ann['shortLabel'], 2)
    eq_round(f'panel1 label {ann["label"]}', exact, ann['label'].split()[-1].rstrip('.'), 4 if '.' in ann['label'].split()[-1].rstrip('.') and len(ann['label'].split()[-1].rstrip('.').split('.')[1]) == 4 else 1)
    eq(f'panel1 annotation at final session {ann["label"]}', ann['index'], 11)
says(('figure', 'panels', 0, 'caption'), 'Stock finishes 90, sector 85, broad market 80.')
eq('panel caption end values', (stock[11], sector[11], market[11]), (90, 85, 80))
eq('figure placed after chronological section', fig['afterSection'], sec['follow-the-comparison-chronologically'])

# ---------------------------------------------------------------- prose: rebase section
P = ('sections', sec['rebase-the-comparison-so-its-origin-is-visible'], 'paragraphs')
eq('$50 / 500 raw ratio', F(50, 500), F(1, 10))
says(P + (0,), 'starts at 0.1')
eq('100 x 90/80', 100 * F(90, 80) / (F(100) / 100), F(225, 2))
says(P + (1,), '100 × (90/80) = 112.5')
eq('stock declined 10%', pct(100, 90), -10)
eq('ratio rose 12.5%', pct(100, F(225, 2)), F(25, 2))
eq('return difference −10 − (−20)', pct(100, 90) - pct(100, 80), 10)

# ---------------------------------------------------------------- prose: manufacturer and contrast
says(('sections', sec['choose-a-benchmark-that-answers-your-question'], 'paragraphs', 1), 'gains 8%, its sector gains 12%, and the broad market gains 4%')
R = ('sections', sec['use-the-comparison-to-organize-research'], 'paragraphs')
eq_round('108/104 x 100', 100 * F(108, 104), '103.8462', 4)
eq_round('108/112 x 100', 100 * F(108, 112), '96.4286', 4)
says(R + (0,), '108/104 × 100 = 103.8462')
says(R + (0,), '108/112 × 100 = 96.4286')
eq('0.90/0.80', F(90, 100) / F(80, 100), F(1125, 1000))
eq_round('0.90/0.85', F(90, 100) / F(85, 100), '1.058824', 6)
says(R + (3,), '0.90/0.80 = 1.125 and 0.90/0.85 = 1.058824')

# ---------------------------------------------------------------- prose: chronological section
C = ('sections', sec['follow-the-comparison-chronologically'], 'paragraphs')
i = 2  # session 3
eq('s3 values', (stock[i], sector[i], market[i]), (101, 100, 99))
eq('s3 stock +1%', pct(100, stock[i]), 1)
eq('s3 ahead of sector by 1 pp', pct(100, stock[i]) - pct(100, sector[i]), 1)
eq('s3 ahead of market by 2 pp', pct(100, stock[i]) - pct(100, market[i]), 2)
eq_round('s3 101/99 x 100', 100 * stock[i] / market[i], '102.0202', 4)
says(C + (0,), '101/99 × 100 ≈ 102.0202')
i = 5  # session 6
eq('s6 values', (stock[i], sector[i], market[i]), (96, 93, 90))
eq('s6 returns', (pct(100, stock[i]), pct(100, sector[i]), pct(100, market[i])), (-4, -7, -10))
eq_round('s6 96/93', 100 * stock[i] / sector[i], '103.2258', 4)
eq_round('s6 96/90', 100 * stock[i] / market[i], '106.6667', 4)
# "The bottom panel rises while the top panel falls" (sessions 1-6)
eq('s1-6 stock net fall', stock[5] < stock[0], True)
eq('s1-6 stock/market non-decreasing', all(stock[k + 1] / market[k + 1] >= stock[k] / market[k] for k in range(5)), True)
eq('s1-6 stock/sector non-decreasing', all(stock[k + 1] / sector[k + 1] >= stock[k] / sector[k] for k in range(5)), True)
i = 11  # session 12
eq_round('s12 90/85', 100 * stock[i] / sector[i], '105.8824', 4)
eq('s12 90/80', 100 * stock[i] / market[i], F(225, 2))
eq('s12 advantage over sector 5 pp', pct(100, stock[i]) - pct(100, sector[i]), 5)
eq('s12 advantage over market 10 pp', pct(100, stock[i]) - pct(100, market[i]), 10)
# "larger market-relative figure ... reflects greater market weakness": ratio of the two relative indices equals sector/market factor
eq('s12 relative-index gap equals sector/market factor', (stock[i] / market[i]) / (stock[i] / sector[i]), sector[i] / market[i])
# precise note: declined less than both comparators; vs-market exceeded vs-sector
eq('note: stock declined less than both', stock[11] > sector[11] and stock[11] > market[11], True)
eq('note: vs market > vs sector at s12', stock[11] / market[11] > stock[11] / sector[11], True)
# supporting fact: market ≤ sector every session, so vs-market ≥ vs-sector throughout
eq('vs-market >= vs-sector every session', all(stock[k] / market[k] >= stock[k] / sector[k] for k in range(12)), True)

# ---------------------------------------------------------------- example
E = CH['example']['text']
eq('example sector −15%', pct(100, 85), -15)
eq('example market −20%', pct(100, 80), -20)
eq('example advantage vs sector', pct(100, 90) - pct(100, 85), 5)
eq('example advantage vs market', pct(100, 90) - pct(100, 80), 10)
eq_round('example 90/85−1', pct(85, 90), '5.8824', 4)
eq('example 90/80−1', pct(80, 90), F(25, 2))
says(('example', 'text'), '90/85−1 = 5.8824%')
says(('example', 'text'), '90/80−1 = 12.5%')

# ---------------------------------------------------------------- solution
S = CH['solution']
eq('solution returns', (pct(100, 90), pct(100, 85), pct(100, 80)), (-10, -15, -20))
says(('solution', 0), '100 × 0.90/0.85 = 105.8824')
says(('solution', 1), '−10−(−20) = 10 percentage points')
says(('solution', 1), '−10−(−15) = 5 points')

# ---------------------------------------------------------------- quiz
q = CH['quiz']
eq('quiz answer index', q['answer'], 1)
eq('quiz answer option text', q['options'][q['answer']], '−10%')
eq('quiz correct value', pct(100, stock[11]), -10)
eq('quiz feedback count', len(q['feedback']), len(q['options']))
eq('quiz explanation equals correct feedback', q['explanation'], q['feedback'][q['answer']])
eq('quiz distractor 0 = advantage over market (pp)', pct(100, stock[11]) - pct(100, market[11]), 10)
eq('quiz distractor 2 = market-relative ratio increase', pct(100, 100 * stock[11] / market[11]), F(25, 2))

# ---------------------------------------------------------------- practice
g, ind = CH['practice']
eq_round('practice guided 96/90', 100 * F(96, 90), '106.6667', 4)
eq_round('practice guided 96/93', 100 * F(96, 93), '103.2258', 4)
eq('practice guided down 4%', pct(100, 96), -4)
eq('practice guided inputs match table s6', (stock[5], sector[5], market[5]), (96, 93, 90))
eq('practice indep stock factor', F(44, 40), F(11, 10))
eq('practice indep bench factor', F(240, 200), F(6, 5))
eq_round('practice indep relative index', 100 * F(44, 40) / F(240, 200), '91.6667', 4)
eq_round('practice indep relative change', (F(44, 40) / F(240, 200) - 1) * 100, '-8.3333', 4)
eq('practice indep stock +10%', pct(40, 44), 10)
eq('practice indep bench +20%', pct(200, 240), 20)
eq('practice indep difference −10 pp', pct(40, 44) - pct(200, 240), -10)
says(('practice', 1, 'solution', 0), '100 × 1.10/1.20 = 91.6667')
says(('practice', 1, 'solution', 0), '−8.3333%')

# ---------------------------------------------------------------- evidence record numbers (source-stated, not derivable) skipped
print(f'{N} comparisons, {len(FAIL)} mismatches')
for f in FAIL:
    print('MISMATCH', f)
assert not FAIL
