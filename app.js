(() => {
  'use strict';
  const book = window.ATLAS;
  if (!book) return;
  const chapters = new Map(book.chapters.map(chapter => [chapter.id, chapter]));
  const sequence = book.parts.flatMap(part => part.chapters);
  const readable = sequence.filter(id => chapters.get(id).status !== 'planned');
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const link = id => `#/chapter/${id}`;
  const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sectionID = section => `section-${section.id || slug(section.title)}`;
  const sectionLink = (id, section) => `${link(id)}/at/${sectionID(section)}`;
  const resumeLink = id => state.positions[id] ? `${link(id)}/at/${state.positions[id]}` : link(id);
  const labFor = { 'chart-anatomy': 'candle', 'candlestick-patterns': 'candle', trends: 'trend', 'moving-averages': 'average', 'risk-sizing': 'risk' };
  const noteLimit = 50000;
  // A UTF-16 unit can require up to six ASCII bytes when JSON escapes it.
  const backupByteLimit = book.chapters.length * noteLimit * 6 + 1024 * 1024;
  const partFor = id => book.parts.find(part => part.chapters.includes(id));
  const storageKey = 'market-atlas-reader-v1';
  let storageAvailable = true;
  let state = { completed: [], bookmarks: [], notes: {}, lastRead: null, positions: {}, theme: 'light' };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      state.completed = Array.isArray(saved.completed) ? saved.completed.filter(id => readable.includes(id)) : [];
      state.bookmarks = Array.isArray(saved.bookmarks) ? saved.bookmarks.filter(id => chapters.has(id)) : [];
      state.notes = saved.notes && typeof saved.notes === 'object' && !Array.isArray(saved.notes) ? Object.fromEntries(Object.entries(saved.notes).filter(([id, note]) => chapters.has(id) && typeof note === 'string')) : {};
      state.lastRead = readable.includes(saved.lastRead) ? saved.lastRead : null;
      state.positions = saved.positions && typeof saved.positions === 'object' ? Object.fromEntries(Object.entries(saved.positions).filter(([id, anchor]) => chapters.has(id) && typeof anchor === 'string' && anchor.length < 240)) : {};
      state.theme = saved.theme === 'dark' ? 'dark' : 'light';
    }
  } catch { storageAvailable = false; }
  document.body.classList.toggle('dark', state.theme === 'dark');
  let activeChapter = null;
  let toastTimer;
  let labTab = 'candle';
  let chartRedraw = null;
  let printing = false;
  function syncSidebar() {
    $('#sidebar').inert = window.innerWidth <= 760 && !$('#sidebar').classList.contains('open');
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); storageAvailable = true; return true; }
    catch { storageAvailable = false; return false; }
  }
  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2800);
  }
  function updateProgress() {
    $('#progress-count').textContent = `${state.completed.length} / ${readable.length}`;
    $('#reading-progress').max = readable.length;
    $('#reading-progress').value = state.completed.length;
    $('#theme-toggle').setAttribute('aria-label', `Switch to ${state.theme === 'dark' ? 'light' : 'dark'} theme`);
  }
  function mount(content, breadcrumb, nav) {
    $('#main').innerHTML = content;
    $('#breadcrumb').textContent = breadcrumb;
    $('.sidebar').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    syncSidebar();
    document.querySelectorAll('[data-nav]').forEach(anchor => {
      const active = anchor.dataset.nav === nav;
      anchor.classList.toggle('active', active);
      if (active) anchor.setAttribute('aria-current', 'page'); else anchor.removeAttribute('aria-current');
    });
    $('#chapter-contents-button').hidden = true;
    window.onbeforeprint = null; window.onafterprint = null;
    printing = false;
    chartRedraw = null;
    window.scrollTo(0, 0);
    updateProgress();
  }
  const svg = (title, content, width = 640, height = 320, desc = '') => `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${desc ? `<desc>${esc(desc)}</desc>` : ''}${content}</svg>`;
  function overviewIllustration() {
    const closes = [51, 52, 50, 54, 56, 55, 59, 58, 61, 64, 61, 63, 65, 63, 67, 69, 68, 72, 70, 75, 74, 77, 80, 78];
    let marks = '';
    for (let i = 0; i < closes.length; i++) {
      const open = i ? closes[i - 1] : 49;
      const close = closes[i];
      const x = 25 + i * 13.8;
      const y = value => 230 - (value - 44) * 5;
      const type = close >= open ? 'up' : 'down';
      marks += `<line x1="${x}" y1="${y(Math.max(open, close) + 2)}" x2="${x}" y2="${y(Math.min(open, close) - 2)}" class="${type}" stroke-width="1.2"/><rect x="${x - 3.8}" y="${Math.min(y(open), y(close))}" width="7.6" height="${Math.max(2, Math.abs(y(open) - y(close)))}" class="${type}" stroke-width="0"/>`;
      marks += `<rect x="${x - 4}" y="${285 - (13 + (i * 13 % 33))}" width="8" height="${13 + (i * 13 % 33)}" fill="var(--green)" opacity=".17"/>`;
    }
    const grid = [55, 65, 75].map(n => `<line x1="12" y1="${230 - (n - 44) * 5}" x2="350" y2="${230 - (n - 44) * 5}" class="grid"/><text x="360" y="${234 - (n - 44) * 5}" font-size="10">$${n}</text>`).join('');
    const averagePoints = closes.map((_, i) => { const mean = closes.slice(Math.max(0, i - 5), i + 1).reduce((a, b) => a + b, 0) / Math.min(6, i + 1); return `${25 + i * 13.8},${230 - (mean - 44) * 5}`; }).join(' ');
    return svg('Fictional stock candles rise over 24 sessions, with a trailing average and volume bars.', `${grid}${marks}<polyline points="${averagePoints}" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="12" y1="240" x2="350" y2="240" class="grid"/><text x="15" y="306">Session 1</text><text x="290" y="306">Session 24</text>`, 395, 322);
  }
  function stats() {
    const words = book.chapters.filter(chapter => chapter.sections).reduce((sum, chapter) => sum + chapter.sections.flatMap(section => section.paragraphs).join(' ').split(/\s+/).length, 0);
    return { words, count: readable.length };
  }
  function renderHome() {
    const next = state.lastRead || readable[0];
    const counts = stats();
    mount(`<section class="hero"><div class="hero-copy"><h1>Learn to read<br>the <em>market.</em></h1><p>A guide to technical analysis for stocks, from your first candlestick to judging whether an analysis deserves your trust.</p><div class="hero-actions"><a href="${resumeLink(next)}" class="button primary">${state.lastRead ? 'Continue reading' : 'Start reading'} <span>↗</span></a><a href="#/contents" class="button text">Contents <span>→</span></a></div></div><div class="hero-art"><div class="chart-sheet">${overviewIllustration()}</div></div></section><section><div class="section-heading"><h2>Six parts</h2><a href="#/contents">Full contents →</a></div><div class="path-grid">${book.parts.map(part => { const available = part.chapters.filter(id => readable.includes(id)).length; return `<a class="part-card" href="#/contents/${part.id}"><div class="part-card-top"><span class="part-number">${part.number}</span><span class="level">${part.level}</span></div><h3>${part.title}</h3><div class="part-card-footer"><span>${part.chapters.length} chapters${available !== part.chapters.length ? ` · ${available} available` : ''}</span><span>↗</span></div></a>`; }).join('')}</div></section><section class="featured"><div><h3>Chart playground</h3><p>Change candles, trends, moving averages and position size, and watch the numbers respond.</p></div><a href="#/lab" class="button">Open the playground <span>→</span></a></section><p class="review-state">${book.manuscript ? `Draft edition · ${counts.count} chapters in editorial review.` : '8 introductory chapters available. The remaining chapters currently contain curriculum outlines.'} <a href="#/about">About this edition →</a></p>`, 'Overview', 'home');
    document.title = 'Market Atlas — A field guide to technical analysis';
  }
  function chapterRow(id) {
    const chapter = chapters.get(id);
    const index = sequence.indexOf(id) + 1;
    const status = state.completed.includes(id) ? '✓ Read' : chapter.status === 'planned' ? 'Curriculum outline' : `${chapter.minutes} min prose + practice${chapter.status === 'draft' ? ' · Draft' : ' · Introductory'}`;
    return `<a class="chapter-row" href="${link(id)}"><span class="number">${String(index).padStart(2, '0')}</span><div><strong>${esc(chapter.title)}</strong><p>${esc(chapter.subtitle)}</p></div><span class="chapter-status">${status}</span><span class="arrow">↗</span></a>`;
  }
  function renderContents(partID) {
    mount(`<div class="page-intro"><div class="eyebrow">A book, one chapter at a time</div><h1>The table of contents</h1><p>Read in order to build a foundation, or follow a question to the chapter you need. Risk and evidence belong alongside chart reading from the beginning.</p></div><div class="status-note">${book.manuscript ? 'This manuscript contains 28 draft chapters. Source-linked definitions and fictional illustrations are included; the full book still needs editorial and subject-matter review.' : 'The starter edition has 8 introductory chapters. The other 20 topics are outlined for the full manuscript.'}</div>${book.parts.map(part => `<section class="toc-part" id="part-${part.id}"><div class="toc-heading"><span>${part.number}</span><div><h2>${part.title}</h2><p>${part.description}</p></div></div><div class="chapter-list">${part.chapters.map(chapterRow).join('')}</div>${book.partPractice?.[part.id] ? `<p><a href="#/practice/${part.id}">Part ${part.number} review: apply what you learned →</a></p>` : ''}</section>`).join('')}`, 'The book / Table of contents', 'contents');
    if (partID && book.parts.some(part => part.id === partID)) document.getElementById(`part-${partID}`).scrollIntoView();
    document.title = 'Contents — Market Atlas';
  }
  function renderChapter(id, anchor) {
    const chapter = chapters.get(id);
    if (!chapter) return renderNotFound();
    activeChapter = id;
    const part = partFor(id);
    const index = sequence.indexOf(id);
    const header = `<header class="article-header"><div class="eyebrow">Part ${part.number} · Chapter ${String(index + 1).padStart(2, '0')}</div><h1>${esc(chapter.title)}</h1><p class="article-deck">${esc(chapter.subtitle)}</p><p class="print-policy">Learner edition: try the questions before the continuation; worked solutions are omitted.</p><div class="article-meta"><span>${part.level.toLowerCase()}</span><span>${chapter.status === 'planned' ? 'Curriculum outline' : `About ${chapter.minutes} min of prose · practice takes additional time`}</span><span>${chapter.status === 'draft' ? 'Draft manuscript · source notes below' : chapter.status === 'planned' ? 'Full chapter in development' : 'Introductory chapter'}</span></div></header>`;
    if (chapter.status === 'planned') {
      mount(`<div class="prose-page">${header}<div class="status-note">This is an outline for the full book, rather than a completed lesson.</div><h2>What this chapter will cover</h2><ul class="outline-list">${chapter.outline.split(';').map(item => `<li>${esc(item.trim())}</li>`).join('')}</ul><p>The finished chapter will include a narrative explanation, numerical examples, annotated illustrations, exercises, failure cases, and source notes.</p><div class="chapter-end"><a href="#/contents">← Table of contents</a><a href="${link('testing')}">Read: Evidence before conviction →</a></div></div>`, `The book / ${part.short}`, 'contents');
      document.title = `${chapter.title} — Market Atlas`;
      return;
    }
    state.lastRead = id;
    save();
    const bookmarked = state.bookmarks.includes(id);
    const completed = state.completed.includes(id);
    const notes = state.notes[id] || '';
    const figures = [chapter.figure, ...(chapter.figures || [])].filter(Boolean);
    const learner = chapter.learnerAttempt;
    const cutoffAfter = learner?.afterSection ?? -1;
    const sectionLinks = chapter.sections.map(section => `<a href="${sectionLink(id, section)}">${esc(section.title)}</a>`);
    const endLinks = `<a href="${link(id)}/at/exercises">Exercises & practice</a><a href="${link(id)}/at/sources">Sources & evidence</a>`;
    const contentsLinks = learner ? sectionLinks.slice(0, cutoffAfter + 1).join('') + `<a href="${link(id)}/at/cutoff-attempt">Attempt worksheet</a>` + sectionLinks.slice(cutoffAfter + 1).join('') + endLinks : sectionLinks.join('') + endLinks;
    const preludeLinks = learner ? sectionLinks.slice(0, cutoffAfter + 1).join('') : '';
    const continuationLinks = sectionLinks.slice(cutoffAfter + 1).join('') + endLinks;
    const preludeIDs = chapter.sections.slice(0, cutoffAfter + 1).map(sectionID);
    const revealContinuation = !!(anchor && anchor !== 'cutoff-attempt' && !preludeIDs.includes(anchor));
    const sectionBlocks = chapter.sections.map((section, i) => `<section class="article-section"><h2 id="${sectionID(section)}" tabindex="-1">${esc(section.title)}${section.optional ? ' · Optional extension' : ''}</h2>${section.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}${(section.tables || []).map(tableMarkup).join('')}</section>${figures.map((figure, index) => (figure.afterSection ?? 0) === i ? `<div id="chapter-figure-${index}"></div>` : '').join('')}`);
    const prelude = learner ? sectionBlocks.slice(0, cutoffAfter + 1).join('') : '';
    const reference = learner ? sectionBlocks.slice(cutoffAfter + 1).join('') : sectionBlocks.join('');
    const attempt = learner ? `<section class="learner-attempt" id="cutoff-attempt"><h2>${esc(learner.title)}</h2>${learner.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}${(learner.tables || []).map(tableMarkup).join('')}${(learner.figures || []).map((_, i) => `<div id="attempt-figure-${i}"></div>`).join('')}<label for="cutoff-note">Your attempt notes (saved with this chapter)</label><textarea id="cutoff-note" maxlength="50000" placeholder="Record your working, conditions and unknowns before revealing…">${esc(notes)}</textarea><small class="cutoff-save-status">Notes save in this browser; export from My notebook.</small></section><details class="chapter-continuation" ${revealContinuation ? 'open' : ''}><summary>Reveal continuation, explanations & complete reference</summary><p class="continuation-policy">Compare the continuation with your frozen note. This reference includes outcome headings, complete ledgers and solutions. In the learner print edition it starts on a new page after the cutoff packet.</p>` : '';
    const orientation = chapter.outcomes?.length ? `<div class="chapter-orientation"><strong>${chapter.optional ? 'Optional extension' : 'By the end of this chapter'}</strong><ul>${(chapter.outcomes || []).map(outcome => `<li>${esc(outcome)}</li>`).join('')}</ul>${chapter.prerequisites?.length ? `<p>Builds on: ${chapter.prerequisites.map(id => `<a href="${link(id)}">${esc(chapters.get(id).title)}</a>`).join(' · ')}</p>` : ''}</div>` : chapter.optional ? '<div class="chapter-orientation"><strong>Optional extension</strong></div>' : '';
    mount(`<div class="reading-layout"><article>${header}<div class="article-tools"><button id="bookmark" aria-pressed="${bookmarked}">${bookmarked ? '✓ Bookmarked' : '+ Bookmark chapter'}</button><button id="print-chapter">Print learner edition</button><button id="print-answers">Print with answers</button><a class="button small" href="#/lab${labFor[id] ? `/${labFor[id]}` : ''}">${labFor[id] ? 'Try this chapter’s experiment' : 'Explore chart experiments'} ↗</a><a href="#/evidence/at/evidence-${id}">Study specifications & limits</a><a href="${link(id)}">Start at beginning</a></div><blockquote class="takeaway"><span>THE IDEA TO KEEP</span>${esc(chapter.takeaway)}</blockquote>${orientation}${prelude}${attempt}${reference}<section class="worked-example" id="worked-example" tabindex="-1"><div class="eyebrow">A worked example</div><h3>${esc(chapter.example.title)}</h3><p>${esc(chapter.example.text)}</p></section><section class="exercise" id="exercises" tabindex="-1"><h3>Pause & try it</h3><p>${esc(chapter.exercise)}</p>${solutionMarkup(chapter.solution || [])}</section>${(chapter.practice || []).map(task => `<section class="exercise" id="practice-${slug(task.title)}" tabindex="-1"><div class="eyebrow">${esc(task.level)} practice</div><h3>${esc(task.title)}</h3><p>${esc(task.question)}</p>${(task.tables || []).map(tableMarkup).join('')}${solutionMarkup(task.solution)}</section>`).join('')}<section class="quiz" id="knowledge-check" tabindex="-1" aria-labelledby="quiz-title"><div class="eyebrow">Check your understanding</div><h3 id="quiz-title">One question before you go</h3><p>${esc(chapter.quiz.question)}</p><div class="quiz-options">${chapter.quiz.options.map((option, i) => `<button type="button" data-answer="${i}" aria-pressed="false"><span>${String.fromCharCode(65 + i)}</span><span class="quiz-option-text">${esc(option)}</span></button>`).join('')}</div><ol class="quiz-print-options" type="A">${chapter.quiz.options.map(option => `<li>${esc(option)}</li>`).join('')}</ol><div class="quiz-feedback" id="quiz-feedback" aria-live="polite"></div><div class="quiz-print-answer"><strong>Answer: ${String.fromCharCode(65 + chapter.quiz.answer)}.</strong> ${esc(chapter.quiz.explanation)}</div></section><section class="sources" id="sources" tabindex="-1"><h3>Sources & further reading</h3><ul>${chapter.sources.map(sourceID => { const source = book.sources[sourceID]; return source ? `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a><small>${esc(source.supports)}${source.accessed ? ` Access recorded ${esc(source.accessed)}.` : ''}</small></li>` : ''; }).join('')}</ul><small>Teaching examples are fictional unless labelled historical. <a href="#/evidence/at/evidence-${id}">Inspect this chapter’s evidence</a>. Sources support the specified concepts; they do not validate a profitable trading strategy.</small></section><div class="related">${(chapter.related || []).filter(other => chapters.has(other)).map(other => `<a href="${link(other)}">${esc(chapters.get(other).title)} ↗</a>`).join('')}</div>${learner ? '</details>' : ''}<div class="note-box"><label for="chapter-note">YOUR NOTES FOR THIS CHAPTER</label><textarea id="chapter-note" maxlength="50000" placeholder="What clicked? What would you like to revisit?">${esc(notes)}</textarea><small id="note-status">${storageAvailable ? 'Notes save automatically in this browser. Back them up from My notebook.' : 'Browser storage is unavailable. Notes are kept only for this session; export from My notebook.'}</small></div><button id="complete-chapter" class="button primary complete-button">${completed ? '✓ Chapter read · Mark unread' : 'Mark this chapter as read ✓'}</button>${book.partPractice?.[part.id] ? `<p><a href="#/practice/${part.id}">Practice & review this part →</a></p>` : ''}<div class="chapter-end">${index > 0 ? `<a href="${link(sequence[index - 1])}">← ${esc(chapters.get(sequence[index - 1]).title)}</a>` : '<a href="#/contents">← Table of contents</a>'}${index < sequence.length - 1 ? `<a href="${link(sequence[index + 1])}">${esc(chapters.get(sequence[index + 1]).title)} →</a>` : '<a href="#/contents">Return to contents →</a>'}</div></article><aside class="reading-aside" aria-label="On this page"><strong>IN THIS CHAPTER</strong>${learner ? `${preludeLinks}<a href="${link(id)}/at/cutoff-attempt">Attempt worksheet</a><button class="button small" data-reveal-contents>Reveal chapter contents</button><div class="continuation-contents" ${revealContinuation ? '' : 'hidden'}>${continuationLinks}</div>` : contentsLinks}<div class="aside-note">Read slowly. Describe what you see before deciding what it means.</div></aside></div>`, `The book / ${part.short}`, 'contents');
    document.title = `${chapter.title} — Market Atlas`;
    $('#bookmark').addEventListener('click', () => {
      const saved = state.bookmarks.includes(id);
      state.bookmarks = saved ? state.bookmarks.filter(item => item !== id) : [...state.bookmarks, id];
      save();
      $('#bookmark').setAttribute('aria-pressed', String(!saved));
      $('#bookmark').textContent = saved ? '+ Bookmark chapter' : '✓ Bookmarked';
      toast(saved ? 'Bookmark removed' : 'Chapter bookmarked');
    });
    $('#chapter-contents-button').hidden = false;
    const chapterContents = () => {
      $('#contents-heading').textContent = chapter.title;
      $('#contents-links').innerHTML = learner && !$('.chapter-continuation').open ? `${preludeLinks}<a href="${link(id)}/at/cutoff-attempt">Attempt worksheet</a><button class="button" id="reveal-mobile-contents">Reveal continuation & contents</button>` : contentsLinks;
      $('#contents-dialog').showModal();
      $('#reveal-mobile-contents')?.addEventListener('click', () => { $('.chapter-continuation').open = true; $('#contents-links').innerHTML = contentsLinks; });
    };
    $('#chapter-contents-button').onclick = chapterContents;
    $('[data-reveal-contents]')?.addEventListener('click', () => { $('.chapter-continuation').open = true; });
    $('.chapter-continuation')?.addEventListener('toggle', event => {
      const contents = $('.continuation-contents'); if (contents) contents.hidden = !event.target.open;
      if (event.target.open && chartRedraw) chartRedraw();
    });
    let printRestore = null;
    const preparePrint = () => {
      if (printRestore) return;
      const details = [...document.querySelectorAll('#main details')];
      const previous = details.map(item => item.open);
      printing = true;
      details.forEach(item => { item.open = !item.classList.contains('solution') || document.body.classList.contains('print-answers'); });
      if (chartRedraw) chartRedraw();
      printRestore = () => {
        details.forEach((item, i) => { item.open = previous[i]; });
        document.body.classList.remove('print-answers');
        printing = false;
        if (chartRedraw) chartRedraw();
        $('.print-policy').textContent = 'Learner edition: try the questions before the continuation; worked solutions are omitted.';
        printRestore = null;
      };
    };
    const printEdition = answers => {
      document.body.classList.toggle('print-answers', answers);
      $('.print-policy').textContent = answers ? 'Answer edition: includes continuation, worked solutions and the knowledge-check answer.' : 'Learner edition: attempt first; continuation reference starts on a new page where supplied. Worked solutions and quiz answers are omitted.';
      preparePrint(); window.print();
    };
    window.onbeforeprint = preparePrint;
    window.onafterprint = () => printRestore?.();
    $('#print-chapter').addEventListener('click', () => printEdition(false));
    $('#print-answers').addEventListener('click', () => printEdition(true));
    $('#chapter-note').addEventListener('input', event => {
      state.notes[id] = event.target.value;
      if ($('#cutoff-note')) $('#cutoff-note').value = event.target.value;
      const persisted = save();
      $('#note-status').textContent = persisted ? 'Saved in this browser. Back up notes from My notebook.' : 'Browser storage is unavailable. Export your notes from My notebook before closing.';
    });
    $('#complete-chapter').addEventListener('click', () => {
      const done = state.completed.includes(id);
      state.completed = done ? state.completed.filter(item => item !== id) : [...state.completed, id];
      save(); updateProgress();
      $('#complete-chapter').textContent = done ? 'Mark this chapter as read ✓' : '✓ Chapter read · Mark unread';
      toast(done ? 'Chapter marked unread' : 'Reading progress updated');
    });
    document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
      const answer = Number(button.dataset.answer);
      document.querySelectorAll('[data-answer]').forEach(option => { option.classList.remove('selected'); option.setAttribute('aria-pressed', 'false'); });
      button.classList.add('selected'); button.setAttribute('aria-pressed', 'true');
      $('#quiz-feedback').textContent = `${answer === chapter.quiz.answer ? 'Correct.' : 'Try again.'} ${chapter.quiz.feedback?.[answer] || chapter.quiz.explanation}`;
    }));
    $('#cutoff-note')?.addEventListener('input', event => {
      state.notes[id] = event.target.value; $('#chapter-note').value = event.target.value;
      const persisted = save(); $('.cutoff-save-status').textContent = persisted ? 'Attempt notes saved in this browser.' : 'Storage unavailable; export your notebook before closing.';
    });
    figures.forEach((figure, i) => renderFigure(document.getElementById(`chapter-figure-${i}`), figure));
    learner?.figures?.forEach((figure, i) => renderFigure(document.getElementById(`attempt-figure-${i}`), figure));
  }
  function chartWidth(element) { return Math.max(220, Math.min(800, Math.round(element.clientWidth || 640))); }
  function lineChart(figure, width) { return window.AtlasFigures.render(figure, { width: printing ? 760 : width, theme: printing ? 'light' : 'dynamic' }); }
  function tableMarkup(table) {
    return `<div class="teaching-table"><button class="table-workspace-button" type="button">Open table workspace</button><p class="table-caption">${esc(table.title || '')}</p><p class="table-hint">Wide table: scroll sideways to compare columns.</p><div class="table-scroll" role="region" aria-label="${esc(table.title || 'Teaching data table')}" tabindex="0"><table><caption class="sr-only">${esc(table.title || 'Teaching data table')}</caption><thead><tr>${table.columns.map(column => `<th scope="col">${esc(column)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }
  function solutionMarkup(paragraphs) { return paragraphs.length ? `<details class="solution"><summary>Reveal the worked solution</summary>${paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</details>` : ''; }
  function figureData(figure) {
    return window.AtlasFigures.flatten(figure).map(panel => {
      let table;
      if (panel.series) table = { columns: [panel.xLabel || 'Observation', ...panel.series.map(series => series.name)], rows: panel.series[0].values.map((_, i) => [window.AtlasFigures.observation(panel, i), ...panel.series.map(series => series.values[i] ?? '—')]) };
      else if (panel.candles) table = { columns: ['Interval', 'Open', 'High', 'Low', 'Close'], rows: panel.candles.map((candle, i) => [candle.label || i + 1, candle.open, candle.high, candle.low, candle.close]) };
      else if (panel.kind === 'table') table = panel;
      else if (panel.levels) table = { columns: ['Price ($)', 'Volume (shares)'], rows: panel.levels.map(level => [level.price, level.volume]) };
      else return '';
      return tableMarkup({ ...table, title: panel.title });
    }).join('');
  }
  function renderFigure(container, figure) {
    container.innerHTML = `<figure class="figure-panel"><div class="figure-kicker">${figure.historical ? 'DOCUMENTED HISTORICAL DATA' : 'FICTIONAL TEACHING ILLUSTRATION'}</div><div class="figure-title">${esc(figure.title)}</div><div class="chart-wrap figure-chart"></div><figcaption>${esc(figure.caption)}</figcaption><details class="data-table"><summary>View the illustration’s data</summary>${figureData(figure)}</details></figure>`;
    const previousRedraw = chartRedraw;
    const redraw = () => { const element = container.querySelector('.chart-wrap'); if (element) element.innerHTML = lineChart(figure, chartWidth(element)); };
    chartRedraw = () => { if (previousRedraw) previousRedraw(); redraw(); };
    redraw();
  }
  const closeData = Array.from({ length: 45 }, (_, i) => Math.round((100 + i * .35 + 4 * Math.sin(i * .38) + 1.7 * Math.cos(i * .91)) * 100) / 100);
  function sma(values, lookback) { return values.map((_, i) => i + 1 < lookback ? null : values.slice(i + 1 - lookback, i + 1).reduce((sum, n) => sum + n, 0) / lookback); }
  function initExperiment(container, type) {
    if (type === 'patterns') {
      container.innerHTML = '<figure class="figure-panel"><div class="figure-kicker">FICTIONAL · GEOMETRY BEFORE INTERPRETATION</div><div class="figure-title">Three different candlestick geometries</div><div id="experiment-chart" class="chart-wrap"></div><figcaption>Hammer-like bar: O $50, H $51, L $47, C $50.80. Doji example: O/C $100, H $104, L $96. Engulfing-body example: first O $102, C $100; next O $99.50, C $102.50. Each panel uses its own vertical scale. These schematic shapes classify intervals; they do not establish a reversal or trading edge.</figcaption></figure>';
      const draw = () => {
        const element = $('#experiment-chart'), width = chartWidth(element), stacked = width < 480;
        const panelWidth = stacked ? width : width / 3, height = stacked ? 630 : 250;
        let content = '';
        const candle = (x, y, open, close, high, low, base, scale, bw = 22) => { const fy = value => y + 150 - (value - base) * scale; const cls = close >= open ? 'up' : 'down'; return `<line x1="${x}" y1="${fy(high)}" x2="${x}" y2="${fy(low)}" class="${cls}" stroke-width="1.5"/><rect x="${x - bw / 2}" y="${Math.min(fy(open), fy(close))}" width="${bw}" height="${Math.max(2, Math.abs(fy(open) - fy(close)))}" class="${cls}" stroke-width="0"/>`; };
        ['Hammer-like', 'Doji', 'Bullish engulfing body'].forEach((name, i) => {
          const offsetX = stacked ? 0 : i * panelWidth, offsetY = stacked ? i * 210 : 0;
          const center = offsetX + panelWidth / 2;
          content += `<text x="${center}" y="${offsetY + 20}" text-anchor="middle" class="label">${name}</text>`;
          if (i === 0) content += candle(center, offsetY + 5, 50, 50.8, 51, 47, 46.5, 28) + `<text x="${center}" y="${offsetY + 186}" text-anchor="middle">Small body, long lower wick</text>`;
          else if (i === 1) content += candle(center, offsetY + 5, 100, 100, 104, 96, 95, 14) + `<text x="${center}" y="${offsetY + 186}" text-anchor="middle">Open and close coincide</text>`;
          else content += candle(center - 22, offsetY + 5, 102, 100, 103, 99, 98, 22) + candle(center + 22, offsetY + 5, 99.5, 102.5, 103.5, 99, 98, 22) + `<text x="${center}" y="${offsetY + 186}" text-anchor="middle">Second body covers the first</text>`;
        });
        element.innerHTML = svg('Schematic hammer-like candle, doji, and bullish engulfing body with separate price scales.', content, width, height);
      };
      chartRedraw = draw; draw(); return;
    }
    if (type === 'overview') { container.innerHTML = `<figure class="figure-panel"><div class="figure-kicker">FICTIONAL TEACHING ILLUSTRATION</div><div class="figure-title">Describe the picture before interpreting it</div><div style="max-width:490px;margin:auto">${overviewIllustration()}</div><figcaption>Fictional rising stock prices across 24 sessions, with a trailing six-session average and volume bars. A visual pattern alone does not establish future returns.</figcaption></figure>`; return; }
    if (type === 'testing') {
      container.innerHTML = `<figure class="figure-panel"><div class="figure-kicker">A METHOD FOR LEARNING</div><div class="figure-title">Keep development separate from evaluation</div><div class="testing-flow"><div><strong>01 · Specify</strong><p>Write the rule and data assumptions.</p></div><div><strong>02 · Develop</strong><p>Explore using a development sample.</p></div><div><strong>03 · Evaluate</strong><p>Test once on held-out observations.</p></div><div><strong>04 · Challenge</strong><p>Check costs, fragility, and failure cases.</p></div></div><figcaption>Repeatedly tuning against a held-out sample turns it into development data. Keep a record of every change.</figcaption></figure>`;
      return;
    }
    if (type === 'risk') return initRisk(container);
    const titles = { candle: 'Explore the anatomy of a candle', average: 'What changes when you smooth the price?', trend: 'Three different stories of price', levels: 'Areas of interest, rather than certain barriers', volume: 'Price and participation are different measurements' };
    container.innerHTML = `<figure class="figure-panel"><div class="figure-kicker">INTERACTIVE · FICTIONAL DATA</div><div class="figure-title">${titles[type]}</div><div id="experiment-controls"></div><div id="experiment-chart" class="chart-wrap"></div><div id="experiment-legend" class="legend"></div><figcaption id="experiment-caption"></figcaption><div id="experiment-data"></div></figure>`;
    if (type === 'candle') {
      $('#experiment-controls').innerHTML = `<div class="range-row"><label for="candle-close">Closing price</label><input type="range" id="candle-close" min="98" max="108" step="1" value="105"><output for="candle-close" id="candle-output">$105</output></div>`;
      const draw = () => {
        const close = Number($('#candle-close').value);
        const open = 100, high = 108, low = 98;
        const element = $('#experiment-chart');
        const width = chartWidth(element), height = 290;
        const x = width < 380 ? width * .3 : width * .4;
        const bodyWidth = 40;
        const y = value => 235 - (value - 97) * 18;
        const typeClass = close >= open ? 'up' : 'down';
        const labelX = x + 55;
        const closeLabelY = y(close);
        const content = [98, 100, 104, 108].map(value => `<line class="grid" x1="15" y1="${y(value)}" x2="${width - 15}" y2="${y(value)}"/>`).join('') + `<line x1="${x}" y1="${y(high)}" x2="${x}" y2="${y(low)}" class="${typeClass}" stroke-width="2"/><rect x="${x - bodyWidth / 2}" y="${Math.min(y(open), y(close))}" width="${bodyWidth}" height="${Math.max(2, Math.abs(y(open) - y(close)))}" class="${typeClass}" stroke-width="0"/><text x="${labelX}" y="${y(high) + 4}">High · $108</text><text x="${labelX}" y="${y(low) + 4}">Low · $98</text>${close !== open ? `<text x="${labelX}" y="${y(open) + 4}">Open · $100</text>` : ''}<text class="label" x="${labelX}" y="${closeLabelY + (close === 108 || close === 98 ? -13 : 4)}">${close === open ? 'Open / close' : 'Close'} · $${close}</text><text x="${x}" y="270" text-anchor="middle">One interval</text>`;
        element.innerHTML = svg(`One candle: open $100, high $108, low $98, close $${close}.`, content, width, height);
        $('#candle-output').textContent = `$${close}`;
        $('#experiment-caption').textContent = `Open is fixed at $100, high at $108, and low at $98. The close is $${close}: ${close > open ? 'above' : close < open ? 'below' : 'equal to'} the open. The body spans open to close; wicks show the remaining range. The order of intraday prices is not shown.`;
      };
      $('#candle-close').addEventListener('input', draw); chartRedraw = draw; draw();
    } else if (type === 'average') {
      $('#experiment-controls').innerHTML = `<div class="range-row"><label for="sma-lookback">SMA lookback</label><input type="range" id="sma-lookback" min="3" max="25" value="10"><output id="sma-output" for="sma-lookback">10 sessions</output></div>`;
      const draw = () => {
        const lookback = Number($('#sma-lookback').value);
        const averages = sma(closeData, lookback);
        const figure = { title: `Fictional closing prices and ${lookback}-session simple moving average`, xLabel: 'Session', yLabel: 'Price ($)', series: [{ name: 'Close', values: closeData }, { name: `${lookback}-session SMA`, values: averages }] };
        const element = $('#experiment-chart'); element.innerHTML = lineChart(figure, chartWidth(element));
        $('#sma-output').textContent = `${lookback} sessions`;
        $('#experiment-legend').innerHTML = `<span><i></i>Closing price</span><span><i></i>${lookback}-session SMA</span>`;
        $('#experiment-caption').textContent = `The first average appears at session ${lookback}. Each value uses only the most recent ${lookback} closes. The current SMA is $${averages.at(-1).toFixed(2)}. Increase the lookback to see the tradeoff between smoothing and delay.`;
        $('#experiment-data').innerHTML = `<details class="data-table"><summary>View prices & check the calculation</summary><div class="table-scroll"><table><thead><tr><th>Session</th><th>Close ($)</th><th>SMA ($)</th></tr></thead><tbody>${closeData.map((close, i) => `<tr><td>${i + 1}</td><td>${close.toFixed(2)}</td><td>${averages[i] === null ? '—' : averages[i].toFixed(2)}</td></tr>`).join('')}</tbody></table></div></details>`;
      };
      $('#sma-lookback').addEventListener('input', draw); chartRedraw = draw; draw();
    } else if (type === 'trend') {
      const data = { up: [38, 42, 39, 46, 43, 49, 46, 52, 49, 55, 52, 57], down: [57, 52, 55, 49, 52, 46, 49, 43, 46, 39, 42, 38], range: [45, 50, 44, 49, 45, 50, 44, 49, 45, 50, 44, 48] };
      let mode = 'up';
      $('#experiment-controls').innerHTML = `<div class="segmented" aria-label="Choose price structure"><button data-trend="up" aria-pressed="true">Uptrend</button><button data-trend="down" aria-pressed="false">Downtrend</button><button data-trend="range" aria-pressed="false">Range</button></div>`;
      const draw = () => { const element = $('#experiment-chart'); element.innerHTML = lineChart({ title: `Fictional ${mode === 'range' ? 'ranging' : mode === 'up' ? 'rising' : 'falling'} prices`, xLabel: 'Observation', yLabel: 'Price ($)', series: [{ name: 'Price', values: data[mode] }] }, chartWidth(element)); $('#experiment-caption').textContent = mode === 'up' ? 'Peaks and troughs move higher. This simplified illustration shows already identified turning points; recognizing a turning point in real time requires a rule and often later data.' : mode === 'down' ? 'Peaks and troughs move lower. A temporary rise does not erase the sequence of lower highs and lows.' : 'Swings repeatedly overlap around a similar area. A directional rule may behave very differently in this setting.'; };
      document.querySelectorAll('[data-trend]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.trend; document.querySelectorAll('[data-trend]').forEach(item => item.setAttribute('aria-pressed', String(item === button))); draw(); })); chartRedraw = draw; draw();
    } else if (type === 'levels') {
      let visible = true;
      $('#experiment-controls').innerHTML = '<div class="segmented"><button id="toggle-zones" aria-pressed="true">Hide price zones</button></div>';
      const draw = () => {
        const values = [41, 46, 43, 49, 46, 50, 45, 42, 45, 49, 47, 50, 46, 42, 45, 48, 51, 53, 50, 55];
        const figure = { title: 'Fictional prices repeatedly react near two areas before moving above the earlier upper area', xLabel: 'Session', yLabel: 'Price ($)', series: [{ name: 'Price', values }] };
        if (visible) figure.zones = [{ low: 41, high: 43, label: 'Support $41–43' }, { low: 49, high: 51, label: 'Resistance $49–51' }];
        const element = $('#experiment-chart'); element.innerHTML = lineChart(figure, chartWidth(element));
        $('#experiment-caption').textContent = 'The marked areas summarize prior reactions. Later prices can move through them. The $41–43 and $49–51 zones are chosen for this fictional example, rather than estimated from a tested algorithm.';
      };
      $('#toggle-zones').addEventListener('click', () => { visible = !visible; $('#toggle-zones').setAttribute('aria-pressed', String(visible)); $('#toggle-zones').textContent = visible ? 'Hide price zones' : 'Show price zones'; draw(); }); chartRedraw = draw; draw();
    } else if (type === 'volume') {
      const volumes = [1, .9, 1.1, .8, 1.2, 1, .9, 1.3, 1, 2.2, 1.5, 1.1];
      const values = [40, 41, 40.5, 42, 43, 42.5, 44, 43.5, 45, 48, 47, 48.5];
      const draw = () => {
        const element = $('#experiment-chart'), width = chartWidth(element);
        const line = lineChart({ title: 'Fictional price and share volume across 12 sessions', xLabel: 'Session', yLabel: 'Price ($)', series: [{ name: 'Close', values }] }, width);
        const left = 48, right = 17, h = 150;
        const bars = volumes.map((value, i) => { const x = left + i / 11 * (width - left - right); const height = value / 2.5 * 85; return `<rect x="${x - 5}" y="${113 - height}" width="10" height="${height}" fill="var(--green)" opacity="${i === 9 ? '.8' : '.35'}"><title>Session ${i + 1}: ${value} million shares</title></rect>`; }).join('');
        element.innerHTML = line + svg('Share volume: session 10 is unusually active at 2.2 million shares.', `<text x="${left}" y="16">Volume (million shares)</text><line class="grid" x1="${left}" y1="113" x2="${width - right}" y2="113"/><text x="${left - 8}" y="117" text-anchor="end">0</text><text x="${left - 8}" y="32" text-anchor="end">2.5</text>${bars}<text x="${left}" y="140">Session 1</text><text x="${width - right}" y="140" text-anchor="end">Session 12</text>`, width, h);
        $('#experiment-caption').textContent = 'Session 10 rises in price and trades 2.2 million shares, compared with a previous nine-session mean of about 1.02 million. This shows increased activity, but does not identify traders’ motives or establish what comes next.';
      };
      chartRedraw = draw; draw();
    }
  }
  function calculateRisk(account, percent, entry, stop) {
    if (![account, percent, entry, stop].every(Number.isFinite) || account <= 0 || percent <= 0 || percent > 100 || entry <= 0 || stop < 0 || stop >= entry) return null;
    const budget = account * percent / 100;
    const perShare = entry - stop;
    const riskShares = Math.floor((budget + 1e-9) / perShare);
    const cashShares = Math.floor((account + 1e-9) / entry);
    const shares = Math.min(riskShares, cashShares);
    return { budget, perShare, shares, cost: shares * entry, plannedLoss: shares * perShare, cashLimited: cashShares < riskShares };
  }
  function initRisk(container) {
    container.innerHTML = `<figure class="figure-panel"><div class="figure-kicker">INTERACTIVE · HYPOTHETICAL LONG STOCK POSITION</div><div class="figure-title">Turn a planned loss into a position size</div><div class="lab-controls"><label class="field">Available account balance ($)<input id="risk-account" type="number" min="1" step="100" value="10000"></label><label class="field">Planned risk budget (% of balance)<input id="risk-percent" type="number" min="0.01" max="100" step="0.1" value="1"></label><label class="field">Entry price ($)<input id="risk-entry" type="number" min="0.01" step="0.01" value="100"></label><label class="field">Planned stop price ($)<input id="risk-stop" type="number" min="0" step="0.01" value="95"></label></div><div id="risk-result" aria-live="polite"></div><figcaption>Whole shares, a long position, no leverage, and the balance available entirely as cash. Ignores fees and other holdings. A planned stop price is not a guaranteed execution price.</figcaption></figure>`;
    const draw = () => {
      const values = ['account', 'percent', 'entry', 'stop'].map(name => { const value = $(`#risk-${name}`).value; return value.trim() ? Number(value) : NaN; });
      const result = calculateRisk(...values);
      if (!result) { $('#risk-result').innerHTML = '<p class="error" role="alert">Use a positive balance and entry, a budget greater than 0% and at most 100%, and a stop at or above $0 and below the entry.</p>'; return; }
      const dollars = value => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
      $('#risk-result').innerHTML = `<div class="risk-results"><div><span>Whole shares</span><strong>${result.shares.toLocaleString()}</strong></div><div><span>Planned price loss</span><strong>${dollars(result.plannedLoss)}</strong></div><div><span>Entry cost</span><strong>${dollars(result.cost)}</strong></div></div><p class="risk-warning">Budget: ${dollars(result.budget)}. Planned price risk: ${dollars(result.perShare)} per share. ${result.cashLimited ? 'Available cash is the binding limit.' : 'The planned risk budget is the binding limit.'} Calculation: the smaller of floor(budget ÷ per-share risk) and floor(cash ÷ entry). Actual losses may exceed the planned amount.</p>`;
    };
    container.querySelectorAll('input').forEach(input => input.addEventListener('input', draw)); draw();
  }
  function renderLab(tab = labTab) {
    if (!['candle', 'trend', 'average', 'risk'].includes(tab)) tab = 'candle';
    labTab = tab;
    const names = { candle: 'Candlesticks', trend: 'Trends', average: 'Moving averages', risk: 'Position sizing' };
    const explanations = { candle: 'A candle is a summary, not a movie of the trading session. Move the close and watch the body change while the high, low, and open stay fixed.', trend: 'Describe the sequence of turning points. A single move against the sequence is different from a change in the entire structure.', average: 'The same prices can look very different under different lookbacks. Notice where the line starts, and how smoothing changes the speed of its response.', risk: 'This is a planning calculation for a hypothetical long stock position. Change the inputs to explore how stop distance and capital limit the share count.' };
    const chapterID = { candle: 'chart-anatomy', trend: 'trends', average: 'moving-averages', risk: 'risk-sizing' }[tab];
    mount(`<div class="page-intro"><div class="eyebrow">Learn by changing one thing</div><h1>The chart playground</h1><p>Small experiments for building intuition. All prices are fictional; these tools illustrate concepts rather than predict stocks.</p></div><div class="lab-tabs" role="tablist" aria-label="Chart experiments">${Object.entries(names).map(([id, name]) => `<button id="lab-tab-${id}" role="tab" aria-selected="${id === tab}" aria-controls="lab-panel" ${id !== tab ? 'tabindex="-1"' : ''} data-lab-tab="${id}">${name}</button>`).join('')}</div><div class="lab-content" id="lab-panel" role="tabpanel" aria-labelledby="lab-tab-${tab}"><div id="lab-experiment"></div><p class="lab-explanation">${explanations[tab]}</p><a href="${link(chapterID)}" class="button">Read the chapter <span>↗</span></a></div>`, 'Explore / Chart playground', 'lab');
    document.title = 'Chart playground — Market Atlas';
    initExperiment($('#lab-experiment'), tab);
    const switchTab = id => { if (location.hash === `#/lab/${id}`) renderLab(id); else location.hash = `#/lab/${id}`; };
    document.querySelectorAll('[data-lab-tab]').forEach(button => {
      button.addEventListener('click', () => switchTab(button.dataset.labTab));
      button.addEventListener('keydown', event => {
        const ids = Object.keys(names), index = ids.indexOf(button.dataset.labTab);
        const target = event.key === 'ArrowRight' ? ids[(index + 1) % ids.length] : event.key === 'ArrowLeft' ? ids[(index + ids.length - 1) % ids.length] : event.key === 'Home' ? ids[0] : event.key === 'End' ? ids.at(-1) : null;
        if (target) { event.preventDefault(); renderLab(target); $(`#lab-tab-${target}`).focus(); history.replaceState(null, '', `#/lab/${target}`); }
      });
    });
  }
  function renderGlossary() {
    mount(`<div class="page-intro"><div class="eyebrow">A reference to return to</div><h1>The language, explained.</h1><p>Short definitions for the words you will meet in the book. Follow a term back to its chapter for context, examples, and source notes.</p></div><div class="glossary-toolbar"><label class="sr-only" for="glossary-filter">Filter glossary terms</label><input type="search" id="glossary-filter" placeholder="Find a term…"><span id="glossary-count"></span></div><div id="glossary-list" class="glossary-list"></div>`, 'Reference / Glossary', 'glossary');
    document.title = 'Glossary — Market Atlas';
    const draw = () => {
      const query = $('#glossary-filter').value.toLowerCase().trim();
      const terms = book.glossary.filter(term => `${term[0]} ${term[1]}`.toLowerCase().includes(query));
      $('#glossary-count').textContent = `${terms.length} ${terms.length === 1 ? 'term' : 'terms'}`;
      $('#glossary-list').innerHTML = terms.length ? terms.map(([term, definition, chapter]) => `<article tabindex="-1" class="glossary-item" id="term-${slug(term)}"><h3><a href="#/glossary/at/term-${slug(term)}">${esc(term)}</a></h3><p>${esc(definition)}</p><a href="${link(chapter)}">Read in context →</a></article>`).join('') : '<p class="search-empty">No matching terms. Try another word.</p>';
    };
    $('#glossary-filter').addEventListener('input', draw); draw();
  }
  function renderNotebook() {
    const notes = Object.entries(state.notes).filter(([, note]) => note.trim());
    mount(`<div class="page-intro"><div class="eyebrow">Your own field notes</div><h1>Keep what you learn.</h1><p>Bookmarked chapters, reading progress, and the questions you write along the way. These belong to this browser; export a backup to keep them.</p></div><div class="notebook-actions"><button class="button" id="export-notebook">Export notebook ↓</button><button class="button" id="import-notebook">Import a backup ↑</button><input class="sr-only" type="file" id="notebook-file" accept="application/json,.json" aria-label="Choose a notebook backup"></div><p class="review-state">${storageAvailable ? 'Stored locally on this device. Import a backup to move your notes to another browser or the future hosted site.' : 'Browser storage is unavailable. Your work lasts only for this session unless exported.'}</p><section class="notebook-section"><div class="section-heading"><h2>Your bookmarks</h2><span class="review-state">${state.bookmarks.length} saved</span></div>${state.bookmarks.length ? `<div class="chapter-list">${state.bookmarks.map(chapterRow).join('')}</div>` : '<div class="empty-state"><h3>A good idea deserves a second reading.</h3><p>Use “Bookmark chapter” while reading to save it here.</p><a class="button" href="#/contents">Explore the book →</a></div>'}</section><section class="notebook-section"><div class="section-heading"><h2>Your notes</h2><span class="review-state">${notes.length} chapters</span></div>${notes.length ? notes.map(([id, note]) => `<article class="saved-note"><a href="${link(id)}">${esc(chapters.get(id).title)} ↗</a><p>${esc(note)}</p></article>`).join('') : '<div class="empty-state"><h3>Start with a question.</h3><p>Each chapter has a notes area. Write what made sense, what did not, and what you want to investigate.</p></div>'}</section>`, 'Personal / My notebook', 'notebook');
    document.title = 'My notebook — Market Atlas';
    $('#export-notebook').addEventListener('click', () => {
      const payload = { format: 'market-atlas-notebook', version: 1, exportedAt: new Date().toISOString(), ...state };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob), anchor = document.createElement('a');
      anchor.href = url; anchor.download = `market-atlas-notebook-${new Date().toISOString().slice(0, 10)}.json`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Notebook backup exported');
    });
    $('#import-notebook').addEventListener('click', () => $('#notebook-file').click());
    $('#notebook-file').addEventListener('change', async event => {
      const file = event.target.files[0]; if (!file) return;
      try {
        if (file.size > backupByteLimit) throw new Error('This backup is too large.');
        const imported = JSON.parse(await file.text());
        if (imported.format !== 'market-atlas-notebook' || imported.version !== 1 || !Array.isArray(imported.completed) || !Array.isArray(imported.bookmarks) || !imported.notes || typeof imported.notes !== 'object' || Array.isArray(imported.notes)) throw new Error('Choose a Market Atlas notebook backup.');
        for (const [id, note] of Object.entries(imported.notes)) if (chapters.has(id) && (typeof note !== 'string' || note.length > noteLimit)) throw new Error('A chapter note is invalid or exceeds 50,000 characters; no data was imported.');
        const cleanNotes = Object.fromEntries(Object.entries(imported.notes).filter(([id, note]) => chapters.has(id) && typeof note === 'string' && note.length <= 50000));
        // Merge without overwriting a newer local note. Conflicting imported text is appended.
        const mergedNotes = { ...state.notes };
        for (const [id, note] of Object.entries(cleanNotes)) {
          const existing = state.notes[id] || '';
          if (!existing.trim()) mergedNotes[id] = note;
          else if (existing !== note && !existing.includes(note)) {
            const combined = `${existing}\n\n— Imported backup —\n${note}`;
            if (combined.length > 50000) throw new Error('A merged note would exceed 50,000 characters. Export your local notes and shorten that chapter note before importing.');
            mergedNotes[id] = combined;
          }
        }
        state.notes = mergedNotes;
        state.completed = [...new Set([...state.completed, ...imported.completed.filter(id => readable.includes(id))])];
        state.bookmarks = [...new Set([...state.bookmarks, ...imported.bookmarks.filter(id => chapters.has(id))])];
        if (imported.positions && typeof imported.positions === 'object') for (const [id, anchor] of Object.entries(imported.positions)) if (!state.positions[id] && chapters.has(id) && typeof anchor === 'string' && anchor.length < 240) state.positions[id] = anchor;
        if (!state.lastRead && readable.includes(imported.lastRead)) state.lastRead = imported.lastRead;
        const persisted = save(); renderNotebook(); toast(persisted ? 'Backup merged into your notebook' : 'Backup merged for this session; browser storage is full. Export before closing.');
      } catch (error) { toast(error.message || 'Could not read this backup.'); }
    });
  }
  function renderAbout() {
    const counts = stats();
    mount(`<div class="prose-page"><div class="page-intro"><div class="eyebrow">About the project</div><h1>A book that lives<br>in your browser.</h1><p>Market Atlas is a growing, illustrated guide to technical analysis for stocks, written for readers who know investing basics and want to understand charts.</p></div><h2>What this edition contains</h2><p>${book.manuscript ? `This first manuscript has ${counts.count} draft chapters across six parts, with about ${Math.round(counts.words / 1000)} thousand words of chapter prose, worked examples, source notes, and knowledge checks. It is a foundation for a longer textbook, rather than a claim of exhaustive coverage or a finished peer-reviewed work.` : 'This starter edition has eight introductory chapters and twenty additional curriculum outlines. The complete manuscript is still in development.'}</p><p>Four interactive experiments explore candle anatomy, trend structure, moving averages, and position sizing. Other chapter illustrations include downloadable-by-print charts and their underlying fictional values. A glossary, bookmarks, reading progress, and personal notes support returning to the material.</p><h2>How to read it</h2><p>Follow the chapter order for a guided path. Visit the risk and testing chapters early as well: they shape how you interpret every other chapter. Use the glossary to resolve a term, and the playground to test an intuition. Mark a chapter read when you have worked through its examples, rather than when you merely open it.</p><h2>An honest relationship with evidence</h2><p>Technical analysis contains precise calculations alongside discretionary traditions. This book distinguishes what a calculation measures, what a practitioner interprets, and what would require empirical evidence. A familiar pattern name does not establish a reliable forecast or a profitable strategy.</p><p>Teaching charts and execution scenarios are fictional unless labelled historical. Chapter 28 also contains limited historical observations with provenance, data conventions, and selection limits. The evidence matrix compares selected empirical studies and distinguishes their findings from definitions and invented rules. All 28 chapters now include worked solutions and graduated practice, with cumulative reviews for all six parts. The later chapters connect completed risk, plan and journal records to an inspectable system and casebook. The manuscript remains a draft: further historical coverage and human reader validation remain outstanding. The evidence review covers selected studies and the stated source passages, rather than an exhaustive literature review.</p><h2>Your notes stay with you</h2><p>Reading progress and notes are saved in browser storage when available. They do not synchronize between devices or automatically follow you to a public website. Export a notebook backup and import it wherever you read next. This website itself has no analytics, accounts, external fonts, or remote data requests.</p><h2>From local book to public reference</h2><p>Open index.html directly to read offline. The same folder can be served on a static web host. A future public edition can add an editorial workflow, dedicated topic URLs, historical data with suitable permissions, and reviewed contributions while keeping this reading experience.</p><h2>Source library</h2><ul>${Object.values(book.sources).map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a> — ${esc(source.supports)}</li>`).join('')}</ul><p class="review-state">Educational material for learning concepts. It does not recommend a security or a particular trading allocation.</p></div>`, 'About / This edition', '');
    document.title = 'About this edition — Market Atlas';
  }
  function renderPractice(id) {
    const part = book.parts.find(part => part.id === id), practice = book.partPractice?.[id];
    if (!part || !practice) return renderNotFound();
    mount(`<div class="prose-page"><div class="page-intro"><div class="eyebrow">Part ${part.number} review</div><h1>${esc(practice.title)}</h1><p>Work from the supplied information. State your assumptions before revealing a solution.</p></div>${practice.tasks.map(task => `<section class="exercise"><h2>${esc(task.title)}</h2><p>${esc(task.question)}</p>${(task.tables || []).map(tableMarkup).join('')}${solutionMarkup(task.solution)}</section>`).join('')}<a href="#/contents/${id}">Return to this part →</a></div>`, 'The book / Part review', 'contents');
    document.title = `${practice.title} — Market Atlas`;
  }
  function evidenceRecord(record) {
    const study = record.study ? tableMarkup({ title: 'Study specification', columns: ['Field', 'What was tested'], rows: ['sample', 'rule', 'comparator', 'costs', 'result'].map(field => [field[0].toUpperCase() + field.slice(1), record.study[field]]) }) : '';
    return `<article class="evidence-record" id="${esc(record.id)}" tabindex="-1"><h3><a href="#/evidence/at/${esc(record.id)}">${esc(record.claim)}</a></h3><p><strong>${esc(record.type)}</strong> · checked ${esc(record.checked)} · ${esc(record.location)}</p>${record.terms ? `<p><strong>Glossary terms:</strong> ${record.terms.map(esc).join('; ')}.</p>` : ''}<p>${esc(record.summary)}</p>${study}<p><strong>Limits:</strong> ${esc(record.limits)}</p><p>${record.sourceIds.map(id => `<a href="${esc(book.sources[id].url)}" target="_blank" rel="noopener noreferrer">${esc(book.sources[id].title)}</a>`).join(' · ') || (record.type === 'unresolved' ? 'No supporting study inspected.' : 'Original definitions, calculations or teaching conventions; see the stated chapter.')}</p></article>`;
  }
  function renderEvidence() {
    const sections = [...(book.research || []).map(section => ({ ...section, anchor: `evidence-${section.id || slug(section.title)}` })), ...book.chapters.map(chapter => ({ title: chapter.title, anchor: `evidence-${chapter.id}`, paragraphs: [], evidence: chapter.evidence || [] }))];
    mount(`<div class="prose-page"><div class="page-intro"><div class="eyebrow">Sources, claims, and limits</div><h1>The evidence behind the book</h1><p>A definition, an arithmetic check, a proposed mechanism, and a measured return result answer different questions. These records state what was inspected and what remains untested.</p></div><details class="evidence-contents"><summary>Browse studies, topics & chapter evidence</summary><nav aria-label="Evidence contents">${sections.map(section => `<a href="#/evidence/at/${section.anchor}">${esc(section.title)}</a>`).join('')}</nav></details><label for="evidence-filter">Filter claims, study specifications & limitations</label><input type="search" id="evidence-filter" placeholder="Try momentum, costs, or a chapter topic"><p id="evidence-count" role="status"></p>${sections.map(section => `<section class="article-section evidence-section" id="${section.anchor}" tabindex="-1"><h2>${esc(section.title)}</h2>${section.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}${(section.tables || []).map(tableMarkup).join('')}${section.evidence.map(evidenceRecord).join('')}</section>`).join('')}</div>`, 'Reference / Evidence', 'evidence');
    document.title = 'Evidence matrix — Market Atlas';
    $('#evidence-filter').addEventListener('input', event => {
      const query = event.target.value.trim().toLowerCase(); let count = 0;
      document.querySelectorAll('.evidence-section').forEach(section => {
        const match = section.textContent.toLowerCase().includes(query); section.hidden = !match; if (match) count++;
      });
      $('#evidence-count').textContent = `${count} of ${sections.length} topic/chapter sections shown`;
    });
  }
  function renderNotFound() {
    mount('<div class="page-intro"><div class="eyebrow">A small detour</div><h1>This page is not in the atlas.</h1><p>Return to the contents to find a chapter or topic.</p><a href="#/contents" class="button primary">Table of contents →</a></div>', 'Page not found', '');
    document.title = 'Page not found — Market Atlas';
  }
  function rememberPosition() {
    if (!activeChapter) return;
    const candidates = [...document.querySelectorAll('.article-section h2[id], #cutoff-attempt, #exercises, #sources')].filter(item => item.getClientRects().length);
    const current = candidates.filter(item => item.getBoundingClientRect().top <= 150).at(-1);
    const anchor = current?.id;
    if (anchor && state.positions[activeChapter] !== anchor) { state.positions[activeChapter] = anchor; save(); }
  }
  function arriveAt(anchor) {
    const target = document.getElementById(anchor); if (!target) return;
    const disclosure = target.closest('details'); if (disclosure) { disclosure.open = true; if (chartRedraw) chartRedraw(); }
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true }); rememberPosition();
  }
  function route() {
    rememberPosition();
    const raw = location.hash.slice(1) || '/';
    if (raw === 'main') { history.replaceState(null, '', activeChapter ? link(activeChapter) : '#/'); $('#main').focus(); return; }
    const segments = raw.split('/').filter(Boolean), at = segments.indexOf('at');
    const anchor = at >= 0 ? segments[at + 1] : null;
    // In-page navigation should preserve notes, opened solutions and quiz state.
    if (segments[0] === 'chapter' && activeChapter === segments[1]) {
      if (anchor) arriveAt(anchor); else { window.scrollTo({ top: 0, behavior: 'instant' }); $('#main').focus({ preventScroll: true }); }
      return;
    }
    activeChapter = null;
    switch (segments[0]) {
      case undefined: renderHome(); break;
      case 'contents': renderContents(segments[1]); break;
      case 'chapter': renderChapter(segments[1], anchor); break;
      case 'lab': renderLab(segments[1]); break;
      case 'glossary': renderGlossary(); break;
      case 'notebook': renderNotebook(); break;
      case 'about': renderAbout(); break;
      case 'practice': renderPractice(segments[1]); break;
      case 'evidence': renderEvidence(); break;
      default: renderNotFound();
    }
    if (anchor) arriveAt(anchor); else $('#main').focus({ preventScroll: true });
  }
  const flattenText = value => value === null || value === undefined ? '' : typeof value === 'object' ? Object.values(value).map(flattenText).join(' ') : String(value);
  const searchIndex = [];
  const addSearch = (title, label, href, value) => searchIndex.push({ title, label, href, text: flattenText(value) });
  book.chapters.forEach(chapter => {
    addSearch(chapter.title, 'Chapter overview', link(chapter.id), [chapter.title, chapter.subtitle, chapter.tags, chapter.takeaway, chapter.outcomes]);
    chapter.sections?.forEach(section => addSearch(chapter.title, section.title, sectionLink(chapter.id, section), section));
    if (chapter.learnerAttempt) addSearch(chapter.title, chapter.learnerAttempt.title, `${link(chapter.id)}/at/cutoff-attempt`, chapter.learnerAttempt);
    [chapter.figure, ...(chapter.figures || [])].filter(Boolean).forEach(figure => addSearch(chapter.title, figure.title, sectionLink(chapter.id, chapter.sections[figure.afterSection ?? 0]), figure));
    addSearch(chapter.title, 'Worked example', `${link(chapter.id)}/at/worked-example`, chapter.example);
    addSearch(chapter.title, 'Exercise & worked solution', `${link(chapter.id)}/at/exercises`, [chapter.exercise, chapter.solution]);
    chapter.practice?.forEach(task => addSearch(chapter.title, `${task.level} practice: ${task.title}`, `${link(chapter.id)}/at/practice-${slug(task.title)}`, task));
    addSearch(chapter.title, 'Knowledge check & feedback', `${link(chapter.id)}/at/knowledge-check`, chapter.quiz);
    chapter.evidence?.forEach(record => addSearch(record.claim, `${chapter.title} · Evidence`, `#/evidence/at/${record.id}`, record));
  });
  book.research?.forEach(section => {
    addSearch(section.title, 'Research reference', `#/evidence/at/evidence-${section.id || slug(section.title)}`, [section.title, section.paragraphs, section.tables]);
    section.evidence?.forEach(record => addSearch(record.claim, `${section.title} · Evidence`, `#/evidence/at/${record.id}`, record));
  });
  book.glossary.forEach(term => addSearch(term[0], 'Glossary', `#/glossary/at/term-${slug(term[0])}`, term.slice(0, 2)));
  Object.entries(book.partPractice || {}).forEach(([id, review]) => addSearch(review.title, 'Part review', `#/practice/${id}`, review));
  function renderSearch(query = '') {
    const search = query.toLowerCase().trim();
    const matches = search ? searchIndex.filter(item => `${item.title} ${item.label} ${item.text}`.toLowerCase().includes(search)) : readable.slice(0, 5).map(id => ({ title: chapters.get(id).title, label: 'Chapter', href: link(id), text: chapters.get(id).subtitle }));
    $('#search-results').innerHTML = `<p class="search-count">${search ? `${matches.length} matching locations · all results shown` : 'Start with a chapter, or search the full atlas'}</p>` + matches.map(item => {
      const offset = Math.max(0, item.text.toLowerCase().indexOf(search) - 60);
      const snippet = item.text.slice(offset, offset + 200);
      return `<a class="search-result" href="${item.href}"><strong>${esc(item.title)}</strong><small>${esc(item.label)}</small><p>${offset ? '…' : ''}${esc(snippet)}${offset + 200 < item.text.length ? '…' : ''}</p></a>`;
    }).join('');
    if (!matches.length) $('#search-results').innerHTML += '<p class="search-empty">No matching instructional content. Try “trend”, “risk”, or “volume”.</p>';
    $('#search-results').querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', () => { $('#search-dialog').close(); if (anchor.hash === location.hash) route(); }));
  }
  $('#part-nav').innerHTML = book.parts.map(part => `<a href="#/contents/${part.id}"><span>${part.number}</span>${part.short}</a>`).join('');
  $('#open-search').addEventListener('click', () => { $('#search-dialog').showModal(); $('#search-input').value = ''; renderSearch(); $('#search-input').focus(); });
  $('.skip-link').addEventListener('click', event => { event.preventDefault(); $('#main').focus({ preventScroll: true }); $('#main').scrollIntoView(); });
  $('#topbar-search').addEventListener('click', () => $('#open-search').click());
  document.addEventListener('click', event => {
    const button = event.target.closest('.table-workspace-button'); if (!button) return;
    const table = button.closest('.teaching-table');
    $('#table-heading').textContent = table.querySelector('.table-caption').textContent;
    $('#table-workspace').innerHTML = table.querySelector('.table-scroll').outerHTML;
    $('#table-dialog').showModal(); $('#table-workspace .table-scroll').focus();
  });
  $('#close-table').addEventListener('click', () => $('#table-dialog').close());
  $('#close-contents').addEventListener('click', () => $('#contents-dialog').close());
  $('#contents-links').addEventListener('click', event => { if (event.target.closest('a')) $('#contents-dialog').close(); });
  let positionTimer;
  window.addEventListener('scroll', () => { clearTimeout(positionTimer); positionTimer = setTimeout(rememberPosition, 250); }, { passive: true });
  window.addEventListener('pagehide', rememberPosition);
  $('#close-search').addEventListener('click', () => $('#search-dialog').close());
  $('#search-input').addEventListener('input', event => renderSearch(event.target.value));
  $('#search-dialog').addEventListener('click', event => { if (event.target === $('#search-dialog')) { const bounds = event.target.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.target.close(); } });
  $('#menu-toggle').addEventListener('click', () => { const open = $('.sidebar').classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded', String(open)); syncSidebar(); if (open) $('#open-search').focus(); });
  $('#theme-toggle').addEventListener('click', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; document.body.classList.toggle('dark', state.theme === 'dark'); save(); updateProgress(); });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !event.metaKey && !event.ctrlKey && !$('#search-dialog').open) { event.preventDefault(); $('#open-search').click(); }
    if (event.key === 'Escape') { const wasOpen = $('.sidebar').classList.contains('open'); $('.sidebar').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded', 'false'); syncSidebar(); if (wasOpen) $('#menu-toggle').focus(); }
  });
  document.addEventListener('click', event => { if ($('.sidebar').classList.contains('open') && !event.target.closest('.sidebar') && !event.target.closest('#menu-toggle')) { $('.sidebar').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded', 'false'); syncSidebar(); } });
  let resizeTimer;
  window.addEventListener('resize', () => { syncSidebar(); clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (chartRedraw) chartRedraw(); }, 100); });
  window.addEventListener('hashchange', route);
  // Pure calculations are exposed for reproducibility checks; UI data remains local.
  window.AtlasMath = Object.freeze({ sma, calculateRisk });
  route();
})();
