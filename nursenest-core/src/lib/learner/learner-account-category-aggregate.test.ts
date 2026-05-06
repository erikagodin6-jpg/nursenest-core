import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { aggregateTopicsByCanonicalStudyCategory } from "@/lib/learner/learner-account-category-aggregate";

describe("aggregateTopicsByCanonicalStudyCategory", () => {
  const pathwayId = "ca-rn-nclex-rn";

  it("groups weak and strong topic labels into canonical buckets", () => {
    const rows = aggregateTopicsByCanonicalStudyCategory(pathwayId, [
      { topic: "Heart failure and fluid overload", weight: 2 },
      { topic: "Insulin and hypoglycemia management", weight: 1 },
      { topic: "Delegate appropriate tasks to the UAP", weight: 3 },
    ]);
    const byId = Object.fromEntries(rows.map((r) => [r.id, r.count]));
    assert.ok(byId.cardiovascular >= 2);
    assert.ok(byId.pharmacology >= 1);
    assert.ok(byId.delegation_assignment >= 3);
  });

  it("returns zero counts for all canonical rows when topics are empty", () => {
    const rows = aggregateTopicsByCanonicalStudyCategory(pathwayId, []);
    assert.ok(rows.length > 0);
    assert.ok(rows.every((r) => r.count === 0));
  });

  it("omits uncategorized from output list", () => {
    const rows = aggregateTopicsByCanonicalStudyCategory(pathwayId, [{ topic: "zzzz-unknown-xyz-topic-unique", weight: 5 }]);
    assert.ok(!rows.some((r) => r.id === "uncategorized"));
  });
});
