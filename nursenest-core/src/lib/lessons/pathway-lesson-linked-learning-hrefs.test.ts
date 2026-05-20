/**
 * Pure href pack for linked vs legacy lesson footers.
 * Run: `npx tsx --test src/lib/lessons/pathway-lesson-linked-learning-hrefs.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  buildLegacyLessonActionHrefs,
  buildLinkedLearningHrefPack,
  normalizeLinkedTopicKey,
} from "@/lib/lessons/pathway-lesson-linked-learning-hrefs";
import type { PathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-types";

describe("pathway-lesson-linked-learning-hrefs", () => {
  it("normalizeLinkedTopicKey trims and lowercases", () => {
    assert.equal(normalizeLinkedTopicKey("  Fluid-Balance "), "fluid-balance");
  });

  it("does not fall back to legacy question href when practiceQuestionsLinked is false", () => {
    const pathwayDef = getExamPathwayById("us-rn-nclex-rn");
    const pack = buildLinkedLearningHrefPack({
      pathwayId: "us-rn-nclex-rn",
      pathwayDef,
      topicLabel: "Topic",
      signals: {
        bidirectionalTopicKey: "some-topic",
        flashcardsLinked: true,
        practiceQuestionsLinked: false,
        catPoolLinked: true,
        adaptiveLearningReadiness: false,
      },
      catAdaptiveAvailable: true,
      linkMode: "learner",
    });
    assert.equal(pack.questionsHref, null);
  });

  it("wraps app study hrefs for marketing linkMode", () => {
    const pathwayDef = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathwayDef, "pathway fixture");
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "wrap-topic",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const pack = buildLinkedLearningHrefPack({
      pathwayId: "us-rn-nclex-rn",
      pathwayDef,
      topicLabel: "Wrap",
      signals,
      catAdaptiveAvailable: true,
      linkMode: "marketing",
    });
    assert.ok(pack.flashcardsHref?.includes("/login"), "flashcards wrapped");
    assert.ok(pack.questionsHref?.includes("callbackUrl="), "questions wrapped");
    assert.ok(pack.practiceTestsHref?.includes("/login"), "practice tests wrapped");
    assert.ok(pack.adaptiveHref?.startsWith("/"), "marketing adaptive is public hub path");
    assert.equal(pack.adaptiveHref?.includes("/login"), false);
  });

  it("legacy pack always exposes a questions href string", () => {
    const pathwayDef = getExamPathwayById("us-rn-nclex-rn");
    const legacy = buildLegacyLessonActionHrefs({
      pathwayId: "us-rn-nclex-rn",
      pathwayDef,
      topicCode: "legacy-slug",
      topicLabel: "Legacy",
      catAdaptiveAvailable: false,
    });
    assert.match(legacy.questionsHref ?? "", /\/app\/questions\?/);
    assert.equal(legacy.adaptiveHref, null);
  });

  it("linked adaptive href is null when bidirectionalTopicKey is empty", () => {
    const pathwayDef = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathwayDef);
    const pack = buildLinkedLearningHrefPack({
      pathwayId: "us-rn-nclex-rn",
      pathwayDef,
      topicLabel: "X",
      signals: {
        bidirectionalTopicKey: "   ",
        flashcardsLinked: true,
        practiceQuestionsLinked: true,
        catPoolLinked: true,
        adaptiveLearningReadiness: true,
      },
      catAdaptiveAvailable: true,
      linkMode: "learner",
    });
    assert.equal(pack.adaptiveHref, null);
  });
});
