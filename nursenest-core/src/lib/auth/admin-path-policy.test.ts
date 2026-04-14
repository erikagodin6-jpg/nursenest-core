import assert from "node:assert/strict";
import test from "node:test";
import { isNavHrefAllowedForStaffTier, isPathAllowedForStaffTier } from "@/lib/auth/admin-path-policy";

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

test("nav helper matches path policy", () => {
  assert.equal(isNavHrefAllowedForStaffTier("support", "/admin"), isPathAllowedForStaffTier("support", "/admin"));
});
