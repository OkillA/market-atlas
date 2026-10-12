// List every figure/width whose SVG differs between the committed renderer (argv[2]) and the working renderer.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const root=path.resolve(__dirname,'../..');
const oldR=require(path.resolve(process.argv[2])),newR=require(path.join(root,'figure-renderer.js'));
const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'content/book.js'),'utf8'),c);const book=c.window.ATLAS;
const out=process.argv[3];const changed=[];
for(const ch of book.chapters){const list=[ch.figure,...(ch.figures||[])].filter(Boolean).map((s,i)=>({id:ch.id+(i?`-${i+1}`:''),s}));(ch.learnerAttempt?.figures||[]).forEach((s,i)=>list.push({id:`${ch.id}-attempt-${i+1}`,s}));
for(const {id,s} of list){const widths=[260,320,390,760].filter(w=>oldR.render(s,{width:w})!==newR.render(s,{width:w}));if(widths.length){changed.push({chapter:ch.id,id,widths});if(out){fs.mkdirSync(out,{recursive:true});for(const w of [260,760]){fs.writeFileSync(`${out}/${id}-${w}-old.svg`,oldR.render(s,{width:w}));fs.writeFileSync(`${out}/${id}-${w}-new.svg`,newR.render(s,{width:w}));}}}}}
console.log(JSON.stringify(changed));console.log(changed.length,'figures changed;',changed.filter(x=>x.widths.includes(760)).length,'change the 760px shipping export');
