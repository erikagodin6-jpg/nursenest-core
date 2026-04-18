import * as Sentry from "@sentry/nextjs";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";

type RenderTraceMeta = Record<string, string | number | boolean | undefined>;

export function renderTrace(label: string, meta?: RenderTraceMeta): void {
  const payload =
    meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
  console.error(`[trace] ${label}${payload}`);
  if (!isSentryServerRuntimeEnabled()) return;
  Sentry.addBreadcrumb({
    category: "render-trace",
    message: label,
    level: "info",
    ...(meta ? { data: meta } : {}),
  });
}
