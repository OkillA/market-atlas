from pathlib import Path
from decimal import Decimal as D
import json

raw=json.loads(Path('content/foundations-price.json').read_text())
cs={c['id']:c for c in raw['chapters']};checks=[];states={}
def n(x):return D(str(x))
def eq(label,actual,expected,tol='0'):
 a,e=n(actual),n(expected);assert abs(a-e)<=D(tol),(label,a,e)
 checks.append({'label':label,'actual':str(a),'expected':str(e),'tolerance':tol})
def seq(label,a,b):
 assert len(a)==len(b)
 for i,(x,y) in enumerate(zip(a,b)):eq(f'{label}[{i}]',x,y)
def geometry(bar):
 o,h,l,c=[n(bar[k]) for k in ['open','high','low','close']]
 assert l<=min(o,c)<=max(o,c)<=h
 return abs(c-o),h-max(o,c),min(o,c)-l,h-l
def table(c,title):return next(t for s in c['sections'] for t in s.get('tables',[]) if t['title'].startswith(title))
c=cs['candlestick-patterns'];panels=c['figure']['panels']
for i,p in enumerate(panels[:2]):
 B,U,L,R=geometry(p['candles'][0]);r=table(c,'Same body')['rows'][i]
 seq('doji body/range '+str(i),[B,R],[r[2],r[3]])
 eq('doji percent '+str(i),B/R*100,str(r[4]).rstrip('%'))
 eq('doji classification '+str(i),int(B/R<=D('.1')),[1,0][i])
for i,p in enumerate(panels[2:]):
 B,U,L,R=geometry(p['candles'][-1]);r=table(c,'Compare the hammer')['rows'][i]
 seq('hammer geometry '+str(i),[B,U,L,L/B],r[1:5])
 eq('hammer classification '+str(i),int(B>0 and L>=2*B and U<=B),[1,0][i])
 seq('hammer range and minimum tail '+str(i),[R,2*B],[[4,1.6],[2.1,1.6]][i])
 seq('D3 raw candle '+str(i),[p['candles'][0][k] for k in ['open','high','low','close']],[[54,55,52,53],[50,51,48.9,50.8]][i])
attempt=c['learnerAttempt']['tables'][0]['rows'];bars=c['learnerAttempt']['figures'][0]['candles']
for r,b in zip(attempt,bars):seq('attempt OHLC '+r[0],r[1:],[b[k] for k in ['open','high','low','close']])
assert len(bars)==3 and not c['learnerAttempt']['figures'][0].get('annotations')
for i,p in enumerate(c['figures'][0]['panels']):
 a,b=p['candles'];ao,ac=n(a['open']),n(a['close']);bo,bc=n(b['open']),n(b['close'])
 comparisons=[ac<ao,bc>bo,bo<ac,bc>ao,n(b['high'])>n(a['high']),n(b['low'])<n(a['low'])]
 for j,result in enumerate(comparisons):eq(f'engulf panel {i} comparison {j}',int(result),[[1,1,1,1,0,0],[1,1,1,0,0,0]][i][j])
 geometry(a);geometry(b)
eq('strict follow-up',int(n('51.2')>51),1);eq('equality fails follow-up',int(n(51)>51),0)
seq('later entry price risk',[n(52)-n('46.8'),n('50.8')-n('46.8')],[5.2,4])
for cl in ['30.2','29.9']:
 eq('unfamiliar engulf '+cl,int(n('27.8')<28 and n(cl)>30),int(cl=='30.2'))
eq('quiz answer',c['quiz']['answer'],2)

c=cs['chart-patterns'];prefix=[n(r[1]) for r in table(c,'Shared prefix')['rows']]
turns=[]
for i in range(2,len(prefix)-2):
 neighbors=prefix[i-2:i]+prefix[i+1:i+3]
 if all(prefix[i]>v for v in neighbors):turns.append((i+1,'peak',prefix[i],i+3))
 if all(prefix[i]<v for v in neighbors):turns.append((i+1,'trough',prefix[i],i+3))
assert turns==[(3,'peak',n(60),5),(6,'trough',n(54),8),(9,'peak',n('59.5'),11)]
states['confirmedTurns']=[{'session':i,'type':k,'value':str(v),'recognizedAfter':when} for i,k,v,when in turns]
seq('candidate plot',prefix,c['figure']['panels'][0]['series'][0]['values'])
seq('cutoff table',prefix,[r[1] for r in c['learnerAttempt']['tables'][0]['rows']])
seq('unlabelled cutoff plot',prefix,c['learnerAttempt']['figures'][0]['series'][0]['values'])
eq('peak spacing',9-3,6);eq('peak tolerance percent',(prefix[2]-prefix[8])/prefix[2]*100,'.833','0.000334')
ref=min(prefix[3:8]);eq('intervening minimum',ref,54)
eq('D11 candidate no completion',int(prefix[-1]<ref),0)
reveals=table(c,'Alternative reveals')['rows']
for i,p in enumerate(c['figure']['panels'][1:]):
 seq('same branch prefix '+str(i),p['series'][0]['values'][:11],prefix)
 seq('branch reveal '+str(i),p['series'][0]['values'][11:],[r[i+1] for r in reveals])
eq('D12 branch A completion',int(n(reveals[0][1])<ref),1)
eq('D12 branch B invalidation',int(n(reveals[0][2])>prefix[2]),1)
eq('equal support no completion',int(ref<ref),0);eq('equal first peak no invalidation',int(prefix[2]>prefix[2]),0)
height=prefix[2]-ref;target=ref-height;eq('height',height,6);eq('measured reference',target,48)
for r in reveals[1:]:eq('target miss '+r[0],int(n(r[1])<=target),0)
ratio=abs(n(72)-n('71.2'))/72*100;eq('borderline percentage',ratio,'1.111111111111','0.000000000001')
eq('one-percent rejection',int(ratio<=1),0);eq('alternative tolerance',int(ratio<=n('1.5')),1);eq('later alternative completion',int(n('65.5')<66),1)
families=c['figures'][0]['panels']
for i,p in enumerate(families):
 a,b,upper,lower=[[n(x) for x in s['values']] for s in p['series']];cutoff=6 if i<4 else 7
 seq(p['title']+' shared prefix',a[:cutoff],b[:cutoff])
 expected=[[44.6,39.5,44,40],[48.5,45.5,48,46],[50.5,47.5,50,48],[43.5,46.5,46,44],[50,47.5,49.5,48],[49.6,48,49.5,48.5]][i]
 seq(p['title']+' reference crossing',[a[cutoff],b[cutoff],upper[-1],lower[-1]],expected)
 eq(p['title']+' crossing classification',int(a[cutoff]<lower[-1] if i==3 else a[cutoff]>upper[-1]),1)
 eq(p['title']+' alternative classification',int(b[cutoff]>upper[-1] if i==3 else b[cutoff]<lower[-1]),1)
 if i==1:seq('triangle contraction',[a[0]-a[1],a[2]-a[3],a[4]-a[5]],[6,4,2])
mirror=c['figures'][1]['panels'][0]
seq('completed double-bottom mirror',[110-n(v) for v in c['figure']['panels'][1]['series'][0]['values']],mirror['series'][0]['values'])
seq('invalidated double-bottom candidate mirror',[110-n(v) for v in c['figure']['panels'][2]['series'][0]['values'][:11]],mirror['series'][1]['values'][:11])
eq('exact invalidation mirror D12',110-n('61.5'),'48.5')
eq('supplied alternative D12',mirror['series'][1]['values'][11],49)
eq('both invalidation versions below first trough',int(n('48.5')<50 and n(49)<50),1)
top,bottom=c['figures'][1]['panels'][1:]
for i in range(3):seq('head/shoulders mirror '+str(i),[110-n(v) for v in top['series'][i]['values']],bottom['series'][i]['values'])
slope=(n(56)-55)/(8-4);eq('neckline slope',slope,'.25')
for day,v in enumerate(top['series'][2]['values'],1):eq('dated neckline D'+str(day),55+slope*(day-4),v)
eq('D12 top break',int(n(top['series'][0]['values'][11])<n(top['series'][2]['values'][11])),1)
eq('D12 bottom break',int(n(bottom['series'][0]['values'][11])>n(bottom['series'][2]['values'][11])),1)
eq('quiz completion answer',c['quiz']['answer'],0)

# Independently reproduce all three cumulative review tasks from their declared prices.
eq('area crossing amount',n('60.5')-60,'.5');eq('buffer not met',int(n('60.5')>n('60.6')),0)
eq('later buffered signal',int(n('60.8')>n('60.6')),1)
eq('next-open ceiling skip',int(n(62)>n('60.8')),1);eq('later chart failure',int(n('59.5')<60),1)
eq('frozen filled-position risk',50*(n('60.8')-n('58.8')),100)
for exit,expected in [('58.8',-105),('64.8',195)]:
 net=50*(n(exit)-n('60.8'))-5;eq('net at '+exit,net,expected);eq('net R at '+exit,net/100,n(expected)/100)
eq('opening between exits',int(n('58.8')<61<n('64.8')),1)
eq('both exits in bar',int(n('58.5')<=n('58.8')<n('64.8')<=n('65.2')),1)
states['cutoffs']={'D3':'shape complete; strict next-close follow-up unavailable','D11':'candidate recognized, neither completion nor invalidation','branchA':'D12 complete; three later closes miss 48','branchB':'D12 invalidated; no completed-pattern target event'}
out={'checked':'2026-10-03','reviewer':'/root','method':'Independent Python Decimal reconstruction from authoring tables and figure inputs; strict neighbor enumeration, boundary/equality checks, mirror/neckline reconstruction and task accounting. No model or human prediction result is inferred.','comparisons':len(checks),'checks':checks,'states':states}
Path('docs/publication-batch3-assets/arithmetic-checks.json').write_text(json.dumps(out,indent=2)+'\n')
print(f'{len(checks)} independent comparisons passed')
