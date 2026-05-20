import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminObservabilityLearners } from "@/lib/admin/load-admin-observability-learners";

export const dynamic = "force-dynamic";

/**
 * Paginated learner roster (email + account fields). **Support / super only** — content tier receives 403.
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (gate.admin.tier === "content") {
    return NextResponse.json({ ok: false, error: "forbidden_tier", code: "observability_learners_tier" }, { status: 403 });
  }

  const sp = req.nextUrl.searchParams;
  const pathwayId = sp.get("pathway")?.trim() || undefined;
  const trialOnly = sp.get("trial") === "1" || sp.get("trial") === "true";
  const page = Math.max(1, Math.min(25, Number.parseInt(sp.get("page") ?? "1", 10) || 1));
  const limit = Math.max(8, Math.min(40, Number.parseInt(sp.get("limit") ?? "24", 10) || 24));

  try {
    const { rows, hasMore, pageSize } = await loadAdminObservabilityLearners({
      pathwayId: pathwayId || null,
      trialOnly,
      page,
      limit,
    });
    return NextResponse.json({
      ok: true,
      page,
      pageSize,
      hasMore,
      rows,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
