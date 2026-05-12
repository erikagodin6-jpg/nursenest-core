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
  return [
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
    title: `${topic} for CNPLE prep | Canadian NP exam | NurseNest`,
    description: `${topic} for CNPLE preparation with Canadian NP clinical judgment, prescribing safety, LOFT-style pacing, case reasoning, common mistakes, FAQs, and practice links.`,
    h1: slug === "overview" ? "CNPLE exam prep for Canadian nurse practitioners" : `${topic} for CNPLE preparation`,
    eyebrow: "Canadian NP licensure exam authority hub",
    lead: `Use this CNPLE guide to connect ${angle} with Canadian nurse practitioner exam reasoning. The goal is not memorizing isolated facts. It is learning to move from patient cues to differential diagnosis, prescribing decisions, diagnostic selection, escalation, follow-up, and documentation under a fixed-length LOFT-style testing experience.`,
    examTerms: ["CNPLE", "Canadian NP", "LOFT", "clinical judgment", "prescribing safety", "differential diagnosis"],
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
    title: `${topic} for REx-PN prep | Canadian RPN exam | NurseNest`,
    description: `${topic} for REx-PN preparation with client needs, Canadian practical nursing scope, CAT strategy, pharmacology, practice questions, FAQs, and study links.`,
    h1: slug === "overview" ? "REx-PN exam prep for Canadian practical nurses" : `${topic} for REx-PN preparation`,
    eyebrow: "Canadian RPN licensure exam authority hub",
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
    title: `${topic} for respiratory therapy exam prep | NurseNest`,
    description: `${topic} for respiratory therapy students with ABG interpretation, oxygenation, ventilation, airway safety, practice questions, FAQs, and clinical reasoning links.`,
    h1: slug === "overview" ? "Respiratory therapy exam prep and practice questions" : `${topic} for respiratory therapy exam prep`,
    eyebrow: "Respiratory therapy authority hub",
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
