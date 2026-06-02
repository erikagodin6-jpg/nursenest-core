import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { Tier2OptionalService } from "@/lib/resilience/learning-continuity";
import { safeOptional } from "@/lib/server/safe-optional";

export type StudyModeOptionalService = Tier2OptionalService;

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
