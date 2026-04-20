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

test("proxy sets x-nn-admin-path for /admin and /api/admin (RBAC header for guards)", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  assert.match(proxySrc, /x-nn-admin-path/);
  assert.match(proxySrc, /x-nn-request-pathname/);
  assert.match(proxySrc, /x-nn-request-url/);
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

test("edge auth requires a session for /admin (unauthenticated → NextAuth sign-in redirect)", () => {
  const am = readFileSync(join(dir, "lib", "auth-middleware.ts"), "utf8");
  assert.match(am, /path\.startsWith\("\/admin"\)/);
  assert.match(am, /pages:\s*\{\s*signIn:\s*["']\/login["']/);
});

test("requireAdmin sends non-staff signed-in users to /app; tier mismatch to /admin", () => {
  const guards = readFileSync(join(dir, "lib", "auth", "guards.ts"), "utf8");
  const policy = readFileSync(join(dir, "lib", "auth", "admin-path-policy.ts"), "utf8");
  assert.match(guards, /redirect\(gate\.redirectTo\)/);
  assert.match(guards, /adminRouteGateDecision/);
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
  assert.match(header, /const ADMIN_DASHBOARD_ROUTE = "\/admin"/);
  assert.match(header, /href=\{ADMIN_DASHBOARD_ROUTE\}/);
  assert.match(header, /isAdminAuthenticated/);
  assert.match(header, /isStaffRole\(user\.role\)/);
  assert.match(header, /isLearnerRole/);
  assert.match(header, /<Link href="\/app"/);
});

test("learner shell user bar: admin link when JWT staff or server staff hint", () => {
  const bar = readFileSync(join(dir, "components", "auth", "learner-shell-user-bar.tsx"), "utf8");
  assert.match(bar, /const ADMIN_DASHBOARD_ROUTE = "\/admin"/);
  assert.match(bar, /href=\{ADMIN_DASHBOARD_ROUTE\}/);
  assert.match(bar, /serverHasStaffSession === true \|\| isStaffRole\(user\.role\)/);
  assert.match(bar, /\{admin \? \(/);
});
