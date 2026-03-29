/**
 * Single place for environment flags used by auth/session flows today (Replit-oriented).
 * Future auth migration: swap implementations here and in admin-auth / client auth hook without scattering env reads.
 */
export function isReplitDeployment(): boolean {
  return String(process.env.REPLIT_DEPLOYMENT || "").trim() === "1";
}

export function replitDomains(): string[] {
  const raw = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function sessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME?.trim() || "connect.sid";
}
