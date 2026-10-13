// file:// offline check of the built _site via headless Chrome CDP. Usage: node filecheck.mjs <siteDir> <out.json>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [site, outFile] = process.argv.slice(2);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--remote-debugging-port=9334','--user-data-dir=/tmp/ma-qa/chrome-profile','about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ver; for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:9334/json/version')).json(); } catch { await sleep(200); } }
const ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else events.push(d); };
const send = (method, params = {}, sessionId) => new Promise(r => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable'); await S('Log.enable'); await S('Network.enable');
// Offline: any non-file request fails.
await S('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
await S('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
const ev = async e => (await S('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
const base = 'file://' + site + '/index.html';
await S('Page.navigate', { url: base + '#/' }); await sleep(2000);
const routes = await ev(`(()=>{const b=window.ATLAS;const r=['#/','#/contents','#/glossary','#/evidence','#/about','#/notebook','#/lab'];for(const p of b.parts){for(const c of p.chapters)r.push('#/chapter/'+(typeof c==='string'?c:c.id));if(b.partPractice?.[p.id])r.push('#/practice/'+p.id);}return r})()`);
const rows = [];
for (const r of routes) {
  await ev(`location.hash=${JSON.stringify(r)};1`); await sleep(600);
  rows.push({ r, ...(await ev(`(()=>({h1:!!document.querySelector('h1'),figs:document.querySelectorAll('figure svg').length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}))()`)) });
}
// Search, packet reveal and notebook persistence on file://
const search = await ev(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms));document.body.focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'/',bubbles:true}));await s(300);const i=document.querySelector('#search-input');if(!document.querySelector('#search-dialog').open)return {opened:false};if(!i)return {opened:false};i.value='average true range';i.dispatchEvent(new Event('input',{bubbles:true}));await s(400);const n=document.querySelectorAll('#search-results .search-result').length;document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return {opened:true,results:n}})()`);
await ev(`location.hash='#/chapter/support-resistance';1`); await sleep(800);
const packet = await ev(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms));const before=document.querySelectorAll('figure svg').length;const d=[...document.querySelectorAll('details')];const closedBefore=d.filter(x=>!x.open).length;d.forEach(x=>x.open=true);await s(800);return {details:d.length,closedBefore,figsBefore:before,figsAfter:document.querySelectorAll('figure svg').length,emptyFigures:[...document.querySelectorAll('figure')].filter(f=>!f.querySelector('svg,img,table')).length,cells:document.querySelectorAll('td').length}})()`);
await ev(`(()=>{const k='market-atlas-reader-v1';const v=JSON.parse(localStorage.getItem(k)||'{}');v.notes=Object.assign(v.notes||{}, {'support-resistance':'qa file note'});localStorage.setItem(k,JSON.stringify(v));return 1})()`);
await S('Page.reload', {}); await sleep(2000);
await ev(`location.hash='#/notebook';1`); await sleep(800);
const notebookPersist = await ev(`(()=>({storedNote:JSON.parse(localStorage.getItem('market-atlas-reader-v1')||'{}').notes?.['support-resistance']==='qa file note', shownInNotebook:document.querySelector('main').textContent.includes('qa file note')}))()`);
const store = await ev(`(()=>{try{localStorage.setItem('__qa','1');const ok=localStorage.getItem('__qa')==='1';localStorage.removeItem('__qa');return {localStorage:ok,origin:location.origin}}catch(e){return {localStorage:false,error:String(e)}}})()`);
const failedRequests = events.filter(e => e.method === 'Network.loadingFailed').map(e => e.params.errorText);
const requests = events.filter(e => e.method === 'Network.requestWillBeSent').map(e => e.params.request.url.replace(/^file:\/\/[^?#]*\//, 'file:…/'));
const errors = events.filter(e => e.method === 'Runtime.exceptionThrown').map(e => e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text);
const logErrors = events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error').map(e => e.params.entry.text);
const result = { engine: ver.Browser + ' headless (non-native)', url: 'file://<repo>/_site/index.html', networkOffline: true, routes: rows.length, routesWithoutH1: rows.filter(x => !x.h1).map(x => x.r), figureSvgs: rows.reduce((a, x) => a + x.figs, 0), overflowRoutes: rows.filter(x => x.overflow > 0).map(x => x.r), search, packet, notebookPersist, store, nonFileRequests: requests.filter(u => !u.startsWith('file:')), failedRequests, errors, logErrors };
writeFileSync(outFile, JSON.stringify(result, null, 1));
console.log(JSON.stringify(result, null, 1));
ws.close(); chrome.kill();
