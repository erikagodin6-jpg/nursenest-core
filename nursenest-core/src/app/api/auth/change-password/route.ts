import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { normalizeStoredPasswordHash } from "@/lib/auth/normalize-stored-password-hash";
import { strongPasswordSchema } from "@/lib/auth/password-policy";
import { JSON_BODY_AUTH_FORM, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { readStepUpHeader } from "@/lib/auth/reauth-step-up";

export const runtime = "nodejs";

const bodySchema = z
  .object({
    currentPassword: z.string().min(1).max(512),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1).max(128),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "New password and confirmation must match.",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/auth/change-password", "auth", async () => {
  const correlation = correlationIdFromRequest(req) ?? "";
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Sign in to change your password." }, { status: 401 });
  }

  void readStepUpHeader(req);

  const ip = getTrustedClientIp(req);
  const rl = await checkRateLimitUnified(`change-password:${userId}:${ip}`, { windowMs: 60_000, max: 8 });
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  setSentryServerContext({ route: "/api/auth/change-password", feature: SERVER_FEATURE.auth, userId });

  const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_AUTH_FORM);
  if (!bodyRead.ok) return bodyRead.response;

  const parsed = bodySchema.safeParse(bodyRead.value);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const hint =
      typeof first?.message === "string" && first.message.length > 0 && first.message !== "Required"
        ? first.message
        : "Invalid request.";
    return NextResponse.json({ ok: false, error: hint }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    const storedHash = normalizeStoredPasswordHash(user?.passwordHash);
    if (!storedHash) {
      return NextResponse.json(
        {
          ok: false,
          error: "Password sign-in is not enabled for this account. Use forgot password or contact support.",
        },
        { status: 400 },
      );
    }

    const ok = await compare(currentPassword, storedHash);
    if (!ok) {
      safeServerLog("auth", "change_password_failed", {
        reason: "bad_current",
        userIdPrefix: userId.slice(0, 8),
        correlation,
        severity: "expected_denial",
      });
      return NextResponse.json({ ok: false, error: "Current password is incorrect." }, { status: 400 });
    }

    const passwordHash = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        credentialVersion: { increment: 1 },
      },
    });

    await prisma.passwordResetToken.deleteMany({ where: { userId } }).catch(() => {});

    safeServerLog("auth", "password_changed", {
      userIdPrefix: userId.slice(0, 8),
      correlation,
      severity: "info",
    });

    return NextResponse.json({
      ok: true,
      message: "Password updated. Sign in again on this device to refresh your session.",
      signOutRecommended: true,
    });
  } catch (e) {
    safeServerLogCritical("auth", "change_password_failed", { surface: "api", correlation, severity: "error" }, e);
    return NextResponse.json({ ok: false, error: "Unable to change password. Try again shortly." }, { status: 503 });
  }
  });
}
