import { createHash } from "crypto";

/** Non-reversible fingerprint for logs (no raw email/username). */
export function hashLoginIdentifierForLog(normalizedIdentifier: string): string {
  return createHash("sha256").update(normalizedIdentifier, "utf8").digest("hex").slice(0, 12);
}
