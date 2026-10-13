"""Read-only retrieval inventory; downloaded copyrighted text stays in /tmp."""
import concurrent.futures, datetime, hashlib, json, pathlib, subprocess, tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/release-readiness-assets'
SOURCES = json.loads((OUT / 'current-sources.json').read_text())
TEMP = pathlib.Path(tempfile.mkdtemp(prefix='market-atlas-release-sources-'))
GROUPS = {}
for source_id, source in SOURCES.items():
    GROUPS.setdefault(source['url'], []).append(source_id)

def retrieve(pair):
    index, (url, ids) = pair
    body = TEMP / f'{index:03}.body'
    checked = datetime.datetime.now(datetime.timezone.utc).isoformat()
    process = subprocess.run([
        'curl', '-sS', '-L', '--compressed', '--connect-timeout', '8', '--max-time', '25',
        '-A', 'MarketAtlas/0.4 (+https://github.com/OkillA/market-atlas; editorial source review)',
        '-o', str(body), '-w', '%{http_code}\t%{url_effective}\t%{content_type}', url
    ], text=True, capture_output=True)
    fields = process.stdout.split('\t')
    status = int(fields[0]) if fields and fields[0].isdigit() else 0
    data = body.read_bytes() if body.exists() else b''
    text_path = TEMP / f'{index:03}.txt'
    if data.startswith(b'%PDF'):
        converted = subprocess.run(['pdftotext', '-layout', str(body), str(text_path)], capture_output=True, text=True)
        kind = 'pdf'
        text = text_path.read_text(errors='replace') if text_path.exists() else ''
    else:
        from bs4 import BeautifulSoup
        decoded = data.decode('utf-8', errors='replace')
        soup = BeautifulSoup(decoded, 'html.parser')
        for tag in soup(['script', 'style', 'nav', 'footer']):
            tag.decompose()
        text = soup.get_text(' ', strip=True)
        text_path.write_text(text)
        kind = 'html'
    challenge = any(needle in text.lower() for needle in [
        'verify you are human', 'access denied', 'request rate threshold exceeded',
        'unusual traffic', 'captcha', 'enable javascript and cookies to continue'
    ])
    disposition = 'retrieved' if 200 <= status < 300 and len(text) > 80 and not challenge else 'restricted' if status in [401,403,429] or challenge else 'unavailable'
    return dict(index=index, sourceIds=ids, requestedUrl=url, checkedAt=checked,
                method='curl GET with redirects and declared project User-Agent',
                httpStatus=status, finalUrl=fields[1] if len(fields)>1 else url,
                contentType=fields[2] if len(fields)>2 else '', exitCode=process.returncode,
                disposition=disposition, challenge=challenge, bytes=len(data), characters=len(text),
                sha256=hashlib.sha256(data).hexdigest(), kind=kind,
                temporaryBody=str(body), temporaryText=str(text_path), error=process.stderr.strip())

results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    pending = [executor.submit(retrieve, pair) for pair in enumerate(GROUPS.items())]
    for future in concurrent.futures.as_completed(pending):
        result = future.result()
        results.append(result)
        print(','.join(result['sourceIds']), result['httpStatus'], result['disposition'], flush=True)
        (OUT / 'source-access.json').write_text(json.dumps(sorted(results, key=lambda r:r['index']), indent=2)+'\n')
print(json.dumps(dict(urls=len(results), sourceIds=sum(len(r['sourceIds']) for r in results), temporaryDirectory=str(TEMP))), flush=True)
