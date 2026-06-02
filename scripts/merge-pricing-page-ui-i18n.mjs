/**
 * Adds English UI strings for marketing pricing page client (all hardcoded copy → i18n keys).
 * Run from nursenest-core/: node scripts/merge-pricing-page-ui-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, "../public/i18n/en.json");

const patch = {
  "pages.pricing.hero.subheadMain":
    "Train with exam-style questions, UWorld-level rationale structure, weak-area targeting, flashcards, and readiness guidance that tells you exactly what to do next.",
  "pages.pricing.hero.choicePill": "Most students choose a plan that matches their time-to-exam window.",
  "pages.pricing.hero.ctaStartStudying": "Start studying now",
  "pages.pricing.hero.ctaSeeWeakAreas": "See weak-area targeting first",
  "pages.pricing.hero.checkoutHint": "No pressure: secure checkout, cancel anytime.",

  "pages.pricing.demo.scorePreview": "Score preview",
  "pages.pricing.demo.scoreExamplePct": "68%",
  "pages.pricing.demo.lastSessionExample": "Last session · Pharmacology (example)",
  "pages.pricing.demo.priorityChip": "Priority",
  "pages.pricing.demo.safetyChip": "Safety",
  "pages.pricing.demo.categoriesTitle": "Categories",
  "pages.pricing.demo.rowFluid": "Fluid balance",
  "pages.pricing.demo.rowInfection": "Infection control",
  "pages.pricing.demo.rowMedAdmin": "Med admin",
  "pages.pricing.demo.reviewLabel": "Review",
  "pages.pricing.demo.stableLabel": "Stable",
  "pages.pricing.demo.illusNote": "Illustrative breakdown. Your report uses live data.",

  "pages.pricing.matrix.title": "Plan comparison",
  "pages.pricing.matrix.lead":
    "Choose by depth: Free to start, Core to improve, Premium for full exam-readiness workflow.",
  "pages.pricing.matrix.thFeature": "Feature",
  "pages.pricing.matrix.thFree": "Free",
  "pages.pricing.matrix.thCore": "Core",
  "pages.pricing.matrix.thPremium": "Premium",

  "pages.pricing.matrix.r0.f": "Practice questions",
  "pages.pricing.matrix.r0.free": "Limited starter sets",
  "pages.pricing.matrix.r0.core": "Full question access",
  "pages.pricing.matrix.r0.premium": "Full + prioritized drills",
  "pages.pricing.matrix.r1.f": "Rationales",
  "pages.pricing.matrix.r1.free": "Basic",
  "pages.pricing.matrix.r1.core": "Detailed",
  "pages.pricing.matrix.r1.premium": "Detailed + remediation cues",
  "pages.pricing.matrix.r2.f": "Lessons",
  "pages.pricing.matrix.r2.free": "Preview only",
  "pages.pricing.matrix.r2.core": "Included",
  "pages.pricing.matrix.r2.premium": "Included",
  "pages.pricing.matrix.r3.f": "Flashcards",
  "pages.pricing.matrix.r3.free": "Preview",
  "pages.pricing.matrix.r3.core": "Included",
  "pages.pricing.matrix.r3.premium": "Included",
  "pages.pricing.matrix.r4.f": "Exams (CAT)",
  "pages.pricing.matrix.r4.free": "No",
  "pages.pricing.matrix.r4.core": "Practice exams",
  "pages.pricing.matrix.r4.premium": "Practice exams + adaptive focus",
  "pages.pricing.matrix.r5.f": "Adaptive features",
  "pages.pricing.matrix.r5.free": "No",
  "pages.pricing.matrix.r5.core": "Basic",
  "pages.pricing.matrix.r5.premium": "Advanced",
  "pages.pricing.matrix.r6.f": "Study plan",
  "pages.pricing.matrix.r6.free": "No",
  "pages.pricing.matrix.r6.core": "Included",
  "pages.pricing.matrix.r6.premium": "Included + weak-area guided",
  "pages.pricing.matrix.r7.f": "Weak-area tracking",
  "pages.pricing.matrix.r7.free": "No",
  "pages.pricing.matrix.r7.core": "Yes",
  "pages.pricing.matrix.r7.premium": "Yes + stronger prioritization",

  "pages.pricing.persona.monthly": "For students who want flexibility while building consistent weekly momentum.",
  "pages.pricing.persona.3-month": "For learners in the last 8-12 weeks who need focused, high-yield readiness work.",
  "pages.pricing.persona.6-month": "For busy schedules that need a practical runway without rushing.",
  "pages.pricing.persona.yearly":
    "For long-horizon prep across lessons, question bank depth, and exam-day confidence.",

  "pages.pricing.outcomes.monthly.0": "Start today and get immediate weak-area targeting.",
  "pages.pricing.outcomes.monthly.1": "Build confidence with realistic question flow and rationales.",
  "pages.pricing.outcomes.monthly.2": "Keep pressure low with a month-to-month commitment.",
  "pages.pricing.outcomes.3-month.0": "Tighten your weakest topics before exam day.",
  "pages.pricing.outcomes.3-month.1": "Use readiness trends to prioritize the next best study block.",
  "pages.pricing.outcomes.3-month.2": "Convert study time into exam-style decision speed.",
  "pages.pricing.outcomes.6-month.0": "Cover fundamentals thoroughly, then sharpen with mocks.",
  "pages.pricing.outcomes.6-month.1": "Improve consistency before entering final exam stretch.",
  "pages.pricing.outcomes.6-month.2": "Reduce last-minute cramming with a structured timeline.",
  "pages.pricing.outcomes.yearly.0": "Build deep clinical reasoning over a full prep cycle.",
  "pages.pricing.outcomes.yearly.1": "Track progress from baseline to exam-ready readiness bands.",
  "pages.pricing.outcomes.yearly.2": "Study with a complete system, not disconnected resources.",

  "pages.pricing.faq.0.q": "Can I cancel anytime?",
  "pages.pricing.faq.0.a":
    "Yes. You can cancel from your billing portal anytime. Your access remains active until the end of the current paid period.",
  "pages.pricing.faq.1.q": "What if I choose the wrong plan length?",
  "pages.pricing.faq.1.a":
    "Choose based on your timeline: final weeks = shorter plans, broader prep runway = longer plans. All plans use the same core study system.",
  "pages.pricing.faq.2.q": "Do you offer refunds?",
  "pages.pricing.faq.2.a":
    "Please review the refund policy before checkout. We keep pricing and billing terms transparent so you can choose with confidence.",
  "pages.pricing.faq.3.q": "What is the difference between plans?",
  "pages.pricing.faq.3.a":
    "The core platform is the same; plan duration changes your runway. Longer plans are best when you need deeper coverage and repetition before exam day.",
  "pages.pricing.faq.4.q": "How long do I keep access?",
  "pages.pricing.faq.4.a": "Access lasts for your selected billing period and renews automatically unless cancelled.",

  "pages.pricing.trustSection.title": "Student outcomes and trust",
  "pages.pricing.trustSection.lead":
    "Built for realistic nursing decision-making with clinically grounded rationales and targeted review loops.",
  "pages.pricing.trustSection.quote0": "I stopped random reviewing and finally knew what to focus on each week.",
  "pages.pricing.trustSection.quote1":
    "The readiness trend helped me decide when to switch from content review to timed sets.",
  "pages.pricing.trustSection.quote2":
    "Questions felt close to exam pressure, but with clearer next steps after every session.",

  "pages.pricing.faqSection.title": "Pricing FAQ",

  "pages.pricing.billing.cancelComfort":
    "Cancel anytime. Choose the shortest plan that matches your exam timeline and comfort level.",

  "pages.pricing.tier.freeBadge": "Free",
  "pages.pricing.tier.freeTitle": "Starter access",
  "pages.pricing.tier.freeDesc": "Try exam-style questions and preview how NurseNest works before subscribing.",
  "pages.pricing.tier.freeB0": "Starter question sets",
  "pages.pricing.tier.freeB1": "Basic rationale visibility",
  "pages.pricing.tier.freeB2": "No payment required",
  "pages.pricing.tier.freeCta": "Start practicing",
  "pages.pricing.tier.coreBadge": "Core",
  "pages.pricing.tier.coreCta": "Unlock full access",
  "pages.pricing.tier.premiumBadge": "Premium · Most popular",
  "pages.pricing.tier.premiumSub": "Best if you want the longest runway and lowest per-month cost.",
  "pages.pricing.tier.premiumB0": "Full lessons, questions, and exam prep loop",
  "pages.pricing.tier.premiumB1": "Adaptive weak-area and readiness guidance",
  "pages.pricing.tier.premiumB2": "Best value per month for long prep",
  "pages.pricing.tier.premiumCta": "Start studying now",

  "pages.pricing.plansUpdating":
    "Plans for this pathway are updating. Explore free questions now, then return to unlock full access.",

  "pages.pricing.productPreview.title": "Product preview",
  "pages.pricing.productPreview.lead": "What you actually use each study day.",
  "pages.pricing.productPreview.0.title": "Question UI",
  "pages.pricing.productPreview.0.body": "Timed, exam-style question flow with clear prompt and choices.",
  "pages.pricing.productPreview.1.title": "Rationales",
  "pages.pricing.productPreview.1.body": "Plain-language reasoning for correct and incorrect answers.",
  "pages.pricing.productPreview.2.title": "CAT / Exams",
  "pages.pricing.productPreview.2.body": "Adaptive and timed testing to practice pressure and pacing.",
  "pages.pricing.productPreview.3.title": "Dashboard",
  "pages.pricing.productPreview.3.body": "Weak-area tracking, readiness trends, and next-best actions.",

  "pages.pricing.libraryScale":
    "Library scale (platform-wide): {{count}}+ items in rotation, plus lessons and cards. Exact pool depends on your tier.",

  "pages.pricing.examChoose.title": "Choose your exam",

  "pages.pricing.compare.uworldCaption": "NurseNest vs UWorld-style qbank",
};

const raw = fs.readFileSync(enPath, "utf8");
const bundle = JSON.parse(raw);
let added = 0;
let updated = 0;
for (const [k, v] of Object.entries(patch)) {
  if (bundle[k] === undefined) {
    bundle[k] = v;
    added++;
  } else if (bundle[k] !== v) {
    bundle[k] = v;
    updated++;
  }
}
fs.writeFileSync(enPath, JSON.stringify(bundle));
console.log(`pricing UI i18n: added ${added}, updated ${updated}, keys in patch ${Object.keys(patch).length}`);
