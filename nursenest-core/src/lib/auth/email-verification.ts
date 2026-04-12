import "server-only";

import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { sendTransactionalEmailHtml } from "@/lib/email/resend-transactional";
import { appOriginForEmail } from "@/lib/email/app-origin";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function hashVerificationToken(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

export function generateVerificationRawToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Strips dots and the `+alias` portion from gmail-style addresses to produce a
 * canonical form. For non-gmail domains, just lowercases and trims.
 */
export function normalizeEmailForDedup(email: string): string {
  const lower = email.trim().toLowerCase();
  const [localRaw, domain] = lower.split("@");
  if (!localRaw || !domain) return lower;

  const gmailDomains = ["gmail.com", "googlemail.com"];
  if (gmailDomains.includes(domain)) {
    const withoutPlus = localRaw.split("+")[0] ?? localRaw;
    const withoutDots = withoutPlus.replace(/\./g, "");
    return `${withoutDots}@${domain}`;
  }

  const plusStripped = localRaw.split("+")[0] ?? localRaw;
  return `${plusStripped}@${domain}`;
}

export async function createAndSendVerificationEmail(userId: string, email: string): Promise<{ ok: boolean }> {
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });

  const rawToken = generateVerificationRawToken();
  const tokenHash = hashVerificationToken(rawToken);
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

  await prisma.emailVerificationToken.create({
    data: { tokenHash, userId, expiresAt },
  });

  const origin = appOriginForEmail();
  const verifyUrl = `${origin}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;

  const html = `
    <p style="font-size:16px;font-weight:600;margin-bottom:8px;">Verify Your Email</p>
    <p>Confirm your email address to activate your NurseNest account.</p>
    <p style="margin:24px 0;">
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 28px;background:#4f46e5;color:#fff;font-weight:600;border-radius:8px;text-decoration:none;">Verify Email</a>
    </p>
    <p style="font-size:13px;color:#666;">This link expires in 24 hours. If you did not create a NurseNest account, you can ignore this email.</p>
  `;

  const result = await sendTransactionalEmailHtml({
    to: email,
    subject: "Verify your NurseNest email",
    html,
    text: `Verify your email: ${verifyUrl}`,
  });

  safeServerLog("auth", "verification_email_sent", {
    userIdPrefix: userId.slice(0, 8),
    sent: result.ok,
  });

  return { ok: result.ok };
}

export async function consumeVerificationToken(rawToken: string): Promise<
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid" | "expired" }
> {
  const tokenHash = hashVerificationToken(rawToken);

  const row = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true },
  });

  if (!row) return { ok: false, reason: "invalid" };

  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.emailVerificationToken.delete({ where: { id: row.id } }).catch(() => {});
    return { ok: false, reason: "expired" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { emailVerified: true },
    }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: row.userId } }),
  ]);

  safeServerLog("auth", "email_verified", { userIdPrefix: row.userId.slice(0, 8) });

  return { ok: true, userId: row.userId };
}
