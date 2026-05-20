import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";
import { buildStudyPlanForUser } from "@/lib/remediation/build-study-plan";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/study-plan", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    if (!isRemediationEngineEnabled() || !isDatabaseUrlConfigured()) {
      return NextResponse.json({
        enabled: false,
        asOf: new Date().toISOString(),
        remediationDue: [],
        recommendedLessons: [],
        recommendedFlashcards: [],
        recommendedPractice: [],
      });
    }

    try {
      const plan = await buildStudyPlanForUser(prisma, gate.userId, gate.entitlement);
      return NextResponse.json(plan);
    } catch {
      return NextResponse.json(
        {
          enabled: true,
          asOf: new Date().toISOString(),
          remediationDue: [],
          recommendedLessons: [],
          recommendedFlashcards: [],
          recommendedPractice: [],
          degraded: true,
        },
        { status: 200 },
      );
    }
  });
}
