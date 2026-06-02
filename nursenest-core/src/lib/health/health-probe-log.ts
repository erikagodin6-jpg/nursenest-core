export const HEALTH_STARTUP_LOG_WINDOW_MS = 5 * 60 * 1000;

export type HealthProbeLogEvent = "probe_startup" | "probe_slow" | "probe_failed";

export type HealthProbeLogEntry = {
  event: HealthProbeLogEvent;
  meta: {
    route: string;
    status: number;
    durationMs: number;
    uptimeMs: number;
    startupWindow: boolean;
    slow?: boolean;
    classification?: string;
    detail?: string;
  };
};

export function buildHealthProbeLogEntry(input: {
  route: string;
  status: number;
  durationMs: number;
  uptimeMs: number;
  slowThresholdMs: number;
  classification?: string;
  detail?: string;
}): HealthProbeLogEntry | null {
  const startupWindow = input.uptimeMs < HEALTH_STARTUP_LOG_WINDOW_MS;
  const failed = input.status >= 500;
  const slow = input.durationMs >= input.slowThresholdMs;

  if (!startupWindow && !failed && !slow) {
    return null;
  }

  return {
    event: failed ? "probe_failed" : slow ? "probe_slow" : "probe_startup",
    meta: {
      route: input.route,
      status: input.status,
      durationMs: input.durationMs,
      uptimeMs: input.uptimeMs,
      startupWindow,
      slow: slow || undefined,
      classification: input.classification,
      detail: input.detail,
    },
  };
}
