// Native SVG geometry survey; actual compact/wide artwork inspected separately.
(() => {
  const fixtures = document.createElement('div');
  fixtures.style = 'position:fixed;left:-20000px;top:0';
  document.body.append(fixtures);
  const results = [];
  for (const chapter of ATLAS.chapters) {
    const figures = [chapter.figure, ...(chapter.figures || [])].filter(Boolean).map((spec, i) => ({ id: chapter.id + (i ? '-' + (i + 1) : ''), spec }));
    (chapter.learnerAttempt?.figures || []).forEach((spec, i) => figures.push({ id: chapter.id + '-attempt-' + (i + 1), spec }));
    for (const { id, spec } of figures) for (const width of [260, 320, 390, 760]) for (const dark of [false, true]) {
      document.body.classList.toggle('dark', dark);
      fixtures.style.width = width + 'px';
      fixtures.innerHTML = AtlasFigures.render(spec, { width, theme: 'dynamic' });
      const svg = fixtures.querySelector('svg');
      svg.style.width = width + 'px';
      const bounds = svg.getBoundingClientRect();
      const clipped = [];
      for (const label of svg.querySelectorAll('text')) {
        const b = label.getBoundingClientRect();
        if (b.left < bounds.left - 1 || b.right > bounds.right + 1 || b.top < bounds.top - 1 || b.bottom > bounds.bottom + 1) clipped.push(label.textContent);
      }
      results.push({ id, width, palette: dark ? 'dark' : 'light', clipped });
    }
  }
  fixtures.remove(); document.body.classList.remove('dark');
  return { renders: results.length, failures: results.filter(r => r.clipped.length), widths: [260, 320, 390, 760], palettes: ['light', 'dark'], figures: [...new Set(results.map(r => r.id))] };
})()
