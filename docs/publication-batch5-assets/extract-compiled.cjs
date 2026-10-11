// Writes the compiled batch-5 chapters from content/book.js to compiled/<id>.json,
// the inputs read by the *-reproduce.py scripts. Run from the repository root.
const fs = require('fs'), path = require('path');
global.window = global; require(path.resolve('content/book.js'));
for (const id of ['relative-strength', 'breadth', 'multi-timeframe', 'events', 'market-microstructure']) {
  const chapter = window.ATLAS.chapters.find(c => c.id === id);
  fs.writeFileSync(path.join(__dirname, 'compiled', `${id}.json`), JSON.stringify(chapter, null, 1));
}
console.log('Extracted 5 compiled chapters.');
