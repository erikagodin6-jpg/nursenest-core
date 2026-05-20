import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  marketingLessonsTopicClusterPath,
  marketingPathwayLessonTopicClusterPath,
  normalizeMarketingLessonsHubTopicSlug,
} from "@/lib/lessons/lesson-routes";

describe("marketing lessons hub topic URLs (single hub page per pathway)", () => {
  it("normalizes topic slugs for query use", () => {
    assert.equal(normalizeMarketingLessonsHubTopicSlug("  Pharm-Therapy "), "pharm-therapy");
    assert.equal(normalizeMarketingLessonsHubTopicSlug(""), null);
    assert.equal(normalizeMarketingLessonsHubTopicSlug("ab"), "ab");
  });

  it("builds topic views on the lessons index with ?topicSlug=", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const href = marketingPathwayLessonTopicClusterPath(pathway!, "pharmacology");
    assert.ok(href.includes("/us/rn/nclex-rn/lessons?"));
    assert.ok(href.includes("topicSlug="));
    assert.ok(!href.includes("/topics/"));
  });

  it("marketingLessonsTopicClusterPath matches pathway helper for same base", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const base = `/us/rn/nclex-rn/lessons`;
    const a = marketingPathwayLessonTopicClusterPath(pathway!, "safety");
    const b = marketingLessonsTopicClusterPath(base, "safety");
    assert.equal(a, b);
  });
});
