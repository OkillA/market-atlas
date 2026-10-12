(async () => {
document.querySelectorAll('.chapter-continuation,.data-table').forEach(el => el.open=true);
await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const chapter=ATLAS.chapters.find(c=>location.hash.includes('/'+c.id)), figures=[chapter.figure,...(chapter.figures||[])].filter(Boolean);
const missingCells=[], hiddenMarkers=[], clippedTexts=[];
const intersect=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
figures.forEach((figure,i)=>{
const mount=document.querySelector('#chapter-figure-'+i), tables=mount.querySelectorAll('.data-table table');
AtlasFigures.flatten(figure).forEach((panel,p)=>{
if(!panel.series) return;
const expected=panel.series[0].values.flatMap((_,j)=>[AtlasFigures.observation(panel,j),...panel.series.map(s=>s.values[j]??'—')]).map(String);
const actual=[...tables[p].querySelectorAll('tbody td')].map(el=>el.textContent);
expected.forEach((value,j)=>{if(actual[j]!==value)missingCells.push({figure:i,panel:p,cell:j,value,actual:actual[j]});});
});
});
const svgs=[...document.querySelectorAll('.figure-chart svg')];
svgs.forEach((svg,i)=>{
const labels=[...svg.querySelectorAll('rect[opacity=".92"],rect[opacity=".95"]')].map(el=>el.getBoundingClientRect());
svg.querySelectorAll('circle').forEach(el=>{if(labels.some(b=>intersect(el.getBoundingClientRect(),b)))hiddenMarkers.push({figure:i,value:el.getAttribute('data-value')});});
const bound=svg.getBoundingClientRect();
svg.querySelectorAll('text').forEach(el=>{const b=el.getBoundingClientRect();if(b.left<bound.left-.5||b.right>bound.right+.5)clippedTexts.push(el.textContent);});
});
return {chapter:chapter.id,width:innerWidth,svgWidths:svgs.map(el=>el.viewBox.baseVal.width),pageOverflow:document.documentElement.scrollWidth>innerWidth,missingCells,hiddenMarkers,clippedTexts,figureTables:document.querySelectorAll('.data-table table').length};
})()
