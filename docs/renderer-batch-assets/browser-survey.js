// Native browser metrics differ from the portable font-width fallback; inspect both.
window.runFigureSurvey = function(renderer, theme) {
  const host = document.querySelector('#probe'), records = [];
  document.body.classList.toggle('dark', theme === 'dynamic');
  const intersects = (a,b) => a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;
  for (const chapter of ATLAS.chapters) {
    const figures = [chapter.figure,...(chapter.figures||[]),...(chapter.learnerAttempt?.figures||[])].filter(Boolean);
    figures.forEach((figure,i) => AtlasFigures.flatten(figure).forEach((spec,panel) => {
      if (!spec.series && spec.kind !== 'candles') return;
      for (const width of [260,320,390,760]) {
        host.innerHTML = renderer.render(spec,{width,theme});
        const svg = host.querySelector('svg'), labels = [...svg.querySelectorAll('rect[opacity=".92"],rect[opacity=".95"]')].map(el=>el.getBBox());
        const hidden = [...svg.querySelectorAll('circle')].filter(el => labels.some(b=>intersects(el.getBBox(),b))).length;
        const grid = [...svg.querySelectorAll('line')].find(el => !el.hasAttribute('stroke-width'));
        const barsOutsidePlot = [...svg.querySelectorAll('rect[opacity=".75"]')].filter(el => {const b=el.getBBox();return b.x < +grid.getAttribute('x1')-.01 || b.x+b.width > +grid.getAttribute('x2')+.01;}).length;
        const clips = [...svg.querySelectorAll('text')].filter(el=>{const b=el.getBBox();return b.x < -.5 || b.x+b.width > width+.5;}).map(el=>el.textContent);
        records.push({chapter:chapter.id,figure:i,panel,width,hidden,barsOutsidePlot,clips});
      }
    }));
  }
  host.innerHTML='';document.body.classList.remove('dark');
  return {theme,summary:{renders:records.length,hiddenMarkers:records.reduce((n,r)=>n+r.hidden,0),barsOutsidePlot:records.reduce((n,r)=>n+r.barsOutsidePlot,0),textClips:records.reduce((n,r)=>n+r.clips.length,0)},records};
};
