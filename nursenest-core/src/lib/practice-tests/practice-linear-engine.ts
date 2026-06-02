/**
 * Reuses `PracticeTest.adaptiveState` JSON for linear exam-engine metadata so we avoid a schema migration.
 * CAT sessions use a different adaptiveState shape; we merge `linearEngine` only for non-CAT rows.
 */
export type LinearEngineSlice = {
  linearEngine?: {
    committedQuestionIds?: string[];
  };
};

export function getLinearCommittedQuestionIds(adaptiveState: unknown): string[] {
  if (!adaptiveState || typeof adaptiveState !== "object" || Array.isArray(adaptiveState)) return [];
  const le = (adaptiveState as LinearEngineSlice).linearEngine;
  const raw = le?.committedQuestionIds;
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.length > 4);
}

export function mergeLinearCommittedQuestionId(adaptiveState: unknown, questionId: string): Record<string, unknown> {
  const base =
    adaptiveState && typeof adaptiveState === "object" && !Array.isArray(adaptiveState)
      ? { ...(adaptiveState as Record<string, unknown>) }
      : {};
  const prev = getLinearCommittedQuestionIds(adaptiveState);
  const next = prev.includes(questionId) ? prev : [...prev, questionId];
  return {
    ...base,
    linearEngine: {
      ...((base.linearEngine as Record<string, unknown> | undefined) ?? {}),
      committedQuestionIds: next,
    },
  };
}
