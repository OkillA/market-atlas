#!/usr/bin/env python3
"""Independent exact arithmetic for Chapters 22–23 and the three Part 5 tasks.
Run before rebuilding with --authoring; run after extract.cjs without that flag.
The numeric calculations use Fraction/Decimal, separately from the JS verifiers.
"""
import json, re, sys
from fractions import Fraction as F
from decimal import Decimal, localcontext
from pathlib import Path
root=Path(__file__).resolve().parents[2]
d=json.loads((root/'docs/publication-batch6-assets/compiled.json').read_text())
author=json.loads((root/'content/risk-advanced.json').read_text())
chapters={c['id']:c for c in (author['chapters'] if '--authoring' in sys.argv else d['chapters'])}
p,j=chapters['psychology'],chapters['journaling']
part=author['partPractice']['risk'] if '--authoring' in sys.argv else d['partPractice']
counts={'numeric':0,'text':0,'structure':0}
def num(x): return F(str(x).replace('−','-').replace(',','').replace('$','').replace('+',''))
def same(label,got,expected,kind='numeric'):
    counts[kind]+=1
    assert got==expected,f'{label}: {got!r} != {expected!r}'
def contains(label,text,value):
    counts['text']+=1
    assert value in text,f'{label}: missing {value!r}'
def money(value):
    with localcontext() as context:
        context.prec=30
        return format(Decimal(value.numerator)/Decimal(value.denominator),',.2f')
def rounded(value,places=4):
    with localcontext() as context:
        context.prec=30
        return format(Decimal(value.numerator)/Decimal(value.denominator),f'.{places}f')
def section(c,id): return next(s for s in c['sections'] if s['id']==id)
def text(c): return json.dumps(c,ensure_ascii=False)
# The rebuilt fields agree with authoring; research additions append rather than replace them.
if '--authoring' not in sys.argv:
    for c in [p,j]:
        original=next(a for a in author['chapters'] if a['id']==c['id'])
        for field in ['practice','figure','figures','learnerAttempt','solution','quiz']:
            if field in original: same(c['id']+' compiled '+field,c[field],original[field],'structure')
        same(c['id']+' compiled narrative prefix',c['sections'][:len(original['sections'])],original['sections'],'structure')
    same('compiled Part 5 tasks',part,author['partPractice']['risk'],'structure')
# Independent cumsums from the declared dollar-change schedules, not differences of stored paths.
fixed=[F(-100)]*3+[F(x) for x in [200,-100,200,-100,200,-100,200,-100]]
escalated=[F(-100),F(-200),F(-400)]+fixed[3:]
paths=[]
for k,deltas in enumerate([fixed,escalated]):
    values=[F(10000)]
    for delta in deltas: values.append(values[-1]+delta)
    paths.append(values)
    for i,(got,expected) in enumerate(zip(p['figure']['series'][k]['values'],values)):
        same(f'psychology path {k} observation {i}',num(got),expected)
    same(f'path {k} point count',len(p['figure']['series'][k]['values']),12)
for i,(a,b) in enumerate(zip(*paths)):
    same(f'path difference at {i}',a-b,F(([0,0,100]+[400]*9)[i]))
same('fixed third loss',paths[0][3],9700);same('escalated third loss',paths[1][3],9300)
same('unchanged later changes',escalated[3:],fixed[3:],'structure')
winning=p['practice'][0]['solution'][0]
for risk in [F(100),F(400)]:
    gross=risk*2; net=gross-5
    contains('winning gross/net',winning,f'${int(gross)} gross/${int(net)} net')
    contains('winning net R',winning,rounded(net/risk).rstrip('0').rstrip('.'))
same('winning normal gross',F(100)*2,200);same('winning violation gross',F(400)*2,800)
same('winning net normal',F(200)-5,195);same('winning net violation',F(800)-5,795)
same('winning net R normal',(F(200)-5)/100,F(195,100));same('winning net R enlarged',(F(800)-5)/400,F(795,400))
# LARK packet is independent of the earlier BRDG path; execution reports supply the fills.
lark=section(p,'reconcile-the-unfamiliar-cutoff-note')['paragraphs'][1]
q0=p['learnerAttempt']['tables'][0]['rows'][0]
O,H,L,C,boundary=map(num,q0)
same('Q0 upper shadow',H-max(O,C),F('0.30'));same('Q0 completed signal',C>boundary,True,'structure')
q=F(50);limit=F('64.90');entry=F('64.60');stop=F('62.60');side_fee=F('2.50')
reserve=q*limit+side_fee;oneR=q*(entry-stop);debit=q*entry+side_fee;credit=q*stop-side_fee
for value in [debit,credit,F(20000)-debit+credit]:contains('LARK cash prose',lark,'$'+money(value).rstrip('0').rstrip('.') if value.denominator==1 else '$'+money(value))
same('LARK reserve',reserve,F('3247.50'));same('LARK risk cap',q*(limit-stop),115)
same('LARK filled 1R',oneR,100);same('LARK gross',q*(stop-entry),-100)
same('LARK net R',(credit-debit)/oneR,F('-1.05'));same('LARK ending cash',F(20000)-debit+credit,19895)
contains('LARK report defines entry price',lark,'fills all 50 shares at $64.60 at 09:31')
contains('LARK report defines exit price',lark,'closes the 50 shares at $62.60')
contains('L1 order limit',text(p['learnerAttempt']),'buy limit at $64.90')
contains('L1 report requirement',text(p['learnerAttempt']),'confirmed execution reports')
contains('L1 split denominator',text(p['learnerAttempt']),'filled shares × (actual fill')
# BRDG records connect back to Chapter 21; cash labels and duplicated continuation table agree.
q=F(50);entry=F('50.60');stop=F('48.60');oneR=q*(entry-stop)
debit=q*entry+side_fee;credit=q*stop-side_fee;net=credit-debit
same('BRDG filled R',oneR,100);same('BRDG debit',debit,F('2532.50'));same('BRDG credit',credit,F('2427.50'))
same('BRDG net dollars',net,-105);same('BRDG net R',net/oneR,F('-1.05'))
cash=F(20000)
for i,row in enumerate(j['figure']['rows']):
    flow=num(row[1]);cash+=flow;same(f'journal cash at row {i}',num(row[2]),cash)
    same(f'journal flow at row {i}',flow,[F(0),-debit,credit,F(0)][i])
same('journal ending cash',cash,19895)
for value in [debit,credit,cash]:contains('completed journal cash input',text(j['sections']),money(value).removesuffix('.00'))
continuation=section(p,'read-one-frozen-note-against-its-continuation')['tables'][1]
same('continuation table matches figure',continuation['rows'],p['figures'][0]['rows'],'structure')
for record in [p['quiz'],j['quiz']]:
    same('quiz feedback aligns',record['feedback'][record['answer']],record['explanation'],'structure')
same('psychology quiz answer index',p['quiz']['answer'],0);same('journal quiz answer index',j['quiz']['answer'],2)
# Excursion fixtures use complete supplied holding intervals; BRDG's high is from S2 while held.
for label,got,expected in [('BRDG MFE dollars',q*(F('51.30')-entry),35),('BRDG MFE R',(F('51.30')-entry)/(entry-stop),F('.35')),('BRDG modeled MAE',q*(entry-stop),100),('whole-bar alternative',q*(entry-F('48.40')),110),('separate MFE',F(50)*(54-50),200),('separate MAE',F(50)*(50-F('48.80')),60),('separate gross',F(50)*(F('51.50')-50),75),('separate net',F(50)*(F('51.50')-50)-5,70)]:same(label,got,expected)
for value in ['$200/2R','$60/0.6R','$75/0.75R','$70/0.70R']:contains('guided excursion solution',j['practice'][0]['solution'][0],value)
# Fresh journal: every row classification controls a different denominator or accounting field.
task=next(t for t in j['practice'] if t['level']=='independent');rows=task['tables'][0]['rows'];solution=' '.join(task['solution'])
same('all screened inputs supplied',len(rows),5)
completed=[];open_positions=[];totalfees=F(0)
for row in rows:
    label,q,e,s,x,cost,mark=row;q=num(q);cost=num(cost);totalfees+=cost
    if q==0:
        same('nontrade fee',cost,0);same('nontrade entry absent',e,'—','structure');continue
    oneR=q*(num(e)-num(s));same(label+' frozen R',oneR,{'T1: closed':F(50),'T2: closed':F(60),'H: still open':F(20)}[label])
    if x!='—':
        gross=q*(num(x)-num(e));net=gross-cost;r=net/oneR
        completed.append((gross,net,r))
    else:open_positions.append((q,num(e),num(mark),cost,oneR))
for i,result in enumerate(completed):
    for field,got,expected in zip(['gross','net','net R'],result,[(F(75),F(70),F('1.4')),(F(-80),F(-88),F(-22,15))][i]):same(f'T{i+1} {field}',got,expected)
same('completed count',len(completed),2);same('still open count',len(open_positions),1)
closednet=sum(r[1] for r in completed);mean=sum(r[2] for r in completed)/len(completed)
same('sum closed net',closednet,-18);same('mean completed net R',mean,F(-1,30))
same('five-candidate wrong mean differs',sum(r[2] for r in completed)/len(rows)!=mean,True,'structure')
same('aggregate dollar/risk ratio differs',closednet/(50+60)!=mean,True,'structure')
q,e,mark,cost,openR=open_positions[0]
cash=F(20000)+closednet-q*e-cost;holdings=q*mark;equity=cash+holdings;opencontribution=q*(mark-e)-cost
for label,got,expected in [('cash',cash,19480),('holdings',holdings,510),('equity',equity,19990),('open marked contribution',opencontribution,8),('marked total change',equity-20000,-10),('closed net per screened',closednet/len(rows),F('-3.60')),('marked return percent',100*(equity-20000)/20000,F('-.05'))]:same(label,got,expected)
for value in ['$19,480','$510','$19,990','−0.0333R','−$3.60','−0.05%']:contains('fresh solution result',solution,value)
contains('open mark limitation',solution,'not a guaranteed liquidation price')
contains('unfilled order not a position',solution,'unfilled order but no position')
contains('open R exists before completion',solution,'$20, but no completed outcome yet')
# Part 5 task 1: cost-inclusive sizing cap, notional cap and gap accounting.
solution=part['tasks'][0]['solution'][0]
E,S,budget,rate,cap=map(F,['32','30.50','90','.12','1600'])
risk_cap=budget//(E-S+rate);notional_cap=cap//E;q=min(risk_cap,notional_cap)
for label,got,expected in [('risk allowed shares',risk_cap,55),('notional allowed shares',notional_cap,50),('chosen shares',q,50),('notional',q*E,1600),('entry cost',q*rate/2,3),('price R',q*(E-S),75),('ordinary cost-inclusive loss',q*(E-S+rate),81),('ordinary net R',-q*(E-S+rate)/(q*(E-S)),F('-1.08')),('gap net loss',q*(E-28+rate),206),('gap net R',-q*(E-28+rate)/(q*(E-S)),F(-206,75))]:same('Part 5 '+label,got,expected)
contains('Part 5 rounded gap R',solution,'R'+rounded(F(-206,75)).replace('-','−'))
# Part 5 task 2 derives entry quantity/price from the execution report, separately from the offer.
task=part['tasks'][1];prompt=task['question'];solution=task['solution'][0]
match=re.search(r'confirms (\d+) shares at \$(\d+\.\d+)',prompt);assert match,'No supplied confirmed fill price'
q,e=map(F,match.groups());stop=F('38.70');target=F('44.70')
O,H,L,C=map(F,re.search(r'O(\d+\.\d+)/H(\d+\.\d+)/L(\d+\.\d+)/C(\d+)',prompt).groups())
same('held opening is inside exits',stop<O<target,True,'structure');same('both levels crossed',L<=stop and H>target,True,'structure')
same('confirmed canceled remainder',F(re.search(r'remaining (\d+) shares canceled',prompt)[1]),50-q)
entrydebit=q*e+F('2.50');exitcredit=q*stop-F('2.50');oneR=q*(e-stop)
for label,got,expected in [('entry debit',entrydebit,F('816.50')),('exit credit',exitcredit,F('771.50')),('filled R',oneR,40),('gross',q*(stop-e),-40),('net',exitcredit-entrydebit,-45),('net R',(exitcredit-entrydebit)/oneR,F('-1.125'))]:same('Part 5 '+label,got,expected)
for value in ['$816.50','$40','$771.50','−$45','−1.125R']:contains('partial fill solution',solution,value)
contains('limit order price provided',prompt,'buy limit at $40.70');contains('cancel confirmation supplied',prompt,'A cancellation report confirms')
contains('third review preserves missing fields',part['tasks'][2]['solution'][0],'not recorded')
contains('third review distinguishes record/compliance',part['tasks'][2]['solution'][0],'record-quality limitation')
output={'mode':'authoring' if '--authoring' in sys.argv else 'compiled','exactFractionComparisons':counts['numeric'],'textChecks':counts['text'],'structureChecks':counts['structure'],'mismatches':0,'freshAudit':{'cash':str(cash),'equity':str(equity),'meanCompletedNetR':str(mean),'closedNetPerCandidate':str(closednet/len(rows))}}
print(json.dumps(output))
(root/'docs/publication-batch6-assets'/('arithmetic-before-build.json' if '--authoring' in sys.argv else 'arithmetic.json')).write_text(json.dumps(output,indent=2)+'\n')
