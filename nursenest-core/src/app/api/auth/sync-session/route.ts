import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserAccess } from "@/lib/entitlements/get-user-access";
import { prisma } from "@/lib/db";

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

  const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const userAccess = await getUserAccess(userId);

  let subscriptionStatus: "active" | "grace" | "none" = "none";
  if (userAccess.hasPremium) {
    subscriptionStatus = userAccess.reason === "grace_period" ? "grace" : "active";
  }

  return NextResponse.json({
    tier: userAccess.allowedProfession.tier,
    country: userAccess.allowedRegion.country,
    subscriptionStatus,
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
