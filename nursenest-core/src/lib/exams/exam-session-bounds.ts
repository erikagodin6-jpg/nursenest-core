/**
 * Bounds for `ExamSession.questionIds` JSON and related payloads.
 * Pool creation uses {@link POOL_LIMIT} (20); cap leaves room for future pool growth without allowing pathological rows.
 */
export const MAX_SESSION_QUESTION_IDS = 80;

/** PATCH answers: one entry per question max in normal use; allow headroom for retries/duplicates. */
export const MAX_SESSION_ANSWER_KEYS = 256;

export type SanitizeSessionQuestionIdsResult = {
  ids: string[];
  truncated: boolean;
  coercedFromInvalid: boolean;
  sourceLength: number;
};

/**
 * Coerce stored JSON to a string id array, drop non-strings, cap length (preserves order).
 */
export function sanitizeSessionQuestionIds(raw: unknown): SanitizeSessionQuestionIdsResult {
  if (!Array.isArray(raw)) {
    return { ids: [], truncated: false, coercedFromInvalid: true, sourceLength: 0 };
  }
  const sourceLength = raw.length;
  const ids: string[] = [];
  let coercedFromInvalid = false;
  let truncated = false;
  for (const x of raw) {
    if (typeof x !== "string" || x.length === 0) {
      coercedFromInvalid = true;
      continue;
    }
    if (ids.length >= MAX_SESSION_QUESTION_IDS) {
      truncated = true;
      break;
    }
    ids.push(x);
  }
  return { ids, truncated, coercedFromInvalid, sourceLength };
}
