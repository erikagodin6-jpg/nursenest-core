/**
 * Sentry helpers with **no static `@sentry/nextjs` import**.
 * When disabled (`SENTRY_ENABLED` / DSN or `NEXT_PUBLIC_*` / DSN), calls are immediate no-ops.
 */
import { isSentryClientRuntimeEnabled, isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";

type LooseCaptureContext = Record<string, unknown> | undefined;

/** Fire-and-forget server exception when Sentry is enabled. */
export function captureServerExceptionIfEnabled(error: unknown, captureContext?: LooseCaptureContext): void {
  if (!isSentryServerRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.captureException(error instanceof Error ? error : new Error(String(error)), captureContext as never);
    })
    .catch(() => {});
}

export async function captureServerExceptionIfEnabledAwait(error: unknown, captureContext?: LooseCaptureContext): Promise<void> {
  if (!isSentryServerRuntimeEnabled()) return;
  try {
    const S = await importSentryNextjs();
    S.captureException(error instanceof Error ? error : new Error(String(error)), captureContext as never);
  } catch {
    /* ignore */
  }
}

/** Fire-and-forget server message when Sentry is enabled. */
export function captureServerMessageIfEnabled(
  message: string,
  captureContext?: LooseCaptureContext,
): void {
  if (!isSentryServerRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.captureMessage(message, captureContext as never);
    })
    .catch(() => {});
}

export function addServerBreadcrumbIfEnabled(crumb: {
  category: string;
  message: string;
  level?: "fatal" | "error" | "warning" | "log" | "info" | "debug";
  data?: Record<string, unknown>;
}): void {
  if (!isSentryServerRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.addBreadcrumb(crumb);
    })
    .catch(() => {});
}

export function setServerUserIfEnabled(user: { id: string } | null): void {
  if (!isSentryServerRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.setUser(user);
    })
    .catch(() => {});
}

export function setServerContextIfEnabled(name: string, context: Record<string, unknown> | null): void {
  if (!isSentryServerRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.setContext(name, context);
    })
    .catch(() => {});
}

/**
 * Run `fn` inside `Sentry.withScope` when enabled (async completion is not awaited by callers).
 */
export function withSentryServerScopeIfEnabled(fn: (scope: { setTag: (k: string, v: string) => void }) => void): void {
  if (!isSentryServerRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.withScope(fn as never);
    })
    .catch(() => {});
}

/** Client: error boundaries, deduped observability, etc. */
export function captureClientExceptionIfEnabled(error: unknown, captureContext?: LooseCaptureContext): void {
  if (!isSentryClientRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.captureException(error instanceof Error ? error : new Error(String(error)), captureContext as never);
    })
    .catch(() => {});
}

export function captureClientMessageIfEnabled(message: string, captureContext?: LooseCaptureContext): void {
  if (!isSentryClientRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.captureMessage(message, captureContext as never);
    })
    .catch(() => {});
}

export function addClientBreadcrumbIfEnabled(crumb: {
  category: string;
  message: string;
  level?: "fatal" | "error" | "warning" | "log" | "info" | "debug";
  data?: Record<string, unknown>;
}): void {
  if (!isSentryClientRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.addBreadcrumb(crumb);
    })
    .catch(() => {});
}

export function setClientUserIfEnabled(user: { id: string } | null): void {
  if (!isSentryClientRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.setUser(user);
    })
    .catch(() => {});
}

export function setClientTagIfEnabled(key: string, value: string): void {
  if (!isSentryClientRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((S) => {
      S.setTag(key, value);
    })
    .catch(() => {});
}
