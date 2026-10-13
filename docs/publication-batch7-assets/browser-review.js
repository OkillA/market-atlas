// Evaluated in the product-native T3 preview. Scripted checks are not pointer/print QA.
(async () => {
  const ids = ['testing', 'statistics', 'system-design', 'classical-frameworks', 'case-studies'];
  const records = [];
  const settle = () => new Promise(resolve => setTimeout(resolve, 100));
  const norm = value => String(value).replace(/\s+/g, ' ').trim();
  const visible = element => !!element && element.checkVisibility();
  for (const id of [...ids, 'advanced']) {
    const part = id === 'advanced';
    location.hash = part ? '#/practice/advanced' : '#/chapter/' + id;
    await settle();
    const chapter = ATLAS.chapters.find(c => c.id === id);
    const review = part ? ATLAS.partPractice.advanced : null;
    const main = document.querySelector('#main');
    const failures = [];
    const check = (condition, label) => { if (!condition) failures.push(label); };
    const solutions = [...main.querySelectorAll('details.solution')];
    const continuation = main.querySelector('.chapter-continuation');
    const initial = { continuation: continuation?.open ?? null, quizVisible: visible(main.querySelector('.quiz')), solutionsOpen: solutions.map(d => d.open) };
    check(solutions.every(d => !d.open), 'solutions initially concealed');
    if (chapter?.learnerAttempt) {
      check(continuation && !continuation.open, 'continuation initially concealed');
      check(!visible(main.querySelector('.quiz')), 'quiz concealed until continuation');
      const prelude = [...main.querySelectorAll('.article-section')].filter(s => !s.closest('.chapter-continuation'));
      check(prelude.length === (chapter.learnerAttempt.afterSection ?? -1) + 1, 'exact prerequisite prelude before attempt');
      check(visible(main.querySelector('#cutoff-attempt')), 'attempt visible');
      continuation.open = true;
      await settle();
    }
    const strings = part ? review.tasks.flatMap(t => [t.title, t.question, ...t.solution]) : [
      chapter.title, chapter.subtitle, chapter.takeaway,
      ...chapter.sections.flatMap(s => [s.title, ...s.paragraphs]),
      chapter.example.title, chapter.example.text, chapter.exercise, ...chapter.solution,
      ...chapter.practice.flatMap(t => [t.title, t.question, ...t.solution]),
      chapter.quiz.question, ...chapter.quiz.options, chapter.quiz.explanation,
      ...(chapter.learnerAttempt?.paragraphs || [])
    ];
    const text = norm(main.textContent);
    for (const string of strings) check(text.includes(norm(string)), 'missing text: ' + string.slice(0, 75));
    const tables = part ? review.tasks.flatMap(t => t.tables || []) : [
      ...chapter.sections.flatMap(s => s.tables || []),
      ...chapter.practice.flatMap(t => t.tables || []),
      ...(chapter.learnerAttempt?.tables || [])
    ];
    let cellsChecked = 0;
    for (const table of tables) {
      const candidates = [...main.querySelectorAll('.teaching-table')].filter(el => norm(el.querySelector('.table-caption')?.textContent) === norm(table.title || ''));
      const expected = [...table.columns, ...table.rows.flat()].map(norm);
      check(candidates.some(el => JSON.stringify([...el.querySelectorAll('th,td')].map(td => norm(td.textContent))) === JSON.stringify(expected)), 'table differs: ' + table.title);
      cellsChecked += expected.length;
    }
    const quizzes = [];
    if (chapter) for (let option = 0; option < chapter.quiz.options.length; option++) {
      main.querySelector('[data-answer="' + option + '"]').click();
      const expected = `${option === chapter.quiz.answer ? 'Correct.' : 'Try again.'} ${chapter.quiz.feedback?.[option] || chapter.quiz.explanation}`;
      const passes = main.querySelector('#quiz-feedback').textContent === expected;
      check(passes, 'quiz option ' + option);
      quizzes.push({ option, passes });
    }
    for (const solution of solutions) { solution.open = true; check(visible(solution.querySelector('p')), 'solution opens'); solution.open = false; }
    const palettes = [];
    for (const dark of [false, true]) {
      document.body.classList.toggle('dark', dark);
      await settle();
      const clipped = [];
      for (const svg of main.querySelectorAll('svg')) {
        const bounds = svg.getBoundingClientRect();
        if (!bounds.width || !bounds.height) continue;
        for (const label of svg.querySelectorAll('text')) {
          const b = label.getBoundingClientRect();
          if (b.left < bounds.left - 1 || b.right > bounds.right + 1 || b.top < bounds.top - 1 || b.bottom > bounds.bottom + 1) clipped.push(label.textContent);
        }
      }
      const overflow = document.documentElement.scrollWidth > innerWidth + 1;
      check(!clipped.length, 'clipped SVG text in ' + (dark ? 'dark' : 'light'));
      check(!overflow, 'page overflow');
      palettes.push({ palette: dark ? 'dark' : 'light', clipped, overflow });
    }
    document.body.classList.remove('dark');
    records.push({ id, route: location.hash, width: innerWidth, initial, stringsChecked: strings.length, cellsChecked, figures: main.querySelectorAll('svg').length, quizzes, palettes, failures });
  }
  return records;
})()
