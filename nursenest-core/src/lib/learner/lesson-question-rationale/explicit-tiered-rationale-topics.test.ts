import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EXPLICIT_TIER_TOPIC_SCORE,
  tryExplicitTieredTopicLinks,
} from "@/lib/learner/lesson-question-rationale/explicit-tiered-rationale-topics";
import { pathwayRationaleContextFromId } from "@/lib/learner/lesson-question-rationale/pathway-context";
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";

describe("explicit-tiered-rationale-topics", () => {
  it("picks tier-specific sepsis slug for US PN vs CA RPN", () => {
    const base = {
      topic: "Med-Surg",
      subtopic: "Sepsis",
      bodySystem: null as string | null,
      tags: [] as string[],
      topicCode: null as string | null,
    };
    const us = tryExplicitTieredTopicLinks(base, pathwayRationaleContextFromId("us-lpn-nclex-pn"));
    const ca = tryExplicitTieredTopicLinks(base, pathwayRationaleContextFromId("ca-rpn-rex-pn"));
    assert.ok(us.some((h) => h.lessonSlug === "us-pn-sepsis" && h.score === EXPLICIT_TIER_TOPIC_SCORE));
    assert.ok(ca.some((h) => h.lessonSlug === "ca-rpn-sepsis" && h.score === EXPLICIT_TIER_TOPIC_SCORE));
  });

  it("uses allied sepsis gold slug when pathway is allied", () => {
    const hits = tryExplicitTieredTopicLinks(
      {
        topic: "Sepsis",
        subtopic: "",
        bodySystem: null,
        tags: [],
        topicCode: null,
      },
      pathwayRationaleContextFromId("us-allied-core"),
    );
    assert.ok(hits.some((h) => h.lessonSlug === SEPSIS_GOLD_SLUG));
  });

  it("returns no explicit hits when pathway has no tier", () => {
    const hits = tryExplicitTieredTopicLinks(
      {
        topic: "Sepsis",
        subtopic: "",
        bodySystem: null,
        tags: [],
        topicCode: null,
      },
      pathwayRationaleContextFromId("unknown-pathway"),
    );
    assert.equal(hits.length, 0);
  });
});
