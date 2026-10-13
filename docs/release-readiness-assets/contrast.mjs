// Text contrast and font-size audit via headless Chrome CDP (computed colours, not a visual check). Usage: node contrast.mjs <baseUrl> <out.json>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [base, outFile] = process.argv.slice(2);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--remote-debugging-port=9336','--user-data-dir=/tmp/ma-qa/chrome-contrast','about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ver; for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:9336/json/version')).json(); } catch { await sleep(200); } }
const ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map();
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}, sessionId) => new Promise(r => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable');
await S('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
const ev = async e => (await S('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
await S('Page.navigate', { url: base + '#/' }); await sleep(2000);
const routes = await ev(`(()=>{const b=window.ATLAS;const r=['#/','#/contents','#/glossary','#/evidence','#/about','#/notebook','#/lab'];for(const p of b.parts){for(const c of p.chapters)r.push('#/chapter/'+(typeof c==='string'?c:c.id));if(b.partPractice?.[p.id])r.push('#/practice/'+p.id);}return r})()`);
const AUDIT = `(()=>{
  const parse=c=>{const m=c.match(/[\\d.]+/g)||[];return m.length>=3?[+m[0],+m[1],+m[2],m.length>3?+m[3]:1]:null};
  const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
  const bgOf=el=>{let layers=[];for(let e=el;e;e=e.parentElement){const c=parse(getComputedStyle(e).backgroundColor);if(c&&c[3]>0){layers.push(c);if(c[3]>=1)break;}}
    let col=[255,255,255];for(const l of layers.reverse()){col=col.map((v,i)=>v*(1-l[3])+l[i]*l[3]);}return col};
  const out={};const small={};
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while((n=walker.nextNode())){const t=n.textContent.trim();if(!t)continue;const el=n.parentElement;if(el.closest('svg,[hidden],.sr-only,script,style,details:not([open])>:not(summary)'))continue;
    const r=el.getBoundingClientRect();if(!r.width||!r.height)continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity===0)continue;
    let op=1;for(let e=el;e;e=e.parentElement)op*=+getComputedStyle(e).opacity;
    const fg=parse(cs.color);const bg=bgOf(el);const a=fg[3]*op;const fgc=fg.slice(0,3).map((v,i)=>v*a+bg[i]*(1-a));
    const L1=lum(fgc),L2=lum(bg);const ratio=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);const size=parseFloat(cs.fontSize);const bold=+cs.fontWeight>=700;
    const large=size>=24||(bold&&size>=18.66);const need=large?3:4.5;const disabled=!!el.closest('button:disabled,[aria-disabled=true]');
    const key=(el.className&&typeof el.className==='string'?'.'+el.className.split(' ')[0]:el.tagName.toLowerCase())+' '+cs.color+' on rgb('+bg.map(Math.round).join(',')+') '+size+'px';
    if(ratio<need&&!disabled){out[key]=out[key]||{ratio:+ratio.toFixed(2),need,count:0,sample:t.slice(0,50),tag:el.tagName};out[key].count++;}
    if(size<11){const k2=size+'px '+(el.className&&typeof el.className==='string'?'.'+el.className.split(' ')[0]:el.tagName.toLowerCase());small[k2]=small[k2]||{count:0,sample:t.slice(0,40)};small[k2].count++;}
  }return {fails:out,small}})()`;
const result = {};
for (const theme of ['light', 'dark']) {
  const agg = {}, small = {};
  for (const r of routes) {
    await ev(`location.hash=${JSON.stringify(r)};1`); await sleep(600);
    await ev(`document.body.classList.toggle('dark', ${theme === 'dark'});document.querySelectorAll('#main details').forEach(d=>d.open=true);1`); await sleep(250);
    const { fails, small: sm } = await ev(AUDIT);
    for (const [k, v] of Object.entries(fails)) { agg[k] = agg[k] || { ...v, count: 0, routes: [] }; agg[k].count += v.count; if (agg[k].routes.length < 4) agg[k].routes.push(r); }
    for (const [k, v] of Object.entries(sm)) { small[k] = small[k] || { ...v, count: 0 }; small[k].count += v.count; }
  }
  result[theme] = { failingStyles: Object.entries(agg).sort((a, b) => a[1].ratio - b[1].ratio).map(([k, v]) => ({ style: k, ...v })), textUnder11px: small };
}
await ev(`document.body.classList.remove('dark');1`);
const out = { engine: ver.Browser + ' headless; computed colours composited over ancestor backgrounds (non-native)', viewport: '1280x800', routes: routes.length, disclosuresOpened: true, thresholds: 'WCAG 1.4.3: 4.5:1, or 3:1 for >=24px or bold >=18.66px; disabled controls excluded; SVG text excluded (covered by figure checks)', ...result };
writeFileSync(outFile, JSON.stringify(out, null, 1));
for (const t of ['light', 'dark']) { console.log(t, 'failing styles:', out[t].failingStyles.length); for (const f of out[t].failingStyles) console.log('  ', f.ratio, '<', f.need, 'x' + f.count, f.style, '|', f.sample, '|', f.routes.join(' ')); console.log('  under 11px:', JSON.stringify(out[t].textUnder11px)); }
ws.close(); chrome.kill();
