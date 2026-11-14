import fs from 'node:fs';
const scores=JSON.parse(fs.readFileSync('.taste-skill/scores.json','utf8'));
let chart='<section class="score-chart" aria-label="История оценок Council"><h2>Council · оценки по раундам</h2><div class="legend">';
const labels=['Исходник','Раунд 1','Раунд 2','Итог'];
for(let i=0;i<labels.length;i++)chart+=`<span><i style="background:var(--chart-${i+1})"></i>${labels[i]}</span>`;
chart+='</div>';
for(const [name,values] of Object.entries(scores.reviewers)){
 chart+=`<div class="score-group"><strong>${name}</strong><div>`;
 values.forEach((v,i)=>{chart+=`<div class="score-line" aria-label="${name}, ${scores.rounds[i]}: ${v??'ещё нет оценки'}"><div class="score-track"><span style="width:${v===null?0:v*10}%;background:var(--chart-${i+1})"></span></div><small>${v??'—'}</small></div>`});
 chart+='</div></div>';
}
chart+='</section><style>.score-chart{margin-top:20px}.score-chart h2{font-size:16px;font-weight:500;margin:0 0 12px}.legend{display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--muted-foreground);margin-bottom:12px}.legend span{display:flex;align-items:center;gap:5px}.legend i{width:12px;height:6px}.score-group{display:grid;grid-template-columns:20px 1fr;gap:8px;margin-bottom:10px}.score-group strong{font-weight:500;font-size:13px}.score-line{display:grid;grid-template-columns:1fr 28px;gap:8px;align-items:center;height:13px}.score-track{height:6px;background:var(--secondary);border-radius:3px;overflow:hidden}.score-track span{height:6px;display:block;border-radius:3px}.score-line small{font-size:10px;color:var(--muted-foreground)}</style>';
fs.appendFileSync('.taste-skill/comparison.html',chart);
