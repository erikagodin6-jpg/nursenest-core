/**
 * Central tier allowlists for nursing vs allied paywall enforcement (Express monolith).
 * Aligns with business rules: RPN→RPN; RN→RPN+RN; NP→all nursing; ALLIED→allied-only; free→free only.
 */

const NURSING_TIERS_FULL = ["rpn", "rn", "np"] as const;

/** Lesson/content tiers from deriveTier() / slug heuristics (lowercase). */
export function allowedLessonContentTiersForUser(userTier: string): string[] {
  const t = (userTier || "free").toLowerCase();
  if (t === "admin") return ["free", "rpn", "rn", "np", "allied", "imaging", "newgrad", "lvn"];
  if (t === "free") return ["free"];
  if (t === "rpn") return ["free", "rpn"];
  if (t === "rn") return ["free", "rpn", "rn"];
  if (t === "np") return ["free", ...NURSING_TIERS_FULL];
  if (t === "allied") return ["free", "allied"];
  if (t === "imaging") return ["free", "imaging"];
  if (t === "full_access" || t === "certification_prep" || t === "new_grad_toolkit") {
    return ["free", "rpn", "rn", "np", "allied", "imaging"];
  }
  return ["free", t];
}

/**
 * `flashcard_bank.tier` values for CAT/nursing study (`GET /api/question-bank/study`).
 */
export function allowedNursingFlashcardBankTiersForUser(userTier: string): string[] {
  const t = (userTier || "free").toLowerCase();
  if (t === "admin") return ["free", "rpn", "rn", "np"];
  if (t === "free") return ["free"];
  if (t === "rpn") return ["free", "rpn"];
  if (t === "rn") return ["free", "rpn", "rn"];
  if (t === "np") return ["free", "rpn", "rn", "np"];
  if (t === "allied") return [];
  if (t === "imaging") return ["free", "imaging"];
  if (t === "full_access" || t === "certification_prep" || t === "new_grad_toolkit") {
    return ["free", "rpn", "rn", "np"];
  }
  return [];
}

/**
 * `exam_questions.tier` filter for custom practice (nursing pool). Empty = no nursing rows.
 * `null` = admin / unrestricted (caller adds no tier predicate).
 */
export function allowedNursingExamQuestionTiersForUser(userTier: string): string[] | null {
  const t = (userTier || "free").toLowerCase();
  if (t === "admin") return null;
  if (t === "free") return [];
  if (t === "rpn") return ["rpn"];
  if (t === "rn") return ["rpn", "rn"];
  if (t === "np") return ["rpn", "rn", "np"];
  if (t === "allied") return [];
  if (t === "imaging") return ["imaging"];
  if (t === "full_access" || t === "certification_prep" || t === "new_grad_toolkit") {
    return ["rpn", "rn", "np", "lvn"];
  }
  return ["rpn"];
}

/** Whether custom practice should pull from `allied_questions` for this subscription tier. */
export function practiceSessionIncludeAlliedPool(userTier: string): boolean {
  const t = (userTier || "free").toLowerCase();
  return t === "allied" || t === "admin" || t === "full_access";
}

/** Whether custom practice should pull from nursing `exam_questions`. */
export function practiceSessionIncludeNursingPool(userTier: string): boolean {
  const t = (userTier || "free").toLowerCase();
  if (t === "allied") return false;
  if (t === "free") return false;
  return true;
}
