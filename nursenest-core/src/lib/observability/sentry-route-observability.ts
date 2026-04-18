import { redactMetaForLog } from "@/lib/env/redact-secrets";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";

type SentryMetaValue = string | number | boolean | undefined;
type SentryMeta = Record<string, SentryMetaValue>;

function scrubMeta(meta?: SentryMeta): Record<string, string | number | boolean> | undefined {
  if (!meta || Object.keys(meta).length === 0) return undefined;
  const safe = redactMetaForLog(meta as Record<string, unknown>);
  const next: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(safe)) {
    if (value !== undefined) {
      next[key] = value;
    }
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

export async function withSentryServerSpan<T>(
  opts: {
    name: string;
    op: string;
    attributes?: SentryMeta;
  },
  fn: () => Promise<T>,
): Promise<T> {
  if (!isSentryServerRuntimeEnabled()) return fn();
  const attributes = scrubMeta(opts.attributes);
  const Sentry = await import("@sentry/nextjs");
  return Sentry.startSpan(
    {
      name: opts.name,
      op: opts.op,
      ...(attributes ? { attributes } : {}),
    },
    fn,
  );
}

export function captureSentrySoftError(opts: {
  scope: string;
  event: string;
  error?: unknown;
  meta?: SentryMeta;
  route?: string;
  feature?: string;
  level?: "warning" | "error";
}): void {
  if (!isSentryServerRuntimeEnabled()) return;
  const error = opts.error instanceof Error ? opts.error : opts.error ? new Error(String(opts.error)) : undefined;
  const safeMeta = scrubMeta(opts.meta);
  void import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.withScope((scope) => {
        scope.setLevel(opts.level ?? "warning");
        scope.setTag("scope", opts.scope);
        scope.setTag("event", opts.event);
        scope.setTag("soft_failure", "true");
        if (opts.route) scope.setTag("route", opts.route);
        if (opts.feature) scope.setTag("feature", opts.feature);
        if (safeMeta) scope.setContext("soft_failure_meta", safeMeta);
        if (error) {
          Sentry.captureException(error);
          return;
        }
        Sentry.captureMessage(`${opts.scope}:${opts.event}`, opts.level ?? "warning");
      });
    })
    .catch(() => {});
}
