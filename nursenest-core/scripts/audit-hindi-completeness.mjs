#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const LOCALE = "hi";
const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"];

const PROTECTED_IDENTICAL = new Set([
  "NurseNest",
  "REx-PN",
  "NCLEX",
  "NCLEX-RN",
  "NCLEX-PN",
  "CPNRE",
  "OSCE",
  "CAT",
  "ECG",
  "EKG",
  "IV",
  "BP",
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

const CONTROLLED_ENGLISH_TERMS = /\b(?:NurseNest|REx-PN|NCLEX(?:-[A-Z]+)?|CPNRE|OSCE|CAT|ECG|EKG|IV|BP|RN|RPN|PN|NP|NGN|NCSBN|CASN|LPN|LVN|NNQE|UWorld|Archer|Klarna|Afterpay|Affirm|adaptive|mock exams?|rationale|track|tracks|question bank|Allied Health|SpO2|PaCO2|PaO2|HCO|Pathophysiology|tachycardia|collimation)\b/gi;

const SURFACES = [
  { route: "/hi", surfaceType: "homepage", prefixes: ["pages.home.", "nav.", "footer.", "brand."], indexable: true },
  { route: "/hi/pricing", surfaceType: "pricing", prefixes: ["pages.pricing.", "pricing.", "nav.", "footer."], indexable: true },
  { route: "/hi/rn", surfaceType: "rn-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/hi/rex-pn", surfaceType: "rex-pn-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/hi/np", surfaceType: "np-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/hi/allied", surfaceType: "allied-hub", prefixes: ["allied.alliedHealthHub.", "pages.allied", "nav.", "footer."], indexable: true },
  { route: "/hi/lessons", surfaceType: "lesson-library", prefixes: ["pages.lessons.", "lesson.", "lessons.", "nav.", "footer."], indexable: true },
  { route: "/hi/question-bank", surfaceType: "practice-questions", prefixes: ["pages.publicQuestionBank.", "pages.questionBank.", "questions.", "practice.", "nav.", "footer."], indexable: true },
  { route: "/app/flashcards", surfaceType: "flashcards", prefixes: ["flashcards.", "learner.flashcards.", "nav."], indexable: false },
  { route: "/app/practice-tests/cat-launch", surfaceType: "cat", prefixes: ["cat.", "adaptive.", "practice.", "learner.cat.", "nav."], indexable: false },
  { route: "/hi/login", surfaceType: "auth", prefixes: ["auth.", "account.", "nav.", "common."], indexable: false },
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
  if (!text) return true;
  if (PROTECTED_IDENTICAL.has(text)) return true;
  if (/^[\d\s%.,:;()/+&·–—-]+$/.test(text)) return true;
  if (/^[→✓✗•×]+$/.test(text)) return true;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text)) return true;
  const withoutMustache = text.replace(/\{\{[^}]+\}\}/g, " ");
  if (/\{\{[^}]+\}\}/.test(text) && !/[a-z]{4,}/i.test(withoutMustache.replace(CONTROLLED_ENGLISH_TERMS, " "))) return true;
  const words = text.match(/[A-Za-z][A-Za-z0-9-]*/g) ?? [];
  return words.length > 0 && words.every((word) => PROTECTED_IDENTICAL.has(word) || /^[A-Z0-9]{2,}$/.test(word));
}

function hasDevanagari(value) {
  return /\p{Script=Devanagari}/u.test(String(value));
}

function englishLeak(value) {
  const text = String(value).replace(CONTROLLED_ENGLISH_TERMS, " ");
  if (text.trim().length < 8) return false;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text.trim())) return false;
  return /\b(the|and|your|with|for|this|that|from|learn|practice questions|flashcards|pricing|dashboard|subscribe|lesson|lessons|account|sign in|get started|study plan|readiness|exam prep|questions unavailable)\b/i.test(text) &&
    !hasDevanagari(text);
}

function surfaceKeys(en, surface) {
  return Object.keys(en).filter((key) => surface.prefixes.some((prefix) => key.startsWith(prefix)));
}

const en = loadLocale("en");
const hi = loadLocale("hi");
const enSnapshot = snapshotLocale("en");
const frSnapshot = snapshotLocale("fr");
const esSnapshot = snapshotLocale("es");

const missingKeys = Object.keys(en).filter((key) => !(key in hi) || String(hi[key] ?? "").trim() === "");
const extraKeys = Object.keys(hi).filter((key) => !(key in en));
const placeholderFields = Object.entries(hi).filter(([, value]) => typeof value === "string" && hasPlaceholder(value)).map(([key]) => key);
const identicalFields = Object.keys(en).filter((key) => hi[key] === en[key] && !isProtectedIdentical(hi[key]));
const nonHindiFields = Object.entries(hi)
  .filter(([key, value]) => typeof value === "string" && !isProtectedIdentical(value) && !hasDevanagari(value) && !/^.*(?:email|youremail|supportnursenestca)$/i.test(key))
  .map(([key]) => key);
const englishLeakSuspicions = Object.entries(hi)
  .filter(([, value]) => typeof value === "string" && englishLeak(value))
  .map(([key, value]) => `${key}: ${String(value).slice(0, 140)}`);

const surfaceReports = SURFACES.map((surface) => {
  const keys = surfaceKeys(en, surface);
  const missing = keys.filter((key) => missingKeys.includes(key));
  const placeholders = keys.filter((key) => placeholderFields.includes(key));
  const untranslated = keys.filter((key) => identicalFields.includes(key));
  const nonHindi = keys.filter((key) => nonHindiFields.includes(key));
  const leaks = englishLeakSuspicions.filter((line) => keys.some((key) => line.startsWith(`${key}:`)));
  const seoIssues = keys.filter((key) => /meta|seo|title|description|headline|openGraph|twitter/i.test(key) && (missing.includes(key) || placeholders.includes(key) || nonHindi.includes(key)));
  const issueCount = missing.length + placeholders.length + nonHindi.length;
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
    nonHindiFields: nonHindi.slice(0, 40),
    seoIssues: seoIssues.slice(0, 40),
    jsonLdIssues: [],
    indexable: surface.indexable && missing.length === 0 && placeholders.length === 0 && nonHindi.length === 0,
    shouldNoindex: surface.indexable && (missing.length > 0 || placeholders.length > 0 || nonHindi.length > 0),
    recommendedFix: missing.length || placeholders.length || nonHindi.length
      ? "Fix missing Hindi keys/placeholders/English-only fields before indexing this Hindi surface."
      : untranslated.length || leaks.length
        ? "Hindi keys are structurally complete; review controlled English terms for learner clarity."
        : "Hindi surface is structurally complete.",
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
  totalHindiKeys: Object.keys(hi).length,
  missingKeys,
  extraKeys,
  placeholderFields: placeholderFields.slice(0, 200),
  englishLeakSuspicions: englishLeakSuspicions.slice(0, 200),
  untranslatedReviewFields: identicalFields.slice(0, 500),
  nonHindiFields: nonHindiFields.slice(0, 500),
  englishSnapshot: enSnapshot,
  frenchSnapshot: frSnapshot,
  spanishSnapshot: esSnapshot,
  surfaces: surfaceReports,
  summary: {
    missingKeys: missingKeys.length,
    extraKeys: extraKeys.length,
    placeholders: placeholderFields.length,
    englishLeakSuspicions: englishLeakSuspicions.length,
    untranslatedReviewFields: identicalFields.length,
    nonHindiFields: nonHindiFields.length,
    indexableSurfacesBlocked: surfaceReports.filter((r) => r.shouldNoindex).length,
  },
};

const md = [
  "# Hindi Completeness Audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  `Hindi key coverage: ${coveragePct}% (${report.totalHindiKeys}/${report.totalEnglishKeys})`,
  `Missing Hindi keys: ${missingKeys.length}`,
  `Extra Hindi keys: ${extraKeys.length}`,
  `Placeholder fields: ${placeholderFields.length}`,
  `English leak suspicions: ${englishLeakSuspicions.length}`,
  `English-identical fields for human review: ${identicalFields.length}`,
  `Non-Hindi fields: ${nonHindiFields.length}`,
  "",
  "| Route | Surface | Score | Indexable | Review count | Top issue |",
  "| --- | --- | ---: | --- | ---: | --- |",
  ...surfaceReports.map((r) => `| ${r.route} | ${r.surfaceType} | ${r.completionScore} | ${r.indexable ? "yes" : "no"} | ${(r.untranslatedReviewFields.length + r.englishLeakSuspicions.length + r.nonHindiFields.length)} | ${(r.missingKeys[0] ?? r.placeholderFields[0] ?? r.nonHindiFields[0] ?? r.untranslatedReviewFields[0] ?? "none").replace(/\|/g, "\\|")} |`),
  "",
  "## Non-Hindi Fields",
  "",
  ...(report.nonHindiFields.slice(0, 80).map((key) => `- ${key}`)),
  "",
].join("\n");

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, "hindi-completeness-audit.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(REPORT_DIR, "hindi-completeness-audit.md"), md);

if (missingKeys.length || extraKeys.length || placeholderFields.length || englishLeakSuspicions.length || surfaceReports.some((r) => r.shouldNoindex)) {
  console.error(`[i18n:hi] failed: missing=${missingKeys.length} extra=${extraKeys.length} placeholders=${placeholderFields.length} leaks=${englishLeakSuspicions.length} blocked=${surfaceReports.filter((r) => r.shouldNoindex).length}`);
  process.exit(1);
}

console.log(`[i18n:hi] wrote reports/hindi-completeness-audit.{json,md}; coverage=${coveragePct}% reviewFields=${identicalFields.length}`);
