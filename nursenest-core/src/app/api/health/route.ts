import { NextResponse } from "next/server";

/**
 * Liveness: **no Prisma, DB, i18n, or env validation** — App Platform / probes must not depend on schema or secrets.
 * DB readiness: `GET /api/health/ready` (optional `SELECT 1` with timeout).
 */
export async function GET() {
  const mem = process.memoryUsage();
  return NextResponse.json(
    {
      ok: true,
      live: true,
      service: "nursenest-core",
      nodeEnv: process.env.NODE_ENV ?? null,
      memory: {
        heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
        rssMb: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
      },
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
