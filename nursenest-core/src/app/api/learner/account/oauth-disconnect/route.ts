import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { disconnectOAuthProviderForUser } from "@/lib/auth/oauth-connected-accounts.server";
import { JSON_BODY_AUTH_FORM, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { prisma } from "@/lib/db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const runtime = "nodejs";

const bodySchema = z.object({
  provider: z.enum(["google", "apple"]),
});

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/account/oauth-disconnect", "auth", async () => {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id?.trim() ?? "";
    if (!userId) {
      return NextResponse.json({ ok: false, code: "UNAUTHORIZED" }, { status: 401 });
    }

    const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_AUTH_FORM);
    if (!bodyRead.ok) return bodyRead.response;

    const parsed = bodySchema.safeParse(bodyRead.value);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "INVALID_BODY" }, { status: 400 });
    }

    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });
    const hasPassword = Boolean(row?.passwordHash);

    const result = await disconnectOAuthProviderForUser({
      userId,
      provider: parsed.data.provider,
      hasPassword,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: result.code === "LAST_LOGIN_METHOD" ? 409 : 400 });
    }

    return NextResponse.json({ ok: true });
  });
}
