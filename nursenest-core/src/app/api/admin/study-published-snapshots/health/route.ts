import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { runStudyPublishedSnapshotHealthScan } from "@/lib/study-content-failover/study-snapshot-runtime-diagnostics";

export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const;

/**
 * Admin-only snapshot store health (mount, readability, bounded file scan). Does not expose file contents.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const maxFiles = Math.min(800, Math.max(50, Number(url.searchParams.get("maxFiles")) || 400));
  const maxDepth = Math.min(12, Math.max(2, Number(url.searchParams.get("maxDepth")) || 6));

  const report = await runStudyPublishedSnapshotHealthScan({ maxFiles, maxDepth });
  return NextResponse.json(
    {
      ok: true,
      ...report,
    },
    { status: 200, headers: NO_STORE },
  );
}
