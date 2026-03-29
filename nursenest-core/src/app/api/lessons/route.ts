import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { freemiumLessonWhereForProfile, lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { CountryCode, TierCode } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(20, Math.max(5, Number(req.nextUrl.searchParams.get("pageSize") ?? "10")));

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    safeServerLogCritical("api_lessons", "entitlement_resolve_failed", { page }, e);
    return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
  }

  if (entitlement.hasAccess) {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({ route: "/api/lessons", feature: "lesson", userId: gate.userId });

    try {
      const lessons = await withRetry(() =>
        prisma.contentItem.findMany({
          where: lessonAccessWhere(gate.entitlement),
          select: { id: true, slug: true, title: true, summary: true },
          orderBy: { updatedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      );

      return NextResponse.json({ page, pageSize, lessons, mode: "subscriber" as const });
    } catch (e) {
      safeServerLogCritical("api_lessons", "prisma_find_failed", { page }, e);
      return NextResponse.json({ error: "Unable to load lessons. Try again shortly." }, { status: 503 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { country: true, tier: true, freeLessonOpens: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/lessons", feature: "lesson", userId });

  const snap = await getFreemiumSnapshot(userId);
  if (!snap || snap.lessonRemaining <= 0) {
    return NextResponse.json(
      {
        error: "Subscription required",
        code: "paywall",
        message: "Complimentary lesson previews are used up. Subscribe for full lesson depth and tracking.",
        freemiumExhausted: true,
      },
      { status: 403 },
    );
  }

  const take = Math.min(pageSize, snap.lessonRemaining);

  try {
    const where = freemiumLessonWhereForProfile(user.country as CountryCode, user.tier as TierCode);
    const lessons = await withRetry(() =>
      prisma.contentItem.findMany({
        where,
        select: { id: true, slug: true, title: true, summary: true },
        orderBy: { updatedAt: "desc" },
        skip: 0,
        take,
      }),
    );

    const used = lessons.length;
    if (used > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { freeLessonOpens: { increment: used } },
      });
    }

    const remaining = Math.max(0, snap.lessonRemaining - used);
    const trimmedSummary = lessons.map((l) => ({
      ...l,
      summary:
        (l.summary ?? "").length > 220
          ? `${(l.summary ?? "").slice(0, 220).trim()}… — unlock full lessons with a subscription.`
          : l.summary ?? "",
    }));

    return NextResponse.json({
      page: 1,
      pageSize: take,
      lessons: trimmedSummary,
      mode: "freemium" as const,
      freemiumRemainingAfterBatch: remaining,
    });
  } catch (e) {
    safeServerLogCritical("api_lessons", "prisma_find_failed_freemium", { page }, e);
    return NextResponse.json({ error: "Unable to load lessons. Try again shortly." }, { status: 503 });
  }
}
