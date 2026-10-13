// Headless Chromium print sweep via CDP. Usage: node sweep.mjs <outdir>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const out = process.argv[2];
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--remote-debugging-port=9333','--user-data-dir=/tmp/ma-chrome-profile','about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ver; for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:9333/json/version')).json(); } catch { await sleep(200); } }
const ws = new WebSocket(ver.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else events.push(d); };
const send = (method, params = {}, sessionId) => new Promise(r => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable');
await S('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
const evalJS = async expr => (await S('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;
const base = 'http://127.0.0.1:4173/?v=sweep';
await S('Page.navigate', { url: base + '#/contents' }); await sleep(1500);
const routes = await evalJS(`(()=>{const b=window.ATLAS;const r=[];let n=0;for(const p of b.parts){for(const c of p.chapters){n++;const cid=typeof c==='string'?c:c.id;r.push({kind:'chapter',n,id:cid});}if(b.partPractice?.[p.id])r.push({kind:'part',id:p.id});}return r})()`);
const report = [];
for (const r of routes) {
  const editions = r.kind === 'chapter' ? ['learner', 'answers'] : ['as-shown'];
  for (const ed of editions) {
    const hash = r.kind === 'chapter' ? `#/chapter/${r.id}` : `#/practice/${r.id}`;
    await S('Page.navigate', { url: base + '&r=' + Math.random() + hash }); await sleep(1800);
    if (ed === 'answers') await evalJS(`document.body.classList.add('print-answers'); document.querySelector('.print-policy') && (document.querySelector('.print-policy').textContent='Answer edition: includes continuation, worked solutions and the knowledge-check answer.'); 1`);
    if (ed === 'learner') await evalJS(`document.body.classList.remove('print-answers'); document.querySelector('.print-policy') && (document.querySelector('.print-policy').textContent='Learner edition: attempt first; continuation reference starts on a new page where supplied. Worked solutions and quiz answers are omitted.'); 1`);
    const pdf = await S('Page.printToPDF', { paperWidth: 8.5, paperHeight: 11, printBackground: false, preferCSSPageSize: false });
    const name = `${r.kind === 'chapter' ? 'ch' + String(r.n).padStart(2, '0') : 'part'}-${r.id}-${ed}.pdf`;
    if (!pdf.result) { report.push({ name, error: JSON.stringify(pdf.error) }); continue; }
    writeFileSync(`${out}/${name}`, Buffer.from(pdf.result.data, 'base64'));
    report.push({ name });
  }
}
writeFileSync(`${out}/sweep.json`, JSON.stringify(report, null, 1));
console.log(report.length, 'pdfs', report.filter(r => r.error).length, 'errors');
ws.close(); chrome.kill();
