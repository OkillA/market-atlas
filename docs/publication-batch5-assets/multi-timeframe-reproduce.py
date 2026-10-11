#!/usr/bin/env python3
"""Independent arithmetic/timing check for Chapter 17 `multi-timeframe`.

Run from the repository root:
    python3 -I docs/publication-batch5-assets/multi-timeframe-reproduce.py
Reads the compiled chapter (docs/publication-batch5-assets/compiled/multi-timeframe.json) and,
for location cross-checks, content/indicators-context.json. Uses Fractions.
Convention under test: values are sampled after each daily close; a five-session
week's close is known only after its fifth session closes.
"""
import json
import re
import sys
from fractions import Fraction as F
from pathlib import Path

COMPILED = Path('docs/publication-batch5-assets/compiled/multi-timeframe.json')
AUTHORING = Path('content/indicators-context.json')

ch = json.loads(COMPILED.read_text())
count = 0
failures = []


def check(label, got, want):
    global count
    count += 1
    if got != want:
        failures.append(f'{label}: got {got!r}, want {want!r}')


def dollars(text):
    return [F(m.replace(',', '')) for m in re.findall(r'\$(\d[\d,]*(?:\.\d+)?)', text)]


def sec(i):
    return ch['sections'][i]


# ---------------------------------------------------------------- inputs
s2 = sec(1)['paragraphs'][1]
closes_txt = s2.split('The main 15 daily closes are ')[1].split('. Group')[0]
daily = dollars(closes_txt)
check('15 daily closes parsed', len(daily), 15)
prior_txt = s2.split('before the display, are ')[1]
prior = dollars(prior_txt)[:2]
check('prior completed weekly closes', prior, [F(98), F(99)])

WEEK = 5
weeks = [daily[i:i + WEEK] for i in range(0, 15, WEEK)]
weekly_close = [w[-1] for w in weeks]                   # last eligible close
completion_session = [WEEK * (k + 1) for k in range(3)]  # 1-based session numbers
check('weekly closes stated in prose', dollars(s2.split('Their closes are ')[1].split('.')[0]), weekly_close)
check('weekly closes values', weekly_close, [F(105), F(103), F(110)])

completed = prior[:]          # chronological list of completed weekly closes
last_completed, prev_completed, developing, state = {}, {}, {}, {}
for s in range(1, 16):
    k = (s - 1) // WEEK
    developing[s] = daily[s - 1]                         # close-only: developing weekly close = latest daily close
    if s == completion_session[k]:
        completed.append(weekly_close[k])                # final only after its last session closes
    last_completed[s] = completed[-1]
    prev_completed[s] = completed[-2]
    state[s] = 'Up' if completed[-1] > completed[-2] else 'Down'   # "down-or-equal"; no equality occurs
check('no equal completed-week pair (down-or-equal never needed)',
      any(last_completed[s] == prev_completed[s] for s in range(1, 16)), False)

# Timing-leak guard: no session before a completion may hold that week's close.
for k, cs in enumerate(completion_session):
    for s in range(cs - WEEK + 1, cs):
        check(f'no leak: session {s} does not know week {k+1} close', last_completed[s] == weekly_close[k] and weekly_close[k] not in completed[:len(prior) + k], False)

# ---------------------------------------------------------------- table
tbl = sec(1)['tables'][0]
check('table row count', len(tbl['rows']), 15)
for row in tbl['rows']:
    s = row[0]
    check(f'table s{s} daily close', F(row[1]), daily[s - 1])
    check(f'table s{s} last completed weekly close', F(row[2]), last_completed[s])
    check(f'table s{s} state', row[3], state[s])

# ---------------------------------------------------------------- section 3
p = sec(2)['paragraphs']
check('s3 pair before session 5', dollars(p[1].split('Before session 5, the known weekly pair is ')[1])[:2], [prev_completed[4], last_completed[4]])
check('s3 pair before 5 up', state[4], 'Up')
check('s3 pair after 5', dollars(p[1].split('After 5, it is ')[1])[:2], [prev_completed[5], last_completed[5]])
check('s3 pair after 5 up', state[5], 'Up')
check('s3 sessions 7-9 path', dollars(p[1].split('falls from ')[1])[:3], [daily[6], daily[7], daily[8]])
check('s3 last completed during 8,9', [last_completed[8], last_completed[9]], [F(105), F(105)])
check('s3 session-10 finish/prior', dollars(p[2].split('finishes at ')[1])[:2], [weekly_close[1], weekly_close[0]])
check('s3 context down at 10', state[10], 'Down')
check('s3 session 11 rise', dollars(p[2].split('Session 11 rises ')[1])[:2], [daily[9], daily[10]])
check('s3 session 11 daily up', daily[10] > daily[9], True)
check('s3 session 15 completion', dollars(p[2].split('At session 15, the ')[1])[0], last_completed[15])
check('s3 up at 15', state[15], 'Up')

# ---------------------------------------------------------------- section 4
p = sec(3)['paragraphs'][1]
weekday = {1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday'}
for s, day in [(7, 'Tuesday'), (8, 'Wednesday'), (10, 'Friday')]:
    check(f's4 weekday of session {s}', weekday[(s - 1) % WEEK + 1], day)
    m = re.search(rf'{day} session {s} closes \$(\d+)', p)
    check(f's4 session {s} close', F(m.group(1)), daily[s - 1])
check('s4 developing at Wednesday (s8)', dollars(p.split('current developing weekly close is ')[1])[0], developing[8])
check('s4 eventual finish', dollars(p.split('but the eventual ')[1])[0], weekly_close[1])
check('s4 last completed at s8', dollars(p.split('The last completed weekly close is also ')[1])[0], last_completed[8])
check('s4 values equal but different week', developing[8] == last_completed[8], True)

# ---------------------------------------------------------------- section 5
p = sec(4)['paragraphs']
spans = re.findall(r'\$(\d+) after (?:sessions )?(\d+)(?:–(\d+))?', p[0])
check('s5 four confirmed spans', len(spans), 4)
for v, a, b in spans:
    for s in range(int(a), int(b or a) + 1):
        check(f's5 confirmed value at {s}', last_completed[s], F(v))
check('s5 before session-5 close still 99', last_completed[4], F(99))
for s in range(1, 16):
    check(f's5 developing equals daily close at {s}', developing[s], daily[s - 1])
check('s5 session 9 developing != session 10 final', developing[9] != weekly_close[1], True)
fields = p[2].split('At session 11 they are ')[1]
check('s5 three-field note pair', dollars(fields)[:2], [last_completed[11], prev_completed[11]])
check('s5 three-field note daily', dollars(fields)[2:4], [daily[10], daily[9]])
check('s5 "completed week 2"', (completion_session.index(10) + 1), 2)


# ---------------------------------------------------------------- section 6
def relation(s):
    d_up = daily[s - 1] > daily[s - 2]
    if not d_up:
        return 'not-upward'
    return 'aligned' if state[s] == 'Up' else 'conflict'


p = sec(5)['paragraphs']
check('s6 session 6 daily', dollars(p[0].split('After session 6 closes, daily price rises ')[1])[:2], [daily[4], daily[5]])
check('s6 session 6 pair', dollars(p[0].split('completed weekly pair ')[1])[:2], [prev_completed[6], last_completed[6]])
check('s6 session 6 aligned', relation(6), 'aligned')
check('s6 session 11 daily', dollars(p[0].split('After session 11 closes, daily price rises ')[1])[:2], [daily[9], daily[10]])
check('s6 session 11 pair', dollars(p[0].split('while completed weekly pair ')[1])[:2], [prev_completed[11], last_completed[11]])
check('s6 session 11 conflict', relation(11), 'conflict')
eligible = [s for s in range(2, 16) if relation(s) == 'aligned']
check('s6 filter: 6 eligible', 6 in eligible, True)
check('s6 filter: 11 not eligible', 11 in eligible, False)
# Full enumeration (informational): which upward daily changes are aligned/conflicting
check('aligned upward sessions', eligible, [2, 4, 5, 6, 7, 15])
check('conflicting upward sessions', [s for s in range(2, 16) if relation(s) == 'conflict'], [11, 12, 13])
check('opposite-direction (daily down, weekly up) sessions', [s for s in range(2, 16) if daily[s-1] < daily[s-2] and state[s] == 'Up'], [3, 8, 9])

# ---------------------------------------------------------------- example
ex = ch['example']['text']
check('example s11/s10 closes', dollars(ex)[:2], [daily[10], daily[9]])
check('example pair', dollars(ex)[2:4], [prev_completed[11], last_completed[11]])
check('example final week-3 close', dollars(ex)[4], weekly_close[2])
check('example week-3 completion session', completion_session[2], 15)

# ---------------------------------------------------------------- exercise / solution
sol = ch['solution'][0]
for s, v in re.findall(r'(\d+): \$(\d+)', sol.replace('After 4', '4')):
    check(f'solution last completed at {s}', last_completed[int(s)], F(v))
check('solution covers asked sessions', sorted(int(s) for s, _ in re.findall(r'(\d+): \$(\d+)', sol.replace('After 4', '4'))), [4, 5, 9, 10, 14, 15])
sol2 = ch['solution'][1]
check('solution 2 daily', dollars(sol2)[:0] or [F(x) for x in re.findall(r'rises (\d+)→(\d+)', sol2)[0]], [daily[9], daily[10]])
check('solution 2 weekly', [F(x) for x in re.findall(r'fell (\d+)→(\d+)', sol2)[0]], [prev_completed[11], last_completed[11]])
check('solution 2 conflict', relation(11), 'conflict')
check('solution 2 eventual', dollars(sol2)[0], weekly_close[2])

# ---------------------------------------------------------------- quiz
q = ch['quiz']
check('quiz zero-based answer -> option', dollars(q['options'][q['answer']])[0], last_completed[9])
check('quiz option 1 = session-9 daily close', dollars(q['options'][1])[0], daily[8])
check('quiz option 1 = session-9 developing close', dollars(q['options'][1])[0], developing[9])
check('quiz option 2 = session-10 weekly finish', dollars(q['options'][2])[0], weekly_close[1])
check('quiz option 2 not known at 9', dollars(q['options'][2])[0] == last_completed[9], False)
check('quiz feedback count', len(q['feedback']), len(q['options']))
check('quiz explanation equals feedback[answer]', q['explanation'], q['feedback'][q['answer']])

# ---------------------------------------------------------------- figure (step chart)
fig = ch['figure']
check('figure series0 = daily', [F(v) for v in fig['series'][0]['values']], daily)
check('figure series1 = last completed', [F(v) for v in fig['series'][1]['values']], [last_completed[s] for s in range(1, 16)])
check('figure series1 style step', fig['series'][1]['style'], 'step')
check('figure xStart', fig['xStart'], 1)
changes = [s for s in range(2, 16) if last_completed[s] != last_completed[s - 1]]
check('step changes only at completions (s2..15)', changes, [5, 10, 15])
check('step value at s1 is prior 99 (no leak of 105)', last_completed[1], F(99))
cap_sessions = [int(x) for x in re.findall(r'\d+', fig['caption'].split('changes only at sessions ')[1].split(', to')[0])]
check('caption completion sessions', cap_sessions, completion_session)
check('caption completed and prior closes', dollars(fig['caption']), list(weekly_close) + list(prior))  # batch 5 caption lists all three completions
for k, a in enumerate(fig['annotations']):
    s = a['index'] + fig['xStart']
    check(f'annotation {k} session', s, completion_session[k])
    check(f'annotation {k} value on series', F(fig['series'][a['seriesIndex']]['values'][a['index']]), weekly_close[k])
    check(f'annotation {k} label value', dollars(a['label'])[0], weekly_close[k])
    check(f'annotation {k} shortLabel value', F(a['shortLabel'].split(': ')[-1]), weekly_close[k])
    check(f'annotation {k} week number', int(re.search(r'Week (\d)', a['label']).group(1)), k + 1)
    check(f'annotation {k} shortLabel <= 18 chars', len(a['shortLabel']) <= 18, True)

# ---------------------------------------------------------------- flow figure
flow = ch['figures'][0]['steps']
for k, st in enumerate(flow):
    s = completion_session[k]
    check(f'flow {k} title session', int(re.search(r'session (\d+)', st['title']).group(1)), s)
    a, b, direction = re.search(r'pair (\d+)→(\d+): (\w+)', st['text']).groups()
    check(f'flow {k} pair', [F(a), F(b)], [prev_completed[s], last_completed[s]])
    check(f'flow {k} direction', direction, state[s].lower())
check('flow step 2 session-11 conflict', relation(11), 'conflict')

# ---------------------------------------------------------------- guided practice
g = ch['practice'][0]['solution']
check('guided current/prior', dollars(g[0])[:2], [daily[7], daily[6]])
check('guided change', F(re.search(r'daily change is −\$(\d+)', g[0]).group(1)) * -1, daily[7] - daily[6])
check('guided pair', dollars(g[0])[3:5], [prev_completed[8], last_completed[8]])
check('guided up', state[8], 'Up')
check('guided developing equals prior completed', dollars(g[1])[0], developing[8])
check('guided developing == last completed', developing[8], last_completed[8])

# ---------------------------------------------------------------- independent practice
ind = ch['practice'][1]
qtxt = ind['question']
pr2 = dollars(qtxt.split('Prior completed weekly closes are ')[1])[:2]
d2 = dollars(qtxt.split('Sessions 1–5 close ')[1].split('At session 8')[0])
check('fresh inputs count', (len(pr2), len(d2)), (2, 10))
wk2 = [d2[4], d2[9]]
comp2 = pr2[:]
lc2, pc2 = {}, {}
for s in range(1, 11):
    if s in (5, 10):
        comp2.append(d2[s - 1])
    lc2[s], pc2[s] = comp2[-1], comp2[-2]
check('fresh second-week close stated in question', dollars(qtxt.split('second displayed week’s ')[1])[0], wk2[1])
sol = ind['solution']
check('fresh daily move', [F(x) for x in re.search(r'(\d+) − (\d+) = −\$(\d+)', sol[0]).groups()], [d2[7], d2[6], d2[6] - d2[7]])
check('fresh pair', dollars(sol[0])[1:3], [pc2[8], lc2[8]])
check('fresh pair up', lc2[8] > pc2[8], True)
check('fresh developing at 8', dollars(sol[0])[3], d2[7])
check('fresh $51 known only after 10', [s for s in range(1, 11) if lc2[s] == wk2[1] and (s == 10 or lc2[s - 1] != wk2[1])], [10])
check('fresh latest completed at 6-9', [lc2[s] for s in range(6, 10)], [dollars(sol[1])[1]] * 4)
check('fresh daily retreat at 8', d2[7] < d2[6], True)

# ---------------------------------------------------------------- authoring/compiled identity
src = next(c for c in json.loads(AUTHORING.read_text())['chapters'] if c['id'] == 'multi-timeframe')
for key in src:
    if key == 'minutes':
        continue
    check(f'compiled matches authoring: {key}', ch[key], src[key])

print(f'comparisons: {count}; failures: {len(failures)}')
for f_ in failures:
    print('  MISMATCH', f_)
sys.exit(1 if failures else 0)
