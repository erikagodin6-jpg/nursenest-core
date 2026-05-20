import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "http://localhost:1106/modelfarm/openai",
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "_DUMMY_API_KEY_",
});

const LANG_NAMES: Record<string, string> = {
  fr: "French",
  es: "Spanish",
  pt: "Portuguese",
  zh: "Simplified Chinese",
  ar: "Arabic",
  ja: "Japanese",
  ko: "Korean",
  hi: "Hindi",
  ur: "Urdu",
  vi: "Vietnamese",
  fa: "Persian/Farsi",
  pa: "Punjabi (Gurmukhi script)",
  ht: "Haitian Creole",
};

const LANGS = Object.keys(LANG_NAMES);

function extractNewGradKeys(content: string): Record<string, string> {
  const re = /"(newGrad\.[^"]+)":\s*"([^"]+)"/g;
  const keys: Record<string, string> = {};
  let m;
  while ((m = re.exec(content)) !== null) {
    keys[m[1]] = m[2];
  }
  return keys;
}

function chunkEntries(entries: [string, string][], maxChars: number): [string, string][][] {
  const chunks: [string, string][][] = [];
  let current: [string, string][] = [];
  let currentSize = 0;
  for (const entry of entries) {
    const entrySize = entry[0].length + entry[1].length + 10;
    if (currentSize + entrySize > maxChars && current.length > 0) {
      chunks.push(current);
      current = [];
      currentSize = 0;
    }
    current.push(entry);
    currentSize += entrySize;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

async function translateBatch(
  entries: [string, string][],
  lang: string,
  langName: string
): Promise<Record<string, string>> {
  const keysJson = JSON.stringify(Object.fromEntries(entries), null, 2);

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are a professional medical/nursing translator. Translate the following JSON key-value pairs from English to ${langName}. 
Rules:
- Return ONLY valid JSON with the same keys and translated values
- Keep proper nouns, medical terms, and acronyms (NCLEX, BLS, ACLS, ICU, etc.) in their original form
- Use natural, professional ${langName} for nursing/healthcare context
- Do not translate brand names
- For ${lang === "zh" ? "Chinese" : lang === "ar" || lang === "fa" || lang === "ur" || lang === "pa" ? langName : langName}, use the appropriate script
- Keep any HTML entities or special characters as-is
- Maintain the same tone (professional but approachable)`,
      },
      {
        role: "user",
        content: `Translate these to ${langName}:\n${keysJson}`,
      },
    ],
  });

  const text = resp.choices[0]?.message?.content || "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error(`Failed to parse JSON for ${lang}, batch of ${entries.length} keys`);
    return {};
  }
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error(`JSON parse error for ${lang}:`, e);
    return {};
  }
}

async function processLanguage(lang: string): Promise<number> {
  const langName = LANG_NAMES[lang];
  const enContent = fs.readFileSync(path.join(rootDir, "tools/i18n/source/i18n-en.ts"), "utf8");
  const enKeys = extractNewGradKeys(enContent);

  const langFile = path.join(rootDir, `tools/i18n/source/i18n-${lang}.ts`);
  const langContent = fs.readFileSync(langFile, "utf8");
  const langKeys = extractNewGradKeys(langContent);

  const untranslated: [string, string][] = [];
  for (const [key, enVal] of Object.entries(enKeys)) {
    if (langKeys[key] === enVal) {
      untranslated.push([key, enVal]);
    }
  }

  if (untranslated.length === 0) {
    console.log(`${lang}: all keys already translated`);
    return 0;
  }

  console.log(`${lang}: translating ${untranslated.length} keys...`);

  const chunks = chunkEntries(untranslated, 6000);
  let totalCount = 0;

  for (let i = 0; i < chunks.length; i++) {
    console.log(`  ${lang} chunk ${i + 1}/${chunks.length} (${chunks[i].length} keys)`);
    const batch = await translateBatch(chunks[i], lang, langName);
    
    let currentContent = fs.readFileSync(langFile, "utf8");
    let chunkCount = 0;
    for (const [key, translatedVal] of Object.entries(batch)) {
      if (!translatedVal || translatedVal === enKeys[key]) continue;
      const escaped = translatedVal.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const enEscaped = enKeys[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*"${enEscaped}"`);
      if (pattern.test(currentContent)) {
        currentContent = currentContent.replace(pattern, `"${key}": "${escaped}"`);
        chunkCount++;
      }
    }
    if (chunkCount > 0) {
      fs.writeFileSync(langFile, currentContent);
      totalCount += chunkCount;
    }
  }

  console.log(`  ${lang}: wrote ${totalCount} translations total`);
  return totalCount;
}

async function main() {
  const targetLangs = process.argv.slice(2);
  const langsToProcess = targetLangs.length > 0 ? targetLangs : LANGS;
  
  const results = await Promise.allSettled(
    langsToProcess.map(lang => processLanguage(lang))
  );
  
  let total = 0;
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") total += r.value;
    else console.error(`${langsToProcess[i]} failed:`, r.reason);
  }
  console.log(`\nDone: ${total} total translations written across ${langsToProcess.length} languages`);
}

main().catch(console.error);
