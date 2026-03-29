import { createHash, randomBytes } from "crypto";

/** Deterministic SHA-256 hex digest of the raw URL token (server-only). */
export function hashPasswordResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}

export function generatePasswordResetRawToken(): string {
  return randomBytes(32).toString("base64url");
}
