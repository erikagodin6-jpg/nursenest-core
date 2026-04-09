import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inferRationaleLessonSlugCandidates } from "@/lib/learner/rationale-lesson-link-engine";
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";
import { CLINICAL_JUDGMENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";

describe("rationale-lesson-link-engine", () => {
  it("maps sepsis language to sepsis gold slug", () => {
    const c = inferRationaleLessonSlugCandidates({
      topic: "Med-Surg",
      subtopic: "Sepsis recognition",
      bodySystem: null,
      tags: [],
      pathwayId: "us-rn-nclex-rn",
    });
    assert.ok(c.some((x) => x.slug === SEPSIS_GOLD_SLUG));
  });

  it("maps prioritization language to clinical judgment slug", () => {
    const c = inferRationaleLessonSlugCandidates({
      topic: "Prioritization",
      subtopic: "",
      bodySystem: null,
      tags: ["delegation"],
      pathwayId: "us-lpn-nclex-pn",
    });
    assert.ok(c.some((x) => x.slug === CLINICAL_JUDGMENT_GOLD_SLUG));
  });

  it("returns empty when haystack is too thin", () => {
    const c = inferRationaleLessonSlugCandidates({
      topic: "x",
      subtopic: "",
      bodySystem: null,
      tags: [],
      pathwayId: "us-rn-nclex-rn",
    });
    assert.equal(c.length, 0);
  });
});
