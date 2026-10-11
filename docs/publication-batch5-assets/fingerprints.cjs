// Recompute chapter/part fingerprints per the checkpoint's documented formula and compare.
const crypto=require('crypto'),fs=require('fs'),path=require('path');const root=process.argv[2];
global.window=global;require(path.join(root,'content/book.js'));const book=window.ATLAS;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const cp=JSON.parse(fs.readFileSync(path.join(root,process.argv[3]),'utf8'));
const chFp={};
for(const chapter of book.chapters){const ids=[...new Set([...(chapter.sources||[]),...(chapter.evidence||[]).flatMap(e=>e.sourceIds||[])])].sort();chFp[chapter.id]=sha(JSON.stringify({chapter,sources:ids.map(id=>[id,book.sources[id]])}));}
const out={chapters:[],parts:[]};
for(const c of cp.chapters){out.chapters.push({id:c.id,accepted:c.publicationAcceptance,old:c.sha256,now:chFp[c.id],same:c.sha256===chFp[c.id]});}
for(const part of book.parts){const fp=sha(JSON.stringify({part,practice:book.partPractice[part.id],chapters:part.chapters.map(id=>[id,chFp[id]])}));const o=cp.partReviews.find(p=>p.id===part.id);out.parts.push({id:part.id,accepted:o&&o.publicationAcceptance,old:o&&o.sha256,now:fp,same:o&&o.sha256===fp});}
console.log(JSON.stringify(out));
