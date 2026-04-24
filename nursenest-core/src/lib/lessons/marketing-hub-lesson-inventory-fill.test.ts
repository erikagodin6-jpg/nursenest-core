import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { test } from "node:test";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  countStrictMarketingHubInventoryRows,
  fillMarketingHubLessonInventoryToMinimum,
  MARKETING_HUB_MIN_VISIBLE_LESSONS,
} from "@/lib/lessons/marketing-hub-lesson-inventory-fill";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

const LESSONS_BASE = "/canada/rn/nclex-rn/lessons";
const pathway = { id: "ca-rn-nclex-rn" } as ExamPathwayDefinition;

function listRow(slug: string, overrides?: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  return {
    slug,
    title: `Title ${slug}`,
    topic: "Topic",
    topicSlug: "infection",
    bodySystem: "cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: `Title ${slug}`,
    seoDescription:
      "Clinical framing, safety cues, prioritization patterns, and exam-style rationale for this topic in nursing practice and on the NCLEX-RN.",
    sections: [],
    structuralQuality: {
      publicComplete: true,
      issues: [],
      warnings: [],
      structureMode: "legacy",
      internalStudyLinkCount: 0,
    },
    exams: ["NCLEX_RN"],
    countries: ["CA", "US"],
    localeMeta: {
      requestedContentLocale: "en",
      contentLocale: "en",
      usedLocaleFallback: false,
      isCatalogEnglishSource: false,
    },
    ...overrides,
  } as PathwayLessonRecord;
}

function hydratedLesson(slug: string): PathwayLessonRecord {
  return {
    ...listRow(slug),
    sections: [{ id: "s1", heading: "Introduction", kind: "intro", body: "x".repeat(120) }],
  } as PathwayLessonRecord;
}

test("fills strict inventory to ≥12 when primary has 1 strict and many same-pathway candidates verify", async () => {
  const verified = [listRow("keep-first")];
  const prepared = verified;
  const loader = Array.from({ length: 25 }, (_, i) => listRow(`extra-${i}`));

  const evaluateCrossLink = async (p: Pick<ExamPathwayDefinition, "id">, slug: string) => {
    if (p.id !== pathway.id) {
      return { ok: false as const, reason: "pathway_context_mismatch" as const, slug };
    }
    return { ok: true as const, lesson: hydratedLesson(slug) };
  };

  const { lessons, diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: LESSONS_BASE,
    minVisible: MARKETING_HUB_MIN_VISIBLE_LESSONS,
    verifiedKept: verified,
    hubCurriculumPrepared: prepared,
    loaderRenderable: loader,
    deps: { evaluateCrossLink },
  });

  assert.equal(countStrictMarketingHubInventoryRows(lessons), MARKETING_HUB_MIN_VISIBLE_LESSONS);
  assert.equal(lessons[0]!.slug, "keep-first");
  assert.equal(diagnostics.filledStrictCount, 11);
  assert.equal(diagnostics.finalStrictCount, 12);
});

test("cross-pathway evaluate failures do not append rows", async () => {
  const verified = [listRow("a")];
  const loader = [listRow("b")];
  const evaluateCrossLink = async () => ({ ok: false as const, reason: "pathway_context_mismatch" as const, slug: "b" });

  const { lessons, diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: LESSONS_BASE,
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: loader,
    deps: { evaluateCrossLink },
  });
  assert.equal(lessons.length, 1);
  assert.ok(diagnostics.rejectedEvaluateCount >= 1);
});

test("invalid list rows are skipped before evaluate (missing href)", async () => {
  const verified = [listRow("ok")];
  const badHref = listRow("no-href", { slug: "" });
  let called = 0;
  const evaluateCrossLink = async () => {
    called += 1;
    return { ok: true as const, lesson: hydratedLesson("x") };
  };
  const { diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway,
    routePathname: "/x/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: LESSONS_BASE,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: [badHref],
    deps: { evaluateCrossLink },
  });
  assert.equal(called, 0);
  assert.ok(diagnostics.prefilterDropped.missingSlug >= 1);
});

test("REVIEW_REQUIRED taxonomy list rows are not evaluated", async () => {
  const verified = [listRow("seed")];
  const reviewLike = listRow("review-like", {
    title: "",
    topic: "",
    topicSlug: "",
    bodySystem: "",
    sections: [],
    seoDescription: "",
  });
  let called = 0;
  const evaluateCrossLink = async () => {
    called += 1;
    return { ok: true as const, lesson: hydratedLesson("review-like") };
  };
  const { diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: LESSONS_BASE,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: [reviewLike],
    deps: { evaluateCrossLink },
  });
  assert.equal(called, 0);
  assert.ok(diagnostics.prefilterDropped.taxonomyReviewRequired >= 1);
});

test("preserves verified order before appended strict hydrations", async () => {
  const verified = [listRow("second"), listRow("first")];
  const loader = [listRow("third")];
  const evaluateCrossLink = async (_p: Pick<ExamPathwayDefinition, "id">, slug: string) => {
    if (slug === "third") return { ok: true as const, lesson: hydratedLesson("third") };
    return { ok: false as const, reason: "detail_loader_miss" as const, slug };
  };
  const { lessons } = await fillMarketingHubLessonInventoryToMinimum({
    pathway,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: LESSONS_BASE,
    minVisible: 3,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: loader,
    deps: { evaluateCrossLink },
  });
  assert.deepEqual(
    lessons.map((l) => l.slug),
    ["second", "first", "third"],
  );
});

test("degraded: fewer than min strict when every evaluate fails", async () => {
  const verified = [listRow("only")];
  const loader = Array.from({ length: 15 }, (_, i) => listRow(`x-${i}`));
  const evaluateCrossLink = async () => ({ ok: false as const, reason: "detail_loader_miss" as const, slug: "x" });
  const { lessons, diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: LESSONS_BASE,
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: loader,
    deps: { evaluateCrossLink },
  });
  assert.equal(lessons.length, 1);
  assert.equal(diagnostics.finalStrictCount, 1);
  assert.ok(diagnostics.finalStrictCount < MARKETING_HUB_MIN_VISIBLE_LESSONS);
  assert.ok(diagnostics.rejectedEvaluateCount > 0);
});
