import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildQuestionListSearchParams } from "@/lib/practice-question-session/build-question-list-params";
import {
  DEFAULT_PRACTICE_COUNT,
  DEFAULT_PRACTICE_MODE,
  DEFAULT_PRACTICE_SOURCE,
  DEFAULT_SHUFFLE,
} from "@/lib/practice-question-session/constants";
import { parsePracticeSessionSearchParams, practiceSessionUrl } from "@/lib/practice-question-session/parse-session-search-params";

describe("parsePracticeSessionSearchParams", () => {
  it("defaults to mixed review, 20 questions, tutor, shuffle on", () => {
    const p = parsePracticeSessionSearchParams(new URLSearchParams());
    assert.equal(p.source, DEFAULT_PRACTICE_SOURCE);
    assert.equal(p.count, DEFAULT_PRACTICE_COUNT);
    assert.equal(p.mode, DEFAULT_PRACTICE_MODE);
    assert.equal(p.shuffle, DEFAULT_SHUFFLE);
    assert.equal(p.pathwayId, null);
    assert.equal(p.categorySlug, null);
    assert.equal(p.practiceHubIds, null);
    assert.equal(p.studyFilter, "all");
  });

  it("parses pathway, source, category, count, mode, shuffle", () => {
    const p = parsePracticeSessionSearchParams(
      new URLSearchParams(
        "pathwayId=us-rn-nclex-rn&source=nursing_categories&category=cardiovascular&count=30&mode=exam&shuffle=false",
      ),
    );
    assert.equal(p.pathwayId, "us-rn-nclex-rn");
    assert.equal(p.source, "nursing_categories");
    assert.equal(p.categorySlug, "cardiovascular");
    assert.equal(p.count, 30);
    assert.equal(p.mode, "exam");
    assert.equal(p.shuffle, false);
  });

  it("parses practiceHubIds and studyFilter", () => {
    const p = parsePracticeSessionSearchParams(
      new URLSearchParams("pathwayId=us-rn-nclex-rn&practiceHubIds=pharmacology,cardiovascular&studyFilter=weak"),
    );
    assert.equal(p.practiceHubIds, "pharmacology,cardiovascular");
    assert.equal(p.studyFilter, "weak");
  });
});

describe("practiceSessionUrl", () => {
  it("builds /app/questions/session with expected keys", () => {
    const href = practiceSessionUrl({
      pathwayId: "us-rn-nclex-rn",
      source: "mixed_review",
      categorySlug: null,
      count: 20,
      mode: "tutor",
      shuffle: true,
    });
    assert.ok(href.startsWith("/app/questions/session?"));
    const q = new URLSearchParams(href.split("?")[1] ?? "");
    assert.equal(q.get("pathwayId"), "us-rn-nclex-rn");
    assert.equal(q.get("source"), "mixed_review");
    assert.equal(q.get("count"), "20");
    assert.equal(q.get("mode"), "tutor");
    assert.equal(q.get("shuffle"), "true");
    assert.equal(q.get("category"), null);
    assert.equal(q.get("practiceHubIds"), null);
    assert.equal(q.get("studyFilter"), null);
  });

  it("includes practiceHubIds and studyFilter when provided", () => {
    const href = practiceSessionUrl({
      pathwayId: "us-rn-nclex-rn",
      source: "previously_incorrect",
      categorySlug: null,
      count: 20,
      mode: "tutor",
      shuffle: true,
      practiceHubIds: "renal_urinary,pharmacology",
      studyFilter: "incorrect",
    });
    const q = new URLSearchParams(href.split("?")[1] ?? "");
    assert.equal(q.get("practiceHubIds"), "renal_urinary,pharmacology");
    assert.equal(q.get("studyFilter"), "incorrect");
  });
});

describe("buildQuestionListSearchParams", () => {
  it("uses random sort when shuffle is on", () => {
    const qs = buildQuestionListSearchParams({
      pathwayId: "us-rn-nclex-rn",
      source: "mixed_review",
      categorySlug: null,
      count: 20,
      mode: "tutor",
      shuffle: true,
      userId: "user_test_1234567890",
    });
    assert.equal(qs.get("sort"), "random");
    assert.equal(qs.get("pathwayId"), "us-rn-nclex-rn");
    assert.equal(qs.get("pageSize"), "20");
    assert.equal(qs.get("mode"), "full");
  });

  it("adds studyMode weak for weak_areas source", () => {
    const qs = buildQuestionListSearchParams({
      pathwayId: "us-rn-nclex-rn",
      source: "weak_areas",
      categorySlug: null,
      count: 10,
      mode: "tutor",
      shuffle: true,
      userId: "user_test_1234567890",
    });
    assert.equal(qs.get("studyMode"), "weak");
  });

  it("maps cardiovascular slug to topic filter for body_systems", () => {
    const qs = buildQuestionListSearchParams({
      pathwayId: "us-rn-nclex-rn",
      source: "body_systems",
      categorySlug: "cardiovascular",
      count: 10,
      mode: "tutor",
      shuffle: false,
      userId: "user_test_1234567890",
    });
    assert.equal(qs.get("topic"), "Cardiovascular");
    assert.equal(qs.get("sort"), "recent");
  });

  it("forwards practiceHubIds to the questions API", () => {
    const qs = buildQuestionListSearchParams({
      pathwayId: "us-rn-nclex-rn",
      source: "mixed_review",
      categorySlug: null,
      count: 20,
      mode: "tutor",
      shuffle: true,
      userId: "user_test_1234567890",
      practiceHubIds: "fundamentals_safety,pharmacology",
    });
    assert.equal(qs.get("practiceHubIds"), "fundamentals_safety,pharmacology");
  });
});
