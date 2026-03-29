import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import { prisma } from "@/lib/db";
import { generatePasswordResetRawToken, hashPasswordResetToken } from "@/lib/password-reset-crypto";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { buildPasswordResetUrl, sendPasswordResetEmail } from "@/lib/send-password-reset-email";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().min(3).max(320),
});

const RESET_TTL_MS = 60 * 60 * 1000;

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Generic JSON for any outcome (no account enumeration).
 * Development + no email provider: includes `_devResetUrl` for manual testing only.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`forgot-password:${ip}`, { windowMs: 60_000, max: 8 });
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
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const email = normalizeEmail(parsed.data.email);
  if (!email.includes("@")) {
    return NextResponse.json(
      {
        ok: false,
        error: "Password reset uses your account email address. Enter the email on your account, not your username.",
      },
      { status: 400 },
    );
  }
  const emailOk = z.string().email().safeParse(email);
  if (!emailOk.success) {
    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });

    if (!user?.passwordHash) {
      return NextResponse.json({
        ok: true,
        message: "If an account exists for that email, a reset link has been sent.",
      });
    }

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const rawToken = generatePasswordResetRawToken();
    const tokenHash = hashPasswordResetToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const resetUrl = buildPasswordResetUrl(rawToken);
    const sendResult = await sendPasswordResetEmail({ toEmail: email, resetUrl });

    const base = {
      ok: true as const,
      message: "If an account exists for that email, a reset link has been sent.",
    };

    if (process.env.NODE_ENV === "development" && sendResult.devResetUrl) {
      return NextResponse.json({ ...base, _devResetUrl: sendResult.devResetUrl });
    }

    return NextResponse.json(base);
  } catch (e) {
    safeServerLogCritical("auth", "forgot_password_failed", { surface: "api" }, e);
    return NextResponse.json(
      { ok: false, error: "Unable to process request. Try again shortly." },
      { status: 503 },
    );
  }
}
