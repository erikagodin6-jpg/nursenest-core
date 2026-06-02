import assert from "node:assert/strict";
import test from "node:test";

import {
  MARKETING_DEMO_LEARNERS,
  MARKETING_SHOWCASE_COLLECTION,
  MARKETING_SHOWCASE_MINIMUMS,
  assertMarketingShowcaseMinimums,
  getMarketingShowcaseItems,
  getTopMarketingShowcaseItem,
  selectMarketingShowcaseCandidates,
  type MarketingShowcaseKind,
} from "@/lib/marketing/marketing-showcase-content";

test("marketing showcase collection satisfies required flagship inventory counts", () => {
  assertMarketingShowcaseMinimums();

  for (const [kind, minimum] of Object.entries(MARKETING_SHOWCASE_MINIMUMS)) {
    const actual = MARKETING_SHOWCASE_COLLECTION.filter((item) => item.kind === kind).length;
    assert.ok(actual >= minimum, `${kind} should have at least ${minimum} items`);
  }
});

test("every showcase item carries screenshot-selection metadata flags", () => {
  for (const item of MARKETING_SHOWCASE_COLLECTION) {
    assert.equal(item.flags.marketingPriority, true, item.id);
    assert.equal(item.flags.marketingShowcase, true, item.id);
    assert.equal(item.flags.featuredScreenshotCandidate, true, item.id);
    assert.ok(item.showcaseScore >= 80, `${item.id} should be a high-scoring marketing candidate`);
    assert.ok(item.entryRoute.startsWith("/"), `${item.id} should provide an app route`);
    assert.ok(item.activitySlug.length > 4, `${item.id} should provide an activity slug`);
    assert.doesNotMatch(item.title, /placeholder|lorem|todo|sample/i, item.id);
    assert.doesNotMatch(item.description, /placeholder|lorem|todo/i, item.id);
  }
});

test("selection returns top-scoring candidates instead of first/random/newest content", () => {
  const kinds = Array.from(new Set(MARKETING_SHOWCASE_COLLECTION.map((item) => item.kind))) as MarketingShowcaseKind[];

  for (const kind of kinds) {
    const sorted = getMarketingShowcaseItems(kind);
    const selected = selectMarketingShowcaseCandidates({ kind, limit: Math.min(5, sorted.length) });
    assert.deepEqual(
      selected.map((item) => item.id),
      sorted.slice(0, selected.length).map((item) => item.id),
      `${kind} should use showcase score ordering`,
    );
    assert.equal(getTopMarketingShowcaseItem(kind)?.id, sorted[0]?.id, `${kind} top item should match sorted leader`);
  }
});

test("demo readiness learners cover the required marketing personas", () => {
  const personas = new Set(MARKETING_DEMO_LEARNERS.map((learner) => learner.persona));
  assert.deepEqual(personas, new Set(["struggling-student", "improving-student", "exam-ready-student", "high-achiever"]));

  for (const learner of MARKETING_DEMO_LEARNERS) {
    assert.equal(learner.flags.marketingPriority, true);
    assert.equal(learner.flags.marketingShowcase, true);
    assert.equal(learner.flags.featuredScreenshotCandidate, true);
    assert.ok(learner.trend.length >= 4, `${learner.id} should have trend data`);
    assert.ok(learner.strengths.length > 0, `${learner.id} should have strengths`);
    assert.ok(learner.weakAreas.length > 0, `${learner.id} should have weak areas`);
    assert.ok(learner.recommendations.length > 0, `${learner.id} should have recommendations`);
  }
});
