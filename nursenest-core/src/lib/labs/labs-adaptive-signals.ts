/**
 * Detects when adaptive / remediation topics align with the Labs clinical reasoning surface (`/app/labs`).
 * Conservative keyword match — avoids firing on unrelated weak areas.
 */
const LABS_FOCUS_SIGNAL =
  /\b(lab|labs|laboratory|cbc|bmp|cmp|fluid|electrolyte|electrolytes|potassium|sodium|calcium|magnesium|phosphate|renal|creatinine|bun|gfr|aki|anion|osmolal|liver|alt|ast|bilirubin|inr|ptt|\bpt\b|ttp|hemoglobin|hematocrit|platelet|wbc|rbc|coagulation|abg|acid[\s-]*base|fluid\s*&?\s*electrolyte|troponin|bnp|nt-probnp|lactate|arterial\s+blood|venous\s+blood)\b/i;

export function weakTopicSuggestsLabsFocus(topicKey: string): boolean {
  const s = topicKey?.trim() ?? "";
  if (!s) return false;
  return LABS_FOCUS_SIGNAL.test(s);
}

export function anyWeakTopicsSuggestLabs(topics: readonly string[]): boolean {
  return topics.some((t) => weakTopicSuggestsLabsFocus(t));
}
