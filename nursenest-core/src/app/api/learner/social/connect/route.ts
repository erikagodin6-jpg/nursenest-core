import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { connectWithSocialCode } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const schema = z.object({ code: z.string().trim().min(4).max(32) });
const socialDb = prisma as unknown as SocialStudyDb;

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/social/connect", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const result = await connectWithSocialCode(socialDb, gate.userId, parsed.data.code);
    return NextResponse.json(result, {
      status: result.ok ? 200 : 404,
      headers: mergeSubscriberPrivateCacheHeaders(),
    });
  });
}
