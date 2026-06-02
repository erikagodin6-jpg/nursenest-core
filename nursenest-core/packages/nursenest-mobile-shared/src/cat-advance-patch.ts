/**
 * Mirrors `src/lib/practice-tests/cat-advance-contract.ts` — mobile copies the contract
 * to avoid importing Next app internals.
 */

export type CatAdvancePatchBody = {
  action: "cat_advance";
  answers: Record<string, unknown>;
  cursorIndex: number;
  elapsedMs?: number;
  examQuestionId: string;
  selectedAnswer: unknown;
  sessionId: string;
};

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
