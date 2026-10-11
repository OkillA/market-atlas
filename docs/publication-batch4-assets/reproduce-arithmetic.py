"""Independent arithmetic for publication batch 4 (Chapters 10-14, Part 3).

Run from the repository root: python3 docs/publication-batch4-assets/reproduce-arithmetic.py
Recomputes every supplied number from raw inputs with Fraction/Decimal and compares
it with the authoring JSON. Writes arithmetic-checks.json beside this script.
"""
from pathlib import Path
from fractions import Fraction as F
from decimal import Decimal as D, getcontext
import json, math

getcontext().prec = 40
raw = json.loads(Path('content/indicators-context.json').read_text())
cs = {c['id']: c for c in raw['chapters']}
part = raw['partPractice']['indicators']
checks = []


def num(x):
    return x if isinstance(x, F) else F(D(str(x)))


def eq(label, actual, expected, tol='0'):
    a, e = F(actual) if not isinstance(actual, F) else actual, num(expected)
    assert abs(a - e) <= num(tol), (label, float(a), float(e))
    checks.append({'label': label, 'actual': f'{float(a):.10g}', 'expected': str(expected), 'tolerance': tol})


def seq(label, actual, expected, tol='0'):
    assert len(actual) == len(expected), (label, len(actual), len(expected))
    for i, (a, e) in enumerate(zip(actual, expected)):
        undefined = e is None or (isinstance(e, str) and not e.lstrip('-').replace('.', '', 1).isdigit())
        if a is None or undefined:
            assert (a is None) == undefined, (label, i, a, e)
            checks.append({'label': f'{label}[{i}]', 'actual': 'undefined', 'expected': str(e), 'tolerance': '0'})
        else:
            eq(f'{label}[{i}]', a, e, tol)


def table(c, title):
    return next(t for s in c['sections'] for t in s.get('tables', []) if t['title'].startswith(title))


def sma(xs, n):
    return [None if i < n - 1 else sum(xs[i - n + 1:i + 1]) / n for i in range(len(xs))]


def ema_sma_seed(xs, n):
    a, out = F(2, n + 1), []
    for i in range(len(xs)):
        if i < n - 1:
            out.append(None)
        elif i == n - 1:
            out.append(sum(xs[:n]) / n)
        else:
            out.append(out[-1] + a * (xs[i] - out[-1]))
    return out


def side(close, mean):  # chapter rule: equality belongs to below-or-equal
    return 'above' if close > mean else 'below'


# ---------------- Chapter 10: moving averages ----------------
c = cs['moving-averages']
rows = table(c, 'Main dataset')['rows']
closes = [num(r[1]) for r in rows]
s5, e5 = sma(closes, 5), ema_sma_seed(closes, 5)
seq('ch10 table SMA', s5, [r[2] for r in rows])
seq('ch10 table EMA (3dp)', e5, [r[3] for r in rows], '0.0005')
p0, p1 = c['figure']['panels']
seq('ch10 figure closes', closes, p0['series'][0]['values'])
seq('ch10 figure SMA', s5, p0['series'][1]['values'], '1e-12')
seq('ch10 figure EMA', e5, p0['series'][2]['values'], '1e-12')
eq('ch10 session-7 window sum', sum(closes[2:7]), 69)
eq('ch10 session-8 window sum', sum(closes[3:8]), 71)
eq('ch10 quiz answer value', s5[6], c['quiz']['options'][c['quiz']['answer']].strip('$'))
eq('ch10 practice EMA update', e5[6] + (closes[7] - e5[6]) / 3, '13.7777778', '1e-7')


def crossings(xs, means):
    events, prev = [], None
    for i, (x, m) in enumerate(zip(xs, means)):
        if m is None:
            continue
        s = side(x, m)
        if prev is not None and s != prev:
            events.append((i + 1, 'up' if s == 'above' else 'down'))
        prev = s
    return events


main_events = crossings(closes, s5)
eq('ch10 first main crossing session', main_events[0][0], 8)
eq('ch10 first main crossing is down', int(main_events[0][1] == 'down'), 1)
eq('ch10 session-8 close above EMA (disagreement)', int(closes[7] > e5[7]), 1)
rng = [num(v) for v in p1['series'][0]['values']]
rs5 = sma(rng, 5)
seq('ch10 range SMA', rs5, p1['series'][1]['values'], '1e-12')
rev = crossings(rng, rs5)
eq('ch10 range switches sessions 6-12', len(rev), 7)
seq('ch10 range switch sessions', [s for s, _ in rev], [6, 7, 8, 9, 10, 11, 12])
for a in p1['annotations']:
    s, d = rev[a['index'] - 5]
    eq(f"ch10 range annotation {a['index']} direction", int(d == a['shortLabel'].lower().split()[0]), 1)


def two_close(xs, means, strict_reset=False):
    """Return confirmations: new side recognised after two consecutive closes on it."""
    confirmed, run_side, run, out = None, None, 0, []
    for i, (x, m) in enumerate(zip(xs, means)):
        if m is None:
            continue
        if strict_reset and x == m:
            run_side, run = None, 0
            continue
        s = side(x, m)
        run = run + 1 if s == run_side else 1
        run_side = s
        if confirmed is None:
            confirmed = s
        elif s != confirmed and run >= 2:
            confirmed = s
            out.append((i + 1, s))
    return out


eq('ch10 two-close main recognition session', two_close(closes, s5)[0][0], 9)
eq('ch10 two-close range confirmations', len(two_close(rng, rs5)), 0)
ind = [num(v) for v in [20, 22, 24, 21, 20, 23, 25]]
is3 = sma(ind, 3)
seq('ch10 practice 3-SMA', is3[2:], ['22', '22.3333', '21.6667', '21.3333', '22.6667'], '0.00005')
seq('ch10 practice states', [int(x > m) for x, m in zip(ind[2:], is3[2:])], [1, 0, 0, 1, 1])
seq('ch10 practice switches', [s for s, _ in crossings(ind, is3)], [4, 6])
seq('ch10 practice two-close confirmations', [s for s, _ in two_close(ind, is3, True)], [5, 7])

# ---------------- Chapter 11: momentum ----------------
c = cs['momentum']
rows = table(c, 'Complete displayed inputs')['rows']
hist = [F(50)] * 36 + [num(r[1]) for r in rows]
roc = [100 * (hist[36 + i] / hist[31 + i] - 1) for i in range(18)]
seq('ch11 ROC table', roc, [r[2] for r in rows], '0.0000005')
seq('ch11 ROC figure', roc, c['figure']['panels'][1]['series'][0]['values'], '1e-12')
seq('ch11 close figure', hist[36:], c['figure']['panels'][0]['series'][0]['values'])
eq('ch11 ROC s7', roc[6], '25.490196', '0.0000005')
eq('ch11 ROC s12', roc[11], '7.8125')
eq('ch11 ROC s14', roc[13], '6.060606', '0.0000005')
eq('ch11 ROC drop in points', roc[11] - roc[13], '1.75', '0.005')
px = hist[36:]
peaks = [i + 1 for i in range(1, 17) if px[i] > px[i - 1] and px[i] > px[i + 1]]
seq('ch11 one-neighbour peaks (all)', peaks, [12, 14, 16])
seq('ch11 annotated peaks', [a['index'] + 1 for a in c['figure']['panels'][0]['annotations'][:2]], [12, 14])
eq('ch11 session 16 exceeds peak 14', int(px[15] > px[13]), 1)
# RSI companion (Wilder, N=3, SMA seed)
rsi_c = [num(r[1]) for r in table(c, 'RSI arithmetic companion')['rows']]
ch = [b - a for a, b in zip(rsi_c, rsi_c[1:])]
g, l = [max(x, 0) for x in ch], [max(-x, 0) for x in ch]
ag, al = sum(g[:3]) / 3, sum(l[:3]) / 3
eq('ch11 RSI seed gain 4/3', ag * 3, 4)
eq('ch11 RSI seed loss 1/3', al * 3, 1)
eq('ch11 RSI seed', 100 - 100 / (1 + ag / al), 80)
ag, al = (2 * ag + g[3]) / 3, (2 * al + l[3]) / 3
eq('ch11 RSI update gain 8/9', ag * 9, 8)
eq('ch11 RSI update loss 5/9', al * 9, 5)
eq('ch11 RSI update RS', ag / al, '1.6')
eq('ch11 RSI update', 100 - 100 / (1 + ag / al), '61.538462', '0.0000005')
eq('ch11 RS=2 example', 100 - F(100, 3), '66.67', '0.005')
# MACD 12/26/9 with SMA seeds over the 54-close history
f12, s26 = ema_sma_seed(hist, 12), ema_sma_seed(hist, 26)
macd = [None if b is None else a - b for a, b in zip(f12, s26)]
first = next(i for i, m in enumerate(macd) if m is not None)
eq('ch11 MACD first valid close number', first + 1, 26)
valid = macd[first:]
sig = [None] * (first + 8) + [sum(valid[:9]) / 9]
for m in macd[first + 9:]:
    sig.append(sig[-1] + F(2, 10) * (m - sig[-1]))
eq('ch11 signal first valid close number', first + 9, 34)
mp, sp = c['figures'][0]['panels']
seq('ch11 MACD figure', macd[36:], mp['series'][0]['values'], '1e-12')
seq('ch11 signal figure', sig[36:], mp['series'][1]['values'], '1e-12')
seq('ch11 histogram figure', [a - b for a, b in zip(macd[36:], sig[36:])], sp['series'][0]['values'], '1e-12')
for r in table(c, 'Read the actual MACD panel')['rows']:
    i = 36 + r[0] - 1
    seq(f'ch11 MACD checkpoint s{r[0]}', [hist[i], macd[i], sig[i], macd[i] - sig[i]], r[1:], '0.0000005')
eq('ch11 hist positive at all displayed sessions', int(all(m - s >= 0 for m, s in zip(macd[36:], sig[36:]))), 1)
eq('ch11 snapshot histogram A', F(52) - 50 - num('1.5'), '0.5')
eq('ch11 snapshot histogram B', num('1.8') - num('1.6'), '0.2')
eq('ch11 snapshot histogram C', num('1.8') - num('1.9'), '-0.1')
# Independent initialized MACD task
fast, slow, sg = F(30), F(31), num('-0.6')
eq('ch11 task s0 MACD', fast - slow, -1)
eq('ch11 task s0 hist', fast - slow - sg, '-0.4')
res = []
for close in [F(34), num('34.5')]:
    fast += F(2, 13) * (close - fast)
    slow += F(2, 27) * (close - slow)
    m = fast - slow
    sg += F(2, 10) * (m - sg)
    res.append((fast, slow, m, sg, m - sg))
seq('ch11 task s1', res[0], ['30.615385', '31.222222', '-0.606838', '-0.601368', '-0.005470'], '0.0000005')
seq('ch11 task s2', res[1], ['31.213018', '31.465021', '-0.252003', '-0.531495', '0.279492'], '0.0000005')
eq('ch11 task first above signal at s2', int(res[0][4] < 0 < res[1][4]), 1)
eq('ch11 task MACD still below zero', int(res[1][2] < 0), 1)

# ---------------- Chapter 12: volatility ----------------
c = cs['volatility']
gap = {r[0]: num(r[1]) for r in table(c, 'The gap-aware session')['rows']}
pc, h, l, o, cl = gap['Previous close'], gap['High'], gap['Low'], gap['Open'], gap['Close']
trs = [h - l, abs(h - pc), abs(l - pc)]
seq('ch12 TR components', trs, [gap['High − low'], gap['|High − previous close|'], gap['|Low − previous close|']])
eq('ch12 TR', max(trs), gap['True range'])
cand = c['figure']['candles']
seq('ch12 figure gap candle', [num(cand[1][k]) for k in ['open', 'high', 'low', 'close']], [o, h, l, cl])
eq('ch12 figure previous close', cand[0]['close'], pc)
eq('ch12 opening gap', o - pc, 4)
atr = (2 * 2 + max(trs)) / 3
eq('ch12 ATR update', atr, '3.6667', '0.00005')
eq('ch12 downside TR', max(F(96 - 93), abs(F(96) - 100), abs(F(93) - 100)), 7)
eq('ch12 practice reverse candle TR', max(F(3), F(4), F(7)), 7)
eq('ch12 practice return', 100 * (F(94) / 100 - 1), -6)
eq('ch12 ATR % example', F(3) / 60 * 100, 5)
eq('ch12 close-to-close return', 100 * (cl / pc - 1), 6)
eq('ch12 counterexample spans', F(110 - 90) - (num('100.5') - num('99.5')), 19)
two_atr = 2 * atr
eq('ch12 two ATR', two_atr, '7.3333', '0.00005')
shares = math.floor(F(100) / two_atr)
eq('ch12 whole shares', shares, 13)
eq('ch12 13-share risk', 13 * two_atr, '95.3333', '0.00005')
eq('ch12 14-share risk', 14 * two_atr, '102.6667', '0.00005')
bb = c['figures'][0]
bcl = [num(v) for v in bb['series'][0]['values']]
mid, up, lo = [], [], []
for i in range(len(bcl)):
    if i < 2:
        mid.append(None); up.append(None); lo.append(None); continue
    w = bcl[i - 2:i + 1]; m = sum(w) / 3
    sd = math.sqrt(sum((x - m) ** 2 for x in w) / 3)
    mid.append(m); up.append(F(float(m) + 2 * sd)); lo.append(F(float(m) - 2 * sd))
seq('ch12 band middle', mid, bb['series'][1]['values'], '1e-12')
seq('ch12 band upper', up, bb['series'][2]['values'], '1e-9')
seq('ch12 band lower', lo, bb['series'][3]['values'], '1e-9')
vt = table(c, 'Three-close population variance')['rows']
eq('ch12 variance', F(8, 3), vt[4][2], '0.0000005')
eq('ch12 SD', math.sqrt(8 / 3), vt[5][2], '0.0000005')
eq('ch12 s3 lower', lo[2], '96.7340', '0.00005')
eq('ch12 s3 upper', up[2], '103.2660', '0.00005')
w6 = bcl[3:6]; m6 = sum(w6) / 3
seq('ch12 s6 window', w6, [103, 104, 104])
eq('ch12 s6 squared deviations', sum((x - m6) ** 2 for x in w6), F(2, 3))
eq('ch12 s6 SD', math.sqrt(2 / 9), '0.471405', '0.0000005')
seq('ch12 s6 bands', [lo[5], up[5]], ['102.7239', '104.6095'], '0.00005')
eq('ch12 bandwidth s3', (up[2] - lo[2]) / mid[2] * 100, '6.532', '0.0005')
eq('ch12 bandwidth s6', (up[5] - lo[5]) / mid[5] * 100, '1.819', '0.0005')
eq('ch12 sample-denominator SD', math.sqrt(8 / 2), 2)

# ---------------- Chapter 13: volume tools ----------------
c = cs['volume-tools']
tape = table(c, 'Exact tape')['rows']
cv = cq = F(0)
for r in tape:
    p, q = num(r[1]), num(r[2])
    eq(f'ch13 trade {r[0]} value', p * q, r[3])
    cv += p * q; cq += q
    eq(f'ch13 trade {r[0]} cumulative shares', cq, r[4])
    eq(f'ch13 trade {r[0]} VWAP', cv / cq, r[5], '0.0000005')
eq('ch13 total value', cv, 20200)
eq('ch13 total shares', cq, 1700)
vp = c['figure']['panels']
seq('ch13 figure prices', [r[1] for r in tape], vp[0]['series'][0]['values'])
run_v = run_q = F(0); fig_vwap = []
for r in tape:
    run_v += num(r[1]) * num(r[2]); run_q += num(r[2]); fig_vwap.append(run_v / run_q)
seq('ch13 figure VWAP', fig_vwap, vp[0]['series'][1]['values'], '1e-12')
seq('ch13 figure quantities', [r[2] for r in tape], vp[1]['series'][0]['values'])
eq('ch13 two-trade unweighted mean', F(10 + 12, 2), 11)
prof = {}
for r in tape:
    prof[num(r[1])] = prof.get(num(r[1]), 0) + num(r[2])
lv = c['figures'][0]['levels']
seq('ch13 profile', [prof[num(x['price'])] for x in lv], [x['volume'] for x in lv])
eq('ch13 profile rows', len(lv), 7)
eq('ch13 profile total', sum(prof.values()), 1700)
eq('ch13 POC price', max(prof, key=prof.get), 12)
eq('ch13 POC share %', prof[F(12)] / 1700 * 100, '35.294', '0.0005')
eq('ch13 merged 11+12 bin', prof[F(11)] + prof[F(12)], 900)
obv_rows = table(c, 'Daily OBV')['rows']
obv = F(0)
for prev, r in zip([None] + obv_rows, obv_rows):
    add = F(0) if prev is None else (num(r[2]) if num(r[1]) > num(prev[1]) else -num(r[2]) if num(r[1]) < num(prev[1]) else F(0))
    obv += add
    eq(f'ch13 OBV s{r[0]} addition', add, r[3]); eq(f'ch13 OBV s{r[0]}', obv, r[4])
seq('ch13 OBV figure table matches section table', [x for r in c['figures'][1]['rows'] for x in r], [x for r in obv_rows for x in r])
trades = [(20, 100), (21, 300), (20, 200), (23, 50)]
val = sum(F(p * q) for p, q in trades); qty = sum(q for _, q in trades)
eq('ch13 practice value', val, 13450); eq('ch13 practice shares', qty, 650)
eq('ch13 practice VWAP', val / qty, '20.6923077', '0.00000005')
bins = {}
for p, q in trades:
    bins[p] = bins.get(p, 0) + q
seq('ch13 practice tied bins', [bins[20], bins[21]], [300, 300])
eq('ch13 practice POC fraction', F(300, 650) * 100, '46.1538', '0.00005')
eq('ch13 relative volume', F(2_000_000, 1_000_000), 2)

# ---------------- Chapter 14: Fibonacci ----------------
c = cs['fibonacci']


def down(hi, lo_, r):
    return num(hi) - num(r) * (num(hi) - num(lo_))


for r in table(c, 'Two declared windows')['rows']:
    eq(f'ch14 A {r[0]}', down(120, 100, r[0]), r[1])
    eq(f'ch14 B {r[0]}', down(120, 104, r[0]), r[2])
seq('ch14 upward retracement of decline', [100 + num(r) * 20 for r in ['0.382', '0.5', '0.618']], ['107.64', '110', '112.36'])
path = [num(r[1]) for r in table(c, 'Complete anchor-and-reveal path')['rows']]
seq('ch14 figure closes', path, c['figure']['series'][0]['values'])
A618, B618, A50, A382 = down(120, 100, '.618'), down(120, 104, '.618'), down(120, 100, '.5'), down(120, 100, '.382')
seq('ch14 figure A line', [None] * 6 + [A618] * 8, c['figure']['series'][1]['values'])
seq('ch14 figure B line', [None] * 6 + [B618] * 8, c['figure']['series'][2]['values'])
eq('ch14 high 120 confirmed at 7', int(path[5] > path[4] and path[5] > path[6]), 1)
eq('ch14 104 not a local low', int(path[1] < path[0] and path[1] < path[2]), 0)
eq('ch14 A-B 61.8 difference', B618 - A618, '2.472')
eq('ch14 s9 distance to B', abs(path[8] - B618), '0.112')
eq('ch14 s9 distance to A 38.2', abs(path[8] - A382), '2.36')
eq('ch14 s9 distance to A 61.8', path[8] - A618, '2.36')
eq('ch14 s9 distance to A 50 (exact touch)', abs(path[8] - A50), 0)
eq('ch14 B rebound threshold', B618 + 2, '112.112')
eq('ch14 B rebound fails s10-11', int(max(path[9:11]) >= B618 + 2), 0)
eq('ch14 A50 rebound fails s10-11', int(max(path[9:11]) >= A50 + 2), 0)
seq('ch14 s11-13 distances to A 61.8', [path[i] - A618 for i in (10, 11, 12)], ['-0.64', '-1.64', '0.36'])
near = lambda x, lvl: abs(x - lvl) <= num('0.25')
grid = [down(120, o, r) for o in (100, 104) for r in ('.382', '.5', '.618')]
touches = [(i + 1, float(g)) for i, x in enumerate(path) if i >= 6 for g in grid if near(x, g)]
seq('ch14 all near-touches on full A/B grids after confirmation', [t[0] for t in touches], [9, 9])
eq('ch14 B 50 level', down(120, 104, '.5'), 112)
eq('ch14 s9 vs B 50', down(120, 104, '.5') - path[8], 2)
eq('ch14 extension', 100 + num('1.618') * 20, '132.36')
T = [num(v) for v in [70, 73, 77, 76, 81, 79, 77, 78, 80]]
cut = T[:6]
pk = [i + 1 for i in range(1, 5) if cut[i] > cut[i - 1] and cut[i] > cut[i + 1]]
tr = [i + 1 for i in range(1, 5) if cut[i] < cut[i - 1] and cut[i] < cut[i + 1]]
eq('ch14 fresh latest confirmed high at T6', pk[-1], 5)
eq('ch14 fresh trough before high', max(t for t in tr if t < pk[-1]), 4)
fa, fb = down(81, 70, '.618'), down(81, 76, '.618')
seq('ch14 fresh levels', [fa, fb], ['74.202', '77.91'])
seq('ch14 fresh T8 distances', [abs(T[7] - fb), abs(T[7] - fa)], ['0.09', '3.798'])
eq('ch14 fresh T9 rebound', int(T[8] >= fb + 2), 1)
seq('ch14 fib ratios', [round(F(21, 34), 3), round(F(21, 55), 3), round(F(55, 34), 3)], ['0.618', '0.382', '1.618'])

# ---------------- Part 3 cumulative review ----------------
P = [num(v) for v in [40, 42, 41, 43, 44, 46, 45, 44, 43, 42, 43, 44]]
p3 = sma(P, 3)
seq('part3 SMA s10-11', [p3[9], p3[10]], ['43', '42.6667'], '0.00005')
eq('part3 session-11 up-cross', int(side(P[9], p3[9]) == 'below' and side(P[10], p3[10]) == 'above'), 1)
eq('part3 ROC3 s11', 100 * (P[10] / P[7] - 1), '-2.2727', '0.00005')
eq('part3 tape reconciliation', cv / cq, '11.882353', '0.0000005')

out = Path(__file__).with_name('arithmetic-checks.json')
out.write_text(json.dumps({'count': len(checks), 'checks': checks}, indent=1, ensure_ascii=False))
print(len(checks), 'comparisons passed')
