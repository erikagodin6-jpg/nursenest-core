import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

/**
 * Regression: Next.js 16 uses `src/proxy.ts` (not middleware.ts). Auth must run in the Edge proxy
 * with HTTP redirect to `/login` before RSC — bare `/app` must be in the matcher or the dashboard
 * could hit `redirect()` in a layout and expose raw Flight payloads in the document.
 */
test("proxy matcher includes /app, /admin, and exam hub roots; auth-middleware uses authorized", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  assert.match(proxySrc, /"\/",/);
  assert.match(proxySrc, /\/app",/);
  assert.match(proxySrc, /\/admin",/);
  assert.match(proxySrc, /\/us",/);
  assert.match(proxySrc, /\/canada",/);
  assert.match(proxySrc, /\/:locale\/us",/);
  assert.match(proxySrc, /\/:locale\/canada",/);
  assert.match(proxySrc, /\/exams",/);
  assert.match(proxySrc, /\/:locale\/exams",/);
  // Matcher list is inlined (not spread from REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS) for Next static analysis — keep in sync with regional-marketing-public-gate.ts.
  assert.match(proxySrc, /regional-marketing-public-gate\.ts/);
  assert.match(proxySrc, /\/:locale\/japan",/);
  assert.match(proxySrc, /\/:locale\/middle-east\/:path\*"/);
  assert.match(proxySrc, /\/japan\/:path\*"/);
  assert.match(proxySrc, /matcher/);

  const am = readFileSync(join(dir, "lib", "auth-middleware.ts"), "utf8");
  assert.match(am, /authorized/);
  assert.match(am, /\/app/);
});

test("proxy admin gate resolves session JWT with readAuthSessionJwtWithMeta (cookie name / TLS hint parity)", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  assert.match(proxySrc, /readAuthSessionJwtWithMeta/);
});

test("proxy sets x-nn-admin-path for /admin and /api/admin (RBAC header for guards)", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  assert.match(proxySrc, /x-nn-admin-path/);
  assert.match(proxySrc, /x-nn-request-pathname/);
  assert.match(proxySrc, /x-nn-marketing-narrow-viewport-hint/);
  assert.match(proxySrc, /x-nn-request-url/);
  assert.match(
    proxySrc,
    /Some auth middleware "continue" responses omit `x-middleware-next: 1`/,
    "admin continue must still forward pathname headers when merge is a no-op",
  );
  assert.match(proxySrc, /startsWith\("\/admin"\)/);
});

test("proxy forwards trusted pathname headers to RSC via NextResponse.next({ request }) (Auth.js omits this)", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  assert.match(proxySrc, /mergeAuthContinueWithForwardedRequest/);
  assert.match(proxySrc, /NextResponse\.next\(\s*\{\s*request:\s*\{\s*headers:\s*forwarded\.headers\s*\}/);
});

test("proxy keeps heavy admin, auth, rate-limit, and marketing graphs behind lazy imports", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  assert.doesNotMatch(proxySrc, /^import .*@\/lib\/auth-middleware/m);
  assert.doesNotMatch(proxySrc, /^import .*@\/lib\/auth\/admin-role-source/m);
  assert.doesNotMatch(proxySrc, /^import .*@\/lib\/server\/rate-limit/m);
  assert.doesNotMatch(proxySrc, /^import .*@\/lib\/navigation\/country-exam-launch-readiness/m);
  assert.match(proxySrc, /function loadAuthProxyDeps\(\)/);
  assert.match(proxySrc, /function loadAdminProxyDeps\(\)/);
  assert.match(proxySrc, /function loadApiProxyDeps\(\)/);
  assert.match(proxySrc, /function loadMarketingProxyDeps\(\)/);
  assert.match(proxySrc, /if \(isHealthProxyBypassPath\(pathname\)\)[\s\S]*NextResponse\.next\(\)/);
});

test("edge auth: /admin and /api/admin use JWT cookie parity fallback (getAuthSessionJwtFromRequest) before sign-in redirect", () => {
  const am = readFileSync(join(dir, "lib", "auth-middleware.ts"), "utf8");
  assert.match(am, /path\.startsWith\("\/admin"\)/);
  assert.match(am, /getAuthSessionJwtFromRequest/);
  assert.match(am, /nextRequestForEdgeJwtRead/);
  assert.match(am, /sessionJwtHasUserIdentity/);
  assert.match(am, /pages:\s*\{[\s\S]*signIn:\s*["']\/login["'][\s\S]*error:\s*["']\/login["']/);
});

test("proxy reconciles Auth.js sign-in redirect on /admin with enforceAdminProxyRoute (DB gate)", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  assert.match(proxySrc, /isAuthMiddlewareSignInRedirect/);
  assert.match(proxySrc, /enforceAdminProxyRoute\(forwarded\)/);
  assert.match(
    proxySrc,
    /NextAuth `authorized\(\)` can disagree with cookie-backed `getToken`/,
    "document why admin surfaces re-run the proxy DB gate after an Auth.js sign-in redirect",
  );
});

test("requireAdmin sends non-staff signed-in users to /app; tier mismatch to /admin", () => {
  const guards = readFileSync(join(dir, "lib", "auth", "guards.ts"), "utf8");
  const policy = readFileSync(join(dir, "lib", "auth", "admin-path-policy.ts"), "utf8");
  assert.match(guards, /redirect\(gate\.redirectTo\)/);
  assert.match(guards, /adminRouteGateDecision/);
  assert.match(guards, /admin_required/);
  assert.match(guards, /loginRedirectAdminRequired/);
  assert.match(guards, /x-nn-admin-path/);
  assert.match(guards, /\/login\?callbackUrl=/);
  assert.match(policy, /redirectTo: "\/app"/);
  assert.match(policy, /redirectTo: "\/admin"/);
  assert.match(policy, /isPathAllowedForStaffTier/);
});

test("admin dashboard href constant is /admin", () => {
  const link = readFileSync(join(dir, "lib", "auth", "admin-dashboard-link.ts"), "utf8");
  assert.match(link, /\/admin/);
});

test("marketing header: staff see Admin link to /admin; learners use Dashboard to /app only", () => {
  const header = readFileSync(join(dir, "components", "layout", "site-header.tsx"), "utf8");
  assert.match(header, /ADMIN_DASHBOARD_HREF/);
  assert.match(header, /href=\{ADMIN_DASHBOARD_HREF\}/);
  assert.match(header, /isAdminAuthenticated/);
  assert.match(header, /shouldShowAdminDashboardNav/);
  assert.match(header, /isLearnerRole/);
  assert.match(header, /<Link href="\/app"/);
});

test("marketing desktop white nav: explore links are top-level (no desktop More dropdown)", () => {
  const header = readFileSync(join(dir, "components", "layout", "site-header.tsx"), "utf8");
  assert.match(header, /marketingMoreLinks\.map\(\(item\) =>/);
  assert.match(header, /key: "pre-nursing"/);
  assert.match(header, /key: "tools"/);
  assert.ok(!header.includes("desktopMoreOpen"), "desktop product nav must not use a More menu");
});

test("marketing header: no static import of allied profession registry or full mega-menu builder", () => {
  const header = readFileSync(join(dir, "components", "layout", "site-header.tsx"), "utf8");
  assert.ok(
    !header.includes('from "@/lib/allied/allied-professions-registry"'),
    "SiteHeader must not statically import allied-professions-registry (dynamic import() is allowed for badge)",
  );
  assert.ok(
    !header.includes("buildMarketingMegaMenus"),
    "SiteHeader must use lightweight tier hub strip instead of buildMarketingMegaMenus",
  );
});

test("marketing header: tier hub strip, global-regions registry, and utility strip are not eager static imports", () => {
  const header = readFileSync(join(dir, "components", "layout", "site-header.tsx"), "utf8");
  assert.ok(
    !/^\s*import\s+(?!type)\{[^}]*\}\s*from\s*["']@\/lib\/navigation\/marketing-tier-hub-strip["']/m.test(header),
    "SiteHeader must not value-import marketing-tier-hub-strip (type-only or dynamic import() is OK)",
  );
  assert.ok(
    !/\bimport\s*\{[^}]*\bREGION_CONFIG\b/.test(header),
    "SiteHeader must not static-import REGION_CONFIG from global-regions (dynamic import for intl labels is OK)",
  );
  assert.ok(
    !header.includes('from "@/components/layout/marketing-header-utility-strip"'),
    "SiteHeader must code-split MarketingHeaderUtilityStrip (dynamic import / next/dynamic)",
  );
  assert.ok(
    header.includes("next/dynamic") && header.includes("marketing-header-utility-strip"),
    "SiteHeader must use next/dynamic for the preferences utility strip",
  );
  assert.ok(
    !header.includes("import { MobileContextDrawer"),
    "SiteHeader must lazy-load MobileContextDrawer (type-only import from mobile-context-drawer is OK)",
  );
  assert.ok(
    !header.includes('from "@/lib/marketing/apply-global-region-selection"'),
    "SiteHeader must defer apply-global-region-selection until region change (dynamic import)",
  );
});

test("learner shell user bar: admin link when JWT staff or server staff hint", () => {
  const bar = readFileSync(join(dir, "components", "auth", "learner-shell-user-bar.tsx"), "utf8");
  assert.match(bar, /ADMIN_DASHBOARD_HREF/);
  assert.match(bar, /href=\{ADMIN_DASHBOARD_HREF\}/);
  assert.match(bar, /shouldShowAdminDashboardNav/);
  assert.match(bar, /\{admin \? \(/);
});
