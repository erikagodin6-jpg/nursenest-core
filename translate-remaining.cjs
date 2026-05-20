const fs = require("node:fs");
const path = require("node:path");

const LANGUAGES = {
  fr: "French",
  es: "Spanish",
};

const INPUT_PATH = process.env.MISSING_KEYS_PATH || "/tmp/missing-263.json";
const EXISTING_PATH = process.env.EXISTING_TRANSLATIONS_PATH || "/tmp/fr-es-complete.json";
const OUTPUT_PATH = process.env.TRANSLATIONS_OUTPUT_PATH || "/tmp/fr-es-all.json";
const PROGRESS_PATH = process.env.TRANSLATIONS_PROGRESS_PATH || "/tmp/fr-es-progress.json";

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

function extractJsonObject(text) {
  const raw = String(text || "").trim();

  try {
    return JSON.parse(raw);
  } catch {
    // Continue with fallback extraction.
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

function chunkObjectEntries(obj, size) {
  const entries = Object.entries(obj);
  const batches = [];

  for (let i = 0; i < entries.length; i += size) {
    batches.push(Object.fromEntries(entries.slice(i, i + size)));
  }

  return batches;
}

async function translateBatch(openai, batch, lang, langName) {
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
          "- Preserve clinical and nursing exam accuracy.",
          "- Do NOT translate: NurseNest, NCLEX, REX-PN, RPN, RN, NP, LVN, ECG, ABG, PPE, SBAR, ADPIE, AANP, ANCC.",
          "- Keep placeholders like {count}, {name}, and {examCode} exactly as-is.",
          "- Preserve every JSON key exactly.",
          "- Return only one valid JSON object.",
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

async function main() {
  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    throw new Error("Missing AI_INTEGRATIONS_OPENAI_API_KEY");
  }

  const OpenAI = (await import("openai")).default;

  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });

  const missing = readJson(INPUT_PATH);
  const existing = fs.existsSync(PROGRESS_PATH)
    ? readJson(PROGRESS_PATH)
    : readJson(EXISTING_PATH);

  for (const lang of Object.keys(LANGUAGES)) {
    existing[lang] ||= {};
  }

  const batches = chunkObjectEntries(missing, BATCH_SIZE);

  console.log("Input:", INPUT_PATH);
  console.log("Existing:", fs.existsSync(PROGRESS_PATH) ? PROGRESS_PATH : EXISTING_PATH);
  console.log("Output:", OUTPUT_PATH);
  console.log("Translating", Object.keys(missing).length, "keys for:", Object.keys(LANGUAGES).join(", "));
  console.log("Batch size:", BATCH_SIZE);
  console.log("Batches:", batches.length);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchNumber = batchIndex + 1;

    console.log(`\nBatch ${batchNumber}/${batches.length}: ${Object.keys(batch).length} keys`);

    for (const [lang, langName] of Object.entries(LANGUAGES)) {
      const complete = Object.keys(batch).every((key) => typeof existing[lang][key] === "string");

      if (complete) {
        console.log(`  ${lang}: already complete`);
        continue;
      }

      let translated = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          translated = await translateBatch(openai, batch, lang, langName);
          break;
        } catch (error) {
          console.error(`  ${lang} attempt ${attempt}/${MAX_ATTEMPTS}: ${error.message}`);

          if (attempt < MAX_ATTEMPTS) {
            await sleep(2000 * attempt);
          }
        }
      }

      if (!translated) {
        throw new Error(`${lang}: failed batch ${batchNumber}; stopping instead of writing incomplete translations`);
      }

      Object.assign(existing[lang], translated);
      writeJson(PROGRESS_PATH, existing);

      console.log(`  ${lang}: +${Object.keys(translated).length}`);
    }
  }

  writeJson(OUTPUT_PATH, existing, true);

  console.log("\nDone!");
  console.log("fr:", Object.keys(existing.fr || {}).length);
  console.log("es:", Object.keys(existing.es || {}).length);
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});