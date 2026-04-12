import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createAndSendVerificationEmail } from "@/lib/auth/email-verification";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
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
  const ip = clientIp(req);
  const rl = checkRateLimit(`resend-verify:${ip}`, { windowMs: 60_000, max: 4 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
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
}
