#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const CLIENT_I18N_ROOT = path.join(REPO_ROOT, "client", "public", "i18n");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const CACHE_DIR = path.join(APP_ROOT, ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "translate-hi-google-cache.json");
const APPLY = process.argv.includes("--apply");
const DRY_RUN = !APPLY;

const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"];

const PROTECTED_TERMS = [
  "NurseNest",
  "REx-PN",
  "NCLEX-RN",
  "NCLEX-PN",
  "NCLEX",
  "CPNRE",
  "OSCE",
  "CAT",
  "ECG",
  "EKG",
  "IV",
  "BP",
  "HR",
  "SpO2",
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
  "LinkedIn",
];

const HINDI_OVERRIDES = {
  "common:nursenest.ca": "nursenest.ca",
  "breadcrumbs.home": "होम",
  "breadcrumbs.pricing": "कीमतें",
  "breadcrumbs.lessons": "पाठ",
  "breadcrumbs.questionBank": "प्रैक्टिस प्रश्न",
  "nav.home": "होम",
  "nav.pricing": "कीमतें",
  "nav.lessons": "पाठ",
  "nav.practiceQuestions": "प्रैक्टिस प्रश्न",
  "nav.flashcards": "फ्लैशकार्ड",
  "nav.login": "लॉग इन",
  "nav.signup": "शुरू करें",
  "pages.home.metaTitleCA": "NurseNest | कनाडा के लिए नर्सिंग परीक्षा तैयारी",
  "pages.home.metaDescriptionCA": "REx-PN, NCLEX-RN, NP और Allied Health परीक्षा तैयारी के लिए पाठ, प्रैक्टिस प्रश्न, फ्लैशकार्ड और तैयारी ट्रैकिंग।",
  "pages.home.metaTitleUS": "NurseNest | नर्सिंग परीक्षा तैयारी",
  "pages.home.metaDescriptionUS": "NCLEX-RN, NCLEX-PN, NP और Allied Health परीक्षा तैयारी के लिए पाठ, प्रैक्टिस प्रश्न, फ्लैशकार्ड और तैयारी ट्रैकिंग।",
  "pages.pricing.title": "NurseNest की कीमतें",
  "pages.pricing.description": "नर्सिंग और हेल्थकेयर परीक्षा तैयारी के लिए सरल प्लान। पाठ, प्रैक्टिस प्रश्न, फ्लैशकार्ड और adaptive mock exams के साथ पढ़ें।",
  "pages.publicQuestionBank.metaTitleCA": "प्रैक्टिस प्रश्न | REx-PN, NCLEX-RN, NP और Allied Health",
  "pages.publicQuestionBank.metaDescriptionCA": "कनाडा-केंद्रित नर्सिंग और हेल्थकेयर परीक्षा तैयारी के लिए प्रैक्टिस प्रश्न, rationales और कमजोर टॉपिक की समीक्षा।",
  "pages.publicQuestionBank.metaTitleUS": "प्रैक्टिस प्रश्न | NCLEX-RN, NCLEX-PN, NP और Allied Health",
  "pages.publicQuestionBank.metaDescriptionUS": "नर्सिंग और हेल्थकेयर परीक्षा तैयारी के लिए प्रैक्टिस प्रश्न, rationales और कमजोर टॉपिक की समीक्षा।",
  "pages.publicQuestionBank.metaTitle": "NCLEX और REx-PN प्रैक्टिस प्रश्न | NurseNest",
  "pages.publicQuestionBank.metaDescription": "NurseNest question bank का सार्वजनिक अवलोकन: NCLEX-RN, NCLEX-PN, REx-PN और NP tracks के लिए प्रैक्टिस प्रश्न। ऐप में अभ्यास करने के लिए साइन अप करें।",
  "pages.publicQuestionBank.h1": "नर्सिंग प्रैक्टिस प्रश्न",
  "pages.publicQuestionBank.intro": "अपने exam pathway के अनुसार प्रश्न चुनें, rationale पढ़ें, और कमजोर topics पर दोबारा अभ्यास करें।",
  "pages.home.finalCta.headline": "आत्मविश्वास के साथ अपनी नर्सिंग परीक्षा पास करें",
  "pages.home.finalCta.subheading": "पाठों से सीखें, प्रैक्टिस प्रश्नों से अभ्यास करें, और अपनी प्रगति एक ही जगह ट्रैक करें।",
  "pages.home.finalCta.pricingLink": "कीमतें देखें",
  "pages.home.globalRegions.us.title": "संयुक्त राज्य (NCLEX-RN / NCLEX-PN)",
  "marketing:home.heroFeatures.pathophysiology": "रोग-प्रक्रिया",
  "marketing:npExamHub.pathophysiology": "रोग-प्रक्रिया",
  "marketing:rexPnHub.pathophysiology": "रोग-प्रक्रिया",
  "pages:pages.clinicalSeo.conditionPage.pathophysiology": "रोग-प्रक्रिया",
  "pages:pages.conditionPage.pathophysiology": "रोग-प्रक्रिया",
  "pages:pages.lessonDetail.pathophysiology": "रोग-प्रक्रिया",
  "pages:pages.lessonDetail.pathophysiology2": "रोग-प्रक्रिया",
  "pages:pages.nclexRnContentHub.pathophysiology": "रोग-प्रक्रिया",
  "pages:pages.rexPnContentHub.pathophysiology": "रोग-प्रक्रिया",
  "pages:pages.seoLessonDetail.pathophysiology": "रोग-प्रक्रिया",
  "pages:pages.imagingPositioningDetail.collimation": "कोलिमेशन",
  "pages:pages.orderOfTheDraw.additive2": "एडिटिव",
  "pages:pages.preNursing.tachycardia": "टैकीकार्डिया",
  "allied:allied.physicsVisuals.formula": "सूत्र",
  "components:components.ngnRenderersCalculationNumericRenderer.formula": "सूत्र",
  "pages:pages.clinicalCalculators.formula3": "सूत्र",
  "pages:pages.productBuilder.radius": "त्रिज्या",
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function writeJson(file, data) {
  const normalized = file.replace(/\\/g, "/");
  if (/\/public\/i18n\/(?:en|fr|es)\//.test(normalized) || /\/client\/public\/i18n\/(?:en|fr|es)\.json$/.test(normalized)) {
    throw new Error(`Refusing to write protected locale file: ${file}`);
  }
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
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
  if (PROTECTED_TERMS.includes(text)) return true;
  if (/^[\d\s%.,:;()/+&·–—-]+$/.test(text)) return true;
  if (/^[\d\s%.,:;()/+&·–—×μµ³⁻₀-₉A-Za-z]+$/.test(text) && /(?:mmHg|mEq|mol|L|dL|PaCO|PaO|SaO|HCO|PLT|WBC)/i.test(text)) return true;
  const words = withoutPlaceholders.match(/[A-Za-z][A-Za-z0-9-]*/g) ?? [];
  return words.length > 0 && words.every((word) => PROTECTED_TERMS.includes(word) || /^[A-Z0-9]{2,}$/.test(word));
}

function shouldTranslate(enValue, hiValue) {
  const en = String(enValue ?? "");
  const hi = String(hiValue ?? "");
  if (!en.trim()) return false;
  if (isProtectedIdentical(en)) return false;
  if (HINDI_OVERRIDES[en]) return true;
  if (!hi.trim()) return true;
  if (hi === en) return true;
  if (!/\p{Script=Devanagari}/u.test(hi) && /[A-Za-z]{3,}/.test(hi)) return true;
  return false;
}

function mask(text) {
  const tokens = [];
  let out = text.replace(/\{\{[^}]+\}\}/g, (match) => {
    const token = `NNTOKEN${tokens.length}NN`;
    tokens.push([token, match]);
    return token;
  });
  for (const term of PROTECTED_TERMS.sort((a, b) => b.length - a.length)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "g"), (match) => {
      const token = `NNTOKEN${tokens.length}NN`;
      tokens.push([token, match]);
      return token;
    });
  }
  return { masked: out, tokens };
}

function unmask(text, tokens) {
  let out = text;
  for (const [token, value] of tokens) {
    out = out.replaceAll(token, value).replaceAll(token.toLowerCase(), value);
  }
  return out;
}

function placeholderNames(text) {
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  const out = [];
  let match;
  while ((match = re.exec(text)) !== null) out.push(match[1].trim());
  return [...new Set(out)].sort();
}

async function translateValue(value, cache) {
  const override = Object.entries(HINDI_OVERRIDES).find(([, v]) => v === value);
  if (override) return value;
  if (cache[value]) return cache[value];
  const { masked, tokens } = mask(value);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(masked)}`;
  let lastError;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const translated = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? "").join("") : "";
      if (!translated.trim()) throw new Error("empty translation response");
      const valueOut = unmask(translated, tokens);
      if (JSON.stringify(placeholderNames(valueOut)) !== JSON.stringify(placeholderNames(value))) return value;
      cache[value] = valueOut;
      return valueOut;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function pool(items, concurrency, fn) {
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const item = items[index++];
      await fn(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
}

function mergedPublicLocale(locale) {
  const out = {};
  for (const shard of SHARDS) Object.assign(out, readJson(path.join(I18N_ROOT, locale, `${shard}.json`)));
  return out;
}

async function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cache = readJson(CACHE_FILE);
  const planned = [];
  const perShard = new Map();

  for (const shard of SHARDS) {
    const en = readJson(path.join(I18N_ROOT, "en", `${shard}.json`));
    const hi = readJson(path.join(I18N_ROOT, "hi", `${shard}.json`));
    for (const [key, enValue] of Object.entries(en)) {
      if (typeof enValue !== "string") continue;
      const current = hi[key];
      const proposedOverride = HINDI_OVERRIDES[`${shard}:${key}`] ?? HINDI_OVERRIDES[key];
      const hasPendingOverride = proposedOverride && current !== proposedOverride;
      if (hasPendingOverride || shouldTranslate(enValue, current)) {
        planned.push({
          shard,
          key,
          english: enValue,
          current: typeof current === "string" ? current : "",
          proposed: hasPendingOverride ? proposedOverride : null,
          reason: hasPendingOverride ? "curated-override" : current == null || String(current).trim() === "" ? "missing" : "english-identical-or-leak",
        });
      }
    }
    perShard.set(shard, hi);
  }

  if (APPLY) {
    let completed = 0;
    await pool(planned, 6, async (change) => {
      const hi = perShard.get(change.shard);
      const translated = change.proposed ?? await translateValue(change.english, cache);
      hi[change.key] = translated;
      change.proposed = translated;
      completed++;
      if (completed % 100 === 0) {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");
        console.log(`[i18n:hi] translated ${completed}/${planned.length}`);
      }
    });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");
    for (const shard of SHARDS) writeJson(path.join(I18N_ROOT, "hi", `${shard}.json`), perShard.get(shard));

    const clientEn = readJson(path.join(CLIENT_I18N_ROOT, "en.json"));
    const clientHi = readJson(path.join(CLIENT_I18N_ROOT, "hi.json"));
    const publicHi = mergedPublicLocale("hi");
    for (const key of Object.keys(clientEn)) {
      if (publicHi[key] !== undefined) clientHi[key] = publicHi[key];
      else if (!(key in clientHi) || String(clientHi[key] ?? "").trim() === "") clientHi[key] = clientEn[key];
    }
    writeJson(path.join(CLIENT_I18N_ROOT, "hi.json"), clientHi);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    applied: APPLY,
    locale: "hi",
    plannedChanges: planned.length,
    changedKeys: APPLY ? planned.length : 0,
    protectedLocales: ["en", "fr", "es"],
    changes: planned,
  };
  fs.writeFileSync(path.join(REPORT_DIR, "translate-hi-missing-report.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(`[i18n:translate:hi] ${APPLY ? "applied" : "dry-run"}; ${planned.length} Hindi keys planned.`);
}

main().catch((error) => {
  console.error("[i18n:translate:hi] failed:");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
