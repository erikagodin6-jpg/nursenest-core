import fs from 'fs';
const OPENAI_BASE = 'http://localhost:1106/modelfarm/openai';
const OPENAI_KEY = '_DUMMY_API_KEY_';
const LANGUAGES = {
  es:'Spanish',zh:'Simplified Chinese',ar:'Arabic',hi:'Hindi',
  ko:'Korean',pa:'Punjabi (Gurmukhi)',vi:'Vietnamese',
  ht:'Haitian Creole',ur:'Urdu',ja:'Japanese',fa:'Persian/Farsi',de:'German'
};
const englishContent = JSON.parse(fs.readFileSync('./scripts/english-content.json','utf8'));
const PF='./scripts/chunk-progress.json';
const STATUS='./scripts/translate-status.txt';

function lp(){try{return JSON.parse(fs.readFileSync(PF,'utf8'));}catch{return{};}}
function sp(p){fs.writeFileSync(PF,JSON.stringify(p));}
function log(msg){const m=`[${new Date().toISOString()}] ${msg}`;console.log(m);try{fs.appendFileSync(STATUS,m+'\n');}catch{}}

async function callAI(sys,content){
  for(let a=0;a<3;a++){
    try{
      const c=new AbortController();const t=setTimeout(()=>c.abort(),90000);
      const r=await fetch(`${OPENAI_BASE}/chat/completions`,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${OPENAI_KEY}`},
        body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:sys},{role:'user',content}],temperature:0.3,max_tokens:16000,response_format:{type:'json_object'}}),
        signal:c.signal
      });
      clearTimeout(t);
      if(!r.ok){
        const et=await r.text().catch(()=>'');
        log(`API ${r.status}: ${et.substring(0,100)}`);
        await new Promise(r=>setTimeout(r,3000*(a+1)));
        continue;
      }
      const d=await r.json();
      const ct=d.choices?.[0]?.message?.content;
      if(!ct)return null;
      return JSON.parse(ct);
    }catch(e){
      log(`Err(${a}): ${e.message?.substring(0,80)}`);
      await new Promise(r=>setTimeout(r,3000*(a+1)));
    }
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

async function processLang(langCode){
  const ln=LANGUAGES[langCode];
  log(`Starting ${langCode} (${ln})`);
  const fp=`./client/src/data/translations/${langCode}.json`;
  let ex;
  try{ex=JSON.parse(fs.readFileSync(fp,'utf8'));}catch(e){log(`Cannot read ${fp}: ${e.message}`);return;}
  
  const pr=lp();const done=new Set(pr[langCode]||[]);
  const work=[];
  for(const key of Object.keys(ex)){
    if(done.has(key))continue;
    const en=englishContent[key];
    if(!en){done.add(key);continue;}
    const fields=getNeeded(ex[key],en);
    if(!fields){done.add(key);continue;}
    work.push({key,fields});
  }
  
  if(!work.length){log(`${langCode}: COMPLETE (nothing to do)`);return;}
  log(`${langCode}: ${work.length} lessons to translate`);
  
  const sys=`Translate nursing content to ${ln} (${langCode}). Keep drug names & abbreviations (ECG, IV, BP, COPD, SpO2, etc.) in English. For quiz: preserve "correct" index exactly. Return valid JSON with same structure.`;
  
  const PAR=6;
  let ok=0,fail=0;
  
  for(let i=0;i<work.length;i+=PAR){
    const group=work.slice(i,i+PAR);
    
    try{
      const results=await Promise.all(
        group.map(item=>callAI(sys,JSON.stringify({[item.key]:item.fields})))
      );
      
      for(let j=0;j<group.length;j++){
        const r=results[j];
        const item=group[j];
        if(r&&r[item.key]){
          for(const[f,v]of Object.entries(r[item.key])){
            if(v!=null&&v!=='')ex[item.key][f]=v;
          }
          done.add(item.key);ok++;
        }else{
          fail++;
        }
      }
    }catch(e){
      log(`Batch error at ${i}: ${e.message}`);
      fail+=group.length;
    }
    
    // Save every 30 lessons
    if((ok+fail)%30<PAR||i+PAR>=work.length){
      try{
        fs.writeFileSync(fp,JSON.stringify(ex,null,2)+'\n');
        pr[langCode]=[...done];sp(pr);
      }catch(e){log(`Save error: ${e.message}`);}
      log(`${langCode}: ${ok}/${work.length} ok, ${fail} fail`);
    }
    
    await new Promise(r=>setTimeout(r,200));
  }
  
  try{
    fs.writeFileSync(fp,JSON.stringify(ex,null,2)+'\n');
    pr[langCode]=[...done];sp(pr);
  }catch(e){log(`Final save error: ${e.message}`);}
  log(`${langCode}: FINISHED ${ok} ok, ${fail} fail of ${work.length}`);
}

async function main(){
  try{fs.writeFileSync(STATUS,'');}catch{}
  log('=== Translation process starting ===');
  
  for(const lang of Object.keys(LANGUAGES)){
    try{
      await processLang(lang);
    }catch(e){
      log(`LANG ERROR ${lang}: ${e.message}\n${e.stack}`);
    }
  }
  log('=== ALL COMPLETE ===');
}

process.on('uncaughtException',(e)=>{log(`UNCAUGHT: ${e.message}\n${e.stack}`);process.exit(1);});
process.on('unhandledRejection',(e)=>{log(`UNHANDLED: ${e?.message||e}`);});

main().catch(e=>{log(`FATAL: ${e.message}\n${e.stack}`);process.exit(1);});
