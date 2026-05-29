import {
  GENERATED_SCREENSHOT_FALLBACKS as FALLBACK_SHOTS,
  GENERATED_SCREENSHOT_PATHS as SHOTS,
} from "@/lib/marketing/generated-screenshot-registry";

export const SI_CONV_MARKETING = {
  shortLabel: "SI/CONV Clinical Reasoning Support",
  title: "SI/CONV Clinical Reasoning Support",
  eyebrow: "Clinical judgment framework",
  shortBenefit:
    "Structured guidance that helps learners identify cues, understand the clinical issue, and see why each answer choice matters.",
  intro:
    "SI/CONV helps you think through nursing questions the way experienced nurses approach patient care.",
  situationTitle: "Situation Identification (SI)",
  situationBullets: [
    "What is happening?",
    "What assessment findings matter?",
    "What cues are important?",
  ],
  convTitle: "Clinical Overview & Nursing Verification (CONV)",
  convBullets: [
    "What is the likely clinical issue?",
    "What priorities should be addressed?",
    "What nursing actions are appropriate?",
    "Why are incorrect answers incorrect?",
  ],
  outcome:
    "SI/CONV is designed to strengthen clinical judgment, prioritization, delegation, and NCLEX-style reasoning.",
  whatYouGetTitle: "Clinical Reasoning Support (SI/CONV)",
  whatYouGetLead: "Learn how to think like a nurse, not just memorize answers.",
  whatYouGetBullets: [
    "Identify patient problems",
    "Recognize important assessment findings",
    "Prioritize interventions",
    "Improve clinical judgment",
    "Strengthen NCLEX-style decision-making",
  ],
  seoKeywords:
    "clinical reasoning for nurses, nursing clinical judgment, NCLEX clinical reasoning, how to think like a nurse, nursing prioritization practice, nursing decision-making framework",
  screenshot: SHOTS.coreFlashcards,
  fallbackScreenshot: FALLBACK_SHOTS.coreFlashcards,
  screenshotAlt:
    "NurseNest question workflow showing a question, SI/CONV clinical reasoning support, and teaching rationale",
} as const;

