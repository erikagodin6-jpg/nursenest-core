import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";

type RenderTraceMeta = Record<string, string | number | boolean | undefined>;

function renderTraceVerboseEnabled(): boolean {
  const v = process.env.NN_RENDER_TRACE?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export function renderTrace(label: string, meta?: RenderTraceMeta): void {
  const payload =
    meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
  const line = `[trace] ${label}${payload}`;
  if (renderTraceVerboseEnabled()) {
    console.info(line);
  } else {
    console.debug(line);
  }
  if (!isSentryServerRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((Sentry) =>
      Sentry.addBreadcrumb({
        category: "render-trace",
        message: label,
        level: "info",
        ...(meta ? { data: meta } : {}),
      }),
    )
    .catch(() => {});
}
