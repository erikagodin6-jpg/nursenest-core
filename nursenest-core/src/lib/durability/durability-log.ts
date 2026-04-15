import { safeServerLog } from "@/lib/observability/safe-server-log";

export type DurabilitySubsystem = "lesson" | "question" | "flashcard" | "learner_shell" | "api";

export type DurabilityLogEvent =
  | "content_fallback_served"
  | "slow_endpoint_warning"
  | "core_read_timeout"
  | "degraded_slow_response";

/**
 * Structured durability logging — no PII; route names only, bounded strings.
 */
export function logDurabilityEvent(payload: {
  event: DurabilityLogEvent;
  route: string;
  subsystem: DurabilitySubsystem;
  durationMs: number;
  fallbackUsed: boolean;
  reason?: string;
}): void {
  safeServerLog("durability", payload.event, {
    route: payload.route.slice(0, 200),
    subsystem: payload.subsystem,
    duration_ms: Math.round(payload.durationMs),
    fallback_used: payload.fallbackUsed ? 1 : 0,
    ...(payload.reason ? { reason: payload.reason.slice(0, 120) } : {}),
  });
}
