import "server-only";

import { createHmac } from "node:crypto";

function pepper(): string {
  return (
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    "nn-printable-privacy-dev-only"
  );
}

/** HMAC-SHA256 hex (truncated) for analytics — not reversible without server secret. */
export function hashPrintablePrivacyPart(kind: "ip" | "ua", raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const capped = kind === "ip" ? trimmed.slice(0, 64) : trimmed.slice(0, 512);
  return createHmac("sha256", pepper()).update(`${kind}:${capped}`, "utf8").digest("hex").slice(0, 64);
}
