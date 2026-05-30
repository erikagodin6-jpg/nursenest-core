import assert from "node:assert/strict";
import test from "node:test";
import {
  adminRouteGateDecision,
  isNavHrefAllowedForStaffTier,
  isPathAllowedForStaffTier,
} from "@/lib/auth/admin-path-policy";

test("super staff can access super-only and content-forbidden paths", () => {
  assert.equal(isPathAllowedForStaffTier("super", "/admin"), true);
  assert.equal(isPathAllowedForStaffTier("super", "/admin/fraud"), true);
  assert.equal(isPathAllowedForStaffTier("super", "/admin/users"), true);
});

test("support staff can access /admin root and support-allowlisted routes", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/operations"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/users"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/content-command-center"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/curriculum-coverage"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/revenue-protection"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/revenue-protection/users/u1/chargeback-package"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/educator/remediation-assignments"), true);
});

test("support staff cannot access super-only routes", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/fraud"), false);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/i18n"), false);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/demo-users"), false);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/demo-users"), false);
});

test("learners without a staff tier are not granted admin API paths (gate uses staff DB session)", () => {
  assert.equal(adminRouteGateDecision(null, "/api/admin/marketing-public-content").allow, false);
  assert.equal(adminRouteGateDecision(null, "/admin/content/page-copy/preview").allow, false);
});

test("super staff can access demo user routes", () => {
  assert.equal(isPathAllowedForStaffTier("super", "/admin/demo-users"), true);
  assert.equal(isPathAllowedForStaffTier("super", "/api/admin/demo-users"), true);
});

test("content staff cannot access user PII / subscription admin surfaces", () => {
  assert.equal(isPathAllowedForStaffTier("content", "/admin/users"), false);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/subscriptions"), false);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/revenue-protection"), false);
  assert.equal(isPathAllowedForStaffTier("content", "/api/admin/revenue-protection/users/u1/chargeback-package"), false);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/analytics/subscriptions"), false);
});

test("content staff can access non-forbidden admin routes", () => {
  assert.equal(isPathAllowedForStaffTier("content", "/admin"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/lessons"), true);
});

test("support and content staff can access E-E-A-T editorial dashboard", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/eeat-editorial"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/eeat-editorial"), true);
});

test("nav helper matches path policy", () => {
  assert.equal(isNavHrefAllowedForStaffTier("support", "/admin"), isPathAllowedForStaffTier("support", "/admin"));
});

test("adminRouteGateDecision: signed-in non-staff (no DB row) redirects to /app", () => {
  assert.deepEqual(adminRouteGateDecision(null, "/admin/eeat-editorial"), {
    allow: false,
    redirectTo: "/app",
  });
});

test("adminRouteGateDecision: wrong tier for path redirects to /admin", () => {
  assert.deepEqual(adminRouteGateDecision({ tier: "content" }, "/admin/users"), {
    allow: false,
    redirectTo: "/admin",
  });
});

test("adminRouteGateDecision: content staff allowed on eeat-editorial", () => {
  assert.deepEqual(adminRouteGateDecision({ tier: "content" }, "/admin/eeat-editorial"), { allow: true });
});

test("adminRouteGateDecision: empty or unresolved / path defaults to /admin for staff (RSC header gaps)", () => {
  assert.deepEqual(adminRouteGateDecision({ tier: "support" }, ""), { allow: true });
  assert.deepEqual(adminRouteGateDecision({ tier: "content" }, ""), { allow: true });
  assert.deepEqual(adminRouteGateDecision({ tier: "super" }, ""), { allow: true });
  assert.deepEqual(adminRouteGateDecision({ tier: "support" }, "/"), { allow: true });
});

test("content cannot access super-only ops or export APIs", () => {
  assert.equal(isPathAllowedForStaffTier("content", "/api/admin/ops/run"), false);
  assert.equal(isPathAllowedForStaffTier("content", "/api/admin/export/content"), false);
  assert.equal(isPathAllowedForStaffTier("super", "/api/admin/ops/run"), true);
});

test("non-super denied for ambiguous root path /", () => {
  assert.equal(isPathAllowedForStaffTier("content", "/"), false);
  assert.equal(isPathAllowedForStaffTier("support", "/"), false);
});

test("nn-db-final-005: /api/debug session + sentry-test are super-only", () => {
  assert.equal(isPathAllowedForStaffTier("super", "/api/debug/session"), true);
  assert.equal(isPathAllowedForStaffTier("super", "/api/debug/sentry-test"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/debug/session"), false);
  assert.equal(isPathAllowedForStaffTier("support", "/api/debug/sentry-test"), false);
});

test("support staff can GET /api/debug/db-env (Prisma env flags, no secrets)", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/api/debug/db-env"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/api/debug/db-env"), true);
});

test("support and content staff can access clinical nursing scenario admin surfaces", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/clinical-scenarios"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/clinical-scenarios/abc123"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/clinical-nursing-scenarios"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/clinical-nursing-scenarios/abc/publish-status"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/clinical-scenarios"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/api/admin/clinical-nursing-scenarios"), true);
});

test("support and content staff can access pathway lesson admin surfaces", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/pathway-lessons"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/pathway-lessons/open"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/pathway-lessons/abc"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/pathway-lessons"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/pathway-lessons/xyz"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/pathway-lessons/xyz/sections/signs_symptoms"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/pathway-lessons/pl1"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/api/admin/pathway-lessons/xyz/sections/signs_symptoms"), true);
});

test("support and content staff can access internal courses admin surfaces", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/courses"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/internal-courses"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/internal-courses/x/status"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/courses"), true);
});

test("support staff can access page copy editor and marketing public content API", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/content/page-copy"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/marketing-public-content"), true);
});

test("support and content staff can access staged page-copy preview under page-copy prefix", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/content/page-copy/preview"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/content/page-copy/preview"), true);
});

test("content staff can access page copy editor (not support-only)", () => {
  assert.equal(isPathAllowedForStaffTier("content", "/admin/content/page-copy"), true);
});

test("observability hub: support + content can open UI; learner roster API blocked for content", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/observability"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/observability/hub"), true);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/observability/learners"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/observability"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/api/admin/observability/hub"), true);
  assert.equal(isPathAllowedForStaffTier("content", "/api/admin/observability/learners"), false);
});
