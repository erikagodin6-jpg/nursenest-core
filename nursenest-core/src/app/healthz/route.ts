/** Never cache liveness — probes must reflect current process. */
export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
} as const;

let loggedFirstProbe = false;

/**
 * Liveness for App Platform / load balancers. No DB, auth, or Prisma — always fast 200.
 * Uses the Web `Response` API only (minimal handler surface for cold probes).
 * Configure `health_check.http_path: /healthz` (not `/api/health`).
 * Readiness (DB ping): `GET /api/health/ready`.
 *
 * Note: `/healthz` is outside `src/proxy.ts` matchers — no auth or API rate limits.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production" && !loggedFirstProbe) {
    loggedFirstProbe = true;
    console.error("[nursenest-core] healthz: first probe (liveness)");
  }
  const body = JSON.stringify({
    status: "ok",
    service: "nursenest-core",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
  return new Response(body, { status: 200, headers: JSON_HEADERS });
}
