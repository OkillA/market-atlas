#!/usr/bin/env node
'use strict';
// Independent arithmetic/content checks for the October 2026 later-chapter revision.
// Default: authoring JSON. Pass a draft directory to verify before the shared rebuild.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const drafts=process.argv[2];
const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/risk-advanced.json')));
const chapter=id=>drafts?JSON.parse(fs.readFileSync(path.join(drafts,id+'.json'))):source.chapters.find(c=>c.id===id);
const reviews=drafts?JSON.parse(fs.readFileSync(path.join(drafts,'part-reviews.json'))):source.partPractice;
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b} (tolerance ${tol})`);
const num=s=>Number(String(s).replace(/−/g,'-').replace(/[,+$%]/g,''));
const sum=a=>a.reduce((x,y)=>x+y,0),round=(x,n=2)=>Number(x.toFixed(n));
const cents=x=>Math.round(num(x)*100),money=x=>round(x/100);
const result=(q,entry,stop,exit,cost)=>({oneR:q*(entry-stop),gross:q*(exit-entry),net:q*(exit-entry)-cost,netR:(q*(exit-entry)-cost)/(q*(entry-stop))});
const renderer=require('../figure-renderer.js');
for(const id of ['risk-sizing','trade-plans','psychology','journaling','testing','statistics','system-design','classical-frameworks','case-studies']) {
 const c=chapter(id);assert.equal(c.id,id);assert.ok(c.outcomes.length>=3&&c.solution.length&&c.practice.length>=2&&c.evidence.length);
 assert.equal(c.quiz.feedback.length,3);assert.equal(c.quiz.options.length,3);assert.ok(c.quiz.answer>=0&&c.quiz.answer<3);
 assert.ok(c.practice.some(p=>p.level==='guided')&&c.practice.some(p=>p.level==='independent'));
 for(const s of c.sections)for(const t of s.tables||[])for(const row of t.rows)assert.equal(row.length,t.columns.length);
 for(const f of [c.figure,...(c.figures||[])]){
  assert.ok(f.title&&f.caption&&(f.afterSection??0)<c.sections.length);
  for(const p of renderer.flatten(f)){
   if(p.series){const n=p.series[0].values.length;assert.ok(n>=2&&p.series.length<=4);for(const s of p.series){assert.equal(s.values.length,n);assert.ok(s.values.every(x=>x===null||Number.isFinite(x)));} for(const a of p.annotations||[])assert.ok(Number.isFinite(renderer.annotationValue(p,a)));}
   if(p.candles)for(const b of p.candles)assert.ok(b.low<=Math.min(b.open,b.close)&&b.high>=Math.max(b.open,b.close));
  }
  for(const width of [300,760])assert.ok(!/\b(?:x|y|width|height|d|viewBox)="[^"]*\b(?:NaN|Infinity|undefined)\b/.test(renderer.render(f,{width})));
 }
}
// Ch20: price risk, cost-inclusive sizing, portfolio cash and common shock.
assert.equal(Math.floor(10000/210),47);near(47*2,94);near(47*.1,4.7);near(47*2.1,98.7);
let r=result(47,50,48,45,4.7);near(r.net,-239.7);near(r.netR,-2.55);
const risk=chapter('risk-sizing');const stress=risk.sections[4].tables[0].rows;
const qs=stress.map(row=>num(row[1])),entries=stress.map(row=>num(row[2])),stops=stress.map(row=>num(row[3])),exits=stress.map(row=>num(row[5]));
near(sum(qs.map((q,i)=>q*entries[i])),10530);near(sum(qs.map((q,i)=>q*(entries[i]-stops[i]))),400);
const shock=qs.map((q,i)=>q*(entries[i]-exits[i]));stress.forEach((row,i)=>near(shock[i],num(row[6])));near(sum(shock)+20,1135);
const reduced=[50,20,50,50];near(sum(reduced.map((q,i)=>q*entries[i])),7530);near(sum(reduced.map((q,i)=>q*(entries[i]-stops[i]))),300);near(sum(reduced.map((q,i)=>q*(entries[i]-exits[i])))+20,755);
const q=Math.floor(7500/(120+15));assert.equal(q,55);r=result(q,30,28.8,27,q*.15);near(r.oneR,66);near(r.net,-173.25);near(r.netR,-2.625);
for(const [i,s]of risk.figure.series.entries())for(const [n,v]of s.values.entries())near(v,round(20000*(1-[.005,.02][i])**n),.011);
for(const [loss,gain]of [[.1,1/9],[.25,1/3],[.5,1]])near(loss/(1-loss),gain);
assert.equal(Math.min(Math.floor(100/.5),Math.floor(3000/50)),60);
// Ch21–23: same account and R contract, full/partial paths, excursion and counterfactuals.
near(50*50.9+2.5,2547.5);near(50*(50.9-48.6),115);
for(const [exit,net]of [[48.6,-105],[54.6,195],[47.6,-155]]){
 r=result(50,50.6,48.6,exit,5);near(r.oneR,100);near(r.net,net);near(20000-50*50.6-2.5+50*exit-2.5,20000+net);
}
r=result(30,50.6,48.6,47.6,5);near(r.net,-95);near(r.netR,-95/60);near(30*50.6+2.5,1520.5);
r=result(30,50.6,48.6,54.6,5);near(r.net,115);near(r.netR,115/60);
// A halted S10 preserves its due deadline; resumed-open exits precede later extremes.
const deadlineTask=chapter('trade-plans').practice.find(task=>task.title==='Carry the deadline through a halt');
const deadlineRows=deadlineTask.tables[0].rows;
const [,heldShares,heldEntry]=deadlineTask.question.match(/(\d+)-share \$(\d+(?:\.\d+)?) entry/).map(Number);
const initialStop=Number(deadlineTask.question.match(/fixed stop \$(\d+(?:\.\d+)?)/)[1]);
const initialTarget=Number(deadlineTask.question.match(/target \$(\d+(?:\.\d+)?)/)[1]);
const sideFee=Number(deadlineTask.question.match(/\$(\d+(?:\.\d+)?) fee on each side/)[1]);
deadlineRows.forEach((row,i)=>{
 const [name,open,high,low,close]=row;
 assert.ok(low<=Math.min(open,close)&&high>=Math.max(open,close),`Invalid reopening OHLC ${name}`);
 const reason=open<=initialStop?'stop gap':open>=initialTarget?'target gap':'overdue time';
 assert.equal(reason,['overdue time','stop gap','target gap'][i]);
 const modeled=result(heldShares,heldEntry,initialStop,open,2*sideFee);
 near(modeled.oneR,100);near(modeled.net,[-45,-155,215][i]);near(modeled.netR,[-.45,-1.55,2.15][i]);
 near(20000-heldShares*heldEntry-sideFee+heldShares*open-sideFee,[19955,19845,20215][i]);
});
assert.ok(deadlineRows[0][2]>initialTarget&&deadlineRows[0][3]<initialStop,'Inside opening branch must distinguish overdue opening exit from later dual-touch');
near(50*(51.3-50.6),35);near(50*(50.6-48.6),100);near(50*(50.6-48.4),110);
const j=chapter('journaling').figure.rows;let cash=20000;for(const row of j){cash+=num(row[1]);near(cash,num(row[2]));}near(cash,19895);
near(50*(54-50),200);near(50*(50-48.8),60);near(50*(51.5-50)-5,70);
const ps=chapter('psychology').figure.series;for(let i=3;i<ps[0].values.length;i++)near(ps[0].values[i]-ps[1].values[i],400);near(100*2-5,195);near(400*2-5,795);
// Ch24: integer-cent sizing, all ledger cells, cumulative paths and cost thresholds.
const testing=chapter('testing'),rows=testing.sections[5].tables[0].rows,costRows=testing.sections[5].tables[1].rows;
const accum=[0,0,0,0],paths=[[0],[0],[0],[0]];let totalShares=0,grossR=0;const netRs=[0,0,0];
rows.forEach((row,i)=>{
 const e=cents(row[2]),stop=cents(row[3]),q=Math.floor(10000/(e-stop)),exit=cents(row[6]);assert.equal(q,row[4]);totalShares+=q;
 const oneR=q*(e-stop),gross=q*(exit-e);near(money(oneR),num(row[5]));near(money(gross),num(row[8]));near(round(gross/oneR),num(row[9]));grossR+=gross/oneR;
 const costs=[200,200+q*4,200+q*10];costs.forEach((cost,k)=>{near(money(cost),num(costRows[i][2+k]));netRs[k]+=(gross-cost)/oneR;});
 near(money(gross-costs[1]),num(costRows[i][5]));near(money(gross-costs[2]),num(costRows[i][6]));near(round((gross-costs[2])/oneR),num(costRows[i][7]));
 [gross,...costs.map(x=>gross-x)].forEach((v,k)=>{accum[k]+=v;paths[k].push(money(accum[k]));});
});
assert.equal(totalShares,854);assert.deepEqual(paths,testing.figure.series.map(s=>s.values));assert.deepEqual(accum,[9115,6715,3299,-1825]);
near(round(grossR),.90);[.66,.32,-.20].forEach((x,i)=>near(round(netRs[i]),x));near(91.15/12,7.5958333333,1e-8);near(67.15/854,.07862997658,1e-8);near(91.15-854*.1,5.75);near(91.15/(854*2),.05336651054,1e-8);
near((8*12+2*-70)/10,-4.4);[50.7,50.4,49.8].forEach((e,i)=>near(50*(51.5-e),[40,55,85][i]));assert.equal(Math.floor(5040*101/100),5090);near(1600-200*5,600);near(1600-200*9,-200);
// Ch25: all outcomes, frequencies, equity paths, underwater plots, running SD/SE, Wilson, inference arithmetic.
const stats=chapter('statistics'),st=stats.sections[0].tables[0].rows;
const net=st.map(row=>num(row[2])-num(row[3]));net.forEach((v,i)=>{near(v,num(st[i][4]));near(100*v,num(st[i][5]));});
const wins=net.filter(x=>x>0),losses=net.filter(x=>x<0);assert.equal(wins.length,12);near(sum(wins),14.15);near(sum(losses),-8.1);near(sum(net)/20,.3025);near(sum(net)+1,7.05);
const counts=Array(9).fill(0);net.forEach(x=>counts[Math.floor((x+2.5)/.5)]++);assert.deepEqual(counts,stats.figure.series[0].values);
const reordered=[...losses,...wins];const equity=a=>a.reduce((arr,x)=>[...arr,round(arr.at(-1)+x*100)],[20000]);const equityPaths=[equity(net),equity(reordered)];assert.deepEqual(equityPaths,stats.figures[0].panels[0].series.map(s=>s.values));
const dd=a=>{let peak=a[0];return a.map(x=>{peak=Math.max(peak,x);return 100*(x/peak-1);});};equityPaths.forEach((a,k)=>dd(a).forEach((x,i)=>near(x,stats.figures[0].panels[1].series[k].values[i],.006)));
near(340/20265*100,1.6777695534,1e-8);near(340/19925*100,1.7063989962,1e-8);near(810/19190*100,4.22094841063,1e-8);near((20605/20000)**2-1,.0614150625);
const band=stats.figures[1].series;for(let n=1;n<=20;n++){
 const a=net.slice(0,n),mean=sum(a)/n;near(mean,band[0].values[n-1],.00051);
 if(n>=5){const sd=Math.sqrt(sum(a.map(x=>(x-mean)**2))/(n-1));const se=sd/Math.sqrt(n);near(mean+2*se,band[1].values[n-1],.00051);near(mean-2*se,band[2].values[n-1],.00051);}
}
const mean=sum(net)/20,sd=Math.sqrt(sum(net.map(x=>(x-mean)**2))/19);near(round(sd,3),1.308);near(round(sd/Math.sqrt(20),3),.293);
const z=1.95996398454,p=.6,n=20,den=1+z*z/n,center=p+z*z/(2*n),half=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n));near(round(100*(center-half)/den),38.66);near(round(100*(center+half)/den),78.12);
near((6.05-1.95)/19,.215789473684,1e-8);near((6.05+2.35)/19,.442105263158,1e-8);near(1-.95**6,.264908109375);near(.35*3-.65-.12,.28);near(1.12/4,.28);near(.8*.25-.2*1.5,-.1);
// Ch26: independent cash-flow/accounting checks plus both allocation variants.
const sim=require('./atlas20-sim.cjs'),s=sim.run(),sc=chapter('system-design');
assert.ok(sc.sections[4].paragraphs.some(p=>p.includes('Every unlisted non-held stock')));
// Compare the supplied manuscript inputs with the executable scenario, not only its outputs.
const inputTables=sc.sections[4].tables;
for(const table of inputTables.slice(2)) {
 for(const row of table.rows) for(let i=1;i<row.length;i++) {
  const stock=table.columns[i],session=num(row[0]),cell=row[i],b=sim.BARS[stock][session];
  if(cell==='—') continue; // Explicitly outside the supplied processing needs.
  if(cell==='no bar') { assert.equal(b,null); continue; }
  const [prices,volume]=cell.split('; vol ');
  prices.split('/').forEach((v,k)=>near(cents(v),b[['o','h','l','c'][k]]));
  if(volume) near(num(volume),b.v);
 }
}
for(const row of inputTables[1].rows) {
 const t=Number(row[0].slice(1)),rec=sim.SCREEN[t].find(x=>x.stock===row[1]);assert.ok(rec);
 near(cents(row[2]),sim.BARS[row[1]][t].c);near(cents(row[3]),rec.h20);
 if(rec.adv!==null) assert.equal(Math.round(num(row[4])*100000000),rec.adv);
 near(num(row[5]),rec.earnings);assert.equal(row[6]==='complete',rec.complete);
}
for(const [i,l]of s.ledger.entries()){
 near(l.equity,l.cash+sum(l.holdings.map(h=>h.qty*h.close)));assert.ok(l.available>=0);assert.ok(l.positions+l.orders.length<=5);
 if(i)near(l.cash-s.ledger[i-1].cash,sum(s.log.filter(e=>e.session===i).map(e=>e.cashFlow)));
 const row=sc.sections[7].tables[1].rows[i];[l.cash,l.positionsValue,l.equity].forEach((x,k)=>near(money(x),num(row[k+1])));near(money(l.reserved),num(row[6]));near(money(l.available),num(row[7]));
 near(money(l.equity),sc.figure.panels[0].series[0].values[i]);near(round(100*l.invested,1),sc.figure.panels[2].series[0].values[i]);
}
for(const [i,t]of s.trades.entries()){
 const row=sc.sections[7].tables[2].rows[i];assert.equal(row[0],t.stock);near(row[1],t.qty);
 near(money(t.oneR),num(row[4]));near(round(t.netR),num(row[6]));
 row[5].split(' / ').forEach((v,k)=>near(num(v),money([t.gross,t.costs,t.net][k])));
}
for(const e of s.log){
 const row=sc.sections[7].tables[0].rows.find(r=>num(r[0])===e.session&&r[1]===e.event);
 assert.ok(row,`missing event ${e.event}`);near(num(row[2]),money(e.cashFlow));
}
for(const [i,p]of s.openPositions.entries()){
 const row=sc.sections[7].tables[3].rows[i];assert.equal(row[0],p.stock);near(row[1],p.qty);
 near(num(row[4]),money(p.oneR));near(num(row[5]),money(p.lastClose));near(num(row[6]),money(p.qty*(p.lastClose-p.fill)));
}
near(money(s.ledger[7].equity-s.ledger[0].equity),739.22);near(sum(s.log.map(e=>e.cost))/100,22.5);
let from0=0;for(const t of s.trades){const old=t.entrySession<0,basis=old?({Hazel:4860,Fir:3580}[t.stock]):t.fill;from0+=t.qty*(t.exit-basis)-250-(old?0:250);}for(const p of s.openPositions)from0+=p.qty*(p.lastClose-p.fill)-p.entryCost;near(from0,73922);
const alt=sim.run({rankKey:e=>e.adv,lastSession:0});near(money(alt.ledger[0].reserved),27996.81);
const cashVariant=sim.run({rules:{riskBudget:.02,notionalCap:.4},lastSession:0});assert.equal(cashVariant.decisions[0].screened.find(x=>x.stock==='Cedar').qty,219);near(money(cashVariant.ledger[0].available),31.78);
// The attempt packet must independently reproduce the ledger from its supplied state and bars.
const packet=sc.learnerAttempt;assert.ok(packet&&packet.tables.length===6);
for(let i=0;i<3;i++)assert.deepEqual(packet.tables[i+1],sc.sections[i+1].tables[0],'restated rule sheet drift');
assert.ok(!/62,986\.52|71,267\.62|100,424\.12|100,188\.02|−730|−241/.test(JSON.stringify(packet)),'attempt exposes calculated results');
const replayHeld=packet.tables[0].rows.map(row=>({stock:row[0],qty:num(row[1]),fill:cents(row[2].split(' / ')[1]),stop:cents(row[3].split(' / ')[0]),target:cents(row[3].split(' / ')[1]),oneR:cents(row[4]),mark:cents(row[5].split(' ')[0])}));
let replayCash=5471402;near(replayCash+sum(replayHeld.map(p=>p.qty*p.mark)),10050282);
const replayTrades=[];
for(const [step,row]of packet.tables[4].rows.entries()){
 for(const p of [...replayHeld]){
  const cell=row[packet.tables[4].columns.indexOf(p.stock)];
  assert.ok(!cell.startsWith('Not supplied'),'required held-position bar missing');
  const [o,h,l,cl]=cell.split('/').map(cents);let exit=null;
  if(o<=p.stop||o>=p.target)exit=o;else if(l<=p.stop)exit=p.stop;else if(h>p.target)exit=p.target;
  if(exit!==null){replayCash+=p.qty*exit-250;replayTrades.push({stock:p.stock,net:p.qty*(exit-p.fill)-500,oneR:p.oneR});replayHeld.splice(replayHeld.indexOf(p),1);}else p.mark=cl;
 }
 const expected=[[6298652,3743760,10042412],[7126762,2892040,10018802]][step];
 const marks=sum(replayHeld.map(p=>p.qty*p.mark));[replayCash,marks,replayCash+marks].forEach((x,i)=>near(x,expected[i]));
}
assert.deepEqual(replayTrades.map(p=>[p.stock,p.net,p.oneR]),[['Fir',-73000,50000],['Birch',-24100,23600]]);
assert.equal(replayHeld.length,3);assert.match(packet.tables[5].rows[1][5],/S3 bar missing/);
// L1's complete order, confirmed entry and stop report must reconcile to the stated cash/R.
const l1=chapter('psychology');assert.match(l1.learnerAttempt.tables[1].rows[1][1],/buy limit at \$64\.90/);
assert.match(l1.learnerAttempt.tables[1].rows[1][1],/09:30–10:30 ET/);
near(50*64.9+2.5,3247.5);near(50*(64.9-62.6),115);
const l1Entry=50*64.6+2.5,l1Exit=50*62.6-2.5;near(20000-l1Entry+l1Exit,19895);near((l1Exit-l1Entry)/(50*(64.6-62.6)),-1.05);
const noVolume=sim.run({rules:{participation:0},lastSession:1});assert.equal(noVolume.trades.length,0);assert.equal(noVolume.log.filter(e=>e.cost).length,0);assert.equal(noVolume.openPositions.length,2);
// Deadline spans a missing bar: resume at the first available open, not its later close.
const haltedOpening={cash:9105000,positions:[{stock:'Fir',qty:250,entrySession:-6,fill:3600,entryCost:250}]};
for (const stopDistance of [200,400]) {
 const delayed=sim.run({opening:haltedOpening,lastSession:4,rules:{stopDistance,maxPositions:1}}).trades.find(t=>t.stock==='Fir');
 assert.equal(delayed.exitSession,4); assert.equal(delayed.exit,3310);
 assert.match(delayed.reason,stopDistance===200?/gap through stop/:/overdue time exit/);
}

const sw=sc.figures[1].series[1].values;for(let i=4;i<=7;i++)near(sw[i],101);for(let i=8;i<=11;i++)near(sw[i],round(101*sc.figures[1].series[0].values[i]/92));
// Ch27: constraints, recognition times and practice.
const cf=chapter('classical-frameworks'),dow=cf.figures[0].panels;
assert.equal(dow[0].series[0].values.findIndex(x=>x>110),8);assert.equal(dow[0].series[0].values.findIndex((x,i)=>x>110&&dow[1].series[0].values[i]>106),11);
near((30-29.5)/30*100,1.66666666667,1e-8);near(30*.99,29.7);
for(const [points,lengths,overlap]of [[[40,44,42,50,47,53],[4,8,6],false],[[40,44,42,53,49,51],[4,11,2],false],[[42,50,47,53,49,51],[8,6,2],true],[[20,26,21.5,30,25.5,31],[6,8.5,5.5],true]]){assert.deepEqual([points[1]-points[0],points[3]-points[2],points[5]-points[4]],lengths);assert.equal(points[4]<points[1],overlap);assert.ok(points[2]>=points[0]);}
// Ch28: table results, gap cash, fixed-fee smaller size, two paths with identical OHLC.
const cases=chapter('case-studies'),caseRows=cases.sections[6].tables[0].rows;for(const row of caseRows.filter(x=>x[1]))near(num(row[5]),num(row[3])-num(row[4]));
r=result(30,80,77,70,5);near(r.net,-305);near(r.netR,-305/90);r=result(15,80,77,70,5);near(r.net,-155);near(r.netR,-155/45);near(20000-15*80-2.5+15*70-2.5,19845);
const amb=cases.figures[0].panels.map(p=>p.series[0].values);const ohlc=a=>[a[0],Math.max(...a),Math.min(...a),a.at(-1)];assert.deepEqual(ohlc(amb[0]),ohlc(amb[1]));near(195-(-105),300);
r=result(50,31,29,35,5);near(r.net,195);near(r.netR,1.95);
// Both cumulative reviews: independent calculations.
assert.equal(Math.min(Math.floor(90/1.62),Math.floor(1600/32)),50);near(result(50,32,30.5,28,6).netR,-206/75);
near(result(20,40.7,38.7,38.7,5).netR,-1.125);near(20*40.7+2.5,816.5);near(20*38.7-2.5,771.5);
near((4*2-5-2)/10,.1);near((80-10*4)/80/10,.05);near(40/10000*100,.4);near(80/10,8);
assert.ok(100*(40-39)/39>100*(20.4-20)/20);assert.equal(Math.floor(4000*101/100),4040);
const limit=4040,qty=Math.min(Math.floor(25000/200),Math.floor(500000/limit),Math.floor((1200000-250)/limit));assert.equal(qty,123);near(money(qty*limit+250),4971.7);near(12000-4971.7,7028.3);
assert.equal(reviews.risk.tasks.length,3);assert.equal(reviews.advanced.tasks.length,3);
console.log('Verified chapters 20–28: arithmetic, tables, modeled cash/R, cost paths, statistics, Atlas-20 allocation/ledger, framework constraints, case branches and six cumulative tasks. Figures have finite geometry at 300/760px. Visual inspection remains a separate step.');
