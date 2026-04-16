import "server-only";

/**
 * Minimal question-bank seed (`seedMinimalQuestionBankIfEmpty`) performs DB writes when the bank is empty.
 * It must **not** run on production learner traffic — use migrations, `prisma db seed`, or enqueue
 * {@link processPendingJobs} type `content.seed_minimal_question_bank_if_empty` instead.
 *
 * - **Development:** allowed (fast local empty DB).
 * - **Preview / special envs:** set `ALLOW_RUNTIME_MINIMAL_QUESTION_SEED=true`.
 */
export function allowRuntimeMinimalQuestionBankSeed(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.ALLOW_RUNTIME_MINIMAL_QUESTION_SEED === "true";
}
