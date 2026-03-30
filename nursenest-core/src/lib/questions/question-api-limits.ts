/** Hard cap for list endpoints — enforced with HTTP 400 when exceeded. */
export const MAX_QUESTION_PAGE_SIZE = 20;

/** Deep list offset cap: see `MAX_LIST_SKIP_ROWS_DEFAULT` in `@/lib/api/api-pagination-limits` (lessons/flashcards align). */

/** Warn when estimated JSON response exceeds this (UTF-8 bytes). */
export const QUESTION_PAYLOAD_WARN_BYTES = 150_000;

/** Hard log threshold for oversized API JSON (see {@link logLargeApiResponse} in perf-log). */
export { LARGE_API_RESPONSE_BYTES } from "@/lib/observability/perf-log";

/** Legacy: log “large list” diagnostics above this threshold (subscriber list). */
export const QUESTION_LIST_PAYLOAD_LOG_MIN_BYTES = 96_000;

export type QuestionListResponseMode = "preview" | "full";

/** Normalize `mode` query: preview = minimal fields; full = rationale + full stem payload where applicable. */
export function parseQuestionListMode(raw: string | null): QuestionListResponseMode {
  const s = (raw ?? "preview").trim().toLowerCase();
  if (s === "full") return "full";
  /** `summary` kept for backwards compatibility — same as preview. */
  if (s === "summary" || s === "preview" || s === "") return "preview";
  return "preview";
}
