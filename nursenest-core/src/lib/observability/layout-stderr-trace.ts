import { redactMetaForLog } from "@/lib/env/redact-secrets";
import { emitServerStderrLine } from "@/lib/observability/server-stderr-line";

/**
 * stderr-only trace lines for layouts and other surfaces that must not pull Sentry into the static graph.
 * Uses real stderr (not `console.error`) so Next.js Dev Tools does not count each line as a dev "issue".
 */
export function layoutStderrTrace(scope: string, label: string, meta?: Record<string, unknown>): void {
  const safe = meta && Object.keys(meta).length > 0 ? redactMetaForLog(meta) : undefined;
  const payload = safe && Object.keys(safe).length > 0 ? ` ${JSON.stringify(safe)}` : "";
  emitServerStderrLine(`[nursenest-core] ${scope} ${label}${payload}`);
}
