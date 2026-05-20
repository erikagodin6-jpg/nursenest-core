import fs from 'fs';

const OPENAI_BASE = 'http://localhost:1106/modelfarm/openai';
const OPENAI_KEY = '_DUMMY_API_KEY_';

const LANGUAGES = {
  es: 'Spanish', zh: 'Simplified Chinese', ar: 'Arabic', hi: 'Hindi',
  ko: 'Korean', pa: 'Punjabi (Gurmukhi script)', vi: 'Vietnamese',
  ht: 'Haitian Creole', ur: 'Urdu', ja: 'Japanese', fa: 'Persian/Farsi', de: 'German'
};

const englishContent = JSON.parse(fs.readFileSync('./scripts/english-content.json', 'utf8'));

async function callOpenAI(messages, maxTokens = 16000, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const resp = await fetch(`${OPENAI_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.3,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' }
        })
      });
      if (!resp.ok) {
        const errText = await resp.text();
        console.error(`  API err ${resp.status}: ${errText.substring(0, 150)}`);
        if (attempt < retries - 1) { await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); continue; }
        return null;
      }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) return null;
      return JSON.parse(content);
    } catch (e) {
      console.error(`  Err (${attempt+1}):`, e.message?.substring(0, 100));
      if (attempt < retries - 1) await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  return null;
}

const FRENCH_RE = /Maladie|Diabète|Cardiomyopathie|Obésité|Tabagisme|Pesez|Surveillez|Éduquez|Élevez|Enseignez|médicaments|Encouragez|manière constante|secondaires|pauvre en sodium|digoxine nécessite|degrés pour|mesure de la PA|modifications du mode/;

function hasFrench(arr) {
  return Array.isArray(arr) && arr.some(item => FRENCH_RE.test(item));
}

function isEnglishText(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  return arr.some(r => /^[A-Za-z0-9\s\-\(\),.<>%\/+:;=&!'"≤≥°±→←↑↓μ\[\]{}#@*^~`_|\\]+$/.test(r));
}

function getNeededFields(existingLesson, enLesson) {
  const fields = {};
  let needed = false;

  for (const f of ['pathophysiology','lifespan','diagnostics','management','nursingActions',
    'assessmentFindings','signs','medications','quiz','preTest','postTest']) {
    if (enLesson[f] && !existingLesson[f]) {
      fields[f] = enLesson[f];
      needed = true;
    }
  }

  if (hasFrench(existingLesson.riskFactors) && enLesson.riskFactors) {
    fields.riskFactors = enLesson.riskFactors; needed = true;
  } else if (isEnglishText(existingLesson.riskFactors) && enLesson.riskFactors) {
    fields.riskFactors = enLesson.riskFactors; needed = true;
  }
  
  if (hasFrench(existingLesson.clinicalPearls) && enLesson.clinicalPearls) {
    fields.clinicalPearls = enLesson.clinicalPearls; needed = true;
  } else if (isEnglishText(existingLesson.clinicalPearls) && enLesson.clinicalPearls) {
    fields.clinicalPearls = enLesson.clinicalPearls; needed = true;
  }

  return needed ? fields : null;
}

// Split large lessons into text-fields and structured-fields batches
function splitByComplexity(batch) {
  const inputStr = JSON.stringify(batch);
  if (inputStr.length <= 50000) return [batch];
  
  const keys = Object.keys(batch);
  if (keys.length <= 1) {
    // Single lesson too large - split by field type
    const key = keys[0];
    const lesson = batch[key];
    const textFields = {};
    const structFields = {};
    for (const [f, v] of Object.entries(lesson)) {
      if (['quiz','preTest','postTest','medications'].includes(f)) {
        structFields[f] = v;
      } else {
        textFields[f] = v;
      }
    }
    const result = [];
    if (Object.keys(textFields).length) result.push({[key]: textFields});
    if (Object.keys(structFields).length) result.push({[key]: structFields});
    return result;
  }
  
  const mid = Math.ceil(keys.length / 2);
  const b1 = {}, b2 = {};
  keys.slice(0, mid).forEach(k => b1[k] = batch[k]);
  keys.slice(mid).forEach(k => b2[k] = batch[k]);
  return [...splitByComplexity(b1), ...splitByComplexity(b2)];
}

async function translateBatch(langName, langCode, batch) {
  const subBatches = splitByComplexity(batch);
  if (subBatches.length > 1) {
    let combined = {};
    for (const sub of subBatches) {
      const result = await translateSingleBatch(langName, langCode, sub);
      for (const [k, v] of Object.entries(result)) {
        combined[k] = { ...(combined[k] || {}), ...v };
      }
      await new Promise(r => setTimeout(r, 200));
    }
    return combined;
  }
  return translateSingleBatch(langName, langCode, batch);
}

async function translateSingleBatch(langName, langCode, batch) {
  const inputStr = JSON.stringify(batch);
  const messages = [
    {
      role: 'system',
      content: `Translate nursing education content to ${langName} (${langCode}). Rules:
- Standard medical terminology in ${langName}
- Keep abbreviations (ECG, IV, BP, COPD, SpO2, etc.) and drug names in English
- For quiz/test: translate questions, options, rationales. PRESERVE "correct" index exactly
- For medications: keep drug names in English. Translate type, action, sideEffects, contra, pearl
- Return ONLY valid JSON with same structure`
    },
    { role: 'user', content: inputStr }
  ];
  
  const estTokens = Math.min(16000, Math.ceil(inputStr.length / 2));
  return await callOpenAI(messages, estTokens) || {};
}

async function processLanguage(langCode) {
  const langName = LANGUAGES[langCode];
  const startTime = Date.now();
  console.log(`\n=== ${langName} (${langCode}) ===`);

  const filePath = `./client/src/data/translations/${langCode}.json`;
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const lessonKeys = Object.keys(existing);

  const work = {};
  for (const key of lessonKeys) {
    const en = englishContent[key];
    if (!en) continue;
    const fields = getNeededFields(existing[key], en);
    if (fields) work[key] = fields;
  }

  const total = Object.keys(work).length;
  console.log(`  ${total} lessons need work`);
  if (total === 0) return;

  const BATCH = 5;
  const keys = Object.keys(work);
  let ok = 0, fail = 0;

  for (let i = 0; i < keys.length; i += BATCH) {
    const bk = keys.slice(i, i + BATCH);
    const batch = {};
    bk.forEach(k => batch[k] = work[k]);

    const bn = Math.floor(i / BATCH) + 1;
    const bt = Math.ceil(keys.length / BATCH);
    
    const translated = await translateBatch(langName, langCode, batch);

    let s = 0;
    for (const [key, fields] of Object.entries(translated)) {
      if (!existing[key]) continue;
      for (const [f, v] of Object.entries(fields)) {
        if (v != null && v !== '') existing[key][f] = v;
      }
      s++;
    }
    ok += s; fail += bk.length - s;
    
    if (bn % 5 === 0 || i + BATCH >= keys.length) {
      console.log(`  [${bn}/${bt}] ${ok}/${total} done`);
      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n');
    }

    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n');
  const elapsed = ((Date.now() - startTime) / 60000).toFixed(1);
  console.log(`  DONE ${langCode}: ${ok} ok, ${fail} fail (${elapsed}m)`);
}

async function main() {
  const target = process.argv[2];
  if (!target) { console.log('Usage: node translate-lessons.mjs <lang|all>'); return; }

  const progressFile = './scripts/translation-progress.json';
  let progress = {};
  try { progress = JSON.parse(fs.readFileSync(progressFile, 'utf8')); } catch {}

  if (target === 'all') {
    for (const lang of Object.keys(LANGUAGES)) {
      if (progress[lang] === 'done') { console.log(`Skipping ${lang} (already done)`); continue; }
      await processLanguage(lang);
      progress[lang] = 'done';
      fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
    }
  } else if (LANGUAGES[target]) {
    await processLanguage(target);
    progress[target] = 'done';
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
  }
}

main().catch(console.error);
