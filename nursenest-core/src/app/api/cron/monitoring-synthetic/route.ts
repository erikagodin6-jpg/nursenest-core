import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { emitMonitoringRecord } from "@/lib/observability/observability-record";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { ALERT_THRESHOLDS } from "@/lib/observability/alert-thresholds";
import { sentryCount, sentryDistribution } from "@/lib/observability/sentry-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function internalBaseUrl(): string | null {
  const pub = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (pub) return pub.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return null;
}

async function probeGet(
  name: string,
  url: string,
): Promise<{ name: string; ok: boolean; status?: number; durationMs: number }> {
  const started = Date.now();
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      cache: "no-store",
      headers: { accept: "application/json, text/html;q=0.9, */*;q=0.8" },
    });
    return { name, ok: res.ok, status: res.status, durationMs: Date.now() - started };
  } catch {
    return { name, ok: false, durationMs: Date.now() - started };
  } finally {
    clearTimeout(t);
  }
}

/** Sample Node heap from liveness JSON (MEDIUM alert if above {@link ALERT_THRESHOLDS.runtime.heapUsedMbHigh}). */
async function probeHealthMemory(base: string): Promise<void> {
  const url = `${base}/api/health`;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 5000);
  try {
    const res = await fetch(url, { signal: ac.signal, cache: "no-store" });
    if (!res.ok) return;
    const j = (await res.json()) as { memory?: { heapUsedMb?: number } };
    const heap = j.memory?.heapUsedMb;
    if (typeof heap === "number" && Number.isFinite(heap)) {
      sentryDistribution("synthetic.runtime.heap_used_mb", heap, {});
      if (heap >= ALERT_THRESHOLDS.runtime.heapUsedMbHigh) {
        emitMonitoringRecord({
          scope: "synthetic",
          event: "high_heap_sample",
          severity: "warn",
          meta: { heapUsedMb: Math.round(heap) },
        });
      }
    }
  } catch {
    /* ignore */
  } finally {
    clearTimeout(t);
  }
}

/**
 * Internal uptime-style probes against this deployment.
 * Vercel Cron issues **GET**; schedulers may use **POST**. Both require `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set.
 */
function runSyntheticChecks(req: Request, methodLabel: "GET" | "POST") {
  const routeId = `${methodLabel} /api/cron/monitoring-synthetic`;
  return runWithApiTelemetry(req, routeId, "cron", async () => {
    const denied = enforceCronSecretOrResponse(req);
    if (denied) return denied;

    const correlation = correlationIdFromRequest(req) ?? "";
    const base = internalBaseUrl();
    if (!base) {
      safeServerLog("cron", "synthetic_missing_base_url", { correlation });
      emitMonitoringRecord({
        scope: "synthetic",
        event: "probe_config_error",
        severity: "error",
        correlationId: correlation,
        meta: { reason: "no_public_origin" },
      });
      return NextResponse.json(
        { ok: false, error: "Set NEXT_PUBLIC_APP_URL or deploy with VERCEL_URL for synthetic checks." },
        { status: 503 },
      );
    }

    const targets = [
      { name: "health_live", path: "/api/health" },
      { name: "health_ready", path: "/api/health/ready" },
      { name: "public_home_stats", path: "/api/public/home-stats" },
      { name: "marketing_home", path: "/" },
      { name: "login_page", path: "/login" },
      { name: "pricing_options", path: "/api/pricing/options" },
    ] as const;

    const [results] = await Promise.all([
      Promise.all(targets.map((t) => probeGet(t.name, `${base}${t.path}`))),
      probeHealthMemory(base),
    ]);

    let failed = 0;
    for (const r of results) {
      if (r.ok) continue;
      failed += 1;
      sentryCount("synthetic.check.failed", 1, { check: r.name });
      emitMonitoringRecord({
        scope: "synthetic",
        event: "check_failed",
        severity: "error",
        correlationId: correlation,
        durationMs: r.durationMs,
        httpStatus: r.status,
        meta: { check: r.name },
      });
      safeServerLog("cron", "synthetic_check_failed", {
        check: r.name,
        httpStatus: r.status,
        durationMs: r.durationMs,
        correlation,
      });
    }

    const ok = failed === 0;
    return NextResponse.json(
      { ok, base, correlation, results },
      { status: ok ? 200 : 503 },
    );
  });
}

export async function GET(req: Request) {
  return runSyntheticChecks(req, "GET");
}

export async function POST(req: Request) {
  return runSyntheticChecks(req, "POST");
}
