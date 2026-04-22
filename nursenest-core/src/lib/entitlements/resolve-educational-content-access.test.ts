import assert from "node:assert/strict";
import { test } from "node:test";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { hasFullEducationalContentAccess } from "@/lib/entitlements/resolve-educational-content-access";

test("hasFullEducationalContentAccess: true for staff entitlement scope", () => {
  assert.equal(
    hasFullEducationalContentAccess({
      hasAccess: true,
      reason: "admin_override",
      tier: "RN",
      country: "US",
      alliedCareer: null,
    }),
    true,
  );
});

test("hasFullEducationalContentAccess: false for subscribers and guests", () => {
  assert.equal(
    hasFullEducationalContentAccess({
      hasAccess: true,
      reason: "active_subscription",
      tier: "RN",
      country: "US",
      alliedCareer: null,
    }),
    false,
  );
  assert.equal(
    hasFullEducationalContentAccess({
      hasAccess: false,
      reason: "admin_override",
      tier: "RN",
      country: "US",
      alliedCareer: null,
    }),
    false,
  );
  assert.equal(hasFullEducationalContentAccess(null), false);
});
