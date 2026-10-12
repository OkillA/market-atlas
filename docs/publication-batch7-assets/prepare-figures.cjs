// Render every Chapter 24–28 figure at 260/760px with the shared renderer (portable light palette).
const fs=require('node:fs');const d=require('./compiled.json'),r=require('../../figure-renderer.js');
const out=`${__dirname}/figures`;fs.mkdirSync(out,{recursive:true});const manifest=[];
for(const chapter of d.chapters){[chapter.figure,...(chapter.figures||[])].filter(Boolean).forEach((spec,i)=>{
const id=chapter.id+(i?'-'+(i+1):'');
for(const width of [260,760])fs.writeFileSync(`${out}/${id}-${width}.svg`,r.render(spec,{width})+'\n');
manifest.push({id,chapter:chapter.id,title:spec.title,kind:spec.kind||spec.type||(spec.panels?'panels':'line'),widths:[260,760]});
});}
fs.writeFileSync(`${__dirname}/figure-manifest.json`,JSON.stringify(manifest,null,2)+'\n');console.log(manifest.length,'figures');
