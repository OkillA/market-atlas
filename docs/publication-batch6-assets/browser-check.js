(async () => {
  const id=location.hash.split('/').at(-1), isPart=location.hash.startsWith('#/practice/');
  const chapter=isPart?null:ATLAS.chapters.find(c=>c.id===id), practice=isPart?ATLAS.partPractice[id]:null;
  const main=document.querySelector('#main'), missing=[], failures=[];
  const initial={continuation:document.querySelector('.chapter-continuation')?.open??null,solutions:[...main.querySelectorAll('details.solution')].map(el=>el.open),quizVisible:document.querySelector('#knowledge-check')?.checkVisibility()??false};
  if(initial.solutions.some(Boolean))failures.push('solution initially open');
  if(chapter?.learnerAttempt && (initial.continuation || initial.quizVisible))failures.push('continuation/quiz exposed before attempt');
  main.querySelectorAll('details').forEach(el=>el.open=true);
  // Print preparation/restoration forces the app to redraw opened figures synchronously; no printer is invoked.
  window.onbeforeprint?.(); window.onafterprint?.();
  const strings=isPart?practice.tasks.flatMap(t=>[t.title,t.question,...t.solution]):[
    ...chapter.sections.flatMap(s=>[s.title,...s.paragraphs]),chapter.example.text,chapter.exercise,...chapter.solution,
    ...chapter.practice.flatMap(t=>[t.title,t.question,...t.solution]),chapter.quiz.question,...chapter.quiz.options,
    ...(chapter.learnerAttempt?.paragraphs||[])
  ];
  strings.forEach(s=>{if(!main.textContent.includes(s))missing.push(s.slice(0,100));});
  const expectedTables=[];
  if(isPart)practice.tasks.forEach(t=>expectedTables.push(...(t.tables||[])));
  else {
    chapter.sections.forEach(s=>expectedTables.push(...(s.tables||[])));
    expectedTables.push(...(chapter.learnerAttempt?.tables||[]));
    chapter.practice.forEach(t=>expectedTables.push(...(t.tables||[])));
    [chapter.figure,...(chapter.figures||[])].filter(Boolean).forEach(f=>AtlasFigures.flatten(f).forEach(p=>{
      if(p.series)expectedTables.push({title:p.title,rows:p.series[0].values.map((_,i)=>[AtlasFigures.observation(p,i),...p.series.map(s=>s.values[i]??'—')])});
      else if(p.kind==='table')expectedTables.push(p);
    }));
  }
  let cellsChecked=0;
  expectedTables.forEach(t=>{
    const expected=t.rows.flat().map(String);cellsChecked+=expected.length;
    const matches=[...main.querySelectorAll('table')].filter(table=>table.querySelector('caption')?.textContent===t.title);
    const match=matches.find(table=>{const actual=[...table.querySelectorAll('tbody td')].map(el=>el.textContent);return actual.length===expected.length&&actual.every((s,i)=>s===expected[i]);});
    if(!match)failures.push('missing/mismatched table '+t.title);
  });
  const quiz=[];
  if(chapter)for(const button of main.querySelectorAll('[data-answer]')){
    button.click();const option=+button.dataset.answer,expected=(option===chapter.quiz.answer?'Correct. ':'Try again. ')+chapter.quiz.feedback[option];
    quiz.push({option,correct:document.querySelector('#quiz-feedback').textContent===expected});
  }
  const palettes=[];
  const wasDark=document.body.classList.contains('dark');
  for(const dark of [false,true]){
    document.body.classList.toggle('dark',dark);const clips=[];
    main.querySelectorAll('.figure-chart svg').forEach(svg=>{const bound=svg.getBoundingClientRect();svg.querySelectorAll('text').forEach(el=>{const b=el.getBoundingClientRect();if(b.left<bound.left-.5||b.right>bound.right+.5)clips.push(el.textContent);});});
    palettes.push({palette:dark?'dark':'light',clippedSvgText:clips,pageOverflow:document.documentElement.scrollWidth>innerWidth});
  }
  document.body.classList.toggle('dark',wasDark);
  // Test the actual print stylesheet's display policy in the native browser;
  // this applies print rules to screen and is explicitly NOT printer pagination.
  const printPolicies=[];
  if(chapter){
    const printRules=[...document.styleSheets].flatMap(sheet=>[...sheet.cssRules].filter(r=>r.type===CSSRule.MEDIA_RULE&&r.conditionText.includes('print')).flatMap(r=>[...r.cssRules].map(rule=>rule.cssText))).join('\n');
    const style=document.createElement('style');style.textContent=printRules;document.head.append(style);
    for(const answers of [false,true]){
      document.body.classList.toggle('print-answers',answers);window.onbeforeprint?.();
      const solutionDisplays=[...main.querySelectorAll('details.solution')].map(el=>getComputedStyle(el).display);
      const newInput=chapter.id==='journaling'?main.querySelector('#practice-audit-a-journal-summary table'):main.querySelector('.learner-attempt table');
      const inputVisible=!!newInput?.getClientRects().length;
      printPolicies.push({answers,solutionDisplays,inputVisible,tableCells:newInput?.querySelectorAll('tbody td').length??0});
      window.onafterprint?.();
    }
    style.remove();document.body.classList.remove('print-answers');
  }
  const result={route:location.hash,width:innerWidth,initial,stringsChecked:strings.length,cellsChecked,missing,failures,quiz,palettes,printPolicies,figures:main.querySelectorAll('.figure-chart svg').length};
  main.querySelectorAll('details.solution').forEach(el=>el.open=false);
  return result;
})()
