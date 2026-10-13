// Automated accessibility-tree audit via headless Chrome CDP (not a screen reader). Usage: node a11y.mjs <baseUrl> <out.json>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [base, outFile] = process.argv.slice(2);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--remote-debugging-port=9335','--user-data-dir=/tmp/ma-qa/chrome-a11y','about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ver; for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:9335/json/version')).json(); } catch { await sleep(200); } }
const ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map();
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}, sessionId) => new Promise(r => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable'); await S('Accessibility.enable'); await S('DOM.enable');
await S('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
const ev = async e => (await S('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
await S('Page.navigate', { url: base + '#/' }); await sleep(2000);
const routes = await ev(`(()=>{const b=window.ATLAS;const r=['#/','#/contents','#/glossary','#/evidence','#/about','#/notebook','#/lab'];for(const p of b.parts){for(const c of p.chapters)r.push('#/chapter/'+(typeof c==='string'?c:c.id));if(b.partPractice?.[p.id])r.push('#/practice/'+p.id);}return r})()`);
const NAMED = new Set(['button','link','textbox','searchbox','combobox','checkbox','radio','slider','spinbutton','tab','menuitem','image','img','dialog','region','navigation','form','progressbar','switch','listbox','option','treeitem']);
const val = v => v?.value ?? '';
const rows = [];
for (const r of routes) {
  await ev(`location.hash=${JSON.stringify(r)};1`); await sleep(700);
  // Open every disclosure so revealed content is audited too.
  await ev(`document.querySelectorAll('#main details').forEach(d=>d.open=true);1`); await sleep(400);
  const { result } = await S('Accessibility.getFullAXTree', {});
  const nodes = result.nodes.filter(n => !n.ignored);
  const role = n => val(n.role);
  const unnamed = nodes.filter(n => NAMED.has(role(n)) && !val(n.name).trim() && !['navigation','region','form','dialog'].includes(role(n)));
  const unnamedDesc = [];
  for (const n of unnamed.slice(0, 6)) {
    let html = '';
    if (n.backendDOMNodeId) { const o = await S('DOM.getOuterHTML', { backendNodeId: n.backendDOMNodeId }); html = (o.result?.outerHTML || '').slice(0, 160); }
    unnamedDesc.push({ role: role(n), html });
  }
  const headings = nodes.filter(n => role(n) === 'heading').map(n => Number(val(n.properties?.find(p => p.name === 'level')?.value)) || 0);
  const skips = []; for (let i = 1; i < headings.length; i++) if (headings[i] > headings[i - 1] + 1) skips.push(`h${headings[i - 1]}→h${headings[i]}`);
  const dom = await ev(`(()=>{const ids={};document.querySelectorAll('[id]').forEach(e=>ids[e.id]=(ids[e.id]||0)+1);const dup=Object.keys(ids).filter(k=>ids[k]>1);
    const badRefs=[...document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls],label[for]')].flatMap(e=>['aria-labelledby','aria-describedby','aria-controls','for'].flatMap(a=>(e.getAttribute(a)||'').split(/\\s+/).filter(Boolean).filter(x=>!document.getElementById(x)).map(x=>a+':'+x)));
    const svgs=[...document.querySelectorAll('#main svg')];const svgNoName=svgs.filter(s=>s.getAttribute('aria-hidden')!=='true'&&!(s.getAttribute('aria-label')||s.getAttribute('aria-labelledby')||s.querySelector('title'))).length;
    const tables=[...document.querySelectorAll('#main table')];const tablesNoHeader=tables.filter(t=>!t.querySelector('th')).length;const tablesNoCaption=tables.filter(t=>!(t.caption||t.getAttribute('aria-label')||t.getAttribute('aria-labelledby')||t.closest('[role=region][aria-label],[role=region][aria-labelledby],figure'))).length;
    const pos=[...document.querySelectorAll('[tabindex]')].filter(e=>+e.getAttribute('tabindex')>0).length;
    return {lang:document.documentElement.lang,title:document.title,dupIds:dup.slice(0,5),dupIdCount:dup.length,badRefs:badRefs.slice(0,5),svgs:svgs.length,svgNoName,tables:tables.length,tablesNoHeader,tablesNoCaption,positiveTabindex:pos,h1s:document.querySelectorAll('h1').length}})()`);
  const landmarks = [...new Set(nodes.map(role).filter(x => ['main','navigation','banner','contentinfo','complementary','search'].includes(x)))];
  rows.push({ r, nodes: nodes.length, unnamed: unnamed.length, unnamedDesc, headingSkips: skips, landmarks, ...dom });
}
const sum = k => rows.reduce((a, x) => a + (Array.isArray(x[k]) ? x[k].length : x[k]), 0);
const out = { engine: ver.Browser + ' headless; Accessibility.getFullAXTree (non-native, not a screen reader)', viewport: '1280x800', routes: rows.length, disclosuresOpened: true,
  totals: { unnamedControls: sum('unnamed'), headingSkips: sum('headingSkips'), dupIds: sum('dupIdCount'), badRefs: sum('badRefs'), svgs: sum('svgs'), svgNoName: sum('svgNoName'), tables: sum('tables'), tablesNoHeader: sum('tablesNoHeader'), tablesNoCaption: sum('tablesNoCaption'), positiveTabindex: sum('positiveTabindex') },
  langs: [...new Set(rows.map(x => x.lang))], routesNotOneH1: rows.filter(x => x.h1s !== 1).map(x => x.r), landmarkSets: [...new Set(rows.map(x => x.landmarks.sort().join(',')))],
  problems: rows.filter(x => x.unnamed || x.headingSkips.length || x.dupIdCount || x.badRefs.length || x.svgNoName || x.tablesNoHeader || x.tablesNoCaption || x.positiveTabindex).map(({ r, unnamed, unnamedDesc, headingSkips, dupIds, badRefs, svgNoName, tablesNoHeader, tablesNoCaption }) => ({ r, unnamed, unnamedDesc, headingSkips, dupIds, badRefs, svgNoName, tablesNoHeader, tablesNoCaption })) };
writeFileSync(outFile, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ totals: out.totals, langs: out.langs, routesNotOneH1: out.routesNotOneH1, landmarkSets: out.landmarkSets, problemRoutes: out.problems.length }, null, 1));
ws.close(); chrome.kill();
