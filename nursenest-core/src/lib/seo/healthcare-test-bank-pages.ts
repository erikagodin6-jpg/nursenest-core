import { CNPLE_INVENTORY } from "@/lib/marketing/cnple-inventory-metrics";
import { getSnapshotCounts } from "@/lib/navigation/country-exam-readiness-snapshot";

export type HealthcareTestBankPageLink = {
  label: string;
  href: string;
  note: string;
};

export type HealthcareTestBankPageSection = {
  heading: string;
  body: readonly string[];
};

export type HealthcareTestBankPageConfig = {
  id: string;
  pathwayId: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  inventoryClaim: string;
  inventorySource: string;
  examSpecificPositioning: string;
  premiumCta: HealthcareTestBankPageLink;
  freePracticeCta: HealthcareTestBankPageLink;
  links: {
    questions: HealthcareTestBankPageLink;
    cat: HealthcareTestBankPageLink;
    flashcards: HealthcareTestBankPageLink;
    lessons: HealthcareTestBankPageLink;
    pricing: HealthcareTestBankPageLink;
  };
  sections: readonly HealthcareTestBankPageSection[];
  faqs: readonly { question: string; answer: string }[];
  courseName: string;
  courseDescription: string;
};

const rnSnapshot = getSnapshotCounts("us-rn-nclex-rn");
const rexSnapshot = getSnapshotCounts("ca-rpn-rex-pn");
const fnpSnapshot = getSnapshotCounts("us-np-fnp");
const agpcnpSnapshot = getSnapshotCounts("us-np-agpcnp");

const sharedCta = (label: string, href: string, note: string): HealthcareTestBankPageLink => ({
  label,
  href,
  note,
});

export const HEALTHCARE_TEST_BANK_PAGES = [
  {
    id: "us-rn-nclex-rn-test-bank",
    pathwayId: "us-rn-nclex-rn",
    path: "/us/rn/nclex-rn/test-bank",
    title: "NCLEX-RN Test Bank — Clinical Judgment Questions",
    description: "NCLEX-RN test bank with clinical judgment questions, CAT practice, rationales, flashcards, lessons, and remediation.",
    h1: "NCLEX-RN test bank for clinical judgment practice",
    eyebrow: "NCLEX-RN question bank",
    lead:
      "Build exam stamina with RN-scoped questions that connect clinical judgment, prioritization, SATA, pharmacology, and weak-area remediation.",
    primaryKeyword: "NCLEX RN test bank",
    secondaryKeywords: [
      "NCLEX RN practice questions",
      "NCLEX question bank",
      "NCLEX CAT practice",
      "Next Gen NCLEX clinical judgment",
    ],
    inventoryClaim: `${rnSnapshot.questions} RN-scoped questions in the committed public inventory snapshot.`,
    inventorySource: "src/config/pathway-readiness-snapshot.json",
    examSpecificPositioning:
      "NCLEX-RN preparation needs more than answer drills: candidates need to practice recognizing the priority, choosing safe first actions, and reading rationales that explain why plausible distractors are unsafe.",
    premiumCta: sharedCta("Start premium NCLEX-RN practice", "/pricing", "Unlock timed sets, remediation, flashcards, and adaptive practice."),
    freePracticeCta: sharedCta("Try NCLEX-RN practice questions", "/us/rn/nclex-rn/questions", "Start with the public RN question hub."),
    links: {
      questions: sharedCta("NCLEX-RN practice questions", "/us/rn/nclex-rn/questions", "Question-bank entry point with rationales."),
      cat: sharedCta("NCLEX-RN CAT exam practice", "/us/rn/nclex-rn/cat", "Adaptive practice for NCLEX-style pacing."),
      flashcards: sharedCta("NCLEX-RN flashcards", "/us/rn/nclex-rn/flashcards", "Spaced recall for high-yield concepts."),
      lessons: sharedCta("NCLEX-RN lessons", "/us/rn/nclex-rn/lessons", "Review weak areas after missed questions."),
      pricing: sharedCta("NCLEX-RN pricing", "/us/rn/nclex-rn/pricing", "Compare RN access options."),
    },
    sections: [
      {
        heading: "What the NCLEX-RN test bank covers",
        body: [
          "The NCLEX-RN bank is organized around safe registered nursing decisions: clinical judgment, prioritization, delegation within RN scope, medication safety, health promotion, psychosocial integrity, and physiological adaptation.",
          "Questions are designed to make the rationale useful after the attempt. A correct answer should reinforce the safety rule; an incorrect answer should point you toward a lesson, flashcard, or follow-up question set that closes the gap.",
        ],
      },
      {
        heading: "How this supports CAT preparation",
        body: [
          "CAT success depends on consistency under changing difficulty. The test bank gives you focused practice first, then points you toward adaptive sessions once you have enough breadth to handle mixed-topic decision making.",
          "Use topic sets for diagnosis, mixed sets for transfer, and CAT sessions for pacing. That loop prevents false confidence from repeating only familiar topics.",
        ],
      },
      {
        heading: "Best use for exam week",
        body: [
          "In the final week, use shorter mixed sets to maintain accuracy, review rationales for missed items, and reserve full CAT practice for stamina rather than cramming new content.",
          "The goal is not raw volume alone. The highest-yield pattern is question attempt, rationale review, targeted lesson, flashcard reinforcement, then a second mixed set to prove transfer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this an NCLEX-RN test bank or just a list of questions?",
        answer:
          "It is a pathway-scoped NCLEX-RN question bank connected to rationales, CAT practice, flashcards, lessons, and remediation links so missed questions can turn into targeted review.",
      },
      {
        question: "Does the NCLEX-RN test bank include Next Gen clinical judgment practice?",
        answer:
          "The RN pathway emphasizes clinical judgment reasoning, prioritization, safety, and rationale review. Item availability can change as the bank grows, so NurseNest avoids unsupported claims about fixed official item counts.",
      },
      {
        question: "Should I use CAT practice or question-bank sets first?",
        answer:
          "Use topic and mixed question-bank sets to build coverage first, then use CAT practice to test pacing and decision consistency under adaptive difficulty.",
      },
    ],
    courseName: "NCLEX-RN Test Bank and Adaptive Practice",
    courseDescription:
      "RN licensure preparation with practice questions, rationales, CAT practice, flashcards, lessons, and weak-area remediation.",
  },
  {
    id: "ca-rpn-rex-pn-test-bank",
    pathwayId: "ca-rpn-rex-pn",
    path: "/canada/rpn/rex-pn/test-bank",
    title: "REx-PN Test Bank — Canadian RPN Practice",
    description: "REx-PN test bank for Canadian RPN prep with client-needs questions, rationales, CAT practice, lessons, and flashcards.",
    h1: "REx-PN test bank for Canadian practical nurses",
    eyebrow: "REx-PN question bank",
    lead:
      "Prepare for practical nursing decisions with RPN-scoped questions that connect client needs, safety, pharmacology, delegation limits, and rationales.",
    primaryKeyword: "REx-PN test bank",
    secondaryKeywords: [
      "REx-PN practice questions",
      "RPN question bank",
      "REx-PN CAT exam",
      "Canadian practical nursing exam prep",
    ],
    inventoryClaim: `${rexSnapshot.questions} REx-PN/RPN-scoped questions in the committed public inventory snapshot.`,
    inventorySource: "src/config/pathway-readiness-snapshot.json",
    examSpecificPositioning:
      "REx-PN practice must stay inside Canadian practical nursing scope. The bank emphasizes client-needs categories, stable-versus-unstable cues, medication risk, therapeutic communication, and when to escalate to the RN or provider.",
    premiumCta: sharedCta("Start premium REx-PN practice", "/pricing", "Unlock RPN sets, CAT practice, remediation, and study tools."),
    freePracticeCta: sharedCta("Try REx-PN practice questions", "/canada/rpn/rex-pn/questions", "Start with the public RPN question hub."),
    links: {
      questions: sharedCta("REx-PN practice questions", "/canada/rpn/rex-pn/questions", "Client-needs practice with rationales."),
      cat: sharedCta("REx-PN CAT exam practice", "/canada/rpn/rex-pn/cat", "Adaptive practice for exam stamina."),
      flashcards: sharedCta("REx-PN flashcards", "/canada/rpn/rex-pn/flashcards", "Recall for medications, safety, and fundamentals."),
      lessons: sharedCta("REx-PN lessons", "/canada/rpn/rex-pn/lessons", "Target weak topics after practice sets."),
      pricing: sharedCta("REx-PN pricing", "/canada/rpn/rex-pn/pricing", "Compare RPN access options."),
    },
    sections: [
      {
        heading: "What makes the REx-PN bank different",
        body: [
          "REx-PN questions should not be copied from RN-level assumptions. This bank is written around practical nursing scope, Canadian client-needs language, safe escalation, and realistic bedside decisions.",
          "Each rationale is meant to sharpen a rule you can reuse: when a client cue changes priority, when medication risk matters most, and when therapeutic communication is safer than premature action.",
        ],
      },
      {
        heading: "How to use the bank with CAT practice",
        body: [
          "Start with client-needs and fundamentals sets, then move into mixed practice once your accuracy is less dependent on the topic label.",
          "Use CAT practice after you have built enough coverage to handle shifting difficulty. The test bank remains the remediation base when the adaptive session exposes weak areas.",
        ],
      },
      {
        heading: "Canadian RPN remediation loop",
        body: [
          "After a missed question, review the rationale, open the linked lesson, drill the corresponding flashcard idea, and retest with a mixed set rather than repeating the same single cue.",
          "That loop keeps preparation practical: the focus is not trivia recall but safe decisions inside the RPN role.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is LVN pricing different from RPN pricing?",
        answer:
          "No. LVN is treated as the same pricing tier as RPN/LPN access in NurseNest, so the learner should see the same subscription price for equivalent practical nursing access.",
      },
      {
        question: "Does this REx-PN test bank include CAT practice?",
        answer:
          "The REx-PN pathway links question-bank practice with a CAT practice surface so candidates can combine focused remediation with adaptive exam pacing.",
      },
      {
        question: "Are these questions scoped for Canadian RPN practice?",
        answer:
          "Yes. The page and links are scoped to the Canadian RPN/REx-PN pathway rather than RN-level practice or unrelated US nursing exams.",
      },
    ],
    courseName: "REx-PN Test Bank and CAT Practice",
    courseDescription:
      "Canadian practical nursing exam preparation with REx-PN practice questions, rationales, CAT practice, lessons, and flashcards.",
  },
  {
    id: "ca-np-cnple-test-bank",
    pathwayId: "ca-np-cnple",
    path: "/canada/np/cnple/test-bank",
    title: "CNPLE Test Bank — Canadian NP Practice",
    description: "CNPLE test bank for Canadian NP prep with NP-level questions, LOFT simulation, rationales, lessons, and flashcards.",
    h1: "CNPLE test bank for Canadian nurse practitioner prep",
    eyebrow: "Canadian NP question bank",
    lead:
      "Practice Canadian NP-level reasoning across assessment, diagnostics, prescribing safety, follow-up, and professional judgment.",
    primaryKeyword: "CNPLE test bank",
    secondaryKeywords: [
      "CNPLE practice questions",
      "Canadian NP question bank",
      "CNPLE case studies",
      "CNPLE LOFT simulation",
    ],
    inventoryClaim: `${CNPLE_INVENTORY.caQuestionsLong}, including ${CNPLE_INVENTORY.cnpleTaggedLong}.`,
    inventorySource: "src/lib/marketing/cnple-inventory-metrics.ts",
    examSpecificPositioning:
      "CNPLE preparation is NP-level and Canadian. It emphasizes autonomous assessment, differential diagnosis, therapeutic management, prescribing safety, and the regulatory context that differs from US NP board prep.",
    premiumCta: sharedCta("Start premium CNPLE practice", "/pricing", "Unlock Canadian NP practice, simulation, remediation, and study tools."),
    freePracticeCta: sharedCta("Try CNPLE practice questions", "/canada/np/cnple/questions", "Start with the Canadian NP question hub."),
    links: {
      questions: sharedCta("CNPLE practice questions", "/canada/np/cnple/questions", "Canadian NP questions with rationales."),
      cat: sharedCta("CNPLE LOFT simulation", "/canada/np/cnple/simulation", "CNPLE uses LOFT, not CAT; simulation is the correct exam-format link."),
      flashcards: sharedCta("CNPLE flashcards", "/canada/np/cnple/flashcards", "Canadian NP recall and clinical reasoning cards."),
      lessons: sharedCta("CNPLE lessons", "/canada/np/cnple/lessons", "Review diagnostics, prescribing, and guideline topics."),
      pricing: sharedCta("CNPLE pricing", "/canada/np/cnple/pricing", "Compare NP access options."),
    },
    sections: [
      {
        heading: "What the CNPLE bank is built to measure",
        body: [
          "The CNPLE bank is positioned around Canadian NP decision-making, not RN licensure and not US board substitution. Questions focus on assessment, differential diagnosis, investigation selection, prescribing safety, follow-up, and professional obligations.",
          "The inventory language separates broad Canadian-aligned NP practice questions from the explicitly CNPLE-tagged subset so the page can be useful without overstating official exam coverage.",
        ],
      },
      {
        heading: "LOFT simulation, not CAT",
        body: [
          "CNPLE uses linear on-the-fly testing rather than NCLEX-style CAT. For that reason, this page links to the CNPLE simulation surface as the exam-format practice route.",
          "The workflow is similar in spirit to adaptive remediation: diagnose weak domains with question sets, build guideline-aligned reasoning with lessons, then test stamina with simulation.",
        ],
      },
      {
        heading: "Canadian NP remediation loop",
        body: [
          "Missed questions should point to the exact clinical reasoning gap: guideline recall, prescribing contraindication, differential diagnosis, diagnostic test choice, follow-up timing, or scope/regulatory judgment.",
          "The strongest CNPLE preparation connects question attempts to lessons and flashcards instead of treating rationales as passive explanations.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is CNPLE practice the same as US FNP board prep?",
        answer:
          "No. CNPLE preparation must use Canadian NP context, including Canadian guideline framing, regulatory language, prescribing safety, and NP-level autonomous clinical reasoning.",
      },
      {
        question: "Why does this page link to simulation instead of CAT?",
        answer:
          "CNPLE uses LOFT rather than CAT. NurseNest links CNPLE candidates to simulation practice because it better matches the fixed-length exam-format need.",
      },
      {
        question: "Can NurseNest claim an official CNPLE question count?",
        answer:
          "No. NurseNest reports its own inventory counts and distinguishes Canadian-aligned NP questions from explicitly CNPLE-tagged questions. It does not claim an official regulator item count.",
      },
    ],
    courseName: "CNPLE Test Bank and Canadian NP Simulation",
    courseDescription:
      "Canadian nurse practitioner exam preparation with CNPLE-aligned questions, LOFT simulation, rationales, flashcards, and lessons.",
  },
  {
    id: "us-np-fnp-test-bank",
    pathwayId: "us-np-fnp",
    path: "/us/np/fnp/test-bank",
    title: "FNP Test Bank & Practice Questions | NurseNest",
    description: "FNP test bank with primary care questions, diagnostics, prescribing safety, rationales, flashcards, lessons, and remediation.",
    h1: "FNP test bank for primary care clinical reasoning",
    eyebrow: "FNP question bank",
    lead:
      "Prepare for family nurse practitioner exams with case-based primary care questions that connect diagnosis, management, and safe prescribing.",
    primaryKeyword: "FNP test bank",
    secondaryKeywords: [
      "FNP practice questions",
      "family nurse practitioner question bank",
      "FNP clinical judgment cases",
      "FNP pharmacology questions",
    ],
    inventoryClaim: `${fnpSnapshot.questions} FNP-scoped questions in the committed public inventory snapshot.`,
    inventorySource: "src/config/pathway-readiness-snapshot.json",
    examSpecificPositioning:
      "FNP preparation spans lifespan primary care. The bank emphasizes common outpatient presentations, prevention, chronic disease management, diagnostics, prescribing safety, and escalation decisions.",
    premiumCta: sharedCta("Start premium FNP practice", "/pricing", "Unlock FNP practice, remediation, flashcards, and study tools."),
    freePracticeCta: sharedCta("Try FNP practice questions", "/us/np/fnp/questions", "Start with the FNP question hub."),
    links: {
      questions: sharedCta("FNP practice questions", "/us/np/fnp/questions", "Primary-care question sets with rationales."),
      cat: sharedCta("FNP CAT practice", "/us/np/fnp/cat", "Adaptive-style start surface where available for this pathway."),
      flashcards: sharedCta("FNP flashcards", "/us/np/fnp/flashcards", "Spaced recall for guidelines, meds, and diagnostics."),
      lessons: sharedCta("FNP lessons", "/us/np/fnp/lessons", "Review weak primary-care domains."),
      pricing: sharedCta("FNP pricing", "/us/np/fnp/pricing", "Compare NP access options."),
    },
    sections: [
      {
        heading: "What the FNP bank emphasizes",
        body: [
          "The FNP pathway is broad by design: pediatrics, adult primary care, older adults, reproductive health, mental health, prevention, and chronic disease management all appear in realistic outpatient decision-making.",
          "Questions are written to expose reasoning gaps, not just memorized facts. A good rationale should explain the next safe step, the distractor trap, and the follow-up action that matters clinically.",
        ],
      },
      {
        heading: "How FNP candidates should sequence practice",
        body: [
          "Begin with focused sets in weaker systems, then switch to mixed primary-care cases so topic labels do not give away the answer.",
          "Use flashcards for high-frequency guideline details and lessons for deeper clinical frameworks. Practice questions should remain the proving ground for transfer.",
        ],
      },
      {
        heading: "Remediation that matches primary care",
        body: [
          "Primary care errors often come from under-triage, over-testing, missed contraindications, or incomplete follow-up. The bank is structured to point each miss toward the most useful next review step.",
          "That makes the test bank a study loop rather than a detached question list.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the FNP test bank only for one US board exam?",
        answer:
          "It is scoped to family nurse practitioner primary-care reasoning and supports FNP exam preparation without claiming affiliation with any board or official item bank.",
      },
      {
        question: "Does the FNP bank include prescribing safety?",
        answer:
          "Yes. Prescribing safety, contraindications, monitoring, and patient-specific medication decisions are part of the FNP clinical reasoning loop.",
      },
      {
        question: "How should I use FNP lessons with the question bank?",
        answer:
          "Use lessons after missed or uncertain questions, then return to mixed practice to prove that the reasoning transfers to a new case.",
      },
    ],
    courseName: "FNP Test Bank and Primary Care Practice",
    courseDescription:
      "Family nurse practitioner exam preparation with primary care questions, rationales, lessons, flashcards, and remediation.",
  },
  {
    id: "us-np-agpcnp-test-bank",
    pathwayId: "us-np-agpcnp",
    path: "/us/np/agpcnp/test-bank",
    title: "AGPCNP Test Bank — Adult-Gerontology NP",
    description: "AGPCNP test bank with adult-gerontology cases, diagnostics, prescribing safety, rationales, lessons, and remediation.",
    h1: "AGPCNP test bank for adult-gerontology practice",
    eyebrow: "AGPCNP question bank",
    lead:
      "Practice adult-gerontology NP reasoning across acute changes, chronic disease, diagnostics, pharmacology, and safe management decisions.",
    primaryKeyword: "AGPCNP test bank",
    secondaryKeywords: [
      "AGPCNP practice questions",
      "adult gerontology NP question bank",
      "AGPCNP clinical reasoning",
      "AGPCNP pharmacology questions",
    ],
    inventoryClaim: `${agpcnpSnapshot.questions} AGPCNP-scoped questions in the committed public inventory snapshot.`,
    inventorySource: "src/config/pathway-readiness-snapshot.json",
    examSpecificPositioning:
      "AGPCNP preparation needs adult-gerontology specificity: multimorbidity, atypical presentations, medication risk, diagnostic interpretation, acute deterioration, and long-term management priorities.",
    premiumCta: sharedCta("Start premium AGPCNP practice", "/pricing", "Unlock AGPCNP practice, remediation, flashcards, and study tools."),
    freePracticeCta: sharedCta("Try AGPCNP practice questions", "/us/np/agpcnp/questions", "Start with the AGPCNP question hub."),
    links: {
      questions: sharedCta("AGPCNP practice questions", "/us/np/agpcnp/questions", "Adult-gerontology cases with rationales."),
      cat: sharedCta("AGPCNP CAT practice", "/us/np/agpcnp/cat", "Adaptive-style start surface where available for this pathway."),
      flashcards: sharedCta("AGPCNP flashcards", "/us/np/agpcnp/flashcards", "Recall for adult-gerontology decisions."),
      lessons: sharedCta("AGPCNP lessons", "/us/np/agpcnp/lessons", "Review acute and chronic adult-care domains."),
      pricing: sharedCta("AGPCNP pricing", "/us/np/agpcnp/pricing", "Compare NP access options."),
    },
    sections: [
      {
        heading: "What the AGPCNP bank emphasizes",
        body: [
          "AGPCNP practice is not simply adult FNP content. The bank focuses on adult and older-adult presentations, chronic disease complexity, frailty, diagnostic interpretation, and medication decisions where comorbidity changes the safest next step.",
          "Questions are designed to surface whether the learner can distinguish stable chronic management from urgent deterioration and choose a management plan consistent with adult-gerontology scope.",
        ],
      },
      {
        heading: "Adult-gerontology remediation pattern",
        body: [
          "When a question is missed, the useful follow-up is often a clinical framework: interpreting labs, adjusting therapy for renal function, recognizing atypical symptoms, or prioritizing risk in multimorbidity.",
          "The page links practice questions with lessons and flashcards so remediation stays specific instead of becoming broad rereading.",
        ],
      },
      {
        heading: "Using mixed cases before exam day",
        body: [
          "Mixed AGPCNP sets are especially important because real exam cases rarely announce whether the issue is cardiology, pulmonary, endocrine, renal, or geriatric safety.",
          "Use focused practice to build baseline accuracy, then mixed sets and adaptive-style practice to test transfer and pacing.",
        ],
      },
    ],
    faqs: [
      {
        question: "How is AGPCNP practice different from FNP practice?",
        answer:
          "AGPCNP practice focuses on adult and older-adult care, including multimorbidity, acute changes, chronic disease management, diagnostic interpretation, and medication risk in adult-gerontology populations.",
      },
      {
        question: "Does the AGPCNP bank include older-adult medication safety?",
        answer:
          "Yes. Medication risk, renal adjustment, contraindications, monitoring, and geriatric safety cues are central to adult-gerontology reasoning.",
      },
      {
        question: "Should AGPCNP candidates use mixed question sets?",
        answer:
          "Yes. Focused sets help build weak areas, but mixed cases are needed to prove that you can recognize the problem without a topic label.",
      },
    ],
    courseName: "AGPCNP Test Bank and Adult-Gerontology Practice",
    courseDescription:
      "Adult-gerontology NP exam preparation with practice questions, rationales, lessons, flashcards, and remediation.",
  },
] as const satisfies readonly HealthcareTestBankPageConfig[];

export const HEALTHCARE_TEST_BANK_PAGE_PATHS = HEALTHCARE_TEST_BANK_PAGES.map((page) => page.path);
export const ACTIVATED_HEALTHCARE_TEST_BANK_PAGE_IDS = new Set(HEALTHCARE_TEST_BANK_PAGES.map((page) => page.id));

export function listHealthcareTestBankPages(): readonly HealthcareTestBankPageConfig[] {
  return HEALTHCARE_TEST_BANK_PAGES;
}

export function listHealthcareTestBankPagePaths(): readonly string[] {
  return HEALTHCARE_TEST_BANK_PAGE_PATHS;
}

export function getHealthcareTestBankPageByPath(path: string): HealthcareTestBankPageConfig | null {
  const normalized = path.trim().replace(/\/+$/, "") || "/";
  return HEALTHCARE_TEST_BANK_PAGES.find((page) => page.path === normalized) ?? null;
}
