#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const CACHE_DIR = path.join(APP_ROOT, ".cache");
const CACHE_PATH = path.join(CACHE_DIR, "translate-es-critical-identical-cache.json");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const APPLY = process.argv.includes("--apply");
const REFRESH_CACHE = process.argv.includes("--refresh-cache");
const LIMIT = process.env.TRANSLATE_LIMIT ? Number.parseInt(process.env.TRANSLATE_LIMIT, 10) : Number.POSITIVE_INFINITY;
const CONCURRENCY = Math.max(1, Number.parseInt(process.env.TRANSLATE_CONCURRENCY ?? process.env.LINGVA_CONCURRENCY ?? "8", 10));
const DELAY_MS = Math.max(0, Number.parseInt(process.env.TRANSLATE_DELAY_MS ?? process.env.LINGVA_DELAY_MS ?? "0", 10));
const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"];
const CRITICAL_PREFIXES = [
  "nav.",
  "footer.",
  "pages.home.",
  "pages.pricing.",
  "pages.lessons.",
  "pages.questionBank.",
  "pricing.",
  "dashboard.",
  "learner.",
  "auth.",
  "components.examPathwayHub.",
  "allied.alliedHealthHub.",
];
const TARGET_PREFIXES = (process.env.TRANSLATE_PREFIXES ?? "")
  .split(",")
  .map((prefix) => prefix.trim())
  .filter(Boolean);
const TRANSLATE_ALL = process.env.TRANSLATE_ALL === "1";
const PROTECTED = ["NurseNest", "REx-PN", "NCLEX-RN", "NCLEX-PN", "NCLEX", "CPNRE", "OSCE", "CAT", "RN", "RPN", "PN", "NP", "NGN", "NCSBN", "CASN", "UWorld", "Archer", "Klarna", "Afterpay", "Affirm"];
const GLOSSARY = new Map([
  ["Nursing Exam Prep", "Preparación para exámenes de enfermería"],
  ["Practice Questions", "Preguntas de práctica"],
  ["Flashcards", "Tarjetas de memoria"],
  ["New Grad", "Recién graduado/a"],
  ["Patient Care", "Atención al paciente"],
  ["Lessons", "Lecciones"],
  ["Study Plan", "Plan de estudio"],
  ["Readiness", "Preparación"],
  ["Clinical Judgment", "Juicio clínico"],
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  const normalized = file.replace(/\\/g, "/");
  if (/\/public\/i18n\/(?:en|fr)\//.test(normalized)) {
    throw new Error(`Refusing to write protected locale file: ${file}`);
  }
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function loadLocale(locale) {
  const byShard = {};
  const merged = {};
  for (const shard of SHARDS) {
    const data = readJson(path.join(I18N_ROOT, locale, `${shard}.json`));
    byShard[shard] = data;
    Object.assign(merged, data);
  }
  return { byShard, merged };
}

function isProtectedOnly(value) {
  const text = String(value).trim();
  if (PROTECTED.includes(text)) return true;
  const words = text.match(/[A-Za-z][A-Za-z-]*/g) ?? [];
  return words.length > 0 && words.every((word) => PROTECTED.includes(word));
}

function mask(text) {
  const tokens = [];
  let out = text.replace(/\{\{[^}]+\}\}/g, (match) => {
    const token = `<<<M${tokens.length}>>>`;
    tokens.push([token, match]);
    return token;
  });
  for (const term of PROTECTED) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "g"), (match) => {
      const token = `<<<T${tokens.length}>>>`;
      tokens.push([token, match]);
      return token;
    });
  }
  return { masked: out, tokens };
}

function unmask(text, tokens) {
  let out = text;
  for (const [token, value] of tokens) out = out.split(token).join(value);
  return out;
}

function applyGlossary(text) {
  let out = text;
  for (const [en, es] of GLOSSARY) {
    out = out.replace(new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), es);
  }
  return out;
}

async function translateWithGoogle(text, tokens) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
  const data = await res.json();
  const translated = Array.isArray(data?.[0]) ? data[0].map((piece) => piece?.[0] ?? "").join("") : "";
  if (!translated.trim()) throw new Error("Google missing translation field");
  return unmask(translated.replaceAll("⟨SL⟩", "/"), tokens);
}

async function translateWithLingva(text, tokens) {
  const url = `https://lingva.ml/api/v1/en/es/${encodeURIComponent(text.replaceAll("/", "⟨SL⟩"))}`;
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`Lingva HTTP ${res.status}`);
  const data = await res.json();
  if (typeof data.translation !== "string") throw new Error("Lingva missing translation field");
  return unmask(data.translation.replaceAll("⟨SL⟩", "/"), tokens);
}

async function translate(text) {
  if (!text.trim() || isProtectedOnly(text)) return text;
  if (GLOSSARY.has(text.trim())) return GLOSSARY.get(text.trim());
  const { masked, tokens } = mask(text);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return applyGlossary(await translateWithGoogle(masked.replaceAll("/", "⟨SL⟩"), tokens));
    } catch (error) {
      lastError = error;
      await sleep(Math.min(8_000, 500 * 2 ** attempt));
    }
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return applyGlossary(await translateWithLingva(masked, tokens));
    } catch (error) {
      lastError = error;
      await sleep(Math.min(8_000, 750 * 2 ** attempt));
    }
  }
  throw lastError;
}

async function pool(items, worker) {
  let index = 0;
  async function run() {
    while (index < items.length) {
      const item = items[index++];
      await worker(item);
      if (DELAY_MS) await sleep(DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, run));
}

fs.mkdirSync(CACHE_DIR, { recursive: true });
fs.mkdirSync(REPORT_DIR, { recursive: true });
const cache = fs.existsSync(CACHE_PATH) ? readJson(CACHE_PATH) : {};
const en = loadLocale("en");
const es = loadLocale("es");

const targetKeys = Object.keys(en.merged)
  .filter((key) => TRANSLATE_ALL || (TARGET_PREFIXES.length ? TARGET_PREFIXES : CRITICAL_PREFIXES).some((prefix) => key.startsWith(prefix)))
  .filter((key) => es.merged[key] === en.merged[key])
  .filter((key) => !isProtectedOnly(en.merged[key]))
  .slice(0, Number.isFinite(LIMIT) ? LIMIT : undefined);

const uniqueValues = [...new Set(targetKeys.map((key) => en.merged[key]))].filter((value) => REFRESH_CACHE || cache[value] == null);
console.log(`[i18n:translate:es-critical] targetKeys=${targetKeys.length} uncachedValues=${uniqueValues.length} apply=${APPLY}`);

await pool(uniqueValues, async (value) => {
  try {
    cache[value] = await translate(value);
  } catch (error) {
    cache[value] = value;
    console.error(`[i18n:translate:es-critical] failed ${String(value).slice(0, 80)}: ${error instanceof Error ? error.message : String(error)}`);
  }
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
});

const changes = [];
for (const key of targetKeys) {
  const value = en.merged[key];
  const translated = cache[value];
  if (!translated || translated === value) continue;
  const shard = SHARDS.find((name) => Object.prototype.hasOwnProperty.call(es.byShard[name], key));
  if (!shard) continue;
  changes.push({ key, shard, before: es.byShard[shard][key], after: translated });
  if (APPLY) es.byShard[shard][key] = translated;
}

if (APPLY) {
  for (const shard of SHARDS) writeJson(path.join(I18N_ROOT, "es", `${shard}.json`), es.byShard[shard]);
}

fs.writeFileSync(
  path.join(REPORT_DIR, "translate-es-critical-identical-report.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), applied: APPLY, targetKeys: targetKeys.length, changedKeys: changes.length, changes: changes.slice(0, 500) }, null, 2),
);
console.log(`[i18n:translate:es-critical] ${APPLY ? "applied" : "dry-run"} changedKeys=${changes.length}`);
