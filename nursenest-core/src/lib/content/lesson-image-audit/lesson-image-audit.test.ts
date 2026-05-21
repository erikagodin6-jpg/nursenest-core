import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeLessonImageBasename,
  resolveInventoryLessonImageKey,
} from "@/lib/content/lesson-image-inventory-match";
import {
  recommendLessonImageTypes,
  resolveProductionCluster,
} from "@/lib/content/lesson-image-audit/image-type-recommendation";
import { computePriorityScore, priorityLevelFromScore } from "@/lib/content/lesson-image-audit/priority-scoring";
import {
  resolveLessonImageAuditStatus,
  scoreImageQuality,
} from "@/lib/content/lesson-image-audit/resolve-audit-status";
import {
  shouldLessonHaveImage,
  scoreVisualNecessity,
  isLowVisualPriorityLesson,
} from "@/lib/content/lesson-image-audit/visual-necessity";
import { assignDuplicateGroupIds } from "@/lib/content/lesson-image-audit/duplicate-opportunities";
import type { LessonImageAuditRow } from "@/lib/content/lesson-image-audit/types";

describe("lesson-image-audit", () => {
  it("prioritizes pulmonary embolism and deprioritizes study tips", () => {
    const pe = {
      title: "Pulmonary Embolism",
      slug: "us-rn-pulmonary-embolism",
      topic: "Pulmonary embolism",
      topicSlug: "pulmonary-embolism",
      bodySystem: "Respiratory",
    };
    const tips = {
      title: "NCLEX Study Tips",
      slug: "nclex-study-tips",
      topic: "Study tips",
      topicSlug: "study-skills",
      bodySystem: "General",
    };
    assert.ok(shouldLessonHaveImage(pe));
    assert.ok(scoreVisualNecessity(pe) > scoreVisualNecessity(tips));
    assert.ok(isLowVisualPriorityLesson(tips));
  });

  it("recommends ECG strip for atrial fibrillation", () => {
    const input = {
      title: "Atrial Fibrillation",
      slug: "atrial-fibrillation-rate-control",
      topic: "Atrial fibrillation",
      topicSlug: "atrial-fibrillation",
      bodySystem: "Cardiovascular",
    };
    const rec = recommendLessonImageTypes(input);
    assert.equal(rec.primary, "ecg_strip");
    assert.equal(rec.sharedVisualSystemId, "ecg_rhythm_family");
    const cluster = resolveProductionCluster(input, rec);
    assert.equal(cluster.cluster, "cardiac_arrhythmias");
  });

  it("maps resolution sources to audit statuses", () => {
    const inv = ["uploads/images/pulmonary-embolism.webp"];
    const exact = resolveLessonImageAuditStatus({
      resolution: {
        url: "https://example.com/pe.webp",
        objectKey: "uploads/images/pulmonary-embolism.webp",
        alt: "test",
        source: "exact_slug",
      },
      slug: "pulmonary-embolism",
      inventoryKeys: inv,
    });
    assert.equal(exact.status, "exact_match");
    assert.equal(exact.inventoryFuzzy, false);

    const semantic = resolveInventoryLessonImageKey(
      { slug: "atrial-fibrillation-rate-control" },
      ["uploads/images/atrial-fibrillation.webp"],
    );
    assert.ok(semantic?.fuzzy, "expected prefix-style inventory match");

    const fuzzy = resolveLessonImageAuditStatus({
      resolution: {
        url: "https://example.com/afib.webp",
        objectKey: semantic!.objectKey,
        alt: "test",
        source: "exact_slug",
      },
      slug: "atrial-fibrillation-rate-control",
      inventoryKeys: ["uploads/images/atrial-fibrillation.webp"],
    });
    assert.equal(fuzzy.status, "fuzzy_match");
    assert.equal(fuzzy.inventoryFuzzy, true);
  });

  it("elevates priority when should-have but no image", () => {
    const input = {
      title: "Pulmonary Embolism",
      slug: "pulmonary-embolism",
      topic: "PE",
      topicSlug: "pulmonary-embolism",
      bodySystem: "Respiratory",
    };
    const withImage = computePriorityScore(input, "exact_match");
    const missing = computePriorityScore(input, "no_image");
    assert.ok(missing.priorityScore > withImage.priorityScore);
    assert.equal(priorityLevelFromScore(84, true), "CRITICAL");
    assert.equal(priorityLevelFromScore(90, true), "CRITICAL");
  });

  it("assigns duplicate groups for shared object keys", () => {
    const base: Omit<LessonImageAuditRow, "duplicateGroupId" | "status"> = {
      lessonTitle: "A",
      lessonSlug: "a",
      pathwayId: "us-rn-nclex-rn",
      pathwayLabel: "US RN",
      roleTrack: "rn",
      examFamily: "RN",
      topic: "t",
      topicSlug: "t",
      bodySystem: "cv",
      shouldHaveImage: true,
      imageSource: "exact_slug",
      matchedInventoryFilename: "x.webp",
      matchedObjectKey: "uploads/images/x.webp",
      fallbackSourceUsed: null,
      inventoryFuzzy: false,
      imageQualityScore: 90,
      recommendedImageType: "clinical_illustration",
      recommendedImageTypes: ["clinical_illustration"],
      productionNotes: "",
      priorityScore: 80,
      priorityLevel: "HIGH",
      productionCluster: "cardiac_ecg",
      clusterLabel: "Cardiac",
      seoImportance: 80,
      educationalValue: 80,
      visualNecessity: 80,
      trafficPotential: 80,
      conversionPotential: 80,
      clinicalComplexity: 80,
      recommendedFilename: "x.webp",
      preferredExtension: ".webp",
      suggestedAltText: "a",
      suggestedWidth: 1200,
      suggestedHeight: 750,
      styleCategory: "blossom_clinical_vector",
      suggestedImagePrompt: null,
      sharedVisualSystemId: null,
      isMarketingRenderable: true,
    };
    const rows = assignDuplicateGroupIds([
      { ...base, lessonSlug: "lesson-a", status: "exact_match", duplicateGroupId: null },
      { ...base, lessonSlug: "lesson-b", status: "exact_match", duplicateGroupId: null },
    ]);
    assert.ok(rows[0]!.duplicateGroupId);
    assert.equal(rows[0]!.duplicateGroupId, rows[1]!.duplicateGroupId);
    assert.equal(rows[0]!.status, "duplicate_image_candidate");
  });

  it("normalizeLessonImageBasename supports audit filenames", () => {
    assert.equal(normalizeLessonImageBasename("STEMI"), "stemi");
    assert.equal(scoreImageQuality({ source: "none", objectKey: null, inventoryFuzzy: false, status: "no_image" }), 0);
  });
});
