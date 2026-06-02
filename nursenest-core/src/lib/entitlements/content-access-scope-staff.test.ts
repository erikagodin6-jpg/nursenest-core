import assert from "node:assert/strict";
import { test } from "node:test";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { lessonAccessWhere, questionAccessWhere } from "@/lib/entitlements/content-access-scope";

const staff: AccessScope = {
  hasAccess: true,
  reason: "admin_override",
  tier: "RPN",
  country: "CA",
  alliedCareer: null,
};

test("questionAccessWhere: staff sees all published tiers (no region ladder)", () => {
  const w = questionAccessWhere(staff);
  assert.deepEqual(w, { status: { in: ["published", "PUBLISHED"] } });
});

test("lessonAccessWhere: staff is published-type only (no tier/region ladder)", () => {
  const w = lessonAccessWhere(staff);
  assert.equal((w as { type?: string }).type, "lesson");
  assert.ok(Array.isArray((w as { status?: { in: string[] } }).status?.in));
  assert.equal("AND" in w, false);
});
