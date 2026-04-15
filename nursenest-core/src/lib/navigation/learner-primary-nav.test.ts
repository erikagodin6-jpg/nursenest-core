import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLearnerPrimaryNavItems,
  CANONICAL_LEARNER_ROUTES,
  isLearnerPrimaryNavKey,
  LEARNER_PRIMARY_NAV_ITEM_KEY,
} from "./learner-primary-nav";

test("LEARNER_PRIMARY_NAV_ITEM_KEY is lessons or practice only", () => {
  assert.ok(LEARNER_PRIMARY_NAV_ITEM_KEY === "lessons" || LEARNER_PRIMARY_NAV_ITEM_KEY === "practice");
});

test("isLearnerPrimaryNavKey matches LEARNER_PRIMARY_NAV_ITEM_KEY", () => {
  assert.equal(isLearnerPrimaryNavKey(LEARNER_PRIMARY_NAV_ITEM_KEY), true);
  assert.equal(isLearnerPrimaryNavKey("practice"), LEARNER_PRIMARY_NAV_ITEM_KEY === "practice");
  assert.equal(isLearnerPrimaryNavKey("flashcards"), false);
});

test("buildLearnerPrimaryNavItems: primary key maps to canonical route", () => {
  const items = buildLearnerPrimaryNavItems(null);
  const primary = items.find((i) => i.key === LEARNER_PRIMARY_NAV_ITEM_KEY);
  assert.ok(primary);
  if (LEARNER_PRIMARY_NAV_ITEM_KEY === "lessons") {
    assert.equal(primary!.href, CANONICAL_LEARNER_ROUTES.lessons);
    assert.equal(primary!.matchBase, "/app/lessons");
  } else {
    assert.equal(primary!.href, CANONICAL_LEARNER_ROUTES.practice);
    assert.equal(primary!.matchBase, "/app/questions");
  }
});
