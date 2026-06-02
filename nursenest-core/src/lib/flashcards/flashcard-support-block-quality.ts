export type FlashcardSupportBlockKind =
  | "hint"
  | "clinicalPearl"
  | "memoryHook"
  | "whyThisMatters"
  | "nclexTakeaway";

export type FlashcardSupportBlockContext = {
  stem?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  answerText?: string | null;
  correctLetter?: string | null;
  rationale?: string | null;
  pathwayLabel?: string | null;
};

export type FlashcardSupportBlockValidation = {
  pass: boolean;
  issues: string[];
};

const PLACEHOLDER_PHRASES = [
  /\bconcept being tested\b/i,
  /\bconnect it directly\b/i,
  /\bmatch the answer choice\b/i,
  /\bgeneric priority framework\b/i,
  /\bis correct because\b/i,
  /\bclinical reasoning is\b/i,
  /\bresponds to the priority cue\b/i,
  /\bchoose the best answer\b/i,
  /\bsupports safe care\b/i,
  /\busing the nursing process\b/i,
  /\bthis option does not address the priority assessment or intervention implied by the stem\b/i,
] as const;

const STOP_WORDS = new Set([
  "about",
  "above",
  "after",
  "again",
  "answer",
  "because",
  "before",
  "being",
  "between",
  "client",
  "correct",
  "during",
  "first",
  "from",
  "have",
  "into",
  "most",
  "nurse",
  "patient",
  "priority",
  "should",
  "that",
  "their",
  "there",
  "these",
  "this",
  "through",
  "when",
  "which",
  "with",
  "would",
]);

function clean(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value: string | null | undefined): string {
  return clean(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value: string): number {
  return normalize(value).match(/\b[\p{L}\p{N}'-]+\b/gu)?.length ?? 0;
}

function sentenceCount(value: string): number {
  return clean(value).split(/[.!?]+/).filter((part) => part.trim().length >= 8).length;
}

function tokens(value: string | null | undefined): string[] {
  return normalize(value)
    .match(/\b[\p{L}\p{N}'-]+\b/gu)?.filter((token) => token.length >= 5 && !STOP_WORDS.has(token)) ?? [];
}

function containsFullAnswerText(text: string, answerText: string | null | undefined): boolean {
  const answer = normalize(answerText);
  if (!answer || answer.length < 7) return false;
  return normalize(text).includes(answer);
}

function repeatedAnswerTokens(text: string, answerText: string | null | undefined): number {
  const textTokens = new Set(tokens(text));
  return Array.from(new Set(tokens(answerText))).filter((token) => textTokens.has(token)).length;
}

function containsCorrectLetter(text: string, correctLetter: string | null | undefined): boolean {
  const letter = clean(correctLetter).replace(/[^A-Z]/gi, "").toUpperCase();
  if (!letter || letter.length !== 1) return false;
  return new RegExp(`\\b${letter}\\b[.)]?`, "i").test(text);
}

function contextText(input: FlashcardSupportBlockContext): string {
  return [input.stem, input.topic, input.subtopic, input.rationale].map(clean).filter(Boolean).join(" ");
}

type ClinicalContext =
  | "radiation"
  | "respiratory"
  | "cardiac"
  | "medication"
  | "maternity"
  | "delegation"
  | "infection"
  | "safety"
  | "endocrine"
  | "generic";

function detectClinicalContext(input: FlashcardSupportBlockContext): ClinicalContext {
  const all = normalize(contextText(input));
  if (/\b(radiation|chemotherapy|cancer|oncolog|irradiated)\b/.test(all)) return "radiation";
  if (/\b(oxygen|spo2|hypox|dyspnea|airway|breathing|respiratory|ventilat|copd)\b/.test(all)) return "respiratory";
  if (/\b(chest pain|stemi|troponin|ecg|cardiac|heart|dysrhythm|arrhythm)\b/.test(all)) return "cardiac";
  if (/\b(medication|dose|administer|drug|warfarin|heparin|opioid|digoxin|antibiotic)\b/.test(all)) return "medication";
  if (/\b(insulin|glucose|hypoglyc|hyperglyc|diabetes|endocrine)\b/.test(all)) return "endocrine";
  if (/\b(oxytocin|labor|uterine|fetal|postpartum|maternity|pregnan)\b/.test(all)) return "maternity";
  if (/\b(delegate|delegation|assignment|uap|psw|assistive personnel|scope)\b/.test(all)) return "delegation";
  if (/\b(infection|sepsis|fever|leukocyt|erythema|wound|antibiotic)\b/.test(all)) return "infection";
  if (/\b(fall|safety|bleeding|unstable|shock|deteriorat|urgent)\b/.test(all)) return "safety";
  return "generic";
}

const SUPPORT_TEXT: Record<ClinicalContext, Record<FlashcardSupportBlockKind, string>> = {
  radiation: {
    hint:
      "Cancer treatment often causes predictable symptoms over time. Decide which response addresses the main symptom while protecting tissue integrity and recovery.",
    clinicalPearl:
      "Radiation-related fatigue often accumulates over several weeks and can persist after therapy ends. Nurses should plan care around energy conservation, skin protection, hydration, nutrition, and realistic activity expectations.",
    memoryHook: "Radiation fatigue: protect and pace.",
    whyThisMatters:
      "Managing treatment-related fatigue supports quality of life, preserves activity tolerance, and helps patients complete therapy without avoidable complications or unnecessary distress.",
    nclexTakeaway:
      "For cancer-treatment items, prioritize interventions that manage expected side effects and protect sensitive tissue before choosing delayed or unrelated actions.",
  },
  respiratory: {
    hint:
      "Look for the cue that changes oxygenation or ventilation. Immediate safety usually comes before documentation, teaching, or delayed reassessment.",
    clinicalPearl:
      "New hypoxia can change quickly, especially with altered mentation or increased work of breathing. Nurses should trend response to positioning, oxygen delivery, and escalation needs rather than treating one value in isolation.",
    memoryHook: "Air first, paperwork later.",
    whyThisMatters:
      "Recognizing oxygenation changes early helps prevent respiratory fatigue, dysrhythmias, and delayed rescue while the underlying cause is assessed.",
    nclexTakeaway:
      "When a stem shows unstable oxygenation, prioritize the option that protects airway or breathing before routine tasks, teaching, or documentation.",
  },
  cardiac: {
    hint:
      "Identify whether the cue suggests perfusion, rhythm instability, or ischemia. The safest next step addresses time-sensitive circulation risk first.",
    clinicalPearl:
      "Cardiac deterioration often presents as a cluster of symptoms rather than one isolated finding. Chest discomfort, diaphoresis, rhythm change, hypotension, or biomarker elevation should prompt rapid escalation within scope.",
    memoryHook: "Perfusion cues move first.",
    whyThisMatters:
      "Early recognition of cardiac instability protects organ perfusion and reduces delays in escalation, monitoring, and time-sensitive treatment.",
    nclexTakeaway:
      "For cardiac priority items, weigh symptoms, rhythm, perfusion, and timing before selecting routine comfort measures or delayed reassessment.",
  },
  medication: {
    hint:
      "Use the safety data in the stem first: dose timing, labs, vital signs, allergies, expected effects, and signs that require clarification.",
    clinicalPearl:
      "Medication safety depends on matching the order to current assessment data. Nurses reduce harm by checking allergies, relevant labs, vital signs, interactions, hold parameters, and patient teaching before administration.",
    memoryHook: "Assess before administer.",
    whyThisMatters:
      "Medication decisions affect immediate safety, especially when assessment data suggest toxicity, contraindications, unstable vitals, or preventable adverse effects.",
    nclexTakeaway:
      "For medication questions, decide whether the data support administration, holding, or clarification before focusing on memorized drug facts.",
  },
  endocrine: {
    hint:
      "Focus on the trend and the patient’s current stability. Endocrine questions often hinge on symptoms, timing, glucose patterns, and safety risks.",
    clinicalPearl:
      "Endocrine problems often become urgent when trends shift quickly. Nurses should connect symptoms, intake, medications, glucose values, fluid status, and mental status before deciding whether routine care is enough.",
    memoryHook: "Trend, symptoms, safety.",
    whyThisMatters:
      "Timely endocrine assessment prevents delayed treatment of hypoglycemia, dehydration, altered mentation, medication errors, and avoidable deterioration.",
    nclexTakeaway:
      "For endocrine items, interpret the value with symptoms and timing; do not choose a routine action when instability is present.",
  },
  maternity: {
    hint:
      "Distinguish findings that maintain pregnancy from findings that create contraction, bleeding, fetal stress, or immediate maternal safety concerns.",
    clinicalPearl:
      "Maternity care requires linking maternal physiology with fetal response. Nurses monitor contraction pattern, uterine tone, bleeding, pain, vital signs, and fetal tolerance when clinical conditions change.",
    memoryHook: "Mother and fetus trend together.",
    whyThisMatters:
      "Connecting maternal cues with fetal response helps nurses recognize deterioration, prevent delayed escalation, and support safer obstetric outcomes.",
    nclexTakeaway:
      "For maternity questions, match the physiologic cue to maternal-fetal risk before choosing familiar but lower-priority interventions.",
  },
  delegation: {
    hint:
      "Sort the task by stability, predictability, assessment needs, teaching needs, and scope. Unstable or changing clients need licensed judgment.",
    clinicalPearl:
      "Delegation is safest when the task is routine, the patient is stable, and expected outcomes are predictable. Assessment, initial teaching, evaluation, and clinical judgment remain licensed responsibilities.",
    memoryHook: "Stable, routine, delegate.",
    whyThisMatters:
      "Appropriate delegation protects patients from missed assessment changes while allowing the team to use each role efficiently and safely.",
    nclexTakeaway:
      "For delegation items, keep assessment, teaching, evaluation, and unstable findings with the nurse; delegate predictable tasks for stable clients.",
  },
  infection: {
    hint:
      "Cluster local and systemic cues. Infection questions often require separating expected inflammation from signs that suggest spreading or worsening illness.",
    clinicalPearl:
      "Infection may appear as fever, localized warmth, drainage, rising white blood cells, altered mentation, or hemodynamic change. Trend recognition helps nurses escalate before sepsis becomes obvious.",
    memoryHook: "Local signs plus systemic risk.",
    whyThisMatters:
      "Early infection recognition supports timely cultures, antimicrobials, source control, isolation decisions, and prevention of avoidable deterioration.",
    nclexTakeaway:
      "For infection items, compare local findings with systemic instability; escalating deterioration outweighs routine teaching or delayed reassessment.",
  },
  safety: {
    hint:
      "Identify the cue most likely to cause harm if delayed. Safety questions reward acting before the problem becomes harder to reverse.",
    clinicalPearl:
      "Patient safety decisions often depend on timing. Nurses reduce harm by recognizing early deterioration, preventing predictable injury, and escalating changes before routine tasks take priority.",
    memoryHook: "Prevent harm before polish.",
    whyThisMatters:
      "Prioritizing immediate safety reduces falls, bleeding, delayed rescue, medication harm, and preventable complications during real patient care.",
    nclexTakeaway:
      "When options all seem reasonable, choose the one that prevents the most immediate harm within the nurse’s scope.",
  },
  generic: {
    hint:
      "Identify the patient cue that changes risk. Then choose the response that addresses that cue before lower-priority information.",
    clinicalPearl:
      "Bedside reasoning improves when nurses connect an abnormal cue to the next assessment, safety risk, and escalation threshold instead of treating facts in isolation.",
    memoryHook: "Cue first, action next.",
    whyThisMatters:
      "Patient outcomes improve when nurses recognize which cue changes urgency and act before a stable problem becomes a delayed rescue event.",
    nclexTakeaway:
      "On exam items, compare options by risk, timing, and scope before choosing the most familiar intervention.",
  },
};

const WORD_RANGES: Record<FlashcardSupportBlockKind, readonly [number, number]> = {
  hint: [15, 40],
  clinicalPearl: [25, 75],
  memoryHook: [5, 20],
  whyThisMatters: [20, 60],
  nclexTakeaway: [15, 40],
};

function fallbackFor(kind: FlashcardSupportBlockKind, input: FlashcardSupportBlockContext): string {
  const support = SUPPORT_TEXT[detectClinicalContext(input)] ?? SUPPORT_TEXT.generic;
  return support[kind];
}

export function validateFlashcardSupportBlock(
  kind: FlashcardSupportBlockKind,
  text: string | null | undefined,
  input: FlashcardSupportBlockContext = {},
): FlashcardSupportBlockValidation {
  const value = clean(text);
  const issues: string[] = [];
  const [minWords, maxWords] = WORD_RANGES[kind];
  const count = wordCount(value);

  if (!value) issues.push("missing");
  if (count < minWords) issues.push(`too_short:${count}`);
  if (count > maxWords) issues.push(`too_long:${count}`);
  if (PLACEHOLDER_PHRASES.some((pattern) => pattern.test(value))) issues.push("placeholder_phrase");
  if (sentenceCount(value) > 3 && kind !== "clinicalPearl") issues.push("too_many_sentences");
  if (containsFullAnswerText(value, input.answerText)) issues.push("answer_phrase_repeated");

  const answerOverlap = repeatedAnswerTokens(value, input.answerText);
  if (kind === "hint") {
    if (answerOverlap > 0) issues.push("hint_reveals_answer_token");
    if (containsCorrectLetter(value, input.correctLetter)) issues.push("hint_reveals_answer_letter");
  } else if (answerOverlap >= 3) {
    issues.push("answer_text_echo");
  }

  if (kind === "nclexTakeaway" && !/\b(exam|NCLEX|REx|CNPLE|stem|priority|option|cue|scope|question|items?)\b/i.test(value)) {
    issues.push("missing_exam_strategy");
  }
  if (kind === "whyThisMatters" && !/\b(patient|client|outcome|harm|safety|deteriorat|complication|quality|rescue|prevent)\b/i.test(value)) {
    issues.push("missing_patient_outcome");
  }

  return { pass: issues.length === 0, issues };
}

export function buildFlashcardSupportBlock(
  kind: FlashcardSupportBlockKind,
  input: FlashcardSupportBlockContext,
  authored?: string | null,
): string {
  const authoredText = clean(authored);
  if (authoredText && validateFlashcardSupportBlock(kind, authoredText, input).pass) {
    return authoredText;
  }
  return fallbackFor(kind, input);
}

export function buildFlashcardHint(input: FlashcardSupportBlockContext, authored?: string | null): string {
  return buildFlashcardSupportBlock("hint", input, authored);
}

export function buildFlashcardClinicalPearl(input: FlashcardSupportBlockContext, authored?: string | null): string {
  return buildFlashcardSupportBlock("clinicalPearl", input, authored);
}

export function buildFlashcardMemoryHook(input: FlashcardSupportBlockContext, authored?: string | null): string {
  return buildFlashcardSupportBlock("memoryHook", input, authored);
}

export function buildFlashcardWhyThisMatters(input: FlashcardSupportBlockContext, authored?: string | null): string {
  return buildFlashcardSupportBlock("whyThisMatters", input, authored);
}

export function buildFlashcardNclexTakeaway(input: FlashcardSupportBlockContext, authored?: string | null): string {
  return buildFlashcardSupportBlock("nclexTakeaway", input, authored);
}
