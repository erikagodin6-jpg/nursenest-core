import { NextResponse } from "next/server";
import { SocialCodeAudience } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { disableSocialInviteCode, generateSocialInviteCode } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

const postSchema = z.object({
  enabled: z.boolean().default(true),
  audience: z.nativeEnum(SocialCodeAudience).default(SocialCodeAudience.FRIEND_OR_GROUP),
});

const patchSchema = z.object({
  codeId: z.string().min(1),
  enabled: z.literal(false),
});

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/social/invite-code", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const code = await prisma.socialInviteCode.findFirst({
      where: { userId: gate.userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, displayCode: true, enabled: true, audience: true, disabledAt: true, regeneratedAt: true },
    });
    return NextResponse.json({ code }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/social/invite-code", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const code = await generateSocialInviteCode(socialDb, gate.userId, parsed.data);
    return NextResponse.json(
      { ok: true, code: { id: code.id, displayCode: code.displayCode, enabled: code.enabled, audience: code.audience } },
      { headers: mergeSubscriberPrivateCacheHeaders() },
    );
  });
}

export async function PATCH(req: Request) {
  return runWithApiTelemetry(req, "PATCH /api/learner/social/invite-code", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const parsed = patchSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const result = await disableSocialInviteCode(socialDb, gate.userId, parsed.data.codeId);
    return NextResponse.json(result, {
      status: result.ok ? 200 : 404,
      headers: mergeSubscriberPrivateCacheHeaders(),
    });
  });
}
