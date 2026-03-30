import type { SafeLogMeta } from "@/lib/observability/safe-server-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export function logFlashcardAccessDenied(meta: SafeLogMeta): void {
  safeServerLog("flashcard", "flashcard_access_denied", meta);
}

export function logFlashcardLargePayload(meta: SafeLogMeta): void {
  safeServerLog("flashcard", "flashcard_large_payload", meta);
}

export function logFlashcardProgressSaved(meta: SafeLogMeta): void {
  safeServerLog("flashcard", "flashcard_progress_saved", meta);
}

export function logSpacedRepetitionScheduleError(meta: SafeLogMeta, err?: unknown): void {
  const detail = err instanceof Error ? err.message.slice(0, 200) : err ? String(err).slice(0, 200) : "";
  safeServerLog("flashcard", "spaced_repetition_schedule_error", { ...meta, detail });
}
