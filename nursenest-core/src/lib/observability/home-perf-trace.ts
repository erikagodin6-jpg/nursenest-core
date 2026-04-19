import "server-only";

import { headers } from "next/headers";
import { NN_CORRELATION_HEADER } from "@/lib/observability/correlation-id";
import { NN_HOME_PERF_ANCHOR_HEADER, NN_HOME_PERF_REQUEST_KIND_HEADER } from "@/lib/observability/home-perf-headers";

const ENV_FLAG = "NN_TRACE_HOME_PERF";
const MARKETING_BUILD_PHASE = "phase-production-build";

/** Temporary production diagnostics for `GET /` only. Remove by unsetting {@link ENV_FLAG}. */
export function isHomePerfTraceEnabled(): boolean {
  if (process.env.NEXT_PHASE === MARKETING_BUILD_PHASE) return false;
  return process.env[ENV_FLAG]?.trim().toLowerCase() === "true";
}

const anchorByCorrelation = new Map<string, number>();

function anchorMs(correlationKey: string, now: number): number {
  const key = correlationKey || "none";
  let t = anchorByCorrelation.get(key);
  if (t == null) {
    t = now;
    anchorByCorrelation.set(key, t);
    setTimeout(() => anchorByCorrelation.delete(key), 3 * 60_000);
  }
  return t;
}

type HomePerfExtra = Record<string, string | number | boolean | undefined>;

async function readHomePerfContext(): Promise<{
  pathname: string;
  correlation: string;
  anchorFromProxy: number | null;
  requestKind: string | undefined;
}> {
  let pathname = "";
  let correlation = "";
  let anchorFromProxy: number | null = null;
  let requestKind: string | undefined;
  try {
    const h = await headers();
    pathname = h.get("x-nn-request-pathname")?.trim() ?? "";
    correlation = h.get(NN_CORRELATION_HEADER)?.trim()?.slice(0, 64) ?? "";
    const rawAnchor = h.get(NN_HOME_PERF_ANCHOR_HEADER)?.trim();
    if (rawAnchor) {
      const n = Number(rawAnchor);
      if (Number.isFinite(n)) anchorFromProxy = n;
    }
    requestKind = h.get(NN_HOME_PERF_REQUEST_KIND_HEADER)?.trim() || undefined;
  } catch {
    /* headers() unavailable */
  }
  return { pathname, correlation, anchorFromProxy, requestKind };
}

/**
 * One JSON line on stderr for `GET /` when {@link ENV_FLAG}=true. Uses proxy-set pathname + correlation
 * (no PII). `duration_ms` = ms since Edge anchor (or first log for this correlation if anchor missing).
 */
export async function homePerfLogForGetRoot(
  phase: string,
  segmentT0: number,
  extra?: HomePerfExtra,
): Promise<void> {
  if (!isHomePerfTraceEnabled()) return;
  const { pathname, correlation, anchorFromProxy, requestKind } = await readHomePerfContext();
  if (pathname !== "/") return;

  const now = Date.now();
  const corrKey = correlation || "none";
  const anchor = anchorFromProxy ?? anchorMs(corrKey, now);
  const duration_ms = now - anchor;
  const segment_ms = now - segmentT0;

  console.error(
    JSON.stringify({
      tag: "nn_home_perf",
      phase,
      pathname: "/",
      duration_ms,
      segment_ms,
      wall_ms: now,
      correlation: correlation || undefined,
      request_kind: requestKind,
      ...extra,
    }),
  );
}

/** Single terminal line per successful or failed `GET /` home pipeline (layout/page/deferred). */
export async function homePerfFinalForGetRoot(
  outcome: "success" | "failure",
  extra?: HomePerfExtra & { error_phase?: string },
): Promise<void> {
  if (!isHomePerfTraceEnabled()) return;
  const { pathname, correlation, anchorFromProxy, requestKind } = await readHomePerfContext();
  if (pathname !== "/") return;

  const now = Date.now();
  const corrKey = correlation || "none";
  const anchor = anchorFromProxy ?? anchorMs(corrKey, now);
  const duration_ms = now - anchor;

  console.error(
    JSON.stringify({
      tag: "nn_home_perf",
      phase: "home.server.final",
      outcome,
      pathname: "/",
      duration_ms,
      wall_ms: now,
      correlation: correlation || undefined,
      request_kind: requestKind,
      ...extra,
    }),
  );
}
