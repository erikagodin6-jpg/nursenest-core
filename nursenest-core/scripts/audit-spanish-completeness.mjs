#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const LOCALE = "es";
const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"];
const PROTECTED_IDENTICAL = new Set([
  "NurseNest",
  "REx-PN",
  "NCLEX",
  "CPNRE",
  "OSCE",
  "CAT",
  "RN",
  "RPN",
  "PN",
  "NP",
  "NGN",
  "NCSBN",
  "CASN",
  "LPN",
  "LVN",
  "NNQE",
  "UWorld",
  "Archer",
  "Klarna",
  "Afterpay",
  "Affirm",
]);

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
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function loadShard(locale, shard) {
  return readJson(path.join(I18N_ROOT, locale, `${shard}.json`));
}

function loadLocale(locale) {
  const out = {};
  for (const shard of SHARDS) Object.assign(out, loadShard(locale, shard));
  return out;
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function snapshotLocale(locale) {
  const files = {};
  for (const shard of SHARDS) {
    const file = path.join(I18N_ROOT, locale, `${shard}.json`);
    files[`public/i18n/${locale}/${shard}.json`] = fs.existsSync(file) ? sha256File(file) : "missing";
  }
  return files;
}

function hasPlaceholder(value) {
  return /^(?:pages|nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+$/i.test(value.trim()) ||
    /\[missing[:\]]|\{\{missing|lorem ipsum|translate this|translation needed|content unavailable right now/i.test(value) ||
    /\bTODO\b|\bTBD\b/.test(value);
}

function isProtectedIdentical(value) {
  const text = String(value).trim();
  if (!text) return false;
  if (PROTECTED_IDENTICAL.has(text)) return true;
  if (/^[\d\s%.,:;()/+&·–—-]+$/.test(text)) return true;
  if (/^(?:No|Error|General|Plan:?|Blog|Normal|Total|Popular|Color|Individual|Superior|Inferior|Lateral|Superficial|China)$/i.test(text)) return true;
  const withoutProtectedTerms = text
    .replace(/\{\{[^}]+\}\}/g, " ")
    .replace(/\b(?:NurseNest|REx-PN|NCLEX-RN|NCLEX-PN|NCLEX|CPNRE|OSCE|CAT|RN|RPN|PN|NP|NGN|NCSBN|CASN|LPN|LVN|NNQE)\b/g, " ")
    .trim();
  if (!withoutProtectedTerms || /^[\d\s%.,:;()/+&·–—-]+$/.test(withoutProtectedTerms) || /^China[\s()]*$/i.test(withoutProtectedTerms)) return true;
  const words = text.match(/[A-Za-z][A-Za-z-]*/g) ?? [];
  if (words.length === 1 && /^[A-Z]$/.test(words[0])) return true;
  if (words.length > 0 && words.every((word) => /^[A-Z0-9]{2,}$/.test(word))) return true;
  return words.length > 0 && words.every((word) => PROTECTED_IDENTICAL.has(word));
}

function englishLeak(value) {
  const text = String(value)
    .replace(/\{\{[^}]+\}\}/g, " ")
    .replace(/\b(?:NurseNest|REx-PN|NCLEX|CPNRE|OSCE|CAT|RN|RPN|PN|NP|NGN|NCSBN|CASN)\b/g, " ");
  if (text.trim().length < 8) return false;
  return /\b(the|and|your|with|for|this|that|from|learn|practice questions|flashcards|pricing|dashboard|subscribe|lesson|lessons|account|sign in|get started|study plan|readiness)\b/i.test(text) &&
    !/[áéíóúñ¿¡]/i.test(text);
}

function surfaceKeys(en, surface) {
  return Object.keys(en).filter((key) => surface.prefixes.some((prefix) => key.startsWith(prefix)));
}

const en = loadLocale("en");
const es = loadLocale("es");
const frSnapshot = snapshotLocale("fr");
const enSnapshot = snapshotLocale("en");

const missingKeys = Object.keys(en).filter((key) => !(key in es) || String(es[key] ?? "").trim() === "");
const extraKeys = Object.keys(es).filter((key) => !(key in en));
const placeholderFields = Object.entries(es).filter(([, value]) => typeof value === "string" && hasPlaceholder(value)).map(([key]) => key);
const identicalFields = Object.keys(en).filter((key) => es[key] === en[key] && !isProtectedIdentical(es[key]));
const englishLeakSuspicions = Object.entries(es)
  .filter(([, value]) => typeof value === "string" && englishLeak(value))
  .map(([key, value]) => `${key}: ${String(value).slice(0, 140)}`);

const surfaceReports = SURFACES.map((surface) => {
  const keys = surfaceKeys(en, surface);
  const missing = keys.filter((key) => missingKeys.includes(key));
  const placeholders = keys.filter((key) => placeholderFields.includes(key));
  const untranslated = keys.filter((key) => identicalFields.includes(key));
  const leaks = englishLeakSuspicions.filter((line) => keys.some((key) => line.startsWith(`${key}:`)));
  const seoIssues = keys.filter((key) => /meta|seo|title|description|headline|openGraph|twitter/i.test(key) && (missing.includes(key) || placeholders.includes(key)));
  const issueCount = missing.length + placeholders.length;
  const completionScore = keys.length > 0 ? Math.max(0, Math.round(((keys.length - issueCount) / keys.length) * 100)) : 100;
  return {
    route: surface.route,
    locale: LOCALE,
    surfaceType: surface.surfaceType,
    completionScore,
    missingKeys: missing.slice(0, 40),
    placeholderFields: placeholders.slice(0, 40),
    englishLeakSuspicions: leaks.slice(0, 40),
    untranslatedReviewFields: untranslated.slice(0, 40),
    seoIssues: seoIssues.slice(0, 40),
    indexable: surface.indexable && missing.length === 0 && placeholders.length === 0,
    shouldNoindex: surface.indexable && (missing.length > 0 || placeholders.length > 0),
    recommendedFix: missing.length || placeholders.length
      ? "Fix missing Spanish keys/placeholders before indexing this Spanish surface."
      : untranslated.length || leaks.length
        ? "Spanish keys are structurally complete; review English-identical strings for translation quality."
        : "Spanish surface is structurally complete.",
  };
});

const coveragePct = Object.keys(en).length > 0
  ? Math.round(((Object.keys(en).length - missingKeys.length) / Object.keys(en).length) * 10000) / 100
  : 0;

const report = {
  generatedAt: new Date().toISOString(),
  locale: LOCALE,
  coveragePct,
  totalEnglishKeys: Object.keys(en).length,
  totalSpanishKeys: Object.keys(es).length,
  missingKeys,
  extraKeys,
  placeholderFields: placeholderFields.slice(0, 200),
  englishLeakSuspicions: englishLeakSuspicions.slice(0, 200),
  untranslatedReviewFields: identicalFields.slice(0, 500),
  criticalUntranslatedReviewFields: identicalFields.filter((key) => CRITICAL_PREFIXES.some((prefix) => key.startsWith(prefix))).slice(0, 300),
  englishSnapshot: enSnapshot,
  frenchSnapshot: frSnapshot,
  surfaces: surfaceReports,
  summary: {
    missingKeys: missingKeys.length,
    extraKeys: extraKeys.length,
    placeholders: placeholderFields.length,
    englishLeakSuspicions: englishLeakSuspicions.length,
    untranslatedReviewFields: identicalFields.length,
    criticalUntranslatedReviewFields: identicalFields.filter((key) => CRITICAL_PREFIXES.some((prefix) => key.startsWith(prefix))).length,
    indexableSurfacesBlocked: surfaceReports.filter((r) => r.shouldNoindex).length,
  },
};

const md = [
  "# Spanish Completeness Audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  `Spanish key coverage: ${coveragePct}% (${report.totalSpanishKeys}/${report.totalEnglishKeys})`,
  `Missing Spanish keys: ${missingKeys.length}`,
  `Extra Spanish keys: ${extraKeys.length}`,
  `Placeholder fields: ${placeholderFields.length}`,
  `English leak suspicions: ${englishLeakSuspicions.length}`,
  `English-identical fields for human review: ${identicalFields.length}`,
  "",
  "| Route | Surface | Score | Indexable | Review count | Top issue |",
  "| --- | --- | ---: | --- | ---: | --- |",
  ...surfaceReports.map((r) => `| ${r.route} | ${r.surfaceType} | ${r.completionScore} | ${r.indexable ? "yes" : "no"} | ${(r.untranslatedReviewFields.length + r.englishLeakSuspicions.length)} | ${(r.missingKeys[0] ?? r.placeholderFields[0] ?? r.untranslatedReviewFields[0] ?? "none").replace(/\|/g, "\\|")} |`),
  "",
  "## Critical Review Fields",
  "",
  ...(report.criticalUntranslatedReviewFields.slice(0, 80).map((key) => `- ${key}`)),
  "",
].join("\n");

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, "spanish-completeness-audit.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(REPORT_DIR, "spanish-completeness-audit.md"), md);

if (missingKeys.length || extraKeys.length || placeholderFields.length) {
  console.error(`[i18n:es] failed: missing=${missingKeys.length} extra=${extraKeys.length} placeholders=${placeholderFields.length}`);
  process.exit(1);
}

console.log(`[i18n:es] wrote reports/spanish-completeness-audit.{json,md}; coverage=${coveragePct}% reviewFields=${identicalFields.length}`);
