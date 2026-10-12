#!/usr/bin/env python3
"""Independent reproduction of Chapter 26 (system-design), publication batch 7.

Run from the repository root:
    python3 -I docs/publication-batch7-assets/system-design-reproduce.py

Reads only docs/publication-batch7-assets/compiled-system-design.json.
The Atlas-20 v1.0 rules are re-implemented here from the chapter's rule sheet
(not ported from scripts/atlas20-sim.cjs). All money is exact (Fraction);
displayed roundings use Decimal ROUND_HALF_UP.

Three kinds of comparison are counted:
  numeric    - a recomputed number compared with a number (or formatted number) in the text
  text       - a required wording/rule string compared with the text
  structural - counts, indices, ordering, table identity, leak scans
Mismatches are listed. Rule-derived checks (screen-log completeness, the
section-8 counterfactuals, packet placement and prelude leak scan) are asserted
as comparisons; an INFORMATIONAL block summarises the counterfactuals.
Revised 2026-10-12 for the post-review rebuild (Alder S6 bar, section 8,
afterSection 6).
"""
import json
import math
import os
import re
import sys
from decimal import Decimal, ROUND_HALF_UP, ROUND_FLOOR
from fractions import Fraction as F

ROOT = os.getcwd()
PATH = os.path.join(ROOT, 'docs', 'publication-batch7-assets', 'compiled-system-design.json')
DATA = json.load(open(PATH, encoding='utf-8'))
C = DATA['chapter']

COUNTS = {'numeric': 0, 'text': 0, 'structural': 0}
MISMATCHES = []
FINDINGS = []


def norm(s):
    return str(s).replace('−', '-').replace('–', '-').replace(',', '')


def money_str(x):
    """Parse '−8,027.50', '$9,857.50', '+$455' -> Fraction."""
    s = norm(x).replace('$', '').replace('+', '').strip()
    return F(Decimal(s))


def q(x, places=2):
    d = Decimal(x.numerator) / Decimal(x.denominator) if isinstance(x, F) else Decimal(str(x))
    return d.quantize(Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)


def fmt(x, places=2, commas=True, dollar=False, sign=False):
    d = q(x, places)
    neg = d < 0
    body = f"{abs(d):,.{places}f}" if commas else f"{abs(d):.{places}f}"
    if dollar:
        body = '$' + body
    if neg:
        return '−' + body
    return ('+' + body) if sign else body


def floor_cent(x):
    return F(math.floor(x * 100), 100)


def ffloor(x):
    return math.floor(x)


def num(label, got, expected):
    COUNTS['numeric'] += 1
    if F(got) != F(expected):
        MISMATCHES.append(f"NUMERIC {label}: recomputed {float(got)!r} vs text {float(expected)!r}")


def in_text(label, needle, hay, kind='numeric'):
    COUNTS[kind] += 1
    if needle not in hay:
        MISMATCHES.append(f"{kind.upper()} {label}: '{needle}' not found")


def struct(label, cond, detail=''):
    COUNTS['structural'] += 1
    if not cond:
        MISMATCHES.append(f"STRUCTURAL {label}: {detail}")


S = C['sections']
P = lambda i, j: S[i]['paragraphs'][j]

# ---------------------------------------------------------------- rules
RULE_TEXT = json.dumps([S[1]['tables'][0], S[2]['tables'][0], S[3]['tables'][0]], ensure_ascii=False)
for needle in ['21 consecutive valid bars: sessions t−20 through t', 'strictly above the highest high of sessions t−20…t−1',
               '$20.00 ≤ decision close ≤ $100.00', 'sessions t−19…t ≥ $2,000,000', 'sessions t+1…t+10',
               'Complete record → signal → price band → liquidity → earnings', 'rounded to 0.01 percentage point; larger ranks first',
               'Alphabetical by company name', 'At most 5 = open positions (halted ones included) + orders placed at this close',
               '1.01 × signal close, rounded down to the cent', 'floor(0.5% × E ÷ $2.00)', 'floor(10% × E ÷ L)',
               'floor((cash − cash already reserved at this close − $2.50) ÷ L)', 'Shares × L + $2.50',
               '1R = filled shares × $2.00, frozen at the fill', '$2.50 per executed fill', 'Open ≤ L: fill at the open',
               'low strictly below L: fill at L', 'floor(1% × entry-session volume)', 'Sell stop at fill − $2.00; triggered when low ≤ stop',
               'fill + $4.00; fills only when high is strictly above the target', 'holding session 10 (entry session = 1',
               '3. Low ≤ stop and high > target: stop assumed first', 'Fill at L intraday: the stop applies if low ≤ stop; a target is not credited',
               'drawdown above 8% of the equity peak']:
    in_text('rule sheet', needle, RULE_TEXT, 'text')

RISK, NOTIONAL, MARKUP, STOP, TARGET, FEE, PART, SLOTS, ADV_MIN = F(5, 1000), F(1, 10), F(101, 100), F(2), F(4), F(5, 2), F(1, 100), 5, F(2_000_000)

# ---------------------------------------------------------------- inputs
open_tab = S[4]['tables'][0]
screen_tab = S[4]['tables'][1]
bars = {}
for tab in (S[4]['tables'][2], S[4]['tables'][3]):
    stocks = tab['columns'][1:]
    for row in tab['rows']:
        t = int(norm(row[0]))
        for stock, cell in zip(stocks, row[1:]):
            bars.setdefault(stock, {})
            if cell == '—':
                continue
            if cell == 'no bar':
                bars[stock][t] = None
                continue
            px, _, vol = cell.partition('; vol ')
            o, h, l, c = [money_str(v) for v in px.split('/')]
            bars[stock][t] = {'o': o, 'h': h, 'l': l, 'c': c, 'v': int(norm(vol)) if vol else None}
            struct(f'bar {stock} S{t} OHLC geometry', l <= min(o, c) and h >= max(o, c), cell)
screen = {}
for row in screen_tab['rows']:
    t = int(row[0][1:])
    adv = None if row[4] == 'not computed' else F(Decimal(row[4])) * 1_000_000
    screen.setdefault(t, []).append({'stock': row[1], 'close': money_str(row[2]), 'h20': money_str(row[3]), 'adv': adv,
                                     'earn': int(row[5]), 'complete': row[6] == 'complete'})
    b = bars[row[1]].get(t)
    if b:
        num(f'screen {row[1]} D{t} close = bar close', b['c'], money_str(row[2]))

positions = []
for row in open_tab['rows'][:2]:
    stock, qty = row[0], int(row[1])
    entry = int(norm(row[2]).split()[0])
    fill = money_str(row[3])
    stop, target = [money_str(v) for v in row[4].split(' / ')]
    num(f'{stock} stop = fill - 2', fill - STOP, stop)
    num(f'{stock} target = fill + 4', fill + TARGET, target)
    num(f'{stock} 1R', qty * STOP, money_str(row[5]))
    num(f'{stock} S0 close = bar', bars[stock][0]['c'], money_str(row[6]))
    num(f'{stock} S0 value', qty * bars[stock][0]['c'], money_str(row[7]))
    ten = entry + 9
    in_text(f'{stock} holding session 10', f'holding session 10 = session {ten}', row[2])
    positions.append({'stock': stock, 'qty': qty, 'fill': fill, 'stop': stop, 'target': target, 'oneR': qty * STOP,
                      'entry': entry, 'mark': bars[stock][0]['c'], 'stale': False, 'entry_cost': FEE})
cash0 = money_str(open_tab['rows'][2][7])
num('opening equity', cash0 + sum(p['qty'] * p['mark'] for p in positions), money_str(open_tab['rows'][3][7]))
in_text('S4 p0 Hazel tenth session', "Hazel’s tenth holding session is session 2; Fir’s would be session 7", P(4, 0), 'numeric')


# ---------------------------------------------------------------- engine
def margin(close, h20):
    return q(F(100) * (close - h20) / h20, 2)


def decide(t, cash, positions, rules, rank_key=None, screen_rows=None):
    E = cash + sum(p['qty'] * p['mark'] for p in positions)
    held = {p['stock'] for p in positions}
    recs = []
    for s in (screen_rows if screen_rows is not None else screen.get(t, [])):
        r = dict(s)
        if s['stock'] in held:
            r['status'] = 'held'
        elif not s['complete']:
            r['status'] = 'incomplete'
        elif not s['close'] > s['h20']:
            r['status'] = 'no signal'
        else:
            r['margin'] = margin(s['close'], s['h20'])
            if not (20 <= s['close'] <= 100):
                r['status'] = 'band'
            elif s['adv'] < ADV_MIN:
                r['status'] = 'liquidity'
            elif t + 1 <= s['earn'] <= t + 10:
                r['status'] = 'earnings'
            else:
                r['status'] = 'eligible'
        recs.append(r)
    key = rank_key or (lambda r: r['margin'])
    elig = sorted([r for r in recs if r['status'] == 'eligible'], key=lambda r: r['stock'])
    elig = sorted(elig, key=key, reverse=True)
    free = SLOTS - len(positions)
    reserved = F(0)
    orders = []
    for i, r in enumerate(elig):
        r['rank'] = i + 1
        L = floor_cent(rules['markup'] * r['close'])
        r['L'] = L
        r['risk'] = ffloor(rules['risk'] * E / STOP)
        r['notional'] = ffloor(rules['notional'] * E / L)
        r['cash'] = max(0, ffloor((cash - reserved - FEE) / L))
        if free <= 0:
            r['qty'] = 0
            r['status'] = 'no slot'
            continue
        qty = min(r['risk'], r['notional'], r['cash'])
        r['qty'] = qty
        if qty < 1:
            continue
        r['reserve'] = qty * L + FEE
        reserved += r['reserve']
        free -= 1
        orders.append({'stock': r['stock'], 'qty': qty, 'L': L, 'reserve': r['reserve'], 'signal': t})
    return {'E': E, 'recs': recs, 'orders': orders, 'reserved': reserved}


class MissingBar(Exception):
    pass


def run(rules=None, last=7, part_cap=True, stop_first=True, touch_fills=False):
    rules = rules or {'risk': RISK, 'notional': NOTIONAL, 'markup': MARKUP}
    cash = cash0
    pos = [dict(p) for p in positions]
    pending = []
    ledger, events, trades, decisions = [], [], [], []
    for t in range(0, last + 1):
        if t > 0:
            # 1. held positions (from an earlier session)
            for p in list(pos):
                if p['stock'] not in bars or t not in bars[p['stock']]:
                    raise MissingBar(f"{p['stock']} S{t}")
                b = bars[p['stock']][t]
                n = t - p['entry'] + 1
                if b is None:
                    p['stale'] = True
                    events.append((t, p['stock'], 'halt', F(0)))
                    continue
                p['stale'] = False
                exit_px = reason = None
                if b['o'] <= p['stop']:
                    exit_px, reason = b['o'], 'gap stop open'
                elif b['o'] >= p['target']:
                    exit_px, reason = b['o'], 'gap target open'
                elif n > 10:
                    exit_px, reason = b['o'], 'overdue time open'
                elif b['l'] <= p['stop'] and b['h'] > p['target']:
                    exit_px, reason = (p['stop'], 'both: stop first') if stop_first else (p['target'], 'both: target first')
                elif b['l'] <= p['stop']:
                    exit_px, reason = p['stop'], 'stop'
                elif b['h'] > p['target']:
                    exit_px, reason = p['target'], 'target'
                elif n == 10:
                    exit_px, reason = b['c'], 'time exit close'
                if exit_px is not None:
                    flow = p['qty'] * exit_px - FEE
                    cash += flow
                    gross = p['qty'] * (exit_px - p['fill'])
                    trades.append({'stock': p['stock'], 'qty': p['qty'], 'entry': p['entry'], 'fill': p['fill'], 'exit_s': t,
                                   'exit': exit_px, 'reason': reason, 'oneR': p['oneR'], 'gross': gross,
                                   'net': gross - 2 * FEE, 'netR': (gross - 2 * FEE) / p['oneR']})
                    events.append((t, p['stock'], reason, flow))
                    pos.remove(p)
                else:
                    p['mark'] = b['c']
            # 2. reserved entries
            for o in pending:
                if o['stock'] not in bars or t not in bars[o['stock']] or bars[o['stock']][t] is None:
                    raise MissingBar(f"entry {o['stock']} S{t}")
                b = bars[o['stock']][t]
                if b['o'] <= o['L']:
                    px, how = b['o'], 'open'
                elif b['l'] < o['L'] or (touch_fills and b['l'] <= o['L']):
                    px, how = o['L'], 'intraday'
                else:
                    events.append((t, o['stock'], 'no fill', F(0)))
                    continue
                if b['v'] is None:
                    raise MissingBar(f"entry volume {o['stock']} S{t}")
                cap = ffloor(PART * b['v']) if part_cap else o['qty']
                qty = min(o['qty'], cap)
                flow = -(qty * px + FEE)
                cash += flow
                p = {'stock': o['stock'], 'qty': qty, 'fill': px, 'stop': px - STOP, 'target': px + TARGET, 'oneR': qty * STOP,
                     'entry': t, 'mark': b['c'], 'stale': False, 'entry_cost': FEE, 'ordered': o['qty'], 'how': how}
                events.append((t, o['stock'], 'buy ' + how, flow))
                # entry-bar checks
                ex = None
                if how == 'open':
                    if b['l'] <= p['stop']:
                        ex = p['stop']
                    elif b['h'] > p['target']:
                        ex = p['target']
                elif b['l'] <= p['stop']:
                    ex = p['stop']
                struct(f'entry bar {o["stock"]} S{t} produces no same-bar exit', ex is None)
                pos.append(p)
            pending = []
        holdings = sum(p['qty'] * p['mark'] for p in pos)
        d = decide(t, cash, pos, rules)
        decisions.append(d)
        ledger.append({'t': t, 'cash': cash, 'holdings': holdings, 'equity': cash + holdings, 'n': len(pos),
                       'orders': d['orders'], 'reserved': d['reserved'], 'available': cash - d['reserved'],
                       'marks': [(p['stock'], p['qty'], p['mark'], p['stale']) for p in pos]})
        pending = d['orders']
    return {'ledger': ledger, 'events': events, 'trades': trades, 'decisions': decisions, 'open': pos}


R = run()
L = R['ledger']

# ---------------------------------------------------------------- D0 allocation
d0 = R['decisions'][0]
t5 = S[5]['tables'][0]
byname = {r['stock']: r for r in d0['recs']}
for row in t5['rows'][:-1]:
    r = byname[row[0]]
    num(f'D0 {row[0]} margin', F(r['margin']), F(Decimal(row[1])))
    if row[2] == 'Yes':
        struct(f'D0 {row[0]} eligible', r['status'] in ('eligible', 'no slot'))
        num(f'D0 {row[0]} rank', r['rank'], int(row[3]))
        num(f'D0 {row[0]} limit', r['L'], money_str(row[4]))
        a, b_, c_ = [int(norm(v)) for v in row[5].split(' / ')]
        num(f'D0 {row[0]} risk allowance', r['risk'], a)
        num(f'D0 {row[0]} notional allowance', r['notional'], b_)
        num(f'D0 {row[0]} cash allowance', r['cash'], c_)
        num(f'D0 {row[0]} order', r['qty'], int(row[6].split()[0].rstrip(':')))
        if row[7] != '—':
            num(f'D0 {row[0]} reserved', r['reserve'], money_str(row[7]))
    else:
        struct(f'D0 {row[0]} ineligible reason', (r['status'] == 'earnings' and 'earnings' in row[2]) or (r['status'] == 'liquidity' and '$1.6M' in row[2]), r['status'])
num('D0 total reserved', d0['reserved'], money_str(t5['rows'][-1][7]))
num('D0 order count', len(d0['orders']), 3)
in_text('S5 p1 reserved', fmt(d0['reserved'], dollar=True), P(5, 1))
in_text('S5 p1 available', fmt(cash0 - d0['reserved'], dollar=True), P(5, 1))
num('S5 p1 Birch notional at limit', 138 * F('72.46'), money_str('9999.48'))
in_text('S5 p1 Birch 9,999.48', '$9,999.48', P(5, 1))
in_text('S5 p1 floor(500 / 2)', 'floor(500 ÷ 2) = 250', P(5, 1), 'text')
in_text('S5 p1 floor(10,000/32.27)=309', f"floor(10,000 ÷ 32.27) = {ffloor(F(10000) / F('32.27'))}", P(5, 1))
for nm in ('Alder', 'Birch', 'Cedar'):
    in_text(f'S5 p0 margin {nm}', f"{byname[nm]['margin']}%", P(5, 0))
struct('S5 p0 Cedar/Dogwood tie exact', byname['Cedar']['margin'] == byname['Dogwood']['margin'] and
       F(100) * (byname['Cedar']['close'] - byname['Cedar']['h20']) / byname['Cedar']['h20'] ==
       F(100) * (byname['Dogwood']['close'] - byname['Dogwood']['h20']) / byname['Dogwood']['h20'])
struct('S5 p0 six signals', len(d0['recs']) == 6 and 'Six stocks signal' in P(5, 0))
struct('S5 p0 three free slots', SLOTS - 2 == 3 and 'only three are free' in P(5, 0))
in_text('Example Alder notional', fmt(250 * byname['Alder']['L'], dollar=True), C['example']['text'])
in_text('Example Birch planned risk', fmt(138 * STOP, 0, dollar=True), C['example']['text'])

# ---------------------------------------------------------------- ledger table
lt = S[7]['tables'][1]
for i, row in enumerate(lt['rows']):
    l = L[i]
    num(f'ledger S{i} cash', l['cash'], money_str(row[1]))
    num(f'ledger S{i} holdings', l['holdings'], money_str(row[2]))
    num(f'ledger S{i} equity', l['equity'], money_str(row[3]))
    num(f'ledger S{i} open positions', l['n'], int(row[4].split()[0]))
    num(f'ledger S{i} reserved', l['reserved'], money_str(row[6]))
    num(f'ledger S{i} available', l['available'], money_str(row[7]))
    for o in l['orders']:
        if i > 0:
            in_text(f'ledger S{i} order', f"{o['stock']} {o['qty']} @ {fmt(o['L'])}", row[5])
    if not l['orders']:
        struct(f'ledger S{i} no order', row[5].startswith('None'))
    # reconciliation
    num(f'ledger S{i} cash+holdings=equity', l['cash'] + l['holdings'], money_str(row[3]))
for i in range(1, 8):
    flows = sum(e[3] for e in R['events'] if e[0] == i)
    num(f'S{i} cash change = event flows', L[i]['cash'] - L[i - 1]['cash'], flows)
struct('ledger S3 Fir stale flag', '(Fir stale)' in lt['rows'][3][4] and any(m[0] == 'Fir' and m[3] for m in L[3]['marks']))

# event log table
ev = S[7]['tables'][0]
for (t, stock, reason, flow) in R['events']:
    rows = [r for r in ev['rows'] if int(r[0]) == t and r[1].startswith(stock)]
    struct(f'event row exists {stock} S{t}', len(rows) == 1, reason)
    if rows:
        num(f'event {stock} S{t} cash flow', flow, money_str(rows[0][2]))
for i, l in enumerate(L):
    rows = [r for r in ev['rows'] if int(r[0]) == i and r[1].startswith('Close marks')]
    struct(f'close-mark row S{i}', len(rows) == 1)
    marks = re.findall(r'(\w+) (\d+) × ([\d.]+)(?: \(stale\))? = ([\d,]+\.\d\d)', rows[0][1])
    struct(f'close-mark row S{i} covers holdings', [m[0] for m in marks] == [m[0] for m in l['marks']], str(marks))
    for (nm, qty, px, val), (snm, sq, smark, stale) in zip(marks, l['marks']):
        num(f'mark {nm} S{i} qty', int(qty), sq)
        num(f'mark {nm} S{i} price', money_str(px), smark)
        num(f'mark {nm} S{i} value', sq * smark, money_str(val))
for row in ev['rows']:
    m = re.search(r'stop \$([\d.]+), target \$([\d.]+)', row[1])
    if m:
        fill = money_str(re.search(r'@ \$([\d.]+)', row[1]).group(1))
        num(f'event stop {row[1][:12]}', fill - STOP, money_str(m.group(1)))
        num(f'event target {row[1][:12]}', fill + TARGET, money_str(m.group(2)))

# closed trades
ct = S[7]['tables'][2]
struct('closed-trade count', len(ct['rows']) == len(R['trades']) == 4)
for row, tr in zip(ct['rows'], R['trades']):
    struct(f'closed trade order {row[0]}', row[0] == tr['stock'])
    num(f'{row[0]} shares', tr['qty'], int(row[1]))
    m = re.match(r'S(-?\d+) @ ([\d.]+) → S(\d+) @ ([\d.]+)', norm(row[2]))
    num(f'{row[0]} entry session', tr['entry'], int(m.group(1)))
    num(f'{row[0]} fill', tr['fill'], money_str(m.group(2)))
    num(f'{row[0]} exit session', tr['exit_s'], int(m.group(3)))
    num(f'{row[0]} exit', tr['exit'], money_str(m.group(4)))
    num(f'{row[0]} 1R', tr['oneR'], money_str(row[4]))
    g, c_, n_ = [money_str(v) for v in row[5].split(' / ')]
    num(f'{row[0]} gross', tr['gross'], g)
    num(f'{row[0]} costs', 2 * FEE, c_)
    num(f'{row[0]} net', tr['net'], n_)
    num(f'{row[0]} net R (2dp)', F(q(tr['netR'])), money_str(row[6]))
reasons = [t['reason'] for t in R['trades']]
struct('exit reasons', reasons == ['time exit close', 'gap stop open', 'both: stop first', 'target'], str(reasons))

# open positions
ot = S[7]['tables'][3]
struct('open position count', len(ot['rows']) == len(R['open']) == 3)
for row, p in zip(ot['rows'], R['open']):
    struct(f'open order {row[0]}', row[0] == p['stock'])
    num(f'{row[0]} shares', p['qty'], int(row[1]))
    num(f'{row[0]} entry session', p['entry'], int(row[2].split()[0][1:]))
    num(f'{row[0]} fill', p['fill'], money_str(row[2].split('@')[1]))
    s_, t_ = [money_str(v) for v in row[3].split(' / ')]
    num(f'{row[0]} stop', p['stop'], s_)
    num(f'{row[0]} target', p['target'], t_)
    num(f'{row[0]} 1R', p['oneR'], money_str(row[4]))
    num(f'{row[0]} S7 close', p['mark'], money_str(row[5]))
    num(f'{row[0]} unrealized gross', p['qty'] * (p['mark'] - p['fill']), money_str(row[6]))

# ---------------------------------------------------------------- prose sessions 1-7
s6 = ' '.join(S[6]['paragraphs'])
s7 = ' '.join(S[7]['paragraphs'])
flows1 = [e for e in R['events'] if e[0] == 1]
for e in flows1:
    if e[3]:
        in_text(f'S6 p0 flow {e[1]}', fmt(-e[3], dollar=True), P(6, 0))
in_text('S6 p0 cash S1', fmt(L[1]['cash'], dollar=True), P(6, 0))
in_text('S6 p0 equity S1', fmt(L[1]['equity'], dollar=True), P(6, 0))
birch = [p for p in run(last=1)['open'] if p['stock'] == 'Birch'][0]
num('S6 p0 Birch 1% cap', ffloor(PART * bars['Birch'][1]['v']), 118)
in_text('S6 p0 Birch 1R', f"118 × $2 = ${fmt(birch['oneR'], 0)}", P(6, 0))
in_text('S6 p0 Birch planned 1R', f"${fmt(birch['ordered'] * STOP, 0)}", P(6, 0))
in_text('S6 p0 Cedar released', fmt(d0['orders'][2]['reserve'], dollar=True), P(6, 0))
d1 = R['decisions'][1]['orders'][0]
in_text('S6 p1 Dogwood notional basis', f"floor({fmt(NOTIONAL * L[1]['equity'])} ÷ {fmt(d1['L'])})", P(6, 1))
num('S6 p1 Dogwood qty', d1['qty'], 158)
hz = R['trades'][0]
in_text('S6 p1 Hazel net', f"+${fmt(hz['net'], 0)} net", P(6, 1))
in_text('S6 p1 Hazel R', f"{fmt(hz['netR'], sign=True)}R", P(6, 1))
d2 = R['decisions'][2]['orders'][0]
in_text('S6 p1 Cedar order', f"{d2['qty']}-share order at ${fmt(d2['L'])}", P(6, 1))
num('S6 p1 Cedar S1 high = D2 prior high', bars['Cedar'][1]['h'], screen[2][0]['h20'])
in_text('S6 p2 S3 equity', fmt(L[3]['equity'], dollar=True), P(6, 2))
expo = [q(F(100) * l['holdings'] / l['equity'], 1) for l in L]
in_text('S6 p2 exposure', f"{expo[3]}%", P(6, 2))
struct('S3 exposure is the maximum', expo[3] == max(expo))
d3 = R['decisions'][3]
struct('D3 Hazel eligible, no slot', [r['status'] for r in d3['recs']] == ['no slot'])

fir, bir, ald = R['trades'][1], R['trades'][2], R['trades'][3]
in_text('S7 p0 Fir price loss', f"{fmt(fir['gross'], 0, dollar=True)} of price", P(7, 0))
in_text('S7 p0 Fir net', f"{fmt(fir['net'], 0, dollar=True)} net", P(7, 0))
in_text('S7 p0 Fir R', f"{fmt(fir['netR'])}R", P(7, 0))
in_text('S7 p0 ordinary loss', f"${fmt(250 * STOP + 2 * FEE, 0)} cost-inclusive", P(7, 0))
in_text('S7 p0 Birch net', f"{fmt(bir['net'], 0, dollar=True)} net", P(7, 0))
in_text('S7 p0 Birch R', f"{fmt(bir['netR'])}R", P(7, 0))
alt_birch = 118 * TARGET - 2 * FEE
in_text('S7 p0 Birch target-first net', f"+${fmt(alt_birch, 0)}", P(7, 0))
in_text('S7 p0 Birch target-first R', f"{fmt(alt_birch / bir['oneR'], sign=True)}R", P(7, 0))
num('S7 p0 three R swing', q(alt_birch / bir['oneR'], 2) - q(bir['netR'], 2), 3)
num('S7 p0 three R swing exact', (alt_birch - bir['net']) / bir['oneR'], 3)
in_text('S7 p1 Alder net', f"+${fmt(ald['net'], 0)} net", P(7, 1))
in_text('S7 p1 Alder R', f"{fmt(ald['netR'], sign=True)}R", P(7, 1))
d6 = R['decisions'][6]['orders']
in_text('S7 p1 Elm qty', f"{d6[0]['qty']}-share order", P(7, 1))
struct('S7 p1 Elm earnings outside window', not (7 <= screen[6][0]['earn'] <= 16))
in_text('S7 p2 final equity', fmt(L[7]['equity'], dollar=True), P(7, 2))
chg = L[7]['equity'] - L[0]['equity']
in_text('S7 p2 change', fmt(chg, dollar=True), P(7, 2))
s0close = {p['stock']: p['mark'] for p in positions}
contrib = []
for tr in R['trades']:
    base = s0close.get(tr['stock'])
    contrib.append(tr['qty'] * (tr['exit'] - base) - FEE if base is not None and tr['entry'] < 0 else tr['net'])
for v in contrib:
    in_text('S7 p2 closed contribution', fmt(v, dollar=True).replace('$−', '−$') if v >= 0 else '−$' + fmt(-v), P(7, 2))
num('S7 p2 closed total', sum(contrib), F('214.00'))
unreal = sum(p['qty'] * (p['mark'] - p['fill']) for p in R['open'])
num('S7 p2 unrealized', unreal, F('532.72'))
num('S7 p2 open contribution', unreal - 3 * FEE, F('525.22'))
num('S7 p2 total', sum(contrib) + unreal - 3 * FEE, chg)
nfills = sum(1 for e in R['events'] if e[2].startswith('buy')) + len(R['trades'])
num('S7 p2 fills', nfills, 9)
num('S7 p2 fill cost', nfills * FEE, F('22.50'))
for v in ['$214.00', '$532.72', '$7.50', '$525.22', '$22.50', 'Nine fills']:
    in_text('S7 p2 literal', v, P(7, 2))

# sections 2, 8, 10
in_text('S2 p1 stop loss price', '$500 of price and $505', P(2, 1))
num('S2 p1 values', 250 * STOP + 2 * FEE, 505)
in_text('S8 p0 +0.74%', f"+{q(F(100) * chg / L[0]['equity'], 2)}%", P(8, 0))
in_text('S8 p0 exposure peak', f"{max(expo)}%", P(8, 0))
eq = [l['equity'] for l in L]
peak, mdd, pk_at = eq[0], F(0), None
for e in eq:
    peak = max(peak, e)
    if (peak - e) / peak > mdd:
        mdd, pk_at, tr_at = (peak - e) / peak, peak, e
in_text('S10 p0 drawdown peak', fmt(pk_at, dollar=True), P(10, 0))
in_text('S10 p0 drawdown trough', fmt(tr_at, dollar=True), P(10, 0))
in_text('S10 p0 drawdown pct', f"about {q(100 * mdd, 2)}%", P(10, 0))
struct('S10 drawdown below 8% trigger', mdd < F(8, 100))
in_text('S2 p2 five slots x 10% ~ half', 'about half of equity', P(2, 2), 'text')

# ---------------------------------------------------------------- figure
fig = C['figure']
eq_series = fig['panels'][0]['series'][0]['values']
for i, v in enumerate(eq_series):
    num(f'figure equity S{i}', L[i]['equity'], F(Decimal(str(v))))
ann = fig['panels'][0]['annotations']
for a, tr in zip(ann, R['trades']):
    num(f'figure annotation index {tr["stock"]}', a['index'], tr['exit_s'])
    in_text(f'figure annotation {tr["stock"]} net', f"${fmt(abs(tr['net']), 0)} net", a['label'])
    in_text(f'figure panel caption {tr["stock"]}', f"S{tr['exit_s']} {tr['stock']}", fig['panels'][0]['caption'], 'text')
    in_text(f'figure panel caption {tr["stock"]} net', ('+' if tr['net'] > 0 else '−') + f"${fmt(abs(tr['net']), 0)}", fig['panels'][0]['caption'])
pos_series, ord_series = [s['values'] for s in fig['panels'][1]['series']]
for i, l in enumerate(L):
    num(f'figure open positions S{i}', l['n'], pos_series[i])
    num(f'figure orders S{i}', len(l['orders']), ord_series[i])
    struct(f'slots <= 5 at S{i}', l['n'] + len(l['orders']) <= 5)
num('figure slot annotation index', fig['panels'][1]['annotations'][0]['index'], 3)
for i, v in enumerate(fig['panels'][2]['series'][0]['values']):
    num(f'figure exposure S{i}', F(expo[i]), F(Decimal(str(v))))
in_text('figure caption max exposure', f"never exceeds {max(expo)}%", fig['caption'])
struct('figure caption <1% move', abs(chg / L[0]['equity']) < F(1, 100) and 'less than 1%' in fig['caption'])
in_text('figure exposure annotation', f"{max(expo)}%", fig['panels'][2]['annotations'][0]['label'])
struct('figure annotation S3 5 of 5', L[3]['n'] == 5 and '5 of 5' in fig['panels'][1]['annotations'][0]['shortLabel'])
struct('figure fictional label', 'Fictional' in fig['caption'])
struct('figure afterSection 7 (inside continuation)', fig.get('afterSection') == 7)

# exposure-timing figure
xf = C['figures'][1]
idx, sw = xf['series'][0]['values'], xf['series'][1]['values']
for i in range(12):
    if i <= 3:
        exp = F(idx[i])
    elif i <= 7:
        exp = F(idx[3])
    else:
        exp = F(q(F(idx[3]) * F(idx[i]) / F(idx[7]), 2))
    num(f'switching path step {i}', exp, F(Decimal(str(sw[i]))))
num('switch cash level 101', idx[3], 101)
num('reentry index 92', idx[7], 92)
for v in ['107.59', '115.27', '120.76', '125.15']:
    in_text('evidence switching values', v, json.dumps(C['evidence'], ensure_ascii=False))
in_text('S9 p1 construction', '101 × index ÷ 92', P(9, 1), 'text')
struct('switching annotations at 3 and 7', [a['index'] for a in xf['annotations']] == [3, 7])
struct('switching figure fictional/separate', 'Separate fictional illustration' in xf['caption'])

# ---------------------------------------------------------------- exercise / solution
ex = C['exercise']
in_text('exercise cash', fmt(L[3]['cash'], dollar=True), ex)
for p in [x for x in run(last=3)['open']]:
    if p['stock'] == 'Fir':
        in_text('exercise Fir', f"Fir {p['qty']} shares (halted, last close ${fmt(p['mark'])}, stop ${fmt(p['stop'])})", ex)
    else:
        in_text(f'exercise {p["stock"]}', f"{p['stock']} {p['qty']} (stop ${fmt(p['stop'])}, target ${fmt(p['target'])})", ex)
sol = ' '.join(C['solution'])
in_text('solution Fir proceeds', f"250 × $33.10 − $2.50 = {fmt(-[e for e in R['events'] if e[0]==4][0][3]*-1, dollar=True)}", sol)
in_text('solution cash S4', f"$54,714.02 + $8,272.50 = {fmt(L[4]['cash'], dollar=True)}", sol)
for nm, qty, mk, _ in L[4]['marks']:
    in_text(f'solution S4 mark {nm}', f"{nm} {qty} × ${fmt(mk)} = {fmt(qty * mk, dollar=True)}", sol)
in_text('solution S4 holdings', f"totaling {fmt(L[4]['holdings'], dollar=True)}", sol)
in_text('solution S4 equity', f"{fmt(L[4]['equity'], dollar=True)}", sol)
for nm, b in (('Alder', bars['Alder'][4]), ('Birch', bars['Birch'][4]), ('Dogwood', bars['Dogwood'][4]), ('Cedar', bars['Cedar'][4])):
    in_text(f'solution S4 {nm} range', f"{nm} (low ${fmt(b['l'])}, high ${fmt(b['h'])})", sol)
struct('solution D4 four positions one slot', L[4]['n'] == 4 and 'four positions and one free slot' in sol)
in_text('solution Fir gross', f"= {fmt(fir['gross'], dollar=True)}", sol)
in_text('solution Fir net', f"net = {fmt(fir['net'], dollar=True)}", sol)
in_text('solution Fir R', f"−730 ÷ 500 = {fmt(fir['netR'])}R", sol)
in_text('solution Birch proceeds', f"118 × $70.20 − $2.50 = {fmt([e[3] for e in R['events'] if e[0] == 5 and e[1] == 'Birch'][0], dollar=True)}", sol)
in_text('solution cash S5', f"cash = {fmt(L[5]['cash'], dollar=True)}", sol)
for nm, qty, mk, _ in L[5]['marks']:
    in_text(f'solution S5 mark {nm}', f"{nm} {fmt(qty * mk, dollar=True)}", sol)
in_text('solution S5 holdings', f"totaling {fmt(L[5]['holdings'], dollar=True)}", sol)
in_text('solution S5 equity', f"equity = {fmt(L[5]['equity'], dollar=True)}", sol)
in_text('solution Birch gross', f"= {fmt(bir['gross'], dollar=True)}", sol)
in_text('solution Birch net', f"net = {fmt(bir['net'], dollar=True)}", sol)
in_text('solution Birch R', f"net R = {fmt(bir['netR'])}R", sol)
in_text('solution wrong denominator', f"${fmt(138 * STOP, 0)} denominator", sol)
struct('solution D5 three positions two slots', L[5]['n'] == 3 and 'three positions and two free slots' in sol)
struct('solution D5 Ginkgo incomplete', [r['status'] for r in R['decisions'][5]['recs']] == ['incomplete'])

# ---------------------------------------------------------------- practice
base_rules = {'risk': RISK, 'notional': NOTIONAL, 'markup': MARKUP}
alt = decide(0, cash0, positions, base_rules, rank_key=lambda r: r['adv'])
p1 = ' '.join(C['practice'][0]['solution'])
struct('practice1 rank order', [r['stock'] for r in sorted([r for r in alt['recs'] if 'rank' in r], key=lambda r: r['rank'])] == ['Dogwood', 'Alder', 'Cedar', 'Birch'])
struct('practice1 order set', [o['stock'] for o in alt['orders']] == ['Dogwood', 'Alder', 'Cedar'])
dg = alt['orders'][0]
ar = [r for r in alt['recs'] if r['stock'] == 'Dogwood'][0]
in_text('practice1 Dogwood notional', f"floor(10,000 ÷ 61.81) = {ar['notional']}", p1)
in_text('practice1 Dogwood cash', f"{ar['cash']:,} for cash", p1)
in_text('practice1 Dogwood reserve', f"= {fmt(dg['reserve'], dollar=True)}", p1)
in_text('practice1 cash before Alder', fmt(cash0 - dg['reserve'], dollar=True), p1)
num('practice1 Alder qty', alt['orders'][1]['qty'], 250)
num('practice1 Alder reserve', alt['orders'][1]['reserve'], F('8070.00'))
num('practice1 Cedar qty', alt['orders'][2]['qty'], 242)
in_text('practice1 total', fmt(alt['reserved'], dollar=True), p1)
in_text('practice1 left', fmt(cash0 - alt['reserved'], dollar=True), p1)
in_text('evidence practice1 total', fmt(alt['reserved'], dollar=True), C['evidence'][1]['summary'])

agg = decide(0, cash0, positions, {'risk': F(2, 100), 'notional': F(40, 100), 'markup': MARKUP})
p2 = ' '.join(C['practice'][1]['solution'])
a_ = {r['stock']: r for r in agg['recs']}
in_text('practice2 risk', f"floor(2,000 ÷ 2) = {a_['Alder']['risk']:,}", p2)
in_text('practice2 Alder notional', f"floor(40,000 ÷ 32.27) = {a_['Alder']['notional']:,}", p2)
in_text('practice2 Alder cash', f"cash {a_['Alder']['cash']:,}", p2)
in_text('practice2 Alder reserve', fmt(a_['Alder']['reserve'], dollar=True), p2)
in_text('practice2 Birch notional', f"floor(40,000 ÷ 72.46) = {a_['Birch']['notional']}", p2)
in_text('practice2 Birch cash', f"floor((49,057.50 − 2.50) ÷ 72.46) = {a_['Birch']['cash']}", p2)
num('practice2 cash before Birch', cash0 - a_['Alder']['reserve'], F('49057.50'))
in_text('practice2 Birch reserve', fmt(a_['Birch']['reserve'], dollar=True), p2)
rem = cash0 - a_['Alder']['reserve'] - a_['Birch']['reserve']
in_text('practice2 remaining', fmt(rem, dollar=True), p2)
in_text('practice2 Cedar cash', f"= {a_['Cedar']['cash']} shares", p2)
in_text('practice2 Cedar notional', f"notional ({a_['Cedar']['notional']})", p2)
in_text('practice2 Cedar reserve', fmt(a_['Cedar']['reserve'], dollar=True), p2)
in_text('practice2 leftover', fmt(cash0 - agg['reserved'], dollar=True), p2)
struct('practice2 binding', a_['Alder']['qty'] == a_['Alder']['risk'] and a_['Birch']['qty'] == a_['Birch']['notional'] and a_['Cedar']['qty'] == a_['Cedar']['cash'])
num('practice2 Alder 1R = 2% E', a_['Alder']['qty'] * STOP, F(2, 100) * 100000)
unreserved = sum(min(a_[n]['risk'], a_[n]['notional'], ffloor((cash0 - FEE) / a_[n]['L'])) * a_[n]['L'] + FEE for n in ('Alder', 'Birch', 'Cedar'))
struct('practice2 without reservations exceeds cash', unreserved > cash0, str(float(unreserved)))
p3 = ' '.join(C['practice'][2]['solution']) + C['practice'][2]['question']
in_text('practice3 Dogwood S1 open', fmt(bars['Dogwood'][1]['o'], dollar=True), p3)
in_text('practice3 $1.40 cheaper', f"${fmt(bars['Dogwood'][2]['o'] - bars['Dogwood'][1]['o'])} per share", p3)
in_text('practice3 v1 order', f"{d1['qty']} shares at a ${fmt(d1['L'])} limit", p3)

# ---------------------------------------------------------------- quiz
qz = C['quiz']
struct('quiz answer index valid', 0 <= qz['answer'] < len(qz['options']) and len(qz['feedback']) == len(qz['options']))
struct('quiz answer is option B', qz['answer'] == 1 and fmt(bir['net'], 0, dollar=True) in qz['options'][1] and f"{fmt(bir['netR'])}R" in qz['options'][1])
in_text('quiz A', f"+${fmt(alt_birch, 0)}, or {fmt(alt_birch / 236, sign=True)}R", qz['options'][0])
in_text('quiz C', f"{fmt(bir['net'] / 276)}R", qz['options'][2])
in_text('quiz feedback B', f"118 × (−$2) − $5 = {fmt(bir['net'], 0, dollar=True)}", qz['feedback'][1])
in_text('quiz feedback B 1R', f"${fmt(bir['oneR'], 0)}", qz['feedback'][1])
in_text('quiz stem bar', 'O $72.90 / H $76.60 / L $70.00 / C $71.20', qz['question'], 'text')
struct('quiz stem bar = grid', (bars['Birch'][5]['o'], bars['Birch'][5]['h'], bars['Birch'][5]['l'], bars['Birch'][5]['c']) == (F('72.90'), F('76.60'), F('70.00'), F('71.20')))

# ---------------------------------------------------------------- evidence summaries
evs = json.dumps(C['evidence'], ensure_ascii=False)
for v in [fmt(d0['reserved'], dollar=True), '219 shares', fmt(cash0 - agg['reserved'], dollar=True), f"+1.14 ({q(hz['netR'], 4)})",
          f"−1.02 ({fmt(bir['netR'], 4)})", f"E7 − E0 = {fmt(chg, dollar=True)}", '+$467, +1.98R']:
    in_text('evidence summary', v, evs)

# ---------------------------------------------------------------- attempt packet replay (packet tables only)
pk = C['learnerAttempt']
struct('packet has 6 tables', len(pk['tables']) == 6)
for i in range(3):
    struct(f'packet rule table {i + 1} identical to section {i + 1}', pk['tables'][i + 1] == S[i + 1]['tables'][0])
st = pk['tables'][0]
pcash = money_str(re.search(r'Cash is \$([\d,.]+)', pk['paragraphs'][0]).group(1))
num('packet cash = S3 ledger', pcash, L[3]['cash'])
hold = []
for row in st['rows']:
    es, fill = row[2].split(' / ')
    stop, target = [money_str(v) for v in row[3].split(' / ')]
    h = {'stock': row[0], 'qty': int(row[1]), 'entry': int(norm(es)[1:]), 'fill': money_str(fill), 'stop': stop, 'target': target,
         'oneR': money_str(row[4]), 'mark': money_str(row[5].split()[0])}
    num(f'packet {row[0]} stop', h['fill'] - STOP, stop)
    num(f'packet {row[0]} target', h['fill'] + TARGET, target)
    num(f'packet {row[0]} 1R', h['qty'] * STOP, h['oneR'])
    ref = [m for m in L[3]['marks'] if m[0] == row[0]][0]
    num(f'packet {row[0]} qty = reference', h['qty'], ref[1])
    num(f'packet {row[0]} mark = reference', h['mark'], ref[2])
    hold.append(h)
num('packet S3 equity', pcash + sum(h['qty'] * h['mark'] for h in hold), L[3]['equity'])
bt = pk['tables'][4]
pbars = {}
for row in bt['rows']:
    t = int(row[0][1:])
    for nm, cell in zip(bt['columns'][1:], row[1:]):
        if cell.startswith('Not supplied'):
            pbars.setdefault(nm, {})[t] = 'missing'
            continue
        o, h_, l_, c_ = [money_str(v) for v in cell.split('/')]
        pbars.setdefault(nm, {})[t] = {'o': o, 'h': h_, 'l': l_, 'c': c_}
        struct(f'packet bar {nm} S{t} = main grid', (o, h_, l_, c_) == tuple(bars[nm][t][k] for k in 'ohlc'))
cash = pcash
out = []
for t in (4, 5):
    for h in list(hold):
        b = pbars[h['stock']][t]
        struct(f'packet replay needs {h["stock"]} S{t}', b != 'missing')
        n = t - h['entry'] + 1
        px = None
        if b['o'] <= h['stop']:
            px = b['o']
        elif b['o'] >= h['target']:
            px = b['o']
        elif b['l'] <= h['stop']:
            px = h['stop']
        elif b['h'] > h['target']:
            px = h['target']
        elif n == 10:
            px = b['c']
        if px is not None:
            cash += h['qty'] * px - FEE
            out.append((h['stock'], h['qty'] * (px - h['fill']) - 2 * FEE, (h['qty'] * (px - h['fill']) - 2 * FEE) / h['oneR']))
            hold.remove(h)
        else:
            h['mark'] = b['c']
    num(f'packet replay S{t} cash', cash, L[t]['cash'])
    num(f'packet replay S{t} equity', cash + sum(h['qty'] * h['mark'] for h in hold), L[t]['equity'])
    num(f'packet replay S{t} positions', len(hold), L[t]['n'])
num('packet replay Fir net', out[0][1], fir['net'])
num('packet replay Birch net', out[1][1], bir['net'])
num('packet replay Birch R', out[1][2], bir['netR'])
pks = json.dumps(pk, ensure_ascii=False)
for leak in [fmt(L[4]['cash']), fmt(L[5]['cash']), fmt(L[4]['equity']), fmt(L[5]['equity']), fmt(L[4]['holdings']), fmt(L[5]['holdings']),
             '−730', '−241', '−1.46', '−1.02', '8,272.50', '8,281.10', 'stop assumed first’']:
    struct(f'packet does not expose result {leak}', leak not in pks)
struct('packet D4 row: no signal', pk['tables'][5]['rows'][0][1].startswith('No non-held'))
struct('packet D5 Ginkgo = screen log', pk['tables'][5]['rows'][1][1] == 'Ginkgo / 25.40' and pk['tables'][5]['rows'][1][2] == '25.00')
# ---------------------------------------------------------------- packet placement (revision of 2026-10-12)
struct('packet afterSection = 6', pk.get('afterSection') == 6, str(pk.get('afterSection')))
cut = pk.get('afterSection', -1)
in_text('S6 p3 leads into worksheet', 'The worksheet below starts from this session-3 state', P(6, 3), 'text')
figs = [C['figure']] + C['figures']
for k, fg in enumerate(figs):
    after = fg.get('afterSection', 0)
    struct(f'figure {k} placement', (after <= cut) == (fg.get('kind') == 'flow'), f"afterSection {after}")
prelude = {'subtitle': C['subtitle'], 'takeaway': C['takeaway'], 'outcomes': json.dumps(C['outcomes'], ensure_ascii=False),
           'figures': json.dumps([fg for fg in figs if fg.get('afterSection', 0) <= cut], ensure_ascii=False)}
for i in range(cut + 1):
    prelude[f'sections[{i}]'] = json.dumps(S[i], ensure_ascii=False)
outcome_tokens = []
for t in range(4, 8):
    outcome_tokens += [fmt(L[t]['cash']), fmt(L[t]['equity']), fmt(L[t]['holdings']), f"{expo[t]}%"]
outcome_tokens += [fmt(L[6]['reserved']), fmt(L[6]['available'])]
for tr in R['trades'][1:]:
    outcome_tokens += [fmt(tr['net'], 0, dollar=True), fmt(tr['net']), f"{fmt(tr['netR'], sign=tr['netR'] > 0)}R"]
outcome_tokens += [f"+${fmt(alt_birch, 0)}", fmt(chg), f"{q(F(100) * chg / L[0]['equity'], 2)}%", f"{q(100 * mdd, 2)}%",
                   '8,272.50', '8,281.10', '9,022.50', '9,931.30', 'Fir reopens', 'Fir exit', 'Birch exit', 'Alder exit',
                   'Elm buy', 'Elm 168', 'highest exposure in the scenario', 'a gap, an ambiguous bar']
for name, text in prelude.items():
    for tok in outcome_tokens:
        struct(f'prelude {name} hides S4+ result {tok}', tok not in text)
struct('prelude has no S4-S7 section', all('Sessions 4' not in S[i]['title'] for i in range(cut + 1)))
in_text('S6 p2 exposure so far', 'the highest exposure so far', P(6, 2), 'text')
struct('S3 exposure is max through S3', expo[3] == max(expo[:4]))

# ---------------------------------------------------------------- revised wording (2026-10-12)
in_text('S0 p1 Chapter 24 reference', 'Chapter 24 tested a twenty-session breakout signal one trade at a time', P(0, 1), 'text')
struct('S0 p1 no stale earlier-chapters claim', 'Earlier chapters described' not in P(0, 1))
in_text('S0 p2 reproduce by hand', 'reproduce every number by hand from this chapter’s tables', P(0, 2), 'text')
in_text('S3 p2 halt decision', 'securities exchanges, not the SEC, decide whether to impose it', P(3, 2), 'text')
in_text('S3 p2 primary market honored', 'other U.S. markets honor a halt imposed by the security’s primary market', P(3, 2), 'text')

# ---------------------------------------------------------------- Alder S6 bar and screen-log completeness
ab = bars['Alder'][6]
for k, v in zip('ohlc', ['35.50', '36.40', '35.20', '35.50']):
    num(f'Alder S6 {k} (revised bar)', ab[k], F(Decimal(v)))
num('Alder S6 target exit unchanged', R['trades'][3]['exit'], F('36.10'))
num('Alder S6 exit session unchanged', R['trades'][3]['exit_s'], 6)
# Derive every determinable signal for unheld stocks: pre-S0 highs are bounded by the D0 prior-20 high.
d0_h20 = {r['stock']: r['h20'] for r in screen[0]}  # highest high of sessions -20..-1
unlisted = []
determinable = 0
for i, l in enumerate(L):
    if i == 0:
        continue
    held_at_close = {m[0] for m in l['marks']}
    listed = {r['stock'] for r in screen.get(i, [])}
    for nm in d0_h20:
        if nm in held_at_close or nm in listed:
            continue
        b = bars[nm].get(i)
        if not b or any(k not in bars[nm] or bars[nm][k] is None for k in range(0, i)):
            continue  # close or some window bar not supplied: undetermined
        determinable += 1
        upper = max([d0_h20[nm]] + [bars[nm][k]['h'] for k in range(0, i)])
        if b['c'] > upper:
            unlisted.append(f"{nm} D{i}: close {fmt(b['c'])} > prior-20 high {fmt(upper)}")
        struct(f'no unlisted signal {nm} D{i}', b['c'] <= upper, f"close {fmt(b['c'])} > {fmt(upper)}")
struct('Alder D6 determinable and below prior-20 high 35.60',
       ab['c'] <= max([d0_h20['Alder']] + [bars['Alder'][k]['h'] for k in range(6)]) == F('35.60'))
FINDINGS.append(f"Screen-log completeness: {determinable} determinable unheld stock/decision-close pairs checked; "
                f"unlisted signals: {unlisted or 'none'}.")

# ---------------------------------------------------------------- section 8 conventions (revised text)
s8 = P(8, 0)
struct('S8 p0 old one-direction claim removed', 'less favorable than a looser reading' not in s8)
in_text('S8 p0 stop-first vs target-first', f"{fmt(bir['net'], 0, dollar=True)} instead of +${fmt(alt_birch, 0)}", s8)
tf = run(stop_first=False)
struct('target-first counterfactual raises final equity', tf['ledger'][7]['equity'] > L[7]['equity'])
nocap = run(part_cap=False)
nb = nocap['trades'][2]
struct('no-cap counterfactual Birch is the same trade', nb['stock'] == 'Birch' and nb['exit'] == bir['exit'])
in_text('S8 p0 cap shares', f"from {nb['qty']} to {bir['qty']} shares", s8)
in_text('S8 p0 cap reduced loss', f"reduced its loss by ${fmt(bir['net'] - nb['net'], 0)}", s8)
num('cap loss reduction = 20 shares x $2', bir['net'] - nb['net'], (nb['qty'] - bir['qty']) * STOP)
in_text('S8 p0 Cedar touch price', f"kept Cedar out at ${fmt(d0['orders'][2]['L'])}", s8)
touch1 = run(touch_fills=True, last=1)
struct('touch counterfactual: Cedar filled at S1', any(p['stock'] == 'Cedar' and p['fill'] == F('41.20') for p in touch1['open']))
struct('touch counterfactual: Dogwood has no slot at D1',
       [r['status'] for r in touch1['decisions'][1]['recs'] if r['stock'] == 'Dogwood'] == ['no slot'])
touch3 = run(touch_fills=True, last=3)
struct('touch counterfactual: Hazel receives a D3 order', [o['stock'] for o in touch3['decisions'][3]['orders']] == ['Hazel'])
try:
    run(touch_fills=True)
    priced = True
except MissingBar:
    priced = False
struct('touch counterfactual not priceable from supplied bars', not priced)
in_text('S8 p0 not priceable', 'the supplied bars cannot price that alternative path', s8, 'text')
FINDINGS.append(f"Counterfactuals (informational): no cap -> final equity {fmt(nocap['ledger'][7]['equity'])} "
                f"({fmt(nocap['ledger'][7]['equity'] - L[7]['equity'])}; Cedar D2 order {nocap['decisions'][2]['orders'][0]['qty']}); "
                f"target-first -> {fmt(tf['ledger'][7]['equity'])} (+{fmt(tf['ledger'][7]['equity'] - L[7]['equity'])}); "
                f"touch-fill -> not priceable (Hazel S4 bar absent).")

# ---------------------------------------------------------------- report
print('Chapter 26 system-design independent reproduction')
print(f"  numeric comparisons:    {COUNTS['numeric']}")
print(f"  text comparisons:       {COUNTS['text']}")
print(f"  structural comparisons: {COUNTS['structural']}")
print(f"  total:                  {sum(COUNTS.values())}")
print(f"  mismatches:             {len(MISMATCHES)}")
for m in MISMATCHES:
    print('   -', m)
print('INFORMATIONAL (rule-derived checks / counterfactuals):')
for f_ in FINDINGS:
    print('   *', f_)
sys.exit(1 if MISMATCHES else 0)
