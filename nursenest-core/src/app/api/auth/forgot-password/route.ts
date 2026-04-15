import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { normalizeEmailForDedup } from "@/lib/auth/email-address-normalization";
import {
  normalizeLoginIdentifier,
  sanitizeRawLoginIdentifier,
} from "@/lib/auth/normalize-login-identifier";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import { prisma } from "@/lib/db";
import { generatePasswordResetRawToken, hashPasswordResetToken } from "@/lib/password-reset-crypto";
import { PASSWORD_RESET_TOKEN_TTL_MS } from "@/lib/auth/password-reset-constants";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import {
  buildPasswordResetUrl,
  isPasswordResetEmailConfigured,
  sendPasswordResetEmail,
} from "@/lib/send-password-reset-email";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().min(3).max(320),
});

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Align with credentials login: strip invisible chars, trim, lowercase. */
function normalizeForgotPasswordEmail(raw: string): string {
  return normalizeLoginIdentifier(sanitizeRawLoginIdentifier(raw));
}

export function passwordResetCleanupWhere(userId: string, now: Date) {
  return {
    userId,
    expiresAt: { lt: now },
  };
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

  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !isPasswordResetEmailConfigured()) {
    safeServerLogCritical(
      "auth",
      "password_reset_email_unavailable",
      { reason: "missing_resend_key", surface: "api" },
      new Error("RESEND_API_KEY is required for password reset emails in production"),
    );
    return NextResponse.json(
      { ok: false, error: "Password reset email is temporarily unavailable. Please contact support." },
      { status: 503 },
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

  const email = normalizeForgotPasswordEmail(parsed.data.email);
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
    const dedup = normalizeEmailForDedup(email);

    let user =
      (await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: email, mode: "insensitive" } },
            { normalizedEmail: dedup },
          ],
        },
        select: { id: true, email: true, passwordHash: true, isDemoUser: true },
      })) ?? null;

    /** Match credentials `auth.ts` btrim fallback for legacy rows with spaces in `email`. */
    if (!user) {
      try {
        const idRows = await prisma.$queryRaw<{ id: string }[]>(
          Prisma.sql`
            SELECT id FROM "User"
            WHERE lower(btrim(email)) = lower(btrim(${email}))
            LIMIT 2
          `,
        );
        if (idRows.length === 1) {
          user = await prisma.user.findUnique({
            where: { id: idRows[0].id },
            select: { id: true, email: true, passwordHash: true, isDemoUser: true },
          });
        }
      } catch {
        /* ignore */
      }
    }

    if (!user?.passwordHash || user.isDemoUser) {
      return NextResponse.json({
        ok: true,
        message: "If an account exists for that email, a reset link has been sent.",
      });
    }

    await prisma.passwordResetToken.deleteMany({
      where: passwordResetCleanupWhere(user.id, new Date()),
    });

    const rawToken = generatePasswordResetRawToken();
    const tokenHash = hashPasswordResetToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

    const created = await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
      select: { id: true },
    });

    safeServerLog("auth", "password_reset_token_issued", {
      userIdPrefix: user.id.slice(0, 8),
      tokenIdPrefix: created.id.slice(0, 8),
      ttlMin: Math.round(PASSWORD_RESET_TOKEN_TTL_MS / 60_000),
      ip: ip.slice(0, 64),
    });

    const resetUrl = buildPasswordResetUrl(rawToken);
    /** Send to canonical address on file (fixes case/alias mismatch with typed email). */
    const sendResult = await sendPasswordResetEmail({ toEmail: user.email, resetUrl });
    captureServerEvent(analyticsDistinctId(user.id), "password_reset_requested", {}).catch(() => {});

    if (!sendResult.delivered) {
      safeServerLog("auth", "password_reset_email_not_delivered", {
        userIdPrefix: user.id.slice(0, 8),
        ip: ip.slice(0, 64),
      });
      return NextResponse.json(
        {
          ok: false,
          error:
            "We could not send the reset email (service timeout or error). Try again in a minute, or contact support if this persists.",
        },
        { status: 503 },
      );
    }

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
