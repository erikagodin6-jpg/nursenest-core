import { NextResponse } from "next/server";
import { SocialStatKey, SocialVisibilityScope } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { updateSocialPrivacySettings } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

const patchSchema = z.object({
  socialEnabled: z.boolean().optional(),
  statsHidden: z.boolean().optional(),
  visibilityScope: z.nativeEnum(SocialVisibilityScope).optional(),
  visibleStatKeys: z.array(z.nativeEnum(SocialStatKey)).max(7).optional(),
  pausedUntil: z.string().datetime().nullable().optional(),
  leaderboardOptIn: z.boolean().optional(),
  allowFriendChallenges: z.boolean().optional(),
  allowGroupChallenges: z.boolean().optional(),
});

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/social/privacy", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const row = await prisma.socialPrivacySetting.findUnique({ where: { userId: gate.userId } });
    return NextResponse.json(
      {
        settings: row ?? {
          userId: gate.userId,
          socialEnabled: false,
          statsHidden: true,
          visibilityScope: SocialVisibilityScope.PRIVATE,
          visibleStatKeys: [],
          pausedUntil: null,
          leaderboardOptIn: false,
          allowFriendChallenges: false,
          allowGroupChallenges: false,
        },
      },
      { headers: mergeSubscriberPrivateCacheHeaders() },
    );
  });
}

export async function PATCH(req: Request) {
  return runWithApiTelemetry(req, "PATCH /api/learner/social/privacy", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ ok: false, code: "bad_json" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const settings = await updateSocialPrivacySettings(socialDb, gate.userId, {
      ...parsed.data,
      pausedUntil: parsed.data.pausedUntil === undefined ? undefined : parsed.data.pausedUntil ? new Date(parsed.data.pausedUntil) : null,
    });
    return NextResponse.json({ ok: true, settings }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
