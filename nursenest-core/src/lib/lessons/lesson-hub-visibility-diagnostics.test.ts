import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  buildLessonHubVisibilityDiagnosticsReport,
  buildMarketingLessonHubVerifySummaryLogFields,
  classifyPreparedRowsForMarketingHubVisibility,
  mapHubMarketingFailureToVisibilityReason,
} from "@/lib/lessons/lesson-hub-visibility-diagnostics";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function hubRow(slug: string, title = "Lesson title"): PathwayLessonRecord {
  return {
    slug,
    title,
    topic: "Topic",
    topicSlug: "infection",
    bodySystem: "cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: title,
    seoDescription:
      "Clinical framing, safety cues, prioritization patterns, and exam-style rationale for this topic in nursing practice.",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: [],
    countries: [],
  } as PathwayLessonRecord;
}

describe("lesson-hub-visibility-diagnostics", () => {
  it("maps internal verify reasons to visibility taxonomy", () => {
    assert.equal(mapHubMarketingFailureToVisibilityReason("missing_slug"), "not_renderable_slug");
    assert.equal(mapHubMarketingFailureToVisibilityReason("detail_loader_miss"), "cross_link_integrity_failed");
    assert.equal(mapHubMarketingFailureToVisibilityReason("detail_not_public_complete"), "not_public_marketing_eligible");
    assert.equal(mapHubMarketingFailureToVisibilityReason("pathway_context_mismatch"), "pathway_context_mismatch");
    assert.equal(mapHubMarketingFailureToVisibilityReason("professional_hub_corpus_guard"), "suppressed_professional_practice");
    assert.equal(mapHubMarketingFailureToVisibilityReason("taxonomy_review_required"), "review_required");
  });

  it("counts exclusions by taxonomy and separates strict kept", () => {
    const prepared = [
      hubRow("a", "A"),
      { ...hubRow("b", "B"), structuralQuality: { publicComplete: false } },
      hubRow("c", "C"),
    ];
    const verifyKept: PathwayLessonRecord[] = [
      prepared[0]!,
      { ...prepared[1]!, hubMarketingDegraded: true, hubMarketingDegradedReason: "partial_content" },
    ];
    const verifyExcluded = [
      { slug: "c", reason: "detail_loader_miss" as const },
    ];
    const r = classifyPreparedRowsForMarketingHubVisibility({
      pathwayId: "ca-rn-nclex-rn",
      prepared,
      verifyKept,
      verifyExcluded,
    });
    assert.equal(r.totalPrepared, 3);
    assert.equal(r.totalVerifyKeptStrict, 1);
    assert.equal(r.totalExcluded, 2);
    assert.equal(r.exclusionReasonCounts.not_public_marketing_eligible, 1);
    assert.equal(r.exclusionReasonCounts.missing_required_metadata, 0);
    assert.equal(r.exclusionReasonCounts.cross_link_integrity_failed, 1);
  });

  it("includes publishStatus on samples when Prisma status map is provided", async () => {
    const pathway = { id: "ca-rn-nclex-rn", countrySlug: "canada" } as ExamPathwayDefinition;
    const prepared = [hubRow("only-one", "Only")];
    const report = await buildLessonHubVisibilityDiagnosticsReport({
      pathway,
      countrySlug: "canada",
      lessonContentLocale: "en",
      prepared,
      verifyKept: prepared,
      verifyExcluded: [],
      sampleKept: 5,
      sampleExcluded: 5,
      prismaStatusBySlug: new Map([["only-one", "PUBLISHED"]]),
    });
    assert.equal(report.keptSamples.length, 1);
    assert.equal(report.keptSamples[0]?.publishStatus, "PUBLISHED");
    assert.equal(report.keptSamples[0]?.workflowStatus, null);
  });

  it("verify summary log fields stay aggregate-only (no slug arrays)", () => {
    const fields = buildMarketingLessonHubVerifySummaryLogFields({
      pathwayId: "ca-rn-nclex-rn",
      preparedCount: 800,
      verifyKeptStrictCount: 1,
      excludedCount: 799,
      exclusionReasonCounts: {
        not_renderable_slug: 0,
        no_marketing_detail_href: 0,
        review_required: 0,
        not_public_marketing_eligible: 0,
        pathway_context_mismatch: 0,
        cross_link_integrity_failed: 799,
        suppressed_professional_practice: 0,
        workflow_not_published_or_released: 0,
        missing_required_metadata: 0,
        unknown: 0,
      },
    });
    assert.equal(fields.stage, "marketing_lesson_hub_verify_summary");
    const top = JSON.parse(fields.top_exclusion_reasons_json) as Array<{ reason: string; count: number }>;
    assert.equal(top[0]?.reason, "cross_link_integrity_failed");
    assert.equal(top[0]?.count, 799);
    for (const v of Object.values(fields)) {
      assert.ok(!/\bslug\b/i.test(String(v)), "log values must not embed slug lists");
    }
  });
});

describe("marketing hub smoke diagnostics learner safety", () => {
  const FORBIDDEN_LEARNER_DIAGNOSTIC_KEYS = new Set([
    "excludedSamples",
    "keptSamples",
    "droppedPreparedRowSamples",
    "excludedSlugSamples",
    "lessonRowDiagnostics",
    "perSlug",
    "outcomes",
  ]);

  it("rendered_library smoke payload must not include raw per-row diagnostics", () => {
    const payload: Record<string, unknown> = {
      surface: "marketing_pathway_lessons",
      outcome: "rendered_library",
      pathwayId: "ca-rn-nclex-rn",
      routePathname: "/canada/rn/nclex-rn/lessons",
      contentLocale: "en",
      loaderTotal: 800,
      renderableAllCount: 800,
      preparedLessonCount: 800,
      verifiedLessonCount: 72,
      curriculumGridRowCount: 72,
      finalRenderedLessonLinkCount: 72,
      verifyIncomingPrepared: 800,
      verifyUniqueSlugs: 800,
      verifyKept: 72,
      topRejectionReasons: [{ reason: "detail_loader_miss", count: 100 }],
      excludedByReason: { detail_loader_miss: 100 },
      fillEvaluateRejectionReasons: {},
      fillRejectedEvaluateCount: 0,
      lessonsPageSource: "primary",
    };
    for (const k of Object.keys(payload)) {
      assert.ok(!FORBIDDEN_LEARNER_DIAGNOSTIC_KEYS.has(k), `unexpected learner-facing key: ${k}`);
    }
  });
});
