/**
 * Programmatic SEO definitions — single source for routes, metadata, sitemap, and internal links.
 * Add new entries here to scale indexable pages without new route files.
 */

export type SeoCluster =
  | "exam-nclex"
  | "exam-pn"
  | "exam-np"
  | "allied"
  | "category"
  | "hub"
  | "study-format";

export type SeoPageDefinition = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  cluster: SeoCluster;
  /** Primary keyword phrase for related linking */
  keywords: string[];
  sections: { heading: string; level: 2 | 3; body: string[] }[];
  faq?: { question: string; answer: string }[];
};

const SITE = "NurseNest";

export const PROGRAMMATIC_SEO_PAGES: SeoPageDefinition[] = [
  {
    slug: "nclex-rn-practice-questions",
    title: "NCLEX-RN Practice Questions | High-Yield Clinical Items",
    description:
      "Build readiness for the NCLEX-RN with exam-style practice questions, rationales, and adaptive review—mapped to Canadian and US RN expectations.",
    h1: "NCLEX-RN practice questions built for real exam pressure",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "practice questions", "RN"],
    sections: [
      {
        heading: "Why question practice drives NCLEX-RN pass readiness",
        level: 2,
        body: [
          "The NCLEX-RN rewards clinical judgment under time pressure—not memorization alone. Short, targeted question blocks help you spot patterns in prioritization, safety, pharmacology, and therapeutic communication.",
          `${SITE} groups items by cognitive demand so you spend more cycles on weak systems instead of repeating strengths.`,
        ],
      },
      {
        heading: "How to use a practice question bank effectively",
        level: 2,
        body: [
          "Aim for consistent daily volume with spaced review. After each block, read rationales even when you answer correctly—misaligned reasoning will resurface on exam day.",
          "Pair questions with lessons on fluid balance, infection control, and acute care transitions when those domains trend weak in your analytics.",
        ],
      },
      {
        heading: "Start RN prep inside NurseNest",
        level: 2,
        body: [
          "Open the question bank for timed sets, then move into mock exams when your accuracy stabilizes. Subscription unlocks the full pool for your region and tier.",
        ],
      },
    ],
    faq: [
      {
        question: "Are NCLEX-RN practice questions aligned to the current test plan?",
        answer:
          "Items are written for clinical judgment and safety emphasis consistent with NCLEX-style preparation; always cross-check with your regulatory body's latest bulletin.",
      },
      {
        question: "Can Canadian RN candidates use the same bank as US candidates?",
        answer:
          "Content is filtered by country and pathway so you see items appropriate to your registration context.",
      },
    ],
  },
  {
    slug: "nclex-rn-test-bank",
    title: "NCLEX-RN Test Bank | Timed Sets & Category Breakdowns",
    description:
      "Access a structured NCLEX-RN test bank with category performance views—ideal for weekly readiness checks before your authorization to test.",
    h1: "NCLEX-RN test bank for disciplined, data-driven study",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "test bank"],
    sections: [
      {
        heading: "What a test bank should measure",
        level: 2,
        body: [
          "A strong RN test bank exposes gaps across physiological adaptation, pharmacology, and reduction of risk—without letting you hide in one comfort topic.",
          `${SITE} surfaces category trends so you can rebalance study time toward domains that move your probability of success.`,
        ],
      },
      {
        heading: "From test bank to mock exam",
        level: 2,
        body: [
          "Once weekly test bank scores plateau, transition to full-length mock exams to rehearse stamina and pacing. Review every flagged item with rationale depth.",
        ],
      },
    ],
  },
  {
    slug: "nclex-rn-exam-prep",
    title: "NCLEX-RN Exam Prep | Lessons, Questions, and Mocks",
    description:
      "Combine lessons, practice questions, and mock exams in one NCLEX-RN exam prep workflow—built for Canada and the United States.",
    h1: "NCLEX-RN exam prep that connects lessons to assessment",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "exam prep"],
    sections: [
      {
        heading: "An integrated prep loop",
        level: 2,
        body: [
          "Exam prep works best as a loop: learn a concept, apply it under question pressure, then consolidate with a mock exam section.",
          `${SITE} keeps your question bank, lessons, and practice exams in one place so you do not lose days context-switching tools.`,
        ],
      },
    ],
  },
  {
    slug: "rex-pn-practice-questions",
    title: "REx-PN & NCLEX-PN Style Practice Questions",
    description:
      "Practical nursing practice questions for Canadian REx-PN and PN pathways—safety-first scenarios with clear rationales.",
    h1: "REx-PN practice questions with safety and scope at the center",
    cluster: "exam-pn",
    keywords: ["REx-PN", "PN", "LPN"],
    sections: [
      {
        heading: "PN exams reward scope-aware decisions",
        level: 2,
        body: [
          "Practical nursing items often hinge on delegation, scope, and stable-versus-unstable judgments. Practice should stress those forks explicitly.",
          `${SITE} helps you drill PN-appropriate scenarios without mixing in RN-only scope unless your pathway allows.`,
        ],
      },
    ],
  },
  {
    slug: "rex-pn-exam-prep",
    title: "REx-PN Exam Prep | PN Study System",
    description:
      "Structured REx-PN exam prep combining clinical lessons, PN-level questions, and review plans for Canadian candidates.",
    h1: "REx-PN exam prep designed around PN competencies",
    cluster: "exam-pn",
    keywords: ["REx-PN", "exam prep"],
    sections: [
      {
        heading: "Stay inside your entry-to-practice profile",
        level: 2,
        body: [
          "Your regulator publishes competencies—use them to prioritize community care, chronic illness, and acute changes PN scope can address.",
          "Pair each lesson block with a short question set the same week so knowledge converts to decision speed.",
        ],
      },
    ],
  },
  {
    slug: "np-exam-practice-questions",
    title: "NP Exam Practice Questions | Clinical Reasoning",
    description:
      "Advanced practice questions emphasizing differential reasoning, diagnostics, and therapeutics for NP exam preparation.",
    h1: "NP exam practice questions for differential and management depth",
    cluster: "exam-np",
    keywords: ["NP", "nurse practitioner", "practice questions"],
    sections: [
      {
        heading: "Why NP items feel different from RN banks",
        level: 2,
        body: [
          "NP-level preparation expects broader synthesis across lifespan presentations, prescribing considerations, and follow-up planning.",
          `${SITE} supports deeper rationales when your tier includes NP pathways—keep review notes tied to each miss.`,
        ],
      },
    ],
  },
  {
    slug: "np-exam-prep",
    title: "NP Exam Prep Hub | Questions, Lessons, Review",
    description:
      "Plan NP exam prep with category-aware questions, clinical lessons, and performance tracking in one subscription.",
    h1: "NP exam prep that respects your advanced practice scope",
    cluster: "exam-np",
    keywords: ["NP", "exam prep"],
    sections: [
      {
        heading: "Sequence complexity, not volume alone",
        level: 2,
        body: [
          "Increase case complexity week over week. Anchor each study sprint to two systems until accuracy holds, then rotate.",
        ],
      },
    ],
  },
  {
    slug: "respiratory-therapy-exam-prep",
    title: "Respiratory Therapy Exam Prep | RRT-Style Review",
    description:
      "Ventilation mechanics, gas exchange, and airway management concepts for respiratory therapy certification-style preparation.",
    h1: "Respiratory therapy exam prep focused on ventilation and gas exchange",
    cluster: "allied",
    keywords: ["respiratory therapy", "RRT", "exam prep"],
    sections: [
      {
        heading: "Core RT domains to rehearse",
        level: 2,
        body: [
          "Master ABG interpretation, ventilator modes and weaning criteria, obstructive versus restrictive patterns, and emergency airway priorities.",
          "Use question practice to stress-test rapid pattern recognition—exam items often compress time the way shift work does.",
        ],
      },
    ],
  },
  {
    slug: "paramedic-exam-prep",
    title: "Paramedic Exam Prep | Prehospital Prioritization",
    description:
      "Prehospital assessment, interventions, and transport decisions for paramedic certification-style readiness.",
    h1: "Paramedic exam prep built around scene-to-handoff decisions",
    cluster: "allied",
    keywords: ["paramedic", "exam prep"],
    sections: [
      {
        heading: "Prioritization beats trivia",
        level: 2,
        body: [
          "Paramedic exams emphasize ABCs, red-flag presentations, and protocol edges. Drill scenarios that force a single best first action.",
        ],
      },
    ],
  },
  {
    slug: "medical-laboratory-scientist-exam-prep",
    title: "Medical Laboratory Scientist Exam Prep | MLT Review",
    description:
      "Hematology, chemistry, immunohematology, and quality concepts for MLS / MLT exam preparation.",
    h1: "Medical laboratory scientist exam prep with analytical rigor",
    cluster: "allied",
    keywords: ["MLS", "MLT", "laboratory"],
    sections: [
      {
        heading: "Translate theory into result interpretation",
        level: 2,
        body: [
          "Focus on delta checks, interference, critical values, and pre-analytical error sources—common exam themes that mirror bench accountability.",
        ],
      },
    ],
  },
  {
    slug: "radiologic-technology-exam-prep",
    title: "Radiologic Technology Exam Prep | Imaging Safety & Positioning",
    description:
      "Patient safety, contrast considerations, and imaging fundamentals for radiologic technology exam preparation.",
    h1: "Radiologic technology exam prep emphasizing safety and image quality",
    cluster: "allied",
    keywords: ["radiography", "imaging", "exam prep"],
    sections: [
      {
        heading: "Safety and ALARA are always in scope",
        level: 2,
        body: [
          "Expect questions on shielding, pediatric adjustments, contrast reactions, and protocol selection when anatomy is ambiguous.",
        ],
      },
    ],
  },
  {
    slug: "cardiovascular-nursing-practice-questions",
    title: "Cardiovascular Nursing Practice Questions",
    description:
      "HF, ACS, arrhythmia, and hemodynamic scenarios for nursing practice—prioritization and monitoring focused.",
    h1: "Cardiovascular nursing practice questions for acute and chronic care",
    cluster: "category",
    keywords: ["cardiovascular", "nursing", "practice questions"],
    sections: [
      {
        heading: "Hemodynamic patterns that repeat on exams",
        level: 2,
        body: [
          "Watch for perfusion versus congestion tradeoffs, antiarrhythmic safety, anticoagulation education, and early sepsis overlap with cardiac decline.",
          "Track your miss log by symptom cluster—not by isolated facts—to build transferable rules.",
        ],
      },
    ],
  },
  {
    slug: "respiratory-nursing-practice-questions",
    title: "Respiratory Nursing Practice Questions",
    description:
      "Oxygen therapy, asthma and COPD exacerbations, pneumonia, and ventilation basics for nursing exams.",
    h1: "Respiratory nursing practice questions with oxygenation first",
    cluster: "category",
    keywords: ["respiratory", "nursing"],
    sections: [
      {
        heading: "SpO₂ is a clue—not the whole story",
        level: 2,
        body: [
          "Combine work of breathing, mental status, and perfusion with saturation trends. Exams love hidden fatigue despite acceptable numbers.",
        ],
      },
    ],
  },
  {
    slug: "pharmacology-nursing-practice-questions",
    title: "Pharmacology Nursing Practice Questions",
    description:
      "Mechanism, adverse effects, interactions, and monitoring for high-stakes nursing pharmacology.",
    h1: "Pharmacology nursing practice questions with monitoring emphasis",
    cluster: "category",
    keywords: ["pharmacology", "nursing"],
    sections: [
      {
        heading: "Link drug classes to assessment endpoints",
        level: 2,
        body: [
          "For each class, know the top three adverse effects, contraindications, and labs or vitals you recheck after initiation or dose changes.",
        ],
      },
    ],
  },
  {
    slug: "pediatric-nursing-practice-questions",
    title: "Pediatric Nursing Practice Questions",
    description:
      "Growth-aware dosing, developmental cues, family-centered care, and acute pediatric emergencies for nursing exams.",
    h1: "Pediatric nursing practice questions with developmental context",
    cluster: "category",
    keywords: ["pediatrics", "nursing"],
    sections: [
      {
        heading: "Pediatrics is a communication and safety exam",
        level: 2,
        body: [
          "Expect questions where caregiver report, non-verbal cues, and age-specific vitals change the best answer.",
        ],
      },
    ],
  },
  {
    slug: "med-surg-nursing-practice-questions",
    title: "Medical-Surgical Nursing Practice Questions",
    description:
      "Perioperative, GI, renal, endocrine, and multisystem med-surg scenarios for comprehensive nursing review.",
    h1: "Medical-surgical nursing practice questions across core systems",
    cluster: "category",
    keywords: ["med-surg", "nursing"],
    sections: [
      {
        heading: "Med-surg rewards systems thinking",
        level: 2,
        body: [
          "Practice linking electrolyte shifts to ECG changes, post-op complications to timing, and pain control to respiratory risk.",
        ],
      },
    ],
  },
  {
    slug: "nursing-lab-values-study-guide",
    title: "Nursing Lab Values Study Guide | Quick Clinical Reference",
    description:
      "A practical study guide for interpreting common nursing lab values, critical results, and next-step clinical reasoning.",
    h1: "Nursing lab values study guide for rapid bedside interpretation",
    cluster: "hub",
    keywords: ["lab values", "nursing", "study guide"],
    sections: [
      {
        heading: "Build memory anchors, not isolated numbers",
        level: 2,
        body: [
          "Group labs by organ system and by emergent pattern—renal failure panels versus hepatic panels versus sepsis screens.",
          "Pair each abnormal value with an assessment action: recheck, hold dose, notify provider, or escalate monitoring.",
        ],
      },
      {
        heading: "Connect labs to lessons and questions",
        level: 2,
        body: [
          `Use ${SITE} lessons for foundational pathophysiology, then apply lab interpretation inside timed question sets.`,
        ],
      },
    ],
  },
  {
    slug: "medication-calculation-nursing-guide",
    title: "Medication Calculation Guide for Nurses",
    description:
      "Dimensional analysis, weight-based dosing, and IV rate safety for nursing students and exam candidates.",
    h1: "Medication calculation nursing guide with safety checks",
    cluster: "hub",
    keywords: ["med math", "dosing", "nursing"],
    sections: [
      {
        heading: "Make every step visible",
        level: 2,
        body: [
          "Write units through every multiplication and division. Exams punish silent conversions between mg, mcg, mL, and units per kg.",
        ],
      },
    ],
  },
  {
    slug: "clinical-cheat-sheets-nursing",
    title: "Clinical Cheat Sheets for Nursing Students",
    description:
      "High-yield summaries for assessments, fluids, wounds, and common protocols—paired with links to deeper lessons.",
    h1: "Clinical cheat sheets nursing students can trust on shift",
    cluster: "hub",
    keywords: ["clinical", "cheat sheets", "nursing"],
    sections: [
      {
        heading: "Cheat sheets are starting points, not substitutes",
        level: 2,
        body: [
          "Use summaries to cue recall, then verify with policy and provider orders. Pair each sheet topic with question practice to test application.",
        ],
      },
    ],
  },
  {
    slug: "new-graduate-nursing-roadmap",
    title: "New Graduate Nursing Roadmap | First-Year Success",
    description:
      "A roadmap for new graduate nurses: orientation priorities, competency building, and exam prep that fits shift schedules.",
    h1: "New graduate nursing roadmap from orientation to confidence",
    cluster: "hub",
    keywords: ["new grad", "nursing"],
    sections: [
      {
        heading: "Protect sleep, then protect learning cadence",
        level: 2,
        body: [
          "Short daily question blocks beat sporadic cramming. Tie each block to patients you saw when possible—context accelerates memory.",
        ],
      },
    ],
  },
  {
    slug: "allied-health-career-guides",
    title: "Allied Health Career Guides | RT, Paramedic, Lab, Imaging",
    description:
      "Career pathway context for allied health professionals with links to exam prep resources inside NurseNest.",
    h1: "Allied health career guides connecting pathways to prep",
    cluster: "hub",
    keywords: ["allied health", "career"],
    sections: [
      {
        heading: "Pick a lane, then deepen specialty depth",
        level: 2,
        body: [
          "Each allied pathway has distinct certification emphases. Align question practice to your registry blueprint and clinical rotation gaps.",
        ],
      },
    ],
  },
  {
    slug: "nursing-flashcards-nclex",
    title: "Nursing Flashcards for NCLEX & Clinical Courses",
    description:
      "How to use flashcards with spaced repetition alongside NCLEX-style questions for durable retention.",
    h1: "Nursing flashcards that complement—not replace—clinical judgment practice",
    cluster: "study-format",
    keywords: ["flashcards", "NCLEX"],
    sections: [
      {
        heading: "Spaced repetition + application",
        level: 2,
        body: [
          "Memorize mechanisms with cards, then force application under question pressure the same week. Isolation creates false confidence.",
          `${SITE} routes flashcard-minded study into the question bank and lessons so recall meets context.`,
        ],
      },
    ],
  },
];

export function getAllProgrammaticSeoPages(): SeoPageDefinition[] {
  return PROGRAMMATIC_SEO_PAGES;
}

export function getProgrammaticSeoPage(slug: string): SeoPageDefinition | undefined {
  return PROGRAMMATIC_SEO_PAGES.find((p) => p.slug === slug);
}

export function getAllProgrammaticSlugs(): string[] {
  return PROGRAMMATIC_SEO_PAGES.map((p) => p.slug);
}

export function getRelatedProgrammaticPages(slug: string, limit = 5): SeoPageDefinition[] {
  const page = getProgrammaticSeoPage(slug);
  if (!page) return [];
  return PROGRAMMATIC_SEO_PAGES.filter((p) => p.slug !== slug && p.cluster === page.cluster).slice(0, limit);
}

export function getCrossClusterLinks(slug: string): SeoPageDefinition[] {
  const page = getProgrammaticSeoPage(slug);
  if (!page) return [];
  const want: SeoCluster[] = ["hub", "study-format", "exam-nclex"];
  return PROGRAMMATIC_SEO_PAGES.filter((p) => p.slug !== slug && want.includes(p.cluster)).slice(0, 4);
}

export function isProgrammaticSeoSlug(slug: string): boolean {
  return PROGRAMMATIC_SEO_PAGES.some((p) => p.slug === slug);
}
