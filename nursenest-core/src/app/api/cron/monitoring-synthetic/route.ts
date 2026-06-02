import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { emitMonitoringRecord } from "@/lib/observability/observability-record";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { ALERT_THRESHOLDS } from "@/lib/observability/alert-thresholds";
import { sentryCount, sentryDistribution } from "@/lib/observability/sentry-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { syntheticMonitoringFetchHeaders } from "@/lib/observability/traffic-source-constants";
import { SYNTHETIC_PUBLIC_LEARNER_PATHS } from "@/lib/observability/synthetic-monitored-paths";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function internalBaseUrl(): string | null {
  const pub = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (pub) return pub.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return null;
}

type ProbeSurface = "html" | "api_json" | "post_billing";

/** `http_ok` — marketing HTML / JSON health must be 2xx. `non_5xx` — handler responded (e.g. 401 unauthenticated API). */
type ExpectMode = "http_ok" | "non_5xx";

function probePassed(expect: ExpectMode, ok: boolean, status: number | undefined): boolean {
  if (expect === "http_ok") return ok;
  return typeof status === "number" && status >= 200 && status < 500;
}

function slowThresholdMs(surface: ProbeSurface): number {
  if (surface === "html") return ALERT_THRESHOLDS.synthetic.slowHtmlProbeMs;
  if (surface === "post_billing") return ALERT_THRESHOLDS.synthetic.slowPostProbeMs;
  return ALERT_THRESHOLDS.synthetic.slowApiProbeMs;
}

async function probeGet(
  name: string,
  url: string,
  surface: ProbeSurface,
  expect: ExpectMode,
): Promise<{ name: string; ok: boolean; status?: number; durationMs: number; surface: ProbeSurface }> {
  const started = Date.now();
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ALERT_THRESHOLDS.synthetic.probeTimeoutMs);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      cache: "no-store",
      headers: syntheticMonitoringFetchHeaders(),
    });
    const ok = res.ok;
    const passed = probePassed(expect, ok, res.status);
    return { name, ok: passed, status: res.status, durationMs: Date.now() - started, surface };
  } catch {
    return { name, ok: false, durationMs: Date.now() - started, surface };
  } finally {
    clearTimeout(t);
  }
}

async function probePost(
  name: string,
  url: string,
  surface: ProbeSurface,
  expect: ExpectMode,
  body: string,
  extraHeaders?: Record<string, string>,
): Promise<{ name: string; ok: boolean; status?: number; durationMs: number; surface: ProbeSurface }> {
  const started = Date.now();
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ALERT_THRESHOLDS.synthetic.probeTimeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: ac.signal,
      cache: "no-store",
      headers: {
        ...syntheticMonitoringFetchHeaders(),
        "content-type": "application/json",
        ...extraHeaders,
      },
      body,
    });
    const ok = res.ok;
    const passed = probePassed(expect, ok, res.status);
    return { name, ok: passed, status: res.status, durationMs: Date.now() - started, surface };
  } catch {
    return { name, ok: false, durationMs: Date.now() - started, surface };
  } finally {
    clearTimeout(t);
  }
}

function recordProbeDuration(
  r: { name: string; durationMs: number; surface: ProbeSurface; ok: boolean },
  correlation: string,
): void {
  sentryDistribution("synthetic.probe.duration_ms", r.durationMs, {
    check: r.name,
    surface: r.surface,
    traffic_source: "synthetic",
    ok: r.ok ? "true" : "false",
  });
  const slowMs = slowThresholdMs(r.surface);
  if (r.durationMs >= slowMs) {
    sentryCount("synthetic.check.slow", 1, { check: r.name, surface: r.surface });
    emitMonitoringRecord({
      scope: "synthetic",
      event: "check_slow",
      severity: "warn",
      correlationId: correlation,
      durationMs: r.durationMs,
      meta: { check: r.name, surface: r.surface, threshold_ms: slowMs },
    });
    safeServerLog("cron", "synthetic_check_slow", {
      check: r.name,
      durationMs: r.durationMs,
      thresholdMs: slowMs,
      correlation,
    });
  }
}

/** Sample Node heap from liveness JSON (MEDIUM alert if above {@link ALERT_THRESHOLDS.runtime.heapUsedMbHigh}). */
async function probeHealthMemory(base: string): Promise<void> {
  const url = `${base}/api/health`;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      cache: "no-store",
      headers: syntheticMonitoringFetchHeaders(),
    });
    if (!res.ok) return;
    const j = (await res.json()) as { memory?: { heapUsedMb?: number } };
    const heap = j.memory?.heapUsedMb;
    if (typeof heap === "number" && Number.isFinite(heap)) {
      sentryDistribution("synthetic.runtime.heap_used_mb", heap, { traffic_source: "synthetic" });
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

    const getTargets = [
      { name: "health_live", path: "/api/health", surface: "api_json" as const, expect: "http_ok" as const },
      { name: "health_ready", path: "/api/health/ready", surface: "api_json" as const, expect: "http_ok" as const },
      { name: "public_home_stats", path: "/api/public/home-stats", surface: "api_json" as const, expect: "http_ok" as const },
      { name: "marketing_home", path: "/", surface: "html" as const, expect: "http_ok" as const },
      { name: "pricing_page", path: "/pricing", surface: "html" as const, expect: "http_ok" as const },
      { name: "login_page", path: "/login", surface: "html" as const, expect: "http_ok" as const },
      { name: "pricing_options", path: "/api/pricing/options", surface: "api_json" as const, expect: "http_ok" as const },
      {
        name: "marketing_lesson_detail",
        path: SYNTHETIC_PUBLIC_LEARNER_PATHS.usRnMarketingLesson,
        surface: "html" as const,
        expect: "http_ok" as const,
      },
      {
        name: "marketing_cat_launch",
        path: SYNTHETIC_PUBLIC_LEARNER_PATHS.usRnCat,
        surface: "html" as const,
        expect: "http_ok" as const,
      },
      {
        name: "marketing_flashcards",
        path: SYNTHETIC_PUBLIC_LEARNER_PATHS.flashcardsHub,
        surface: "html" as const,
        expect: "http_ok" as const,
      },
      {
        name: "marketing_practice_exams",
        path: SYNTHETIC_PUBLIC_LEARNER_PATHS.practiceExamsHub,
        surface: "html" as const,
        expect: "http_ok" as const,
      },
      {
        name: "marketing_question_bank_hub",
        path: SYNTHETIC_PUBLIC_LEARNER_PATHS.usRnMarketingQuestions,
        surface: "html" as const,
        expect: "http_ok" as const,
      },
      /** Entitlement stack alive: unauthenticated list returns 401 (not 5xx). */
      { name: "api_lessons_gate", path: "/api/lessons?limit=1", surface: "api_json" as const, expect: "non_5xx" as const },
    ] as const;

    const [getResults, checkoutResult, webhookResult] = await Promise.all([
      Promise.all(getTargets.map((t) => probeGet(t.name, `${base}${t.path}`, t.surface, t.expect))),
      probePost(
        "checkout_api_unauthenticated",
        `${base}/api/subscriptions/checkout`,
        "post_billing",
        "non_5xx",
        "{}",
      ),
      probePost(
        "stripe_webhook_invalid_body",
        `${base}/api/subscriptions/webhook`,
        "post_billing",
        "non_5xx",
        "{}",
        { "stripe-signature": "t=0,v1=invalid" },
      ),
    ]);
    await probeHealthMemory(base);

    const results = [...getResults, checkoutResult, webhookResult];

    let failed = 0;
    for (const r of results) {
      recordProbeDuration(r, correlation);
      if (r.ok) continue;
      failed += 1;
      sentryCount("synthetic.check.failed", 1, { check: r.name, traffic_source: "synthetic" });
      emitMonitoringRecord({
        scope: "synthetic",
        event: "check_failed",
        severity: "error",
        correlationId: correlation,
        durationMs: r.durationMs,
        httpStatus: r.status,
        meta: { check: r.name, traffic_source: "synthetic" },
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
