/** Marks `BlogDraftGenerationBatch` rows that create RN map shells (no AI) instead of AI drafts. */
export const RN_TOPIC_MAP_SHELL_BATCH_EXAM = "__NN_RN_TOPIC_MAP_SHELL__";

/** Upper bound for one shell job (matches legacy batch-chunk map load cap). */
export const RN_TOPIC_MAP_SHELL_MAX_ITEMS = 100_000;

export function isRnTopicMapShellGenerationBatch(batch: { exam: string }): boolean {
  return batch.exam === RN_TOPIC_MAP_SHELL_BATCH_EXAM;
}
