import { NextResponse } from "next/server";

/** Never cache liveness — probes must reflect current process. */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

let loggedFirstProbe = false;

/**
 * Liveness for App Platform / load balancers. No DB, auth, or Prisma — always fast 200.
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
  return NextResponse.json(
    {
      status: "ok",
      service: "nursenest-core",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { status: 200, headers: NO_STORE },
  );
}
