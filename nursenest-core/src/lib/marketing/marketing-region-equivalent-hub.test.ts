import assert from "node:assert/strict";
import { test } from "node:test";
import { equivalentExamHubUrlAfterRegionToggle } from "./marketing-region-equivalent-hub";

test("maps US RN hub to Canada RN when switching to CA", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/us/rn/nclex-rn", "CA"), "/canada/rn/nclex-rn");
});

test("maps Canada PN hub to US PN when switching to US", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/canada/rpn/rex-pn", "US"), "/us/lpn/nclex-pn");
});

test("returns null when already in target country", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/us/rn/nclex-rn", "US"), null);
});

test("returns null for non-exam paths", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/lessons", "CA"), null);
});
