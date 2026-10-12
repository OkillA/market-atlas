const fs=require('node:fs'),vm=require('node:vm');const context={window:{}};vm.runInNewContext(fs.readFileSync('content/book.js','utf8'),context);const book=context.window.ATLAS;
const chapters=book.chapters.filter(c=>['psychology','journaling'].includes(c.id));const sourceIds=[...new Set(chapters.flatMap(c=>[...c.sources,...(c.evidence||[]).flatMap(e=>e.sourceIds||[])]))].sort();
const out={chapters,sources:Object.fromEntries(sourceIds.map(id=>[id,book.sources[id]])),part:book.parts.find(p=>p.id==='risk'),partPractice:book.partPractice.risk};
fs.writeFileSync('docs/publication-batch6-assets/compiled.json',JSON.stringify(out,null,2)+'\n');
