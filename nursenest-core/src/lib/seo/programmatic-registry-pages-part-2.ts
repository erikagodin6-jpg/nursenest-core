import type { SeoPageDefinition } from "./programmatic-seo-definitions";

const SITE = "NurseNest";

/** Second half of `PROGRAMMATIC_SEO_PAGES` (stable order; see `programmatic-registry.ts`). */
export const PROGRAMMATIC_SEO_PAGES_PART_2: SeoPageDefinition[] = [
  {
    slug: "np-study-guide-canada",
    title: "NP Study Guide for Canada | Guidelines, Cases, and Pace",
    description:
      "A practical NP study guide for Canada: sequencing guidelines, case practice, pharmacology depth, and exam-week pacing without generic checklists.",
    h1: "NP study guide for Canadian candidates",
    cluster: "study-guide",
    keywords: ["NP Canada", "study guide", "CNPLE"],
    linkPack: "np",
    breadcrumb: {
      midLabel: "Canadian NP prep",
      midPath: "/canada-np-exam-prep",
      currentLabel: "Study guide",
    },
    sections: [
      {
        heading: "Anchor to guidelines, then to cases",
        level: 2,
        body: [
          "Pick two references you will actually open during study blocks. Summarize decision thresholds in your own words, then answer cases that force you to apply them under time pressure.",
        ],
      },
      {
        heading: "Weekly rhythm for working clinicians",
        level: 2,
        body: [
          "Three shorter case blocks beat one exhausted midnight marathon. Keep one session per week purely for weak-domain remediation based on your last session report.",
        ],
      },
    ],
  },
  {
    slug: "np-clinical-cases",
    title: "NP Clinical Cases | Decision Patterns for Exam Prep",
    description:
      "Train NP-level clinical reasoning with case patterns: red flags, diagnostic forks, treatment sequencing, and when to escalate, mapped to how advanced practice exams are written.",
    h1: "NP clinical cases for exam-style reasoning",
    cluster: "exam-np",
    keywords: ["NP cases", "clinical reasoning", "nurse practitioner"],
    linkPack: "np",
    sections: [
      {
        heading: "Cases versus isolated facts",
        level: 2,
        body: [
          "A case ties symptoms, meds, comorbidities, and monitoring into one trajectory. Your job is to choose the next best action, not to list every possible intervention.",
        ],
      },
      {
        heading: "Build a personal miss taxonomy",
        level: 2,
        body: [
          "Track whether errors cluster in diagnosis, medication choice, monitoring, or follow-up. Feed that taxonomy back into your next case block so repetition fixes reasoning, not luck.",
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
          "Use question practice to stress-test rapid pattern recognition, exam items often compress time the way shift work does.",
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
          "After each miss, write one sentence on the rule you violated, then redo a similar stem the next day so pattern recognition does not substitute for protocol understanding.",
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
          "Focus on delta checks, interference, critical values, and pre-analytical error sources, common exam themes that mirror bench accountability.",
          "Alternate topic drills with mixed review so you cannot succeed by memorizing item banks without understanding why a flagged result changes management.",
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
          "Pair each positioning or exposure decision with the patient risk in the stem—exam writers often hide the decisive contraindication in comorbidity or pregnancy status.",
        ],
      },
    ],
  },
  {
    slug: "cardiovascular-nursing-practice-questions",
    title: "Cardiovascular Nursing Practice Questions",
    description:
      "HF, ACS, arrhythmia, and hemodynamic scenarios for nursing practice, prioritization and monitoring focused.",
    h1: "Cardiovascular nursing practice questions for acute and chronic care",
    cluster: "category",
    keywords: ["cardiovascular", "nursing", "practice questions"],
    sections: [
      {
        heading: "Hemodynamic patterns that repeat on exams",
        level: 2,
        body: [
          "Watch for perfusion versus congestion tradeoffs, antiarrhythmic safety, anticoagulation education, and early sepsis overlap with cardiac decline.",
          "Track your miss log by symptom cluster, not by isolated facts, to build transferable rules.",
        ],
      },
    ],
  },
  {
    slug: "respiratory-nursing-practice-questions",
    title: "NCLEX Respiratory Practice: COPD, Asthma & Oxygen Items",
    description:
      "NCLEX respiratory practice: oxygen, asthma and COPD flares, pneumonia, airway priorities—stems hide decline behind OK numbers. Choose the next action from trends and assessment, not saturation alone.",
    h1: "Respiratory nursing practice questions with oxygenation first",
    cluster: "category",
    keywords: ["respiratory nursing practice questions", "COPD NCLEX", "asthma NCLEX", "nursing"],
    sections: [
      {
        heading: "SpO₂ is a clue, not the whole story",
        level: 2,
        body: [
          "Start with work of breathing, level of consciousness, and perfusion—then let SpO₂ confirm or challenge your concern. Boards love patients who “look sick” before the monitor catches up.",
          "If the answer choices include higher oxygen, BiPAP, calling the provider, or tighter monitoring, pick the move that matches the trajectory in the stem, not the one that sounds most “textbook” in isolation.",
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
          "When two answers look plausible, choose the option that matches monitoring or teaching obligations tied to that drug class.",
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
          "Immunization, growth, and developmental milestones appear as decision context—read what stage the patient is in before selecting an intervention.",
        ],
      },
    ],
  },
  {
    slug: "med-surg-nursing-practice-questions",
    title: "Medical-Surgical Nursing Practice Questions",
    description:
      "Perioperative, GI, renal, endocrine, and multisystem med-surg scenarios for full med-surg review.",
    h1: "Medical-surgical nursing practice questions across core systems",
    cluster: "category",
    keywords: ["med-surg", "nursing"],
    sections: [
      {
        heading: "Med-surg rewards systems thinking",
        level: 2,
        body: [
          "Practice linking electrolyte shifts to ECG changes, post-op complications to timing, and pain control to respiratory risk.",
          "When multiple body systems appear in one stem, identify the primary risk to life or limb first, then sequence nursing actions accordingly.",
        ],
      },
    ],
  },
  {
    slug: "nursing-lab-values-study-guide",
    title: "Nursing Lab Values Chart | Normal Ranges & NCLEX Actions",
    description:
      "Normal lab values charts list ranges; NCLEX tests critical highs and lows and your next nursing action. Quick reference: pair abnormal labs with recheck, hold, notify, or escalate—not distractors.",
    h1: "Nursing lab values study guide for rapid bedside interpretation",
    cluster: "hub",
    keywords: ["normal lab values nursing", "nursing lab values chart", "NCLEX lab values", "nursing"],
    sections: [
      {
        heading: "Build memory anchors, not isolated numbers",
        level: 2,
        body: [
          "Quick reference flow: name the panel (renal, hepatic, infection, acid–base), then ask what single abnormal would change your first nursing move—before you memorize another number.",
          "Every “bad lab” needs a paired action: recheck, hold, notify, or escalate. If your pick ignores stability cues in the stem, it is usually a distractor.",
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
          "Double-check pump programming and rounding rules when IV rates or titration tables are embedded in the scenario stem.",
        ],
      },
    ],
  },
  {
    slug: "clinical-cheat-sheets-nursing",
    title: "Clinical Cheat Sheets for Nursing Students",
    description:
      "High-yield summaries for assessments, fluids, wounds, and common protocols, paired with links to deeper lessons.",
    h1: "Clinical cheat sheets nursing students can trust on shift",
    cluster: "hub",
    keywords: ["clinical", "cheat sheets", "nursing"],
    sections: [
      {
        heading: "Cheat sheets are starting points, not substitutes",
        level: 2,
        body: [
          "Use summaries to cue recall, then verify with policy and provider orders. Pair each sheet topic with question practice to test application.",
          "Keep one running list of facility-specific variances so you do not confuse textbook defaults with your unit’s protocols.",
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
          "Short daily question blocks beat sporadic cramming. Tie each block to patients you saw when possible, context accelerates memory.",
          "Protect consecutive days off before high-stakes exams; sleep debt shows up as careless errors on priority and calculation items.",
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
          "When you change employers or states, re-check scope and documentation rules—exam items assume the standard of care for your credential track.",
        ],
      },
    ],
  },
  {
    slug: "nursing-flashcards-nclex",
    title: "Nursing Flashcards for NCLEX & Clinical Courses",
    description:
      "How to use flashcards with spaced repetition alongside NCLEX-style questions for durable retention.",
    h1: "Nursing flashcards that complement, not replace, clinical judgment practice",
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
  {
    slug: "nclex-two-week-prep-schedule",
    pageKind: "study-plan",
    title: "NCLEX Two-Week Prep Schedule | Daily Blocks & Review",
    description:
      "A focused two-week NCLEX prep schedule: daily question targets, rationale review rules, and when to insert a mock exam—without a generic calendar that ignores your weak categories.",
    h1: "NCLEX two-week prep schedule built around weak-area feedback",
    cluster: "study-guide",
    keywords: ["NCLEX", "two week", "schedule", "intensive"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX prep guides",
      midPath: "/nclex-study-plan",
      currentLabel: "Two-week schedule",
    },
    sections: [
      {
        heading: "How to use this schedule without burning out",
        level: 2,
        body: [
          "Two weeks is enough to sharpen judgment and pacing if you already completed a first pass of content. If fundamentals are still unstable, extend the timeline rather than stacking hours.",
          "Anchor each day to one primary system or client-need bucket, then mix in a smaller second bucket so you do not overfit patterns.",
        ],
      },
      {
        heading: "Week one: stabilize accuracy before speed",
        level: 2,
        body: [
          "Days 1–4: two timed mini-sets per day with immediate rationale review on misses only; cap total new items so review stays honest.",
          "Days 5–7: add one short lesson block on your lowest category, then repeat mixed sets that force transfer, not recognition.",
        ],
      },
      {
        heading: "Week two: pacing, safety traps, and mock exam",
        level: 2,
        body: [
          "Days 8–11: alternate full mixed sets with a single high-yield weakness drill per day; track recurring error types, not just topics.",
          "Days 12–13: one full practice exam under realistic timing; day 14 is light review and sleep hygiene—no marathon cramming.",
        ],
      },
    ],
    faq: [
      {
        question: "Is two weeks enough to pass the NCLEX?",
        answer:
          "It can be enough to consolidate and test readiness if your baseline is strong. If multiple systems remain below your target accuracy, prioritize depth over the calendar.",
      },
      {
        question: "Where should practice questions come from?",
        answer:
          "Use a single pathway-scoped bank so delegation language and scope stay consistent with your registration context, then layer mocks for stamina.",
      },
    ],
  },
  {
    slug: "heart-failure-nclex-review",
    pageKind: "topic-guide",
    title: "Heart Failure Nursing Review for NCLEX | Meds, Fluids & Priorities",
    description:
      "Heart failure nursing review for NCLEX-style judgment: volume status clues, guideline-consistent medication priorities, and safety traps that show up in clinical scenarios.",
    h1: "Heart failure nursing review: priorities that transfer to NCLEX items",
    cluster: "category",
    keywords: ["heart failure", "NCLEX", "HF", "cardiac"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX-RN prep",
      midPath: "/nclex-rn-exam-prep",
      currentLabel: "Heart failure review",
    },
    sections: [
      {
        heading: "Clinical picture before memorizing drug classes",
        level: 2,
        body: [
          "NCLEX rewards matching interventions to the patient’s volume status and perfusion story, not reciting a textbook list.",
          "Practice explaining why diuresis, afterload reduction, or rate control is indicated in the stem you are given—then compare to the rationale.",
        ],
      },
      {
        heading: "Safety traps that repeat on exams",
        level: 2,
        body: [
          "Electrolyte shifts with therapy, hypotension after vasodilation, and infection signals when steroids or devices are in play are common distractor themes.",
          "When two answers look partially true, choose the action that addresses immediate life threat or the clearest nursing priority in the stem.",
        ],
      },
      {
        heading: "Pair reading with questions in the same week",
        level: 2,
        body: [
          "After a short review block, run a targeted question set on HF and related fluid/electrolyte items, then revisit only the misses with teaching depth.",
          `${SITE} links lessons and questions within the same pathway so your scope language stays consistent with RN registration expectations.`,
        ],
      },
    ],
    faq: [
      {
        question: "Should I memorize every HF medication detail?",
        answer:
          "Memorize the decision rules you can defend in a scenario: what to hold, what to monitor, and what symptom should change your priority.",
      },
      {
        question: "How is this different from doing random cardiac questions?",
        answer:
          "Random drills hide weak reasoning patterns. A focused HF pass plus mixed review tests whether you can transfer rules across presentations.",
      },
    ],
  },
];
