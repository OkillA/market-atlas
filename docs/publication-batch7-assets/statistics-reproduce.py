#!/usr/bin/env python3
"""Independent numerical reproduction of Chapter 25 `statistics` (publication batch 7).

Run from the repository root:
    python3 -I docs/publication-batch7-assets/statistics-reproduce.py

Reads only docs/publication-batch7-assets/compiled-statistics.json (the shipping chapter
extracted from content/book.js) and, for one cross-chapter count, compiled-testing.json.
Writes docs/publication-batch7-assets/statistics-arithmetic.json.

Method
- All ledger arithmetic uses fractions.Fraction (exact). Displayed values are parsed into
  Fractions from the text and compared after rounding the exact value.
- Rounding rule checked: round half away from zero (Decimal ROUND_HALF_UP) at the number
  of decimals displayed. Where a displayed value would differ under round-half-even, the
  script records it (e.g. running mean 0.3025 -> 0.303; underwater -0.525 -> -0.53).
- Square roots (standard deviation, standard error, bands, Wilson interval) are evaluated in
  decimal.Decimal at 60 significant digits; each rounded comparison also asserts that the
  exact value is farther than 1e-30 from the rounding boundary, so the rounding is unambiguous.
- Student t 0.975 quantiles (19 and 4 df) are computed by Simpson integration of the t density
  with bisection (2.093024 and 2.776445, matching standard tables), not copied from the text.
- "Hard" mismatches: a stated value disagrees with the exact value at its displayed precision.
- "Displayed-chain" mismatches: an expression written in the text with its own rounded inputs
  does not produce the stated output at the stated precision (reader-reproduction friction).
"""
import json
import re
from decimal import Decimal, getcontext, ROUND_HALF_UP, ROUND_HALF_EVEN
from fractions import Fraction as F
from pathlib import Path

getcontext().prec = 60
ROOT = Path('docs/publication-batch7-assets')
data = json.loads((ROOT / 'compiled-statistics.json').read_text(encoding='utf-8'))
ch = data['chapter']

counts = {'numeric': 0, 'text': 0, 'structural': 0}
hard = []          # stated value wrong
chain = []         # displayed expression does not reproduce with displayed inputs
notes = []         # informational computations supporting review findings
log = []


def field(path):
    """Resolve a path like sections[3].paragraphs[1] against the chapter."""
    obj = ch
    for part in re.findall(r'[^.\[\]]+|\[\d+\]', path):
        obj = obj[int(part[1:-1])] if part.startswith('[') else obj[part]
    return obj


def flat(obj):
    if isinstance(obj, str):
        return obj
    if isinstance(obj, (int, float)):
        return str(obj)
    if isinstance(obj, list):
        return ' '.join(flat(x) for x in obj)
    if isinstance(obj, dict):
        return ' '.join(flat(v) for v in obj.values())
    return ''


def D(x):
    if isinstance(x, F):
        return Decimal(x.numerator) / Decimal(x.denominator)
    return Decimal(x)


def rnd(x, places, mode=ROUND_HALF_UP):
    q = Decimal(1).scaleb(-places)
    return D(x).quantize(q, rounding=mode)


def parse(s):
    """Parse a displayed number (unicode minus, commas, %, R, $) to Fraction."""
    s = s.replace('−', '-').replace(',', '').replace('$', '').replace('%', '').replace('R', '').replace('+', '').strip()
    return F(s)


def places_of(s):
    s = s.replace('−', '-').replace(',', '').replace('$', '').replace('%', '').replace('R', '').replace('+', '').strip()
    return len(s.split('.')[1]) if '.' in s else 0


def text(path, sub):
    counts['text'] += 1
    ok = sub in flat(field(path))
    if not ok:
        hard.append(f'TEXT missing at {path}: {sub!r}')
    return ok


def num(path, shown, exact, sub=None, boundary_check=False):
    """Compare a displayed number with an exact (Fraction or Decimal) value at its precision."""
    counts['numeric'] += 1
    if sub is not None:
        text(path, sub)
    else:
        text(path, shown)
    p = places_of(shown)
    target = parse(shown)
    got = rnd(exact, p)
    if boundary_check:
        q = Decimal(1).scaleb(-p)
        frac = (abs(D(exact)) / q) % 1
        if abs(frac - Decimal('0.5')) < Decimal('1e-30'):
            hard.append(f'AMBIGUOUS rounding at {path}: {shown}')
    if D(target) != got:
        hard.append(f'NUM {path}: shown {shown}, exact {D(exact):.10f} -> {got}')
    log.append((path, shown, str(got)))
    return D(target) == got


def struct(cond, msg):
    counts['structural'] += 1
    if not cond:
        hard.append('STRUCT ' + msg)


def chain_check(path, expr, shown, value_from_displayed, places):
    """Record whether the reader can reproduce `shown` from the displayed inputs."""
    counts['numeric'] += 1
    text(path, expr)
    got = rnd(value_from_displayed, places)
    if got != D(parse(shown)):
        chain.append(f'{path}: "{expr}" with displayed inputs gives {D(value_from_displayed):.6f} -> {got}, text shows {shown}')


def sqrt(x):
    return D(x).sqrt()


# ---------------------------------------------------------------- ledger
S0 = 'sections[0]'
ledger = field(S0 + '.tables[0].rows')
struct(len(ledger) == 20, 'ledger has 20 rows')
net, gross, kinds = [], [], []
for i, row in enumerate(ledger):
    t, kind, g_s, c_s, n_s, pl_s = row
    struct(t == i + 1, f'trade numbering row {i}')
    g, c, n, pl = parse(g_s), parse(c_s), parse(n_s), parse(pl_s)
    counts['numeric'] += 3
    if g - c != n:
        hard.append(f'ledger row {t}: gross−cost {g - c} != net {n}')
    if c != F(5, 100):
        hard.append(f'ledger row {t}: cost {c} != 0.05')
    if 100 * n != pl:
        hard.append(f'ledger row {t}: 100×net {100 * n} != P&L {pl}')
    struct((kind.startswith('Target') and g == 2) or (kind == 'Stop' and g == -1) or
           (kind.startswith('Gap') and g < -1) or kind.startswith('Time exit'), f'exit type/gross row {t}')
    net.append(n); gross.append(g); kinds.append(kind)

N = len(net)
wins = [x for x in net if x > 0]
losses = [x for x in net if x < 0]
gw = [x for x in gross if x > 0]
gl = [x for x in gross if x < 0]
mean = sum(net) / N
avg_win, avg_loss = sum(wins) / len(wins), -sum(losses) / len(losses)

# section 0 prose
text(S0 + '.paragraphs[0]', 'twenty completed trades')
num(S0 + '.paragraphs[0]', '$100', F(100), sub='equals $100')
num(S0 + '.paragraphs[0]', '0.05R', F(5, 100), sub='$5 per round trip, or 0.05R')
struct(sum(1 for k in kinds if k.startswith('Target')) == 5, 'five targets')
struct(sum(1 for k in kinds if k == 'Stop') == 5, 'five stops')
text(S0 + '.paragraphs[1]', 'Five trades reached the +2R target and five hit the −1R stop')
gap_rows = [r for r in ledger if r[1].startswith('Gap')]
struct(len(gap_rows) == 1, 'one gap trade')
num(S0 + '.paragraphs[1]', '2.30R', -parse(gap_rows[0][2]), sub='lost 2.30R before costs')
scr = [r for r in ledger if 'scratch' in r[1]]
struct(len(scr) == 1 and parse(scr[0][2]) == 0 and parse(scr[0][4]) == F(-5, 100), 'scratch 0.00 gross / −0.05 net')
text(S0 + '.paragraphs[1]', 'small net loss of −0.05R')

# frequency table (bins include lower edge)
edges = [F(-5, 2) + F(k, 2) for k in range(9)]
bins = [sum(1 for x in net if e <= x < e + F(1, 2)) for e in edges]
freq = field(S0 + '.tables[1].rows')
for k, (lab, cnt) in enumerate(freq):
    counts['numeric'] += 1
    lo_s, hi_s = lab.split(' to ')
    struct(parse(lo_s) == edges[k] and parse(hi_s) == edges[k] + F(1, 2), f'bin label {lab}')
    if cnt != bins[k]:
        hard.append(f'frequency bin {lab}: shown {cnt}, computed {bins[k]}')
struct(sum(bins) == 20, 'bins cover all 20 trades')

g_aw_pre = sum(x for x in gross if x > 0) / sum(1 for x in gross if x > 0)
g_al_pre = -sum(x for x in gross if x < 0) / sum(1 for x in gross if x < 0)


def t_quantile_975(df):
    """Student t 0.975 quantile by Simpson integration of the density (Decimal, 4000 panels)
    and bisection to 1e-12; accuracy far exceeds the two displayed decimals."""
    import math
    c = Decimal(math.gamma((df + 1) / 2) / (math.sqrt(df * math.pi) * math.gamma(df / 2)))
    def dens(x):
        return c * (1 + x * x / df) ** (Decimal(-(df + 1)) / 2)
    def cdf_minus_half(t, n=4000):
        h = t / n
        acc = dens(Decimal(0)) + dens(t)
        for i in range(1, n):
            acc += (4 if i % 2 else 2) * dens(h * i)
        return acc * h / 3
    lo, hi = Decimal(1), Decimal(4)
    while hi - lo > Decimal('1e-12'):
        mid = (lo + hi) / 2
        if cdf_minus_half(mid) < Decimal('0.475'):
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


getcontext().prec = 30
T975 = {19: t_quantile_975(19), 4: t_quantile_975(4)}
getcontext().prec = 60
notes.append({'id': 't-quantiles', 't975_19': str(rnd(T975[19], 6)), 't975_4': str(rnd(T975[4], 6))})

# ---------------------------------------------------------------- expectancy
S1 = 'sections[1]'
p = S1 + '.paragraphs[0]'
num(p, '12', F(len(wins)), sub='12 of 20')
num(p, '60%', F(100 * len(wins), N), sub='12 of 20, or 60%')
num(p, '+14.15R', sum(wins))
num(p, '+1.18R', avg_win, sub='14.15 ÷ 12 ≈ +1.18R')
num(p, '−8.10R', sum(losses))
num(p, '1.01R', avg_loss, sub='8.10 ÷ 8 ≈ 1.01R')
num(p, '+0.30R', F(6, 10) * F(1179, 1000) - F(4, 10) * F(10125, 10000), sub='0.60 × 1.179 − 0.40 × 1.0125 ≈ +0.30R')
num(p, '1.179', avg_win, sub='0.60 × 1.179')
num(p, '6.05', sum(net), sub='= 6.05 ÷ 20')
num(p, '+0.3025R', mean, sub='6.05 ÷ 20 = +0.3025R')
p = S1 + '.paragraphs[1]'
num(p, '+7.05R', sum(gross))
num(p, '+0.3525R', sum(gross) / N)
num(p, '1.00R', 20 * F(5, 100), sub='remove 1.00R')
num(p, '+6.05R', sum(net), sub='leaving +6.05R')
num(p, '$705', 100 * sum(gross), sub='$705 gross')
num(p, '$100', 100 * 20 * F(5, 100), sub='$100 of costs')
num(p, '$605', 100 * sum(net), sub='$605 net')
struct(sum(1 for x in gross if x == 0) == 1 and sum(1 for x in net if x == 0) == 0, 'one gross scratch becomes a net loss')
p = S1 + '.paragraphs[2]'
num(p, '+0.20R', F(4, 10) * 2 - F(6, 10) * 1, sub='0.40 × 2 − 0.60 × 1 = +0.20R')
num(p, '+0.12R', F(2, 10) - F(8, 100), sub='leaves +0.12R')
num(p, '0.20', F(8, 10) * F(1, 4), sub='0.20 − 0.30')
num(p, '0.30', F(2, 10) * F(3, 2), sub='0.20 − 0.30')
num(p, '−0.10R', F(8, 10) * F(1, 4) - F(2, 10) * F(3, 2), sub='= −0.10R')
be = avg_loss / (avg_win + avg_loss)
num(p, '46.2%', 100 * be, sub='≈ 46.2%')
num(p, '46.2%', 100 * F(10125, 10000) / (F(1179, 1000) + F(10125, 10000)), sub='1.0125 ÷ (1.179 + 1.0125) ≈ 46.2%')
text(p, 'tell 60% from 46%')
p = S1 + '.paragraphs[0]'
struct(sum(1 for x in gross if x < 0) == 7 and sum(1 for x in gross if x == 0) == 1, 'gross column 12 wins, 7 losses, 1 scratch')
text(p, 'there are 12 wins, 7 losses and 1 scratch')
num(p, '35%', F(700, 20), sub='7 ÷ 20 = 35%')
num(p, '0.7375', F(6, 10) * g_aw_pre, sub='0.60 × (14.75 ÷ 12) − 0.35 × 1.10 = 0.7375 − 0.3850')
num(p, '0.3850', F(35, 100) * g_al_pre, sub='0.7375 − 0.3850 = +0.3525R')
num(p, '+0.3525R', F(6, 10) * g_aw_pre - F(35, 100) * g_al_pre, sub='0.3850 = +0.3525R')
struct(F(6, 10) * g_aw_pre - F(35, 100) * g_al_pre == sum(gross) / 20, 'gross formula with 35% loss rate equals direct gross mean')
text(S1 + '.paragraphs[1]', 'easily fed planned values, such as −1R for every loss')
# before/after cost table
t = {r[0]: r[1:] for r in field(S1 + '.tables[0].rows')}
for col, arr in ((0, gross), (1, net)):
    w = [x for x in arr if x > 0]; l = [x for x in arr if x < 0]; z = [x for x in arr if x == 0]
    counts['numeric'] += 3
    if int(t['Wins (result > 0)'][col]) != len(w): hard.append('table wins')
    if int(t['Losses (result < 0)'][col]) != len(l): hard.append('table losses')
    if int(t['Scratches (result = 0)'][col]) != len(z): hard.append('table scratches')
    num(f'{S1}.tables[0]', t['Total R'][col], sum(arr))
    num(f'{S1}.tables[0]', t['Expectancy (total ÷ 20)'][col], sum(arr) / N)
    aw = t['Average win'][col]; al = t['Average loss (magnitude)'][col]
    num(f'{S1}.tables[0]', aw.split(' ')[0], sum(w) / len(w), sub=aw)
    num(f'{S1}.tables[0]', re.search(r'\((\S+) ÷', aw).group(1), sum(w), sub=aw)
    num(f'{S1}.tables[0]', al.split(' ')[0], -sum(l) / len(l), sub=al)
    num(f'{S1}.tables[0]', re.search(r'\((\S+) ÷', al).group(1), -sum(l), sub=al)
    num(f'{S1}.tables[0]', t['Total in dollars'][col], 100 * sum(arr))
    num(f'{S1}.tables[0]', t['Win rate'][col].split('%')[0] + '%', F(100 * len(w), N), sub=t['Win rate'][col])
# Teaching check: gross formula with loss rate 1 − win rate (the scratch trap) vs 7/20
g_aw, g_al = sum(gw) / len(gw), -sum(gl) / len(gl)
notes.append({'id': 'gross-formula-scratch', 'correct_loss_rate_7_of_20': str(D(F(12, 20) * g_aw - F(7, 20) * g_al)),
              'wrong_loss_rate_0.40': str(D(F(12, 20) * g_aw - F(8, 20) * g_al))})

# ---------------------------------------------------------------- equity and drawdown
def path(seq, per_r=100, start=20000):
    out = [F(start)]
    for x in seq:
        out.append(out[-1] + per_r * x)
    return out


def drawdowns(eq):
    peak, dd, peaks = eq[0], [], []
    for v in eq:
        peak = max(peak, v)
        dd.append(v / peak - 1); peaks.append(peak)
    return dd, peaks


def max_dd(eq):
    best = (F(0), None, None, None)
    peak, pi = eq[0], 0
    for i, v in enumerate(eq):
        if v > peak:
            peak, pi = v, i
        if peak - v > best[0]:
            best = (peak - v, pi, i, peak)
    return best  # dollars, peak index, trough index, peak value


rec = path(net)
lf_seq = losses + wins  # both in ledger order
lf = path(lf_seq)
S2 = 'sections[2]'
p = S2 + '.paragraphs[0]'
num(p, '$20,195', rec[1], sub='$20,195 after trade 1')
num(p, '$20,090', rec[2], sub='$20,090 after trade 2')
num(p, '$20,605', rec[20], sub='$20,605 after trade 20')
num(p, '3.025%', 100 * (rec[20] - 20000) / 20000, sub='$605 ÷ $20,000 = 3.025%')
num(p, '3.03%', 100 * (rec[20] - 20000) / 20000, sub='about 3.03%')
text(p, 'Account return (ending equity ÷ starting equity − 1)')
struct(F(20605, 20000) - 1 == F(605, 20000), 'account return definition equals $605 ÷ $20,000')
struct(rec[20] == lf[20], 'ending equity order-invariant under fixed $ per R')
dd_r, pk_r = drawdowns(rec)
m = max_dd(rec)
p = S2 + '.paragraphs[1]'
struct(m[1] == 6 and m[2] == 8, 'recorded MDD peak trade 6, trough trade 8')
num(p, '$20,265', m[3], sub='peaks at $20,265 after trade 6')
num(p, '$19,925', rec[8], sub='to $19,925 after trade 8')
first_above = next(i for i in range(7, 21) if rec[i] > m[3])
struct(first_above == 17, 'first exceed 20,265 at trade 17')
text(p, 'until trade 17')
num(p, '$340', m[0], sub='maximum drawdown is $340')
num(p, '1.68%', 100 * m[0] / m[3], sub='340 ÷ 20,265 ≈ 1.68%')
num(p, '1.71%', 100 * m[0] / rec[8], sub='340 ÷ 19,925 ≈ 1.71%')
under = [i for i in range(7, 21) if rec[i] < m[3]]
struct(under == list(range(7, 17)) and len(under) == 10, 'ten successive below-peak closes trades 7–16')
struct(17 - 6 == 11, 'eleven intervals')
text(p, 'ten successive closes (trades 7–16)')
text(p, 'eleven trade intervals')
# percent MDD equals percent of the dollar MDD here
struct(min(dd_r) == -m[0] / m[3], 'percent and dollar maximum drawdown coincide (recorded)')
m2 = max_dd(lf)
p = S2 + '.paragraphs[2]'
num(p, '+0.3025R', sum(lf_seq) / N)
struct(sum(1 for x in lf_seq if x > 0) == 12, 'reordered win rate 60%')
num(p, '$20,605', lf[20], sub='ending equity still $20,605')
num(p, '$19,190', lf[8], sub='to $19,190 before the first win')
struct(m2[1] == 0 and m2[2] == 8, 'losses-first MDD from start to trade 8')
num(p, '$810', m2[0], sub='an $810 drawdown')
num(p, '4.05%', 100 * m2[0] / m2[3], sub='drawdown of 4.05%')
num(p, '4.22%', 100 * m2[0] / lf[8], sub='4.22% gain')
struct(next(i for i in range(9, 21) if lf[i] >= 20000) == 16, 'losses-first regained at trade 16')
text(p, 'regained at trade 16')
text(p, 'double every dollar gain, loss and drawdown, though not the account balances')
# "Doubling the dollars per R would double every dollar figure here."
r2, lf2 = path(net, 200), path(lf_seq, 200)
m_r2, m_lf2 = max_dd(r2), max_dd(lf2)
notes.append({'id': 'doubling-claim', 'ending_equity_at_200_per_R': str(r2[20]),
              'recorded_mdd_dollars': str(m_r2[0]), 'recorded_mdd_pct': str(rnd(100 * m_r2[0] / m_r2[3], 3)),
              'losses_first_mdd_dollars': str(m_lf2[0]), 'losses_first_mdd_pct': str(rnd(100 * m_lf2[0] / m_lf2[3], 3)),
              'comment': 'dollar P&L and drawdowns double; equity levels (20,605 -> 21,210) do not; recorded % drawdown 1.68 -> 3.31 (< 2x)'})
num(S2 + '.paragraphs[2]', '3.31%', 100 * m_r2[0] / m_r2[3], sub='roughly double, to 3.31% and 8.10%')
num(S2 + '.paragraphs[2]', '8.10%', 100 * m_lf2[0] / m_lf2[3], sub='roughly double, to 3.31% and 8.10%')
struct(100 * m_lf2[0] / m_lf2[3] == 2 * 100 * m2[0] / m2[3] and 100 * m_r2[0] / m_r2[3] < 2 * 100 * m[0] / m[3], 'doubling: losses-first exactly 2x, recorded slightly under 2x')
counts['structural'] += 1
if r2[20] == 2 * rec[20]:
    hard.append('unexpected: equity doubles')
# Worst ordering bound: dollar drawdown cannot exceed the sum of all losses
notes.append({'id': 'worst-ordering', 'sum_losses_dollars': str(-100 * sum(losses)),
              'losses_first_is_worst_possible': str(m2[0] == -100 * sum(losses))})
# two-order table
tb = {r[0]: r[1:] for r in field(S2 + '.tables[0].rows')}
for col, (eq, mm) in enumerate(((rec, m), (lf, m2))):
    num(f'{S2}.tables[0]', tb['Ending equity ($)'][col], eq[20])
    num(f'{S2}.tables[0]', tb['Account return'][col], 100 * (eq[20] - 20000) / 20000)
    num(f'{S2}.tables[0]', tb['Expectancy (net R per trade)'][col], mean)
    num(f'{S2}.tables[0]', tb['Running peak before the deepest decline ($)'][col].split(' ')[0], mm[3], sub=tb['Running peak before the deepest decline ($)'][col])
    num(f'{S2}.tables[0]', tb['Trough ($)'][col].split(' ')[0], eq[mm[2]], sub=tb['Trough ($)'][col])
    struct(f'after trade {mm[2]}' in tb['Trough ($)'][col], f'trough trade label col {col}')
    mdd_s = tb['Maximum drawdown'][col]
    num(f'{S2}.tables[0]', mdd_s.split(' ')[0], mm[0], sub=mdd_s)
    num(f'{S2}.tables[0]', mdd_s.split('= ')[1].split(' ')[0], 100 * mm[0] / mm[3], sub=mdd_s)
    num(f'{S2}.tables[0]', tb['Gain needed from trough'][col], 100 * mm[0] / eq[mm[2]])
    back = next(i for i in range(mm[2], 21) if eq[i] >= mm[3])
    fb = tb['First trade back at or above that peak'][col]
    struct(fb.startswith(f'Trade {back} '), f'first trade back col {col}')
    num(f'{S2}.tables[0]', re.search(r'\((\$[\d,]+)\)', fb).group(1), eq[back], sub=fb)
struct('20,265 (after trade 6)' in tb['Running peak before the deepest decline ($)'][0] and '20,000 (start)' in tb['Running peak before the deepest decline ($)'][1], 'peak labels')

# ---------------------------------------------------------------- uncertainty
S3 = 'sections[3]'
drop_win = (sum(net) - F(195, 100)) / 19
drop_gap = (sum(net) + F(235, 100)) / 19
p = S3 + '.paragraphs[0]'
num(p, '+0.22R', drop_win, sub='falls to +0.22R')
num(p, '+0.44R', drop_gap, sub='rises to +0.44R')
lo_frac, hi_frac = (mean - drop_win) / mean, (drop_gap - mean) / mean
struct(F(1, 4) <= lo_frac <= F(1, 2) and F(1, 4) <= hi_frac <= F(1, 2), 'one trade moves estimate a quarter to a half')
notes.append({'id': 'leave-one-out-share', 'drop_win_share': str(rnd(lo_frac, 4)), 'drop_gap_share': str(rnd(hi_frac, 4))})


def sd(xs):
    mu = sum(xs) / len(xs)
    return sqrt(sum((x - mu) ** 2 for x in xs) / (len(xs) - 1))


running = [sum(net[:k]) / k for k in range(1, 21)]
p = S3 + '.paragraphs[1]'
num(p, '+1.95R', running[0], sub='+1.95R after one trade')
first_neg = next(k for k in range(20) if running[k] < 0) + 1
struct(first_neg == 8, 'running mean first negative after trade 8')
num(p, '−0.09R', running[7], sub='after trade 8 (−0.09R)')
num(p, '+0.30R', running[19], sub='finishes at +0.30R')
s20 = sd(net)
se20 = s20 / D(20).sqrt()
num(p, '1.31R', s20, sub='standard deviation is about 1.31R', boundary_check=True)
num(p, '0.29R', se20, sub='The standard error is then about 0.29R', boundary_check=True)
ssd = sum((x - mean) ** 2 for x in net)
num(p, '0.3025R', mean, sub='subtract the mean (0.3025R)')
num(p, '32.512', ssd, sub='square and add the differences (32.512)')
num(p, '1.7112', ssd / 19, sub='divide by n − 1 = 19 (1.7112)')
num(p, '1.308R', s20, sub='take the square root: 1.308R', boundary_check=True)
chain_check(p, 'take the square root: 1.308R', '1.308', D('1.7112').sqrt(), 3)
num(p, '1.275R', sqrt(ssd / 20), sub='would give 1.275R', boundary_check=True)
text(p, 'as Chapter 12’s population bands do')
num(p, '−0.28R', D(mean) - 2 * se20, sub='from roughly −0.28R')
num(p, '+0.89R', D(mean) + 2 * se20, sub='to +0.89R')
text(p, 'from trade 5 onward')
struct(1 / D(4).sqrt() == Decimal('0.5'), 'halving the band needs 4x trades (1/sqrt(4) = 1/2)')
text(p, 'about four times as many trades')
p = S3 + '.paragraphs[2]'
struct(D(mean) - 2 * se20 < 0 < D(mean) + 2 * se20, 'zero inside final band')
num(p, '2.09', T975[19], sub='multiplier of about 2.09 rather than 2')
num(p, '−0.31R', D(mean) - T975[19] * se20, sub='(about −0.31R to +0.91R)')
num(p, '+0.91R', D(mean) + T975[19] * se20, sub='(about −0.31R to +0.91R)')
num(p, '2.78', T975[4], sub='about 2.78 at five trades')


def wilson(k, n, z):
    ph = F(k, n)
    z = D(z)
    nD = D(n)
    c = D(ph) + z * z / (2 * nD)
    h = z * (D(ph * (1 - ph)) / nD + z * z / (4 * nD * nD)).sqrt()
    d = 1 + z * z / nD
    return (c - h) / d, (c + h) / d


wl, wu = wilson(12, 20, '1.96')
wl2, wu2 = wilson(12, 20, '1.95996398454')
num(p, '38.7%', 100 * wl, sub='about 38.7% to 78.1%')
num(p, '78.1%', 100 * wu, sub='about 38.7% to 78.1%')
struct(wl < be < wu, 'Wilson interval contains break-even')
text(p, 'contains the 46.2% break-even')
tu = {r[0]: r[1:] for r in field(S3 + '.tables[0].rows')}
T = f'{S3}.tables[0]'
num(T, tu['Mean net R, all 20 trades'][0], mean)
num(T, tu['Mean without one +1.95R target trade (19 trades)'][0], drop_win)
num(T, '0.09R', mean - drop_win, sub='about 0.09R')
num(T, tu['Mean without the −2.35R gap loss (19 trades)'][0], drop_gap)
num(T, '0.14R', drop_gap - mean, sub='about 0.14R')
num(T, tu['Sample standard deviation of net R'][0], s20, boundary_check=True)
num(T, tu['Standard error (1.3081 ÷ √20)'][0], se20, boundary_check=True)
num(T, '1.3081', s20, sub='Standard error (1.3081 ÷ √20)', boundary_check=True)
chain_check(T, 'Standard error (1.3081 ÷ √20)', tu['Standard error (1.3081 ÷ √20)'][0], D('1.3081') / D(20).sqrt(), 4)
band_s = tu['Mean ± 2 standard errors'][0]
num(T, band_s.split(' to ')[0], D(mean) - 2 * se20, sub=band_s)
num(T, band_s.split(' to ')[1], D(mean) + 2 * se20, sub=band_s)
wil_s = tu['Win rate and 95% Wilson interval'][0]
num(T, '38.66%', 100 * wl, sub=wil_s, boundary_check=True)
num(T, '78.12%', 100 * wu, sub=wil_s, boundary_check=True)
num(T, '38.66%', 100 * wl2, sub=wil_s)
num(T, '78.12%', 100 * wu2, sub=wil_s)
num(T, '2.1917', avg_win + avg_loss, sub='1.0125 ÷ 2.1917')
num(T, tu['Break-even win rate (1.0125 ÷ 2.1917)'][0], 100 * be)
num(T, '46.2%', 100 * F(10125, 10000) / F(21917, 10000), sub='46.2%')
# Supporting figures for review suggestions (not text assertions)
pop_sd = (sum((x - mean) ** 2 for x in net) / 20)
t19 = T975[19]  # computed above by numerical integration
notes.append({'id': 'sd-reproduction', 'sum_sq_dev': str(sum((x - mean) ** 2 for x in net)),
              'sample_var_n_minus_1': str(rnd(sum((x - mean) ** 2 for x in net) / 19, 6)),
              'sample_sd': str(rnd(s20, 5)), 'sample_se': str(rnd(se20, 5)),
              'population_sd_n': str(rnd(sqrt(pop_sd), 5)), 'population_se': str(rnd(sqrt(pop_sd) / D(20).sqrt(), 5)),
              't_statistic_mean_over_se': str(rnd(D(mean) / se20, 4)),
              't19_95pct_interval': [str(rnd(D(mean) - t19 * se20, 4)), str(rnd(D(mean) + t19 * se20, 4))]})

# ---------------------------------------------------------------- optional Wilson section
S4 = 'sections[4].paragraphs[0]'
z = Decimal('1.96')
num(S4, '0.60', F(12, 20), sub='p̂ = 12/20 = 0.60')
num(S4, '0.09604', z * z / 40, sub='0.60 + 0.09604 = 0.69604')
num(S4, '0.69604', D(F(6, 10)) + z * z / 40, sub='0.60 + 0.09604 = 0.69604')
num(S4, '0.0120', F(6, 10) * F(4, 10) / 20, sub='√(0.0120 + 0.002401)')
num(S4, '0.002401', z * z / 1600, sub='√(0.0120 + 0.002401)')
num(S4, '0.23521', z * (D('0.012') + z * z / 1600).sqrt(), sub='≈ 0.23521')
num(S4, '1.19208', 1 + z * z / 20, sub='divisor is 1.19208')
num(S4, '38.66%', 100 * wl, sub='approximately 38.66% to 78.12%', boundary_check=True)
num(S4, '78.12%', 100 * wu, sub='approximately 38.66% to 78.12%', boundary_check=True)
chain_check(S4, 'The interval is approximately 38.66%', '38.66', 100 * (D('0.69604') - D('0.23521')) / D('1.19208'), 2)
chain_check(S4, 'to 78.12%', '78.12', 100 * (D('0.69604') + D('0.23521')) / D('1.19208'), 2)
# five-decimal intermediates (proposed fix) reproduce the stated values
notes.append({'id': 'wilson-5dp-chain', 'lower': str(rnd(100 * (D('0.69604') - D('0.23521')) / D('1.19208'), 2)),
              'upper': str(rnd(100 * (D('0.69604') + D('0.23521')) / D('1.19208'), 2))})
struct(0 <= wl and wu <= 1, 'Wilson limits inside [0,1]')

# ---------------------------------------------------------------- CAGR / Sharpe
S6 = 'sections[6]'
num(S6 + '.paragraphs[0]', '1.03025', F(20605, 20000), sub='1.03025² − 1')
num(S6 + '.paragraphs[0]', '6.14%', 100 * (F(20605, 20000) ** 2 - 1), sub='≈ 6.14%')
num(S6 + '.paragraphs[0]', '0.5', F(6, 12), sub='(1 ÷ 0.5)')
num(S6 + '.paragraphs[1]', '0.23', D(mean) / s20, sub='0.3025 ÷ 1.308 ≈ 0.23')
num(S6 + '.paragraphs[1]', '0.23', F(3025, 10000) / F(1308, 1000), sub='0.3025 ÷ 1.308 ≈ 0.23')

# ---------------------------------------------------------------- p-values
S7 = 'sections[7].paragraphs[1]'
num(S7, '26%', 100 * (1 - F(95, 100) ** 6), sub='1 − 0.95⁶ ≈ 26%')
testing_path = ROOT / 'compiled-testing.json'
if testing_path.exists():
    tc = json.loads(testing_path.read_text(encoding='utf-8'))['chapter']
    vlog = [tb for s in tc['sections'] for tb in s.get('tables', []) if 'variant log' in tb['title'].lower()]
    struct(len(vlog) == 1 and len(vlog[0]['rows']) == 6, 'Chapter 24 variant log has six variants')
text(S7, 'had six variants')
text(S7, 'the Research and evidence appendix at the end of the book')
text('sections[7].paragraphs[0]', 'not the probability that the null hypothesis is true')
text('sections[8].paragraphs[0]', 'Neither a statistically significant difference nor a gross mean alone')
text('practice[2].solution[1]', 'the record does not show whether trades were clustered')
text('exercise', 'find account return')
text(S7, '7,846 technical rules')
bs_ev = [e for e in ch['evidence'] if 'rc-bs' in e['sourceIds']][0]
struct('7,846' in bs_ev['study']['rule'], 'BS rule count matches evidence record')
struct('30–35, 0–5, 0–5' in bs_ev['study']['costs'], 'BS Table 5 ranges in record')

# ---------------------------------------------------------------- example
EX = 'example.text'
num(EX, '−0.25R', F(1, 4) * 2 - F(3, 4) * 1, sub='0.25 × 2 − 0.75 × 1 = −0.25R')
num(EX, '33.3%', F(100, 3), sub='1 ÷ (2 + 1) ≈ 33.3%')
num(EX, '2', F(2, 1), sub='nominal payoff ratio of 2')

# ---------------------------------------------------------------- exercise solution
SA = 'solution[0]'
win_trades = [i + 1 for i, x in enumerate(net) if x > 0]
struct(win_trades == [1, 3, 5, 6, 9, 10, 12, 14, 15, 17, 19, 20], 'listed winning trades')
text(SA, 'trades 1, 3, 5, 6, 9, 10, 12, 14, 15, 17, 19 and 20')
num(SA, '14.15R', 5 * F(195, 100) + sum(F(x, 100) for x in (55, 30, 85, 20, 135, 10, 105)),
    sub='5 × 1.95 + 0.55 + 0.30 + 0.85 + 0.20 + 1.35 + 0.10 + 1.05 = 14.15R')
struct(sorted([x for x in wins if x != F(195, 100)]) == sorted(F(x, 100) for x in (55, 30, 85, 20, 135, 10, 105)), 'solution win terms equal ledger wins')
num(SA, '−8.10R', 5 * F(-105, 100) - F(235, 100) - F(5, 100) - F(45, 100), sub='= −8.10R')
num(SA, '1.179R', avg_win, sub='≈ 1.179R')
num(SA, '1.0125R', avg_loss, sub='average loss of 1.0125R')
chain_check(SA, '0.60 × (14.15 ÷ 12) − 0.40 × 1.0125 = 0.7075', '0.7075', D('0.60') * D('14.15') / 12, 4)
num(SA, '0.7075', F(6, 10) * avg_win, sub='= 0.7075 − 0.4050')
num(SA, '0.4050', F(4, 10) * avg_loss, sub='0.7075 − 0.4050')
num(SA, '+0.3025R', F(6, 10) * avg_win - F(4, 10) * avg_loss, sub='0.4050 = +0.3025R')
num(SA, '7.05', sum(net) + 20 * F(5, 100), sub='(6.05 + 20 × 0.05) ÷ 20 = 7.05 ÷ 20 = +0.3525R')
num(SA, '+0.3525R', (sum(net) + 1) / 20, sub='= +0.3525R')
SB = 'solution[1]'
shown_path = re.search(r'add: (.*?)\. Account return', field(SB)).group(1).split(' → ')
counts['numeric'] += len(shown_path)
if [parse(x) for x in shown_path] != rec:
    hard.append('solution (b) equity path differs')
num(SB, '3.025%', 100 * F(605, 20000), sub='605 ÷ 20,000 = 3.025%')
num(SB, '$340', m[0], sub='drawdown = $340')
num(SB, '1.68%', 100 * m[0] / m[3], sub='340 ÷ 20,265 ≈ 1.68%')
num(SB, '1.71%', 100 * m[0] / rec[8], sub='340 ÷ 19,925 ≈ 1.71%')
struct(min(rec[7:]) == rec[8], 'lowest later value after trade 6 is trade 8')
num(SB, '$20,410', rec[17], sub='trade 17 ($20,410)')
num(SB, '0.77%', 100 * (rec[1] - rec[4]) / rec[1], sub='$20,040 from a $20,195 peak, 0.77%')
struct(pk_r[4] == rec[1] == 20195 and rec[4] == 20040, 'dip after trade 4 uses peak 20,195')
SC = 'solution[2]'
num(SC, '8.40', sum(net) + F(235, 100), sub='(6.05 + 2.35) ÷ 19 = 8.40 ÷ 19')
num(SC, '+0.442R', drop_gap, sub='≈ +0.442R')

# ---------------------------------------------------------------- practice
P0 = 'practice[0]'
shown_losses = [parse(x) for x in re.search(r'\((−1\.05.*?)\)', field(P0 + '.question')).group(1).split(', ')]
counts['numeric'] += 8
if shown_losses != losses:
    hard.append('practice 1 loss list differs from ledger order')
num(P0 + '.solution[0]', '−8.10R', sum(losses), sub='total −8.10R')
num(P0 + '.solution[0]', '−$810', 100 * sum(losses), sub='or −$810')
num(P0 + '.solution[0]', '$19,190', lf[8], sub='= $19,190 after trade 8')
num(P0 + '.solution[0]', '4.05%', 100 * F(810, 20000), sub='$810 ÷ $20,000 = 4.05%')
num(P0 + '.solution[1]', '4.22%', 100 * F(810, 19190), sub='$810 ÷ $19,190 ≈ 4.22%')
w_dollars = [100 * x for x in wins[:8]]
shown_w = [parse(x) for x in re.search(r'add (.*?), giving', field(P0 + '.solution[1]')).group(1).replace('and ', '').split(', ')]
counts['numeric'] += 8
if shown_w != w_dollars:
    hard.append(f'practice 1 win dollars {shown_w} vs {w_dollars}')
cum = [sum(w_dollars[:k + 1]) for k in range(8)]
shown_cum = [parse(x) for x in re.search(r'running gains of (.*?)\. The', field(P0 + '.solution[1]')).group(1).replace('and ', '').split(', ')]
counts['numeric'] += 8
if shown_cum != cum:
    hard.append(f'practice 1 cumulative {shown_cum} vs {cum}')
struct(cum[6] < 810 <= cum[7], 'eighth win first recovers $810')
num(P0 + '.solution[1]', '$20,100', lf[16], sub='$19,190 + $910 = $20,100')
struct(8 + 8 == 16, 'eighth win is trade 16')
num(P0 + '.solution[2]', '$20,605', lf[20], sub='still $20,605')
num(P0 + '.solution[2]', '+0.3025R', sum(lf_seq) / 20, sub='still +0.3025R')
P1 = 'practice[1].solution'
num(P1 + '[0]', '+0.40R', F(35, 100) * 3 - F(65, 100), sub='1.05 − 0.65 = +0.40R')
num(P1 + '[0]', '1.05', F(35, 100) * 3, sub='= 1.05 − 0.65')
num(P1 + '[0]', '+0.28R', F(40, 100) - F(12, 100), sub='0.40 − 0.12 = +0.28R')
num(P1 + '[0]', '+2.88R', 3 - F(12, 100), sub='winners net +2.88R')
num(P1 + '[0]', '−1.12R', -1 - F(12, 100), sub='losers −1.12R')
num(P1 + '[0]', '1.008', F(35, 100) * F(288, 100), sub='= 1.008 − 0.728')
num(P1 + '[0]', '0.728', F(65, 100) * F(112, 100), sub='1.008 − 0.728')
num(P1 + '[0]', '+0.28R', F(35, 100) * F(288, 100) - F(65, 100) * F(112, 100), sub='0.728 = +0.28R')
num(P1 + '[1]', '25%', 100 * F(1, 4), sub='p = 1 ÷ 4 = 25%')
num(P1 + '[1]', '28%', 100 * F(112, 100) / (F(288, 100) + F(112, 100)), sub='p = 1.12 ÷ 4.00 = 28%')
num(P1 + '[1]', '4.00', F(288, 100) + F(112, 100), sub='1.12 ÷ 4.00')
struct(100 * (F(112, 400) - F(1, 4)) == 3, 'three percentage points')
P2 = 'practice[2].solution'
num(P2 + '[0]', '60%', F(60), sub='60% net wins')
num(P2 + '[0]', '+0.3025R', mean, sub='+0.3025R expectancy')
num(P2 + '[0]', '+0.22R', drop_win, sub='gives +0.22R')
num(P2 + '[0]', '+0.44R', drop_gap, sub='gives +0.44R')
num(P2 + '[0]', '−0.28R', D(mean) - 2 * se20, sub='about −0.28R to +0.89R')
num(P2 + '[0]', '+0.89R', D(mean) + 2 * se20, sub='about −0.28R to +0.89R')
num(P2 + '[1]', '38.7%', 100 * wl, sub='about 38.7% to 78.1%')
num(P2 + '[1]', '78.1%', 100 * wu, sub='about 38.7% to 78.1%')
num(P2 + '[1]', '46.2%', 100 * be, sub='46.2% break-even')
text('practice[0].question', 'first returns to $20,000')

# ---------------------------------------------------------------- quiz
Q = ch['quiz']
struct(len(Q['options']) == 3 and len(Q['feedback']) == 3 and Q['answer'] == 2, 'quiz shape / answer index 2')
num('quiz.question', '+1.18R', avg_win, sub='averaging +1.18R')
num('quiz.question', '−1.01R', -avg_loss, sub='averaging −1.01R')
num('quiz.question', '+0.17R', F(118, 100) - F(101, 100), sub='1.18 − 1.01 = +0.17R')
num('quiz.options[0]', '+0.01R', (F(118, 100) - F(101, 100)) / 20, sub='≈ +0.01R')
num('quiz.options[2]', '+0.30R', F(6, 10) * F(118, 100) - F(4, 10) * F(101, 100), sub='≈ +0.30R')
num('quiz.explanation', '+0.3025R', F(605, 100) / 20, sub='6.05R ÷ 20 = +0.3025R')
num('quiz.feedback[1]', '0.05R', F(5, 100), sub='0.05R per trade')
struct(F(6, 10) * avg_win - F(4, 10) * avg_loss == mean, 'weighted formula equals direct mean (exact)')
text('quiz.feedback[0]', '60%/40%')

# ---------------------------------------------------------------- figures
fig = ch['figure']
struct(fig['series'][0]['values'] == bins, 'main figure bins equal computed/table counts')
struct([parse(x) for x in fig['xLabels']] == edges, 'main figure x labels are lower edges')
struct(fig.get('integerTicks') is True and fig['afterSection'] == 0, 'main figure integer ticks / placement')
struct(len(fig['xLabels']) == len(fig['series'][0]['values']) == 9, 'main figure label count')
bin_members = [[x for x in net if e <= x < e + F(1, 2)] for e in edges]
for a in fig['annotations']:
    vals = [parse(v) for v in re.findall(r'[−+]?\d+\.\d+', a['label'])]
    counts['numeric'] += 1
    if not all(v in bin_members[a['index']] for v in vals):
        hard.append(f'main figure annotation {a["label"]} not in bin {a["index"]}')
struct(sorted(bin_members[4]) == [F(-45, 100), F(-5, 100)], 'bin 4 members are −0.45 and −0.05')
struct(bin_members[2] == [F(-105, 100)] * 5 and bin_members[8] == [F(195, 100)] * 5, 'stop and target bins')
text('figure.caption', 'every bin includes its lower edge')
text('figure.caption', 'Fictional paper record')

pf = ch['figures'][0]
eqp, uwp = pf['panels']
struct(pf['afterSection'] == 2, 'panel figure after equity section')
for k, seq in enumerate((rec, lf)):
    vals = eqp['series'][k]['values']
    counts['numeric'] += len(vals)
    if [F(v) for v in vals] != seq:
        hard.append(f'equity panel series {k} differs')
    dd, _ = drawdowns(seq)
    shown = uwp['series'][k]['values']
    for i, v in enumerate(shown):
        counts['numeric'] += 1
        exact = 100 * dd[i]
        if D(F(str(v))) != rnd(exact, 2):
            hard.append(f'underwater series {k} point {i}: {v} vs {rnd(exact, 2)}')
        if rnd(exact, 2) != rnd(exact, 2, ROUND_HALF_EVEN):
            notes.append({'id': 'half-up-dependence', 'series': k, 'point': i, 'exact': str(D(exact)), 'shown': v})
struct(len(eqp['series'][0]['values']) == 21 and eqp['xStart'] == 0 and uwp['xStart'] == 0, 'panel lengths/xStart')
an = eqp['annotations']
struct(an[0]['index'] == 6 and an[0]['seriesIndex'] == 0 and rec[6] == 20265 and '$20,265' in an[0]['label'], 'peak annotation')
struct(an[1]['index'] == 8 and an[1]['seriesIndex'] == 1 and lf[8] == 19190 and '$19,190' in an[1]['label'], 'trough annotation')
struct(an[2]['index'] == 20 and rec[20] == lf[20] == 20605 and '$20,605' in an[2]['label'], 'ending annotation')
ua = uwp['annotations']
struct(ua[0]['index'] == 8 and uwp['series'][0]['values'][8] == -1.68 and '−1.68%' in ua[0]['label'], 'recorded MDD annotation')
struct(ua[1]['index'] == 8 and uwp['series'][1]['values'][8] == -4.05 and '−4.05%' in ua[1]['label'], 'losses-first MDD annotation')
struct(ua[2]['index'] == 17 and drawdowns(rec)[0][17] == 0 and all(drawdowns(rec)[0][i] < 0 for i in range(7, 17)), 'new-peak annotation trade 17')
text('figures[0].caption', 'Both orders end at $20,605 with the same +0.3025R average')

rf = ch['figures'][1]
struct(rf['afterSection'] == 3 and rf['xStart'] == 1, 'running-mean figure placement')
rm, up, lo, zero = (s['values'] for s in rf['series'])
for k in range(20):
    counts['numeric'] += 1
    if D(F(str(rm[k]))) != rnd(running[k], 3):
        hard.append(f'running mean {k + 1}: {rm[k]} vs {rnd(running[k], 3)}')
    if rnd(running[k], 3) != rnd(running[k], 3, ROUND_HALF_EVEN):
        notes.append({'id': 'half-up-dependence', 'running_mean_n': k + 1, 'exact': str(D(running[k])), 'shown': rm[k]})
    n = k + 1
    if n < 5:
        struct(up[k] is None and lo[k] is None, f'band null before trade 5 (n={n})')
    else:
        s_n = sd(net[:n])
        se_n = s_n / D(n).sqrt()
        for shown_v, exact in ((up[k], D(running[k]) + 2 * se_n), (lo[k], D(running[k]) - 2 * se_n)):
            counts['numeric'] += 1
            frac = (abs(exact) * 1000) % 1
            if abs(frac - Decimal('0.5')) < Decimal('1e-30'):
                hard.append(f'ambiguous band rounding n={n}')
            if D(F(str(shown_v))) != rnd(exact, 3):
                hard.append(f'band n={n}: {shown_v} vs {rnd(exact, 3)}')
        struct(lo[k] < 0 < up[k], f'band includes zero at n={n}')
struct(all(v == 0 for v in zero) and len(zero) == 20, 'zero line')
ra = rf['annotations']
struct(ra[0]['index'] == 7 and '−0.09R' in ra[0]['label'] and rnd(running[7], 2) == Decimal('-0.09'), 'annotation after 8')
struct(ra[1]['index'] == 19 and '+0.30R' in ra[1]['label'] and rnd(running[19], 2) == Decimal('0.30'), 'annotation mean 20')
struct(ra[2]['index'] == 19 and ra[2]['seriesIndex'] == 2 and '−0.28R' in ra[2]['label'] and rnd(D(F(str(lo[19]))), 2) == Decimal('-0.28'), 'annotation lower band')
text('figures[1].caption', 'from trade 5 onward')
text('figures[1].caption', 'still includes zero after twenty trades')

# ---------------------------------------------------------------- evidence summaries (internal numbers)
ev = ' '.join(flat(e) for e in ch['evidence'])
for s in ('+14.15R', '−8.10R', '1.179R', '1.0125R', '+0.3025R', '+0.3525R', '$705/$100/$605', '46.2%',
          '$20,265', '$19,925', '$340 = 1.68%', '1.71%', 'trade 17', '$810 = 4.05%', '4.22%', 'trade 16',
          '$20,605 (3.025%)', '+0.216R', '+0.442R', '1.308R (n − 1 divisor)', 'SE 0.2925R', '−0.28R to +0.89R',
          'break-even transaction costs computed ex ante (pp. 22, 24)', 'ex post (p. 21)',
          'z = 1.95996398454', '1 − 0.95⁶ ≈ 26%', '38.66%–78.12%'):
    counts['text'] += 1
    if s not in ev:
        hard.append(f'evidence summary missing {s!r}')

# ---------------------------------------------------------------- structure / cross-references
struct(ch['quiz']['answer'] < len(ch['quiz']['options']), 'answer index in range')
for f_ in [ch['figure']] + [p_ for f2 in ch['figures'] for p_ in (f2.get('panels') or [f2])]:
    L = {len(s['values']) for s in f_['series']}
    struct(len(L) == 1, f'equal series lengths in {f_.get("title")}')
    for a in f_.get('annotations', []):
        struct(0 <= a['index'] < len(f_['series'][a.get('seriesIndex', 0)]['values']), f'annotation index in range {a["label"]}')
ids = set()
for fn in Path('content').glob('*.json'):
    d = json.loads(fn.read_text(encoding='utf-8'))
    for c in d.get('chapters', []):
        ids.add(c['id'])
for r in ch['prerequisites'] + ch['related']:
    struct(r in ids, f'cross-reference {r} exists')
for sid in ch['sources']:
    struct(sid in data['sources'], f'source record {sid} present')
struct(all(s.get('id') for s in ch['sections']), 'section ids present')
struct([s.get('optional', False) for s in ch['sections']] == [False, False, False, False, True, True, True, True, False], 'optional flags')

result = {
    'chapter': ch['id'], 'counts': counts, 'hard_mismatches': hard,
    'displayed_chain_mismatches': chain, 'notes': notes,
    'rounding_rule': 'round half away from zero at displayed precision; roots at 60 significant digits with boundary check',
}
(ROOT / 'statistics-arithmetic.json').write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f"numeric comparisons: {counts['numeric']}, text checks: {counts['text']}, structural checks: {counts['structural']}")
print(f'hard mismatches: {len(hard)}')
for h in hard:
    print('  ', h)
print(f'displayed-chain mismatches: {len(chain)}')
for c in chain:
    print('  ', c)
print('notes:')
for n_ in notes:
    print('  ', n_)
