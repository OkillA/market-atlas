// Run from repository root. Retains a reproducible before renderer from the reviewed commit.
const fs = require('node:fs'), cp = require('node:child_process'), vm = require('node:vm');
const baseline = '1c901566a5ccc0dc6a88c83b86596e4598640b61';
const dir = __dirname, oldSource = cp.execFileSync('git', ['show', `${baseline}:figure-renderer.js`], {encoding: 'utf8'});
fs.writeFileSync(`${dir}/before-renderer.js`, oldSource);
const context = {module: {exports: {}}, globalThis: {}}; vm.runInNewContext(oldSource, context);
const before = context.module.exports, after = require('../../figure-renderer.js');
global.window = global; require('../../content/book.js');
const changed = [], figures = [];
for (const chapter of ATLAS.chapters) {
  const specs = [chapter.figure, ...(chapter.figures || [])].filter(Boolean).map((figure, i) => ({figure, id: chapter.id + (i ? `-${i + 1}` : '')}));
  (chapter.learnerAttempt?.figures || []).forEach((figure, i) => specs.push({figure, id: `${chapter.id}-attempt-${i + 1}`}));
  for (const {id, figure} of specs) {
    const changedWidths = [260,320,390,760].filter(width => before.render(figure,{width}) !== after.render(figure,{width}));
    if (!changedWidths.length) continue;
    figures.push({id, chapter: chapter.id, changedWidths, exportChanged: changedWidths.includes(760)});
    after.flatten(figure).forEach((spec, panel) => {
      if ([260,320,390,760].some(width => before.render(spec,{width}) !== after.render(spec,{width}))) changed.push({id, panel, spec});
    });
  }
}
fs.writeFileSync(`${dir}/figure-manifest.json`, JSON.stringify({baseline, figures, panels: changed.map(({id,panel,spec}) => ({id,panel,title:spec.title}))}, null, 2)+'\n');
fs.writeFileSync(`${dir}/inspection-data.js`, `window.inspectionPanels = ${JSON.stringify(changed.map(row => ({...row, portable: Object.fromEntries([260,760].map(width => [width, after.render(row.spec,{width})]))})))};\n`);
console.log(JSON.stringify({changedFigures:figures.length,changedPanels:changed.length,exportsChanged:figures.filter(f=>f.exportChanged).length}));
