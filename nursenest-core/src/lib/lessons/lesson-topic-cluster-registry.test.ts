import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  groupTopicClustersForNavigation,
  mapTopicCodeToCanonicalClusterSlug,
  pickTopicClusterSlugForPathway,
} from "@/lib/lessons/lesson-topic-cluster-registry";

describe("lesson-topic-cluster-registry", () => {
  it("maps question-like topic codes to canonical slugs", () => {
    assert.equal(mapTopicCodeToCanonicalClusterSlug("acute coronary syndrome"), "cardiovascular");
    assert.equal(mapTopicCodeToCanonicalClusterSlug("copd exacerbation"), "copd");
    assert.equal(mapTopicCodeToCanonicalClusterSlug("prioritization"), "prioritization-delegation");
  });

  it("pickTopicClusterSlugForPathway only emits slugs present for the pathway", () => {
    const slugs = new Set(["cardiovascular", "safety"]);
    assert.equal(pickTopicClusterSlugForPathway("myocardial infarction", slugs), "cardiovascular");
    assert.equal(pickTopicClusterSlugForPathway("rare-topic-xyz", slugs), null);
  });

  it("groups live clusters under editorial buckets", () => {
    const grouped = groupTopicClustersForNavigation([
      { topicSlug: "cardiovascular", label: "Cardiovascular", count: 2 },
      { topicSlug: "copd", label: "COPD", count: 1 },
      { topicSlug: "unknown-custom-slug", label: "Custom", count: 1 },
    ]);
    assert.ok(grouped.some((g) => g.groupId === "cardiovascular"));
    assert.ok(grouped.some((g) => g.groupId === "respiratory"));
    assert.ok(grouped.some((g) => g.groupId === "other"));
  });
});
