const fs=require('node:fs'),r=require('../../figure-renderer.js'),d=require(process.argv.includes('--before')?'./before.json':'./compiled.json');const figure=d.chapters.find(c=>c.id==='psychology').figure;
const records=[];
for(const width of [260,320,390,760]){
const svg=r.render(figure,{width});const labels=[...svg.matchAll(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)" fill="[^"]+" opacity=".92"/g)].map(m=>m.slice(1).map(Number));
for(const match of svg.matchAll(/<path data-series="(\d+)" d="([^"]+)"/g)){
const pts=[...match[2].matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map(m=>m.slice(1).map(Number));let covered=0,total=0;
for(let i=1;i<pts.length;i++){const [a,b]=[pts[i-1],pts[i]];const n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));for(let k=0;k<n;k++){const t=(k+.5)/n,x=a[0]+t*(b[0]-a[0]),y=a[1]+t*(b[1]-a[1]);total++;if(labels.some(([rx,ry,w,h])=>x>=rx&&x<=rx+w&&y>=ry&&y<=ry+h))covered++;}}
records.push({width,series:+match[1],covered,total,percent:+(100*covered/total).toFixed(2)});
}
}
const file=process.argv[2]||'path-coverage.json';fs.writeFileSync(`${__dirname}/${file}`,JSON.stringify(records,null,2)+'\n');console.log(JSON.stringify(records));
