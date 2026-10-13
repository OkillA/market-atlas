// Uses real print CSS and callbacks, applied to screen for policy inspection.
// This deliberately does not open a printer dialog or establish pagination.
(async () => {
  const css = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules]).filter(rule => rule.type === CSSRule.MEDIA_RULE && rule.conditionText === 'print').flatMap(rule => [...rule.cssRules].map(r => r.cssText)).join('\n');
  const style = document.createElement('style');style.textContent = css;
  const output = [];
  for (const id of ['system-design', 'case-studies']) {
    location.hash = '#/chapter/' + id;
    await new Promise(resolve => setTimeout(resolve, 100));
    const main = document.querySelector('#main');
    const originalOpen = [...main.querySelectorAll('details')].map(d => d.open);
    for (const answers of [false, true]) {
      document.body.classList.toggle('print-answers', answers);
      window.onbeforeprint();
      document.head.append(style);
      const inputs = [...main.querySelectorAll('.learner-attempt .teaching-table')];
      const solutionDisplays = [...main.querySelectorAll('details.solution')].map(d => getComputedStyle(d).display);
      const choices = [...main.querySelectorAll('.quiz-print-options li')];
      const quizAnswerDisplay = getComputedStyle(main.querySelector('.quiz-print-answer')).display;
      const inputVisible = inputs.every(el => el.checkVisibility());
      const passes = inputVisible && solutionDisplays.every(s => answers ? s !== 'none' : s === 'none') && choices.every(el => el.checkVisibility()) && (answers ? quizAnswerDisplay !== 'none' : quizAnswerDisplay === 'none');
      output.push({ id, width: innerWidth, answers, passes, inputVisible, inputCells: inputs.reduce((n, el) => n + el.querySelectorAll('th,td').length, 0), choices: choices.length, solutionDisplays, quizAnswerDisplay, continuationBreak: getComputedStyle(main.querySelector('.chapter-continuation')).breakBefore });
      style.remove(); window.onafterprint();
      output[output.length - 1].restored = JSON.stringify([...main.querySelectorAll('details')].map(d => d.open)) === JSON.stringify(originalOpen);
    }
  }
  return { method: 'actual print CSS/callbacks applied on screen; no native printer output', cases: output };
})()
