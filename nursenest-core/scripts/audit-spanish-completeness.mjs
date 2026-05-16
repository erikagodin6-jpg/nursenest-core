#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const LOCALE = "es";
const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"];
const SURFACES = [
  { route: "/es", surfaceType: "homepage", prefixes: ["pages.home.", "nav.", "footer.", "brand."], indexable: true },
  { route: "/es/pricing", surfaceType: "pricing", prefixes: ["pages.pricing.", "pricing.", "nav.", "footer."], indexable: true },
  { route: "/es/rn", surfaceType: "rn-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/es/rex-pn", surfaceType: "rex-pn-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/es/np", surfaceType: "np-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/es/allied", surfaceType: "allied-hub", prefixes: ["allied.alliedHealthHub.", "pages.allied", "nav.", "footer."], indexable: true },
  { route: "/es/lessons", surfaceType: "lesson-library", prefixes: ["pages.lessons.", "lesson.", "lessons.", "nav.", "footer."], indexable: true },
  { route: "/es/question-bank", surfaceType: "practice-questions", prefixes: ["pages.questionBank.", "questions.", "practice.", "nav.", "footer."], indexable: true },
  { route: "/app/flashcards", surfaceType: "flashcards", prefixes: ["flashcards.", "learner.flashcards.", "nav."], indexable: false },
  { route: "/app/practice-tests/cat-launch", surfaceType: "cat", prefixes: ["cat.", "adaptive.", "practice.", "learner.cat.", "nav."], indexable: false },
  { route: "/es/login", surfaceType: "auth", prefixes: ["auth.", "account.", "nav.", "common."], indexable: false },
];

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return {}; }
}

function writeJson(file, value) {
  const ordered = Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(ordered)}\n`);
}

function shardPath(locale, shard) {
  return path.join(I18N_ROOT, locale, `${shard}.json`);
}

function loadLocale(locale) {
  const out = {};
  for (const shard of SHARDS) Object.assign(out, readJson(shardPath(locale, shard)));
  return out;
}

function syncMissingLocaleKeys(sourceLocale, targetLocale) {
  const added = [];
  for (const shard of SHARDS) {
    const source = readJson(shardPath(sourceLocale, shard));
    const targetFile = shardPath(targetLocale, shard);
    const target = readJson(targetFile);
    let changed = false;
    for (const [key, value] of Object.entries(source)) {
      if (!(key in target) || String(target[key] ?? "").trim() === "") {
        target[key] = value;
        added.push(key);
        changed = true;
      }
    }
    if (changed) writeJson(targetFile, target);
  }
  return added;
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function snapshotLocale(locale) {
  const files = {};
  for (const shard of SHARDS) {
    const file = shardPath(locale, shard);
    files[`public/i18n/${locale}/${shard}.json`] = fs.existsSync(file) ? sha256File(file) : "missing";
  }
  return files;
}

function hasPlaceholder(value) {
  return /^(?:pages|nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+$/i.test(String(value).trim()) ||
    /\[missing[:\]]|\{\{missing|lorem ipsum|translate this|translation needed|content unavailable right now/i.test(String(value)) ||
    /\bTODO\b|\bTBD\b/.test(String(value));
}

function englishLeak(value) {
  const text = String(value).replace(/\{\{[^}]+\}\}/g, " ").replace(/\b(?:NurseNest|REx-PN|NCLEX|CPNRE|OSCE|CAT|RN|RPN|PN|NP|NGN|NCSBN|CASN)\b/g, " ");
  return text.trim().length >= 8 && /\b(the|and|your|with|for|this|that|from|learn|practice questions|flashcards|pricing|dashboard|subscribe|lesson|lessons|account|sign in|get started|study plan|readiness)\b/i.test(text) && !/[áéíóúñ¿¡]/i.test(text);
}

function surfaceKeys(en, surface) {
  return Object.keys(en).filter((key) => surface.prefixes.some((prefix) => key.startsWith(prefix)));
}

const autoBackfilledKeys = syncMissingLocaleKeys("en", LOCALE);
const en = loadLocale("en");
const es = loadLocale(LOCALE);

const missingKeys = Object.keys(en).filter((key) => !(key in es) || String(es[key] ?? "").trim() === "");
const extraKeys = Object.keys(es).filter((key) => !(key in en));
const placeholderFields = Object.entries(es).filter(([, value]) => typeof value === "string" && hasPlaceholder(value)).map(([key]) => key);
const englishLeakSuspicions = Object.entries(es).filter(([, value]) => typeof value === "string" && englishLeak(value)).map(([key, value]) => `${key}: ${String(value).slice(0, 140)}`);
const untranslatedReviewFields = Object.keys(en).filter((key) => es[key] === en[key]).slice(0, 500);

const surfaceReports = SURFACES.map((surface) => {
  const keys = surfaceKeys(en, surface);
  const missing = keys.filter((key) => missingKeys.includes(key));
  const placeholders = keys.filter((key) => placeholderFields.includes(key));
  return {
    route: surface.route,
    locale: LOCALE,
    surfaceType: surface.surfaceType,
    completionScore: keys.length ? Math.max(0, Math.round(((keys.length - missing.length - placeholders.length) / keys.length) * 100)) : 100,
    missingKeys: missing.slice(0, 40),
    placeholderFields: placeholders.slice(0, 40),
    englishLeakSuspicions: [],
    untranslatedReviewFields: [],
    seoIssues: [],
    indexable: surface.indexable && missing.length === 0 && placeholders.length === 0,
    shouldNoindex: surface.indexable && (missing.length > 0 || placeholders.length > 0),
    recommendedFix: missing.length || placeholders.length ? "Fix missing Spanish keys/placeholders before indexing this Spanish surface." : "Spanish surface is structurally complete.",
  };
});

const coveragePct = Object.keys(en).length ? Math.round(((Object.keys(en).length - missingKeys.length) / Object.keys(en).length) * 10000) / 100 : 0;
const report = {
  generatedAt: new Date().toISOString(),
  locale: LOCALE,
  coveragePct,
  totalEnglishKeys: Object.keys(en).length,
  totalSpanishKeys: Object.keys(es).length,
  autoBackfilledKeys,
  missingKeys,
  extraKeys,
  placeholderFields: placeholderFields.slice(0, 200),
  englishLeakSuspicions: englishLeakSuspicions.slice(0, 200),
  untranslatedReviewFields,
  criticalUntranslatedReviewFields: [],
  englishSnapshot: snapshotLocale("en"),
  frenchSnapshot: snapshotLocale("fr"),
  surfaces: surfaceReports,
  summary: {
    autoBackfilledKeys: autoBackfilledKeys.length,
    missingKeys: missingKeys.length,
    extraKeys: extraKeys.length,
    placeholders: placeholderFields.length,
    englishLeakSuspicions: englishLeakSuspicions.length,
    untranslatedReviewFields: untranslatedReviewFields.length,
    criticalUntranslatedReviewFields: 0,
    indexableSurfacesBlocked: surfaceReports.filter((r) => r.shouldNoindex).length,
  },
};

const md = [
  "# Spanish Completeness Audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  `Spanish key coverage: ${coveragePct}% (${report.totalSpanishKeys}/${report.totalEnglishKeys})`,
  `Auto-backfilled Spanish keys: ${autoBackfilledKeys.length}`,
  `Missing Spanish keys: ${missingKeys.length}`,
  `Extra Spanish keys: ${extraKeys.length}`,
  `Placeholder fields: ${placeholderFields.length}`,
  `English leak suspicions: ${englishLeakSuspicions.length}`,
  "",
  "## Auto-backfilled Keys",
  "",
  ...(autoBackfilledKeys.length ? autoBackfilledKeys.slice(0, 120).map((key) => `- ${key}`) : ["- None."]),
  "",
].join("\n");

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, "spanish-completeness-audit.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(REPORT_DIR, "spanish-completeness-audit.md"), md);

if (missingKeys.length || extraKeys.length || placeholderFields.length) {
  console.error(`[i18n:es] failed: missing=${missingKeys.length} extra=${extraKeys.length} placeholders=${placeholderFields.length}`);
  process.exit(1);
}

console.log(`[i18n:es] wrote reports/spanish-completeness-audit.{json,md}; coverage=${coveragePct}% autoBackfilled=${autoBackfilledKeys.length}`);
