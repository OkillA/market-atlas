#!/usr/bin/env python3
"""Independent reproduction of every number in Chapter 28 `case-studies`.

Run from the repository root:  python3 -I docs/publication-batch7-assets/case-studies-reproduce.py

Read-only.  Inputs: docs/publication-batch7-assets/compiled-case-studies.json (compiled shipping
chapter) and the raw historical extracts the historical verifier reads (data/historical/*.csv,
provenance.json, cases.json, supplemental-selection.json).  Fictional arithmetic uses Fraction;
historical arithmetic uses Decimal on the exact CSV strings.  Checks are counted as numeric, text
or structural.  Review findings (demonstrated discrepancies) are asserted to exist and reported
separately; they are not counted as mismatches of the script's own reproduction.
"""
import csv, hashlib, json, re, sys
from decimal import Decimal as D, ROUND_HALF_UP, ROUND_DOWN, getcontext
from fractions import Fraction as F
from pathlib import Path

getcontext().prec = 50
ROOT = Path.cwd()
CH = json.loads((ROOT / 'docs/publication-batch7-assets/compiled-case-studies.json').read_text())
C = CH['chapter']
HIST = ROOT / 'data/historical'

counts = {'numeric': 0, 'text': 0, 'structural': 0}
mismatches, findings = [], []

def num(kind, label, actual, expected):
    counts[kind] += 1
    if actual != expected:
        mismatches.append(f'[{kind}] {label}: got {actual!r}, expected {expected!r}')

def N(label, actual, expected): num('numeric', label, actual, expected)
def S(label, cond): num('structural', label, bool(cond), True)
def T(label, text, *needles):
    for n in needles:
        num('text', f'{label} contains {n!r}', n in text, True)

def finding(fid, label, cond, detail):
    """Assert that a review finding is demonstrated by the current compiled text."""
    findings.append((fid, label, bool(cond), detail))

def fr(s):  # parse a decimal string (with optional unicode minus / $ / commas) to Fraction
    s = str(s).replace('−', '-').replace('$', '').replace(',', '').strip()
    return F(s)

def q(x, places):  # Fraction -> Decimal rounded half-up to `places`
    return (D(x.numerator) / D(x.denominator)).quantize(D(1).scaleb(-places), rounding=ROUND_HALF_UP)

sec = C['sections']
P = lambda i: ' '.join(sec[i]['paragraphs'])
ALL_TEXT = json.dumps(C, ensure_ascii=False)

# ---------------------------------------------------------------- shared P1 inputs (section 0)
p0 = P(0)
boundary, s0_close = F('50.00'), F('50.40')
ceiling = F(int(s0_close * F(101, 100) * 100), 100)          # rounded DOWN to the cent
N('P1 ceiling floor(50.40*1.01) to cents', ceiling, F('50.90'))
stop, target, qty_max, fee_side = F('48.60'), F('54.60'), 50, F('2.50')
T('section0 P1 inputs', p0, '$50', '$50.40', '$50.90', '50 shares', '$48.60/$54.60', '$2.50-per-side', '$20,000')
S('S0 close strictly above boundary', s0_close > boundary)
T('section0 counts seven fictional cases', P(0), 'first seven cases')
fictional = ['ATLS', 'BRDG', 'GAPS', 'SKIP', 'MIXD', 'AMB', 'RIVR']
N('number of distinct fictional cases in ledger', len({r[0].split(' /')[0].split(' failed')[0] for r in sec[6]['tables'][0]['rows']}), 7)

def ohlc(s):
    o, h, l, c = [fr(x) for x in s.split('/')]
    S(f'OHLC bounds {s}', l <= min(o, c) and h >= max(o, c))
    return o, h, l, c

def run_long(bars, entry, stop, target, shares, fee_side, entry_bar_skip=False):
    """P1 exit model for bars after the entry bar (or including it with no target credit)."""
    for i, (o, h, l, c) in enumerate(bars):
        if o <= stop: return i, o, 'open stop'
        if o >= target: return i, o, 'open target'
        if l <= stop: return i, stop, 'stop'          # stop-first if both
        if h > target: return i, target, 'target'      # P1: modeled fill only if trade > target
    return None, None, 'open'

def account(shares, entry, exitp, fee_side, start=F(20000)):
    debit = shares * entry + fee_side
    credit = shares * exitp - fee_side
    gross = shares * (exitp - entry)
    net = gross - 2 * fee_side
    return debit, credit, gross, net, start - debit + credit

# ---------------------------------------------------------------- Case one: ATLS / BRDG (section 1)
p1 = P(1)
tbl = sec[1]['tables'][0]['rows']
atls = [ohlc(r[1]) for r in tbl]
brdg = [atls[0]] + [ohlc(r[2]) for r in tbl[1:3]]
S('BRDG S1 same bar', tbl[0][2] == 'Same bar')
S('BRDG S4 already exited', 'Already exited' in tbl[3][2])
entry = F('50.60'); one_r = qty_max * (entry - stop)
N('ATLS/BRDG 1R', one_r, F(100))
N('entry debit', qty_max * entry + fee_side, F('2532.50'))
S('S1 entry price inside gate (stop, ceiling]', stop < entry <= ceiling)
i, px, why = run_long(atls, entry, stop, target, 50, fee_side)
N('ATLS exit bar index (S4)', i, 3); N('ATLS exit price', px, target); N('ATLS exit reason', why, 'target')
d, cr, g, n, cash = account(50, entry, px, fee_side)
N('ATLS exit credit', cr, F('2727.50')); N('ATLS cash', cash, F(20195)); N('ATLS gross', g, F(200)); N('ATLS net', n, F(195)); N('ATLS net R', n / one_r, F('1.95'))
T('ATLS prose', p1, '$2,532.50', '$100', 'S2 closes $52', 'low 50.70', 'S3 closes 52.80', 'opens 53.80', '54.80', 'low 52.80', '54.60', '$2,727.50', '$20,195', 'Gross $200', '$5 costs', '$195/+1.95R')
N('ATLS S2 close', atls[1][3], F(52)); N('ATLS S2 low', atls[1][2], F('50.70')); N('ATLS S3 close', atls[2][3], F('52.80'))
N('ATLS S4 open/high/low', (atls[3][0], atls[3][1], atls[3][2]), (F('53.80'), F('54.80'), F('52.80')))
S('ATLS S4 high strictly beyond target', atls[3][1] > target); S('ATLS S4 low above stop', atls[3][2] > stop)
i, px, why = run_long(brdg, entry, stop, target, 50, fee_side)
N('BRDG exit bar index (S3)', i, 2); N('BRDG exit price', px, stop)
d, cr, g, n, cash = account(50, entry, px, fee_side)
N('BRDG gross', g, F(-100)); N('BRDG net', n, F(-105)); N('BRDG cash', cash, F(19895)); N('BRDG net R', n / one_r, F('-1.05'))
N('BRDG S2 close/low', (brdg[1][3], brdg[1][2]), (F('49.60'), F('49.40')))
S('BRDG S2 close below 50 boundary (weakens continuation)', brdg[1][3] < boundary)
S('BRDG S2 low above stop', brdg[1][2] > stop); S('BRDG S3 low through stop, open above', brdg[2][2] < stop < brdg[2][0])
T('BRDG prose', p1, '49.60', '49.40', '48.40', '48.60', '−$100 gross', '−$105 net', 'cash $19,895')
# main figure
fig = C['figure']
cand = lambda p: [tuple(F(str(c[k])) for k in ('open', 'high', 'low', 'close')) for c in p['candles']]
N('figure ATLS candles = table', cand(fig['panels'][0]), atls)
N('figure BRDG candles = table', cand(fig['panels'][1]), brdg)
N('figure ATLS entry annotation', (fig['panels'][0]['annotations'][0]['index'], F(str(fig['panels'][0]['annotations'][0]['value']))), (0, entry))
N('figure ATLS target annotation', (fig['panels'][0]['annotations'][1]['index'], F(str(fig['panels'][0]['annotations'][1]['value']))), (3, target))
N('figure BRDG stop annotation', (fig['panels'][1]['annotations'][0]['index'], F(str(fig['panels'][1]['annotations'][0]['value']))), (2, stop))
T('figure caption fictional', fig['caption'], 'Fictional OHLC')

# ---------------------------------------------------------------- Case two: GAPS (section 2) + example/exercise/quiz
p2 = P(2)
g_stop, g_target, g_entry, g_cap, g0c, g_bound = F(77), F(86), F(80), F('80.60'), F('79.80'), F(79)
S('G0 close above mapped boundary', g0c > g_bound); S('G1 open in gate (77, 80.60]', g_stop < g_entry <= g_cap)
g1 = (F(80), F(81), F(79), F('80.50')); g2 = (F(70), F(72), F(68), F(71))
S('G1 entry bar touches neither level', g1[2] > g_stop and g1[1] < g_target)
i, px, why = run_long([g1, g2], g_entry, g_stop, g_target, 30, fee_side)
N('GAPS exit', (i, px, why), (1, F(70), 'open stop'))
for sh, oneR, notion, loss, net, netR, grossR, debit, credit, cashf in [
        (30, 90, 2400, -300, -305, '-3.3889', '-3.3333', '2402.50', '2097.50', 19695),
        (15, 45, 1200, -150, -155, '-3.4444', '-3.3333', '1202.50', '1047.50', 19845)]:
    d_, cr_, g_, n_, cash_ = account(sh, g_entry, F(70), fee_side)
    R = sh * (g_entry - g_stop)
    N(f'GAPS{sh} 1R', R, F(oneR)); N(f'GAPS{sh} notional', sh * g_entry, F(notion)); N(f'GAPS{sh} gross', g_, F(loss))
    N(f'GAPS{sh} net', n_, F(net)); N(f'GAPS{sh} net R 4dp', q(n_ / R, 4), D(netR)); N(f'GAPS{sh} gross R 4dp', q(g_ / R, 4), D(grossR))
    N(f'GAPS{sh} debit', d_, F(debit)); N(f'GAPS{sh} credit', cr_, F(credit)); N(f'GAPS{sh} final cash', cash_, F(cashf))
N('GAPS15 cash after entry', F(20000) - (15 * g_entry + fee_side), F('18797.50'))
prop_fee = F(5) * 15 / 30
N('proportional-fee 15-share net R equals 30-share net R', (F(-150) - prop_fee) / 45, F(-305) / 90)
T('GAPS prose', p2, '$79.80', '$79.00', '$77', '$80.60', '$80', '30 shares', '30 × ($80 − $77) = $90', '$86', 'O80/H81/L79/C80.50', 'O70/H72/L68/C71', '30 × ($70 − $80) = −$300', 'net −$305', '−305 ÷ 90 = −3.3889', '$2,402.50', '$2,097.50', '$19,695',
  '$45', '$1,200', '$150', '−3.3333R gross', '$155', '−3.4444R')
ex = C['example']['text']
T('example', ex, '1R $90', 'gross loss $300', 'costs $5', '−$305/−3.3889R', '1R $45', 'gross loss $150', '−$155/−3.4444R', '−3.3333')
sol = ' '.join(C['solution'])
T('exercise solution', sol, '$45', '$1,200', '$1,202.50', '$18,797.50', '$1,047.50', '$19,845', 'Gross −$150', 'costs $5', 'net −$155', '−150/45 = −3.3333', '−155/45 = −3.4444')
quiz = C['quiz']
N('quiz answer index', quiz['answer'], 1)
S('quiz answer in range and feedback per option', 0 <= quiz['answer'] < len(quiz['options']) == len(quiz['feedback']))
S('quiz option 0 false: net R does change', q(F(-155) / 45, 4) != q(F(-305) / 90, 4))
S('quiz option 1 true values', '−3.3889' in quiz['options'][1] and '−3.4444' in quiz['options'][1])
S('quiz option 2 false: net R does not halve', F(-155) / 45 != (F(-305) / 90) / 2)
S('quiz explanation equals correct feedback', quiz['explanation'] == quiz['feedback'][quiz['answer']])

# ---------------------------------------------------------------- Case three/four: SKIP, MIXD, AMB (sections 3-4)
p3, p4 = P(3), P(4)
S('SKIP $52 offer exceeds ceiling', F(52) > ceiling); T('SKIP prose', p3, '$52', '50.90', 'S2 close of $56')
T('MIXD prose (revised)', p4, '$48.90 and $49.90', 'first session of a new week', '$49.70', 'down from $49.90', '$50 boundary', 'neither the aligned nor the conflicting label')
wk_prev, wk_last, m0 = F('48.90'), F('49.90'), F('49.70')
S('MIXD prior daily close not an M1 trigger (<= $50)', not wk_last > F(50))
S('MIXD weekly close-direction up', wk_last > wk_prev); S('MIXD daily change down (last week close = prior daily close)', m0 < wk_last)
S('MIXD Ch.17 label: neither (labels only for upward daily change)', not m0 > wk_last)
S('MIXD daily close not strictly above 50', not m0 > F(50))
S('regression #1: no $104/$106 weekly closes remain', '$104 and $106' not in p4 and 'timeframe conflict' not in p4)
# New residual: the last session of the completed week closed at $50.30 > $50, which is itself an M1 daily trigger.
finding('CS28-MIXD2', 'revised MIXD: prior daily close $50.30 is strictly above the frozen $50 boundary, so M1 would already have triggered a next-opening order at M0',
        wk_last > F(50) and 'previously frozen $50 boundary' in p4 and 'no trade is authorized' in p4,
        'Use completed weekly closes that stay at or below $50 (e.g. $48.90 and $49.90, M0 close $49.70 down from $49.90), or state the boundary was frozen only after the M-1 close.')
finding('CS28-MIXD2', 'section 6 still lists MIXD as a "conflict" path after the revision says it receives no conflict label',
        'skip, conflict and recovery paths' in P(6), 'sections[6].paragraphs[1]: "follow-through, ordinary loss, gap, skip, conflict and recovery paths".')
amb = (F('50.80'), F('54.80'), F('48.20'), F(51))
S('AMB open strictly between levels', stop < amb[0] < target); S('AMB both levels inside bar', amb[2] <= stop and amb[1] >= target)
_, sf_px, _ = run_long([amb], entry, stop, target, 50, fee_side)
N('AMB stop-first exit', sf_px, stop)
sf = account(50, entry, stop, fee_side); tf = account(50, entry, target, fee_side)
N('AMB stop-first net/R/cash', (sf[3], sf[3] / one_r, sf[4]), (F(-105), F('-1.05'), F(19895)))
N('AMB target-first net/R/cash', (tf[3], tf[3] / one_r, tf[4]), (F(195), F('1.95'), F(20195)))
N('AMB difference $ and R', (tf[3] - sf[3], (tf[3] - sf[3]) / one_r), (F(300), F(3)))
T('AMB prose', p4, 'O50.80/H54.80/L48.20/C51.00', '$105/1.05R', '+$195/+1.95R', '$300 or 3R', '50.80→54.80→48.20→51.00', '50.80→48.20→54.80→51.00')
ambfig = C['figures'][0]['panels']
r1 = [F(str(v)) for v in ambfig[0]['series'][0]['values']]; r2 = [F(str(v)) for v in ambfig[1]['series'][0]['values']]
oh = lambda a: (a[0], max(a), min(a), a[-1])
N('AMB routes identical OHLC', oh(r1), oh(r2)); N('AMB route OHLC = bar', oh(r1), amb)
first_cross = lambda a: next(('target' if v >= target else 'stop') for v in a[1:] if v >= target or v <= stop)
N('AMB route 1 target first', first_cross(r1), 'target'); N('AMB route 2 stop first', first_cross(r2), 'stop')
N('AMB annotation indices', (ambfig[0]['annotations'][0]['index'], ambfig[1]['annotations'][0]['index']), (1, 1))
# Revised independent practice: fresh fictional bar (40 shares, entry 25, stop 24, target 27, $5 round trip)
pq2 = C['practice'][1]['question']; pr2 = ' '.join(C['practice'][1]['solution'])
T('practice AMB inputs', pq2, '$20,000', '40 shares filled at $25.00', 'stop $24.00', 'target $27.00', '$5 round-trip', 'O25.20/H27.30/L23.80/C26.10', 'O23.90/H27.30/L23.80/C26.10')
a_sh, a_e, a_s, a_t, a_fs = 40, F(25), F(24), F(27), F('2.50')
a_R = a_sh * (a_e - a_s); N('AMB-practice 1R', a_R, F(40))
bar_a = (F('25.20'), F('27.30'), F('23.80'), F('26.10')); bar_b = (F('23.90'), F('27.30'), F('23.80'), F('26.10'))
S('AMB-practice (a) open strictly inside, both levels reached (high strictly above target)', a_s < bar_a[0] < a_t and bar_a[2] <= a_s and bar_a[1] > a_t)
_, px_a, why_a = run_long([bar_a], a_e, a_s, a_t, a_sh, a_fs); N('AMB-practice (a) P1 stop-first exit', (px_a, why_a), (a_s, 'stop'))
sfa = account(a_sh, a_e, a_s, a_fs); tfa = account(a_sh, a_e, a_t, a_fs)
N('AMB-practice stop-first gross/net/R/cash', (sfa[2], sfa[3], sfa[3] / a_R, sfa[4]), (F(-40), F(-45), F('-1.125'), F(19955)))
N('AMB-practice target-first gross/net/R/cash', (tfa[2], tfa[3], tfa[3] / a_R, tfa[4]), (F(80), F(75), F('1.875'), F(20075)))
N('AMB-practice difference $ / R', (tfa[3] - sfa[3], (tfa[3] - sfa[3]) / a_R), (F(120), F(3)))
_, px_b, why_b = run_long([bar_b], a_e, a_s, a_t, a_sh, a_fs); N('AMB-practice (b) opening-gap exit', (px_b, why_b), (F('23.90'), 'open stop'))
sb = account(a_sh, a_e, px_b, a_fs)
N('AMB-practice (b) gross/net/R', (sb[2], sb[3], sb[3] / a_R), (F(-44), F(-49), F('-1.225')))
T('practice AMB solution', pr2, '1R = 40 × ($25.00 − $24.00) = $40', '−$40 gross, −$45 net, −45 ÷ 40 = −1.125R', '$20,000 − $45 = $19,955', '+$80 gross, +$75 net, +1.875R', '$20,075',
  '$120, or exactly 3R', '40 × (23.90 − 25.00) = −$44 gross, −$49 net, −49 ÷ 40 = −1.225R', 'stays $40', '−$45/−1.125R')
S('regression #4: AMB practice no longer repeats the worked $19,895/$20,195 endings', '$19,895' not in pr2 and '$20,195' not in pr2)

# ---------------------------------------------------------------- Case five: RIVR (section 5)
p5 = P(5)
rt = sec[5]['tables'][0]['rows']
rb = [ohlc(r[1]) for r in rt]
r_sup, r_top, r_stop, r_target, r_lo, r_hi = F(30), F(34), F(29), F(35), F(29), F(31)
N('RIVR R0 breach close below support', rb[0][3] < r_sup, True)
S('RIVR R1 close in (30, 34]', r_sup < rb[1][3] <= r_top)
S('RIVR R2 open in (29, 31]', r_lo < rb[2][0] <= r_hi)
R1R = 50 * (rb[2][0] - r_stop); N('RIVR 1R', R1R, F(100))
i, px, why = run_long(rb[2:], rb[2][0], r_stop, r_target, 50, fee_side)
N('RIVR exit (R4 target)', (i + 2, px, why), (4, r_target, 'target'))
d, cr, g, n, cash = account(50, rb[2][0], px, fee_side)
N('RIVR gross/net/R/cash', (g, n, n / R1R, cash), (F(200), F(195), F('1.95'), F(20195)))
N('RIVR holding sessions R2..R11 inclusive', len(range(2, 12)), 10)
fail = [rb[2], (F('30.70'), F('31.20'), F('28.80'), F('29.20'))]
i, px, why = run_long(fail, rb[2][0], r_stop, r_target, 50, fee_side)
fa = account(50, rb[2][0], px, fee_side)
N('RIVR failed branch', (i, px, fa[2], fa[3], fa[3] / R1R), (1, r_stop, F(-100), F(-105), F('-1.05')))
S('RIVR third branch 31.20 skipped', not (r_lo < F('31.20') <= r_hi))
S('R1 signal does not justify R1 open 29.90', rb[1][0] == F('29.90'))
T('RIVR prose', p5, '$30 to $34', 'O30.50/H30.60/L29.50/C29.80', 'O29.90/H30.80/L29.70/C30.60', '($29.00, $31.00]', '$29 stop', '$35 target', 'O31.00/H32.20/L30.80/C32.00', '50 × (31−29) = $100', 'O32.10/H33.80/L31.80/C33.50', 'O34.00/H35.20/L33.70/C34.90', 'Gross is $200', 'net $195/+1.95R', 'cash $20,195', 'O30.70/H31.20/L28.80/C29.20', '−$100 gross, −$105 net and −1.05R', 'opens 31.20')
rf = C['figures'][1]
N('RIVR figure candles = table', cand(rf), rb)
N('RIVR figure annotations', [(a['index'], F(str(a['value']))) for a in rf['annotations']], [(1, F('30.6')), (2, F(31)), (4, F(35))])
pr1 = ' '.join(C['practice'][0]['solution'])
T('practice RIVR solution', pr1, '31.00', '$100 price risk', '31.20', '50 × 4 = $200', 'net $195/+1.95R', '29.90')
# Cross-chapter check (Ch.27 spring rule): same bars, breach definition and re-breach handling
cf_rule_breach = r_sup * F(99, 100)                    # Ch.27: breach = low <= 29.70
S('RIVR R0 = Ch27 session 17 bar', rb[0] == (F('30.50'), F('30.60'), F('29.50'), F('29.80')))
S('RIVR R1 = Ch27 session 18 spring bar', rb[1] == (F('29.90'), F('30.80'), F('29.70'), F('30.60')))
S('R0 qualifies as breach (low <= 29.70)', rb[0][2] <= cf_rule_breach)
N('R0 breach size', (r_sup - rb[0][2]) / r_sup, F(1, 60))   # 1.67%
S('R1 low 29.70 is a qualifying low but belongs to the open R0 event (no restart)', rb[1][2] <= cf_rule_breach)
# Revised RR1: window = breach session close (R0) + next three sessions (R1..R3); first close in (30, 34] triggers.
window = [0, 1, 2, 3]
trig = next(k for k in window if r_sup < rb[k][3] <= r_top)
N('RR1 trigger session under revised rule', trig, 1)
# Restart reading (rejected by the revised text) would have moved the trigger and skipped the trade; the text now forecloses it.
alt_trigger = next(k for k in range(1, 5) if r_sup < rb[k][3] <= r_top and k > 1)
S('restart reading would trigger at R2 and skip at R3 open 32.10 > 31', alt_trigger == 2 and rb[3][0] > r_hi)
T('RIVR revised rule text', p5, 'at least 1% below support ($29.70 or lower)', 'Rule RR1 opens one recovery window', 'from the breach session’s own close through the next three sessions',
  'do not restart it', 'R1’s own $29.70 low belongs to the open R0 breach event', 'RR1’s trigger')
S('regression #2: rule names RR1/GR1 used in prose and ledger', 'Rule R1 ' not in p5 and 'rule GR1' in P(2) and any(r[0] == 'RIVR / RR1' for r in sec[6]['tables'][0]['rows']))
finding('CS28-RESID', 'RIVR table row still reads "freeze R1 entry ceiling 31" (session label next to the renamed RR1 rule)',
        any('freeze R1 entry ceiling' in r[2] for r in rt), 'Suggest "R1 close: recovery trigger; freeze R2 entry ceiling 31".')

# ---------------------------------------------------------------- Ledger table (section 6)
ledger = sec[6]['tables'][0]['rows']
expect = {'ATLS / P1': (50, 100, 200, 5, 195, '+1.95R'), 'BRDG / P1': (50, 100, -100, 5, -105, '−1.05R'), 'GAPS / GR1': (30, 90, -300, 5, -305, '−3.3889R'),
          'AMB / P1': (50, 100, -100, 5, -105, '−1.05R'), 'RIVR / RR1': (50, 100, 200, 5, 195, '+1.95R'), 'RIVR failed branch / RR1': (50, 100, -100, 5, -105, '−1.05R')}
for row in ledger:
    if row[0] in expect:
        sh, R, gr, co, ne, lab = expect[row[0]]
        N(f'ledger {row[0]} numbers', (row[1], fr(row[2]), fr(row[3]), fr(row[4]), fr(row[5])), (sh, F(R), F(gr), F(co), F(ne)))
        N(f'ledger {row[0]} net = gross - costs', fr(row[5]), fr(row[3]) - fr(row[4]))
        T(f'ledger {row[0]} R label', row[6], lab)
    else:
        N(f'ledger {row[0]} no trade', (row[1], row[2], row[4], row[5]), (0, 'N/A', 0, 'N/A'))
N('ledger rows', len(ledger), 8)

# ---------------------------------------------------------------- GME (sections 8-9, figure 2)
p8, p9 = P(8), P(9)
N('GME Jan13 change', F('31.40') - F('19.95'), F('11.45'))
N('GME Jan13 pct 2dp', q((F('31.40') / F('19.95') - 1) * 100, 2), D('57.39'))
N('GME volume ratio rounds to roughly 20', q(F(144, 7), 0), D('21'))
S('roughly 20 times: 144/7 within [19, 22]', 19 <= F(144, 7) <= 22)
N('GME Jan26 derived close', F('347.51') - F('199.53'), F('147.98'))
N('GME Jan28 derived close', F('347.51') - F('153.91'), F('193.60'))
up = (F('347.51') / F('147.98') - 1) * 100; dn = (F('193.60') / F('347.51') - 1) * 100
N('GME Jan28 pct 2dp', q(dn, 2), D('-44.29'))
N('GME Jan27 pct 2dp (regression #5)', q(up, 2), D('134.84'))
S('regression #5: +134.83% removed', '+134.83%' not in p9)
T('GME prose', p8 + p9, '31.40 − 19.95 = $11.45', '57.39%', 'roughly 20 times', 'about 144 million against 7 million', '+134.84%', '$147.98', '$347.51 − $199.53', '$193.60', '$347.51 − $153.91', '−44.29%', '$483')
gf = C['figures'][2]['panels']
N('GME panel1 closes', [F(str(r[1])) for r in gf[0]['rows']], [F('19.95'), F('31.4')])
N('GME panel2 closes', [F(str(r[1])) for r in gf[1]['rows']], [F('147.98'), F('347.51'), F('193.6')])
N('GME panel3 high', F(str(gf[2]['rows'][0][1])), F(483)); S('GME high above Jan28 close', F(483) > F('193.60'))
S('GME figure historical flag', C['figures'][2].get('historical') is True)
N('GME figure placed after Jan-13 decision section', C['figures'][2]['afterSection'], 8)
finding('CS28-GME-stage (declined)', 'figure containing Jan 26-28 values is placed after the Jan-13 section that says January 27 is hidden', C['figures'][2]['afterSection'] == 8 and 'January 27’s later price is hidden' in p8,
        'Panels 2-3 show 347.51/193.60/483 before section 9 introduces them.')

# ---------------------------------------------------------------- Apple split algebra (section 10)
for Pp, V, Nn in [(F(600), F(1000), F(13)), (F('645.57'), F(7), F(1))]:
    N('split value invariance NP=(7N)(P/7)', Nn * Pp, (7 * Nn) * (Pp / 7)); N('split volume 7V*(P/7)=VP dollar', 7 * V * (Pp / 7), V * Pp)
T('Apple prose', P(10), 'seven-for-one', 'April 23, 2014', 'June 2 record date', 'June 9', 'June 6', 'P/7', '7V', '7N')

# ---------------------------------------------------------------- Historical gallery from raw CSVs
prov = json.loads((HIST / 'provenance.json').read_text())
rows = {}
for src in prov['files']:
    raw = (HIST / src['file']).read_bytes()
    N(f'{src["symbol"]} extract sha256', hashlib.sha256(raw).hexdigest(), src['extract_sha256'])
    rs = list(csv.DictReader(raw.decode().splitlines()))
    N(f'{src["symbol"]} extract rows', len(rs), src['extract_rows'])
    rows[src['symbol']] = rs

def classify(sym, month):
    rs = rows[sym]; start = f'2016-{month:02d}-01'
    k = next(i for i, r in enumerate(rs) if r['Date'] >= start)
    win = rs[k - 5:k + 6]
    c = D(rs[k]['Close']); prior = [D(r['Close']) for r in rs[k - 5:k]]
    mean = sum(prior) / 5; up, lo = c * D('1.01'), c * D('0.99')
    cls, date, phase = ('skipped', None, None) if not c > mean else ('ordinary', None, None)
    if cls != 'skipped':
        for r in rs[k + 1:k + 6]:
            o, h, l = D(r['Open']), D(r['High']), D(r['Low'])
            if o >= up or o <= lo: cls, date, phase = ('favorable' if o >= up else 'adverse'), r['Date'], 'open'; break
            if h >= up or l <= lo:
                cls = 'ambiguous' if (h >= up and l <= lo) else ('favorable' if h >= up else 'adverse'); date, phase = r['Date'], 'range'; break
    return dict(sym=sym, cutoff=rs[k]['Date'], c=c, mean=mean, sum=sum(prior), up=up, lo=lo, cls=cls, date=date, phase=phase, win=win, k=k)

cells = [classify(s, m) for m in range(1, 13) for s in ('AAPL', 'MSFT', 'SPY')]
gal = sec[11]; lt = gal['tables'][0]['rows']
N('ledger has 36 rows', len(lt), 36)
for cell, row in zip(cells, lt):
    N(f'ledger {cell["sym"]} {cell["cutoff"]} symbol/cutoff', (row[0], row[1]), (cell['sym'], cell['cutoff']))
    cs, ms = row[2].split(' / ')
    N(f'ledger {cell["sym"]} {cell["cutoff"]} close', D(cs), cell['c']); N(f'ledger {cell["sym"]} {cell["cutoff"]} exact mean', D(ms), cell['mean'])
    N(f'ledger {cell["sym"]} {cell["cutoff"]} class', row[3], cell['cls'])
    exp5 = 'No observation gate' if cell['cls'] == 'skipped' else ('No touch in five sessions' if cell['cls'] == 'ordinary' else f'{cell["date"]} {cell["phase"]}')
    N(f'ledger {cell["sym"]} {cell["cutoff"]} first observation', row[4], exp5)
cnt = {}
for c_ in cells: cnt[c_['cls']] = cnt.get(c_['cls'], 0) + 1
N('class counts', cnt, {'skipped': 18, 'adverse': 11, 'favorable': 6, 'ordinary': 1})
T('gallery counts prose', P(11), '18 skips', 'six favorable', 'eleven adverse', 'one ordinary/unresolved', 'none is an ambiguous')
reps = {}
for c_ in sorted(cells, key=lambda x: (x['cutoff'], x['sym'])): reps.setdefault(c_['cls'], c_)
N('representatives', {k: f'{v["sym"]}-{v["cutoff"][:7]}' for k, v in reps.items()},
  {'skipped': 'AAPL-2016-01', 'adverse': 'MSFT-2016-02', 'favorable': 'AAPL-2016-03', 'ordinary': 'SPY-2016-10'})
N('only open-phase resolution in cohort', [f'{c_["sym"]}-{c_["cutoff"]}' for c_ in cells if c_['phase'] == 'open'], ['SPY-2016-04-01'])
cols = ('Open', 'High', 'Low', 'Close')
attempt = C['learnerAttempt']
for idx, (key, si, fi) in enumerate([('AAPL-2016-01', 12, 3), ('MSFT-2016-02', 13, 4), ('AAPL-2016-03', 14, 5), ('SPY-2016-10', 15, 6)]):
    cell = next(c_ for c_ in cells if f'{c_["sym"]}-{c_["cutoff"][:7]}' == key)
    win = [[r[k] for k in cols] for r in cell['win']]
    pt = attempt['tables'][idx]
    S(f'packet {key} title', pt['title'].startswith(key))
    N(f'packet {key} rows = context+cutoff only', [r[1:] for r in pt['rows']], win[:6])
    N(f'packet {key} last row is cutoff', pt['rows'][-1][0], f'{cell["cutoff"]} · CUTOFF')
    S(f'packet {key} no later row', all('later' not in r[0] for r in pt['rows']))
    st = sec[si]['tables'][0]['rows']
    N(f'section {key} table rows', [r[1:] for r in st], win)
    N(f'section {key} dates', [r[0].split(' ·')[0] for r in st], [r['Date'] for r in cell['win']])
    fg = C['figures'][fi]
    N(f'figure {key} candles', [tuple(D(str(c[k])) for k in ('open', 'high', 'low', 'close')) for p in fg['panels'] for c in p['candles']],
      [tuple(D(x) for x in w) for w in win])
    N(f'figure {key} panel split 6/5', [len(p['candles']) for p in fg['panels']], [6, 5])
    S(f'figure {key} historical flag', fg.get('historical') is True); T(f'figure {key} caption', fg['caption'], 'Historical archive OHLC', 'No fills or returns')
packet_text = ' '.join(attempt['paragraphs'])
for word in ('skipped', 'favorable follow-through', 'continuation check fails', 'adverse path', 'ordinary/unresolved window', '2016-01-05', '2016-02-02', '2016-03-03', '2016-10-04'):
    S(f'packet text has no outcome leak {word!r}', word not in packet_text)
T('packet rule', packet_text, 'strictly above', '0.99 × cutoff close', '1.01 × cutoff close', 'next five archive bars', 'strictly inside', 'path labels, not trades')

aj = next(c_ for c_ in cells if c_['sym'] == 'AAPL' and c_['cutoff'] == '2016-01-04')
N('AAPL Jan sum', aj['sum'], D('516.19')); N('AAPL Jan mean', aj['mean'], D('103.238')); S('AAPL Jan skip', aj['c'] < aj['mean'])
T('AAPL Jan prose', P(12), '104.01, 102.83, 104.68, 103.32 and 101.35', '516.19', '103.238', '101.44', 'January 5–11')
N('AAPL Jan reveal dates', [r['Date'] for r in aj['win'][6:]], ['2016-01-05', '2016-01-06', '2016-01-07', '2016-01-08', '2016-01-11'])
mf = next(c_ for c_ in cells if c_['sym'] == 'MSFT' and c_['cutoff'] == '2016-02-01')
N('MSFT sum', mf['sum'], D('250.949')); N('MSFT mean', mf['mean'], D('50.1898'))
N('MSFT levels', (mf['lo'], mf['up']), (D('51.82353'), D('52.87047')))
f2 = mf['win'][6]; o, h, l = D(f2['Open']), D(f2['High']), D(f2['Low'])
S('MSFT Feb2 open strictly inside', mf['lo'] < o < mf['up']); S('MSFT Feb2 low crosses lower', l <= mf['lo']); S('MSFT Feb2 high below upper', h < mf['up'])
N('MSFT nearest-cent lower', mf['lo'].quantize(D('0.01'), ROUND_HALF_UP), D('51.82')); S('MSFT open above rounded lower', o > D('51.82'))
N('fictional 51.826 rounds to 51.83', D('51.826').quantize(D('0.01'), ROUND_HALF_UP), D('51.83'))
S('fictional open 51.828 above exact, at/below rounded', D('51.826') < D('51.828') <= D('51.83'))
T('MSFT prose', P(13), '52.347', '50.1898', '52.87047', '51.82353', '51.830', '50.377', '51.917', '51.82', '51.826', '51.83', '51.828')
# Revised Transfer task: SPY-2016-04, recomputed from spy.csv (not from cases.json or the task's own table)
tk = C['practice'][3]; tq = tk['question']; ts = ' '.join(tk['solution'])
sa = next(c_ for c_ in cells if c_['sym'] == 'SPY' and c_['cutoff'] == '2016-04-01')
ttab = tk['tables'][0]['rows']
N('SPY-04 task table: 8 rows = 5 context + cutoff + 2 later', len(ttab), 8)
N('SPY-04 task dates = CSV', [r[0].split(' ')[0] for r in ttab], [r['Date'] for r in sa['win'][:8]])
N('SPY-04 task OHLC = CSV (numeric, trailing zeros allowed)', [[D(x) for x in r[1:]] for r in ttab], [[D(r[k]) for k in cols] for r in sa['win'][:8]])
S('SPY-04 cutoff row labelled', ttab[5][0] == '2016-04-01 (cutoff)')
S('SPY-04 table stops at the resolving bar', ttab[-1][0] == sa['date'])
N('SPY-04 prior-five sum / mean', (sa['sum'], sa['mean']), (D('992.52'), D('198.504')))
S('SPY-04 gate passes', sa['c'] > sa['mean']); N('SPY-04 C', sa['c'], D('200.77'))
N('SPY-04 levels', (sa['up'], sa['lo']), (D('202.7777'), D('198.7623')))
a4, a5 = sa['win'][6], sa['win'][7]
S('Apr 4 open inside, high below upper, low above lower', sa['lo'] < D(a4['Open']) < sa['up'] and D(a4['High']) < sa['up'] and D(a4['Low']) > sa['lo'])
S('Apr 5 open at/below lower -> adverse at open', D(a5['Open']) <= sa['lo'])
N('SPY-04 classification', (sa['cls'], sa['date'], sa['phase']), ('adverse', '2016-04-05', 'open'))
S('March 25, 2016 absent from archive', all(r['Date'] != '2016-03-25' for r in rows['SPY']))
S('Apr 4 close above Apr 5 open (gap between the Apr 4 close and Apr 5 open)', D(a4['Close']) > D(a5['Open']) and D(a4['Close']) > sa['lo'])
T('SPY-04 solution', ts, '197.06, 197.18, 199.01, 199.88 and 199.39', '992.52', '198.504', 'C = 200.77', '1.01 × 200.77 = 202.7777', '0.99 × 200.77 = 198.7623',
  '200.68', '200.91', '199.75', '198.58', '200.12 high and 197.81 low', 'only adverse-at-the-open cell', 'no stop fill, slippage or loss is claimed')
S('regression #4: Transfer task no longer repeats the worked MSFT case', '51.82353' not in ts and tk.get('tables'))
finding('CS28-RESID', 'SPY task (d) says the level "was skipped over between closes"; the gap is between the April 4 close (200.10) and the April 5 open (198.58)',
        'skipped over between closes' in ts, 'Suggest "the price moved past the level between the April 4 close and the April 5 open, so no in-session crossing occurred".')
finding('CS28-RESID', 'SPY task (a) says March 25 "has no archive row and is not interpolated" without saying it was the Good Friday market holiday',
        'March 25 has no archive row' in ts and 'holiday' not in ts, 'March 25, 2016 was Good Friday (Easter was March 27); NYSE was closed, so there is no missing session to interpolate.')
finding('CS28-RESID', 'practice level "Transfer" is the only capitalised/non-standard level value in the book (others: guided/independent)',
        tk['level'] == 'Transfer', 'Renders as eyebrow "Transfer practice" beside "independent practice"; pre-existing, not introduced by this revision.')
am = next(c_ for c_ in cells if c_['sym'] == 'AAPL' and c_['cutoff'] == '2016-03-01')
N('AAPL Mar sum/mean', (am['sum'], am['mean']), (D('465.743'), D('93.1486'))); N('AAPL Mar levels', (am['lo'], am['up']), (D('96.33591'), D('98.28209')))
m2, m3 = am['win'][6], am['win'][7]
S('Mar 2 range inside levels', am['lo'] < D(m2['Low']) and D(m2['High']) < am['up'])
N('Mar 2 range', (D(m2['Low']), D(m2['High'])), (D('96.449'), D('97.661')))
S('Mar 3 open inside, low above lower, high above upper', am['lo'] < D(m3['Open']) < am['up'] and D(m3['Low']) > am['lo'] and D(m3['High']) >= am['up'])
T('AAPL Mar prose', P(14), '465.743', '93.1486', '97.309', '96.33591/98.28209', '96.449–97.661', '97.357', '97.232', '98.459')
so = next(c_ for c_ in cells if c_['sym'] == 'SPY' and c_['cutoff'] == '2016-10-03')
N('SPY Oct mean/levels', (so['mean'], so['lo'], so['up']), (D('211.216'), D('209.385'), D('213.615')))
later = so['win'][6:]
N('SPY lowest low / highest high', (min(D(r['Low']) for r in later), max(D(r['High']) for r in later)), (D('209.75'), D('212.41')))
S('SPY final close slightly above cutoff', D(later[-1]['Close']) > so['c'])
N('SPY observation dates', [r['Date'] for r in later], ['2016-10-04', '2016-10-05', '2016-10-06', '2016-10-07', '2016-10-10'])
T('SPY prose', P(15), '211.500', '211.216', '209.385/213.615', '209.750', '212.410', 'October 4–10')

# ---------------------------------------------------------------- Post-audit diagnostic (section 16, figure 7)
dual = []
for c_ in cells:
    for r in c_['win'][6:]:
        o, h, l = D(r['Open']), D(r['High']), D(r['Low'])
        if c_['lo'] < o < c_['up'] and h >= c_['up'] and l <= c_['lo']: dual.append((r['Date'], c_['sym'], c_))
dual.sort(key=lambda x: (x[0], x[1]))
N('first dual-level later bar', (dual[0][0], dual[0][1], dual[0][2]['cutoff']), ('2016-02-05', 'AAPL', '2016-02-01'))
af = dual[0][2]
N('AAPL Feb mean/levels', (af['mean'], af['lo'], af['up']), (D('93.2486'), D('91.91061'), D('93.76739'))); S('AAPL Feb original skip', af['cls'] == 'skipped')
dt = sec[16]['tables'][0]['rows']
N('diagnostic table rows = CSV 2016-01-25..2016-02-08', [r[1:] for r in dt], [[r[k] for k in cols] for r in af['win']])
feb4 = af['win'][8]; S('Feb 4 bar does not span both levels', not (D(feb4['High']) >= af['up'] and D(feb4['Low']) <= af['lo']))
N('diagnostic figure candle', [D(str(af_)) for af_ in (C['figures'][7]['panels'][0]['candles'][0][k] for k in ('open', 'high', 'low', 'close'))], [D('93.429'), D('93.816'), D('90.69'), D('91.009')])
N('diagnostic routes', [[D(str(v)) for v in p['series'][0]['values']] for p in C['figures'][7]['panels'][1:]],
  [[D('93.429'), D('93.816'), D('90.69'), D('91.009')], [D('93.429'), D('90.69'), D('93.816'), D('91.009')]])
T('diagnostic prose', P(16), '92.839', '93.2486', '91.91061', '93.76739', '93.429/93.816/90.690/91.009')
supp = json.loads((HIST / 'supplemental-selection.json').read_text()); N('supplemental selection record', supp['selected'], 'AAPL-2016-02 / 2016-02-05')
# Dividend-adjustment sensitivity of the diagnostic (external facts: Apple Q1 FY16 release, $0.52 dividend, record 2016-02-08;
# Nasdaq dividend history ex-date 2016-02-04).  Archive is dividend-adjusted, so Feb 1 levels and Feb 5 bar carry different factors.
margin = D(af['win'][9]['High']) / af['up'] - 1
N('Feb 5 high exceeds adjusted upper by (6dp)', margin.quantize(D('0.000001')), D('0.000518'))
dollars = D(af['win'][9]['High']) - af['up']
N('margin in archive dollars (3dp)', dollars.quantize(D('0.001')), D('0.049'))
max_raw_price_for_flip = (D('0.52') / margin).quantize(D('1'), ROUND_DOWN)
S('dual span would vanish for any raw price below ~$1,003 (0.52/margin)', max_raw_price_for_flip > 900)
T('regression #3: dividend disclosure in prose', P(16), '$0.52', 'record on February 8', 'ex-dividend on February 4', 'about $0.05', 'probably reached only the lower level')
S('disclosed "about $0.05" matches margin', abs(dollars - D('0.05')) < D('0.005'))
# In unadjusted terms (proportional adjustment, d = 0.52 / raw price ~ $96): low still reaches the lower level
d_frac = D('0.52') / D('96')
S('unadjusted: high below upper, low still below lower (approx raw $96)', (1 + margin) * (1 - d_frac) < 1 and (D('90.69') / af['lo']) * (1 - d_frac) < 1)
T('regression #3: caption mention', C['figures'][7]['caption'], 'ex on February 4')
S('new source record rc-apple-dividend-2016 present and scoped', 'rc-apple-dividend-2016' in C['sources'] and 'not from this release' in CH['sources']['rc-apple-dividend-2016']['supports'])
finding('CS28-RESID', 'figure 7 caption sentence is garbled: "the adjusted levels and bar may not span both levels in unadjusted prices"',
        'so the adjusted levels and bar may not span both levels' in C['figures'][7]['caption'],
        'Suggest "so in unadjusted prices the bar may not have reached the upper level."')
finding('CS28-RESID', 'rc-apple-dividend-2016 is listed in chapter sources but no evidence record cites it',
        not any('rc-apple-dividend-2016' in (e.get('sourceIds') or []) for e in C['evidence']),
        'Add it to the gallery evidence record (or a short historical evidence item) so the strict claim-to-source trail covers the dividend caution.')
# Which ledger windows contain an AAPL/MSFT ex-date between cutoff and resolving/diagnostic bar (Nasdaq history)?
exd = {'AAPL': ['2016-02-04', '2016-05-05', '2016-08-04', '2016-11-03'], 'MSFT': ['2016-02-16', '2016-05-17', '2016-08-16', '2016-11-15']}
affected = []
for c_ in cells:
    if c_['sym'] in exd and c_['cls'] != 'skipped':
        end = c_['date'] or c_['win'][-1]['Date']
        if any(c_['cutoff'] < e <= end for e in exd[c_['sym']]): affected.append(c_['sym'] + c_['cutoff'])
N('original non-skipped AAPL/MSFT classifications spanning an ex-date', affected, [])

# ---------------------------------------------------------------- Structural / typography
fig_all = [C['figure']] + C['figures']
for k, f in enumerate(fig_all):
    for p in f.get('panels', [f]):
        n_pts = len(p.get('candles') or (p.get('series') or [{'values': []}])[0]['values'] or p.get('rows') or [])
        for a in p.get('annotations', []): S(f'figure {k} annotation index in range', 0 <= a['index'] < n_pts)
        for s_ in p.get('series', []): S(f'figure {k} equal series lengths', len(s_['values']) == n_pts)
for k in (0, 1): S(f'fictional figure {k} caption says fictional', 'Fictional' in C['figures'][k]['caption'])
S('practice solutions present', all(t.get('solution') for t in C['practice']))
S('related ids', C['related'] == ['trade-plans', 'multi-timeframe', 'testing'])
S('sources resolved', all(s in CH['sources'] for s in C['sources']))
gaps = ['GAPS30', 'Entry50.60', 'Target54.60', 'Stop48.60', 'close30.60', 'fill31.00', 'target35.00', 'open31.00', 'passes;50', 'target:50', 'Stop-first:$', 'Target-first:$', 'Chapters21', 'AMB3R', 'GAPS−305', ',15-share']
present = [g_ for g_ in gaps if g_ in ALL_TEXT]
N('regression #7: listed missing-space strings remaining', present, [])
T('regression #9: source wording', P(7) + P(11), 'Reported closing prices', 'last updated 11/10/2017')
T('regression #8a/8b', P(8), 'P1’s long setup', 'roughly 20 times')
finding('CS28-RESID', 'section 8 now requires "a complete preceding 20-session OHLC window" for P1’s long setup; Ch.21 says P1 is "not a complete twenty-session channel dataset" (it needs a previously frozen boundary); practice 3 still cites "a channel variant"',
        '20-session OHLC window' in P(8) and 'P1’s long setup' in P(8) and 'channel variant' in ' '.join(C['practice'][2]['solution']),
        'Suggest: "require enough preceding OHLC to map and freeze a range boundary before January 13 (P1’s signal input), a defined event calendar, and an executable next-session opening offer"; drop "preceding window for a channel variant" from practice 3.')

# ---------------------------------------------------------------- Report
total = sum(counts.values())
print(f'Chapter 28 case-studies reproduction: {counts["numeric"]} numeric, {counts["text"]} text, {counts["structural"]} structural = {total} comparisons')
print(f'Mismatches: {len(mismatches)}')
for m in mismatches: print('  MISMATCH', m)
print(f'Review findings asserted against current text: {len(findings)}')
for fid, label, ok, detail in findings:
    print(f'  {"DEMONSTRATED" if ok else "NOT PRESENT"} {fid}: {label} -- {detail}')
sys.exit(1 if mismatches else 0)
