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

function extractJsonObject(text) {
  const raw = String(text || "").trim();

  try {
    return JSON.parse(raw);
  } catch {
    // Continue.
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
    const value = translatedBatch?.[key];

    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${lang}: missing translation for ${key}`);
    }

    for (const placeholder of getPlaceholders(englishValue)) {
      if (!getPlaceholders(value).has(placeholder)) {
        throw new Error(`${lang}: missing placeholder ${placeholder} for ${key}`);
      }
    }

    cleaned[key] = value;
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

function isBatchComplete(results, lang, batch) {
  return Object.keys(batch).every((key) => typeof results[lang]?.[key] === "string");
}

async function translateBatch(openai, batch, lang, langName) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          `You are translating UI strings from English to ${langName} for NurseNest, a nursing exam prep platform.`,
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

  console.log("Input:", INPUT_PATH);
  console.log("Progress:", PROGRESS_PATH);
  console.log("Output:", OUTPUT_PATH);
  console.log("Total keys:", entries.length);
  console.log("Batch size:", BATCH_SIZE);
  console.log("Batches:", batches.length);
  console.log(`Loaded progress: fr=${Object.keys(results.fr).length} es=${Object.keys(results.es).length}`);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = Object.fromEntries(batches[batchIndex]);
    const batchNumber = batchIndex + 1;

    console.log(`\nBatch ${batchNumber}/${batches.length}: ${Object.keys(batch).length} keys`);

    for (const [lang, langName] of Object.entries(LANGUAGES)) {
      if (isBatchComplete(results, lang, batch)) {
        console.log(`  ${lang}: skip`);
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
            await sleep(2500 * attempt);
          }
        }
      }

      if (!translated) {
        throw new Error(`${lang}: failed batch ${batchNumber}; stopping instead of writing incomplete output`);
      }

      Object.assign(results[lang], translated);
      writeJson(PROGRESS_PATH, results);

      console.log(`  ${lang}: ${Object.keys(translated).length} keys`);
    }

    console.log("  [saved]");
  }

  writeJson(OUTPUT_PATH, results, true);

  console.log("\nDone!");
  console.log("  fr:", Object.keys(results.fr).length, "keys");
  console.log("  es:", Object.keys(results.es).length, "keys");
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});