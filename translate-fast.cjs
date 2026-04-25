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

const INPUT_PATH = process.env.TRANSLATION_INPUT_PATH || "/tmp/missing-keys.json";
const PROGRESS_PATH = process.env.TRANSLATION_PROGRESS_PATH || "/tmp/translations-progress2.json";
const OUTPUT_PATH = process.env.TRANSLATION_OUTPUT_PATH || "/tmp/translations-complete2.json";

const MODEL = process.env.TRANSLATION_MODEL || "gpt-4o-mini";
const BATCH_SIZE = Number(process.env.TRANSLATION_BATCH_SIZE || 80);
const MAX_ATTEMPTS = Number(process.env.TRANSLATION_MAX_ATTEMPTS || 3);
const PARALLEL_LANGUAGES = Number(process.env.TRANSLATION_PARALLEL_LANGUAGES || 2);

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
  const raw = String(text || "").trim();

  try {
    return JSON.parse(raw);
  } catch {
    // Continue with fallback parsing.
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

function getPlaceholders(value) {
  return new Set(String(value).match(/\{[^{}]+\}/g) || []);
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

function chunkArray(items, size) {
  const chunks = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

function missingForLanguage(batch, results, lang) {
  return Object.fromEntries(
    Object.entries(batch).filter(([key]) => typeof results[lang]?.[key] !== "string"),
  );
}

async function translateBatch(openai, batch, lang, langName) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          `Translate UI strings from English to ${langName} for NurseNest, a nursing education platform.`,
          "",
          "Rules:",
          "- Preserve medical and clinical accuracy.",
          "- Do NOT translate: NurseNest, NCLEX, REX-PN, RPN, RN, NP, LVN, ECG, ABG, PPE, SBAR, ADPIE, AANP, ANCC.",
          "- Keep placeholders like {count}, {name}, {total}, and {examCode} exactly as-is.",
          "- Preserve the exact same JSON keys.",
          "- Return only one valid raw JSON object.",
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

  const rawText = response.choices?.[0]?.message?.content || "{}";
  const parsed = extractJsonObject(rawText);

  return validateTranslations(batch, parsed, lang);
}

async function translateWithRetries(openai, batch, lang, langName, batchNumber) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await translateBatch(openai, batch, lang, langName);
    } catch (error) {
      console.error(`  ${lang} attempt ${attempt}/${MAX_ATTEMPTS}: ${error.message}`);

      if (attempt < MAX_ATTEMPTS) {
        await sleep(2500 * attempt);
      }
    }
  }

  throw new Error(`${lang}: failed batch ${batchNumber}`);
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
  const batches = chunkArray(entries, BATCH_SIZE);
  const langCodes = Object.keys(LANGUAGES);

  const allTranslations = fs.existsSync(PROGRESS_PATH)
    ? readJson(PROGRESS_PATH)
    : {};

  for (const lang of langCodes) {
    allTranslations[lang] ||= {};
  }

  console.log("Input:", INPUT_PATH);
  console.log("Progress:", PROGRESS_PATH);
  console.log("Output:", OUTPUT_PATH);
  console.log("Total keys:", entries.length);
  console.log("Batch size:", BATCH_SIZE);
  console.log("Batches:", batches.length);
  console.log("Parallel languages:", PARALLEL_LANGUAGES);

  for (const lang of langCodes) {
    console.log(`Loaded ${lang}: ${Object.keys(allTranslations[lang]).length} keys`);
  }

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = Object.fromEntries(batches[batchIndex]);
    const batchNumber = batchIndex + 1;

    const neededLangs = langCodes.filter(
      (lang) => Object.keys(missingForLanguage(batch, allTranslations, lang)).length > 0,
    );

    if (neededLangs.length === 0) {
      console.log(`Batch ${batchNumber}/${batches.length}: already complete`);
      continue;
    }

    console.log(`\nBatch ${batchNumber}/${batches.length}: ${Object.keys(batch).length} keys`);

    for (const langSlice of chunkArray(neededLangs, PARALLEL_LANGUAGES)) {
      const translatedPairs = await Promise.all(
        langSlice.map(async (lang) => {
          const missing = missingForLanguage(batch, allTranslations, lang);
          const langName = LANGUAGES[lang];

          const translated = await translateWithRetries(openai, missing, lang, langName, batchNumber);
          return [lang, translated];
        }),
      );

      for (const [lang, translated] of translatedPairs) {
        Object.assign(allTranslations[lang], translated);
        console.log(`  ${lang}: +${Object.keys(translated).length}`);
      }

      writeJson(PROGRESS_PATH, allTranslations);
    }

    console.log("  [Progress saved]");
  }

  writeJson(OUTPUT_PATH, allTranslations, true);

  console.log("\nDone!");
  for (const lang of langCodes) {
    console.log(`  ${lang}: ${Object.keys(allTranslations[lang]).length} keys`);
  }
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});