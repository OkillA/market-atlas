#!/usr/bin/env node
'use strict';
// Independent reconstruction of the early-chapter teaching calculations.
// Reads authoring inputs so numerical review can precede the coordinated build.
const fs=require('node:fs'),assert=require('node:assert/strict');
const inputs=['foundations-price','indicators-context'].map(name=>JSON.parse(fs.readFileSync(`${__dirname}/../content/${name}.json`)));
const chapters=inputs.flatMap(j=>j.chapters),get=id=>chapters.find(c=>c.id===id);
const r=require('../figure-renderer.js');let checks=0;
const near=(actual,expected,tolerance=1e-8)=>{assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);checks++;};
const same=(a,b)=>{assert.deepEqual(a,b);checks++;};
const sum=a=>a.reduce((a,b)=>a+b,0),mean=a=>sum(a)/a.length;
const tables=c=>c.sections.flatMap(s=>s.tables||[]);
const sma=(p,n)=>p.map((_,i)=>i<n-1?null:mean(p.slice(i-n+1,i+1)));
function ema(p,n){let e=null;return p.map((v,i)=>{if(i<n-1)return null;if(i===n-1)e=mean(p.slice(0,n));else e+=2/(n+1)*(v-e);return e;});}
const seriesCheck=(actual,expected,tol=1e-8)=>actual.forEach((v,i)=>v===null?same(v,expected[i]):near(v,expected[i],tol));
const ret=(a,b)=>100*(b/a-1);
const geometry=b=>({body:Math.abs(b.close-b.open),range:b.high-b.low,upper:b.high-Math.max(b.open,b.close),lower:Math.min(b.open,b.close)-b.low});
function turns(p,n,start=0){let result=[];for(let i=Math.max(n,start);i<p.length-n;i++){const neighbors=p.slice(i-n,i).concat(p.slice(i+1,i+n+1));if(neighbors.every(v=>v<p[i]))result.push([i-start+1,p[i],'High',i-start+n+1]);if(neighbors.every(v=>v>p[i]))result.push([i-start+1,p[i],'Low',i-start+n+1]);}return result;}
// 1: denominators, entry notional, costs, gaps and invented expectancy.
near(ret(40,46),15);near(ret(46,40),-13.0434782608696);near(100*.8*1.2,96);near(ret(80,100),25);
const primer=tables(get('market-language'));same(primer[0].rows.map(x=>x[2]),[1880,98.7,239.7]);
near(Math.floor(100/(40-38+.1)),47);near(47*(40-35+.1),239.7);near(.4*3.9-.6*2.1,.3);near(.25*3.9-.75*2.1,-.6);near(.3*(6-.2)-.7*(3+.2),-.5);
// 2: one OHLC summary, two different ordered exit outcomes.
const anatomy=get('chart-anatomy'),bar=anatomy.figure.candles[0];same(geometry(bar),{body:5,range:10,upper:3,lower:2});near((105-98)/(108-98)*100,70);near(ret(110,105),-4.5454545454545);
const routes=anatomy.figures[0].panels.map(p=>p.series[0].values);
for(const p of routes)same([p[0],Math.max(...p),Math.min(...p),p.at(-1)],[100,108,98,105]);
function firstExit(p,stop,target){for(const v of p){if(v<=stop)return stop;if(v>=target)return target;}return null;}
same(routes.map(p=>firstExit(p,99,107)),[99,107]);near(ret(70,73),4.2857142857143);near(ret(75,73),-2.6666666666667);
// 3: excluded-current-session baseline, matched-time comparison, exact value.
const volume=get('volume'),volTable=tables(volume)[0].rows,p=volume.figure.panels;
same(p[0].series[0].values,volTable.map(row=>row[1]));same(p[1].series[0].values,volTable.map(row=>row[2]));
near(mean(volTable.slice(0,5).map(row=>row[2])),1);near(ret(40,42),5);near(ret(42,39.5),-5.952380952381);
same(p[1].series[1].values,[null,null,null,null,1,1,1]);near(.7/mean([.32,.38,.34,.4,.36]),1.944444444444);near(.7/((5*.36+.7)/6),1.68);
near(100*40+200*40.1+50*40.2,14030);near(350*40.2,14070);near(100*20+200*20.2+50*19.8,7030);
for(const f of [p[1],volume.figures[0]]){const svg=r.render(f,{width:300});assert.ok(svg.includes('data-series="1"'));same((svg.match(/<rect[^>]*><title>/g)||[]).length,f.series[0].values.filter(Number.isFinite).length);}
// 4: identical scales, aggregate OHLC/volume, split and distribution value.
const tf=get('timeframes');same(tf.figure.panels[0].series[0].values,tf.figure.panels[1].series[0].values);same(tf.figure.panels[1].yScale,'log');
const daily=tables(tf)[0].rows.slice(0,3),agg=[daily[0][1],Math.max(...daily.map(x=>x[2])),Math.min(...daily.map(x=>x[3])),daily.at(-1)[4],sum(daily.map(x=>x[5]))];same(agg,tables(tf)[0].rows.at(-1).slice(1));same(agg,[100,108,98,101,370000]);
near(100*80,200*40);near(75*60,225*20);near(ret(50,49),-2);near(ret(50,49+2),2);
// 5: independently detect all strict two-neighbor turns and recognition times.
const trend=get('trends'),tp=trend.figure.series[0].values;
const swing=turns([44,42,...tp],2,2);same(swing,[[1,40,'Low',3],[4,46,'High',6],[6,43,'Low',8],[8,49,'High',10],[10,45,'Low',12],[12,52,'High',14],[15,42,'Low',17],[17,48,'High',19]]);
same(tables(trend).find(t=>t.title.startsWith('Named')).rows.map(row=>[Number(row[0].slice(1)),row[1],row[2],Number(row[3].slice(1))]),swing);
near((43-40)/(6-1),.6);near(40+.6*9,45.4);near(tp[9]-(40+.6*9),-.4);
const line=trend.figure.series[1].values;line.forEach((v,i)=>i<7?same(v,null):near(v,40+.6*i));
// 6: construction selection, strict buffered break and close/wick distinction.
const support=get('support-resistance'),construction=tables(support)[0].rows.map(x=>x[1]);same(turns(construction,1).filter(x=>x[2]==='Low').map(x=>[x[0],x[1],x[3]]),[[3,39.8,4],[7,40.1,8],[11,40.35,12]]);
near(40.35-39.8,.55);near(39.8-.3,39.5);same(support.figure.panels[0].series[0].values,construction);same(support.figure.panels[1].series[0].values,tables(support).at(-1).rows.map(x=>x[1]));near(41.5-40.3,1.2);
assert.ok(39.7>39.5&&39.3<39.5);near(55.3+.2,55.5);
// 7: shape thresholds, body-only engulfing and separate alternative clocks.
const candle=get('candlestick-patterns');const cg=candle.figure.panels.map(f=>f.candles.at(-1));
const [doji,nearDoji,hammer,nearHammer]=cg.map(geometry);near(doji.body/doji.range,.05);near(nearDoji.body/nearDoji.range,.5);near(hammer.lower/hammer.body,3.75);near(nearHammer.lower/nearHammer.body,1.375);
const engulf=candle.figures[0].panels[0].candles;same(engulf.map(b=>[Math.min(b.open,b.close),Math.max(b.open,b.close)]),[[50,52],[49.8,52.2]]);assert.ok(engulf[1].high<engulf[0].high&&engulf[1].low>engulf[0].low);
same(candle.figures.at(-1).panels.length,2);near(52-46.8,5.2);
// 8: same candidate prefix, delayed peaks, branch completion/invalidation.
const patterns=get('chart-patterns').figure.panels,shared=patterns[0].series[0].values;
same(turns(shared,2),[[3,60,'High',5],[6,54,'Low',8],[9,59.5,'High',11]]);
for(const f of patterns.slice(1))same(f.series[0].values.slice(0,11),shared);
near((60-59.5)/60*100,.833333333333);assert.ok(shared.at(-1)>54&&patterns[1].series[0].values[11]<54&&patterns[2].series[0].values[11]>60);near(54-(60-54),48);
assert.ok(patterns[1].series[0].values.slice(12,15).every(v=>v>48));near(.8/72*100,1.111111111111);
const head=get('chart-patterns').figures.at(-1).panels;seriesCheck(head[2].series[0].values,head[1].series[0].values.map(x=>110-x));seriesCheck(head[2].series[2].values,head[1].series[2].values.map(x=>110-x));near(head[1].series[2].values[11],57);
// 9: signal/fill clocks, varying filled-risk R, cash reserve and gap loss.
const breakout=get('breakouts');near(breakout.figure.series[0].values[8],50.8);near(breakout.figures[0].candles[1].open,52.2);assert.ok(52.2>50.8&&49.4<50);
for(const [entry,exit,cost,expectedR]of [[50.8,54.8,5,1.95],[50.8,48.8,5,-1.05],[50.8,47.8,5,-1.55],[50.4,54.8,5,2.6875],[50.4,48.8,5,-1.0625]])near((50*(exit-entry)-cost)/(50*(entry-48.8)),expectedR);
near(50*50.8+2.5,2542.5);near(50*50.4+2.5,2522.5);near(50*(50.4-48.8),80);
// Reconstruct complete discrete tapes: OHLC does not establish intermediate trades.
const tapePrices = text => text.split('→').map(value => Number(value.trim()));
const tapeOHLC = prices => [prices[0],Math.max(...prices),Math.min(...prices),prices.at(-1)];
const retestTapes = breakout.sections.at(-1).tables[0].rows.map(row => tapePrices(row[1]));
retestTapes.forEach((prices,i) => same(tapeOHLC(prices),breakout.sections.at(-1).tables[0].rows[i].slice(2)));
same(retestTapes.map(prices => prices.some(price => price>=49.8&&price<=50.2)),[false,true]);
const touchTask = breakout.practice.find(task => task.title==='A traded touch needs a traded price');
const touchTapes = touchTask.tables[0].rows.map(row => tapePrices(row[1]));
touchTapes.forEach(prices => same(tapeOHLC(prices),[72.3,73.6,72,73.6]));
same(touchTapes.map(prices => Math.min(...prices)>=72.8&&Math.min(...prices)<=73.2),[false,false]);
same(touchTapes.map(prices => prices.some(price => price>=72.8&&price<=73.2)&&prices.at(-1)>73.5),[false,true]);
// 10: all plotted SMA/EMA values, undefined warm-up and range switches.
const averages=get('moving-averages');for(const f of averages.figure.panels){const close=f.series[0].values;seriesCheck(f.series[1].values,sma(close,5));if(f.series[2])seriesCheck(f.series[2].values,ema(close,5));}
const range=averages.figure.panels[1].series;const states=range[0].values.map((v,i)=>range[1].values[i]===null?null:Math.sign(v-range[1].values[i]));same(states.slice(5).filter((v,i)=>v!==states[i+4]).length,7);
tables(averages)[0].rows.forEach((row,i)=>{if(i>=4){near(row[2],averages.figure.panels[0].series[1].values[i]);near(row[3],averages.figure.panels[0].series[2].values[i],.00051);}});
// 11: full-history seeded MACD, five-session ROC, RSI smoothing and timing.
const mom=get('momentum'),mp=mom.figure.panels[0].series[0].values,hist=[...Array(36).fill(50),...mp];
seriesCheck(mom.figure.panels[1].series[0].values,mp.map((v,i)=>ret(i<5?50:mp[i-5],v)));
const e12=ema(hist,12),e26=ema(hist,26),valid=e26.map((v,i)=>v===null?null:e12[i]-v).slice(25),sig=ema(valid,9),mac=valid.slice(11),signal=sig.slice(11),macFig=mom.figures[0].panels;
seriesCheck(macFig[0].series[0].values,mac);seriesCheck(macFig[0].series[1].values,signal);seriesCheck(macFig[1].series[0].values,mac.map((v,i)=>v-signal[i]));near(100-100/(1+(4/3)/(1/3)),80);near(100-100/(1+(8/9)/(5/9)),61.538461538462);same(turns(mp,1).filter(x=>x[0]===12||x[0]===14).map(x=>x[3]),[13,15]);
// 12: gap-aware true range, ATR update and every population-dispersion band.
const vol=get('volatility'),vbar=vol.figure.candles[1],prior=vol.figure.candles[0].close;near(Math.max(vbar.high-vbar.low,Math.abs(vbar.high-prior),Math.abs(vbar.low-prior)),7);near((2*2+7)/3,11/3);same(Math.floor(100/(2*11/3)),13);
const boll=vol.figures[0].series;const mids=sma(boll[0].values,3);seriesCheck(boll[1].values,mids);for(let i=2;i<mids.length;i++){const sd=Math.sqrt(mean(boll[0].values.slice(i-2,i+1).map(v=>(v-mids[i])**2)));near(boll[2].values[i],mids[i]+2*sd);near(boll[3].values[i],mids[i]-2*sd);}near(4*Math.sqrt(8/3)/100*100,6.531972647422);
// 13: tape quantities/value, cumulative VWAP, exact profile and OBV.
const vt=get('volume-tools'),tape=tables(vt)[0].rows;let qty=0,value=0;const profile=new Map();
tape.forEach((row,i)=>{qty+=row[2];value+=row[1]*row[2];near(row[3],row[1]*row[2]);near(row[4],qty);near(row[5],value/qty,.00000051);near(vt.figure.panels[0].series[1].values[i],value/qty);profile.set(row[1],(profile.get(row[1])||0)+row[2]);});same([qty,value],[1700,20200]);for(const l of vt.figures[0].levels)near(l.volume,profile.get(l.price));
const obv=tables(vt)[1].rows;let total=0;obv.forEach((row,i)=>{let addition=i?Math.sign(row[1]-obv[i-1][1])*row[2]:0;total+=addition;near(row[3],addition);near(row[4],total);});same(vt.figures[1].rows,obv);
// 14: grids, availability, failed main response and fresh anchor transfer.
const fib=get('fibonacci');tables(fib)[0].rows.forEach(row=>{near(row[1],120-row[0]*20);near(row[2],120-row[0]*16);});for(const [i,s]of fib.figure.series.slice(1).entries())s.values.forEach((v,n)=>n<6?same(v,null):near(v,[107.64,110.112][i]));near(Math.abs(110-110.112),.112);assert.ok([109,107].every(v=>v<112.112));
const fresh=[70,73,77,76,81,79,77,78,80];same(turns(fresh.slice(0,6),1),[[3,77,'High',4],[4,76,'Low',5],[5,81,'High',6]]);near(81-.618*11,74.202);near(81-.618*5,77.91);assert.ok(Math.abs(78-77.91)<=.25&&Math.abs(78-74.202)>.25&&80>=77.91+2);
// 15: relative price ratios and absolute returns use different denominators.
const rs=get('relative-strength').figure.panels,paths=rs[0].series.map(s=>s.values);for(let i=0;i<paths[0].length;i++){near(rs[1].series[0].values[i],paths[0][i]/paths[2][i]*100);near(rs[1].series[1].values[i],paths[0][i]/paths[1][i]*100);}near(ret(100,90),-10);near(1.1/1.2*100,91.666666666667);
// 16: reconstruct index, constituent table, equal-count breadth and A/D.
const breadth=get('breadth'),bp=breadth.figure.panels,weights=[.6,.2,.1,.1],counts=tables(breadth)[1].rows;let ad=0;
for(let i=0;i<12;i++){const vals=bp[0].series.map(s=>s.values[i]),prev=i?bp[0].series.map(s=>s.values[i-1]):Array(4).fill(100);near(bp[1].series[0].values[i],sum(vals.map((v,k)=>v*weights[k])));same(breadth.figures[0].rows[i].slice(1,5),vals);const signs=vals.map((v,k)=>Math.sign(v-prev[k])),a=signs.filter(v=>v>0).length,d=signs.filter(v=>v<0).length,u=4-a-d;ad+=a-d;same(counts[i].slice(1),[a,d,u,a-d,ad]);near(bp[2].series[0].values[i],ad);}near(mean([110,98,97,95]),100);
// 17: use only completed weekly close at each daily cutoff.
const mt=get('multi-timeframe'),dp=mt.figure.series[0].values;let last=99;dp.forEach((v,i)=>{if((i+1)%5===0)last=v;near(mt.figure.series[1].values[i],last);near(tables(mt)[0].rows[i][2],last);});same([dp[9],dp[10],mt.figure.series[1].values[10]],[103,104,103]);
// 18: gap/recovery denominators and explicit modeled loss.
const events=get('events'),eb=events.figure.candles,erows=tables(events)[0].rows;const expected=[ret(eb[0].close,eb[1].open),ret(eb[1].open,eb[1].close),ret(eb[0].close,eb[1].close)];erows.forEach((row,i)=>near(row[3],expected[i],.00000051));near((43/52)*(46/43),46/52);near(100*(52-48),400);near(100*(52-43),900);
// 19: quantity-constrained ladder, named slippage references and round trip.
const micro=get('market-microstructure'),asks=micro.figure.rows.filter(row=>row[0]==='Ask').slice().reverse();let remaining=250,fillValue=0;for(const row of asks){const take=Math.min(remaining,row[2]);same(take,row[3]);same(row[2]-take,row[4]);remaining-=take;fillValue+=take*Number(row[1].slice(1));}same(remaining,0);near(fillValue,12540);near(fillValue/250,50.16);near(fillValue-250*49.9,65);near(fillValue-250*50,40);near(fillValue-250*50.1,15);
// Fresh independent tasks: reconstruct from the actual visible input tables.
const independent=id=>get(id).practice.find(task=>task.level==='independent');
const macTask=independent('momentum'),macInputs=macTask.tables[0].rows;
let fast=macInputs[0][2],slow=macInputs[0][3],macSignal=macInputs[0][4];
const macStates=[[fast-slow,fast-slow-macSignal]];
for(const row of macInputs.slice(1)){
  fast+=(row[1]-fast)*2/13;slow+=(row[1]-slow)*2/27;
  const mac=fast-slow;macSignal+=(mac-macSignal)*2/10;
  const histogram=mac-macSignal;macStates.push([mac,histogram]);
  for(const value of [fast,slow,mac,macSignal,histogram]){
    assert.ok(macTask.solution.join(' ').includes(Math.abs(value).toFixed(6)),`Missing MACD transfer result ${value}`);checks++;
  }
}
same(macStates.map(row=>Math.sign(row[0])),[-1,-1,-1]);
same(macStates.map(row=>Math.sign(row[1])),[-1,-1,1]);
same(macInputs.map(row=>row[1]),[33,34,34.5]);
const breadthTask=independent('breadth'),freshMembers=breadthTask.tables[0].rows;
near(sum(freshMembers.map(row=>row[1])),100);
near(sum(freshMembers.map(row=>row[1]/100*row[4])),98.7);
const freshSigns=freshMembers.map(row=>Math.sign(row[4]-row[3]));
same([1,-1,0].map(sign=>freshSigns.filter(v=>v===sign).length),[3,1,1]);
near(3/(3+1),.75);near(3/freshMembers.length,.6);
const eligible=freshMembers.filter(row=>row.slice(2).every(Number.isFinite));
same(eligible.map(row=>mean(row.slice(2))),[98,102,102,101]);
same(eligible.map(row=>Math.sign(row[4]-mean(row.slice(2)))),[-1,1,0,0]);
near(eligible.filter(row=>row[4]>mean(row.slice(2))).length/eligible.length,.25);
for(const token of ['98.70','75%','60%','25%']){assert.ok(breadthTask.solution.join(' ').includes(token));checks++;}
const gapTask=independent('events'),gapRows=gapTask.tables[0].rows;
const [,gapShares,gapEntry]=gapTask.question.match(/holding of (\d+) shares bought at \$(\d+)/).map(Number);
const gapStop=Number(gapTask.question.match(/ordinary sell stop at \$(\d+)/)[1]);
const gapLimit=Number(gapTask.question.match(/limit \$(\d+(?:\.\d+)?)/)[1]);
for(const row of gapRows){
  assert.ok(row[3]<=Math.min(row[1],row[4])&&row[2]>=Math.max(row[1],row[4]));checks++;
  near(ret(gapEntry,row[1]),-5.625);near(gapShares*(gapEntry-gapStop),180);
  near(gapShares*(row[1]-gapEntry),-270);near((row[1]-gapEntry)/(gapEntry-gapStop),-1.5);
  near(gapShares*(row[4]-gapEntry),-240);
}
same(gapRows.map(row=>row[1]<=gapStop),[true,true]);
same(gapRows.map(row=>row[2]>=gapLimit),[false,true]);
for(const token of ['−5.625%','$180','−$270','−1.50R','−$240']){assert.ok(gapTask.solution.join(' ').includes(token));checks++;}
// Price-action cutoff packets: reconstruct states only from their visible raw inputs.
const candleAttempt=candle.learnerAttempt,cutoffCandles=candleAttempt.figures[0].candles;
same(candleAttempt.afterSection,3);
same(cutoffCandles.map(b=>[b.label,b.open,b.high,b.low,b.close]),candleAttempt.tables[0].rows);
same(cutoffCandles.map(b=>[b.open,b.high,b.low,b.close]),candle.figure.panels[2].candles.map(b=>[b.open,b.high,b.low,b.close]));
const shape=geometry(cutoffCandles.at(-1));near(shape.body,.8);near(shape.range,4);near(shape.upper,.2);near(shape.lower,3);
same(shape.body>0&&shape.lower>=2*shape.body&&shape.upper<=shape.body,true);
same(cutoffCandles.map(b=>b.close),[53,50,50.8]);near(cutoffCandles.at(-1).high,51);
const patternAttempt=get('chart-patterns').learnerAttempt,cutoffCloses=patternAttempt.tables[0].rows.map(row=>row[1]);
same(patternAttempt.afterSection,1);same(cutoffCloses,shared);same(patternAttempt.figures[0].series[0].values,cutoffCloses);
const cutoffTurns=turns(cutoffCloses,2);same(cutoffTurns,[[3,60,'High',5],[6,54,'Low',8],[9,59.5,'High',11]]);
const cutoffPeaks=cutoffTurns.filter(row=>row[2]==='High');near(cutoffPeaks[1][0]-cutoffPeaks[0][0],6);
near(Math.abs(cutoffPeaks[1][1]-cutoffPeaks[0][1])/cutoffPeaks[0][1]*100,5/6);
const cutoffReference=Math.min(...cutoffCloses.slice(cutoffPeaks[0][0],cutoffPeaks[1][0]-1));near(cutoffReference,54);
same(cutoffCloses.at(-1)>cutoffReference&&cutoffCloses.at(-1)<=cutoffPeaks[0][1],true);
const harborChapter=get('breakouts'),harborAttempt=harborChapter.learnerAttempt,harborCloses=harborAttempt.tables[0].rows.map(row=>row[1]);
same(harborAttempt.afterSection,1);same(harborCloses,harborChapter.figure.series[0].values.slice(0,9));
same(harborAttempt.figures[0].series[0].values,harborCloses);
same(harborAttempt.tables[1].rows[0].slice(1),[49.4,51,49.2,50.8]);
same(harborCloses.at(-1)>50.5,true);near(50*50.8+2.5,2542.5);near(50*(50.8-48.8),100);near(50*(50.8-48.8)+5,105);
const harborReference=harborChapter.sections[6].paragraphs.join(' ');
for(const token of ['$2,542.50','$100','$105','$48.80','$50.80','$54.80','$2.50']){assert.ok(harborReference.includes(token));checks++;}
same(harborChapter.figure.afterSection>harborAttempt.afterSection,true);
for(const attempt of [candleAttempt,patternAttempt,harborAttempt]){
  for(const figure of attempt.figures){same(figure.annotations||[],[]);assert.ok(!figure.panels);checks++;}
}
assert.ok(!JSON.stringify(patternAttempt.tables).includes('D12'));checks++;
assert.ok(!JSON.stringify(harborAttempt.tables).includes('52.20'));checks++;
// First-four-part transfer cases: recompute new values and contrast data needs.
const reviews=Object.assign({},...inputs.map(j=>j.partPractice));same(Object.keys(reviews),['foundations','price-action','indicators','context']);
near(ret(80,84),5);near(ret(88,84),-4.5454545454545);near(1.2/mean([.8,1,1.2,.9,1.1]),1.2);near(.6/.4,1.5);near(20*80,40*40);
assert.ok(!(60.5>60.6)&&60.8>60.6&&62>60.8&&59.5<59.7);near((50*(64.8-60.8)-5)/100,1.95);near((50*(58.8-60.8)-5)/100,-1.05);
const reviewPath=[40,42,41,43,44,46,45,44,43,42,43,44],reviewMA=sma(reviewPath,3);near(reviewMA[9],43);near(reviewMA[10],128/3);near(ret(reviewPath[7],reviewPath[10]),-2.272727272727);
console.log(`Early-chapter arithmetic verified: ${checks} comparisons; chapters 1–19 and first four part reviews.`);
