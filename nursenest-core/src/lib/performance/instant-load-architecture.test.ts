import assert from "node:assert/strict";
import test from "node:test";

import {
  CRITICAL_PATH_EXCLUDED_WORK,
  INSTANT_LOAD_BUDGETS,
  activityManifestCacheKey,
  activityManifestSnapshotPath,
  buildActivityManifest,
  instantLoadPathwayFromTier,
} from "./instant-load-architecture";

test("instant-load budgets enforce product targets for every activity", () => {
  assert.equal(INSTANT_LOAD_BUDGETS.length, 8);
  for (const budget of INSTANT_LOAD_BUDGETS) {
    assert.equal(budget.manifestRequired, true, `${budget.activity} must use a manifest`);
    assert.equal(budget.shellFirst, true, `${budget.activity} must render shell-first`);
    assert.equal(budget.launchCacheRequired, true, `${budget.activity} must have a launch cache`);
    if (budget.activity === "cat" || budget.activity === "loft") {
      assert.equal(budget.loadBudgetMs, 3000);
    } else {
      assert.equal(budget.loadBudgetMs, 2000);
    }
    if (budget.ttfbBudgetMs !== undefined) {
      assert.equal(budget.ttfbBudgetMs, 500);
    }
  }
});

test("activity manifests include all shared learner surfaces for every pathway", () => {
  for (const pathway of ["rn", "rpn", "np", "allied", "newgrad", "prenursing"] as const) {
    const manifest = buildActivityManifest({ pathway, generatedAt: "2026-05-29T00:00:00.000Z" });
    assert.equal(manifest.schema, "nursenest.activity_manifest.v1");
    assert.equal(manifest.pathway, pathway);
    assert.deepEqual(activityManifestSnapshotPath(pathway), ["activity-manifests", `${pathway}-manifest.json`]);
    assert.match(activityManifestCacheKey(pathway, manifest.pathwayId), /^manifest:activity:/);
    for (const surface of [
      "questions",
      "flashcards",
      "lessons",
      "clinical-skills",
      "pharmacology",
      "ecg",
      "analytics",
      "readiness",
      "navigation",
    ] as const) {
      assert.equal(manifest.surfaces[surface].prefetch, true, `${pathway}/${surface} should prefetch`);
      assert.ok(manifest.surfaces[surface].href.startsWith("/"), `${pathway}/${surface} needs an app href`);
      assert.ok(manifest.surfaces[surface].cacheKey.includes(manifest.pathwayId.replace(/[^a-z0-9_-]/gi, "_").slice(0, 8)));
    }
  }
});

test("tier normalization keeps New Grad and Allied on shared architecture", () => {
  assert.equal(instantLoadPathwayFromTier("RN"), "rn");
  assert.equal(instantLoadPathwayFromTier("RPN"), "rpn");
  assert.equal(instantLoadPathwayFromTier("LVN_LPN"), "rpn");
  assert.equal(instantLoadPathwayFromTier("NP"), "np");
  assert.equal(instantLoadPathwayFromTier("ALLIED"), "allied");
  assert.equal(instantLoadPathwayFromTier("NEW_GRAD"), "newgrad");
  assert.equal(instantLoadPathwayFromTier("PRE_NURSING"), "prenursing");
});

test("nonessential adaptive work is explicitly excluded from activity startup", () => {
  assert.deepEqual([...CRITICAL_PATH_EXCLUDED_WORK].sort(), [
    "achievement",
    "activity tracking",
    "analytics",
    "engagement scoring",
    "readiness",
    "recommendations",
    "streak",
  ]);
});

