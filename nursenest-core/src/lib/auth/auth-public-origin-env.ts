/**
 * Canonical public-origin checks for `AUTH_URL` / `NEXTAUTH_URL` (Auth.js / NextAuth v5).
 * Keeps secure-cookie naming aligned with {@link resolveNextAuthHttpsForRequest} and `@auth/core` init.
 *
 * Shape matches {@link import("@/lib/env/production-env-guard").EnvIssue} — avoid importing that module here (cycles).
 */
export type AuthPublicOriginIssue = {
  code: string;
  severity: "critical" | "warning";
  message: string;
};

function isTruthy(v: string | undefined): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function parsePublicOrigin(raw: string): URL | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    return new URL(t.includes("://") ? t : `https://${t}`);
  } catch {
    return null;
  }
}

function originKey(u: URL): string {
  return `${u.protocol}//${u.host}`.toLowerCase();
}

export function hasAnyAuthPublicOriginUrl(): boolean {
  return isTruthy(process.env.AUTH_URL) || isTruthy(process.env.NEXTAUTH_URL);
}

/**
 * Validates every set auth public URL and cross-checks pairs. Call from production env guard and
 * `scripts/verify-auth-public-origin.ts`.
 */
export function collectAuthPublicOriginEnvIssues(options: {
  requireProductionHttps: boolean;
}): AuthPublicOriginIssue[] {
  const issues: AuthPublicOriginIssue[] = [];
  const aRaw = process.env.AUTH_URL?.trim();
  const nRaw = process.env.NEXTAUTH_URL?.trim();

  const checkOne = (label: "AUTH_URL" | "NEXTAUTH_URL", raw: string) => {
    const u = parsePublicOrigin(raw);
    if (!u) {
      issues.push({
        code: `${label.toLowerCase()}_invalid`,
        severity: "critical",
        message: `${label} is not a valid URL — use an origin like https://www.example.com`,
      });
      return null;
    }
    const pathname = u.pathname;
    if (pathname !== "/" && pathname !== "") {
      issues.push({
        code: `${label.toLowerCase()}_has_path`,
        severity: "critical",
        message: `${label} must be origin-only (no /login or /api/auth path). Got pathname "${pathname.slice(0, 96)}".`,
      });
    }
    if (options.requireProductionHttps && u.protocol !== "https:") {
      issues.push({
        code: `${label.toLowerCase()}_not_https`,
        severity: "critical",
        message: `${label} must use https:// when production HTTPS is required.`,
      });
    }
    return u;
  };

  let a: URL | null = null;
  let n: URL | null = null;
  if (aRaw) a = checkOne("AUTH_URL", aRaw);
  if (nRaw) n = checkOne("NEXTAUTH_URL", nRaw);

  if (aRaw && nRaw && a && n) {
    if (originKey(a) !== originKey(n)) {
      issues.push({
        code: "auth_url_pair_mismatch",
        severity: "critical",
        message:
          "AUTH_URL and NEXTAUTH_URL are both set but disagree on origin (protocol/host/port). Pick one canonical public origin or remove the duplicate.",
      });
    }
  }

  const pubRaw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (pubRaw) {
    const pub = parsePublicOrigin(pubRaw);
    const primaryRaw = aRaw || nRaw;
    if (pub && primaryRaw) {
      const p = parsePublicOrigin(primaryRaw);
      if (p && originKey(pub) !== originKey(p)) {
        issues.push({
          code: "auth_url_public_app_url_host_mismatch",
          severity: "warning",
          message:
            "NEXT_PUBLIC_APP_URL origin differs from AUTH_URL/NEXTAUTH_URL — users hitting a different host may see cookie/session mismatches (www vs apex).",
        });
      }
    }
  }

  return issues;
}
