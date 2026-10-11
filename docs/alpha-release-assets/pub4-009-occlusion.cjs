const R=require('../../figure-renderer.js');const d=require('../../content/risk-advanced.json');
const base=d.chapters.find(c=>c.id=='system-design').figure.panels[0];
function occl(svg){
  const pd=svg.match(/<path data-series="0" d="([^"]+)"/)[1];
  const pts=[...pd.matchAll(/[ML]\s*([\d.]+)[ ,]([\d.]+)/g)].map(m=>[+m[1],+m[2]]);
  const rects=[...svg.matchAll(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)" fill="[^"]+" opacity=".92"/g)].map(m=>m.slice(1).map(Number));
  const circles=[...svg.matchAll(/<circle [^>]*cx="([\d.]+)" cy="([\d.]+)"/g)].map(m=>[+m[1],+m[2]]);
  let n=0,N=1000,len=[],tot=0;for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);len.push(l);tot+=l;}
  for(let k=0;k<N;k++){let t=tot*(k+.5)/N,i=0;while(t>len[i]){t-=len[i];i++;}const f=t/len[i];const x=pts[i][0]+f*(pts[i+1][0]-pts[i][0]),y=pts[i][1]+f*(pts[i+1][1]-pts[i][1]);
    if(rects.some(([rx,ry,w,h])=>x>=rx&&x<=rx+w&&y>=ry&&y<=ry+h))n++;}
  const hiddenMarkers=circles.filter(([cx,cy])=>rects.some(([rx,ry,w,h])=>cx>=rx-1&&cx<=rx+w+1&&cy>=ry-1&&cy<=ry+h+1)).length;
  return {n,hiddenMarkers};
}
module.exports={occl,base,R};
if(require.main===module){
 const names={2:['S2 Hazel','S2'],4:['S4 Fir','S4'],5:['S5 Birch','S5'],6:['S6 Alder','S6']};
 const pl=['above','below','above-left','below-left'];
 const res=[];
 const cur=JSON.parse(JSON.stringify(base));for(const w of [260,320,760])console.log('current',w,occl(R.render(cur,{width:w})));
 for(const useName of [true,false]) {
  const combos=[[]];for(const idx of [2,4,5,6]){const nx=[];for(const c of combos)for(const p of pl)nx.push([...c,p]);combos.splice(0,combos.length,...nx);}
  for(const c of combos){const f=JSON.parse(JSON.stringify(base));f.annotations.forEach((a,i)=>{a.shortLabel=names[a.index][useName?0:1];a.placement=c[i];});
   const r=[260,320,760].map(w=>occl(R.render(f,{width:w})));const score=r.reduce((s,x)=>s+x.n+1000*x.hiddenMarkers,0);res.push({useName,c,r,score});}
 }
 res.sort((a,b)=>a.score-b.score);for(const x of res.slice(0,8))console.log(JSON.stringify(x));
}
