import { redactMetaForLog } from "@/lib/env/redact-secrets";

/**
 * stderr-only trace lines for layouts and other surfaces that must not pull Sentry into the static graph.
 */
export function layoutStderrTrace(scope: string, label: string, meta?: Record<string, unknown>): void {
  const safe = meta && Object.keys(meta).length > 0 ? redactMetaForLog(meta) : undefined;
  const payload = safe && Object.keys(safe).length > 0 ? ` ${JSON.stringify(safe)}` : "";
  console.error(`[nursenest-core] ${scope} ${label}${payload}`);
}
