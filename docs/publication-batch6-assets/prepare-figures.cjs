const fs=require('node:fs');const d=require('./compiled.json'),r=require('../../figure-renderer.js');
const manifest=[];
for(const chapter of d.chapters){[chapter.figure,...(chapter.figures||[])].filter(Boolean).forEach((spec,i)=>{
const id=chapter.id+(i?'-'+(i+1):'');const entry={id,title:spec.title,caption:spec.caption,portable:{}};
for(const width of [260,760]){const svg=r.render(spec,{width});entry.portable[width]=svg;fs.writeFileSync(`${__dirname}/${id}-${width}.svg`,svg+'\n');}
manifest.push(entry);
});}
fs.writeFileSync(`${__dirname}/inspection-data.js`,'window.figureInspection = '+JSON.stringify(manifest)+';\n');
fs.writeFileSync(`${__dirname}/figure-manifest.json`,JSON.stringify(manifest.map(({id,title})=>({id,title,widths:[260,760]})),null,2)+'\n');
