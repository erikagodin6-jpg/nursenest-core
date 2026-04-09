import { NextResponse } from "next/server";
import { SubscriptionStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { isLearnerEntitlementAdminOverrideRole } from "@/lib/auth/staff-roles";
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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, tier: true, country: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let subscriptionStatus: "active" | "grace" | "none" = "none";
  if (isLearnerEntitlementAdminOverrideRole(user.role)) {
    subscriptionStatus = "active";
  } else {
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    });
    if (sub?.status === SubscriptionStatus.ACTIVE) subscriptionStatus = "active";
    else if (sub?.status === SubscriptionStatus.GRACE) subscriptionStatus = "grace";
  }

  return NextResponse.json({
    tier: user.tier,
    country: user.country,
    subscriptionStatus,
  });
}
