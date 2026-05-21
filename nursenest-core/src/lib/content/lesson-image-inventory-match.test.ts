import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectLessonImageBasenameCandidates,
  findInventoryObjectKeyForBasename,
  normalizeLessonImageBasename,
  resolveInventoryLessonImageKey,
  stripPathwayLessonSlugPrefix,
} from "@/lib/content/lesson-image-inventory-match";

describe("lesson-image-inventory-match", () => {
  it("normalizeLessonImageBasename maps titles to hyphenated basenames", () => {
    assert.equal(normalizeLessonImageBasename("Aortic Aneurysm"), "aortic-aneurysm");
    assert.equal(normalizeLessonImageBasename("Pulmonary Embolism"), "pulmonary-embolism");
  });

  it("stripPathwayLessonSlugPrefix removes exam pathway prefixes", () => {
    assert.equal(
      stripPathwayLessonSlugPrefix("us-rn-pulmonary-embolism"),
      "pulmonary-embolism",
    );
    assert.equal(
      stripPathwayLessonSlugPrefix("atrial-fibrillation-rate-control"),
      "atrial-fibrillation-rate-control",
    );
  });

  it("collectLessonImageBasenameCandidates includes slug, title, and stripped slug", () => {
    const c = collectLessonImageBasenameCandidates({
      slug: "us-rn-pulmonary-embolism",
      title: "Pulmonary Embolism",
      topicSlug: "pulmonary-embolism",
    });
    assert.ok(c.includes("pulmonary-embolism"));
    assert.ok(c.includes("us-rn-pulmonary-embolism") || c.some((x) => x.includes("pulmonary")));
  });

  it("findInventoryObjectKeyForBasename prefers avif then webp", () => {
    const keys = [
      "uploads/images/pulmonary-embolism.webp",
      "pulmonary-embolism.avif",
      "pulmonary-embolism.png",
    ];
    assert.equal(
      findInventoryObjectKeyForBasename("pulmonary-embolism", keys),
      "pulmonary-embolism.avif",
    );
  });

  it("resolveInventoryLessonImageKey fuzzy-matches slug prefixes", () => {
    const keys = ["uploads/images/atrial-fibrillation.webp"];
    const res = resolveInventoryLessonImageKey(
      { slug: "atrial-fibrillation-rate-control", title: "Atrial Fibrillation" },
      keys,
    );
    assert.ok(res);
    assert.equal(res.objectKey, "uploads/images/atrial-fibrillation.webp");
    assert.equal(res.matchedBasename, "atrial-fibrillation");
  });
});
