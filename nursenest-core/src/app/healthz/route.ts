import { NextResponse } from "next/server";

let loggedFirstProbe = false;

/**
 * Liveness for App Platform / load balancers. No DB, auth, or Prisma — always fast 200.
 * Configure `health_check.http_path: /healthz` (not `/api/health`).
 * Readiness (optional DB ping): `GET /api/health/ready`.
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
    { status: 200 },
  );
}
