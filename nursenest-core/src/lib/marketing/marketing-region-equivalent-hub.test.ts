import assert from "node:assert/strict";
import { test } from "node:test";
import { equivalentExamHubUrlAfterRegionToggle } from "./marketing-region-equivalent-hub";

test("maps US RN hub overview to shared lessons entry when switching to CA", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/us/rn/nclex-rn", "CA"), "/lessons");
});

test("maps Canada RN hub overview to shared lessons entry when switching to US", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/canada/rn/nclex-rn", "US"), "/lessons");
});

test("maps Canada PN hub to US PN when switching to US", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/canada/rpn/rex-pn", "US"), "/us/pn/nclex-pn");
});

test("returns null when already in target country", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/us/rn/nclex-rn", "US"), null);
});

test("returns null for non-exam paths", () => {
  assert.equal(equivalentExamHubUrlAfterRegionToggle("/lessons", "CA"), null);
});
