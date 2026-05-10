/**
 * Weak-topic signals that align with medication math / dimensional analysis (`/app/med-calculations`).
 * Conservative keyword match — avoids firing on unrelated weak areas.
 */
const MED_CALC_FOCUS_SIGNAL =
  /\b(pharmacology|dosage|dosing|dose\b|med\s*calc|medication\s*calc|medication\s*math|pharm\b|infusion|infusions|iv\s*drip|drip\s*rate|\bdrip\b|gtt|micro\s*drip|macro|mg\/kg|mcg\/kg|weight\s*based|unit\s*conversion|dimensional\s+analysis|ratio[\s-]*proportion|tablet\s+dose|liquid\s+conc|reconstitut|syringe|pump|insulin\s*dosing|heparin|nursing\s+math|metric\s+equivalent|concentration\s+match)\b/i;

export function weakTopicSuggestsMedCalcFocus(topicKey: string): boolean {
  const s = topicKey?.trim() ?? "";
  if (!s) return false;
  return MED_CALC_FOCUS_SIGNAL.test(s);
}

export function anyWeakTopicsSuggestMedCalc(topics: readonly string[]): boolean {
  return topics.some((t) => weakTopicSuggestsMedCalcFocus(t));
}
