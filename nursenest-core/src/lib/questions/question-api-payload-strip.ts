/**
 * Field-level shaping for exam question JSON returned to browsers.
 * Kept free of `server-only` / fs so unit tests can import it.
 */

/**
 * Teaching / rationale fields that must not appear in preview, freemium, or active-exam payloads,
 * even when i18n overlays would otherwise inject translated text without a DB column.
 */
export const QUESTION_API_TEACHING_FIELD_KEYS = [
  "rationale",
  "correctAnswerExplanation",
  "clinicalReasoning",
  "keyTakeaway",
  "clinicalPearl",
  "examStrategy",
  "memoryHook",
  "clinicalTrap",
  "distractorRationales",
  "incorrectAnswerRationale",
  "correctAnswer",
] as const;

export function stripTeachingFieldsFromQuestionApiPayload(row: Record<string, unknown>): Record<string, unknown> {
  const out = { ...row };
  for (const k of QUESTION_API_TEACHING_FIELD_KEYS) delete out[k];
  delete out.overlayApplied;
  delete out.overlayTranslationFallback;
  return out;
}

export function finalizeQuestionApiTeachingExposure(
  merged: Record<string, unknown>,
  teachingExposure: "full" | "none",
): Record<string, unknown> {
  if (teachingExposure === "none") {
    return stripTeachingFieldsFromQuestionApiPayload(merged);
  }
  return merged;
}
