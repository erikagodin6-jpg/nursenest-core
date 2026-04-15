import { isCoreOnlyEmergencyMode, isDurabilityDegradedMode } from "@/lib/durability/durability-flags";
import { logDurabilityEvent, type DurabilitySubsystem } from "@/lib/durability/durability-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const SLOW_WARN_MS = 3000;
const DEGRADED_SLOW_MS = 6000;

export function effectiveCoreReadTimeoutMs(): number {
  if (isCoreOnlyEmergencyMode()) return 2500;
  if (isDurabilityDegradedMode()) return 3500;
  return 8000;
}

/**
 * Runs `fn` with a wall-clock timeout; logs slow paths. Re-throws on timeout/error (caller may use stale cache).
 */
export async function runWithCoreReadTelemetry<T>(
  route: string,
  subsystem: DurabilitySubsystem,
  fn: () => Promise<T>,
  opts?: { timeoutMs?: number },
): Promise<T> {
  const timeoutMs = opts?.timeoutMs ?? effectiveCoreReadTimeoutMs();
  const t0 = performance.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("core_read_timeout")), timeoutMs);
      }),
    ]);
    const durationMs = performance.now() - t0;
    if (durationMs >= DEGRADED_SLOW_MS) {
      logDurabilityEvent({
        event: "degraded_slow_response",
        route,
        subsystem,
        durationMs,
        fallbackUsed: false,
        reason: "above_6s_threshold",
      });
    } else if (durationMs >= SLOW_WARN_MS) {
      safeServerLog("durability", "slowEndpointWarning", {
        route: route.slice(0, 200),
        subsystem,
        duration_ms: Math.round(durationMs),
      });
    }
    return result;
  } catch (e) {
    const durationMs = performance.now() - t0;
    const timeout = e instanceof Error && e.message === "core_read_timeout";
    logDurabilityEvent({
      event: timeout ? "core_read_timeout" : "slow_endpoint_warning",
      route,
      subsystem,
      durationMs,
      fallbackUsed: false,
      reason: timeout ? "timeout" : (e instanceof Error ? e.message : "error").slice(0, 120),
    });
    throw e;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
