import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getPostgresRateLimitStore, shouldUsePostgresRateLimitStore } from "@/lib/http/rate-limit-store-resolve";

export const dynamic = "force-dynamic";

/**
 * Operator visibility: whether the distributed Postgres rate-limit store is reachable.
 * Does not expose counters, keys, or client identities.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const wantsPostgres = shouldUsePostgresRateLimitStore();
  const pg = wantsPostgres ? await getPostgresRateLimitStore() : null;

  return NextResponse.json(
    {
      ok: true,
      wantsDistributedPostgres: wantsPostgres,
      postgresStoreReady: Boolean(pg),
      degraded: wantsPostgres && !pg,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
