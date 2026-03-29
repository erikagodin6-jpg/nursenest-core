import { auditTranslation, getIndexableLocales, getSupportedLocales, getTranslationThreshold } from "../server/translation-audit";
import { getPageMeta } from "../server/seo-meta";

const ROUTES = [
  "/", "/lessons", "/flashcards", "/pricing", "/start-free", "/anatomy",
  "/med-math", "/lab-values", "/mock-exams", "/clinical-clarity", "/blog",
  "/pre-nursing", "/question-of-the-day", "/question-bank", "/lectures",
  "/nursing", "/nursing-specialties", "/faq", "/about", "/contact",
  "/terms", "/privacy", "/nclex-rn-practice-questions", "/nclex-pn-practice-questions",
  "/rex-pn-practice-questions", "/np-exam-practice-questions", "/free-practice",
  "/practice-questions", "/glossary", "/medication-mastery",
];

let errors = 0;
let warnings = 0;

function error(msg: string) {
  console.error(`  ❌ ERROR: ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`  ⚠️  WARN: ${msg}`);
  warnings++;
}

function ok(msg: string) {
  console.log(`  ✅ ${msg}`);
}

console.log("=== NurseNest SEO Pre-Deploy Validation ===\n");

const threshold = getTranslationThreshold();
const indexable = getIndexableLocales();
const allLocales = getSupportedLocales();

console.log(`Translation threshold: ${threshold}%`);
console.log(`Indexable locales: ${indexable.join(", ")}`);
console.log(`Total locales: ${allLocales.length}\n`);

if (indexable.length < 1) {
  error("No indexable locales found — English should always be indexable");
}
if (!indexable.includes("en")) {
  error("English is not in the indexable locales list");
}

console.log("--- Translation Coverage ---");
for (const locale of allLocales) {
  const audit = auditTranslation(locale);
  const status = audit.isIndexable ? "✅" : "⛔";
  console.log(`  ${status} ${locale}: ${audit.percentage}% (${audit.translatedKeys}/${audit.totalKeys}) — ${audit.readiness}`);
  if (audit.percentage < 50 && locale !== "en") {
    warn(`${locale} has very low translation coverage (${audit.percentage}%)`);
  }
}

console.log("\n--- Canonical & Meta Validation ---");
for (const route of ROUTES) {
  for (const locale of indexable) {
    const fullPath = locale === "en" ? `/en${route === "/" ? "" : route}` : `/${locale}${route === "/" ? "" : route}`;
    const meta = getPageMeta(fullPath);

    if (!meta.canonical) {
      error(`Missing canonical for ${fullPath}`);
    } else if (meta.canonical.includes("/index.html")) {
      error(`Canonical contains /index.html: ${meta.canonical}`);
    }

    if (!meta.canonical?.includes(`/${locale}`)) {
      warn(`Canonical for ${fullPath} doesn't reference locale: ${meta.canonical}`);
    }

    if (meta.noindex && indexable.includes(locale)) {
      const audit = auditTranslation(locale, route);
      if (audit.isIndexable) {
        warn(`${fullPath} is noindex but locale is indexable — check if route is intentionally noindexed`);
      }
    }
  }
}

console.log("\n--- URL Normalization ---");
for (const route of ROUTES) {
  if (route.includes("/index.html")) {
    error(`Route contains /index.html: ${route}`);
  }
  if (route !== "/" && route.endsWith("/")) {
    error(`Route has trailing slash: ${route}`);
  }
}
ok("No /index.html or trailing slash issues in route list");

console.log("\n--- Hreflang Consistency ---");
if (indexable.length >= 2) {
  ok(`${indexable.length} indexable locales available for hreflang set`);
} else {
  warn("Only 1 indexable locale — hreflang tags will be minimal");
}

for (const locale of indexable) {
  const audit = auditTranslation(locale);
  if (!audit.isIndexable) {
    error(`${locale} is in indexable list but fails audit threshold`);
  }
}

console.log("\n=== Summary ===");
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  console.error("\n🚨 CRITICAL: Fix errors before deploying!\n");
  process.exit(1);
} else if (warnings > 0) {
  console.log("\n⚠️  Deploy with caution — review warnings above.\n");
  process.exit(0);
} else {
  console.log("\n🎉 All SEO checks passed!\n");
  process.exit(0);
}
