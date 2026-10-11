#!/usr/bin/env python3
"""Independent Fraction reproduction of every derivable number in Chapter 16 (breadth).

Run from the repository root:  python3 docs/publication-batch5-assets/breadth-reproduce.py
Reads the compiled chapter at docs/publication-batch5-assets/compiled/breadth.json and cross-checks
it against the authoring source content/indicators-context.json.
"""
import json
import re
import sys
from fractions import Fraction as F

COMPILED = 'docs/publication-batch5-assets/compiled/breadth.json'
ch = json.load(open(COMPILED, encoding='utf-8'))
auth = [c for c in json.load(open('content/indicators-context.json', encoding='utf-8'))['chapters'] if c['id'] == 'breadth'][0]

n = 0
fails = []


def check(name, got, exp):
    global n
    n += 1
    g = F(str(got)) if not isinstance(got, F) else got
    e = F(str(exp)) if not isinstance(exp, F) else exp
    if g != e:
        fails.append(f'{name}: got {got} expected {exp}')


def has(name, text, s):
    global n
    n += 1
    if s not in text:
        fails.append(f'{name}: missing text {s!r}')


def eq(name, a, b):
    global n
    n += 1
    if a != b:
        fails.append(f'{name}: {a!r} != {b!r}')


def pct(x):
    return x * 100


# --- 0. compiled == authoring (except computed reading time)
for k in [k for k in auth if k != 'minutes']:  # minutes is build-computed reading time
    eq(f'authoring field {k}', auth[k], ch[k])

sec = ch['sections']
P = lambda i, j: sec[i]['paragraphs'][j]

# --- 1. Main dataset: paths from figure panel and inputs table must agree
panel_paths, panel_index, panel_ad = ch['figure']['panels']
paths = {s['name']: [F(v) for v in s['values']] for s in panel_paths['series']}
tbl = ch['figures'][0]
eq('inputs table columns', tbl['columns'], ['Session', 'A', 'B', 'C', 'D', 'Index'])
for r, row in enumerate(tbl['rows']):
    check(f'inputs session no r{r}', row[0], r + 1)
    for k, name in enumerate('ABCD'):
        check(f'inputs {name} s{r+1} vs panel', row[k + 1], paths[name][r])

W = {'A': F(60, 100), 'B': F(20, 100), 'C': F(10, 100), 'D': F(10, 100)}
check('weights sum to 1', sum(W.values()), 1)
index = [sum(W[k] * paths[k][t] for k in 'ABCD') for t in range(12)]
for t in range(12):
    check(f'inputs table index s{t+1}', tbl['rows'][t][5], index[t])
    check(f'panel index s{t+1}', panel_index['series'][0]['values'][t], index[t])

# --- 2. Final-state table (section 0)
ft = sec[0]['tables'][0]
for row in ft['rows'][:4]:
    name, start, fin, w, ret, contrib = row
    check(f'final start {name}', start, paths[name][0])
    check(f'final finish {name}', fin, paths[name][-1])
    check(f'final weight {name}', w, pct(W[name]))
    r = (F(fin) - F(start)) / F(start)
    check(f'final return {name}', ret, pct(r))
    check(f'final contribution {name}', contrib, W[name] * r * 100)
tot = ft['rows'][4]
check('total start', tot[1], 100)
check('total finish', tot[2], index[-1])
check('total weight', tot[3], 100)
eq('total return text', tot[4], 'Index +4.8')
check('total return value', F('4.8'), index[-1] - 100)
check('total contribution', tot[5], sum(W[k] * (paths[k][-1] - 100) for k in 'ABCD'))
check('final index 104.8', index[-1], F('104.8'))
for s in ['+6 percentage points', '−0.4, −0.3, −0.5', '+4.8 points', '100 to 104.8']:
    has('sec0 p1', P(0, 1), s)
check('A contribution +6', W['A'] * (paths['A'][-1] - 100), 6)
check('B contribution', W['B'] * (paths['B'][-1] - 100), F('-0.4'))
check('C contribution', W['C'] * (paths['C'][-1] - 100), F('-0.3'))
check('D contribution', W['D'] * (paths['D'][-1] - 100), F('-0.5'))
since = [paths[k][-1] - paths[k][0] for k in 'ABCD']
check('since-start gainers', sum(1 for x in since if x > 0), 1)
check('since-start losers', sum(1 for x in since if x < 0), 3)
has('sec0 p0 final levels', P(0, 0), 'A is 110, B 98, C 97, D 95')
has('sec0 p0 three of four lost', P(0, 0), 'three of four constituents have lost value')

# --- 3. Daily count table and cumulative A/D panel (session 1 vs implicit 100s)
prev = {k: F(100) for k in 'ABCD'}
cum = 0
dt = sec[1]['tables'][0]['rows']
ad_series = panel_ad['series'][0]['values']
daily = []
for t in range(12):
    cur = {k: paths[k][t] for k in 'ABCD'}
    adv = sum(1 for k in 'ABCD' if cur[k] > prev[k])
    dec = sum(1 for k in 'ABCD' if cur[k] < prev[k])
    unc = 4 - adv - dec
    cum += adv - dec
    daily.append((adv, dec, unc, adv - dec, cum))
    row = dt[t]
    for lab, got, exp in zip(['session', 'adv', 'dec', 'unch', 'net', 'cum'], row, [t + 1, adv, dec, unc, adv - dec, cum]):
        check(f'daily table s{t+1} {lab}', got, exp)
    check(f'A/D panel s{t+1}', ad_series[t], cum)
    check(f'zero panel s{t+1}', panel_ad['series'][1]['values'][t], 0)
    prev = cur

# --- 4. Section 1 prose: 100-stock example and session 12
u = [(60, 30, 10), (35, 55, 10), (45, 45, 10)]
c = 0
nets = []
for a, d, z in u:
    check('100-stock universe total', a + d + z, 100)
    c += a - d
    nets.append((a - d, c))
eq('100-stock nets', nets, [(30, 30), (-20, 10), (0, 10)])
for s in ['net +30 and cumulative +30', 'net −20 and cumulative +10', 'net zero and cumulative still +10']:
    has('sec1 p1', P(1, 1), s)
has('sec1 p2 s12', P(1, 2), 'A rises 109→110')
check('s11 A', paths['A'][10], 109)
check('s12 A', paths['A'][11], 110)
check('s11 D', paths['D'][10], 96)
check('s12 D', paths['D'][11], 95)
check('s12 B unchanged', paths['B'][11] - paths['B'][10], 0)
check('s12 C unchanged', paths['C'][11] - paths['C'][10], 0)
eq('s12 counts', daily[11][:4], (1, 1, 2, 0))

# --- 5. Section 2: fractions
check('movers fraction day one', pct(F(60, 90)).limit_denominator(10**6), pct(F(60, 90)))
has('sec2 66.67', P(2, 0), '60/90 ≈ 66.67%')
check('66.67 rounding', round(float(pct(F(60, 90))), 2), F('66.67'))
check('all-universe fraction', pct(F(60, 100)), 60)

# --- 6. Section 4 walkthrough
check('s2 index 101.1', F('0.6') * 102 + F('0.2') * 100 + F('0.1') * 100 + F('0.1') * 99, F('101.1'))
check('s2 index matches series', index[1], F('101.1'))
eq('s2 counts', daily[1][:4], (1, 1, 2, 0))
check('sixfold weights', W['A'] / W['D'], 6)
eq('s10 levels', [paths[k][9] for k in 'ABCD'], [110, 97, 96, 95])
comps10 = [W[k] * paths[k][9] for k in 'ABCD']
eq('s10 components', comps10, [66, F('19.4'), F('9.6'), F('9.5')])
check('s10 index', sum(comps10), F('104.5'))
eq('s10 counts', daily[9][:4], (1, 3, 0, -2))
eq('s11 counts', daily[10][:4], (3, 1, 0, 2))
check('s11 index', index[10], F('104.3'))
check('s11 weighted change negative', index[10] - index[9], F('-0.2'))
check('s11 A contribution', W['A'] * (paths['A'][10] - paths['A'][9]), F('-0.6'))
check('s11 B+C+D contribution', sum(W[k] * (paths[k][10] - paths[k][9]) for k in 'BCD'), F('0.4'))
has('sec4 p0', P(4, 0), '= 101.1')
has('sec4 p1', P(4, 1), '66+19.4+9.6+9.5 = 104.5')
has('sec4 p1', P(4, 1), 'falls to 104.3')
check('equal weight final', sum(paths[k][-1] for k in 'ABCD') / 4, 100)
has('sec4 p3', P(4, 3), '(110+98+97+95)/4 = 100')

# --- 7. Section 5, example, exercise solution, quiz
check('s12 movers fraction', pct(F(daily[11][0], daily[11][0] + daily[11][1])), 50)
check('s12 all fraction', pct(F(daily[11][0], 4)), 25)
has('sec5 p0', P(5, 0), '1/(1+1) = 50%')
has('sec5 p0', P(5, 0), '1/4 = 25%')
has('sec5 p0', P(5, 0), 'net −2')
has('sec5 p1', P(5, 1), 'gained 4.8%')
check('index pct gain', (index[-1] - 100) / 100 * 100, F('4.8'))
has('example', ch['example']['text'], '0.60 × 110+0.20 × 98+0.10 × 97+0.10 × 95 = 104.8')
check('example components sum', F('0.6') * 110 + F('0.2') * 98 + F('0.1') * 97 + F('0.1') * 95, F('104.8'))
has('solution 0', ch['solution'][0], '66+19.6+9.7+9.5 = 104.8')
eq('final components', [W[k] * paths[k][-1] for k in 'ABCD'], [66, F('19.6'), F('9.7'), F('9.5')])
has('solution 1', ch['solution'][1], '1/2 = 50%')
has('solution 1', ch['solution'][1], '1/4 = 25%')
q = ch['quiz']
check('quiz answer index', q['answer'], 1)
eq('quiz correct option', q['options'][q['answer']], '50%')
eq('quiz explanation equals feedback[answer]', q['explanation'], q['feedback'][q['answer']])
check('quiz option 0 = all-eligible fraction', F(q['options'][0].rstrip('%')), pct(F(1, 4)))
check('quiz option 2 = session-11 movers fraction (distractor source)', F(q['options'][2].rstrip('%')), pct(F(daily[10][0], daily[10][0] + daily[10][1])))

# --- 8. Annotations
for ann, exp_val in zip(panel_index['annotations'], [F('104.5'), F('104.3')]):
    check(f'index annotation value idx{ann["index"]}', index[ann['index']], exp_val)
    check(f'index annotation shortLabel idx{ann["index"]}', F(ann['shortLabel']), exp_val)
check('index annotation s11 daily advancers', daily[10][0], 3)
for ann, net in zip(panel_ad['annotations'], [-2, 2]):
    check(f'A/D annotation net idx{ann["index"]}', daily[ann['index']][3], net)
    m = re.search(r'Net ([−+])(\d+)', ann['shortLabel'])
    check(f'A/D shortLabel idx{ann["index"]}', (-1 if m.group(1) == '−' else 1) * int(m.group(2)), net)
    check(f'A/D annotation session {ann["index"]+1} label session', ann['index'], {-2: 9, 2: 10}[net])
eq('s10 annotation counts', daily[9][:2], (1, 3))
eq('s11 annotation counts', daily[10][:2], (3, 1))

# --- 9. Guided practice
g = ch['practice'][0]
check('guided index', F('0.6') * 102 + F('0.2') * 100 + F('0.1') * 100 + F('0.1') * 99, F('101.1'))
has('guided solution', g['solution'][0], '61.2+20+10+9.9 = 101.1')
eq('guided parts', [F('0.6') * 102, F('0.2') * 100, F('0.1') * 100, F('0.1') * 99], [F('61.2'), 20, 10, F('9.9')])

# --- 10. Independent practice: reconstruct from its input table only
ip = ch['practice'][1]
rows = ip['tables'][0]['rows']
w5 = {r[0]: F(r[1]) / 100 for r in rows}
check('5-stock weights sum', sum(w5.values()), 1)
lv = {r[0]: [None if x == 'Missing' else F(x) for x in r[2:]] for r in rows}
for k in lv:
    check(f'session 0 rebased {k}', lv[k][1], 100)
idx1 = sum(w5[k] * lv[k][2] for k in lv)
check('fresh index', idx1, F('98.70'))
check('fresh change', idx1 - 100, F('-1.30'))
s0 = ip['solution'][0]
has('fresh sol0', s0, '52.80 + 20.60 + 10.20 + 10.10 + 5.00 = 98.70')
eq('fresh products', [w5[k] * lv[k][2] for k in 'ABCDE'], [F('52.8'), F('20.6'), F('10.2'), F('10.1'), 5])
contribs = {k: w5[k] * (lv[k][2] - 100) for k in lv}
eq('fresh contributions', [contribs[k] for k in 'ABCDE'], [F('-2.2'), F('0.6'), F('0.2'), F('0.1'), 0])
check('fresh contributions sum', sum(contribs.values()), F('-1.3'))
has('fresh sol0 contrib', s0, 'A contributes −2.20 points; B/C/D contribute +0.60/+0.20/+0.10')
adv = sum(1 for k in lv if lv[k][2] > lv[k][1])
dec = sum(1 for k in lv if lv[k][2] < lv[k][1])
unc = 5 - adv - dec
eq('fresh counts', (adv, dec, unc, adv - dec), (3, 1, 1, 2))
check('fresh movers fraction', pct(F(adv, adv + dec)), 75)
check('fresh all fraction', pct(F(adv, 5)), 60)
has('fresh sol1', ip['solution'][1], '3/(3 + 1) = 75%')
has('fresh sol1', ip['solution'][1], '3/5 = 60%')
sma = {}
for k in lv:
    if all(v is not None for v in lv[k]):
        sma[k] = sum(lv[k]) / 3
eq('fresh SMA eligibility', sorted(sma), ['A', 'B', 'C', 'D'])
eq('fresh SMAs', [sma[k] for k in 'ABCD'], [98, 102, 102, 101])
for k, txt in zip('ABCD', ['(98 + 100 + 96)/3 = 98', '(103 + 100 + 103)/3 = 102', '(104 + 100 + 102)/3 = 102', '(102 + 100 + 101)/3 = 101']):
    has(f'fresh SMA text {k}', ip['solution'][2], txt)
cls = {k: ('above' if lv[k][2] > sma[k] else 'below' if lv[k][2] < sma[k] else 'equal') for k in sma}
eq('fresh classifications', cls, {'A': 'below', 'B': 'above', 'C': 'equal', 'D': 'equal'})
above = sum(1 for k in cls if cls[k] == 'above')
check('fresh pct above eligible', pct(F(above, len(sma))), 25)
check('fresh wrong denominator', pct(F(above, 5)), 20)
has('fresh sol2', ip['solution'][2], '25%, rather than 1/5 = 20%')
has('fresh sol3', ip['solution'][3], 'fell 1.30%')
has('fresh sol3', ip['solution'][3], 'A’s 55% weight')
check('A weight 55', w5['A'] * 100, 55)

# --- 11. Evidence record numbers
ev = ch['evidence'][1]['summary']
has('evidence summary', ev, '98.70 with 3 advances/1 decline/1 unchanged')
has('evidence summary', ev, '1 of 4 eligible stocks')

print(f'{n} comparisons, {len(fails)} mismatches')
for f in fails:
    print('MISMATCH', f)
sys.exit(1 if fails else 0)
