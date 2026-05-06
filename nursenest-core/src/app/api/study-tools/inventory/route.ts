import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildStudyToolsInventory } from "@/lib/study-tools/build-study-tools-inventory";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/study-tools/inventory", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;

    const pathwayId = req.nextUrl.searchParams.get("pathwayId")?.trim() ?? "";
    if (!pathwayId) {
      return NextResponse.json({ ok: false, code: "missing_pathway", message: "pathwayId is required." }, { status: 400 });
    }

    const inv = await buildStudyToolsInventory(gate.userId, gate.entitlement, pathwayId);
    if (!inv.ok) {
      const status = inv.code === "invalid_pathway" ? 400 : 403;
      return NextResponse.json({ ok: false, code: inv.code, message: inv.message }, { status });
    }

    return NextResponse.json({
      ok: true,
      pathwayId: inv.pathwayId,
      countsByCanonical: inv.countsByCanonical,
    });
  });
}
