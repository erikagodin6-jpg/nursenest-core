const fs = require("node:fs");
const path = require("node:path");

const LANGUAGES = {
  fr: "French",
  tl: "Tagalog/Filipino",
  hi: "Hindi",
  es: "Spanish",
  zh: "Simplified Chinese",
  ar: "Arabic",
  ko: "Korean",
  pt: "Portuguese (Brazilian)",
  pa: "Punjabi (Gurmukhi)",
  vi: "Vietnamese",
  ht: "Haitian Creole",
  ur: "Urdu",
  ja: "Japanese",
  fa: "Farsi/Persian",
};

const INPUT_PATH = process.env.MISSING_KEYS_PATH || "/tmp/missing-keys.json";
const PROGRESS_PATH = process.env.TRANSLATIONS_PROGRESS_PATH || "/tmp/translations-progress.json";
const OUTPUT_PATH = process.env.TRANSLATIONS_OUTPUT_PATH || "/tmp/translations-complete.json";

const MODEL = process.env.TRANSLATION_MODEL || "gpt-4o-mini";
const BATCH_SIZE = Number(process.env.TRANSLATION_BATCH_SIZE || 60);
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

function extractJsonObject(text) {
  const trimmed = String(text || "").trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return JSON.parse(fenced[1]);
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in model response");
  }

  return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
}

function getPlaceholders(value) {
  return new Set(String(value).match(/\{[^{}]+\}/g) || []);
}

function validateTranslationBatch(sourceBatch, translatedBatch, lang) {
  const cleaned = {};

  for (const [key, englishValue] of Object.entries(sourceBatch)) {
    const translatedValue = translatedBatch?.[key];

    if (typeof translatedValue !== "string" || translatedValue.trim() === "") {
      throw new Error(`${lang}: missing/empty translation for key ${key}`);
    }

    const sourcePlaceholders = getPlaceholders(englishValue);
    const translatedPlaceholders = getPlaceholders(translatedValue);

    for (const placeholder of sourcePlaceholders) {
      if (!translatedPlaceholders.has(placeholder)) {
        throw new Error(`${lang}: placeholder ${placeholder} missing for key ${key}`);
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

async function translateBatch(openai, batch, lang, langName) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          `Translate UI strings from English to ${langName} for a nursing education platform.`,
          "",
          "Rules:",
          "- Preserve medical accuracy.",
          "- Do NOT translate: NurseNest, NCLEX, REX-PN, RPN, RN, NP, LVN, ECG, ABG, PPE, SBAR, ADPIE, AANP, ANCC.",
          "- Keep placeholders like {count}, {name}, and {examCode} exactly as-is.",
          "- Preserve the exact same JSON keys.",
          "- Return only one valid JSON object mapping each key to its translated string.",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify(batch),
      },
    ],
    temperature: 0.1,
    max_tokens: 16000,
  });

  const text = response.choices?.[0]?.message?.content || "{}";
  const parsed = extractJsonObject(text);

  return validateTranslationBatch(batch, parsed, lang);
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

  const missingKeys = readJson(INPUT_PATH);
  const entries = Object.entries(missingKeys);
  const batches = chunkEntries(entries, BATCH_SIZE);
  const langCodes = Object.keys(LANGUAGES);

  console.log("Input:", INPUT_PATH);
  console.log("Total missing keys:", entries.length);
  console.log("Batch size:", BATCH_SIZE);
  console.log("Batches:", batches.length);
  console.log("Languages:", langCodes.join(", "));

  const allTranslations = fs.existsSync(PROGRESS_PATH)
    ? readJson(PROGRESS_PATH)
    : {};

  for (const lang of langCodes) {
    allTranslations[lang] ||= {};
  }

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = Object.fromEntries(batches[batchIndex]);
    const batchNumber = batchIndex + 1;

    console.log(`\nBatch ${batchNumber}/${batches.length}: ${batches[batchIndex].length} keys`);

    for (const lang of langCodes) {
      const langName = LANGUAGES[lang];

      const alreadyDone = Object.keys(batch).every((key) => typeof allTranslations[lang][key] === "string");
      if (alreadyDone) {
        console.log(`  ${lang}: already complete`);
        continue;
      }

      let translated = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          translated = await translateBatch(openai, batch, lang, langName);
          break;
        } catch (error) {
          console.error(`  ${lang} attempt ${attempt}/${MAX_ATTEMPTS} failed: ${error.message}`);

          if (attempt < MAX_ATTEMPTS) {
            await sleep(1500 * attempt);
          }
        }
      }

      if (!translated) {
        throw new Error(`${lang}: failed batch ${batchNumber}; refusing to silently fall back to English`);
      }

      Object.assign(allTranslations[lang], translated);
      console.log(`  ${lang}: ${Object.keys(translated).length} keys`);

      writeJson(PROGRESS_PATH, allTranslations);
    }

    console.log("  [Saved progress]");
  }

  writeJson(OUTPUT_PATH, allTranslations, true);

  console.log("\nDone!");
  console.log("Output:", OUTPUT_PATH);

  for (const lang of langCodes) {
    console.log(`  ${lang}: ${Object.keys(allTranslations[lang]).length} keys`);
  }
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});