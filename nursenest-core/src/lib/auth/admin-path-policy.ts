import type { StaffTier } from "@/lib/auth/staff-roles";

function normalizePath(pathname: string): string {
  const p = pathname.split("?")[0] ?? "";
  if (p.length <= 1) return p || "/";
  return p.replace(/\/$/, "") || "/";
}

function matches(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** Dangerous or account-wide tools — only super (incl. legacy ADMIN). */
const SUPER_ONLY_PREFIXES = [
  "/admin/premium-protection",
  "/api/admin/protection-abuse-reviews",
  "/admin/fraud",
  "/api/admin/fraud-dashboard",
  "/admin/i18n",
  "/api/admin/i18n-diagnostics",
  "/admin/demo-users",
  "/api/admin/demo-users",
];

/** User PII + billing list/analytics — not for content editors. */
const CONTENT_FORBIDDEN_PREFIXES = [
  "/admin/users",
  "/api/admin/users",
  "/admin/subscriptions",
  "/admin/analytics/subscriptions",
  "/api/admin/analytics/subscriptions",
];

/**
 * Support staff: explicit allowlist (everything else under admin API is denied).
 * Order: longest / most specific concepts — never use a bare `/admin` prefix match for all routes.
 */
const SUPPORT_ALLOWED_PREFIXES = [
  "/admin/access",
  "/admin/analytics",
  "/admin/automation-logs",
  "/admin/generation",
  "/admin/content-coverage",
  "/admin/queue",
  "/admin/diagnostics",
  "/admin/operations",
  "/admin/subscriptions",
  "/admin/system-status",
  "/admin/users",
  "/admin/feedback",
  "/api/admin/analytics",
  "/api/admin/automation-logs",
  "/api/admin/dashboard",
  "/api/admin/diagnostics",
  "/api/admin/gaps",
  "/api/admin/insights",
  "/api/admin/jobs",
  "/api/admin/operations-dashboard",
  "/api/admin/operations-health",
  "/api/admin/stats",
  "/api/admin/system-status",
  "/api/admin/users",
  "/api/admin/cat-blueprint-sessions",
  "/api/admin/qa",
  "/api/admin/question-bank-diagnostics",
  "/api/admin/lesson-question-link-coverage",
  "/api/admin/scalability-report",
  "/api/admin/pathway-lesson-translations",
  "/api/admin/pre-nursing-report",
];

function isSuperOnlyPath(path: string): boolean {
  return SUPER_ONLY_PREFIXES.some((pre) => matches(path, pre));
}

function supportPathAllowed(path: string): boolean {
  if (path === "/admin") return true;
  return SUPPORT_ALLOWED_PREFIXES.some((pre) => matches(path, pre));
}

/**
 * Server-side RBAC for admin UI and /api/admin/* routes.
 * Prefer `x-nn-admin-path` from `src/proxy.ts` so checks match the requested route.
 */
export function isPathAllowedForStaffTier(tier: StaffTier, pathname: string): boolean {
  const path = normalizePath(pathname);

  if (tier === "super") {
    return true;
  }

  if (isSuperOnlyPath(path)) {
    return false;
  }

  if (tier === "support") {
    return supportPathAllowed(path);
  }

  if (tier === "content") {
    return !CONTENT_FORBIDDEN_PREFIXES.some((pre) => matches(path, pre));
  }

  return false;
}

/** Hide nav links client-side (same rules as path policy). */
export function isNavHrefAllowedForStaffTier(tier: StaffTier, href: string): boolean {
  return isPathAllowedForStaffTier(tier, href);
}
