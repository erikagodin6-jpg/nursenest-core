import fs from 'fs';
import path from 'path';

const OPENAI_BASE = 'http://localhost:1106/modelfarm/openai';
const OPENAI_KEY = '_DUMMY_API_KEY_';

const LANG_NAMES = {
  fr: 'French', tl: 'Filipino/Tagalog', hi: 'Hindi', es: 'Spanish',
  zh: 'Simplified Chinese', 'zh-tw': 'Traditional Chinese', ar: 'Arabic',
  ko: 'Korean', pt: 'Brazilian Portuguese', pa: 'Punjabi (Gurmukhi script)',
  vi: 'Vietnamese', ht: 'Haitian Creole', ur: 'Urdu', ja: 'Japanese',
  fa: 'Persian/Farsi', de: 'German', th: 'Thai', tr: 'Turkish', id: 'Indonesian'
};

const SCRIPT_LANGS = new Set(['ar', 'ur', 'fa', 'hi', 'pa', 'zh', 'zh-tw', 'ko', 'ja', 'th']);
const BATCH_SIZE = 80;
const PROGRESS_FILE = 'scripts/ui-translate-progress.json';

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); } catch { return {}; }
}
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p)); }

function extractKeysFromTs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const entries = {};
  const regex = /^\s*"([^"]+)":\s*"((?:[^"\\]|\\.)*)"/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    entries[match[1]] = match[2].replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }
  return entries;
}

function isLikelyUntranslated(key, enValue, langValue, langCode) {
  if (enValue === langValue) {
    if (/^(NP|RN|RPN|LVN|NCLEX|AANP|ANCC|FNP-BC|NurseNest|QOTD|NurseNest Pro|A&P|IV|GI|REX-PN|NCLEX-PN|NCLEX-RN|REx-PN)$/i.test(enValue)) return false;
    if (/^[A-Z]{1,5}$/.test(enValue)) return false;
    if (/^https?:\/\//.test(enValue)) return false;
    if (/^(Plan:|Premium|Blog|QOTD|NP)$/.test(enValue)) return false;
    if (enValue.length <= 3) return false;
    return true;
  }
  if (SCRIPT_LANGS.has(langCode)) {
    const nonAsciiRatio = (langValue.match(/[^\x00-\x7F]/g) || []).length / Math.max(langValue.length, 1);
    if (langValue.length > 10 && nonAsciiRatio < 0.1) return true;
  }
  return false;
}

function isMixedLanguage(key, enValue, langValue, langCode) {
  if (enValue === langValue) return false;
  if (langValue.length < 20) return false;
  const enWords = enValue.toLowerCase().split(/\s+/);
  const langWords = langValue.toLowerCase().split(/\s+/);
  if (langWords.length < 3) return false;
  let enWordCount = 0;
  const stopWords = new Set(['the','and','for','with','your','that','this','from','have','will','been','are','was','can','not','but','all','has','you','our','per','get','new','may','use','its','set','how','why','who','what','when','any','also','into','over','more','than','some','only','very','just','like','most','take','each','make','here','then','many','well','help','come','made','back','even','good','much','way','day','too','see','did','out','now','own','say','she','her','him','his','let','run','try','ask','put','end','go','no','up','do','so','if','am','on','at','in','us','we','to','of','be','it','is','or','as','an','by','my']);
  for (const w of langWords) {
    if (w.length > 3 && enWords.includes(w) && !stopWords.has(w)) enWordCount++;
  }
  return (enWordCount / langWords.length) > 0.3 && enWordCount >= 3;
}

async function callAI(systemPrompt, userContent) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);
      const resp = await fetch(`${OPENAI_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          temperature: 0.3,
          max_tokens: 16000,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!resp.ok) {
        console.error(`  API error ${resp.status}`);
        if (attempt < 2) { await new Promise(r => setTimeout(r, 2000)); continue; }
        return null;
      }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) return null;
      return JSON.parse(content);
    } catch (e) {
      console.error(`  Error: ${e.message?.substring(0, 80)}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

function escapeForTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function writeTranslationFile(langCode, allEntries) {
  const filePath = path.resolve(`tools/i18n/source/i18n-${langCode}.ts`);
  const sortedKeys = Object.keys(allEntries).sort();
  const existingContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';

  let varName = 'translations';
  let usesExportDefault = existingContent.startsWith('export default {');
  const varMatch = existingContent.match(/const\s+(\w+)\s*(?::\s*Record<string,\s*string>)?\s*=/);
  if (varMatch) varName = varMatch[1];

  let lines;
  if (usesExportDefault) {
    lines = ['export default {'];
  } else {
    const typeAnnotation = existingContent.includes('Record<string, string>') ? ': Record<string, string>' : '';
    lines = [`const ${varName}${typeAnnotation} = {`];
  }

  for (const key of sortedKeys) {
    lines.push(`  "${key}": "${escapeForTs(allEntries[key])}",`);
  }

  if (usesExportDefault) {
    lines.push('} as const;');
  } else {
    lines.push('};');
    lines.push('');
    lines.push(`export default ${varName};`);
  }

  fs.writeFileSync(filePath, lines.join('\n') + '\n');
}

async function main() {
  const targetLangs = process.argv[2] ? process.argv[2].split(',') : Object.keys(LANG_NAMES);
  const maxBatches = process.argv[3] ? parseInt(process.argv[3]) : 999;
  const libDir = path.resolve('tools/i18n/source');
  const enKeys = extractKeysFromTs(path.join(libDir, 'i18n-en.ts'));
  const progress = loadProgress();

  for (const lang of targetLangs) {
    if (!LANG_NAMES[lang]) continue;
    const langFile = path.join(libDir, `i18n-${lang}.ts`);
    if (!fs.existsSync(langFile)) continue;

    const langKeys = extractKeysFromTs(langFile);
    const needed = {};
    for (const [key, enVal] of Object.entries(enKeys)) {
      if (!(key in langKeys)) {
        needed[key] = enVal;
      } else if (isLikelyUntranslated(key, enVal, langKeys[key], lang)) {
        needed[key] = enVal;
      } else if (isMixedLanguage(key, enVal, langKeys[key], lang)) {
        needed[key] = enVal;
      }
    }

    const done = progress[lang] || [];
    const remaining = Object.keys(needed).filter(k => !done.includes(k));

    if (remaining.length === 0) {
      console.log(`✓ ${LANG_NAMES[lang]} (${lang}): complete`);
      continue;
    }

    console.log(`\n${LANG_NAMES[lang]} (${lang}): ${remaining.length} keys remaining`);
    const allKeys = { ...langKeys };
    let batchesDone = 0;

    const systemPrompt = `You are a professional translator for NurseNest, a nursing education platform. Translate UI strings from English to ${LANG_NAMES[lang]}.

Rules:
- Translate ALL text naturally and fluently
- Keep proper nouns (NurseNest, NCLEX, NCLEX-RN, NCLEX-PN, REx-PN, AANP, ANCC, FNP-BC) in English
- Keep medical abbreviations (IV, GI, BP, HR, ECG, ABG, BUN, CBC, WBC, RBC, INR, PTT, PT, SpO2) in English
- Keep template variables like {{name}}, {{count}} unchanged
- Do NOT mix English words into translations
- Return a JSON object with the same keys mapped to translated string values`;

    for (let i = 0; i < remaining.length && batchesDone < maxBatches; i += BATCH_SIZE) {
      const batchKeys = remaining.slice(i, i + BATCH_SIZE);
      const batch = {};
      for (const k of batchKeys) batch[k] = needed[k];

      process.stdout.write(`  [${batchesDone + 1}] ${batchKeys.length} keys... `);
      const result = await callAI(systemPrompt, JSON.stringify(batch));

      if (result) {
        let count = 0;
        for (const key of batchKeys) {
          if (result[key] && typeof result[key] === 'string') {
            allKeys[key] = result[key];
            done.push(key);
            count++;
          }
        }
        console.log(`${count}/${batchKeys.length} ok`);
      } else {
        console.log('FAILED');
      }

      progress[lang] = done;
      saveProgress(progress);
      writeTranslationFile(lang, allKeys);
      batchesDone++;
    }

    const totalDone = Object.keys(enKeys).length - Object.keys(getKeysToTranslateFromEntries(enKeys, allKeys, lang)).length;
    console.log(`  Progress: ~${((totalDone / Object.keys(enKeys).length) * 100).toFixed(1)}% coverage`);
  }
}

function getKeysToTranslateFromEntries(enKeys, langKeys, langCode) {
  const needed = {};
  for (const [key, enVal] of Object.entries(enKeys)) {
    if (!(key in langKeys)) needed[key] = enVal;
    else if (isLikelyUntranslated(key, enVal, langKeys[key], langCode)) needed[key] = enVal;
  }
  return needed;
}

main().catch(e => { console.error(e); process.exit(1); });
