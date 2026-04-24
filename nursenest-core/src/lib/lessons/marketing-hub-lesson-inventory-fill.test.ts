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

const LESSONS_BASE_CA_RN = "/canada/rn/nclex-rn/lessons";
const pathwayCaRn = { id: "ca-rn-nclex-rn" } as ExamPathwayDefinition;
const pathwayUsRn = { id: "us-rn-nclex-rn" } as ExamPathwayDefinition;
const pathwayCaPn = { id: "ca-rpn-rex-pn" } as ExamPathwayDefinition;
const pathwayUsAllied = { id: "us-allied-core" } as ExamPathwayDefinition;
const pathwayUsNp = { id: "us-np-fnp" } as ExamPathwayDefinition;
const pathwayUsNewGrad = { id: "us-rn-new-grad-transition" } as ExamPathwayDefinition;

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
    if (p.id !== pathwayCaRn.id) {
      return { ok: false as const, reason: "pathway_context_mismatch" as const, slug };
    }
    return { ok: true as const, lesson: hydratedLesson(slug) };
  };

  const { lessons, diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway: pathwayCaRn,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: LESSONS_BASE_CA_RN,
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
    pathway: pathwayCaRn,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: LESSONS_BASE_CA_RN,
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
    pathway: pathwayCaRn,
    routePathname: "/x/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: LESSONS_BASE_CA_RN,
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
    pathway: pathwayCaRn,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: LESSONS_BASE_CA_RN,
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
    pathway: pathwayCaRn,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: LESSONS_BASE_CA_RN,
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
    pathway: pathwayCaRn,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: LESSONS_BASE_CA_RN,
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

test("US RN hub fill uses pathway id (not hardcoded to Canada)", async () => {
  const verified = [listRow("us-seed")];
  const loader = Array.from({ length: 14 }, (_, i) => listRow(`us-extra-${i}`));
  const evaluateCrossLink = async (p: Pick<ExamPathwayDefinition, "id">, slug: string) => {
    if (p.id !== pathwayUsRn.id) return { ok: false as const, reason: "pathway_context_mismatch" as const, slug };
    return { ok: true as const, lesson: hydratedLesson(slug) };
  };
  const { diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway: pathwayUsRn,
    routePathname: "/us/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: "/us/rn/nclex-rn/lessons",
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: verified,
    loaderRenderable: loader,
    deps: { evaluateCrossLink },
  });
  assert.equal(diagnostics.finalStrictCount, 12);
});

test("Canada PN hub fill respects pathway id", async () => {
  const pnRow = (slug: string) =>
    listRow(slug, {
      exams: ["REX_PN"],
      countries: ["CA"],
    });
  const verified = [pnRow("pn-seed")];
  const loader = Array.from({ length: 14 }, (_, i) => pnRow(`pn-${i}`));
  const evaluateCrossLink = async (p: Pick<ExamPathwayDefinition, "id">, slug: string) => {
    if (p.id !== pathwayCaPn.id) return { ok: false as const, reason: "pathway_context_mismatch" as const, slug };
    return { ok: true as const, lesson: { ...hydratedLesson(slug), exams: ["REX_PN"], countries: ["CA"] } };
  };
  const { diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway: pathwayCaPn,
    routePathname: "/canada/pn/rex-pn/lessons",
    lessonContentLocale: "en",
    listWarehouseLocale: "en",
    lessonsBasePath: "/canada/pn/rex-pn/lessons",
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: verified,
    loaderRenderable: loader,
    deps: { evaluateCrossLink },
  });
  assert.equal(diagnostics.finalStrictCount, 12);
});

test("US RN hub prefilter drops PN-only exam stamps (no cross-track leakage)", async () => {
  const verified = [listRow("rn-ok")];
  const pnLeak = listRow("pn-leak", { exams: ["REX_PN"], countries: ["CA"] });
  const evaluateCrossLink = async () => ({ ok: true as const, lesson: hydratedLesson("x") });
  const { diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway: pathwayUsRn,
    routePathname: "/us/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: "/us/rn/nclex-rn/lessons",
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: [pnLeak],
    deps: { evaluateCrossLink },
  });
  assert.ok(diagnostics.prefilterDropped.pathwayContextMismatchOnListRow >= 1);
});

test("US Allied hub prefilter drops pure nursing exam stamps (no NCLEX-only leakage)", async () => {
  const verified = [
    listRow("allied-keep", {
      exams: ["ALLIED"],
      countries: ["US"],
    }),
  ];
  const nursingOnly = listRow("nclex-only", { exams: ["NCLEX_RN"], countries: ["US"] });
  let called = 0;
  const evaluateCrossLink = async () => {
    called += 1;
    return { ok: true as const, lesson: hydratedLesson("x") };
  };
  const { diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway: pathwayUsAllied,
    routePathname: "/us/allied/allied-health/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: "/us/allied/allied-health/lessons",
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: [nursingOnly],
    deps: { evaluateCrossLink },
  });
  assert.equal(called, 0);
  assert.ok(diagnostics.prefilterDropped.pathwayContextMismatchOnListRow >= 1);
});

test("US New Grad hub prefilter drops PN-only rows (pathway stays RN transition context)", async () => {
  const verified = [listRow("ng-keep", { exams: ["NCLEX_RN"], countries: ["US"] })];
  const pnOnly = listRow("pn-only", { exams: ["REX_PN"], countries: ["CA"] });
  const evaluateCrossLink = async () => ({ ok: true as const, lesson: hydratedLesson("x") });
  const { diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway: pathwayUsNewGrad,
    routePathname: "/us/rn/new-grad-transition/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: "/us/rn/new-grad-transition/lessons",
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: [pnOnly],
    deps: { evaluateCrossLink },
  });
  assert.ok(diagnostics.prefilterDropped.pathwayContextMismatchOnListRow >= 1);
});

test("NP hub does not append candidate when evaluate reports pathway mismatch (simulated wrong publish)", async () => {
  const verified = [
    listRow("np-keep", {
      exams: ["NP", "NCLEX_RN"],
      countries: ["US"],
    }),
  ];
  const loader = [listRow("borrowed-rn-catalog", { exams: ["NCLEX_RN"], countries: ["US"] })];
  const evaluateCrossLink = async (_p: Pick<ExamPathwayDefinition, "id">, slug: string) => {
    if (slug === "borrowed-rn-catalog") {
      return { ok: false as const, reason: "pathway_context_mismatch" as const, slug };
    }
    return { ok: true as const, lesson: hydratedLesson(slug) };
  };
  const { lessons, diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway: pathwayUsNp,
    routePathname: "/us/np/fnp/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: "/us/np/fnp/lessons",
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: loader,
    deps: { evaluateCrossLink },
  });
  assert.equal(lessons.length, 1);
  assert.ok((diagnostics.evaluateRejectionReasons.pathway_context_mismatch ?? 0) >= 1);
});

test("detail_loader_miss from evaluate increments evaluateRejectionReasons", async () => {
  const verified = [listRow("seed")];
  const loader = [listRow("ghost")];
  const evaluateCrossLink = async () => ({
    ok: false as const,
    reason: "detail_loader_miss" as const,
    slug: "ghost",
  });
  const { diagnostics } = await fillMarketingHubLessonInventoryToMinimum({
    pathway: pathwayCaRn,
    routePathname: "/canada/rn/nclex-rn/lessons",
    lessonContentLocale: "en",
    lessonsBasePath: LESSONS_BASE_CA_RN,
    minVisible: 12,
    verifiedKept: verified,
    hubCurriculumPrepared: [],
    loaderRenderable: loader,
    deps: { evaluateCrossLink },
  });
  assert.ok((diagnostics.evaluateRejectionReasons.detail_loader_miss ?? 0) >= 1);
});
