import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { resolveVisibleSocialStats } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

export async function GET(req: Request, ctx: { params: Promise<{ friendUserId: string }> }) {
  return runWithApiTelemetry(req, "GET /api/learner/social/compare/[friendUserId]", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const { friendUserId } = await ctx.params;
    const stats = await resolveVisibleSocialStats(socialDb, {
      viewerUserId: gate.userId,
      subjectUserId: friendUserId,
      audience: "friend",
    });
    return NextResponse.json({ stats }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
