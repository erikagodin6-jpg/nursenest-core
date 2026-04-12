import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { strongPasswordSchema } from "@/lib/auth/password-policy";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import { prisma } from "@/lib/db";
import { hashPasswordResetToken } from "@/lib/password-reset-crypto";
import { PASSWORD_RESET_TOKEN_TTL_MS } from "@/lib/auth/password-reset-constants";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

const bodySchema = z.object({
  token: z.string().min(20).max(512),
  password: strongPasswordSchema,
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`reset-password:${ip}`, { windowMs: 60_000, max: 10 });
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
    const first = parsed.error.issues[0];
    const hint =
      typeof first?.message === "string" && first.message.length > 0 && first.message !== "Required"
        ? first.message
        : "Invalid token or password.";
    return NextResponse.json({ ok: false, error: hint }, { status: 400 });
  }

  const { token, password } = parsed.data;
  const tokenHash = hashPasswordResetToken(token);

  try {
    const row = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, expiresAt: true },
    });

    const tokenHashPrefix = tokenHash.slice(0, 12);
    const now = Date.now();

    if (!row) {
      safeServerLog("auth", "password_reset_token_rejected", {
        reason: "not_found",
        tokenHashPrefix,
        ip: ip.slice(0, 64),
      });
      return NextResponse.json(
        { ok: false, error: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    if (row.expiresAt.getTime() < now) {
      safeServerLog("auth", "password_reset_token_rejected", {
        reason: "expired",
        tokenHashPrefix,
        ttlMin: Math.round(PASSWORD_RESET_TOKEN_TTL_MS / 60_000),
        ip: ip.slice(0, 64),
      });
      await prisma.passwordResetToken.delete({ where: { id: row.id } }).catch(() => {});
      return NextResponse.json(
        { ok: false, error: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    const passwordHash = await hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash, credentialVersion: { increment: 1 } },
      }),
      prisma.passwordResetToken.deleteMany({ where: { userId: row.userId } }),
    ]);

    safeServerLog("auth", "password_reset_token_consumed", {
      userIdPrefix: row.userId.slice(0, 8),
      tokenIdPrefix: row.id.slice(0, 8),
      tokenHashPrefix,
      ip: ip.slice(0, 64),
    });
    captureServerEvent(analyticsDistinctId(row.userId), "password_reset_completed", {}).catch(() => {});

    return NextResponse.json({ ok: true, message: "Password updated. You can sign in now." });
  } catch (e) {
    safeServerLogCritical("auth", "reset_password_failed", { surface: "api" }, e);
    return NextResponse.json(
      { ok: false, error: "Unable to reset password. Try again shortly." },
      { status: 503 },
    );
  }
}
