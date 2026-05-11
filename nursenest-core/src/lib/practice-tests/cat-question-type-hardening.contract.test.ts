import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { isCompleteCatQuestionRow } from "@/lib/practice-tests/cat-question-completeness";
import { finalizeQuestionApiTeachingExposure } from "@/lib/questions/question-api-payload-strip";

describe("CAT question-type hardening — normalization contracts", () => {
  it("isCompleteCatQuestionRow rejects structured matrix options without bowtie typing", () => {
    assert.equal(
      isCompleteCatQuestionRow({
        questionType: "MATRIX",
        stem: "Pick matching pairs.",
        options: { rows: [{ left: "a" }] },
        correctAnswer: ["x"],
        rationale: "Because.",
      }),
      false,
    );
  });

  it("CAT teachingExposure none strips rationale and correctAnswer but keeps exhibit/media payloads", () => {
    const merged = mergeQuestionApiPayload(
      {
        id: "q1",
        stem: "Review the chart.",
        questionType: "MCQ",
        options: ["A", "B"],
        exhibitData: { labs: [{ name: "Na", value: "135" }] },
        images: [{ url: "https://example.com/x.png", alt: "strip" }],
        rationale: "secret",
        correctAnswer: ["A"],
      },
      "en",
      undefined,
      { teachingExposure: "none" },
    );
    assert.equal(Object.prototype.hasOwnProperty.call(merged, "rationale"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(merged, "correctAnswer"), false);
    assert.deepEqual(merged.exhibitData, { labs: [{ name: "Na", value: "135" }] });
    assert.ok(Array.isArray(merged.images));
  });

  it("finalizeQuestionApiTeachingExposure none removes per-item teaching keys for CAT GET contract", () => {
    const row = finalizeQuestionApiTeachingExposure(
      {
        stem: "x",
        rationale: "do not leak during active CAT item",
        correctAnswer: ["A"],
        clinicalPearl: "p",
      },
      "none",
    );
    assert.equal(Object.prototype.hasOwnProperty.call(row, "rationale"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(row, "correctAnswer"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(row, "clinicalPearl"), false);
  });
});
