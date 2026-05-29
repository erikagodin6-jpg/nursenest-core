export type SimpleRationaleContext = {
  stem: string;
  optionText?: string | null;
  correctOptionText?: string | null;
  allOptionTexts?: string[];
};

const GENERIC_RATIONALE_PATTERNS = [
  /\bthis option does not address the priority assessment or intervention implied by the stem\b/i,
  /\bthis option does not address the priority\b/i,
  /\bresponds to the priority cue\b/i,
  /\bclinical reasoning is to choose the action\b/i,
  /\bchoose the action that prevents harm\b/i,
  /\bprevents harm\b/i,
  /\bsafe escalation\b/i,
  /\buse the nursing process\b/i,
  /\blower-priority care\b/i,
  /\bmost urgent cue\b/i,
  /\bthis is incorrect\b/i,
  /\bnot the best answer\b/i,
  /\bthis is not correct\b/i,
  /\bbecause it is correct\b/i,
  /\breview the material\b/i,
  /\bstudy this topic\b/i,
  /\bno separate rationale is available\b/i,
  /\brationale unavailable\b/i,
  /\banswer shown\b/i,
] as const;

const REASONING_PATTERN =
  /\b(because|therefore|indicates|suggests|reflects|priority|first|before|after|assess|intervention|risk|unsafe|lower priority|higher priority|unstable|acute|deteriorat|escalat|safety|airway|breathing|circulation)\b/i;

const NURSING_PRINCIPLE_PATTERN =
  /\b(abc|airway|breathing|circulation|safety|acute|chronic|stable|unstable|assessment before implementation|assess before|prioriti[sz]e|delegate|scope|infection|medication safety|patient teaching|reassess|escalat)\b/i;

const PRIORITY_STEM_PATTERN = /\b(priority|first|initial|immediate|most important|delegate|assignment|uap|psw|unstable|acute|emergency|rapid response|escalat)\b/i;

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function firstSentence(value: string, fallback: string): string {
  const sentence = value
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .find((part) => part.trim().length >= 12);
  return sentence?.trim() || fallback;
}

function inferPrinciple(stem: string): string {
  const s = stem.toLowerCase();
  if (/\b(o2|oxygen|spo2|dyspnea|shortness of breath|wheez|airway|respiratory|cyanosis)\b/.test(s)) {
    return "Use ABCs: airway and breathing problems outrank routine comfort, teaching, or delayed interventions.";
  }
  if (/\b(chest pain|bleeding|shock|hypotension|stroke|confusion|sepsis|fever|deteriorat)\b/.test(s)) {
    return "Treat acute instability first, then address chronic or expected findings after the client is safe.";
  }
  if (/\b(delegate|assignment|uap|psw|assistive personnel|scope)\b/.test(s)) {
    return "Delegate only predictable, stable tasks; assessment, teaching, and unstable changes stay with the nurse.";
  }
  if (/\b(insulin|warfarin|heparin|opioid|digoxin|medication|dose|administer)\b/.test(s)) {
    return "Medication-safety questions require checking the client condition, dose risk, and monitoring data before giving the drug.";
  }
  if (/\b(teach|understanding|discharge|education|statement)\b/.test(s)) {
    return "Teaching questions test whether the client can identify unsafe symptoms and act correctly at home.";
  }
  if (/\b(isolation|infection|ppe|hand hygiene|sterile)\b/.test(s)) {
    return "Infection-control questions prioritize preventing transmission before convenience or routine workflow.";
  }
  return "Anchor the answer to the cue that would change bedside monitoring, immediate nursing action, or escalation timing for this client.";
}

function sentenceCase(value: string): string {
  const clean = value.trim();
  if (!clean) return clean;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function stripOptionLead(value: string): string {
  return text(value)
    .replace(/^[A-F][.)]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferTestedConcept(context: SimpleRationaleContext): string {
  const stem = text(context.stem);
  const correct = stripOptionLead(context.correctOptionText ?? "");
  const lowerStem = stem.toLowerCase();
  const lowerCorrect = correct.toLowerCase();

  if (/\boxytocin\b/.test(lowerCorrect)) {
    return "Oxytocin is a posterior pituitary hormone that stimulates uterine smooth muscle contractions during labor and supports milk let-down after birth.";
  }
  if (/\bprogesterone\b/.test(lowerCorrect)) {
    return "Progesterone maintains the uterine lining and suppresses uterine contractility during pregnancy rather than initiating labor contractions.";
  }
  if (/\bestrogen\b/.test(lowerCorrect)) {
    return "Estrogen supports reproductive tissue growth and cervical/uterine preparation, but it is not the direct hormone that produces labor contractions.";
  }
  if (/\bprolactin\b/.test(lowerCorrect)) {
    return "Prolactin stimulates milk production; oxytocin is responsible for milk ejection and uterine contraction.";
  }
  if (/uterine contraction|labor contraction|milk let.?down/.test(lowerStem)) {
    return "Oxytocin is the direct trigger for uterine contraction and milk ejection; other reproductive hormones may prepare or maintain pregnancy but do not produce the contraction response.";
  }
  if (/\bhemoglobin\b|\bhgb\b|\banemia\b/.test(`${lowerStem} ${lowerCorrect}`)) {
    return "Hemoglobin reflects the oxygen-carrying capacity of red blood cells; low values indicate anemia and require assessment for bleeding, hypoxia, fatigue, tachycardia, and dizziness.";
  }
  if (/\binsulin\b|hypoglyc|hyperglyc|diabetes/.test(`${lowerStem} ${lowerCorrect}`)) {
    return "Insulin lowers blood glucose by moving glucose into cells; safe administration depends on glucose level, meal timing, dose, and signs of hypo- or hyperglycemia.";
  }
  if (/\bpotassium\b|\bk\+|hyperkal|hypokal/.test(`${lowerStem} ${lowerCorrect}`)) {
    return "Potassium changes alter cardiac conduction and muscle function; abnormal values require ECG awareness and timely correction based on severity.";
  }
  if (/\bthyroid\b|tsh|t3|t4|hyperthyroid|hypothyroid/.test(`${lowerStem} ${lowerCorrect}`)) {
    return "Thyroid questions test feedback physiology: TSH rises when thyroid hormone is low and is suppressed when circulating T3/T4 is high.";
  }
  return correct
    ? `${sentenceCase(correct)} is the concept being tested; connect it directly to the finding or mechanism described in the stem.`
    : "The tested concept should be tied directly to the stem finding, not to a generic priority rule.";
}

function answerConceptToken(value: string | null | undefined): string {
  const clean = stripOptionLead(value ?? "").toLowerCase();
  const token = clean.match(/[a-z][a-z0-9+/-]{3,}/i)?.[0] ?? "";
  return token;
}

export function rationaleMentionsTestedConcept(context: SimpleRationaleContext, rationale: string | null | undefined): boolean {
  const token = answerConceptToken(context.correctOptionText);
  if (!token) return true;
  return text(rationale).toLowerCase().includes(token);
}

export function isGenericRationaleText(value: string | null | undefined): boolean {
  const rationale = text(value);
  return rationale.length > 0 && GENERIC_RATIONALE_PATTERNS.some((pattern) => pattern.test(rationale));
}

export function hasSimpleRationaleTeachingShape(value: string | null | undefined): boolean {
  const rationale = text(value);
  if (rationale.length < 90) return false;
  if (isGenericRationaleText(rationale)) return false;
  return REASONING_PATTERN.test(rationale) && NURSING_PRINCIPLE_PATTERN.test(rationale);
}

export function buildSimpleCorrectRationale(context: SimpleRationaleContext): string {
  const stemCue = firstSentence(context.stem, "The stem points to the tested clinical concept.");
  const correct = text(context.correctOptionText) || "the correct option";
  const concept = inferTestedConcept(context);
  if (!PRIORITY_STEM_PATTERN.test(context.stem)) {
    return `${correct} is correct because ${concept} In this question, match the answer choice to the underlying physiology or clinical rule being tested rather than applying a generic priority framework.`;
  }
  const principle = inferPrinciple(context.stem);
  return `${correct} is correct because it directly addresses the cue in the stem: ${stemCue} ${principle}`;
}

export function buildSimpleDistractorRationale(context: SimpleRationaleContext): string {
  const option = text(context.optionText) || "This option";
  const correct = text(context.correctOptionText) || "the supported answer";
  const optionConcept = inferTestedConcept({ ...context, correctOptionText: option });
  if (!PRIORITY_STEM_PATTERN.test(context.stem)) {
    return `${option} can seem tempting if it is confused with ${correct}, but ${optionConcept} The stem supports ${correct}, so this option does not explain the specific concept being tested.`;
  }
  const principle = inferPrinciple(context.stem);
  return `${option} can seem reasonable, but the stem supports ${correct} more directly. Choosing it first could delay the assessment, monitoring, or intervention linked to the client's specific risk pattern. ${principle}`;
}

export function validateRationaleQuality(context: SimpleRationaleContext, rationale: string | null | undefined): {
  pass: boolean;
  issues: Array<"generic_boilerplate" | "repeats_stem" | "missing_tested_concept" | "too_short">;
} {
  const clean = text(rationale);
  const stem = text(context.stem);
  const issues: Array<"generic_boilerplate" | "repeats_stem" | "missing_tested_concept" | "too_short"> = [];
  if (clean.length < 90) issues.push("too_short");
  if (isGenericRationaleText(clean)) issues.push("generic_boilerplate");
  if (stem && clean.toLowerCase().includes(stem.toLowerCase())) issues.push("repeats_stem");
  if (!rationaleMentionsTestedConcept(context, clean)) issues.push("missing_tested_concept");
  return { pass: issues.length === 0, issues };
}
