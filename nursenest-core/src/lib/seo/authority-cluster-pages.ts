import { CNPLE_INVENTORY } from "@/lib/marketing/cnple-inventory-metrics";

export type AuthorityClusterKey = "cnple" | "rex-pn" | "respiratory-therapy" | "ca-rn" | "np-fnp" | "np-agpcnp" | "np-pmhnp" | "np-whnp" | "np-pnp-pc";

export type AuthorityClusterPage = {
  cluster: AuthorityClusterKey;
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  examTerms: readonly string[];
  ctas: readonly { label: string; href: string }[];
  table: {
    caption: string;
    columns: readonly string[];
    rows: readonly (readonly string[])[];
  };
  sections: readonly { heading: string; body: readonly string[] }[];
  mistakes: readonly string[];
  examDay: readonly string[];
  faq: readonly { question: string; answer: string }[];
  // Phase 3 authority enrichment fields
  whatYoullLearn: readonly string[];
  whoThisIsFor: string;
  studyOrder: readonly string[];
  nextSteps: readonly { label: string; href: string }[];
  highYieldTips?: readonly string[];
  datePublished?: string;
  dateModified?: string;
};

const CNPLE_BASE = "/canada/np/cnple";
const REX_BASE = "/canada/rpn/rex-pn";
const RT_BASE = "/allied-health/respiratory-therapy";
const CA_RN_BASE = "/canada-nclex-rn";
const NP_FNP_BASE = "/np-specialty/fnp";
const NP_AGPCNP_BASE = "/np-specialty/agpcnp";
const NP_PMHNP_BASE = "/np-specialty/pmhnp";
const NP_WHNP_BASE = "/np-specialty/whnp";
const NP_PNP_PC_BASE = "/np-specialty/pnp-pc";

const cnpleCtas = [
  { label: "CNPLE practice questions", href: `${CNPLE_BASE}/questions` },
  { label: "CNPLE lessons", href: `${CNPLE_BASE}/lessons` },
  { label: "CNPLE simulation", href: `${CNPLE_BASE}/simulation` },
  { label: "CNPLE flashcards", href: `${CNPLE_BASE}/flashcards` },
] as const;

const rexCtas = [
  { label: "REx-PN practice questions", href: `${REX_BASE}/questions` },
  { label: "REx-PN CAT exam", href: `${REX_BASE}/cat` },
  { label: "REx-PN lessons", href: `${REX_BASE}/lessons` },
  { label: "REx-PN flashcards", href: `${REX_BASE}/flashcards` },
] as const;

const rtCtas = [
  { label: "Respiratory therapy practice questions", href: `${RT_BASE}/practice-questions` },
  { label: "Respiratory therapy lessons", href: "/allied/allied-health/lessons?alliedProfession=respiratory" },
  { label: "ABG drills", href: `${RT_BASE}/abgs` },
  { label: "Ventilator training", href: "/respiratory-therapy/ventilator-training" },
] as const;

const caRnCtas = [
  { label: "NCLEX-RN practice questions", href: `/canada/rn/nclex-rn/questions` },
  { label: "NCLEX-RN lessons", href: `/canada/rn/nclex-rn/lessons` },
  { label: "NCLEX-RN CAT exam", href: `/canada/rn/nclex-rn/cat` },
  { label: "NCLEX-RN flashcards", href: `/canada/rn/nclex-rn/flashcards` },
] as const;

const npFnpCtas = [
  { label: "FNP practice questions", href: `/en/np/fnp/questions` },
  { label: "FNP lessons", href: `/en/np/fnp/lessons` },
  { label: "FNP pharmacology", href: `/en/np/fnp/pharmacology` },
  { label: "FNP simulation", href: `/en/np/fnp/simulation` },
] as const;

const npAgpcnpCtas = [
  { label: "AGPCNP practice questions", href: `/en/np/agpcnp/questions` },
  { label: "AGPCNP lessons", href: `/en/np/agpcnp/lessons` },
  { label: "AGPCNP pharmacology", href: `/en/np/agpcnp/pharmacology` },
  { label: "AGPCNP simulation", href: `/en/np/agpcnp/simulation` },
] as const;

const npPmhnpCtas = [
  { label: "PMHNP practice questions", href: `/en/np/pmhnp/questions` },
  { label: "PMHNP lessons", href: `/en/np/pmhnp/lessons` },
  { label: "PMHNP pharmacology", href: `/en/np/pmhnp/pharmacology` },
  { label: "PMHNP simulation", href: `/en/np/pmhnp/simulation` },
] as const;

const npWhnpCtas = [
  { label: "WHNP practice questions", href: `/en/np/whnp/questions` },
  { label: "WHNP lessons", href: `/en/np/whnp/lessons` },
  { label: "WHNP pharmacology", href: `/en/np/whnp/pharmacology` },
  { label: "WHNP simulation", href: `/en/np/whnp/simulation` },
] as const;

const npPnpPcCtas = [
  { label: "PNP-PC practice questions", href: `/en/np/pnp-pc/questions` },
  { label: "PNP-PC lessons", href: `/en/np/pnp-pc/lessons` },
  { label: "PNP-PC pharmacology", href: `/en/np/pnp-pc/pharmacology` },
  { label: "PNP-PC simulation", href: `/en/np/pnp-pc/simulation` },
] as const;

function pagePath(base: string, slug: string): string {
  return slug === "overview" ? base : `${base}/${slug}`;
}

function commonFaq(exam: string, questionHref: string, format: string): AuthorityClusterPage["faq"] {
  const base = [
    {
      question: `How should I start studying for ${exam}?`,
      answer: `Start with a mixed diagnostic set, tag every miss by clinical concept, then use short lesson blocks before retesting. That sequence shows whether the issue is knowledge, cue recognition, or exam strategy.`,
    },
    {
      question: `Are NurseNest ${exam} questions official exam questions?`,
      answer: `No. NurseNest is independent and does not claim to provide official or recalled exam items. The questions are educational practice items designed around the clinical reasoning, terminology, and pacing demands learners should prepare for.`,
    },
    {
      question: `What format should I practise for ${exam}?`,
      answer: `${format} Use timed practice after you understand the topic, then review rationales carefully enough to explain why the distractors are less safe, less complete, or less exam-specific.`,
    },
    {
      question: `Where should I practise after reading this page?`,
      answer: `Use the linked ${exam} question hub for active recall, then move into lessons, flashcards, and exam-mode practice so the content becomes usable under time pressure.`,
    },
  ];
  if (exam === "CNPLE") {
    return [
      ...base,
      {
        question: "How hard is the CNPLE?",
        answer:
          "The CNPLE is challenging because it tests nurse practitioner judgment, not isolated nursing recall. Candidates need to connect differential diagnosis, prescribing safety, diagnostics, follow-up, and provincial practice context inside case-based stems.",
      },
      {
        question: "Is the CNPLE adaptive?",
        answer:
          "CNPLE preparation should not be treated like a CAT exam. Learners should build fixed-length stamina, steady pacing, and consistent clinical reasoning across a full exam block.",
      },
      {
        question: "How many questions are on the CNPLE?",
        answer:
          "Question counts and administrative details can change, so candidates should confirm current details with the exam administrator or provincial regulator. For study, practise long timed sets so pacing and fatigue are part of preparation.",
      },
      {
        question: "How long should I study for the CNPLE?",
        answer:
          "Most candidates benefit from an 8 to 12 week plan that combines diagnostic questions, Canadian NP lessons, prescribing review, case-based practice, and final timed simulation. Shorter plans should still include mixed-question review, not only notes.",
      },
    ];
  }
  if (exam === "REx-PN") {
    return [
      ...base,
      {
        question: "Is the REx-PN adaptive?",
        answer:
          "Yes. REx-PN candidates should prepare for computerized adaptive testing by mixing targeted remediation with CAT-style sessions that train uncertainty tolerance, pacing, and client-needs switching.",
      },
      {
        question: "How many questions are on the REx-PN?",
        answer:
          "The REx-PN uses a variable-length adaptive format. Instead of preparing for one fixed number, practise staying clinically disciplined when the exam feels easier or harder from item to item.",
      },
      {
        question: "Is the REx-PN harder than NCLEX-PN?",
        answer:
          "The exams overlap in practical nursing concepts, but the REx-PN uses Canadian registration language, client-needs framing, and local scope expectations. Difficulty depends on how well your preparation matches that context.",
      },
      {
        question: "What topics are most important on the REx-PN?",
        answer:
          "Prioritization, safety, medication administration, infection control, delegation, therapeutic communication, and physiological adaptation are consistently high-yield because they appear across many client-needs categories.",
      },
    ];
  }
  if (exam === "NCLEX-RN") {
    return [
      ...base,
      {
        question: "Is the NCLEX-RN adaptive?",
        answer:
          "Yes. The NCLEX-RN uses computerized adaptive testing (CAT). Candidates should prepare with both targeted remediation by client needs category and CAT-style mixed sessions that train pacing, uncertainty tolerance, and disciplined answer selection when item difficulty changes.",
      },
      {
        question: "How many questions are on the NCLEX-RN?",
        answer:
          "The NCLEX-RN uses a variable-length adaptive format. Candidates should prepare for stamina and sustained clinical reasoning across a full session rather than aiming for a fixed number of items.",
      },
      {
        question: "What are Next Generation NCLEX items?",
        answer:
          "NGN items include bow-tie, extended drag-and-drop, highlight, and extended multiple-response formats. They test clinical judgment more explicitly than traditional single-best-answer items. Preparation should include practising cue recognition, analysis, prioritization, and action selection across all item types.",
      },
      {
        question: "How long should I study for the NCLEX-RN?",
        answer:
          "Most candidates benefit from an 8 to 12 week plan combining a baseline diagnostic, client needs category review, pharmacology, clinical judgment practice, CAT simulation, and NGN item familiarity. The key is keeping active recall — timed question practice — in every week, not just the final stretch.",
      },
    ];
  }
  if (exam === "FNP") {
    return [
      ...base,
      {
        question: "What is the FNP certification exam?",
        answer:
          "FNP certification is offered by AANP (the Family Nurse Practitioner certification) and ANCC (the Family Nurse Practitioner board certification). Both exams test primary care clinical decision-making across the lifespan, including diagnosis, pharmacology, prevention, and patient education.",
      },
      {
        question: "How long should I study for the FNP exam?",
        answer:
          "Most FNP candidates benefit from an 8 to 12 week preparation plan that covers all primary care systems, prescribing safety, prevention guidelines, and mixed timed simulation. Candidates with weaker pharmacology backgrounds should add a dedicated prescribing safety rotation.",
      },
      {
        question: "What is the hardest part of the FNP exam?",
        answer:
          "Most candidates find pharmacology and multi-system cases the most challenging because both require integrating multiple clinical variables simultaneously. Practising multi-condition vignettes after mastering single-system prescribing builds the integrative reasoning the exam rewards.",
      },
      {
        question: "Is FNP or AGPCNP better for primary care?",
        answer:
          "Both FNP and AGPCNP certifications prepare NPs for primary care. FNP covers the full lifespan including pediatric and obstetric primary care. AGPCNP focuses on adults and older adults. The right choice depends on your clinical setting and patient population.",
      },
    ];
  }
  if (exam === "AGPCNP") {
    return [
      ...base,
      {
        question: "What does the AGPCNP exam test?",
        answer:
          "The AGPCNP exam tests adult and older adult primary care, including chronic disease management, geriatric assessment, polypharmacy, Beers criteria, preventive care, and end-of-life considerations. Candidates need fluency in both adult and geriatric clinical reasoning.",
      },
      {
        question: "How is the AGPCNP different from the FNP?",
        answer:
          "AGPCNP focuses on adults (18+) and older adults, with a strong geriatric component including frailty assessment, Beers-listed medications, and atypical presentations. FNP covers the full lifespan. AGPCNP preparation should include a dedicated geriatric rotation.",
      },
      {
        question: "How long should I study for the AGPCNP exam?",
        answer:
          "Most AGPCNP candidates benefit from 8 to 12 weeks of structured preparation covering adult systems, geriatric syndromes, Beers criteria, polypharmacy, and mixed timed practice. A geriatric-specific week early in the plan improves integration.",
      },
      {
        question: "What are Beers criteria and why do they matter for AGPCNP?",
        answer:
          "Beers criteria identify medications that are potentially inappropriate for older adults due to increased risk of adverse effects, falls, cognitive impairment, or drug-disease interactions. AGPCNP candidates must recognize Beers-listed drugs and understand why they are problematic in older patients.",
      },
    ];
  }
  if (exam === "PMHNP") {
    return [
      ...base,
      {
        question: "What does the PMHNP exam test?",
        answer:
          "The PMHNP exam tests psychiatric-mental health NP competencies including DSM-based diagnosis, mental status examination, risk assessment, psychopharmacology, therapeutic modalities, and safety planning. Both prescribing safety and therapeutic relationship skills are tested.",
      },
      {
        question: "How long should I study for the PMHNP exam?",
        answer:
          "Most PMHNP candidates benefit from 8 to 12 weeks of preparation that front-loads DSM diagnostic criteria and risk assessment before layering pharmacology and case-based practice. Psychopharmacology is highest-yield and should appear in every study week.",
      },
      {
        question: "What is the hardest part of the PMHNP exam?",
        answer:
          "Diagnostic accuracy and psychopharmacology are consistently the most challenging areas because both require precise reasoning under uncertainty. Candidates who separate diagnostic reasoning from management reasoning — naming the diagnosis first, then choosing the intervention — perform more consistently.",
      },
      {
        question: "How do I study psychopharmacology for the PMHNP exam?",
        answer:
          "Practise each drug class with its monitoring protocol alongside its indication and contraindications. Lithium levels, metabolic panels for antipsychotics, LFTs for valproate, and QTc monitoring for certain agents are recurring exam targets. Pair every medication miss with a monitoring-requirement flashcard.",
      },
    ];
  }
  if (exam === "WHNP") {
    return [
      ...base,
      {
        question: "What does the WHNP exam test?",
        answer:
          "The WHNP exam tests women's health primary care across the lifespan, including reproductive health, contraception, STI management, prenatal and postpartum care, menopause, cancer screening, bone health, and cardiovascular risk reduction for women.",
      },
      {
        question: "How long should I study for the WHNP exam?",
        answer:
          "Most WHNP candidates benefit from 8 to 12 weeks of preparation divided into reproductive, obstetric, and preventive study rotations. Candidates should practise contraindication-heavy vignettes early because pharmacology safety is tested throughout all WHNP content areas.",
      },
      {
        question: "What is the hardest part of the WHNP exam?",
        answer:
          "Contraindications to hormonal therapies and prenatal pharmacology safety are consistently challenging because multiple patient factors — age, smoking status, BMI, comorbidities, and reproductive goals — must all be weighed simultaneously. Multi-factor vignettes are the highest-yield practice format.",
      },
      {
        question: "What pregnancy safety categories should I know for the WHNP?",
        answer:
          "WHNP candidates should know which commonly prescribed medications carry teratogenic risk, which are considered safe in pregnancy, and which require risk-benefit discussions. Folate supplementation, iron, prenatal vitamins, and common antibiotic safety in pregnancy are recurring exam topics.",
      },
    ];
  }
  if (exam === "PNP-PC") {
    return [
      ...base,
      {
        question: "What does the PNP-PC exam test?",
        answer:
          "The PNP-PC exam tests pediatric primary care competencies including developmental assessment, well-child care, immunization schedules, acute illness management, chronic disease management in children, and family-centered care. Reasoning must be age-indexed.",
      },
      {
        question: "How long should I study for the PNP-PC exam?",
        answer:
          "Most PNP-PC candidates benefit from 8 to 12 weeks of preparation organized by developmental age group — newborn, infant, toddler, school-age, and adolescent — before integrating across age groups in mixed practice. Pharmacology and developmental milestones should appear in every study week.",
      },
      {
        question: "What is the hardest part of the PNP-PC exam?",
        answer:
          "Age-specific reasoning is the most common source of errors — a finding that is normal in a 6-month-old is abnormal in a 2-year-old, and a medication safe in a school-age child is contraindicated in a toddler. Practising by developmental stage group builds the age-indexing reflex the exam requires.",
      },
      {
        question: "What pediatric pharmacology do I need to know for the PNP-PC exam?",
        answer:
          "Weight-based dosing calculation, age-specific contraindications, and off-label use cautions are recurring targets. Aspirin in children under 18 (Reye's syndrome risk), fluoroquinolones in adolescents (cartilage risk), and tetracyclines before age 8 (tooth staining) are classic exam items.",
      },
    ];
  }
  return [
    ...base,
    {
      question: "How do you interpret ABGs?",
      answer:
        "Start with pH to identify acidemia or alkalemia, compare PaCO2 and HCO3 to identify the primary respiratory or metabolic driver, assess compensation, then connect PaO2, SpO2, and the patient's work of breathing to the next intervention.",
    },
    {
      question: "What ventilator modes should RT students know?",
      answer:
        "RT students should understand volume control, pressure control, SIMV, pressure support, CPAP, BiPAP, and high-frequency concepts at a decision level: what the mode controls, what the patient controls, and which alarms or waveforms suggest trouble.",
    },
    {
      question: "What is PEEP?",
      answer:
        "PEEP is positive end-expiratory pressure. It helps keep alveoli recruited and can improve oxygenation, but excessive PEEP can reduce venous return, worsen hypotension, and increase barotrauma risk.",
    },
    {
      question: "How do you calculate oxygenation?",
      answer:
        "Oxygenation is assessed with SpO2, PaO2, FiO2 requirement, work of breathing, and trends. In higher-acuity questions, learners may also use P/F ratio, alveolar-arterial gradient context, and response after oxygen or ventilator changes.",
    },
  ];
}

function buildCnplePage(
  slug: string,
  topic: string,
  angle: string,
  tableRows: readonly (readonly string[])[],
  extraSection: string,
): AuthorityClusterPage {
  const path = pagePath(CNPLE_BASE, slug);
  return {
    cluster: "cnple",
    slug,
    path,
    title:
      slug === "overview"
        ? `CNPLE Exam Prep (2026) — Canadian NP Licensure Examination | NurseNest`
        : `${topic} (2026) — CNPLE Prep | NurseNest`,
    description:
      slug === "overview"
        ? `CNPLE 2026 prep: ${CNPLE_INVENTORY.caQuestionsLabel} Canadian-aligned NP practice questions, ${CNPLE_INVENTORY.flashcardsLabel} flashcards, LOFT simulation, and ${CNPLE_INVENTORY.lessonsLabel} lessons. Aligned to CCRNR competency frameworks.`
        : `${topic} for CNPLE preparation — Canadian NP clinical reasoning, prescribing safety, LOFT pacing, and rationale-first practice questions.`,
    h1: slug === "overview" ? "CNPLE exam prep for Canadian nurse practitioners (2026)" : `${topic} for CNPLE preparation`,
    eyebrow: "Canadian NP licensure exam — 2026 authority guide",
    lead:
      slug === "overview"
        ? `NurseNest includes ${CNPLE_INVENTORY.lessonsLong}, ${CNPLE_INVENTORY.caQuestionsLong}, ${CNPLE_INVENTORY.flashcardsLabel} flashcards (including ${CNPLE_INVENTORY.curatedFlashcardsLabel} hand-authored Canadian clinical reasoning cards), and a LOFT-style simulation experience built for Canadian nurse practitioner licensure. Content covers prescribing safety, differential diagnosis, diagnostics, lifespan care, women's health, mental health, and professional practice — all framed around fixed-length CNPLE exam reasoning, not adaptive CAT.`
        : `Use this CNPLE guide to connect ${angle} with Canadian nurse practitioner exam reasoning. The goal is not memorizing isolated facts. It is learning to move from patient cues to differential diagnosis, prescribing decisions, diagnostic selection, escalation, follow-up, and documentation under a fixed-length LOFT-style testing experience.`,
    examTerms:
      slug === "overview"
        ? ["CNPLE", "Canadian NP", "LOFT simulation", `${CNPLE_INVENTORY.lessonsLabel} lessons`, `${CNPLE_INVENTORY.caQuestionsLabel} Canadian NP questions`, `${CNPLE_INVENTORY.flashcardsLabel} flashcards`, "prescribing safety"]
        : ["CNPLE", "Canadian NP", "LOFT", "clinical judgment", "prescribing safety", "differential diagnosis"],
    ctas: cnpleCtas,
    table: {
      caption: `${topic}: what to practise`,
      columns: ["Study focus", "How it appears in CNPLE-style practice", "Best NurseNest follow-up"],
      rows: tableRows,
    },
    sections: [
      {
        heading: "How this topic shows up on CNPLE-style items",
        body: [
          `CNPLE preparation should be framed around advanced practice decisions: what the NP can assess independently, when to prescribe or hold therapy, when diagnostics change management, and when referral or emergency escalation is safer than outpatient follow-up. ${topic} belongs in that clinical decision chain.`,
          "Strong candidates read the whole scenario before choosing an answer. Age, pregnancy status, renal function, current medication list, red-flag symptoms, and follow-up access can all change the safest response. NurseNest pages intentionally keep those cues visible so learners practise clinical judgment rather than answer-key recognition.",
        ],
      },
      {
        heading: "Case-based example",
        body: [
          `A patient presents with overlapping symptoms and one finding that shifts the risk picture. For ${topic.toLowerCase()}, the first pass is to name the most dangerous diagnosis that must not be missed, the second is to decide which information is still needed, and the third is to pick an action that fits Canadian NP scope and safety.`,
          "A rationale-focused review asks: what made the correct option safest, what made each distractor incomplete, and which cue would have changed the plan. That habit builds durable reasoning for new stems instead of memorizing one vignette.",
        ],
      },
      {
        heading: "Clinical judgment study loop",
        body: [
          "Run a 20 to 40 question diagnostic set, write down every miss as a rule, review the linked lesson or flashcard set, then retest within 48 hours. Keep mixed blocks in the rotation so you practise switching between assessment, management, health promotion, and professional accountability.",
          extraSection,
        ],
      },
    ],
    mistakes: [
      "Treating CNPLE like NCLEX-style CAT when the CNPLE preparation target is fixed-length LOFT-style stamina.",
      "Using US-only guideline memory without checking Canadian screening, prescribing, privacy, and regulatory context.",
      "Reviewing rationales only for the correct option instead of understanding why plausible distractors are unsafe.",
      "Studying pharmacology, diagnostics, and clinical judgment as separate silos instead of integrated NP decisions.",
    ],
    examDay: [
      "Expect clinical vignettes that require prioritizing incomplete but meaningful patient data.",
      "Budget time evenly; do not spend exam-day energy trying to identify an adaptive pattern.",
      "Recheck age, pregnancy, renal function, medication allergies, and red flags before committing to management.",
      "Use elimination by safety: first remove options that delay escalation, ignore contraindications, or exceed scope.",
    ],
    faq: commonFaq("CNPLE", `${CNPLE_BASE}/questions`, "CNPLE preparation should include fixed-length timed sets because LOFT-style practice rewards consistent pacing across the whole exam."),
    whatYoullLearn:
      slug === "overview"
        ? [
            `How to access ${CNPLE_INVENTORY.lessonsLong} covering prescribing, diagnostics, lifespan, and professional practice`,
            `How to launch ${CNPLE_INVENTORY.caQuestionsLong} scoped to Canadian NP exam reasoning`,
            `How to use ${CNPLE_INVENTORY.flashcardsLabel} domain-targeted flashcards — including ${CNPLE_INVENTORY.curatedFlashcardsLabel} hand-authored Canadian clinical reasoning cards — for spaced-repetition CNPLE prep`,
            "How to run the LOFT-style simulation with a full session report card",
            "Canadian NP prescribing and guideline context that differs from US preparation materials",
            "A repeatable study loop — diagnostic block, lesson review, flashcard reinforcement, retesting",
          ]
        : [
            `How ${topic} is assessed in CNPLE LOFT-format clinical vignettes`,
            "Canadian NP prescribing and guideline context that differs from US preparation materials",
            "The specific reasoning errors that cost marks on case-based questions",
            "A repeatable study loop — diagnostic, lesson review, retesting — for this topic area",
          ],
    whoThisIsFor:
      "NP graduates completing their CNPLE preparation, working nurse practitioners in provisional registration, and RNs exploring Canadian NP programmes who want to understand the CNPLE's clinical scope and content depth.",
    studyOrder: [
      "Run a 25–40 question mixed diagnostic block to measure baseline accuracy in this area",
      "Review the lesson content for every missed concept — read the rationale, not just the answer",
      "Complete a second focused block of 20 questions in this domain",
      "Flag difficult items and add them to a spaced-repetition flashcard deck",
      "Return to mixed-domain blocks after 48 hours to confirm retention",
    ],
    nextSteps: [
      { label: "CNPLE practice questions", href: `${CNPLE_BASE}/questions` },
      { label: "CNPLE lessons", href: `${CNPLE_BASE}/lessons` },
      { label: "LOFT simulation", href: `${CNPLE_BASE}/simulation` },
      { label: "CNPLE hub", href: CNPLE_BASE },
    ],
    datePublished: "2026-01-15",
    dateModified: "2026-05-13",
  };
}

function buildRexPage(
  slug: string,
  topic: string,
  angle: string,
  tableRows: readonly (readonly string[])[],
  extraSection: string,
): AuthorityClusterPage {
  const path = pagePath(REX_BASE, slug);
  return {
    cluster: "rex-pn",
    slug,
    path,
    title:
      slug === "overview"
        ? `REx-PN Exam Prep (2026) — Canadian Practical Nurse Licensure | NurseNest`
        : `${topic} (2026) — REx-PN Prep | NurseNest`,
    description:
      slug === "overview"
        ? `Prepare for the REx-PN with CAT-adaptive practice questions, client needs category review, Canadian RPN pharmacology, and rationale-first study content. Pass the 2026 REx-PN.`
        : `${topic} for REx-PN preparation — client needs categories, Canadian RPN clinical scope, CAT strategy, pharmacology safety, and rationale-driven practice questions.`,
    h1: slug === "overview" ? "REx-PN exam prep for Canadian practical nurses (2026)" : `${topic} for REx-PN preparation`,
    eyebrow: "Canadian RPN entry-to-practice exam — 2026 authority guide",
    lead: `Use this REx-PN guide to connect ${angle} with practical nursing decisions in Canada. REx-PN success depends on recognizing client needs, safety priorities, therapeutic communication, medication risk, delegation limits, and when a stable-looking scenario is actually changing.`,
    examTerms: ["REx-PN", "RPN", "client needs", "CAT", "practical nursing", "clinical judgment"],
    ctas: rexCtas,
    table: {
      caption: `${topic}: what to practise`,
      columns: ["Client-needs lens", "What the item is testing", "Best NurseNest follow-up"],
      rows: tableRows,
    },
    sections: [
      {
        heading: "How this topic shows up on REx-PN items",
        body: [
          `REx-PN questions often look simple until the client-needs cue changes the priority. For ${topic.toLowerCase()}, practise identifying whether the stem is really asking about physiological adaptation, reduction of risk potential, safe and effective care environment, or psychosocial integrity.`,
          "The strongest review pattern is not “why was A correct?” but “which client is least stable, which finding is most urgent, and which option fits practical nursing scope right now?” That keeps practice tied to the exam rather than to generic PN content.",
        ],
      },
      {
        heading: "Case-based example",
        body: [
          `A post-operative client reports a new symptom while another client has a familiar chronic complaint. In a ${topic.toLowerCase()} question, the best answer usually follows acuity, risk of harm, and expected versus unexpected findings before convenience or routine task order.`,
          "When reviewing the rationale, write a one-sentence rule in plain language: the cue, the risk, and the action. Reusing that rule in future question blocks is how REx-PN practice becomes faster without becoming careless.",
        ],
      },
      {
        heading: "CAT and practice strategy",
        body: [
          "Because REx-PN uses computerized adaptive testing, learners should practise both targeted remediation and mixed exam-mode sessions. Targeted blocks help repair weak concepts; CAT-style sessions train stamina, uncertainty tolerance, and disciplined answer selection when item difficulty changes.",
          extraSection,
        ],
      },
    ],
    mistakes: [
      "Answering from memorized facts before deciding which client need the question is targeting.",
      "Forgetting that Canadian RPN scope and workplace context are not identical to US NCLEX-PN prep language.",
      "Over-practising only easy recall cards and skipping rationale review for higher-risk clinical vignettes.",
      "Changing answers late without identifying a concrete cue that makes the original choice unsafe.",
    ],
    examDay: [
      "Expect uncertainty; CAT sessions may feel harder as the algorithm estimates ability.",
      "Read the final sentence first only to orient the task, then return to the stem for safety cues.",
      "Use ABCs, Maslow, acute versus chronic, expected versus unexpected, and scope as ordered filters.",
      "Do not infer extra data that the stem does not give you.",
    ],
    faq: commonFaq("REx-PN", `${REX_BASE}/questions`, "REx-PN preparation should include CAT-style practice plus targeted remediation so you are ready for adaptive difficulty and client-needs switching."),
    whatYoullLearn: [
      `How ${topic} is tested across REx-PN client needs categories`,
      "Why Canadian RPN scope of practice differs from US NCLEX-PN preparation",
      "The priority framework that resolves most client-needs questions correctly",
      "A CAT-aligned practice strategy — targeted remediation plus mixed sessions",
    ],
    whoThisIsFor:
      "Canadian practical nursing graduates preparing for the REx-PN, bridging-programme students, and internationally educated nurses completing Canadian registration requirements who need to understand the REx-PN's client needs framework and CAT format.",
    studyOrder: [
      "Complete a 30-question mixed client-needs diagnostic to identify your weakest category",
      "Review the lesson for each missed concept — write the client need and the safety rule",
      "Practise a targeted block of 20 questions in your weakest client needs area",
      "Rotate to CAT-style mixed sessions after two targeted blocks",
      "Track miss patterns by client need — group errors, not individual questions",
    ],
    nextSteps: [
      { label: "REx-PN practice questions", href: `${REX_BASE}/questions` },
      { label: "REx-PN CAT exam", href: `${REX_BASE}/cat` },
      { label: "REx-PN lessons", href: `${REX_BASE}/lessons` },
      { label: "REx-PN hub", href: REX_BASE },
    ],
    datePublished: "2026-01-15",
    dateModified: "2026-05-13",
  };
}

function buildRtPage(
  slug: string,
  topic: string,
  angle: string,
  tableRows: readonly (readonly string[])[],
  extraSection: string,
): AuthorityClusterPage {
  const path = pagePath(RT_BASE, slug);
  return {
    cluster: "respiratory-therapy",
    slug,
    path,
    title:
      slug === "overview"
        ? `Respiratory Therapy Exam Prep (2026) — NBRC TMC & RRT Practice | NurseNest`
        : `${topic} | RT Exam Prep 2026 — NurseNest`,
    description:
      slug === "overview"
        ? `Prepare for the NBRC TMC and RRT exams with ABG interpretation, mechanical ventilation practice, oxygen therapy drills, and clinical reasoning questions. 2026-aligned RT exam prep.`
        : `${topic} for RT exam preparation — ABG interpretation, ventilation reasoning, equipment decisions, clinical case practice, and rationale-first questions for NBRC candidates.`,
    h1:
      slug === "overview"
        ? "Respiratory therapy exam prep: NBRC TMC and RRT practice (2026)"
        : `${topic} for respiratory therapy exam prep`,
    eyebrow: "NBRC respiratory therapy exam — 2026 authority guide",
    lead: `Use this respiratory therapy guide to connect ${angle} with patient assessment, oxygenation, ventilation, airway risk, equipment decisions, and rationale-based practice. The page is built for learners who need more than range memorization: you should be able to explain what the data means and what to do next.`,
    examTerms: ["respiratory therapy", "ABG", "oxygen therapy", "mechanical ventilation", "airway management", "pulmonary function testing"],
    ctas: rtCtas,
    table: {
      caption: `${topic}: clinical decisions to practise`,
      columns: ["RT focus", "Clinical reasoning target", "Best NurseNest follow-up"],
      rows: tableRows,
    },
    sections: [
      {
        heading: "How this topic shows up in RT exam practice",
        body: [
          `Respiratory therapy questions rarely reward isolated memorization. For ${topic.toLowerCase()}, learners need to connect respiratory rate, work of breathing, SpO2, ABG values, breath sounds, ventilator graphics, contraindications, and escalation thresholds.`,
          "The safest answer is usually the one that improves oxygenation or ventilation while respecting the patient’s current risk. NurseNest frames RT practice around interpretation and next-step decisions, not spreadsheet-style range recall.",
        ],
      },
      {
        heading: "Case-based example",
        body: [
          `A patient with worsening dyspnea has a new ABG and a change in mental status. For ${topic.toLowerCase()}, first decide whether oxygenation, ventilation, airway protection, or equipment failure is the dominant problem. Then choose an intervention that is timely and measurable.`,
          "Rationale review should include what finding would make the answer wrong: rising CO2, poor seal, contraindication to non-invasive ventilation, secretion burden, hemodynamic instability, or a trend that demands escalation.",
        ],
      },
      {
        heading: "Clinical study loop",
        body: [
          "Start with interpretation, then practise intervention selection, then finish with reassessment. That three-step loop mirrors real respiratory care and prevents learners from stopping at naming the disorder.",
          extraSection,
        ],
      },
    ],
    mistakes: [
      "Memorizing ABG labels without deciding whether the patient needs oxygenation support, ventilatory support, or airway protection.",
      "Treating ventilator settings as isolated numbers instead of linking them to plateau pressure, tidal volume, synchrony, and gas exchange.",
      "Ignoring contraindications and safety checks before oxygen devices, suctioning, non-invasive ventilation, or airway procedures.",
      "Reviewing normal values without practising clinical trends and reassessment after intervention.",
    ],
    examDay: [
      "Expect calculations and interpretation to be embedded inside patient stories.",
      "Separate oxygenation failure from ventilation failure before selecting an intervention.",
      "Watch for fatigue, altered mental status, silent chest, hemodynamic instability, and inability to protect the airway.",
      "Choose answers that include reassessment when the intervention changes respiratory support.",
    ],
    faq: commonFaq("respiratory therapy", `${RT_BASE}/practice-questions`, "RT exam practice should include interpretation-heavy cases, ABG drills, oxygen device selection, airway safety, and ventilator reasoning."),
    whatYoullLearn: [
      `How ${topic} appears in NBRC TMC and RRT clinical simulation exam questions`,
      "The systematic interpretation approach that connects ABGs, SpO2, and clinical presentation",
      "Which interventions require safety checks before implementation",
      "How to build from interpretation to action to reassessment in RT practice questions",
    ],
    whoThisIsFor:
      "Respiratory therapy students preparing for the NBRC TMC exam, RRT candidates studying for the clinical simulation examination, and clinical educators who want rigorous case-based RT content aligned with current practice standards.",
    studyOrder: [
      "Start with ABG interpretation — pH, PaCO2, HCO3 — before any other topic",
      "Connect ABG findings to oxygenation and ventilation decisions",
      "Practice oxygen device selection with patient-specific constraints (COPD, post-operative, hypoxic drive)",
      "Add ventilator mode and settings reasoning after oxygenation is solid",
      "Finish with airway management, suctioning, and escalation judgment",
    ],
    nextSteps: [
      { label: "RT practice questions", href: `${RT_BASE}/practice-questions` },
      { label: "ABG interpretation", href: `${RT_BASE}/abgs` },
      { label: "Mechanical ventilation", href: `${RT_BASE}/mechanical-ventilation` },
      { label: "Oxygen therapy", href: `${RT_BASE}/oxygen-therapy` },
    ],
    highYieldTips: [
      "Always classify the ABG (acidosis vs alkalosis, respiratory vs metabolic) before looking at PaO2 or SpO2.",
      "An SpO2 of 88–92% is the target for COPD patients on supplemental oxygen — higher risks CO2 retention.",
      "High plateau pressure (>30 cmH2O) signals barotrauma risk — reduce tidal volume before increasing PEEP.",
      "When in doubt between two oxygen devices, choose the one that delivers a consistent FiO2 (Venturi mask beats simple mask for COPD).",
      "Silent chest in a known asthmatic is a critical finding — do not wait for wheeze to return.",
      "Suctioning must be preoxygenated, time-limited (<15 sec), and followed by immediate reassessment of SpO2.",
    ],
    datePublished: "2026-01-15",
    dateModified: "2026-05-13",
  };
}

export const AUTHORITY_CLUSTER_PAGES: readonly AuthorityClusterPage[] = [
  buildCnplePage("overview", "CNPLE exam prep", "advanced-practice assessment, diagnosis, prescribing, and Canadian NP scope", [
    ["Clinical judgment", "Prioritize risk, red flags, differential diagnosis, and follow-up safety.", "CNPLE clinical judgment"],
    ["Prescribing safety", "Choose therapy while checking contraindications, renal function, interactions, and monitoring.", "CNPLE pharmacology"],
    ["LOFT pacing", "Practise steady fixed-length timing instead of adaptive-test assumptions.", "CNPLE LOFT exam"],
  ], "For the overview page, build a weekly rotation that alternates mixed practice questions, Canadian NP lessons, and flashcards. The fastest gains usually come from reviewing why tempting management options are incomplete."),
  buildCnplePage("questions", "CNPLE practice questions", "case-based question practice with rationales and Canadian NP terminology", [
    ["Mixed diagnostic sets", "Expose weak domains before you over-study comfortable content.", "CNPLE question hub"],
    ["Rationale review", "Explain each distractor as a safety, scope, or completeness problem.", "Clinical judgment guide"],
    ["Timed sets", "Build stamina for a fixed-length exam experience.", "CNPLE simulation"],
  ], "Treat every miss as a clinical rule: cue, risk, action. Revisit the same concept after sleep to confirm it is retrieval, not short-term familiarity."),
  buildCnplePage("study-guide", "CNPLE study guide", "timeline planning, domain rotation, and weak-area remediation", [
    ["Weeks 1-3", "Baseline diagnostic plus core Canadian NP domain review.", "Lessons"],
    ["Weeks 4-8", "Focused prescribing, diagnostics, lifespan, and mental health rotations.", "Practice questions"],
    ["Weeks 9-12", "Timed simulation, flashcards, and final weak-domain repair.", "Simulation"],
  ], "A strong study plan protects mixed review. Do not wait until the final week to combine domains; integration is the skill CNPLE candidates most need."),
  buildCnplePage("case-based-questions", "CNPLE case-based questions", "unfolding patient scenarios and rationale-first clinical reasoning", [
    ["Initial cue", "Identify the unstable or high-risk finding before reading choices.", "Questions"],
    ["Decision point", "Pick the safest assessment, diagnostic, prescribing, referral, or teaching action.", "Clinical judgment"],
    ["Rationale", "Name the clue that makes each distractor weaker.", "Lessons"],
  ], "Case practice works best when you pause before the answer choices and predict what decision the stem is asking you to make."),
  buildCnplePage("provisional-registration", "CNPLE provisional registration", "practice planning during provisional registration and supervised transition", [
    ["Eligibility", "Confirm provincial requirements and CCRNR updates before scheduling.", "CNPLE hub"],
    ["Practice limits", "Separate exam prep from employer or regulator requirements.", "Study guide"],
    ["Documentation", "Track weak areas and remediation in a defensible study plan.", "Lessons"],
  ], "This page is educational, not regulatory advice. Use it to plan study around supervised practice while confirming current requirements with the relevant college."),
  buildCnplePage("loft-exam", "CNPLE LOFT exam format", "linear on-the-fly testing, fixed-length timing, and exam stamina", [
    ["LOFT", "Fixed-length item set; steady pacing matters.", "Simulation"],
    ["CAT", "Adaptive difficulty model; not the CNPLE preparation target.", "REx-PN CAT comparison"],
    ["Review", "Timed full-length practice plus domain remediation.", "Study guide"],
  ], "The key LOFT habit is controlled pacing. Flag hard items, keep moving, and return if time allows rather than spending disproportionate time on one stem."),
  buildCnplePage("pharmacology", "CNPLE pharmacology", "prescribing safety, interactions, contraindications, and monitoring", [
    ["Drug choice", "Indication, allergy, pregnancy, renal/hepatic function, and comorbidity.", "Practice questions"],
    ["Monitoring", "Labs, adverse effects, follow-up interval, and patient teaching.", "Flashcards"],
    ["Safety", "High-risk drugs, duplications, controlled substances, and interactions.", "Lessons"],
  ], "For every medication miss, write the safety screen you skipped. Pharmacology gains are fastest when learners review contraindication patterns rather than isolated drug facts."),
  buildCnplePage("clinical-judgment", "CNPLE clinical judgment", "advanced-practice decisions across diagnostics, treatment, and escalation", [
    ["Recognize cues", "Find the finding that changes urgency or diagnosis.", "Case-based questions"],
    ["Analyze cues", "Distinguish likely from dangerous and stable from unstable.", "Questions"],
    ["Take action", "Select diagnostics, therapy, referral, or monitoring that fits NP scope.", "Lessons"],
  ], "Clinical judgment improves when you narrate your reasoning. If you cannot explain why the action fits the cue, review the related lesson before doing more questions."),
  buildCnplePage("practice-questions", "CNPLE practice questions bank", "high-intent question practice for Canadian NP candidates who need exam-style application", [
    ["Diagnostic block", "Mixed primary care, pharmacology, diagnostics, and professional-role vignettes.", "Question bank"],
    ["Focused block", "A single weak domain with rationales and Canadian NP terminology.", "Study plan"],
    ["Exam-mode block", "Timed practice that protects pacing and decision stamina.", "LOFT exam format"],
  ], "Use this page when you are ready to move from reading to retrieval. The best conversion point is a question block followed by immediate lesson repair."),
  buildCnplePage("pharmacology-questions", "CNPLE pharmacology questions", "prescribing, monitoring, adverse effects, and contraindication practice", [
    ["Before prescribing", "Indication, allergy, pregnancy, renal function, hepatic risk, and interaction screen.", "Pharmacology"],
    ["After prescribing", "Monitoring labs, follow-up interval, teaching, and when to stop therapy.", "Practice questions"],
    ["High-risk choices", "Anticoagulants, opioids, insulin, antibiotics, steroids, and controlled substances.", "Flashcards"],
  ], "Pharmacology questions convert well when learners see why one safe prescribing cue changes the whole answer. Pair every medication miss with a safety-screen flashcard."),
  buildCnplePage("study-plan", "CNPLE study plan", "an 8 to 12 week plan for CNPLE diagnostics, prescribing, cases, and simulation", [
    ["Weeks 1-2", "Baseline diagnostic, blueprint mapping, and miss-log setup.", "Practice questions"],
    ["Weeks 3-8", "Rotating clinical domains, prescribing safety, and case review.", "Study guide"],
    ["Weeks 9-12", "Timed LOFT-style simulation, flashcards, and final weak-area repair.", "Simulation"],
  ], "The plan should keep active recall in every week. If a learner only rereads notes, they may feel prepared without proving exam-ready decision speed."),
  buildCnplePage("exam-format", "CNPLE exam format", "LOFT-style pacing, question types, timing, and readiness planning", [
    ["Format mindset", "Prepare for sustained fixed-length performance rather than adaptive difficulty.", "LOFT exam"],
    ["Question style", "Case-based prompts that test advanced assessment, treatment, and follow-up.", "Case-based questions"],
    ["Readiness evidence", "Stable timed performance plus fewer repeated reasoning errors.", "Practice exam"],
  ], "Format pages are high-intent because learners are close to scheduling. Use them to convert anxiety about logistics into timed practice and structured remediation."),
  buildCnplePage("soap-note-scenarios", "CNPLE SOAP note scenarios", "documentation-style clinical reasoning for NP assessment and management", [
    ["Subjective", "Chief concern, history, red flags, medications, allergies, and context.", "Case-based questions"],
    ["Objective", "Focused exam, vitals, diagnostics, and findings that change risk.", "Clinical judgment"],
    ["Assessment and plan", "Differential, working diagnosis, treatment, follow-up, and escalation.", "Lessons"],
  ], "SOAP-note scenarios help candidates practise organizing clinical data. The exam may not ask for a note, but the thinking structure improves case-based answers."),

  buildRexPage("overview", "REx-PN exam prep", "Canadian practical nursing scope, client needs, and adaptive exam strategy", [
    ["Client needs", "Identify the tested need before choosing an intervention.", "Client needs guide"],
    ["CAT practice", "Build comfort with adaptive difficulty and uncertainty.", "REx-PN CAT exam"],
    ["Pharmacology", "Medication safety, side effects, and teaching in RPN scope.", "Pharmacology questions"],
  ], "Use the overview to build a balanced routine: client-needs review, practice questions, targeted lessons, and CAT sessions after the foundation is stable."),
  buildRexPage("questions", "REx-PN practice questions", "client-needs question blocks with practical nursing rationales", [
    ["Physiological integrity", "Prioritize unstable cues and expected versus unexpected findings.", "Questions"],
    ["Safe care", "Choose fall, infection, medication, and delegation actions within scope.", "Lessons"],
    ["Psychosocial integrity", "Use therapeutic communication and safety assessment.", "Flashcards"],
  ], "The highest-yield habit is explaining why the wrong option is tempting. That reveals whether the miss came from content, scope, or priority-setting."),
  buildRexPage("study-guide", "REx-PN study guide", "weekly planning for Canadian RPN candidates", [
    ["Diagnostic week", "Mixed client-needs set plus miss log.", "Questions"],
    ["Repair weeks", "Lessons and flashcards for weak concepts.", "Lessons"],
    ["Exam-mode weeks", "CAT sessions, pacing, and final rationales.", "CAT"],
  ], "Keep a visible miss log. Group misses by client need, topic, and decision error so your next study block is targeted instead of emotionally reactive."),
  buildRexPage("cat", "REx-PN CAT exam", "adaptive testing strategy, stamina, and decision discipline", [
    ["Adaptive difficulty", "Items may feel harder as the estimate changes.", "CAT exam"],
    ["Time management", "Move steadily and avoid over-reading into the stem.", "Practice exam"],
    ["Review loop", "Convert misses into targeted lessons and flashcards.", "Study guide"],
  ], "CAT practice should not replace learning. Use it after targeted remediation to test readiness, not as your only source of instruction."),
  buildRexPage("pharmacology", "REx-PN pharmacology questions", "medication safety, side effects, contraindications, and teaching", [
    ["Before giving", "Allergy, vitals, labs, dose, route, and client understanding.", "Questions"],
    ["Teaching", "Expected effects, adverse effects, and when to report symptoms.", "Flashcards"],
    ["Escalation", "Hold, clarify, or report when cues are unsafe.", "Lessons"],
  ], "Review medication questions by safety screen: what should the practical nurse check before, during, and after administration?"),
  buildRexPage("client-needs", "REx-PN client needs", "exam blueprint thinking for Canadian practical nursing", [
    ["Safe environment", "Infection prevention, falls, restraints, and delegation.", "Lessons"],
    ["Health promotion", "Teaching, screening, and lifestyle support.", "Flashcards"],
    ["Physiological integrity", "Acuity, complications, and treatment response.", "Questions"],
  ], "Client-needs framing stops random studying. Label each miss by the need being tested so weak categories become obvious."),
  buildRexPage("practice-exam", "REx-PN practice exam", "timed exam-mode practice with rationales and remediation", [
    ["Before", "Review safety frameworks and set a realistic time block.", "Study guide"],
    ["During", "Use scope, acuity, and expected/unexpected filters.", "CAT exam"],
    ["After", "Sort misses into content gaps and strategy errors.", "Questions"],
  ], "Do not judge readiness from one score. Readiness is a trend: fewer repeated misses, better pacing, and cleaner rationales."),
  buildRexPage("test-plan", "REx-PN test plan", "client-needs domains and study prioritization", [
    ["Map domains", "Client needs become weekly study buckets.", "Client needs guide"],
    ["Sample each bucket", "Use question blocks to expose actual weak areas.", "Questions"],
    ["Retest", "Confirm improvement with mixed sets.", "Practice exam"],
  ], "The test plan is most useful when it becomes your study calendar. Rotate categories, then increase mixed practice as the exam approaches."),
  buildRexPage("practice-questions", "REx-PN practice questions bank", "high-intent Canadian practical nursing question practice with rationales", [
    ["Mixed client-needs sets", "Expose gaps across safety, psychosocial, health promotion, and physiological categories.", "Question bank"],
    ["Rationale review", "Turn each miss into a scope, priority, or content rule.", "Study plan"],
    ["CAT transition", "Move from targeted sets into adaptive-style mixed sessions.", "CAT simulation"],
  ], "This is the strongest conversion pa