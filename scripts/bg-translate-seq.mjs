import fs from 'fs';
const OPENAI_BASE = 'http://localhost:1106/modelfarm/openai';
const OPENAI_KEY = '_DUMMY_API_KEY_';
const LANGUAGES = {es:'Spanish',zh:'Simplified Chinese',ar:'Arabic',hi:'Hindi',ko:'Korean',pa:'Punjabi (Gurmukhi)',vi:'Vietnamese',ht:'Haitian Creole',ur:'Urdu',ja:'Japanese',fa:'Persian/Farsi',de:'German'};
const englishContent = JSON.parse(fs.readFileSync('./scripts/english-content.json','utf8'));
const PF='./scripts/chunk-progress.json';
const STATUS='./scripts/translate-status.txt';
function lp(){try{return JSON.parse(fs.readFileSync(PF,'utf8'));}catch{return{};}}
function sp(p){fs.writeFileSync(PF,JSON.stringify(p));}
function log(msg){const m=`[${new Date().toISOString()}] ${msg}`;console.log(m);try{fs.appendFileSync(STATUS,m+'\n');}catch{}}

async function callAI(sys,content){
  for(let a=0;a<3;a++){
    try{
      const r=await fetch(`${OPENAI_BASE}/chat/completions`,{
        method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${OPENAI_KEY}`},
        body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:sys},{role:'user',content}],temperature:0.3,max_tokens:16000,response_format:{type:'json_object'}})
      });
      if(!r.ok){log(`API ${r.status}`);await new Promise(r=>setTimeout(r,3000));continue;}
      const d=await r.json();return JSON.parse(d.choices?.[0]?.message?.content||'null');
    }catch(e){log(`Err(${a}): ${String(e).substring(0,80)}`);await new Promise(r=>setTimeout(r,3000));}
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
  const ex=JSON.parse(fs.readFileSync(fp,'utf8'));
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
  
  if(!work.length){log(`${langCode}: COMPLETE`);return;}
  log(`${langCode}: ${work.length} lessons`);
  
  const sys=`Translate nursing content to ${ln} (${langCode}). Keep drug names & abbreviations in English. For quiz: preserve "correct" index. Return JSON.`;
  let ok=0,fail=0;
  
  // Process 4 at a time using Promise.all
  for(let i=0;i<work.length;i+=4){
    const group=work.slice(i,i+4);
    try{
      const results=await Promise.all(group.map(item=>
        callAI(sys,JSON.stringify({[item.key]:item.fields}))
      ));
      for(let j=0;j<group.length;j++){
        const r=results[j];const item=group[j];
        if(r&&r[item.key]){
          for(const[f,v]of Object.entries(r[item.key]))if(v!=null&&v!=='')ex[item.key][f]=v;
          done.add(item.key);ok++;
        }else fail++;
      }
    }catch(e){log(`Batch err: ${String(e).substring(0,80)}`);fail+=group.length;}
    
    if((ok+fail)%20<4||i+4>=work.length){
      fs.writeFileSync(fp,JSON.stringify(ex,null,2)+'\n');
      pr[langCode]=[...done];sp(pr);
      log(`${langCode}: ${ok}/${work.length}`);
    }
    await new Promise(r=>setTimeout(r,100));
  }
  
  fs.writeFileSync(fp,JSON.stringify(ex,null,2)+'\n');
  pr[langCode]=[...done];sp(pr);
  log(`${langCode}: DONE ${ok}/${work.length}`);
}

async function main(){
  try{fs.writeFileSync(STATUS,'');}catch{}
  log('=== STARTING ===');
  for(const lang of Object.keys(LANGUAGES)){
    try{await processLang(lang);}catch(e){log(`ERR ${lang}: ${e.message}`);}
  }
  log('=== ALL DONE ===');
}

process.on('uncaughtException',e=>{log(`UNCAUGHT: ${e.message}\n${e.stack}`);});
process.on('unhandledRejection',e=>{log(`UNHANDLED: ${e}`);});
main().catch(e=>{log(`FATAL: ${e.message}`);process.exit(1);});
