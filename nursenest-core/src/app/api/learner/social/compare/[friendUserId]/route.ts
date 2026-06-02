import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { refreshSocialStatSnapshots } from "@/lib/social-study/refresh-social-stat-snapshots";
import { resolveVisibleSocialStats } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

export async function GET(req: Request, ctx: { params: Promise<{ friendUserId: string }> }) {
  return runWithApiTelemetry(req, "GET /api/learner/social/compare/[friendUserId]", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const { friendUserId } = await ctx.params;
    await Promise.all([
      refreshSocialStatSnapshots(prisma, gate.userId),
      refreshSocialStatSnapshots(prisma, friendUserId),
    ]);
    const stats = await resolveVisibleSocialStats(socialDb, {
      viewerUserId: gate.userId,
      subjectUserId: friendUserId,
      audience: "friend",
    });
    const viewerStats = await prisma.socialStatSnapshot.findMany({
      where: { userId: gate.userId },
      orderBy: { generatedAt: "desc" },
      take: 20,
      select: { statKey: true, value: true, generatedAt: true, expiresAt: true },
    });
    return NextResponse.json(
      {
        friendStats: stats,
        viewerStats: viewerStats.filter((row) => !row.expiresAt || row.expiresAt.getTime() > Date.now()),
      },
      { headers: mergeSubscriberPrivateCacheHeaders() },
    );
  });
}
