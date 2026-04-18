/**
 * Structured server logs without secrets, tokens, or raw user identifiers.
 * Use for production diagnosis (platform log drains pick up stderr).
 * Meta values are lightly redacted when keys look sensitive (see {@link redactMetaForLog}).
 */
import * as Sentry from "@sentry/nextjs";
import { redactMetaForLog } from "@/lib/env/redact-secrets";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";

const PREFIX = "[nursenest-core]";

export type SafeLogMeta = Record<string, string | number | boolean | undefined>;

export function safeServerLog(scope: string, event: string, meta?: SafeLogMeta): void {
  const safe =
    meta && Object.keys(meta).length > 0
      ? redactMetaForLog(meta as Record<string, unknown>)
      : undefined;
  const payload = safe && Object.keys(safe).length > 0 ? ` ${JSON.stringify(safe)}` : "";
  console.error(`${PREFIX} ${scope} ${event}${payload}`);
}

/**
 * Log + forward operational failures to Sentry (deduped by scope/event). Use sparingly.
 */
export function safeServerLogCritical(
  scope: string,
  event: string,
  meta?: SafeLogMeta,
  error?: unknown,
  /** Optional Sentry tags (e.g. `flow: questions_load`) */
  flowTags?: Record<string, string>,
): void {
  safeServerLog(scope, event, meta);
  if (!isSentryServerRuntimeEnabled()) return;
  const err = error instanceof Error ? error : error ? new Error(String(error)) : new Error(`${scope}:${event}`);
  const extra =
    meta && Object.keys(meta).length > 0
      ? (redactMetaForLog(meta as Record<string, unknown>) as Record<string, unknown>)
      : {};
  Sentry.captureException(err, {
    tags: { scope, event, critical: "true", ...flowTags },
    extra,
    level: "error",
  });
}
