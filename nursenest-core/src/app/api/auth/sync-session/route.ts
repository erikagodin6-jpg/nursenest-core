import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserAccess, subscriptionStatusForSession } from "@/lib/entitlements/get-user-access";
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

  const userRow = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  if (!userRow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const userAccess = await getUserAccess(userId);
  const subscriptionStatus = subscriptionStatusForSession(userAccess);

  return NextResponse.json({
    tier: userAccess.allowedProfession.tier,
    country: userAccess.allowedRegion.country,
    subscriptionStatus,
    /** Authoritative Prisma `User.role` — merge into JWT via `useSession().update({ role })`. */
    role: userRow.role,
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
