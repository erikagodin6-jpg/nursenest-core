import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createExamCompleteSection,
  examCompleteAuthoringChecklistText,
  EXAM_COMPLETE_SPINE_KINDS,
  inferExamAudienceFromPathwayId,
  validateExamCompletePremiumSpine,
} from "./exam-complete-lesson-template";
import { PREMIUM_SECTION_HEADINGS, PREMIUM_SECTION_KINDS } from "./pathway-lesson-premium";
import { EXAM_COMPLETE_SYSTEM_KEYS, EXAM_COMPLETE_SYSTEM_TOPIC_SLUGS } from "./exam-complete-topic-taxonomy";

describe("exam-complete lesson template", () => {
  it("spine kinds match premium registry order and length", () => {
    assert.deepEqual(EXAM_COMPLETE_SPINE_KINDS, PREMIUM_SECTION_KINDS);
    assert.equal(EXAM_COMPLETE_SPINE_KINDS.length, 11);
  });

  it("createExamCompleteSection uses canonical id and heading", () => {
    const s = createExamCompleteSection("introduction", "Paragraph one.\n\nParagraph two with enough words to look serious about clinical teaching and exam preparation.");
    assert.equal(s.id, "introduction");
    assert.equal(s.kind, "introduction");
    assert.equal(s.heading, PREMIUM_SECTION_HEADINGS.introduction);
  });

  it("validateExamCompletePremiumSpine detects missing and duplicate kinds", () => {
    const partial = [createExamCompleteSection("introduction", "A\n\nB")];
    const bad = validateExamCompletePremiumSpine(partial);
    assert.equal(bad.ok, false);
    assert.ok(bad.missing.length > 0);

    const dup = validateExamCompletePremiumSpine([
      createExamCompleteSection("introduction", "A\n\nB"),
      createExamCompleteSection("introduction", "C\n\nD"),
      ...PREMIUM_SECTION_KINDS.filter((k) => k !== "introduction").map((k) =>
        createExamCompleteSection(k, `${k} body `.repeat(80)),
      ),
    ]);
    assert.equal(dup.ok, false);
    assert.ok(dup.duplicateKinds.includes("introduction"));
  });

  it("authoring checklist includes all steps", () => {
    const text = examCompleteAuthoringChecklistText();
    assert.ok(text.includes("1. Introduction"));
    assert.ok(text.includes("11. Related Lessons / Next Steps"));
  });
});

describe("exam-complete topic taxonomy", () => {
  it("every system key maps to at least one topic slug", () => {
    for (const key of EXAM_COMPLETE_SYSTEM_KEYS) {
      assert.ok(EXAM_COMPLETE_SYSTEM_TOPIC_SLUGS[key].length > 0, key);
    }
  });
});
