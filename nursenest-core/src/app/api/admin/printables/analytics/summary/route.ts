import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getPrintableAnalyticsSummary } from "@/lib/printables/printable-analytics.server";
import { assertPrintableAdminSurface } from "@/lib/printables/printable-admin-gate";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";

export const runtime = "nodejs";

const PRIVATE = { headers: mergeSubscriberPrivateCacheHeaders() } as const;

export async function GET(req: Request) {
  const surface = assertPrintableAdminSurface();
  if (surface) return surface;
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const where =
    from && to
      ? {
          downloadedAt: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }
      : undefined;

  const summary = await getPrintableAnalyticsSummary(where);
  return NextResponse.json({ ok: true, summary }, { headers: PRIVATE.headers });
}
