export type ClinicalPearlDimension =
  | "bedsideUsefulness"
  | "clinicalJudgmentValue"
  | "escalationAwareness"
  | "patientSafetyRelevance"
  | "examRelevance"
  | "retentionValue";

export type ClinicalPearlGate = "fail" | "review" | "publish_eligible" | "flagship";

export type ClinicalPearlInput = {
  id?: string;
  pearl: string | null | undefined;
  pathway?: string | null;
  topic?: string | null;
  stem?: string | null;
};

export type ClinicalPearlScoreResult = {
  id?: string;
  score: 1 | 2 | 3 | 4 | 5;
  numericScore: number;
  gate: ClinicalPearlGate;
  dimensions: Record<ClinicalPearlDimension, number>;
  failureReasons: string[];
  strengths: string[];
  improvedVersion: string;
};

export const CLINICAL_PEARL_TARGET_AVERAGE = 4.5;

const BEDSIDE_PATTERNS = [
  /\b(assess|monitor|trend|reassess|report|notify|hold|administer|document|teach|position|delegate)\b/i,
  /\b(vital|SpO2|SpO₂|oxygen|lung sounds|blood pressure|heart rate|HR|urine output|mental status|pain|bleeding|pulse check|CPR)\b/i,
  /\b(lab|ECG|ABG|CBC|potassium|sodium|creatinine|hemoglobin|lactate|troponin|BNP|glucose)\b/i,
];

const JUDGMENT_PATTERNS = [
  /\b(cue|pattern|trend|red flag|early|late|expected|unexpected|stable|unstable|acute|chronic)\b/i,
  /\b(priorit|ABCs|airway|breathing|circulation|perfusion|oxygenation|clinical judgment)\b/i,
  /\b(compare|distinguish|differentiate|mimic|trap|tempting|rather than|not reassurance|context determines)\b/i,
];

const ESCALATION_PATTERNS = [
  /\b(escalat|notify|rapid response|provider|urgent|immediate|cannot wait|first)\b/i,
  /\b(deteriorat\w*|collapse|shock|sepsis|stroke|MI|hypox\w*|arrhythmia|hemorrhage|anaphylaxis|VT|VF|torsades|arrest)\b/i,
  /\b(failure-to-rescue|rescue|worsen|decompensat)\b/i,
];

const SAFETY_PATTERNS = [
  /\b(safety|harm|risk|complication|contraindicat|toxicity|high-alert|fall|aspiration|bleeding)\b/i,
  /\b(falling SpO2|low SpO2|hypox\w*|deteriorat\w*|unstable|decompensat\w*)\b/i,
  /\b(medication error|dose|hold parameter|allergy|interaction|monitoring|adverse effect)\b/i,
  /\b(if missed|delayed|can lead to|may result in|what happens)\b/i,
];

const EXAM_PATTERNS = [
  /\b(NCLEX|NGN|REx-PN|CNPLE|exam|SATA|bowtie|matrix|case study|CAT)\b/i,
  /\b(priority|first|best|most appropriate|delegation|scope|eliminate|shortcut|trap)\b/i,
];

const RETENTION_PATTERNS = [
  /\b(remember|think|when you see|if you see|rule|pearl|takeaway|watch for|red flag)\b/i,
  /\b(before|after|early|late|always check|never assume|trend beats snapshot)\b/i,
  /\b(months|shift|bedside|real world|practice)\b/i,
];

const GENERIC_PATTERNS = [
  /\bis important\b/i,
  /\bsupports safe care\b/i,
  /\bhelps the nurse\b/i,
  /\bremember this\b/i,
  /\bclinical judgment is important\b/i,
  /\bchoose the priority\b/i,
  /\bthis is a key concept\b/i,
];

const UNSAFE_ABSOLUTE_PATTERN = /\b(always|never|only|guaranteed|all patients|no patients)\b/i;

function plain(text: string | null | undefined): string {
  return String(text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function clampDimension(value: number): number {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function dimensionScore(text: string, patterns: RegExp[], base = 2): number {
  const hits = patterns.filter((pattern) => pattern.test(text)).length;
  return clampDimension(base + hits);
}

export function clinicalPearlGate(score: number): ClinicalPearlGate {
  if (score <= 2) return "fail";
  if (score === 3) return "review";
  if (score === 4) return "publish_eligible";
  return "flagship";
}

export function normalizeClinicalPearlForDuplicateDetection(pearl: string | null | undefined): string {
  return plain(pearl).toLowerCase().replace(/["'“”‘’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function scoreClinicalPearl(input: ClinicalPearlInput): ClinicalPearlScoreResult {
  const text = plain(input.pearl);
  const topic = plain(input.topic);
  const stem = plain(input.stem);
  const combined = `${text} ${topic} ${stem}`;
  const words = wordCount(text);
  const failureReasons: string[] = [];
  const strengths: string[] = [];

  const dimensions: Record<ClinicalPearlDimension, number> = {
    bedsideUsefulness: dimensionScore(combined, BEDSIDE_PATTERNS),
    clinicalJudgmentValue: dimensionScore(combined, JUDGMENT_PATTERNS),
    escalationAwareness: dimensionScore(combined, ESCALATION_PATTERNS, 1),
    patientSafetyRelevance: dimensionScore(combined, SAFETY_PATTERNS),
    examRelevance: dimensionScore(`${combined} ${plain(input.pathway)}`, EXAM_PATTERNS, 1),
    retentionValue: dimensionScore(combined, RETENTION_PATTERNS),
  };

  if (!text) failureReasons.push("Missing clinical pearl.");
  if (words > 0 && words < 9) failureReasons.push("Too short to teach a memorable clinical insight.");
  if (words > 45) failureReasons.push("Too long for a memorable pearl; convert to a concise bedside takeaway.");
  if (GENERIC_PATTERNS.some((pattern) => pattern.test(text))) failureReasons.push("Generic reminder language detected.");
  if (UNSAFE_ABSOLUTE_PATTERN.test(text) && !/\bunless|except|when|if|usually|often|may\b/i.test(text)) {
    failureReasons.push("Unsafe absolute wording needs clinical qualification.");
  }
  if (!hasAny(combined, BEDSIDE_PATTERNS)) failureReasons.push("Missing bedside action, monitoring, or assessment value.");
  if (!hasAny(combined, JUDGMENT_PATTERNS)) failureReasons.push("Missing pattern-recognition or clinical-judgment value.");
  if (!hasAny(combined, ESCALATION_PATTERNS) && !hasAny(combined, SAFETY_PATTERNS)) {
    failureReasons.push("Missing escalation, deterioration, or patient-safety consequence.");
  }
  if (!hasAny(combined, RETENTION_PATTERNS)) failureReasons.push("Missing memorable transfer cue.");

  if (hasAny(combined, BEDSIDE_PATTERNS)) strengths.push("Bedside action or monitoring signal present.");
  if (hasAny(combined, JUDGMENT_PATTERNS)) strengths.push("Clinical judgment or pattern-recognition signal present.");
  if (hasAny(combined, ESCALATION_PATTERNS)) strengths.push("Escalation or deterioration signal present.");
  if (hasAny(combined, SAFETY_PATTERNS)) strengths.push("Patient-safety signal present.");
  if (hasAny(combined, EXAM_PATTERNS)) strengths.push("Exam-reasoning signal present.");
  if (hasAny(combined, RETENTION_PATTERNS)) strengths.push("Retention cue present.");

  let numericScore =
    dimensions.bedsideUsefulness * 0.18 +
    dimensions.clinicalJudgmentValue * 0.2 +
    dimensions.escalationAwareness * 0.18 +
    dimensions.patientSafetyRelevance * 0.18 +
    dimensions.examRelevance * 0.12 +
    dimensions.retentionValue * 0.14;

  if (failureReasons.includes("Missing clinical pearl.")) numericScore = 1;
  else if (failureReasons.length >= 5) numericScore = Math.min(numericScore, 2);
  else if (failureReasons.length >= 3) numericScore = Math.min(numericScore, 3);
  else if (failureReasons.some((reason) => reason.includes("Generic"))) numericScore = Math.min(numericScore, 3);
  else if (words >= 12 && words <= 32 && strengths.length >= 4 && hasAny(combined, ESCALATION_PATTERNS)) {
    numericScore = Math.max(numericScore, 4.6);
  }

  const score = clampDimension(numericScore) as 1 | 2 | 3 | 4 | 5;

  return {
    id: input.id,
    score,
    numericScore: Math.round(numericScore * 10) / 10,
    gate: clinicalPearlGate(score),
    dimensions,
    failureReasons,
    strengths,
    improvedVersion: buildImprovedPearl({ text, topic, stem, pathway: plain(input.pathway) }),
  };
}

function buildImprovedPearl(input: { text: string; topic: string; stem: string; pathway: string }): string {
  const signal = `${input.text} ${input.topic} ${input.stem}`;
  const topic = input.topic || inferTopicFromText(input.stem) || "the clinical cue";
  if (/\bfall|assistive device|mobility|bathroom|ambulat/i.test(signal)) {
    return "A fall-risk patient is safest when the environment and supervision change before the patient tries to move.";
  }
  if (/\bdyspnea|shortness of breath|work of breathing|silent chest|wheezing|respiratory/i.test(signal)) {
    return "Breathing that looks harder after intervention is a trend, not a snapshot; reassess work of breathing and escalate before fatigue becomes failure.";
  }
  if (/\bpneumonia|post-op|postoperative|deep breathing|coughing|splint/i.test(signal)) {
    return "Post-op respiratory prevention only works if pain control, splinting, coughing, and early mobility happen before atelectasis becomes hypoxia.";
  }
  if (/\bstandard precautions|hand hygiene|infection control|PPE|isolation/i.test(signal)) {
    return "Infection control is cue-based: match PPE to the exposure risk before the first contact, not after contamination happens.";
  }
  if (/\btherapeutic communication|suicide|mental health|anxiety/i.test(signal)) {
    return "When safety is possible, ask directly and calmly; vague reassurance can miss the cue that changes urgency.";
  }
  if (/\bpain|analges/i.test(signal)) {
    return "Pain care is not complete at administration; the safety step is reassessment that proves the intervention worked without causing harm.";
  }
  if (/\bdocument|chart|SBAR|handoff/i.test(signal)) {
    return "Good documentation makes clinical reasoning auditable: cue, action, response, and escalation should all be traceable.";
  }
  if (/\boxygen|home oxygen|fire safety/i.test(signal)) {
    return "Oxygen teaching is safety teaching: flow rate matters, but ignition risk can harm the whole household.";
  }
  if (/\bstroke|facial droop|weakness|swallow/i.test(signal)) {
    return "A new neuro deficit is time-sensitive; protect swallowing and escalation pathways before routine teaching or oral intake.";
  }
  if (/\bfundus|postpartum|boggy|uterus|lochia/i.test(signal)) {
    return "A boggy uterus is a bleeding warning; fundal massage and reassessment cannot wait for routine postpartum teaching.";
  }
  if (/\bdehydration|fontanel|mucous membranes|urine output/i.test(signal)) {
    return "Pediatric dehydration can look compensated until it suddenly is not; urine output and behavior trends often warn before blood pressure falls.";
  }
  if (/\bcast|pallor|pulse|paresthesia|paralysis|compartment/i.test(signal)) {
    return "Pain or neurovascular change under a cast is not a comfort complaint until compartment risk is ruled out.";
  }
  if (/\bheart failure|fluid overload|BNP|crackles|dyspnea\b/i.test(`${input.text} ${topic} ${input.stem}`)) {
    return "Weight gain warns early, but dyspnea with falling SpO2 means the patient may be deteriorating now.";
  }
  if (/\bsepsis|infection|lactate|hypotension|confusion\b/i.test(`${input.text} ${topic} ${input.stem}`)) {
    return "Do not wait for fever in sepsis; new confusion plus hypotension is already a failure-to-rescue warning.";
  }
  if (/\bpotassium|hyperkalemia|peaked T|ECG\b/i.test(`${input.text} ${topic} ${input.stem}`)) {
    return "Peaked T waves are not just an ECG clue; they warn that the myocardium may become unstable quickly.";
  }
  if (/\bheparin|warfarin|anticoagul|bleeding|aPTT|INR\b/i.test(`${input.text} ${topic} ${input.stem}`)) {
    return "With anticoagulants, trend bleeding clues together: labs, bruising, stool, neuro changes, and new hypotension.";
  }
  if (/\bdelegat|scope|UAP|PSW|LPN|RPN\b/i.test(`${input.text} ${topic} ${input.stem}`)) {
    return "If the task requires nursing judgment, it stays with the nurse even when the physical task looks simple.";
  }
  return `When ${topic.toLowerCase()} changes, name the safety risk, reassess the response, and escalate the cue that cannot safely wait.`;
}

function inferTopicFromText(text: string): string {
  const match = text.match(/\b(sepsis|heart failure|COPD|stroke|DKA|hyperkalemia|hypoglycemia|pneumonia|shock|bleeding|delegation)\b/i);
  return match?.[0] ?? "";
}
