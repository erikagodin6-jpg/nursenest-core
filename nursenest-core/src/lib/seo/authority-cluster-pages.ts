export type AuthorityClusterKey = "cnple" | "rex-pn" | "respiratory-therapy";

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
        ? `Prepare for the 2026 CNPLE with 1,463 NP lessons, 2,838+ practice questions, 1,561 flashcards, and LOFT-style simulation. Canadian NP clinical reasoning, prescribing safety, and differential diagnosis — aligned to CCRNR competency frameworks.`
        : `${topic} for CNPLE preparation — Canadian NP clinical reasoning, prescribing safety, LOFT pacing, common mistakes, and rationale-first practice questions.`,
    h1: slug === "overview" ? "CNPLE exam prep for Canadian nurse practitioners (2026)" : `${topic} for CNPLE preparation`,
    eyebrow: "Canadian NP licensure exam — 2026 authority guide",
    lead:
      slug === "overview"
        ? `NurseNest includes 1,463 CNPLE-aligned NP lessons, 2,838+ practice questions, 1,561 flashcards, and a LOFT-style simulation experience built for Canadian nurse practitioner licensure. Content covers prescribing safety, differential diagnosis, diagnostics, lifespan care, women's health, mental health, and professional practice — all framed around fixed-length CNPLE exam reasoning, not adaptive CAT.`
        : `Use this CNPLE guide to connect ${angle} with Canadian nurse practitioner exam reasoning. The goal is not memorizing isolated facts. It is learning to move from patient cues to differential diagnosis, prescribing decisions, diagnostic selection, escalation, follow-up, and documentation under a fixed-length LOFT-style testing experience.`,
    examTerms:
      slug === "overview"
        ? ["CNPLE", "Canadian NP", "LOFT simulation", "1,463 lessons", "2,838+ questions", "1,561 flashcards", "prescribing safety"]
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
    whatYoullLearn: [
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
    dateModified: "2026-05-12",
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
    dateModified: "2026-05-12",
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
    dateModified: "2026-05-12",
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
  ], "This is the strongest conversion page for REx-PN learners because question practice reveals whether the learner can apply safe practical-nursing judgment under pressure."),
  buildRexPage("delegation-questions", "REx-PN delegation questions", "assignment, supervision, scope, and safety decisions for practical nursing", [
    ["Scope", "Separate what the RPN can do, what requires RN/provider escalation, and what can be assigned.", "Client needs"],
    ["Stability", "Delegate predictable tasks only when the client and outcome are stable.", "Priority questions"],
    ["Follow-up", "Know what must be reported back and what requires reassessment.", "Practice questions"],
  ], "Delegation questions work best when learners name the task, the client condition, and the supervision requirement before reading answer choices."),
  buildRexPage("priority-questions", "REx-PN priority questions", "which client to see first, what to do next, and what finding changes urgency", [
    ["Acuity", "Unstable, new, unexpected, or worsening findings outrank chronic stable problems.", "Practice questions"],
    ["Frameworks", "ABCs, safety, infection risk, Maslow, and expected versus unexpected cues.", "Study guide"],
    ["Scope", "Pick the action a Canadian practical nurse should take now.", "CAT simulation"],
  ], "Priority pages attract high-intent searchers because prioritization feels unpredictable. The fix is not more acronyms; it is repeated cue-to-action practice."),
  buildRexPage("pharmacology-questions", "REx-PN pharmacology questions bank", "medication administration, teaching, adverse effects, and safety checks", [
    ["Pre-administration", "Allergy, vitals, labs, dose, route, rights, and client readiness.", "Pharmacology"],
    ["Teaching", "Expected effects, side effects, missed doses, and when to call for help.", "Flashcards"],
    ["Escalation", "Hold, clarify, or report when the medication is unsafe.", "Practice questions"],
  ], "Medication questions convert when learners see a concrete safety check they missed. Pair the question block with flashcards for repeated medication cues."),
  buildRexPage("study-plan", "REx-PN study plan", "a practical weekly REx-PN plan for client needs, CAT practice, and remediation", [
    ["Week 1", "Baseline mixed diagnostic and client-needs miss log.", "Practice questions"],
    ["Weeks 2-6", "Weak-category lessons, pharmacology, priority, and delegation drills.", "Study guide"],
    ["Final weeks", "CAT simulation, mixed practice, and repeated-error cleanup.", "CAT exam"],
  ], "A strong REx-PN plan is measurable: fewer repeated misses by client need, cleaner priority decisions, and steadier CAT performance."),
  buildRexPage("cat-simulation", "REx-PN CAT simulation", "adaptive-style practice strategy, readiness signals, and exam stamina", [
    ["Before CAT", "Repair known weak categories so the session measures readiness, not avoidable gaps.", "Study plan"],
    ["During CAT", "Expect changing item difficulty and avoid emotional score-guessing.", "CAT exam"],
    ["After CAT", "Sort misses by client need, topic, and reasoning error.", "Practice questions"],
  ], "CAT simulation is a conversion-ready page because learners want readiness evidence. The safest message is honest: CAT practice works only when paired with remediation."),

  buildRtPage("overview", "Respiratory therapy exam prep", "RT assessment, gas exchange, airway safety, and equipment decisions", [
    ["Assessment", "Work of breathing, breath sounds, SpO2, mental status, and trend.", "Practice questions"],
    ["Gas exchange", "ABG interpretation plus oxygenation and ventilation decisions.", "ABG practice"],
    ["Intervention", "Oxygen device, airway support, ventilation, suctioning, or escalation.", "Lessons"],
  ], "RT learners should practise interpretation plus action. Naming a disorder is only half of the exam task; the next safest step is the other half."),
  buildRtPage("exam-prep", "Respiratory therapy exam prep plan", "weekly RT study structure with interpretation and interventions", [
    ["Week 1", "Baseline ABG, oxygen, airway, and ventilation questions.", "Practice questions"],
    ["Middle phase", "Target weak modalities with lessons and drills.", "Lessons"],
    ["Final phase", "Mixed cases with equipment and reassessment decisions.", "Ventilator training"],
  ], "A strong RT plan alternates calculations, interpretation, and scenario practice so formulas stay connected to clinical decisions."),
  buildRtPage("practice-questions", "Respiratory therapy practice questions", "case-based RT questions with rationales", [
    ["ABGs", "Acid-base, compensation, oxygenation, and next step.", "ABG drills"],
    ["Airway", "Patency, suctioning, escalation, and safety checks.", "Airway management"],
    ["Ventilation", "Settings, alarms, waveforms, and patient response.", "Mechanical ventilation"],
  ], "After each question, decide whether the miss was interpretation, equipment knowledge, or escalation judgment. Those are different fixes."),
  buildRtPage("abgs", "Respiratory therapy ABG practice questions", "ABG interpretation and clinical action", [
    ["pH", "Acidemia or alkalemia as the starting point.", "Practice questions"],
    ["PaCO2/HCO3", "Respiratory versus metabolic driver and compensation.", "Lessons"],
    ["PaO2/SpO2", "Oxygenation problem and support decision.", "Oxygen therapy"],
  ], "ABG mastery means linking numbers to the patient. A compensated result still requires clinical context before deciding whether to intervene."),
  buildRtPage("ventilation", "Respiratory therapy ventilation fundamentals", "ventilation physiology, control of breathing, hypoventilation, and respiratory support decisions", [
    ["Physiology", "Minute ventilation, dead space, V/Q ratio, and gas exchange.", "Practice questions"],
    ["Hypoventilation", "Rising PaCO2, hypoxemia, and support escalation triggers.", "ABGs"],
    ["Support", "NIV, high-flow, intubation decision, and reassessment.", "Oxygen therapy"],
  ], "Ventilation fundamentals anchor the rest of RT decision-making. Connect physiology to ABG pattern before selecting or adjusting a support level."),
  buildRtPage("mechanical-ventilation", "Mechanical ventilation review", "ventilator settings, alarms, graphics, and patient-ventilator safety", [
    ["Settings", "Mode, tidal volume, rate, FiO2, PEEP, and pressure limits.", "Ventilator training"],
    ["Alarms", "High pressure, low pressure, apnea, and disconnection reasoning.", "Practice questions"],
    ["Graphics", "Synchrony, obstruction, leak, and auto-PEEP patterns.", "Waveform scenarios"],
  ], "Ventilator questions reward cause-and-effect reasoning. Connect the alarm or waveform to patient assessment before changing a setting."),
  buildRtPage("oxygen-therapy", "Oxygen therapy review", "device selection, titration, and safety", [
    ["Device", "Nasal cannula, simple mask, Venturi, non-rebreather, high-flow, or NIV.", "Practice questions"],
    ["Goal", "Target oxygenation without ignoring ventilation or fatigue.", "ABGs"],
    ["Safety", "Fire risk, humidification, skin breakdown, and reassessment.", "Lessons"],
  ], "Oxygen therapy is not just raising FiO2. Reassess work of breathing, CO2 retention risk, mental status, and whether a higher level of support is needed."),
  buildRtPage("airway-management", "Airway management review", "airway assessment, suctioning, adjuncts, and escalation", [
    ["Patency", "Obstruction, secretions, stridor, trauma, or altered mental status.", "Practice questions"],
    ["Intervention", "Positioning, suction, adjunct, bag-mask, advanced airway, or escalation.", "Lessons"],
    ["Reassessment", "Breath sounds, SpO2, ETCO2, chest rise, and patient response.", "Ventilator training"],
  ], "Airway management questions often hinge on what must happen before equipment details: positioning, calling help, preoxygenation, and reassessment."),
  buildRtPage("pulmonary-function-testing", "Pulmonary function testing review", "spirometry patterns, restriction, obstruction, and interpretation", [
    ["Obstruction", "FEV1/FVC reduction, bronchodilator response, and symptom context.", "Practice questions"],
    ["Restriction", "Reduced volumes and clinical correlation.", "Lessons"],
    ["Quality", "Effort, repeatability, contraindications, and test coaching.", "Exam prep"],
  ], "PFT interpretation should connect pattern to patient story. Do not label a curve without checking quality and clinical context."),
  buildRtPage("abg-practice-questions", "ABG practice questions", "high-intent ABG interpretation questions for respiratory therapy students", [
    ["Classification", "pH, PaCO2, HCO3, compensation, and oxygenation status.", "ABG drills"],
    ["Clinical link", "Connect the ABG to work of breathing, mental status, and intervention.", "Practice questions"],
    ["Reassessment", "Predict the ABG or SpO2 change after oxygen or ventilator support.", "Oxygen therapy"],
  ], "ABG question pages attract learners with immediate pain. Keep the workflow simple: classify, connect to patient status, choose action, then reassess."),
  buildRtPage("mechanical-ventilation-questions", "Mechanical ventilation questions", "ventilator settings, alarms, waveform reasoning, and safety decisions", [
    ["Mode reasoning", "What the ventilator controls and what the patient contributes.", "Ventilator modes"],
    ["Alarm response", "High pressure, low pressure, apnea, leak, obstruction, and disconnection.", "Mechanical ventilation"],
    ["Lung protection", "Tidal volume, plateau pressure, PEEP, FiO2, and ARDS risk.", "ARDS review"],
  ], "Ventilator question pages should make equipment feel clinical, not mechanical. Every setting must connect to gas exchange, pressure, synchrony, or safety."),
  buildRtPage("oxygen-therapy-questions", "Oxygen therapy questions", "oxygen device selection, FiO2 targets, escalation, and reassessment", [
    ["Device choice", "Nasal cannula, Venturi, non-rebreather, high-flow, CPAP, or BiPAP.", "Oxygen therapy"],
    ["Target", "Oxygenation goal, COPD risk, and signs of ventilatory failure.", "ABG practice questions"],
    ["Escalation", "When oxygen is insufficient and ventilatory or airway support is needed.", "Airway scenarios"],
  ], "Oxygen pages convert because they tie quick device recall to real patient decisions. The answer is not always more FiO2; sometimes it is ventilation or airway support."),
  buildRtPage("ventilator-modes", "Ventilator modes quick review", "volume control, pressure control, SIMV, pressure support, CPAP, and BiPAP", [
    ["Volume control", "Preset tidal volume; pressure varies with compliance and resistance.", "Mechanical ventilation questions"],
    ["Pressure control", "Preset pressure; tidal volume varies with mechanics.", "ARDS review"],
    ["Spontaneous support", "Pressure support, CPAP, BiPAP, and weaning readiness.", "Practice questions"],
  ], "Ventilator-mode content is backlinkable when it is practical. Learners need the mode, what changes, what stays controlled, and what alarm pattern matters."),
  buildRtPage("ards-review", "ARDS review for respiratory therapy", "oxygenation failure, lung-protective ventilation, PEEP, and escalation", [
    ["Recognition", "Refractory hypoxemia, bilateral infiltrates, low compliance, and high FiO2 needs.", "ABG questions"],
    ["Lung protection", "Low tidal volume, plateau pressure monitoring, PEEP, and permissive hypercapnia.", "Ventilator modes"],
    ["Escalation", "Proning, recruitment considerations, hemodynamics, and team escalation.", "Mechanical ventilation"],
  ], "ARDS review should stay clinically grounded: oxygenation is the problem, but unsafe pressure strategy can create a second problem."),
  buildRtPage("airway-management-scenarios", "Airway management scenarios", "suctioning, adjuncts, bag-mask ventilation, intubation preparation, and reassessment", [
    ["Initial assessment", "Patency, obstruction, secretions, stridor, mental status, and work of breathing.", "Airway management"],
    ["Intervention", "Position, suction, adjunct, BVM, advanced airway preparation, or escalation.", "Practice questions"],
    ["Confirmation", "Chest rise, breath sounds, SpO2, ETCO2, and ongoing reassessment.", "Mechanical ventilation"],
  ], "Scenario pages are high-value because airway decisions are time-sensitive. The right answer often starts before the advanced device: positioning, oxygenation, and calling help."),
] as const;

const byPath = new Map(AUTHORITY_CLUSTER_PAGES.map((page) => [page.path, page]));
const byClusterSlug = new Map(AUTHORITY_CLUSTER_PAGES.map((page) => [`${page.cluster}:${page.slug}`, page]));

export function listAuthorityClusterPages(): readonly AuthorityClusterPage[] {
  return AUTHORITY_CLUSTER_PAGES;
}

export function listAuthorityClusterPaths(): string[] {
  return AUTHORITY_CLUSTER_PAGES.map((page) => page.path);
}

export function getAuthorityClusterPageByPath(path: string): AuthorityClusterPage | undefined {
  return byPath.get(path);
}

export function getAuthorityClusterPage(cluster: AuthorityClusterKey, slug: string): AuthorityClusterPage | undefined {
  return byClusterSlug.get(`${cluster}:${slug}`);
}

export function listAuthorityClusterSiblings(page: AuthorityClusterPage): AuthorityClusterPage[] {
  return AUTHORITY_CLUSTER_PAGES.filter((candidate) => candidate.cluster === page.cluster && candidate.path !== page.path);
}
