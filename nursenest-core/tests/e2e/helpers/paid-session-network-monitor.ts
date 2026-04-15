import type { Page, Request, Response } from "@playwright/test";

/** Log threshold for **core** APIs (warnings only, attached for triage). */
export const PAID_CORE_SLOW_WARN_MS = 3_000;

/** Fail threshold for **core** APIs — beyond this, {@link buildFailureMessages} includes a blocking line. */
export const PAID_CORE_SLOW_FAIL_MS = 6_000;

/** @deprecated Use {@link PAID_CORE_SLOW_WARN_MS} — kept for older log strings. */
export const PAID_SESSION_SLOW_MS = PAID_CORE_SLOW_WARN_MS;

/** Paths that must not error when requested during the paid journey (prefix match). */
export const PAID_SESSION_CRITICAL_API_PREFIXES = [
  "/api/lessons",
  "/api/questions",
  "/api/flashcards",
  "/api/user-access",
] as const;

export type PaidSessionSlowRequest = {
  method: string;
  url: string;
  ms: number;
  status: number;
};

export function pathnameOf(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return "";
  }
}

export function isCriticalPaidSessionApiPath(pathname: string): boolean {
  return PAID_SESSION_CRITICAL_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Same-origin browser `fetch` / `XHR` only (not document, websocket, etc.).
 */
export function isPaidSessionTrackedRequest(req: Request, appOrigin: string): boolean {
  if (req.resourceType() !== "fetch" && req.resourceType() !== "xhr") return false;
  try {
    return new URL(req.url()).origin === appOrigin;
  } catch {
    return false;
  }
}

export type PaidSessionNetworkMonitor = {
  /** Same-origin fetch/XHR responses with status &gt;= 400 */
  statusFailures: string[];
  /** Same-origin fetch/XHR slower than {@link PAID_CORE_SLOW_WARN_MS} (includes non-core). */
  slowRequests: PaidSessionSlowRequest[];
  /** Core API calls with PAID_CORE_SLOW_WARN_MS &lt; ms &lt;= PAID_CORE_SLOW_FAIL_MS — **warning only**. */
  slowCriticalWarnings: PaidSessionSlowRequest[];
  /** Core API calls with ms &gt; PAID_CORE_SLOW_FAIL_MS — **blocking** when included in {@link buildFailureMessages}. */
  slowCriticalFailures: PaidSessionSlowRequest[];
  /** Same-origin fetch/XHR that did not complete (excludes user-aborted navigations). */
  networkFailures: string[];
  /** Subset of status/network failures whose path matches {@link PAID_SESSION_CRITICAL_API_PREFIXES}. */
  criticalFailures: string[];
  formatSlowLog: () => string;
  /** Human-readable core SLO warnings (3s–6s). */
  formatSlowCriticalWarningsLog: () => string;
  buildFailureMessages: () => string[];
  dispose: () => void;
};

/**
 * Tracks all same-origin `fetch` and XHR during the session for status, latency, and hard failures.
 * Attach before any navigation. Call `dispose()` in `finally`.
 */
export function attachPaidSessionNetworkMonitor(page: Page, appOrigin: string): PaidSessionNetworkMonitor {
  const start = new Map<Request, number>();
  const statusFailures: string[] = [];
  const slowRequests: PaidSessionSlowRequest[] = [];
  const slowCriticalWarnings: PaidSessionSlowRequest[] = [];
  const slowCriticalFailures: PaidSessionSlowRequest[] = [];
  const networkFailures: string[] = [];
  const criticalFailures: string[] = [];

  const pushCritical = (line: string, url: string) => {
    const path = pathnameOf(url);
    if (isCriticalPaidSessionApiPath(path)) {
      criticalFailures.push(line);
    }
  };

  const onRequest = (req: Request) => {
    if (!isPaidSessionTrackedRequest(req, appOrigin)) return;
    start.set(req, Date.now());
  };

  const onResponse = (res: Response) => {
    const req = res.request();
    if (!isPaidSessionTrackedRequest(req, appOrigin)) return;

    const t0 = start.get(req);
    start.delete(req);
    const ms = t0 != null ? Date.now() - t0 : -1;
    const url = res.url();
    const st = res.status();

    if (st >= 400) {
      const line = `[status ${st}] ${req.method()} ${url}`;
      statusFailures.push(line);
      pushCritical(line, url);
    }

    const path = pathnameOf(url);
    const critical = isCriticalPaidSessionApiPath(path);

    if (ms > PAID_CORE_SLOW_WARN_MS) {
      slowRequests.push({ method: req.method(), url, ms, status: st });
      if (critical) {
        if (ms > PAID_CORE_SLOW_FAIL_MS) {
          slowCriticalFailures.push({ method: req.method(), url, ms, status: st });
        } else {
          slowCriticalWarnings.push({ method: req.method(), url, ms, status: st });
        }
      }
    }
  };

  const onRequestFailed = (req: Request) => {
    if (!isPaidSessionTrackedRequest(req, appOrigin)) return;
    const fail = req.failure();
    if (fail?.errorText === "net::ERR_ABORTED") return;

    const line = `[network ${fail?.errorText ?? "failed"}] ${req.method()} ${req.url()}`;
    networkFailures.push(line);
    pushCritical(line, req.url());
    start.delete(req);
  };

  page.on("request", onRequest);
  page.on("response", onResponse);
  page.on("requestfailed", onRequestFailed);

  const formatSlowLog = () =>
    [...slowRequests]
      .sort((a, b) => b.ms - a.ms)
      .map((s) => `${s.ms}ms ${s.status} ${s.method} ${s.url}`)
      .join("\n");

  const formatSlowCriticalWarningsLog = () =>
    [...slowCriticalWarnings]
      .sort((a, b) => b.ms - a.ms)
      .map(
        (s) =>
          `[slowEndpointWarning ${s.ms}ms] ${PAID_CORE_SLOW_WARN_MS}ms–${PAID_CORE_SLOW_FAIL_MS}ms ${s.method} ${s.url}`,
      )
      .join("\n");

  const buildFailureMessages = (): string[] => {
    const slowFailLines = slowCriticalFailures.map(
      (s) =>
        `slowEndpointFailure: core API ${s.ms}ms exceeds ${PAID_CORE_SLOW_FAIL_MS}ms — ${s.method} ${s.url} (status ${s.status})`,
    );
    return [...statusFailures, ...slowFailLines, ...networkFailures];
  };

  return {
    statusFailures,
    slowRequests,
    slowCriticalWarnings,
    slowCriticalFailures,
    networkFailures,
    criticalFailures,
    formatSlowLog,
    formatSlowCriticalWarningsLog,
    buildFailureMessages,
    dispose: () => {
      page.off("request", onRequest);
      page.off("response", onResponse);
      page.off("requestfailed", onRequestFailed);
      start.clear();
    },
  };
}
