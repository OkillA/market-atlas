// Assembles the static reader edition into _site/ for deployment.
// Only the files the browser book loads are copied; authoring sources,
// review records and historical inputs stay in the repository.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, '_site');
const files = ['index.html', 'styles.css', 'app.js', 'figure-renderer.js', 'favicon.svg', 'content/book.js'];
fs.rmSync(out, { recursive: true, force: true });
for (const file of files) {
  fs.mkdirSync(path.dirname(path.join(out, file)), { recursive: true });
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}
// Every file index.html references must be in the bundle.
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, ref] of html.matchAll(/(?:src|href)="([^"#:]+?)(?:\?[^"]*)?"/g)) {
  if (!fs.existsSync(path.join(out, ref))) throw new Error(`index.html references ${ref}, which is not in _site/`);
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`Built _site/ with ${files.length} files.`);
