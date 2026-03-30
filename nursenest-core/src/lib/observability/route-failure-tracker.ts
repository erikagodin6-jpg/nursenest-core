import { safeServerLogEvent } from "@/lib/observability/safe-server-log";

const WINDOW_MS = 60_000;
const ALERT_THRESHOLD = 5;

const failureTimestamps = new Map<string, number[]>();

/**
 * Tracks HTTP 4xx/5xx per route in a sliding window; emits `alert_repeated_route_failures` when noisy.
 * Resets the window after alerting to avoid log spam (failures still accrue in a fresh window).
 */
export function recordRouteHttpFailure(route: string, status: number): void {
  if (status < 400) return;
  const key = route.slice(0, 200);
  const now = Date.now();
  const prev = failureTimestamps.get(key) ?? [];
  const pruned = prev.filter((t) => now - t < WINDOW_MS);
  pruned.push(now);
  failureTimestamps.set(key, pruned);
  if (pruned.length >= ALERT_THRESHOLD) {
    safeServerLogEvent("alert_repeated_route_failures", {
      route: key,
      failureCount: pruned.length,
      windowMs: WINDOW_MS,
      sampleStatus: status,
    });
    failureTimestamps.set(key, []);
  }
}
