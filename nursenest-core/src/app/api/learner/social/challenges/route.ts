import { NextResponse } from "next/server";
import { SocialChallengeType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { createSocialChallenge } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

const postSchema = z.object({
  participantUserIds: z.array(z.string().min(1)).min(1).max(20),
  type: z.nativeEnum(SocialChallengeType),
  title: z.string().trim().min(1).max(180),
  prompt: z.string().trim().max(600).nullable().optional(),
  groupId: z.string().min(1).nullable().optional(),
  expiresAt: z.string().datetime(),
});

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/social/challenges", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const rows = await prisma.socialChallengeParticipant.findMany({
      where: { userId: gate.userId },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        status: true,
        challenge: { select: { id: true, type: true, status: true, title: true, prompt: true, expiresAt: true, groupId: true } },
      },
    });
    return NextResponse.json({ challenges: rows }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/social/challenges", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const parsed = postSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const result = await createSocialChallenge(socialDb, gate.userId, {
      ...parsed.data,
      prompt: parsed.data.prompt ?? null,
      groupId: parsed.data.groupId ?? null,
      expiresAt: new Date(parsed.data.expiresAt),
    });
    return NextResponse.json(result, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
