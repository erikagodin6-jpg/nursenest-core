import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { safeOptional } from "@/lib/server/safe-optional";

export type StudyModeOptionalService =
  | "adaptive_learning"
  | "recommendations"
  | "analytics"
  | "friends"
  | "leaderboards"
  | "readiness"
  | "gamification"
  | "cache_invalidation";

export async function safeStudyOptional<T>(
  service: StudyModeOptionalService,
  surface: string,
  run: () => Promise<T>,
  fallback: T,
  options?: { timeoutMs?: number; label?: string },
): Promise<T> {
  return safeOptional(run, fallback, {
    timeoutMs: options?.timeoutMs ?? 1_000,
    label: options?.label ?? `${surface}.${service}`,
    onUsedFallback(reason) {
      safeServerLog("study_mode_fallback", "non_critical_service_bypassed", {
        service,
        surface,
        reason,
        outcome: "study_continues",
      });
    },
  });
}

