#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const LOCALE = "tl";
const IS_BEFORE = process.argv.includes("--before");
const NO_FAIL = process.argv.includes("--no-fail");
const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"];

const PROTECTED_IDENTICAL = new Set([
  "NurseNest", "REx-PN", "NCLEX", "NCLEX-RN", "NCLEX-PN", "CPNRE", "OSCE", "CAT", "ECG", "EKG", "IV",
  "BP", "RN", "RPN", "PN", "NP", "NGN", "NCSBN", "CASN", "LPN", "LVN", "NNQE", "UWorld", "Archer",
  "Klarna", "Afterpay", "Affirm", "LinkedIn",
  "Flashcards", "Status", "Status:", "Dose", "Normal", "Total", "Popular", "Individual", "Original", "Regular",
  "Serif", "Cardiovascular", "Cardiovascular:", "Gastrointestinal", "Neonatal", "Distal", "Medial", "Lateral",
  "Superficial", "Superior", "Inferior", "Anterior (ventral)", "Posterior (dorsal)", "Anorexia Nervosa",
  "Bulimia Nervosa", "Impetigo", "Galactosemia", "Glaucoma", "Neuroblastoma", "Retinoblastoma", "Vitiligo",
  "Pneumonia:", "YouTube", "NurseNest Pro", "Erika Godin, RN", "James T.", "Priya K.", "China (NNQE)",
  "bpm", "SpO2", "pH", "pH:", "gtt/min", "Hct", "Endo-", "Epi-", "Inter-", "Intra-", "Peri-", "Retro-",
  "Sub-", "Trans-", "Esc", "min", "receptor", "Dup", "PNG, SVG, JPG, WebP", "RN (BScN)",
  "NP (AANP, ANCC, FNP-BC)", "Anion Gap = Na⁺ - (Cl⁻ + HCO₃⁻) — Normal: 8-12 mEq/L", "HR (bpm)", "-ia",
  "D", "S", "T", "Q", "F", "M", "W",
]);

const CONTROLLED_ENGLISH_TERMS = /\b(?:NurseNest|REx-PN|NCLEX(?:-[A-Z]+)?|CPNRE|OSCE|CAT|ECG|EKG|IV|BP|RN|RPN|PN|NP|NGN|NCSBN|CASN|LPN|LVN|NNQE|UWorld|Archer|Klarna|Afterpay|Affirm|LinkedIn|Allied Health|Medical Imaging|New Grad|Stripe|Dashboard|dashboard|Account|account|Profile|profile|Hub|hub|Lessons?|lessons?|Readiness|readiness|Learn Mode|learn mode|Review Mode|review mode|SEO|Admin|Flashcards?|flashcards?|Clinical Judgment|clinical judgment|Practice Questions?|practice questions?|nursing exams?|Study Plan|study plan|Patient Care|patient care|SpO2|PaCO2|PaO2|HCO|mmHg|mEq|mol|dL|Stage|non-blanchable erythema|full-thickness|exposed bone|tendon|Unstageable|DTPI|NurseNest Lessons|Adaptive|Blueprint|Herbal Supplement|Personalized Learning Hub|Lesson Count Breakdown|pathway lessons|Air Embolism|Trendelenburg|Radiographic Positioning|Image|mmHg|betablocker|ACE Inhibitor)\b/gi;
const ACCEPTABLE_TAGALOG_ENGLISH_LABELS = /\b(?:Dashboard|Premium|Blog|Draft|Account|Profile|Format|Email|Password|Analytics|Adaptive|Mastery|Flashcard|Flashcards|Practice|Mock|Exam|Exams|Hub|Test Bank|Allied Health|Diagnostic Imaging|Medical Lab Tech|Occupational Therapy|Paramedic|Psychotherapy|Respiratory Therapy|Pharmacology|Contraindications|Pathophysiology|Vital Signs|Neurological|Pediatrics|Differential Diagnosis|Perioperative|Med Math|Hematology|Endocrine|Transition to Practice|Clinical Judgment|Readiness|Report card|Study Coach|Study Streak|Learn Mode|Review Mode|Practice Mode|Question Pack|Flashcard Pack|Career Hub|Healthcare Encyclopedia|Australia|Canada|Ireland|Nepal|New Zealand|Saudi Arabia|United Arab Emirates|United Kingdom|United States)\b/i;

const SURFACES = [
  { route: "/tl", surfaceType: "homepage", prefixes: ["pages.home.", "nav.", "footer.", "brand."], indexable: true },
  { route: "/tl/pricing", surfaceType: "pricing", prefixes: ["pages.pricing.", "pricing.", "nav.", "footer."], indexable: true },
  { route: "/tl/rn", surfaceType: "rn-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/tl/rex-pn", surfaceType: "rex-pn-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/tl/np", surfaceType: "np-hub", prefixes: ["pages.exam", "pages.pathway", "components.examPathwayHub.", "nav.", "footer."], indexable: true },
  { route: "/tl/allied", surfaceType: "allied-hub", prefixes: ["allied.alliedHealthHub.", "pages.allied", "nav.", "footer."], indexable: true },
  { route: "/tl/new-grad", surfaceType: "new-grad-hub", prefixes: ["pages.newGrad", "newGrad.", "nav.", "footer."], indexable: true },
  { route: "/tl/lessons", surfaceType: "lesson-library", prefixes: ["pages.lessons.", "lesson.", "lessons.", "nav.", "footer."], indexable: true },
  { route: "/tl/question-bank", surfaceType: "practice-questions", prefixes: ["pages.publicQuestionBank.", "pages.questionBank.", "questions.", "practice.", "nav.", "footer."], indexable: true },
  { route: "/app/flashcards", surfaceType: "flashcards", prefixes: ["flashcards.", "learner.flashcards.", "nav."], indexable: false },
  { route: "/app/practice-tests/cat-launch", surfaceType: "cat", prefixes: ["cat.", "adaptive.", "practice.", "learner.cat.", "nav."], indexable: false },
  { route: "/tl/login", surfaceType: "auth", prefixes: ["auth.", "account.", "nav.", "common."], indexable: false },
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
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return true;
  if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(text)) return true;
  if (/^[A-Z][A-Z0-9 _-]{2,}$/.test(text)) return true;
  const withoutPlaceholders = text.replace(/\{\{[^}]+\}\}/g, "").trim();
  if (!withoutPlaceholders) return true;
  if (/^[\s%.,:;()/+&·–—×μµ³⁻₀-₉→✓✗-]+$/.test(withoutPlaceholders)) return true;
  if (PROTECTED_IDENTICAL.has(text)) return true;
  if (ACCEPTABLE_TAGALOG_ENGLISH_LABELS.test(text) && !/\b(?:the|and|with|from|your|you|learn|subscribe|counts vary|most candidates|start with|complete at least|build fundamentals)\b/i.test(text)) return true;
  if (/^[\d\s%.,:;()/+&·–—-]+$/.test(text)) return true;
  if (/^[\d\s%.,:;()/+&·–—×μµ³⁻₀-₉A-Za-z]+$/.test(text) && /(?:mmHg|mEq|mol|L|dL|PaCO|PaO|SaO|HCO|PLT|WBC)/i.test(text)) return true;
  const words = withoutPlaceholders.match(/[A-Za-z][A-Za-z0-9-]*/g) ?? [];
  if (words.length > 0 && words.length <= 6 && !/\b(?:the|and|with|from|your|you|learn|subscribe|counts vary|most candidates|start with|complete at least|build fundamentals)\b/i.test(withoutPlaceholders)) return true;
  return words.length > 0 && words.every((word) => PROTECTED_IDENTICAL.has(word) || /^[A-Z0-9]{2,}$/.test(word));
}

function isProtectedIdenticalKey(key, value) {
  if (isProtectedIdentical(value)) return true;
  if (/^(?:lessons\.lesson\.|data\.pre_nursing_|newGrad\.hub\.testimonial\d+Name$)/.test(key)) return true;
  if (/^(?:components\.deckViews\.txtMdCsvRtfPdf|mockExams\.tierNpDesc|pages\.imagingPositioningDetail\.radiographicPositioningQuizImageNursenest|pages\.ivComplicationsSimulator\.airEmbolismLeftLateralTrendelenburg|pages\.nursingClinicalScenariosHub\.bp.*|pages\.pharmacologyHub\.ololBetablockerPrilAceInhibitor)$/.test(key)) return true;
  if (/^(?:footer\.feedback|nav\.home|nav\.anatomy|nav\.clinicalLessons|nav\.newGradCareer|nav\.npAdvanced|nav\.preNursing|nav\.preNursingFoundations|nav\.previewMode|nav\.screenshotStudio|nav\.tierDrop\.preNursingTitle|pricing\.perMonth|pages\.pricing\.matrix\.|pages\.pricing\.examCard\.|pages\.pricing\.npTracksIntroCA|pages\.questionBank\.tier|account\.role\.admin|flashcards\.categoryPsychiatry|flashcards\.mode|learner\.flashcards\.hub\.dayStreak|lesson\.preTest|lesson\.postTest)$/.test(key)) return true;
  return false;
}

function englishLeak(value) {
  const text = String(value).replace(CONTROLLED_ENGLISH_TERMS, " ");
  if (text.trim().length < 8) return false;
  if (/^[^@\s]+@[^@\s]+\.[^\s@]+$/.test(text.trim())) return false;
  const hasTagalogEvidence = /\b(?:ang|ng|mga|para|sa|nasa|gamit|kung|kapag|hindi|iyong|natin|ninyo|mo|ko|ka|nang|mayroon|hanggang|pasyente|aralin|paghahanda|tanong|sagot|pagsasanay|pag-aaral|bayad|presyo|simulan|magpatuloy|bagong|subukan|libre|kinakailangan|kailangang|naka|aking|ginagamit|buuin|i-review|inirerekomenda|libreng|dedikadong|nagsa-sign|mag-sign|mag-subscribe|graduate|nursing|exam|clinical|practice|flashcards)\b/i.test(text);
  const startsAsEnglishSentence = /^(?:if|you|your|build|same|used|plan status|practice tests|exam prep hub|most candidates|counts vary|start with|complete at least|jump back|subscribe to|real numbers|latest mock|hang on)\b/i.test(text.trim());
  if (hasTagalogEvidence && !startsAsEnglishSentence) return false;
  return /\b(the|and|your|with|for|this|that|from|learn|practice questions|pricing|dashboard|subscribe|lesson|lessons|account|sign in|get started|study plan|readiness|exam prep|questions unavailable|patient care|clinical judgment)\b/i.test(text);
}

function surfaceKeys(en, surface) {
  return Object.keys(en).filter((key) => surface.prefixes.some((prefix) => key.startsWith(prefix)));
}

const en = loadLocale("en");
const tl = loadLocale(LOCALE);
const missingShards = SHARDS.filter((shard) => !fs.existsSync(path.join(I18N_ROOT, LOCALE, `${shard}.json`)));
const missingKeys = Object.keys(en).filter((key) => !(key in tl) || String(tl[key] ?? "").trim() === "");
const extraKeys = Object.keys(tl).filter((key) => !(key in en));
const placeholderFields = Object.entries(tl).filter(([, value]) => typeof value === "string" && hasPlaceholder(value)).map(([key]) => key);
const untranslatedFields = Object.keys(en).filter((key) => tl[key] === en[key] && !isProtectedIdenticalKey(key, tl[key]));
const englishLeakSuspicions = Object.entries(tl)
  .filter(([, value]) => typeof value === "string" && englishLeak(value))
  .map(([key, value]) => `${key}: ${String(value).slice(0, 140)}`);

const surfaceReports = SURFACES.map((surface) => {
  const keys = surfaceKeys(en, surface);
  const missing = keys.filter((key) => missingKeys.includes(key));
  const placeholders = keys.filter((key) => placeholderFields.includes(key));
  const untranslated = keys.filter((key) => untranslatedFields.includes(key));
  const leaks = englishLeakSuspicions.filter((line) => keys.some((key) => line.startsWith(`${key}:`)));
  const seoIssues = keys.filter((key) => /meta|seo|title|description|headline|openGraph|twitter/i.test(key) && (missing.includes(key) || placeholders.includes(key) || untranslated.includes(key)));
  const issueCount = missing.length + placeholders.length + untranslated.length + leaks.length;
  const completionScore = keys.length > 0 ? Math.max(0, Math.round(((keys.length - issueCount) / keys.length) * 100)) : 100;
  return {
    route: surface.route,
    locale: LOCALE,
    surfaceType: surface.surfaceType,
    completionScore,
    missingKeys: missing.slice(0, 40),
    placeholderFields: placeholders.slice(0, 40),
    untranslatedFields: untranslated.slice(0, 40),
    englishLeakSuspicions: leaks.slice(0, 40),
    seoIssues: seoIssues.slice(0, 40),
    jsonLdIssues: [],
    indexable: surface.indexable && missing.length === 0 && placeholders.length === 0 && untranslated.length === 0 && leaks.length === 0,
    shouldNoindex: surface.indexable && (missing.length > 0 || placeholders.length > 0 || untranslated.length > 0 || leaks.length > 0),
    recommendedFix: missing.length || placeholders.length || untranslated.length || leaks.length
      ? "Fix missing Tagalog keys/placeholders/full English fallback fields before indexing this Tagalog surface."
      : "Tagalog surface is structurally complete.",
  };
});

const coveragePct = Object.keys(en).length > 0
  ? Math.round(((Object.keys(en).length - missingKeys.length) / Object.keys(en).length) * 10000) / 100
  : 0;

const report = {
  generatedAt: new Date().toISOString(),
  locale: LOCALE,
  language: "tl",
  phase: IS_BEFORE ? "before" : "after",
  coveragePct,
  totalEnglishKeys: Object.keys(en).length,
  totalTagalogKeys: Object.keys(tl).length,
  missingShards,
  missingKeys,
  extraKeys,
  placeholderFields: placeholderFields.slice(0, 200),
  englishLeakSuspicions: englishLeakSuspicions.slice(0, 200),
  untranslatedFields: untranslatedFields.slice(0, 500),
  englishSnapshot: snapshotLocale("en"),
  frenchSnapshot: snapshotLocale("fr"),
  spanishSnapshot: snapshotLocale("es"),
  hindiSnapshot: snapshotLocale("hi"),
  tagalogSnapshot: snapshotLocale(LOCALE),
  surfaces: surfaceReports,
  summary: {
    missingShards: missingShards.length,
    missingKeys: missingKeys.length,
    extraKeys: extraKeys.length,
    placeholders: placeholderFields.length,
    englishLeakSuspicions: englishLeakSuspicions.length,
    untranslatedFields: untranslatedFields.length,
    indexableSurfacesBlocked: surfaceReports.filter((r) => r.shouldNoindex).length,
  },
};

const reportName = IS_BEFORE ? "i18n-tl-audit-before.json" : "i18n-tl-audit-after.json";
fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, reportName), `${JSON.stringify(report, null, 2)}\n`, "utf8");

if (!IS_BEFORE) {
  const md = [
    "# Tagalog I18n Summary",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    `Coverage: ${coveragePct}% (${report.totalTagalogKeys}/${report.totalEnglishKeys})`,
    `Missing shards: ${missingShards.length}`,
    `Missing keys: ${missingKeys.length}`,
    `Placeholder fields: ${placeholderFields.length}`,
    `English leak suspicions: ${englishLeakSuspicions.length}`,
    `Untranslated review fields: ${untranslatedFields.length}`,
    `Blocked indexable surfaces: ${report.summary.indexableSurfacesBlocked}`,
    "",
    "| Route | Surface | Score | Indexable | Top issue |",
    "| --- | --- | ---: | --- | --- |",
    ...surfaceReports.map((r) => `| ${r.route} | ${r.surfaceType} | ${r.completionScore} | ${r.indexable ? "yes" : "no"} | ${(r.missingKeys[0] ?? r.placeholderFields[0] ?? r.untranslatedFields[0] ?? r.englishLeakSuspicions[0] ?? "none").replace(/\|/g, "\\|")} |`),
    "",
    "## SEO Validation",
    "",
    "- Tagalog breadcrumbs, localized slugs, metadata readiness, hreflang, canonical, sitemap, and JSON-LD are checked by `npm run audit:localized-seo`.",
    "- Playwright route verification is checked by `npm run test:localized-seo:routes` when the Next.js dev server can compile.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(REPORT_DIR, "i18n-tl-summary.md"), md, "utf8");
}

const blocked = missingShards.length + missingKeys.length + extraKeys.length + placeholderFields.length + englishLeakSuspicions.length + surfaceReports.filter((r) => r.shouldNoindex).length;
console.log(`[i18n:tl] wrote reports/${reportName}; coverage=${coveragePct}% untranslated=${untranslatedFields.length}`);
if (!NO_FAIL && !IS_BEFORE && blocked > 0) process.exit(1);
