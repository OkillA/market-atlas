// Usage: node occl-all.cjs <repoRoot> [bookOverrideJsonDir]
const path=require('path');const root=process.argv[2];
global.window=global;require(path.join(root,'content/book.js'));const B=window.ATLAS;const R=require(path.join(root,'figure-renderer.js'));
function measure(svg){
  const rects=[...svg.matchAll(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)" fill="[^"]+" opacity=".9[0-9]"/g)].map(m=>m.slice(1).map(Number));
  const circles=[...svg.matchAll(/<circle [^>]*cx="([\d.]+)" cy="([\d.]+)"/g)].map(m=>[+m[1],+m[2]]);
  let covered=0,total=0;
  for(const m of svg.matchAll(/<path data-series="\d+" d="([^"]+)"/g)){
    const segs=m[1].split(/(?=M)/).map(s=>[...s.matchAll(/([\d.]+)[ ,]([\d.]+)/g)].map(p=>[+p[1],+p[2]]));
    for(const pts of segs){for(let i=1;i<pts.length;i++){const [a,b]=[pts[i-1],pts[i]];const n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));for(let k=0;k<n;k++){const t=(k+.5)/n,x=a[0]+t*(b[0]-a[0]),y=a[1]+t*(b[1]-a[1]);total++;if(rects.some(([rx,ry,w,h])=>x>=rx&&x<=rx+w&&y>=ry&&y<=ry+h))covered++;}}}
  }
  const lines=[...svg.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="[^"]+" stroke-width="(?!\.7)/g)].map(m=>m.slice(1).map(Number)); // wicks etc
  let wickCovered=0;for(const [x1,y1,x2,y2] of lines){const n=40;for(let k=0;k<n;k++){const t=(k+.5)/n,x=x1+t*(x2-x1),y=y1+t*(y2-y1);if(rects.some(([rx,ry,w,h])=>x>=rx&&x<=rx+w&&y>=ry&&y<=ry+h))wickCovered++;}}
  const hidden=circles.filter(([cx,cy])=>rects.some(([rx,ry,w,h])=>cx>=rx-1&&cx<=rx+w+1&&cy>=ry-1&&cy<=ry+h+1)).length;
  return {pathPx:total,covered,pct:total?+(100*covered/total).toFixed(1):0,hiddenMarkers:hidden,otherStrokeSamplesCovered:wickCovered};
}
const out=[];
for(const id of ["relative-strength","breadth","multi-timeframe","events","market-microstructure"]){const c=B.chapters.find(c=>c.id==id);
 [c.figure,...(c.figures||[])].filter(Boolean).forEach((f,i)=>{const panels=R.flatten(f);panels.forEach((p,j)=>{if(!['line','candles','bars',undefined].includes(p.kind))return;
  for(const w of [260,320,760]){const r=measure(R.render(p,{width:w}));if(r.covered||r.hiddenMarkers||r.otherStrokeSamplesCovered)out.push({fig:`${id}${i?'-'+(i+1):''}`,panel:j,title:p.title,w,...r});}})})}
console.log(JSON.stringify(out,null,0).replace(/},{/g,'},\n{'));
