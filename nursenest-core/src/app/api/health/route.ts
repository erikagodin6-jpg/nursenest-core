import { NextResponse } from "next/server";

/** Exempt from aggressive API rate limits via `/api/health` prefix — keep non-cached. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Liveness: **no Prisma, DB, i18n, or env validation** — App Platform / probes must not depend on schema or secrets.
 * DB readiness: `GET /api/health/ready` (`SELECT 1` with timeout).
 */
export async function GET() {
  return NextResponse.json({ ok: true, live: true }, { status: 200, headers: NO_STORE });
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}
