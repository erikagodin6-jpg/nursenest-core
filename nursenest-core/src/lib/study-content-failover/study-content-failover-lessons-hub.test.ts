import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import type { PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import { loadPathwayLessonsHubPageWithTelemetry } from "@/lib/exam-pathways/marketing-hub-lessons-page-fetch";
import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";

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

test("primary failure uses secondary snapshot with same page contract", async () => {
  const page: PathwayLessonsPageResult = {
    items: [],
    total: 0,
    page: 1,
    pageSize: 24,
    pageCount: 0,
  };
  const envelope: StudyPublishedSnapshotEnvelope<PathwayLessonsPageResult> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "pathway_lessons_hub",
    version: "snap-v1",
    capturedAt: new Date(Date.now() - 60_000).toISOString(),
    payload: page,
  };

  const { pageResult, lessonsPageLoad, snapshotDiagnostics } = await loadPathwayLessonsHubPageWithTelemetry(
    ctx.pathwayId,
    args,
    ctx,
    async () => {
      throw new Error("primary_db_down");
    },
    {
      readHubSnapshot: async () => envelope,
    },
  );

  assert.equal(lessonsPageLoad.status, "ok");
  if (lessonsPageLoad.status !== "ok") throw new Error("expected ok");
  assert.equal(lessonsPageLoad.sourceUsed, "secondary");
  assert.equal(lessonsPageLoad.snapshotVersion, "snap-v1");
  assert.ok((lessonsPageLoad.snapshotAgeMs ?? 0) >= 59_000);
  assert.equal(pageResult.total, 0);
  assert.equal(snapshotDiagnostics.snapshotUsed, true);
  assert.equal(snapshotDiagnostics.snapshotRejected, false);
});

test("primary failure without secondary remains error (distinct from true empty via snapshot)", async () => {
  const { lessonsPageLoad, snapshotDiagnostics } = await loadPathwayLessonsHubPageWithTelemetry(
    ctx.pathwayId,
    args,
    ctx,
    async () => {
      throw new Error("primary_db_down");
    },
    { readHubSnapshot: async () => null },
  );
  assert.equal(lessonsPageLoad.status, "error");
  assert.equal(snapshotDiagnostics.snapshotAttempted, true);
});
