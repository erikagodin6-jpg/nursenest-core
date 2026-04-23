/**
 * Lessons hub list must not use Promise.race timeouts that turn slow DB into fake “empty inventory”.
 * Failures surface as explicit {@link PathwayLessonsHubPageLoadState} errors, not silent empty arrays.
 */
import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import { loadPathwayLessonsHubPageWithTelemetry } from "@/lib/exam-pathways/marketing-hub-lessons-page-fetch";
import type { PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

const ctx = {
  pathname: "/us/rn/nclex-rn/lessons",
  locale: "us",
  country: "us",
  examCode: "nclex-rn",
  pathwayId: "ca-rn-nclex-rn",
  roleTrack: "rn",
} as const;

const args = {
  pageRequested: 1,
  pageSizeRequested: 24,
  lessonContentLocale: "en",
  listOpts: undefined as { q?: string; topicSlugsIn?: string[] } | undefined,
};

test("slow lessons page fetch (>1s) still resolves ok with real payload (no silent empty)", async () => {
  const item = {
    slug: "slow-lesson",
    title: "Slow lesson",
    topic: "Topic",
    topicSlug: "infection",
    bodySystem: "cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: "Slow lesson",
    seoDescription: "Desc",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: [],
    countries: [],
  } as PathwayLessonRecord;

  const mockFetch = async () => {
    await new Promise((r) => setTimeout(r, 1100));
    const page: PathwayLessonsPageResult = {
      items: [item],
      total: 3,
      page: 1,
      pageSize: 24,
      pageCount: 1,
    };
    return page;
  };

  const { pageResult, lessonsPageLoad } = await loadPathwayLessonsHubPageWithTelemetry(
    ctx.pathwayId,
    args,
    ctx,
    mockFetch,
  );

  assert.equal(lessonsPageLoad.status, "ok");
  if (lessonsPageLoad.status === "ok") {
    assert.equal(lessonsPageLoad.sourceUsed, "primary");
    assert.ok(lessonsPageLoad.fetchDurationMs >= 1000, "duration should reflect slow path");
    assert.equal(lessonsPageLoad.responseTotal, 3);
    assert.equal(lessonsPageLoad.responseItemCount, 1);
  }
  assert.equal(pageResult.total, 3);
  assert.equal(pageResult.items.length, 1);
});

test("failed lessons page fetch returns error state (not ok-with-empty inventory)", async () => {
  const mockFetch = async () => {
    throw new Error("hub_optional_task_timeout");
  };

  const { pageResult, lessonsPageLoad } = await loadPathwayLessonsHubPageWithTelemetry(
    ctx.pathwayId,
    args,
    ctx,
    mockFetch,
  );

  assert.equal(lessonsPageLoad.status, "error");
  if (lessonsPageLoad.status === "error") {
    assert.equal(lessonsPageLoad.reason, "fetch_failed");
    assert.equal(lessonsPageLoad.timedOut, true);
  }
  assert.equal(pageResult.total, 0);
  assert.equal(pageResult.items.length, 0);
});

test("primary failure with valid snapshot returns ok + secondary (degraded inventory)", async () => {
  const item = {
    slug: "snap-lesson",
    title: "Snap",
    topic: "Topic",
    topicSlug: "infection",
    bodySystem: "cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: "Snap",
    seoDescription: "D",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: [],
    countries: [],
  } as PathwayLessonRecord;

  const snapPayload: PathwayLessonsPageResult = {
    items: [item],
    total: 1,
    page: 1,
    pageSize: 24,
    pageCount: 1,
  };

  const mockFetch = async () => {
    throw new Error("database_timeout");
  };

  const { pageResult, lessonsPageLoad } = await loadPathwayLessonsHubPageWithTelemetry(
    ctx.pathwayId,
    args,
    ctx,
    mockFetch,
    {
      readHubSnapshot: async () => ({
        schema: "nursenest.study_snapshot.v1",
        surface: "pathway_lessons_hub",
        version: "test-snap-v1",
        capturedAt: new Date().toISOString(),
        payload: snapPayload,
      }),
    },
  );

  assert.equal(lessonsPageLoad.status, "ok");
  if (lessonsPageLoad.status === "ok") {
    assert.equal(lessonsPageLoad.sourceUsed, "secondary");
    assert.equal(lessonsPageLoad.responseTotal, 1);
  }
  assert.equal(pageResult.total, 1);
  assert.equal(pageResult.items.length, 1);
});

test("fast successful empty page is ok (real zero inventory)", async () => {
  const mockFetch = async (): Promise<PathwayLessonsPageResult> => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 24,
    pageCount: 0,
  });

  const { pageResult, lessonsPageLoad } = await loadPathwayLessonsHubPageWithTelemetry(
    ctx.pathwayId,
    args,
    ctx,
    mockFetch,
  );

  assert.equal(lessonsPageLoad.status, "ok");
  if (lessonsPageLoad.status === "ok") {
    assert.equal(lessonsPageLoad.sourceUsed, "primary");
    assert.ok(lessonsPageLoad.fetchDurationMs < 500, "fast path");
    assert.equal(lessonsPageLoad.responseTotal, 0);
  }
  assert.equal(pageResult.total, 0);
});

test("Canada NP (CNPLE) pathway accepts a well-formed primary lessons payload (no invalid_payload)", async () => {
  const npCtx = {
    pathname: "/canada/np/cnple/lessons",
    locale: "canada",
    country: "canada",
    examCode: "cnple",
    pathwayId: "ca-np-cnple",
    roleTrack: "np",
  } as const;
  const row = {
    slug: "np-contract-lesson",
    title: "NP contract lesson",
    topic: "Topic",
    topicSlug: "primary-care",
    bodySystem: "cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: "NP contract lesson",
    seoDescription: "Desc",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: [],
    countries: [],
  } as PathwayLessonRecord;
  const page: PathwayLessonsPageResult = {
    items: [row],
    total: 2,
    page: 1,
    pageSize: 24,
    pageCount: 1,
    renderableAll: [row, { ...row, slug: "np-contract-lesson-b" }],
  };
  const { pageResult, lessonsPageLoad } = await loadPathwayLessonsHubPageWithTelemetry(
    "ca-np-cnple",
    args,
    npCtx,
    async () => page,
  );
  assert.equal(lessonsPageLoad.status, "ok");
  assert.equal(pageResult.total, 2);
  assert.equal(pageResult.items.length, 1);
});
