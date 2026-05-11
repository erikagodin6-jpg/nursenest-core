import assert from "node:assert/strict";
import test from "node:test";
import { getEcgQuestionGovernanceFlags } from "@/lib/ecg-module/ecg-safety-governance";
import { buildAdvancedEcgCoverageReport } from "@/lib/ecg-module/ecg-depth-audit";
import { normalizeEcgQuestionTaxonomy } from "@/lib/ecg-module/ecg-question-taxonomy";
import { ADVANCED_ECG_LESSON_CONTENT } from "@/lib/advanced-ecg/advanced-ecg-lesson-content";
import { ADVANCED_ECG_DRAFT_QUESTION_PACK } from "@/lib/advanced-ecg/advanced-ecg-question-pack";

test("Advanced ECG draft question pack meets premium minimum volume by topic", () => {
  const report = buildAdvancedEcgCoverageReport({
    topics: ADVANCED_ECG_LESSON_CONTENT,
    questions: ADVANCED_ECG_DRAFT_QUESTION_PACK.map((row) => ({
      id: String(row.id),
      rhythmOrTopicKey:
        ((row.topicTags as string[]).find((tag) => tag.startsWith("topic:")) ?? "topic:unknown").replace("topic:", ""),
      tags: row.topicTags as string[],
      rationale: typeof row.rationale === "string" ? row.rationale : null,
      distractorRationalesComplete: ((row.topicTags as string[]) ?? []).includes("rationale:distractors_included"),
      assetReviewStatus:
        row.publishSafetyStatus === "safe"
          ? "publish_safe"
          : row.waveformFidelity === "morphology_approximate"
            ? "generated_review_required"
            : "internal_only",
      lessonStatus: "review_ready",
    })),
    entitledTierLabels: ["RN", "NP"],
    blockedTierLabels: ["RPN"],
  });

  for (const topic of report.topics) {
    assert.equal(topic.questionVolume.minimumsMet, true, `${topic.key} should meet minimum premium volume`);
    assert.equal(topic.clinicalReviewRequired, true, `${topic.key} should remain clinical-review-required`);
  }
});

test("Advanced ECG draft question pack keeps all generated items internal-only for learners", () => {
  assert.equal(ADVANCED_ECG_DRAFT_QUESTION_PACK.length >= ADVANCED_ECG_LESSON_CONTENT.length * 40, true);

  for (const row of ADVANCED_ECG_DRAFT_QUESTION_PACK) {
    const tags = row.topicTags as string[];
    const taxonomy = normalizeEcgQuestionTaxonomy({
      rhythmTag: typeof row.rhythmTag === "string" ? row.rhythmTag : null,
      topicTags: tags,
      clinicalPriority: typeof row.clinicalPriority === "string" ? row.clinicalPriority : null,
    });
    const governance = getEcgQuestionGovernanceFlags({
      rhythmTag: typeof row.rhythmTag === "string" ? row.rhythmTag : null,
      topicTags: tags,
      mediaType: typeof row.mediaType === "string" ? row.mediaType : null,
      mediaConfig: row.mediaConfig,
      videoUrl: typeof row.videoUrl === "string" ? row.videoUrl : null,
      clinicianReviewedAt: row.clinicianReviewedAt as Date | null,
      waveformFidelity: typeof row.waveformFidelity === "string" ? row.waveformFidelity : null,
      qaStatus: typeof row.qaStatus === "string" ? row.qaStatus : null,
      publishSafetyStatus: typeof row.publishSafetyStatus === "string" ? row.publishSafetyStatus : null,
    });

    assert.equal(taxonomy.families.length > 0, true, `${row.id} should map to a family`);
    assert.equal(taxonomy.examStyles.length > 0, true, `${row.id} should carry an exam style`);
    assert.equal(tags.includes("review:clinical_required"), true, `${row.id} should require clinical review`);
    assert.equal(tags.includes("rationale:distractors_included"), true, `${row.id} should mark distractor rationale completeness`);
    assert.equal(governance.learnerVisible, false, `${row.id} should remain hidden from learners`);
  }
});
