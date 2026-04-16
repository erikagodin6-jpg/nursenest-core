import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { enforcePracticeTestsCatReadinessProtection } from "@/lib/http/api-protection";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { assessCatPracticeReadinessForPathway } from "@/lib/practice-tests/cat-practice-readiness";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export async function GET(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const rl = await enforcePracticeTestsCatReadinessProtection(req, gate.userId);
  if (rl) return rl;

  setSentryServerContext({
    route: "/api/practice-tests/cat-readiness",
    feature: SERVER_FEATURE.practiceTest,
    userId: gate.userId,
  });

  const pathwayId = req.nextUrl.searchParams.get("pathwayId")?.trim() ?? "";
  if (pathwayId.length < 2) {
    return NextResponse.json({ ok: false, code: "pathway_required", message: "pathwayId query parameter is required." }, { status: 400 });
  }

  const result = await assessCatPracticeReadinessForPathway(gate.userId, gate.entitlement, pathwayId);
  if (!result.ok) {
    safeServerLog("cat_readiness", "preflight_not_ready", {
      code: result.code,
      pathwayIdPrefix: pathwayId.length > 12 ? `${pathwayId.slice(0, 12)}…` : pathwayId,
      userIdPrefix: gate.userId.slice(0, 8),
    });
  }
  return NextResponse.json(result);
}
