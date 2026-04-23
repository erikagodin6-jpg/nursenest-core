/**
 * Client-side contract for `PATCH .../api/practice-tests/:id` with `action: "cat_advance"`.
 * Scoring and adaptive behavior stay on the server; this module only validates shape before/after fetch.
 */

export type CatAdvancePatchBody = {
  action: "cat_advance";
  answers: Record<string, unknown>;
  cursorIndex: number;
  elapsedMs?: number;
  /** Redundant echo of the scored item (server derives from cursor + questionIds). */
  examQuestionId: string;
  /** Redundant echo of answers[examQuestionId] for observability and E2E assertions. */
  selectedAnswer: unknown;
  /** Practice test row id — session / attempt identifier for this CAT run. */
  sessionId: string;
};

export function buildCatAdvancePatchBody(args: {
  testId: string;
  answers: Record<string, unknown>;
  cursorIndex: number;
  examQuestionId: string;
  elapsedMs?: number;
}): CatAdvancePatchBody {
  assertCatAdvanceRequestPayload(args);
  const selectedAnswer = args.answers[args.examQuestionId];
  return {
    action: "cat_advance",
    answers: args.answers,
    cursorIndex: args.cursorIndex,
    ...(args.elapsedMs !== undefined ? { elapsedMs: args.elapsedMs } : {}),
    examQuestionId: args.examQuestionId,
    selectedAnswer,
    sessionId: args.testId,
  };
}

export function assertCatAdvanceRequestPayload(args: {
  testId: string;
  answers: Record<string, unknown>;
  cursorIndex: number;
  examQuestionId: string;
}): void {
  const { testId, answers, cursorIndex, examQuestionId } = args;
  if (!testId || testId.length < 8) {
    throw new Error("cat_advance: invalid sessionId (practice test id).");
  }
  if (!examQuestionId || examQuestionId.length < 8) {
    throw new Error("cat_advance: examQuestionId is required.");
  }
  if (!Number.isInteger(cursorIndex) || cursorIndex < 0) {
    throw new Error("cat_advance: cursorIndex must be a non-negative integer.");
  }
  const selectedAnswer = answers[examQuestionId];
  if (selectedAnswer === undefined || selectedAnswer === null) {
    throw new Error("cat_advance: selectedAnswer missing for examQuestionId.");
  }
  if (typeof selectedAnswer === "string" && selectedAnswer.trim().length === 0) {
    throw new Error("cat_advance: selectedAnswer must be non-empty for this item.");
  }
  if (Array.isArray(selectedAnswer) && selectedAnswer.length === 0) {
    throw new Error("cat_advance: selectedAnswer array must be non-empty for SATA items.");
  }
}

export type CatAdvanceSuccessResponse = {
  ok?: boolean;
  error?: string;
  results?: unknown;
  catAdvanced?: boolean;
  catCompleted?: boolean;
  catStudyReveal?: boolean;
  studyFeedback?: unknown;
  topicStatsSynced?: boolean;
};

/**
 * After HTTP 2xx, exactly one terminal branch flag must be set so the runner can branch without heuristics.
 */
export function assertCatAdvanceResponseShape(data: CatAdvanceSuccessResponse): void {
  const adv = Boolean(data.catAdvanced);
  const done = Boolean(data.catCompleted);
  const reveal = Boolean(data.catStudyReveal);
  const count = (adv ? 1 : 0) + (done ? 1 : 0) + (reveal ? 1 : 0);
  if (count !== 1) {
    throw new Error(
      `cat_advance: expected exactly one of catAdvanced, catCompleted, catStudyReveal (got adv=${adv}, done=${done}, reveal=${reveal}).`,
    );
  }
  if (done && (data.results === undefined || data.results === null)) {
    throw new Error("cat_advance: catCompleted requires results payload.");
  }
}
