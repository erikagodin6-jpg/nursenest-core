import fs from 'fs';
const OPENAI_BASE = 'http://localhost:1106/modelfarm/openai';
const OPENAI_KEY = '_DUMMY_API_KEY_';
const LANGUAGES = {es:'Spanish',zh:'Simplified Chinese',ar:'Arabic',hi:'Hindi',ko:'Korean',pa:'Punjabi (Gurmukhi)',vi:'Vietnamese',ht:'Haitian Creole',ur:'Urdu',ja:'Japanese',fa:'Persian/Farsi',de:'German'};
const englishContent = JSON.parse(fs.readFileSync('./scripts/english-content.json','utf8'));
const PF='./scripts/chunk-progress.json';
function lp(){try{return JSON.parse(fs.readFileSync(PF,'utf8'));}catch{return{};}}
function sp(p){fs.writeFileSync(PF,JSON.stringify(p));}

async function callAI(sys,content){
  for(let a=0;a<2;a++){
    try{
      const c=new AbortController();const t=setTimeout(()=>c.abort(),90000);
      const r=await fetch(`${OPENAI_BASE}/chat/completions`,{
        method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${OPENAI_KEY}`},
        body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:sys},{role:'user',content}],temperature:0.3,max_tokens:16000,response_format:{type:'json_object'}}),
        signal:c.signal
      });
      clearTimeout(t);
      if(!r.ok){await new Promise(r=>setTimeout(r,2000));continue;}
      const d=await r.json();const ct=d.choices?.[0]?.message?.content;
      if(!ct)return null;return JSON.parse(ct);
    }catch(e){if(a<1)await new Promise(r=>setTimeout(r,2000));}
  }
  return null;
}

const FR=/Maladie|Diabète|Cardiomyopathie|Obésité|Tabagisme|Pesez|Surveillez|Éduquez|Élevez|Enseignez|médicaments|Encouragez|manière|secondaires|pauvre en sodium|digoxine|mesure de la PA|modifications du mode/;
function isFr(a){return Array.isArray(a)&&a.some(i=>FR.test(i));}
function isEn(a){return Array.isArray(a)&&a.length>0&&a.every(r=>/^[A-Za-z0-9\s\-\(\),.<>%\/+:;=&!'"≤≥°±→←↑↓μ\[\]{}#@*^~`_|\\]+$/.test(r));}

function getNeeded(ex,en){
  const f={};let n=false;
  for(const k of['pathophysiology','lifespan','diagnostics','management','nursingActions','assessmentFindings','signs','medications','quiz','preTest','postTest']){
    if(en[k]&&!ex[k]){f[k]=en[k];n=true;}
  }
  if((isFr(ex.riskFactors)||isEn(ex.riskFactors))&&en.riskFactors){f.riskFactors=en.riskFactors;n=true;}
  if((isFr(ex.clinicalPearls)||isEn(ex.clinicalPearls))&&en.clinicalPearls){f.clinicalPearls=en.clinicalPearls;n=true;}
  return n?f:null;
}

async function translateLesson(langName, langCode, key, fields, skipBigText) {
  const sys = `Translate nursing content to ${langName} (${langCode}). Keep drug names & abbreviations in English. For quiz: preserve "correct" index. Return JSON.`;
  
  // Optionally skip huge text fields (>8000 chars) for first pass
  if (skipBigText) {
    const filtered = {};
    for (const [f,v] of Object.entries(fields)) {
      if (typeof v === 'string' && v.length > 8000) continue;
      filtered[f] = v;
    }
    if (Object.keys(filtered).length === 0) {
      // Only big text fields remain - translate them in halves
      const results = {};
      for (const [f,v] of Object.entries(fields)) {
        if (typeof v !== 'string') continue;
        const mid = Math.floor(v.length / 2);
        const splitAt = v.lastIndexOf('. ', mid) + 2 || mid;
        const part1 = v.substring(0, splitAt);
        const part2 = v.substring(splitAt);
        const r1 = await callAI(sys, JSON.stringify({translate: part1}));
        const r2 = await callAI(sys, JSON.stringify({translate: part2}));
        if (r1?.translate && r2?.translate) {
          results[f] = r1.translate + r2.translate;
        }
      }
      return Object.keys(results).length > 0 ? {[key]: results} : null;
    }
    fields = filtered;
  }
  
  const fullSize = JSON.stringify({[key]:fields}).length;
  
  // If lesson is small enough, translate in one call
  if (fullSize < 12000) {
    return callAI(sys, JSON.stringify({[key]:fields}));
  }
  
  // Split large lessons into parts
  const textFields = {};
  const medFields = {};
  const quizFields = {};
  const bigFields = {};
  
  for (const [f,v] of Object.entries(fields)) {
    if (['medications'].includes(f)) medFields[f] = v;
    else if (['quiz','preTest','postTest'].includes(f)) quizFields[f] = v;
    else if (typeof v === 'string' && v.length > 8000) bigFields[f] = v;
    else textFields[f] = v;
  }
  
  const results = {};
  const parts = [];
  for (const [f,v] of Object.entries(bigFields)) parts.push({[f]:v});
  if (Object.keys(textFields).length) parts.push(textFields);
  if (Object.keys(medFields).length) parts.push(medFields);
  if (Object.keys(quizFields).length) parts.push(quizFields);
  
  for (const part of parts) {
    const r = await callAI(sys, JSON.stringify({[key]:part}));
    if (r && r[key]) {
      Object.assign(results, r[key]);
    }
    await new Promise(r=>setTimeout(r,100));
  }
  
  return Object.keys(results).length > 0 ? {[key]:results} : null;
}

async function processChunk(langCode, chunkSize) {
  const ln = LANGUAGES[langCode];
  const fp = `./client/src/data/translations/${langCode}.json`;
  const ex = JSON.parse(fs.readFileSync(fp,'utf8'));
  const pr = lp(); const done = new Set(pr[langCode]||[]);
  
  const work = [];
  for (const key of Object.keys(ex)) {
    if (done.has(key)) continue;
    const en = englishContent[key];
    if (!en) { done.add(key); continue; }
    const fields = getNeeded(ex[key], en);
    if (!fields) { done.add(key); continue; }
    work.push({key, fields, size: JSON.stringify(fields).length});
  }
  
  if (!work.length) { console.log(`${langCode}: COMPLETE`); return 0; }
  
  // Sort by size - small first for faster progress
  work.sort((a,b) => a.size - b.size);
  const chunk = work.slice(0, chunkSize);
  console.log(`${langCode}: ${work.length} left, doing ${chunk.length} (sizes: ${chunk.map(w=>w.size).join(',')})`);
  
  // Process: small lessons in parallel, large ones individually
  const avgSize = chunk.reduce((s,w)=>s+w.size,0)/chunk.length;
  const PAR = avgSize > 7000 ? 2 : avgSize > 5000 ? 4 : 8;
  let ok = 0;
  
  for (let i = 0; i < chunk.length; i += PAR) {
    const group = chunk.slice(i, i + PAR);
    const skipBig = group.some(w => w.size > 5000);
    const results = await Promise.all(
      group.map(item => translateLesson(ln, langCode, item.key, item.fields, skipBig))
    );
    
    for (let j = 0; j < group.length; j++) {
      const r = results[j];
      const item = group[j];
      if (r && r[item.key]) {
        for (const [f,v] of Object.entries(r[item.key])) {
          if (v != null && v !== '') ex[item.key][f] = v;
        }
        const hasBigRemaining = skipBig && Object.entries(item.fields).some(([f,v]) => typeof v === 'string' && v.length > 8000 && !r[item.key][f]);
        if (!hasBigRemaining) done.add(item.key);
        ok++;
      }
    }
  }
  
  fs.writeFileSync(fp, JSON.stringify(ex,null,2)+'\n');
  pr[langCode] = [...done]; sp(pr);
  const rem = work.length - ok;
  console.log(`${langCode}: ${ok}/${chunk.length} ok, ${rem} remaining`);
  return rem;
}

const lang = process.argv[2]; const sz = parseInt(process.argv[3]||'16');
if (!lang||!LANGUAGES[lang]) { console.log('Usage: node translate-chunk.mjs <lang> [size]'); process.exit(1); }
processChunk(lang, sz).then(r => { console.log(`Remaining: ${r}`); }).catch(e => { console.error(e); process.exit(1); });
