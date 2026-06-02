/**
 * Client-safe types and pure functions for pre-nursing i18n overlays.
 *
 * This file has NO server-only imports and is safe to import in both
 * server components and client components (e.g. exam runners, quiz runners).
 *
 * Server-only FS loaders live in `pre-nursing-content-overlay.ts`.
 */

/**
 * Localized prose overlay for a single pre-nursing module.
 * All fields are optional — the module view falls back to English TSX content.
 */
export type PreNursingModuleOverlay = {
  overview?: string;
  key_concepts?: string[];
  nursing_responsibilities?: string;
  clinical_pearls?: string;
  patient_education?: string;
  key_takeaways?: string[];
};

/**
 * Per-question translation overlay, keyed by PreNursingQuestion.id.
 * The `correct` grading index is never included — it stays canonical from the English bank.
 */
export type PreNursingQuestionOverlay = {
  stem?: string;
  options?: string[];
  rationale?: string;
};

/**
 * Applies a question overlay to a set of questions from the English bank.
 * Returns a new array; questions without an overlay entry are returned unchanged.
 * The `correct` index is NEVER overridden — grading always uses the canonical value.
 */
export function applyPreNursingQuestionsOverlay<
  Q extends { id: string; question: string; options: string[]; rationale: string },
>(questions: Q[], overlay: Record<string, PreNursingQuestionOverlay>): Q[] {
  if (Object.keys(overlay).length === 0) return questions;
  return questions.map((q) => {
    const o = overlay[q.id];
    if (!o) return q;
    return {
      ...q,
      question: o.stem ?? q.question,
      options: o.options ?? q.options,
      rationale: o.rationale ?? q.rationale,
    };
  });
}
