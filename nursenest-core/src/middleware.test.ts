import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

function read(p: string) {
  return readFileSync(join(dir, p), "utf8");
}

/**
 * Safer matcher (avoids brittle regex failures on formatting changes)
 */
function mustContain(src: string, needle: string, label?: string) {
  assert.ok(src.includes(needle), label ?? needle);
}

function mustNotContain(src: string, needle: string, label?: string) {
  assert.ok(!src.includes(needle), label ?? needle);
}

/**
 * PROXY + AUTH CRITICAL COVERAGE
 */
test("proxy matcher coverage and auth wiring are correct", () => {
  const proxy = read("proxy.ts");

  [
    '"/",',
    '/app",',
    '/admin",',
    '/us",',
    '/canada",',
    '/:locale/us",',
    '/:locale/canada",',
    '/exams",',
    '/:locale/exams",',
    '/:locale/japan",',
    '/:locale/middle-east/:path*"',
    '/japan/:path*"',
  ].forEach((m) => mustContain(proxy, m, m));

  mustContain(proxy, "matcher");
  mustContain(proxy, "regional-marketing-public-gate.ts");

  const am = read("lib/auth-middleware.ts");
  mustContain(am, "authorized");
  mustContain(am, "/app");
});

/**
 * JWT parity + admin routing enforcement
 */
test("proxy uses JWT parity + admin enforcement", () => {
  const proxy = read("proxy.ts");

  mustContain(proxy, "readAuthSessionJwtWithMeta");
  mustContain(proxy, "enforceAdminProxyRoute");
  mustContain(proxy, "isAuthMiddlewareSignInRedirect");
});

/**
 * Header forwarding (critical for RSC correctness)
 */
test("proxy forwards request headers correctly", () => {
  const proxy = read("proxy.ts");

  mustContain(proxy, "mergeAuthContinueWithForwardedRequest");
  mustContain(proxy, "NextResponse.next({ request:");
});

/**
 * Admin headers + tracing headers
 */
test("proxy sets required headers", () => {
  const proxy = read("proxy.ts");

  [
    "x-nn-admin-path",
    "x-nn-request-pathname",
    "x-nn-request-url",
    "MARKETING_NARROW_VIEWPORT_HINT_HEADER",
  ].forEach((h) => mustContain(proxy, h));
});

/**
 * CRITICAL: no heavy eager imports in proxy
 */
test("proxy keeps heavy modules lazy", () => {
  const proxy = read("proxy.ts");

  [
    "@/lib/auth-middleware",
    "@/lib/auth/admin-role-source",
    "@/lib/server/rate-limit",
    "@/lib/navigation/country-exam-launch-readiness",
  ].forEach((mod) => {
    mustNotContain(proxy, `from "${mod}"`, mod);
  });

  [
    "loadAuthProxyDeps",
    "loadAdminProxyDeps",
    "loadApiProxyDeps",
    "loadMarketingProxyDeps",
  ].forEach((fn) => mustContain(proxy, fn));

  mustContain(proxy, "isHealthProxyBypassPath");
});

/**
 * EDGE AUTH FALLBACK SAFETY
 */
test("edge auth JWT fallback is present", () => {
  const am = read("lib/auth-middleware.ts");

  [
    'path.startsWith("/admin")',
    "getAuthSessionJwtFromRequest",
    "nextRequestForEdgeJwtRead",
    "sessionJwtHasUserIdentity",
  ].forEach((m) => mustContain(am, m));

  mustContain(am, "/login");
});

/**
 * ADMIN POLICY + GUARDS
 */
test("admin guard policy is correct", () => {
  const guards = read("lib/auth/guards.ts");
  const policy = read("lib/auth/admin-path-policy.ts");

  [
    "adminRouteGateDecision",
    "admin_required",
    "loginRedirectAdminRequired",
    "x-nn-admin-path",
  ].forEach((m) => mustContain(guards, m));

  mustContain(guards, "/login?callbackUrl=");
  mustContain(policy, 'redirectTo: "/app"');
  mustContain(policy, 'redirectTo: "/admin"');
  mustContain(policy, "isPathAllowedForStaffTier");
});

/**
 * ADMIN LINK CONSTANT
 */
test("admin dashboard link constant is correct", () => {
  const link = read("lib/auth/admin-dashboard-link.ts");
  mustContain(link, "/admin");
});

/**
 * SITE HEADER — NAV RULES
 */
test("marketing header nav rules enforced", () => {
  const header = read("components/layout/site-header.tsx");

  [
    "ADMIN_DASHBOARD_HREF",
    "shouldShowAdminDashboardNav",
    "isAdminAuthenticated",
    "isLearnerRole",
  ].forEach((m) => mustContain(header, m));

  mustContain(header, '<Link href="/app"');
});

/**
 * HEADER MUST NOT USE HEAVY IMPORTS
 */
test("site header avoids heavy static imports", () => {
  const header = read("components/layout/site-header.tsx");

  mustNotContain(header, "allied-professions-registry");
  mustNotContain(header, "buildMarketingMegaMenus");
});

/**
 * HEADER LAZY LOADING GUARANTEES
 */
test("site header lazy-loads heavy UI and registries", () => {
  const header = read("components/layout/site-header.tsx");

  mustContain(header, "next/dynamic");
  mustContain(header, "marketing-header-utility-strip");

  mustNotContain(header, "MobileContextDrawer");
  mustNotContain(header, "apply-global-region-selection");
});

/**
 * LEARNER BAR ADMIN LINK
 */
test("learner bar exposes admin link correctly", () => {
  const bar = read("components/auth/learner-shell-user-bar.tsx");

  [
    "ADMIN_DASHBOARD_HREF",
    "shouldShowAdminDashboardNav",
  ].forEach((m) => mustContain(bar, m));
});