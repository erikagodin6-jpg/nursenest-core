import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  CLINICAL_IMAGE_REQUIRED_CATEGORIES,
  clinicalImageCoverageByCategory,
  findClinicalImagesForQuestion,
  listClinicalImageLibraryItems,
} from "@/lib/clinical-images/clinical-image-library";

const root = process.cwd();

describe("clinical image library", () => {
  it("defines every required RN/RPN/RN/NP visual learning category", () => {
    const required = [
      "pressure_injuries",
      "wound_staging",
      "burns",
      "ostomies",
      "iv_complications",
      "skin_conditions",
      "dermatology",
      "eye_conditions",
      "ent_findings",
      "pediatric_findings",
      "womens_health",
      "ecg_recognition",
    ];
    assert.deepEqual([...CLINICAL_IMAGE_REQUIRED_CATEGORIES], required);
  });

  it("only exposes verified real library assets with accessible metadata", () => {
    const items = listClinicalImageLibraryItems();
    assert.ok(items.length >= 5, "expected verified clinical image assets from the education inventory");
    for (const item of items) {
      assert.ok(item.url.startsWith("https://") || item.url.startsWith("/clinical-illustrations/"), item.id);
      assert.ok(item.alt.length > 20, `${item.id} needs meaningful alt text`);
      assert.ok(item.caption.length > 20, `${item.id} needs a clinical caption`);
      assert.ok(item.accessibilityNote.length > 20, `${item.id} needs accessibility guidance`);
      assert.ok(item.questionIntegrations.includes("image_based_question"), `${item.id} must support image-based questions`);
    }
  });

  it("reports category coverage without inventing missing image counts", () => {
    const coverage = clinicalImageCoverageByCategory();
    assert.equal(coverage.length, CLINICAL_IMAGE_REQUIRED_CATEGORIES.length);
    assert.ok(coverage.some((row) => row.count === 0), "missing categories should remain visible as asset gaps");
    assert.ok(coverage.some((row) => row.count > 0), "verified categories should report real assets");
  });

  it("can match images for question concepts", () => {
    assert.equal(findClinicalImagesForQuestion({ topic: "Eye Conditions", clinicalConcept: "conjunctivitis" })[0]?.id, "conjunctivitis");
    assert.equal(findClinicalImagesForQuestion({ topic: "Pediatric Findings", clinicalConcept: "Kawasaki fever" })[0]?.id, "kawasaki-disease");
    assert.equal(findClinicalImagesForQuestion({ topic: "ECG Recognition", ecgRhythmCategory: "ECG rhythm recognition" })[0]?.id, "ecg-interpretation-basics");
  });

  it("provides zoom, mobile, and accessibility support through a shared viewer", () => {
    const viewer = readFileSync(join(root, "src/components/clinical-images/clinical-image-viewer.tsx"), "utf8");
    assert.match(viewer, /Zoom in/);
    assert.match(viewer, /Zoom out/);
    assert.match(viewer, /Reset zoom/);
    assert.match(viewer, /aria-label="Scrollable zoomable clinical image frame"/);
    assert.match(viewer, /max-h-\[75dvh\]/);
  });

  it("integrates visual media into flashcards and practice question surfaces", () => {
    const flashcards = readFileSync(join(root, "src/components/flashcards/flashcard-study-question-stack.tsx"), "utf8");
    assert.match(flashcards, /ClinicalImageViewer/);

    const practiceMedia = readFileSync(join(root, "src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx"), "utf8");
    assert.match(practiceMedia, /ClinicalImageGallery/);
    assert.match(practiceMedia, /parseRationaleReferenceMedia/);

    const page = readFileSync(join(root, "src/app/(app)/app/(learner)/clinical-image-library/page.tsx"), "utf8");
    assert.match(page, /ClinicalImageLibraryClient/);
    assert.match(page, /robots: \{ index: false, follow: false \}/);
  });
});
