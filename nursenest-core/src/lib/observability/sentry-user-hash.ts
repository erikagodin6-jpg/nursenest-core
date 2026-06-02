import { createHash } from "crypto";

/** Stable 8-char hash for Sentry user context (not reversible to user id). */
export function sentryUserHash(userId: string): string {
  return createHash("sha256").update(userId).digest("hex").slice(0, 8);
}
