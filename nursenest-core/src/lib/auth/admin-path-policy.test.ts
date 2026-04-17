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
});

test("support staff cannot access super-only routes", () => {
  assert.equal(isPathAllowedForStaffTier("support", "/admin/fraud"), false);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/i18n"), false);
  assert.equal(isPathAllowedForStaffTier("support", "/admin/demo-users"), false);
  assert.equal(isPathAllowedForStaffTier("support", "/api/admin/demo-users"), false);
});

test("super staff can access demo user routes", () => {
  assert.equal(isPathAllowedForStaffTier("super", "/admin/demo-users"), true);
  assert.equal(isPathAllowedForStaffTier("super", "/api/admin/demo-users"), true);
});

test("content staff cannot access user PII / subscription admin surfaces", () => {
  assert.equal(isPathAllowedForStaffTier("content", "/admin/users"), false);
  assert.equal(isPathAllowedForStaffTier("content", "/admin/subscriptions"), false);
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
