/**
 * Classifies whether the practice/CAT runner can render an item with the current MCQ/SATA/Bowtie UI.
 * Specialized formats (matrix, ordering, cloze JSON shapes, etc.) must gain explicit renderers — until then
 * we surface a safe fallback instead of mis-rendering as plain MCQ.
 */
/** Tokens that indicate a non-MCQ UI is expected — if options still look like a flat MCQ list, we treat as risky. */
const SPECIALIZED_TYPE_HINTS =
  /\b(MATRIX|GRID|ORDER|ORDERING|SEQUENCE|CLOZE|DROP\s*DOWN|DRAG|HOTSPOT|MATCH|NGN|CASE\s*STUDY|UNFOLD|MULTI[\s_-]?PART|MULTIPLE\s*RESPONSE\s*NUMERIC)\b/i;

export type PracticeRunnerRenderClass =
  | { kind: "supported" }
  | { kind: "unsupported_shape"; reason: string };

/**
 * When options are not a simple string array (MCQ/SATA), classify gap (Bowtie handled upstream via {@link tryNormalizeBowtiePayload}).
 */
export function classifyPracticeRunnerPayloadShape(options: unknown): PracticeRunnerRenderClass {
  if (Array.isArray(options)) {
    const strings = options.every((x) => typeof x === "string" || typeof x === "number");
    if (strings && options.length >= 2) return { kind: "supported" };
    if (strings && options.length === 1) return { kind: "unsupported_shape", reason: "single_option_array" };
    if (strings && options.length === 0) return { kind: "unsupported_shape", reason: "empty_option_array" };
    return { kind: "unsupported_shape", reason: "non_scalar_option_array" };
  }
  if (options && typeof options === "object" && !Array.isArray(options)) {
    return { kind: "unsupported_shape", reason: "structured_options_object" };
  }
  return { kind: "unsupported_shape", reason: "missing_or_invalid_options" };
}

/**
 * True when this item cannot be answered safely with the current runner (needs dedicated UI).
 */
export function practiceRunnerNeedsUnsupportedFallback(
  questionType: string,
  options: unknown,
  optsCanonicalLen: number,
  isBowtie: boolean,
): boolean {
  if (isBowtie) return false;
  const qt = (questionType ?? "").trim();
  const shape = classifyPracticeRunnerPayloadShape(options);
  if (shape.kind === "supported" && optsCanonicalLen >= 2) return false;
  if (shape.reason === "non_scalar_option_array" || shape.reason === "structured_options_object") return true;
  if (SPECIALIZED_TYPE_HINTS.test(qt)) return true;
  return shape.reason === "missing_or_invalid_options" || shape.reason === "empty_option_array";
}

export function logPracticeRunnerUnsupportedQuestionDev(questionId: string, questionType: string, reason: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.error(
    `[PracticeRunner] Unsupported or incomplete question payload (needs renderer or import fix) id=${questionId.slice(0, 12)}… type=${questionType} reason=${reason}`,
  );
}

/**
 * Loose catalog of `exam_questions.question_type` strings seen in imports / seeds / generators.
 * Used only for observability — routing still follows payload shape + Bowtie/SATA branches.
 */
const QUESTION_TYPE_CATALOG_PATTERN =
  /multiple|mcq|choice|sata|select|all|apply|bow|tie|trend|order|matrix|grid|cloze|dropdown|drop|ngn|case|scenario|hot\s*spot|exhibit|chart|lab|media|fib|fill|numeric|drag|match|unfold|sequence|priority|delegation|audio|bowtie/i;

/**
 * True when the type label does not match any known token — dev/test signal only (possible MCQ mis-tag).
 */
export function runnerQuestionTypeLooksUnrecognized(questionType: string | null | undefined): boolean {
  const t = (questionType ?? "").trim();
  if (!t) return true;
  return !QUESTION_TYPE_CATALOG_PATTERN.test(t);
}

/**
 * Dev/test: warn when a flat MCQ/SATA-capable payload uses an unrecognized `questionType` label.
 */
export function logUnknownCatalogQuestionTypeDev(
  questionId: string,
  questionType: string,
  optsCanonicalLen: number,
): void {
  if (process.env.NODE_ENV === "production") return;
  if (optsCanonicalLen < 2) return;
  if (!runnerQuestionTypeLooksUnrecognized(questionType)) return;
  console.error(
    `[PracticeRunner] UNKNOWN_QUESTION_TYPE_LABEL — verify importer/catalog mapping id=${questionId.slice(0, 12)}… type=${questionType}`,
  );
}

/** Production/client breadcrumb when specialized formats hit the safe fallback UI. */
export function logPracticeRunnerUnsupportedQuestionProd(questionId: string, questionType: string): void {
  if (process.env.NODE_ENV !== "production") return;
  console.warn("[PracticeRunner] unsupported_question_ui", {
    questionType: String(questionType ?? "").slice(0, 64),
    questionIdPrefix: questionId.slice(0, 12),
  });
}
