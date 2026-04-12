import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserAccess } from "@/lib/entitlements/get-user-access";

export const dynamic = "force-dynamic";

/**
 * Returns DB-backed tier / country / subscription mirror for JWT refresh after checkout (webhook updates User + Subscription).
 */
export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userAccess = await getUserAccess(userId);

  return NextResponse.json({
    tier: userAccess.allowedProfession.tier,
    country: userAccess.allowedRegion.country,
    subscriptionStatus:
      userAccess.plan.status === "active" || userAccess.plan.status === "grace"
        ? userAccess.plan.status === "grace"
          ? "grace"
          : "active"
        : "none",
    subscription: {
      planCode: userAccess.plan.planCode,
      planDuration: userAccess.plan.duration,
      planStatus: userAccess.plan.status,
      expiresAt: userAccess.plan.expiresAt?.toISOString() ?? null,
      billingRegionSlug: userAccess.allowedRegion.billingRegionSlug,
      examPathwayId: userAccess.allowedExam.pathwayId,
    },
  });
}
