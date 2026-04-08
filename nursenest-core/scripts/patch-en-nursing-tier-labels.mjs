/**
 * One-time patch: country-aware nursing tier copy in the English marketing bundle.
 * Run: node scripts/patch-en-nursing-tier-labels.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, "../public/i18n/en.json");

const patch = {
  "nav.examStrip.pnUS": "NCLEX-PN · LPN",
  "nav.examStrip.pnCA": "REx-PN · RPN",

  "home.quickEntry.rnQuestions": "NCLEX-RN questions",
  "home.quickEntry.pnQuestionsUS": "NCLEX-PN (LPN) questions",
  "home.quickEntry.pnQuestionsCA": "REx-PN (RPN) questions",

  "home.landing.heroPath.rnTitle": "NCLEX-RN",
  "home.landing.heroPath.pnTitleUS": "NCLEX-PN (LPN)",
  "home.landing.heroPath.pnTitleCA": "REx-PN (RPN)",
  "home.landing.heroPath.pnDescUS": "NCLEX-PN items and lessons scoped to LPN practice.",
  "home.landing.heroPath.pnDescCA": "REx-PN track with Canadian RPN scope.",

  "home.landing.pathways.rnTitle": "NCLEX-RN",
  "home.landing.pathways.rnDesc": "NCLEX-RN licensing tracks for US and Canadian RN candidates.",
  "home.landing.pathways.pnTitleUS": "NCLEX-PN (LPN)",
  "home.landing.pathways.pnTitleCA": "REx-PN (RPN)",
  "home.landing.pathways.pnDescUS": "NCLEX-PN with rationales and lessons for LPN candidates.",
  "home.landing.pathways.pnDescCA": "REx-PN-aligned practice for Canadian RPN candidates.",

  "home.region.usDesc":
    "Showing NCLEX-RN, NCLEX-PN (LPN), and US NP board content with US measurements (°F, lbs, in) and LPN terminology.",
  "home.region.caDesc":
    "Showing NCLEX-RN, REx-PN (RPN), and Canadian NP/CNPLE content with Canadian measurements (°C, kg, cm) and RPN terminology.",

  "components.footer.pnExamPrepUs": "NCLEX-PN prep (LPN)",
  "components.footer.pnExamPrepCa": "REx-PN prep (RPN)",

  "pages.pricing.examCard.rnUS": "NCLEX-RN",
  "pages.pricing.examCard.rnCA": "NCLEX-RN",
  "pages.pricing.examCard.pnUS": "NCLEX-PN (LPN)",
  "pages.pricing.examCard.pnCA": "REx-PN (RPN)",

  "pages.publicQuestionBank.cardPnUs.title": "NCLEX-PN (LPN)",
  "pages.publicQuestionBank.cardPnUs.includes":
    "PN-level scope, prioritization, and medication safety with rationales tied to LPN practice.",
  "pages.publicQuestionBank.cardPnCa.title": "REx-PN (RPN)",
  "pages.publicQuestionBank.cardPnCa.includes":
    "REx-PN–scoped practice with Canadian RPN context—not recycled US-only copy.",

  "pages.home.metaTitleUS": "NurseNest | NCLEX-RN & NCLEX-PN (LPN) — practice questions & lessons",
  "pages.home.metaTitleCA": "NurseNest | NCLEX-RN & REx-PN (RPN) — practice questions & lessons",
  "pages.home.metaDescriptionUS":
    "NurseNest: NCLEX-RN and NCLEX-PN (LPN) practice questions, clinical lessons, and mock exams for US nursing candidates—plus NP and allied tracks.",
  "pages.home.metaDescriptionCA":
    "NurseNest: NCLEX-RN and REx-PN (RPN) practice questions, clinical lessons, and mock exams for Canadian nursing candidates—plus NP and allied tracks.",

  "pages.publicLessons.metaTitleUS": "Nursing exam lessons | NCLEX-RN, NCLEX-PN (LPN), NP | NurseNest",
  "pages.publicLessons.metaTitleCA": "Nursing exam lessons | NCLEX-RN, REx-PN (RPN), NP | NurseNest",
  "pages.publicLessons.metaDescriptionUS":
    "Browse pathway-scoped clinical lessons for US nursing exams: NCLEX-RN, NCLEX-PN (LPN), and NP tracks. Previews are public; full depth unlocks with a matching plan.",
  "pages.publicLessons.metaDescriptionCA":
    "Browse pathway-scoped clinical lessons for Canadian nursing exams: NCLEX-RN, REx-PN (RPN), and NP tracks. Previews are public; full depth unlocks with a matching plan.",

  "pages.publicQuestionBank.metaTitleUS": "NCLEX-RN & NCLEX-PN (LPN) practice questions | NurseNest",
  "pages.publicQuestionBank.metaTitleCA": "NCLEX-RN & REx-PN (RPN) practice questions | NurseNest",
  "pages.publicQuestionBank.metaDescriptionUS":
    "Public overview of the NurseNest nursing question bank: NCLEX-RN, NCLEX-PN (LPN), NP, and allied tracks for the United States. Sign up to practice in the app.",
  "pages.publicQuestionBank.metaDescriptionCA":
    "Public overview of the NurseNest nursing question bank: NCLEX-RN, REx-PN (RPN), NP, and allied tracks for Canada. Sign up to practice in the app.",

  "pages.publicPracticeExams.metaTitleUS": "NCLEX-RN & NCLEX-PN (LPN) practice exams and mock tests | NurseNest",
  "pages.publicPracticeExams.metaTitleCA": "NCLEX-RN & REx-PN (RPN) practice exams and mock tests | NurseNest",
  "pages.publicPracticeExams.metaDescriptionUS":
    "Timed practice exams for US nursing candidates (NCLEX-RN, NCLEX-PN / LPN, NP). Create an account to launch mocks in the app.",
  "pages.publicPracticeExams.metaDescriptionCA":
    "Timed practice exams for Canadian nursing candidates (NCLEX-RN, REx-PN / RPN, NP). Create an account to launch mocks in the app.",

  "pages.publicFlashcardsHub.metaTitleUS": "NCLEX-RN & NCLEX-PN (LPN) nursing flashcards | NurseNest",
  "pages.publicFlashcardsHub.metaTitleCA": "NCLEX-RN & REx-PN (RPN) nursing flashcards | NurseNest",
  "pages.publicFlashcardsHub.metaDescriptionUS":
    "Topic-organized nursing flashcards for NCLEX-RN and NCLEX-PN (LPN), plus clinical review. Sample cards here; full study inside NurseNest.",
  "pages.publicFlashcardsHub.metaDescriptionCA":
    "Topic-organized nursing flashcards for NCLEX-RN and REx-PN (RPN), plus clinical review. Sample cards here; full study inside NurseNest.",

  "home.landing.faq.a1":
    "Use the country toggle, then open the card for NCLEX-RN, your PN exam (NCLEX-PN in the US or REx-PN in Canada), NP, or Allied Health. Each pathway opens the matching question bank and lessons.",
  "home.landing.why.why1Body":
    "NCLEX-RN, practical nursing (NCLEX-PN in the US or REx-PN in Canada), NP, and allied pools stay separated. Labels follow the registration you select.",

  "home.conversion.why1Body":
    "NCLEX-RN, practical nursing (NCLEX-PN in the US or REx-PN in Canada), NP, and allied pools stay separated. You should not be drilling US delegation language the night before a Canadian sit.",

  "pages.signup.examFocus.nclexRnUs": "NCLEX-RN",
  "pages.signup.examFocus.nclexRnCa": "NCLEX-RN",
  "pages.signup.examFocus.nclexPnUs": "NCLEX-PN (LPN)",
  "pages.signup.examFocus.rexPnCa": "REx-PN (RPN)",
};

const raw = fs.readFileSync(enPath, "utf8");
const bundle = JSON.parse(raw);
Object.assign(bundle, patch);
fs.writeFileSync(enPath, JSON.stringify(bundle));
console.log(`Patched ${Object.keys(patch).length} nursing-tier keys in ${enPath}`);
