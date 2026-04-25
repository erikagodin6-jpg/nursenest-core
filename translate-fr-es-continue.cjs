const fs = require("node:fs");
const path = require("node:path");

const LANGUAGES = {
  fr: "French",
  es: "Spanish",
};

const INPUT_PATH = process.env.TRANSLATION_INPUT_PATH || "/tmp/needs-fr-es-translation.json";
const PROGRESS_PATH = process.env.TRANSLATION_PROGRESS_PATH || "/tmp/fr-es-progress.json";
const OUTPUT_PATH = process.env.TRANSLATION_OUTPUT_PATH || "/tmp/fr-es-complete.json";

const MODEL = process.env.TRANSLATION_MODEL || "gpt-4o-mini";
const BATCH_SIZE = Number(process.env.TRANSLATION_BATCH_SIZE || 80);
const MAX_ATTEMPTS = Number(process.env.TRANSLATION_MAX_ATTEMPTS || 3);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value, pretty = false) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, pretty ? 2 : 0));
}

function getPlaceholders(value) {
  return new Set(String(value).match(/\{[^{}]+\}/g) || []);
}

function extractJsonObject(text) {
  const raw = String(text || "").trim();

  try {
    return JSON.parse(raw);
  } catch {
    // Try fallback parsing below.
  }

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return JSON.parse(fenced[1]);
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in response");
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function validateTranslations(sourceBatch, translatedBatch, lang) {
  const cleaned = {};

  for (const [key, englishValue] of Object.entries(sourceBatch)) {
    const translatedValue = translatedBatch?.[key];

    if (typeof translatedValue !== "string" || translatedValue.trim() === "") {
      throw new Error(`${lang}: missing translation for ${key}`);
    }

    const expectedPlaceholders = getPlaceholders(englishValue);
    const actualPlaceholders = getPlaceholders(translatedValue);

    for (const placeholder of expectedPlaceholders) {
      if (!actualPlaceholders.has(placeholder)) {
        throw new Error(`${lang}: missing placeholder ${placeholder} for ${key}`);
      }
    }

    cleaned[key] = translatedValue;
  }

  return cleaned;
}

function chunkEntries(entries, size) {
  const chunks = [];

  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }

  return chunks;
}

async function translateMissingKeys(openai, missing, lang, langName) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          `Translate UI strings from English to ${langName} for NurseNest, a nursing exam prep platform.`,
          "",
          "Rules:",
          "- Preserve medical and clinical accuracy.",
          "- Do NOT translate: NurseNest, NCLEX, REX-PN, RPN, RN, NP, LVN, ECG, ABG, PPE, SBAR, ADPIE, AANP, ANCC.",
          "- Keep placeholders like {count}, {name}, {total}, and {examCode} exactly as-is.",
          "- Preserve the exact same JSON keys.",
          "- Return only one valid JSON object.",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify(missing),
      },
    ],
    temperature: 0.1,
    max_tokens: 16000,
  });

  const rawText = response.choices?.[0]?.message?.content || "{}";
  const parsed = extractJsonObject(rawText);

  return validateTranslations(missing, parsed, lang);
}

async function main() {
  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    throw new Error("Missing AI_INTEGRATIONS_OPENAI_API_KEY");
  }

  const OpenAI = (await import("openai")).default;

  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });

  const allKeys = readJson(INPUT_PATH);
  const entries = Object.entries(allKeys);
  const batches = chunkEntries(entries, BATCH_SIZE);

  const results = fs.existsSync(PROGRESS_PATH)
    ? readJson(PROGRESS_PATH)
    : { fr: {}, es: {} };

  for (const lang of Object.keys(LANGUAGES)) {
    results[lang] ||= {};
  }

  console.log("Loaded: fr=" + Object.keys(results.fr).length + " es=" + Object.keys(results.es).length);
  console.log("Total source keys:", entries.length);
  console.log("Batches:", batches.length);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = Object.fromEntries(batches[batchIndex]);
    const batchKeys = Object.keys(batch);
    const batchNumber = batchIndex + 1;

    const missingByLanguage = {};

    for (const lang of Object.keys(LANGUAGES)) {
      missingByLanguage[lang] = Object.fromEntries(
        batchKeys
          .filter((key) => typeof results[lang][key] !== "string")
          .map((key) => [key, batch[key]]),
      );
    }

    if (Object.values(missingByLanguage).every((missing) => Object.keys(missing).length === 0)) {
      continue;
    }

    console.log(`Batch ${batchNumber}/${batches.length}: ${batchKeys.length} keys`);

    for (const [lang, langName] of Object.entries(LANGUAGES)) {
      const missing = missingByLanguage[lang];

      if (Object.keys(missing).length === 0) {
        console.log(`  ${lang}: skip`);
        continue;
      }

      let translated = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          translated = await translateMissingKeys(openai, missing, lang, langName);
          break;
        } catch (error) {
          console.error(`  ${lang} attempt ${attempt}/${MAX_ATTEMPTS}: ${error.message}`);

          if (attempt < MAX_ATTEMPTS) {
            await sleep(2500 * attempt);
          }
        }
      }

      if (!translated) {
        throw new Error(`${lang}: failed batch ${batchNumber}; stopping instead of writing incomplete output`);
      }

      Object.assign(results[lang], translated);
      writeJson(PROGRESS_PATH, results);

      console.log(`  ${lang}: +${Object.keys(translated).length}`);
    }
  }

  writeJson(OUTPUT_PATH, results, true);

  console.log("Done! fr:", Object.keys(results.fr).length, "es:", Object.keys(results.es).length);
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});