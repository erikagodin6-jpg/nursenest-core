/** Safe message extraction for error boundaries (non-Error throws, undefined, etc.). */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && typeof error.message === "string" && error.message.length > 0) {
    return error.message;
  }
  if (typeof error === "string" && error.length > 0) return error;
  if (error != null && typeof error === "object" && "message" in error) {
    const m = (error as { message?: unknown }).message;
    if (typeof m === "string" && m.length > 0) return m;
  }
  return "Something went wrong";
}

/**
 * First line only, truncated — avoids showing stack traces in dev-only UI even when
 * `error.message` contains embedded newlines.
 */
export function getErrorMessageDevLine(error: unknown, maxLen = 280): string {
  const raw = getErrorMessage(error).split(/\r?\n/)[0]?.trim() ?? "";
  if (raw.length <= maxLen) return raw;
  return `${raw.slice(0, maxLen)}…`;
}

/** Whether `error.tsx` surfaces may show technical detail (never in production). */
export function shouldShowErrorBoundaryDevDetail(): boolean {
  return process.env.NODE_ENV === "development";
}
