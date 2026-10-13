"""Local static artifact checks; no publication or browser-offline claim."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / '_site'
ASSETS = Path(__file__).parent
EXPECTED = ['.nojekyll', 'app.js', 'content/book.js', 'favicon.svg', 'figure-renderer.js', 'index.html', 'styles.css']

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def build():
    subprocess.run(['node', 'scripts/build-site.cjs'], cwd=ROOT, check=True, capture_output=True)
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob('*') if p.is_file())
    assert files == EXPECTED, files
    return {f: sha(OUT / f) for f in files}

first, second = build(), build()
assert first == second
for f in EXPECTED:
    if f != '.nojekyll':
        assert sha(ROOT / f) == second[f]
refs = re.findall(r'(?:src|href)="([^"#:]+?)(?:\?[^\"]*)?"', (OUT / 'index.html').read_text())
assert all((OUT / ref).is_file() for ref in refs)
assert all(not ref.startswith(('http:', 'https:', '//')) for ref in refs)
archive = ASSETS / 'market-atlas-0.4.1-alpha.1.zip'
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
    for f in EXPECTED:
        info = zipfile.ZipInfo(f, (2026, 10, 12, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        bundle.writestr(info, (OUT / f).read_bytes())
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    assert bundle.namelist() == EXPECTED
    for f in EXPECTED:
        assert hashlib.sha256(bundle.read(f)).hexdigest() == second[f]
record = {
    'version': '0.4.1-alpha.1', 'editionStatus': 'alpha draft',
    'twoBuildsMatch': True, 'bundleFiles': second, 'localAssetReferences': refs,
    'zip': str(archive.relative_to(ROOT)), 'zipSha256': sha(archive),
    'published': False,
    'limits': 'Static asset graph, byte identity and ZIP integrity checked. Native file:// reading, deployment and a complete native print matrix are not established by this preflight.'
}
(ASSETS / 'package-preflight.json').write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps({'files': len(EXPECTED), 'twoBuildsMatch': True, 'zipIntegrity': True, 'published': False}))
