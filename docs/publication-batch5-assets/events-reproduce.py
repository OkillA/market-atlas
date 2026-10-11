#!/usr/bin/env python3
"""Independent arithmetic reproduction for Chapter 18 `events` (batch 5 review).

Run from the repository root:  python3 docs/publication-batch5-assets/events-reproduce.py
Reads docs/publication-batch5-assets/compiled/events.json (what readers see) and checks every
number derivable from the supplied inputs with Fraction/Decimal arithmetic.
Also confirms the compiled chapter equals content/indicators-context.json
(apart from build-computed `minutes`).
"""
import json
import os
from decimal import Decimal, ROUND_HALF_UP
from fractions import Fraction as F

COMPILED = 'docs/publication-batch5-assets/compiled/events.json'
AUTHORING = 'content/indicators-context.json'

ch = json.load(open(COMPILED, encoding='utf-8'))
count = 0
mismatches = []
flags = []


def check(desc, ok, detail=''):
    global count
    count += 1
    if not ok:
        mismatches.append(f'{desc}: {detail}')


def eq(desc, got, want):
    check(desc, F(str(got)) == F(want) if not isinstance(want, F) else F(str(got)) == want,
          f'got {got!r}, want {want}')


def rnd(x, dp):
    q = Decimal(1).scaleb(-dp)
    return (Decimal(x.numerator) / Decimal(x.denominator)).quantize(q, rounding=ROUND_HALF_UP)


def fmt(x, dp, plus=False):
    d = rnd(x, dp)
    s = f'{abs(d):,.{dp}f}'
    if d < 0:
        return '−' + s
    return ('+' + s) if plus else s


def appears(desc, needle, hay):
    check(desc, needle in hay, f'{needle!r} not found')


def table_close(desc, cell, exact, dp=6):
    check(desc, Decimal(str(cell)) == rnd(exact, dp), f'cell {cell} vs exact {float(exact)!r} → {rnd(exact, dp)}')


# ---------------------------------------------------------------- authoring parity
if os.path.exists(AUTHORING):
    auth = [c for c in json.load(open(AUTHORING, encoding='utf-8'))['chapters'] if c['id'] == 'events'][0]
    for k in set(auth) | set(ch):
        if k == 'minutes':
            continue
        check(f'authoring parity {k}', auth.get(k) == ch.get(k), 'compiled differs from authoring')

secs = {s['id']: s for s in ch['sections']}
txt = lambda sid: ' '.join(secs[sid]['paragraphs'])

# ---------------------------------------------------------------- main case inputs
prev = ch['figure']['candles'][0]
nxt = ch['figure']['candles'][1]
PO, PH, PL, PC = (F(str(prev[k])) for k in ('open', 'high', 'low', 'close'))
O, H, L, C = (F(str(nxt[k])) for k in ('open', 'high', 'low', 'close'))
eq('prior close', PC, 52); eq('open', O, 43); eq('high', H, 47); eq('low', L, 42); eq('close', C, 46)
check('OHLC validity prev', PL <= min(PO, PC) and PH >= max(PO, PC))
check('OHLC validity next', L <= min(O, C) and H >= max(O, C))

gap = (O - PC) / PC * 100
intra = (C - O) / O * 100
c2c = (C - PC) / PC * 100
gap_s, intra_s, c2c_s = fmt(gap, 4), fmt(intra, 4, True), fmt(c2c, 4)
eq('gap $', O - PC, -9); eq('intraday $', C - O, 3); eq('c2c $', C - PC, -6)

s2 = txt('measure-the-gap-from-the-correct-endpoint')
appears('s2 gap dollars', '43−52 = −$9', s2)
appears('s2 gap pct', gap_s + '%', s2)
appears('s2 intraday pct', f'(46/43−1) × 100 = {intra_s}%', s2)
appears('s2 c2c pct', f'(46/52−1) × 100 = {c2c_s}%', s2)
check('s2 positive body (C > O)', C > O)
check('s2 prior close above entire next range', PC > H)
appears('s2 range text', '$42–$47', s2)

# comparison table
t = secs['measure-the-gap-from-the-correct-endpoint']['tables'][0]['rows']
for row, (a, b) in zip(t, [(PC, O), (O, C), (PC, C)]):
    eq(f'table {row[0]} dollar', row[1], b - a)
    eq(f'table {row[0]} denom', row[2], a)
    table_close(f'table {row[0]} pct', row[3], (b - a) / a * 100)

# ---------------------------------------------------------------- loss models
sh, entry, thr, fill = 100, F(52), F(48), O
s4 = txt('a-trigger-is-different-from-a-guaranteed-fill')
planned = sh * (entry - thr)
gapl = sh * (entry - fill)
eq('planned loss', planned, 400); eq('gap loss', gapl, 900); eq('difference', gapl - planned, 500)
appears('s4 $4/share', '$4 per share or $400', s4)
appears('s4 $9/share', '$9 per share or $900', s4)
appears('s4 $500', 'The $500 difference', s4)
lt = secs['a-trigger-is-different-from-a-guaranteed-fill']['tables'][0]['rows']
eq('loss table planned shares', lt[0][1], sh); eq('loss table planned entry', lt[0][2], entry)
eq('loss table planned exit', lt[0][3], thr); eq('loss table planned loss', lt[0][4], lt[0][1] * (F(str(lt[0][2])) - F(str(lt[0][3]))))
eq('loss table gap exit', lt[1][3], fill); eq('loss table gap loss', lt[1][4], lt[1][1] * (F(str(lt[1][2])) - F(str(lt[1][3]))))
# stop-limit in main case: trigger at open below 48 makes sell limit 47 active; open 43 < 47 ineligible; high == limit
check('main stop-limit: open below limit (ineligible at open)', O < 47)
check('main stop-limit: high equals limit (touch only)', H == 47)

# ---------------------------------------------------------------- split section
s5 = txt('some-apparent-jumps-are-changes-in-measurement')
eq('2:1 split price', F(100) / 2, 50)
eq('2:1 split value unchanged (100 sh × $100 vs 200 × $50)', 100 * 100, 200 * 50)
appears('split 50% text', '50% loss', s5)
eq('raw split move pct', (F(50) / 100 - 1) * 100, -50)

# ---------------------------------------------------------------- note section
s6 = txt('write-the-before-and-after-note')
appears('note OHLC', 'O = 43/H = 47/L = 42/C = 46', s6)
appears('note gap', f'Gap was {gap_s}%', s6)
appears('note intraday', f'intraday recovery {intra_s}%', s6)
appears('note c2c', f'close-to-close result {c2c_s}%', s6)
check('note: stayed below prior $52 throughout (H < 52)', H < PC)
appears('note loss', 'price loss is $900, compared with $400', s6)
check('note: $46 close contradicts recovery to $52', C < PC)
# month range vs prior candle (consistency flag, not arithmetic)
s1 = txt('the-recent-pattern-is-a-conditional-history')
if 'between $48 and $52' in s1 and PH > 52:
    flags.append(f'Section 1 says the stock spends a month "between $48 and $52"; the prior-session candle high is ${PH} (figure caption H = 53).')
if '$48–$52 region' in s6 and PH > 52:
    flags.append('Before-release note says "$48–$52 region" while the prior session high is $53.')

# ---------------------------------------------------------------- example
ex = ch['example']['text']
appears('example c2c', f'−$6/52 = {c2c_s}%', ex)
appears('example intraday', f'+$3/43 = {intra_s}%', ex)
appears('example gap', f'−$9/52 = {gap_s}%', ex)
appears('example $900', 'price loss is $900', ex)
eq('example holder at $46 loss', sh * (entry - C), 600)
appears('example $600', '$600 price loss', ex)

# ---------------------------------------------------------------- quiz
q = ch['quiz']
check('quiz answer index in range', 0 <= q['answer'] < len(q['options']))
check('quiz answer is open-to-close', q['options'][q['answer']] == intra_s + '%', q['options'][q['answer']])
wrong_mix = F(3, 52) * 100
check('quiz option 0 = $3 / prior close', q['options'][0] == fmt(wrong_mix, 4, True) + '%', q['options'][0])
check('quiz option 1 = c2c', q['options'][1] == c2c_s + '%', q['options'][1])
appears('quiz feedback 0', fmt(wrong_mix, 4) + '%', q['feedback'][0])
appears('quiz feedback 1', c2c_s.lstrip('−') if False else c2c_s + '%', q['feedback'][1])
appears('quiz explanation', f'(46−43)/43 gives {intra_s}%', q['explanation'])
check('quiz feedback count', len(q['feedback']) == len(q['options']))
check('quiz feedback[answer] == explanation', q['feedback'][q['answer']] == q['explanation'])

# ---------------------------------------------------------------- figure
fig = ch['figure']
cap = fig['caption']
appears('caption prev', f'Previous O = {PO}/H = {PH}/L = {PL}/C = {PC}', cap)
appears('caption next', f'Next O = {O}/H = {H}/L = {L}/C = {C}', cap)
appears('caption amounts', '$3 intraday rise is distinct from the $9 opening gap and $6 close-to-close loss', cap)
a0, a1, a2 = fig['annotations']
eq('ann0 value = prior close', a0['value'], PC); check('ann0 index', a0['index'] == 0)
eq('ann1 value = open', a1['value'], O); check('ann1 index', a1['index'] == 1)
eq('ann2 value = close', a2['value'], C); check('ann2 index', a2['index'] == 1)
appears('ann1 gap label', '−$9', a1['label']); appears('ann1 short', 'O 43', a1['shortLabel'])  # batch 5: short label shortened (PUB5-006)
appears('ann2 label +3', '+$3', a2['label']); appears('ann2 label −6', '−$6', a2['label'])
appears('ann2 short', 'C 46', a2['shortLabel'])  # batch 5: short label shortened (PUB5-006)
for a in fig['annotations']:
    check(f'shortLabel ≤ 18 chars: {a["shortLabel"]}', len(a['shortLabel']) <= 18)
flow = ch['figures'][0]
st = ' '.join(s['text'] for s in flow['steps'])
appears('flow intraday 2dp', fmt(intra, 2, True) + '% intraday', st)
appears('flow c2c 2dp', fmt(c2c, 2) + '% close-to-close', st)
appears('flow $900 not $400', '$900 price loss, not $400', st)
appears('flow entry', '100 × $52, trigger $48', st)

# ---------------------------------------------------------------- solution
sol = ' '.join(ch['solution'])
appears('solution gap', f'(43−52)/52 = {gap_s}%', sol)
appears('solution intraday', f'(46−43)/43 = {intra_s}%', sol)
appears('solution c2c', f'(46−52)/52 = {c2c_s}%', sol)
appears('solution planned', '100 × (52−48) = $400', sol)
appears('solution gap loss', '100 × (52−43) = $900', sol)
appears('solution diff', 'additional $500', sol)

# ---------------------------------------------------------------- guided practice
g = ' '.join(ch['practice'][0]['solution'])
factor = (O / PC) * (C / O)
eq('guided chain', factor, C / PC)
appears('guided factor', f'= {rnd(factor, 7)}', g)
appears('guided pct', f'{c2c_s}%', g)
naive = rnd(gap, 4) + rnd(intra, 4)
check('guided naive sum differs', naive != rnd(c2c, 4), str(naive))
appears('guided summands', f'{gap_s}% and {intra_s}%', g)

# ---------------------------------------------------------------- independent practice
p = ch['practice'][1]
qtext, psol = p['question'], ' '.join(p['solution'])
rows = {r[0]: [F(str(v)) for v in r[1:]] for r in p['tables'][0]['rows']}
N, E, PCX, STOP, LIM = 60, F(80), F(80), F(77), F('76.50')
for tok in ('60 shares bought at $80', 'prior regular-session close $80', 'sell stop at $77', 'stop $77 and limit $76.50'):
    appears(f'question input {tok}', tok, qtext)
for k, (o, h, l, c) in rows.items():
    check(f'case {k} OHLC valid', l <= min(o, c) and h >= max(o, c))
    check(f'case {k} opening trade triggers (open ≤ stop)', o <= STOP)
check('only high differs', [rows['A'][i] == rows['B'][i] for i in range(4)] == [True, False, True, True])
oA = rows['A'][0]
gx = (oA / PCX - 1) * 100
eq('gap pct', gx, F('-5.625')); appears('gap text', '100 × (75.50/80 − 1) = −5.625%', psol)
R = N * (E - STOP); eq('1R', R, 180); appears('1R text', '60 × (80 − 77) = $180', psol)
pnl = N * (oA - E); eq('stop P&L', pnl, -270); appears('stop P&L text', '60 × (75.50 − 80) = −$270', psol)
eq('stop R', pnl / R, F('-1.5')); appears('stop R text', '−1.50R', psol)
eq('hidden extra', N * (STOP - oA), 90); appears('hidden extra text', 'additional $90 loss', psol)
check('A high below limit', rows['A'][1] < LIM); appears('A high text', '$76.40 high is ineligible', psol)
markA = N * (rows['A'][3] - E); eq('A close mark', markA, -240); appears('A mark text', '60 × (76 − 80) = −$240', psol)
appears('A mark R text', f'{fmt(markA / R, 6)}R', psol)
check('B high equals limit', rows['B'][1] == LIM); appears('B high text', '$76.50 high', psol)
check('B: open below limit so not fillable at open', rows['B'][0] < LIM)

# ---------------------------------------------------------------- evidence summaries
ev = {e['id']: e for e in ch['evidence']}
es = ev['events-gap-recovery-loss-accounting']['summary']
for tok in ('−5.625%', 'price-risk $180', '−$270/−1.50R', '−$240'):
    appears(f'evidence summary {tok}', tok, es)
check('evidence ids unique', len(ev) == len(ch['evidence']))
srcs = json.load(open('/tmp/batch5/events.sources.json', encoding='utf-8'))
for e in ch['evidence']:
    for sid in e['sourceIds']:
        check(f'evidence {e["id"]} source {sid} listed in chapter', sid in ch['sources'])
for sid in ch['sources']:
    check(f'source {sid} resolved', sid in srcs)

# ---------------------------------------------------------------- report
print(f'Comparisons: {count}')
print(f'Mismatches: {len(mismatches)}')
for m in mismatches:
    print('  MISMATCH', m)
for f_ in flags:
    print('  FLAG (consistency, not arithmetic):', f_)
# gap-definition context for the reviewer
print(f'  INFO next high {H} < prior low {PL}: range gap also present = {H < PL}')
assert not mismatches, 'arithmetic mismatches found'
