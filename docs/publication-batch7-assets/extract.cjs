// Extract compiled Chapters 24–28, their sources and Part 6 tasks from the shipping book.js.
const fs=require('node:fs'),vm=require('node:vm');const context={window:{}};vm.runInNewContext(fs.readFileSync('content/book.js','utf8'),context);const book=context.window.ATLAS;
const ids=['testing','statistics','system-design','classical-frameworks','case-studies'];
const chapters=book.chapters.filter(c=>ids.includes(c.id));const sourceIds=[...new Set(chapters.flatMap(c=>[...(c.sources||[]),...(c.evidence||[]).flatMap(e=>e.sourceIds||[])]))].sort();
const out={chapters,sources:Object.fromEntries(sourceIds.map(id=>[id,book.sources[id]])),part:book.parts.find(p=>p.id==='advanced'),partPractice:book.partPractice.advanced};
fs.writeFileSync('docs/publication-batch7-assets/compiled.json',JSON.stringify(out,null,2)+'\n');
for(const c of chapters){fs.writeFileSync(`docs/publication-batch7-assets/compiled-${c.id}.json`,JSON.stringify({chapter:c,sources:Object.fromEntries([...new Set([...(c.sources||[]),...(c.evidence||[]).flatMap(e=>e.sourceIds||[])])].map(id=>[id,book.sources[id]]))},null,2)+'\n');}
console.log(chapters.map(c=>c.id).join(','),'sources',sourceIds.length,'part tasks',(out.partPractice||[]).length);
