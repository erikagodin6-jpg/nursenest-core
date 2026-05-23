import { buildHealthProbeLogEntry } from "@/lib/health/health-probe-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEALTHZ_SLOW_THRESHOLD_MS = 100;

export function GET() {
  const started = Date.now();
  const response = new Response("ok", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
  const entry = buildHealthProbeLogEntry({
    route: "/healthz",
    status: response.status,
    durationMs: Date.now() - started,
    uptimeMs: Math.round(process.uptime() * 1000),
    slowThresholdMs: HEALTHZ_SLOW_THRESHOLD_MS,
  });
  if (entry) {
    console.error(`[nursenest-core] health ${entry.event} ${JSON.stringify(entry.meta)}`);
  }
  return response;
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
