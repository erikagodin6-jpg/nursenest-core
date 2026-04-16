import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createAndSendVerificationEmail } from "@/lib/auth/email-verification";
import { JSON_BODY_AUTH_FORM, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email().max(320),
});

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/auth/resend-verification", "auth", async () => {
  const ip = clientIp(req);
  const rl = await checkRateLimitUnified(`resend-verify:${ip}`, { windowMs: 60_000, max: 4 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429 },
    );
  }

  const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_AUTH_FORM);
  if (!bodyRead.ok) return bodyRead.response;

  const parsed = bodySchema.safeParse(bodyRead.value);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true },
  });

  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "If an account exists, a verification email has been sent.",
    });
  }

  if (user.emailVerified) {
    return NextResponse.json({
      ok: true,
      message: "Your email is already verified. You can sign in.",
    });
  }

  await createAndSendVerificationEmail(user.id, email);

  safeServerLog("auth", "verification_resent", { userIdPrefix: user.id.slice(0, 8) });

  return NextResponse.json({
    ok: true,
    message: "If an account exists, a verification email has been sent.",
  });
  });
}
