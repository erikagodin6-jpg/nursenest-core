/**
 * Password reset tokens: raw token is sent once (email/link); only SHA-256 hash is stored in DB.
 */
import { createHash } from "crypto";

/** Default 30 minutes (spec: 15–30 min). */
const DEFAULT_TTL_MS = 30 * 60 * 1000;

export function hashPasswordResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}

export function getPasswordResetExpiryDate(): Date {
  const raw = process.env.PASSWORD_RESET_TTL_MINUTES;
  const mins = raw ? Number.parseInt(raw, 10) : NaN;
  const ms =
    Number.isFinite(mins) && mins > 0 && mins <= 24 * 60 ? mins * 60 * 1000 : DEFAULT_TTL_MS;
  return new Date(Date.now() + ms);
}

export function isResendEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim());
}
