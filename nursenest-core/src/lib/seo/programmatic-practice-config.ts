/**
 * Conversion + education blocks for programmatic "practice questions" URLs.
 * Copy is English-only; extend with i18n if these pages are localized later.
 */

export type PracticeCategoryItem = {
  id: string;
  label: string;
  approximateCount: number;
  note: string;
};

export type PracticeRationaleExample = {
  stem: string;
  choices: string[];
  correctIndex: number;
  whyCorrect: string;
  whyIncorrect: string[];
  takeaway: string;
};

export type PracticeMistake = { title: string; body: string };

export type ProgrammaticPracticeConversionConfig = {
  valueLead: string;
  howToUse: string[];
  categories: PracticeCategoryItem[];
  rationale: PracticeRationaleExample;
  mistakes: PracticeMistake[];
};

const NCLEX: ProgrammaticPracticeConversionConfig = {
  valueLead:
    "Practice NCLEX-style questions and see exactly where you are losing marks. Short sets surface category gaps before you burn time on comfortable topics.",
  howToUse: [
    "Answer without looking up references first. Note if you guessed.",
    "Mark guesses so review time targets uncertainty, not ego.",
    "Read the rationale immediately after submit, even on correct items.",
    "Track weak areas in the report and rerun the same category until the pattern shifts.",
  ],
  categories: [
    {
      id: "safety-infection",
      label: "Safety and Infection Control",
      approximateCount: 1820,
      note: "Isolation, medsafety, injury prevention",
    },
    {
      id: "physiological",
      label: "Physiological Integrity",
      approximateCount: 4150,
      note: "Acute and chronic pathophysiology, procedures",
    },
    {
      id: "psychosocial",
      label: "Psychosocial Integrity",
      approximateCount: 980,
      note: "Therapeutic communication, mental health, grief",
    },
    {
      id: "health-promotion",
      label: "Health Promotion and Maintenance",
      approximateCount: 910,
      note: "Screening, growth and development, teaching",
    },
  ],
  rationale: {
    stem:
      "A nurse reviews four clients on a medical-surgical unit at the start of the shift. Which client should the nurse assess first?",
    choices: [
      "Adult post-op day 1 after cholecystectomy using a morphine PCA; drowsy, respiratory rate 9 breaths/min, SpO₂ 91% on room air",
      "Adult with heart failure and new onset confusion this morning, lungs with fine crackles bilaterally",
      "Adult with type 2 diabetes whose fasting glucose before breakfast was 198 mg/dL, asymptomatic",
      "Adult who is stable and asking for routine discharge teaching before noon discharge",
    ],
    correctIndex: 0,
    whyCorrect:
      "This client shows opioid-related respiratory depression with hypoxemia. Airway and breathing risk take priority over comfort needs of stable clients. Assessment first confirms work of breathing, level of consciousness, and need for escalation per protocol.",
    whyIncorrect: [
      "Heart failure with new confusion is urgent and needs timely assessment, but the first option shows immediate ventilatory compromise tied to recent opioids.",
      "Hyperglycemia without acute symptoms is important to address, yet it does not outrank unstable breathing in this set.",
      "Discharge teaching matters for flow, yet it waits when another client may lose airway safety in minutes.",
    ],
    takeaway:
      "On boards, first means first. When one option bundles respiratory depression plus hypoxemia, treat it as the immediate safety fork unless another option shows arrest-level instability.",
  },
  mistakes: [
    {
      title: "Choosing the busiest-looking answer instead of the safest",
      body: "Complex cases feel more important. If one option has unstable ABCs, it usually beats chronic issues that can be managed after stabilization.",
    },
    {
      title: "Missing priority cues in unstable clients",
      body: "Train yourself to underline vital sign trends and words like drowsy, new onset, or sudden before you read distractors.",
    },
    {
      title: "Changing answers after overthinking",
      body: "If your first pass matched a clear safety rule, pause before you swap. Second-guessing often trades a correct priority for a tempting detail.",
    },
  ],
};

const PN: ProgrammaticPracticeConversionConfig = {
  valueLead:
    "Practice PN-style questions and see where practical nursing scope and safety items cost you marks. Short runs beat long passive reading after shifts.",
  howToUse: [
    "Answer under time pressure when you can. Scope questions punish slow lookups.",
    "Tag guesses. Review rationales for those first.",
    "Link each miss to delegation, infection control, or stable versus unstable cues.",
    "Re-run the same category until your miss rate drops, not until you feel done.",
  ],
  categories: [
    { id: "foundation", label: "Foundation of practice", approximateCount: 620, note: "Scope, ethics, legal" },
    { id: "health-promotion", label: "Health promotion", approximateCount: 540, note: "Teaching, prevention" },
    { id: "physiological", label: "Physiological adaptation", approximateCount: 1480, note: "Acute and chronic care" },
    { id: "psychosocial", label: "Psychosocial integrity", approximateCount: 410, note: "Communication, support" },
  ],
  rationale: {
    stem:
      "A practical nurse is assigned to a group of clients. Which task is most appropriate for the PN to perform?",
    choices: [
      "Adjust IV pump rate after the RN changes the order",
      "Perform sterile dressing change per protocol after competency validation",
      "Develop the initial plan of care for a newly admitted client",
      "Administer first dose of a new IV antibiotic before the RN assesses",
    ],
    correctIndex: 1,
    whyCorrect:
      "Sterile dressing change within PN scope is appropriate when policy and competency support it. The PN does not independently titrate IV rates off new orders, author initial care plans, or give first doses of new IV meds without RN context per common scope rules.",
    whyIncorrect: [
      "Pump adjustments after order changes typically stay with RN oversight in many settings.",
      "Initial planning is RN scope in team models covered on exams.",
      "First-dose IV antibiotics usually require RN assessment first.",
    ],
    takeaway: "Exam items love scope edges. When tasks sound similar, pick the one your regulator would list as PN-appropriate in black and white.",
  },
  mistakes: [
    {
      title: "Assuming more tasks mean more responsibility",
      body: "Harder is not always yours. If two answers sound clinical, the one that stays inside PN scope wins.",
    },
    {
      title: "Ignoring delegation language",
      body: "Words like initial, first dose, or complex teaching often signal RN ownership.",
    },
    {
      title: "Skipping infection control basics",
      body: "PN exams still heavy-hand PPE sequence and transmission basics when you are tired.",
    },
  ],
};

const NP_CFG: ProgrammaticPracticeConversionConfig = {
  valueLead:
    "Practice NP-level cases and see where differential reasoning and management choices cost you marks. Long stems reward a disciplined read before you answer.",
  howToUse: [
    "Read the last line first so you know what the item is asking.",
    "Underline red flags and chronic baseline in one pass.",
    "Pick the option that matches the question stem, not the option that sounds most advanced.",
    "Review rationales for every alternative you ruled out too fast.",
  ],
  categories: [
    { id: "assessment", label: "Assessment and diagnosis", approximateCount: 890, note: "History, exam, differential" },
    { id: "plan", label: "Planning and intervention", approximateCount: 720, note: "Therapeutics, procedures" },
    { id: "professional", label: "Professional role", approximateCount: 310, note: "Ethics, systems, coordination" },
    { id: "population", label: "Population health", approximateCount: 240, note: "Prevention, follow-up" },
  ],
  rationale: {
    stem:
      "A 58-year-old with type 2 diabetes and hypertension reports two weeks of polyuria, polydipsia, and unintended weight loss. Random glucose in clinic is 342 mg/dL. BMI 31. No ketones on urinalysis. What is the best next step?",
    choices: [
      "Start basal-bolus insulin in clinic today",
      "Order hemoglobin A1c and basic metabolic panel to confirm chronic hyperglycemia and assess renal status",
      "Advise only low-carb diet and follow-up in six months",
      "Start metformin without labs because the presentation fits diabetes",
    ],
    correctIndex: 1,
    whyCorrect:
      "New hyperglycemia with classic symptoms needs confirmation and context before locking long-term therapy. A1c and renal function guide safe metformin use and urgency. Insulin may be needed later, but the stem does not show ketosis or acute crisis.",
    whyIncorrect: [
      "Immediate insulin may be premature without full metabolic picture unless DKA or severe hyperglycemia is present.",
      "Diet alone with delayed follow-up is unsafe with symptomatic hyperglycemia.",
      "Starting metformin without renal assessment risks contraindication.",
    ],
    takeaway:
      "NP items reward staged workup: confirm diagnosis, assess safety for meds, then align treatment to guidelines.",
  },
  mistakes: [
    {
      title: "Treating the most interesting diagnosis",
      body: "The exam wants the next safe step, not the rarest lecture topic.",
    },
    {
      title: "Skipping contraindications",
      body: "Renal function, pregnancy, and drug interactions often flip the correct answer.",
    },
    {
      title: "Over-documenting in your head",
      body: "If the stem gives you a glucose and symptoms, you still confirm chronicity before chronic therapy in many cases.",
    },
  ],
};

const BY_SLUG: Record<string, ProgrammaticPracticeConversionConfig> = {
  "nclex-rn-practice-questions": NCLEX,
  "nclex-pn-practice-questions": PN,
  "rex-pn-practice-questions": PN,
  "np-exam-practice-questions": NP_CFG,
  "cnple-practice-questions": NP_CFG,
};

export function getProgrammaticPracticeConversionConfig(slug: string): ProgrammaticPracticeConversionConfig | null {
  return BY_SLUG[slug] ?? null;
}

export function isProgrammaticPracticeConversionSlug(slug: string): boolean {
  return slug in BY_SLUG;
}
