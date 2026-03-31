/**
 * Merge conversion + trust + pricing comparison keys into en.json.
 * Run: node scripts/patch-conversion-trust-i18n.mjs
 */
import fs from "node:fs";

const path = new URL("../public/i18n/en.json", import.meta.url).pathname;
const o = JSON.parse(fs.readFileSync(path, "utf8"));

const patch = {
  "home.trust.sectionTitle": "Trust and platform scope",
  "home.trust.barLine1": "Thousands of questions across RN, PN, NP, and allied health",
  "home.trust.barLine2": "Built for NCLEX and Canadian licensing exams",
  "home.trust.barLine3": "Used by nursing students across Canada and the US",
  "home.trust.statQuestions": "Practice questions",
  "home.trust.statLessons": "Lessons",
  "home.trust.statCategories": "Topic categories",
  "home.trust.categoriesFallback": "50+",
  "home.trust.whyTitle": "Why NurseNest works",
  "home.trust.why1Title": "Exam-style questions",
  "home.trust.why1Body": "Stems and distractors mirror what you see on test day, not generic trivia.",
  "home.trust.why2Title": "Rationales that teach",
  "home.trust.why2Body": "Each explanation ties back to clinical judgment so you learn the why, not just the letter.",
  "home.trust.why3Title": "Adaptive readiness",
  "home.trust.why3Body": "Focus on weak categories and track momentum as your exam date approaches.",
  "home.trust.urgencyLine": "New questions added weekly. High-yield exam topics updated regularly.",

  "components.homeConversionSections.sampleUnlockRationaleCta": "Unlock full explanation",
  "components.homeConversionSections.sampleUnlockRationaleHint":
    "Teaching rationale is available for subscribers. Unlock to see why each option is right or wrong.",
  "components.homeConversionSections.sampleUnlockFullExplanationsCta": "Unlock full explanations",
  "components.homeConversionSections.sampleUnlockFullExplanationsSub": "Get every rationale in the bank plus timed exams and lessons.",

  "pages.pricing.compare.title": "NurseNest vs UWorld vs Archer",
  "pages.pricing.compare.colUw": "UWorld",
  "pages.pricing.compare.colArcher": "Archer",
  "pages.pricing.compare.uw0": "Yes (nursing focus)",
  "pages.pricing.compare.uw1": "Strong; exam prep brand standard",
  "pages.pricing.compare.uw2": "Yes; performance reports",
  "pages.pricing.compare.uw3": "Yes; clinical focus",
  "pages.pricing.compare.uw4": "Yes; NCLEX simulations",
  "pages.pricing.compare.arch0": "Yes",
  "pages.pricing.compare.arch1": "Concise; varies by package",
  "pages.pricing.compare.arch2": "Basic to moderate",
  "pages.pricing.compare.arch3": "Yes",
  "pages.pricing.compare.arch4": "Add-on or partner tools",

  "pages.pricing.reassurance.cancel": "Cancel anytime before renewal. No surprise lock-ins.",
  "pages.pricing.reassurance.access": "Instant access to your plan right after checkout.",

  "pages.signup.optionalDetails": "Optional: personalize your study plan",
};

let n = 0;
for (const [k, v] of Object.entries(patch)) {
  if (o[k] !== v) {
    o[k] = v;
    n += 1;
  }
}

fs.writeFileSync(path, JSON.stringify(o));
console.log(`Patched ${n} keys (merged ${Object.keys(patch).length} definitions).`);
