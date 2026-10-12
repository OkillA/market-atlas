'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),baseline='1c901566a5ccc0dc6a88c83b86596e4598640b61';
const load=text=>{const context={window:{}};vm.runInNewContext(text,context);return JSON.parse(JSON.stringify(context.window.ATLAS));};
const old=load(cp.execFileSync('git',['show',`${baseline}:content/book.js`],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024})),now=load(fs.readFileSync(path.join(root,'content/book.js'),'utf8'));
const stripTicks=value=>JSON.parse(JSON.stringify(value,(key,value)=>key==='integerTicks'?undefined:value));
assert.deepEqual(stripTicks(now),old,'Compiled content changed beyond the three count-axis options');
const options=[];for(const c of now.chapters)for(const f of [c.figure,...(c.figures||[])].filter(Boolean))for(const p of require('../../figure-renderer.js').flatten(f))if(p.integerTicks)options.push({chapter:c.id,title:p.title});
assert.deepEqual(options.map(o=>o.chapter),['breadth','statistics','system-design']);
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'market-atlas-renderer-build-'));
let result;
try {
  for(const dir of ['content','scripts','docs'])fs.mkdirSync(path.join(temporary,dir));
  for(const file of ['figure-renderer.js','scripts/build-content.cjs','content/curriculum.js',...now.manuscript.inputs.map(f=>`content/${f}`)])fs.copyFileSync(path.join(root,file),path.join(temporary,file));
  cp.execFileSync(process.execPath,['scripts/build-content.cjs'],{cwd:temporary});
  const figures=fs.readdirSync(path.join(temporary,'assets/figures')).sort();
  assert.deepEqual(figures,fs.readdirSync(path.join(root,'assets/figures')).sort());
  const files=['content/book.js','docs/MANUSCRIPT.md','docs/EVIDENCE_MATRIX.md',...figures.map(f=>`assets/figures/${f}`)];
  const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const mismatches=files.filter(file=>hash(path.join(temporary,file))!==hash(path.join(root,file)));
  assert.equal(mismatches.length,0,'Isolated content build differs from committed outputs');
  result={baseline,onlyCompiledChanges:options,unchanged:'All prose, numerical series, task inputs/solutions, quiz content, source records, research, glossary and part reviews match baseline exactly after omitting integerTicks.',generatedFiles:files.length,mismatches};
} finally {fs.rmSync(temporary,{recursive:true,force:true});}
fs.writeFileSync(path.join(__dirname,'build-checks.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
