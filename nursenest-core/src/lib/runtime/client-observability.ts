/**
 * Client-side error reporting without console spam in production.
 * Sentry receives deduplicated signals; dev gets at most one console line per unique key per minute.
 */

import { captureClientExceptionIfEnabled } from "@/lib/observability/sentry-if-enabled";

const recent = new Map<string, number>();
const DEDUPE_MS = 60_000;

function keyFor(surface: string, error: unknown): string {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "unknown";
  return `${surface}:${msg.slice(0, 120)}`;
}

/**
 * Report a client exception once per dedupe window per (surface, message).
 * Production: Sentry only. Development: one throttled console.warn.
 */
export function captureClientException(
  surface: string,
  error: unknown,
  extras?: Record<string, unknown>,
): void {
  const k = keyFor(surface, error);
  const now = Date.now();
  const prev = recent.get(k);
  if (prev != null && now - prev < DEDUPE_MS) return;
  recent.set(k, now);
  if (recent.size > 200) {
    for (const [key, t] of recent) {
      if (now - t > DEDUPE_MS) recent.delete(key);
    }
  }

  const err = error instanceof Error ? error : new Error(String(error));

  captureClientExceptionIfEnabled(err, {
    tags: { surface, feature: "client_observability" },
    extra: extras,
  });

  if (process.env.NODE_ENV === "development") {
    console.warn(`[client:${surface}]`, err.message);
  }
}
