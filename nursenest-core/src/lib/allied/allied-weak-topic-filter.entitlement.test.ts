import assert from "node:assert/strict";
import test from "node:test";
import { TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { exclusiveTopicSlugsForAlliedProfession } from "@/lib/allied/allied-profession-lesson-exclusive-scope";
import {
  classifyAlliedCoreWeakTopicSemantics,
  filterWeakTopicsForAlliedEntitlement,
} from "@/lib/allied/allied-weak-topic-filter";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

function scope(partial: Partial<AccessScope> & Pick<AccessScope, "hasAccess" | "reason">): AccessScope {
  return {
    hasAccess: partial.hasAccess,
    reason: partial.reason,
    tier: partial.tier ?? null,
    country: partial.country ?? null,
    alliedCareer: partial.alliedCareer ?? null,
  };
}

const pathwayId = "us-allied-core";

test("MLT subscriber does not receive respiratory-exclusive weak topic", () => {
  const rtSlugs = exclusiveTopicSlugsForAlliedProfession(pathwayId, "respiratory");
  const mltSlugs = exclusiveTopicSlugsForAlliedProfession(pathwayId, "mlt");
  assert.ok(rtSlugs.length >= 1);
  const rtOnly = rtSlugs.find((s) => !mltSlugs.includes(s));
  assert.ok(rtOnly, "fixture expects at least one respiratory-owned slug not shared with MLT list");

  const weak: WeakTopicRow[] = [
    { topic: rtOnly!, normalizedTopic: rtOnly!, missed: 1, attempted: 3, missRate: 0.33 },
  ];
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  assert.equal(filterWeakTopicsForAlliedEntitlement(weak, s, pathwayId).length, 0);
});

test("MLT subscriber keeps an MLT-owned weak topic", () => {
  const mltSlugs = exclusiveTopicSlugsForAlliedProfession(pathwayId, "mlt");
  assert.ok(mltSlugs.length >= 1);
  const slug = mltSlugs[0]!;
  const weak: WeakTopicRow[] = [
    { topic: slug, normalizedTopic: slug, missed: 1, attempted: 3, missRate: 0.33 },
  ];
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  assert.equal(filterWeakTopicsForAlliedEntitlement(weak, s, pathwayId).length, 1);
});

test("ALLIED subscriber without occupation metadata drops exclusive weak topic", () => {
  const mltSlugs = exclusiveTopicSlugsForAlliedProfession(pathwayId, "mlt");
  assert.ok(mltSlugs.length >= 1);
  const slug = mltSlugs[0]!;
  const weak: WeakTopicRow[] = [
    { topic: slug, normalizedTopic: slug, missed: 1, attempted: 3, missRate: 0.33 },
  ];
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: null,
  });
  assert.equal(filterWeakTopicsForAlliedEntitlement(weak, s, pathwayId).length, 0);
});

test("ALLIED subscriber without occupation keeps unresolved-topic weak signal", () => {
  const weak: WeakTopicRow[] = [
    {
      topic: "zz-unknown-audit-topic",
      normalizedTopic: "zz-unknown-audit-topic",
      missed: 1,
      attempted: 3,
      missRate: 0.33,
    },
  ];
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: null,
  });
  assert.equal(filterWeakTopicsForAlliedEntitlement(weak, s, pathwayId).length, 1);
});

test("classifyAlliedCoreWeakTopicSemantics marks MLT-owned slug as exclusive", () => {
  const mltSlugs = exclusiveTopicSlugsForAlliedProfession(pathwayId, "mlt");
  assert.ok(mltSlugs.length >= 1);
  const sem = classifyAlliedCoreWeakTopicSemantics(pathwayId, mltSlugs[0]!);
  assert.equal(sem.kind, "exclusive");
  if (sem.kind === "exclusive") assert.equal(sem.ownerProfessionKey, "mlt");
});

test("classifyAlliedCoreWeakTopicSemantics treats unregistered slug as shared_core", () => {
  const sem = classifyAlliedCoreWeakTopicSemantics(pathwayId, "zz-unknown-audit-topic");
  assert.equal(sem.kind, "shared_core");
});

test("RRT subscriber retains respiratory-owned weak topic", () => {
  const rtSlugs = exclusiveTopicSlugsForAlliedProfession(pathwayId, "respiratory");
  assert.ok(rtSlugs.length >= 1);
  const slug = rtSlugs[0]!;
  const weak: WeakTopicRow[] = [
    { topic: slug, normalizedTopic: slug, missed: 1, attempted: 3, missRate: 0.33 },
  ];
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "rrt",
  });
  assert.equal(filterWeakTopicsForAlliedEntitlement(weak, s, pathwayId).length, 1);
});
