export type SimpleRationaleContext = {
  stem: string;
  optionText?: string | null;
  correctOptionText?: string | null;
};

const GENERIC_RATIONALE_PATTERNS = [
  /\bthis option does not address the priority assessment or intervention implied by the stem\b/i,
  /\bthis option does not address the priority\b/i,
  /\bresponds to the priority cue\b/i,
  /\bclinical reasoning is to choose the action\b/i,
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
  const stemCue = firstSentence(context.stem, "The stem points to the most immediate client-safety cue.");
  const correct = text(context.correctOptionText) || "the correct option";
  const principle = inferPrinciple(context.stem);
  return `${correct} is the safest answer because it directly addresses the cue in the stem: ${stemCue} This choice protects the client before routine care, documentation, teaching, or delayed reassessment. ${principle}`;
}

export function buildSimpleDistractorRationale(context: SimpleRationaleContext): string {
  const option = text(context.optionText) || "This option";
  const correct = text(context.correctOptionText) || "the supported answer";
  const principle = inferPrinciple(context.stem);
  return `${option} can seem reasonable, but the stem supports ${correct} more directly. Choosing it first could delay the assessment, monitoring, or intervention linked to the client's specific risk pattern. ${principle}`;
}
