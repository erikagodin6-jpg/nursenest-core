import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ADMIN_LESSON_BATCH_TOOL,
  ADMIN_QUESTION_BATCH_JOB_TOOL,
  allLessonItemsTerminal,
  batchProgressLogDetail,
  lessonBatchProgress,
  progressFromJobResultSummary,
  questionBatchProgress,
} from "@/lib/ai/content-generation-pipeline";
import type { QuestionBatchResultSummaryV1 } from "@/lib/ai/admin-ai-question-batch";
import {
  lessonBatchItemWithDefaults,
  type LessonBatchResultSummaryV1,
} from "@/lib/lessons/admin-ai-lesson-batch";

describe("content-generation-pipeline", () => {
  it("lessonBatchProgress matches derived counts", () => {
    const summary: LessonBatchResultSummaryV1 = {
      version: 1,
      allowDuplicates: false,
      settings: {
        pathway: "NCLEX-RN",
        country: "US",
        topicDomain: "Med-Surg",
        lessonType: "disease",
        relatedCategoryIds: [],
      },
      items: [
        lessonBatchItemWithDefaults({
          itemId: "a",
          topic: "HF",
          batchTopicKey: "k1",
          status: "completed",
 }),
        lessonBatchItemWithDefaults({
          itemId: "b",
          topic: "COPD",
          batchTopicKey: "k2",
          status: "failed",
        }),
        lessonBatchItemWithDefaults({
          itemId: "c",
          topic: "DKA",
          batchTopicKey: "k3",
          status: "skipped_duplicate",
        }),
        lessonBatchItemWithDefaults({
          itemId: "d",
          topic: "PE",
          batchTopicKey: "k4",
          status: "pending",
        }),
      ],
    };
    const p = lessonBatchProgress(summary);
    assert.equal(p.kind, "lesson");
    assert.equal(p.tool, ADMIN_LESSON_BATCH_TOOL);
    assert.equal(p.total, 4);
    assert.equal(p.completed, 1);
    assert.equal(p.failed, 1);
    assert.equal(p.skippedDuplicate, 1);
    assert.equal(p.pending, 1);
    assert.equal(p.allTerminal, false);
  });

  it("questionBatchProgress counts skip flavors", () => {
    const summary: QuestionBatchResultSummaryV1 = {
      version: 1,
      allowDuplicates: false,
      settings: {
        tier: "rn",
        country: "US",
        examFamily: "NCLEX_RN",
        pathwayLabel: "RN",
        difficulty: "INTERMEDIATE",
        questionTypeMode: "auto",
        questionStyleHints: [],
        lessonTargetIds: [],
        lessonId: null,
        categoryId: null,
      },
      items: [
        {
          itemId: "1",
          topic: "Sepsis",
          batchTopicKey: "x",
          status: "completed",
        },
        {
          itemId: "2",
          topic: "Sepsis",
          batchTopicKey: "y",
          status: "skipped_duplicate",
        },
        {
          itemId: "3",
          topic: "MI",
          batchTopicKey: "z",
          status: "skipped_duplicate_stem",
        },
        {
          itemId: "4",
          topic: "Stroke",
          batchTopicKey: "w",
          status: "pending",
        },
      ],
    };
    const p = questionBatchProgress(summary);
    assert.equal(p.kind, "question");
    assert.equal(p.tool, ADMIN_QUESTION_BATCH_JOB_TOOL);
    assert.equal(p.skippedDuplicate, 1);
    assert.equal(p.skippedDuplicateStem, 1);
    assert.equal(p.completed, 1);
    assert.equal(p.pending, 1);
    assert.equal(p.allTerminal, false);
  });

  it("progressFromJobResultSummary dispatches by tool", () => {
    const lessonRaw = {
      version: 1,
      allowDuplicates: false,
      settings: {
        pathway: "NCLEX-RN",
        country: "US",
        topicDomain: "x",
        lessonType: "disease" as const,
        relatedCategoryIds: [],
      },
      items: [
        lessonBatchItemWithDefaults({
          itemId: "a",
          topic: "t",
          batchTopicKey: "k",
          status: "completed",
        }),
      ],
    };
    const q = progressFromJobResultSummary(ADMIN_LESSON_BATCH_TOOL, lessonRaw);
    assert.ok(q);
    assert.equal(q!.kind, "lesson");

    const qRaw: QuestionBatchResultSummaryV1 = {
      version: 1,
      allowDuplicates: false,
      settings: {
        tier: "rn",
        country: "US",
        examFamily: "NCLEX_RN",
        pathwayLabel: "RN",
        difficulty: "INTERMEDIATE",
        questionTypeMode: "auto",
        questionStyleHints: [],
        lessonTargetIds: [],
        lessonId: null,
        categoryId: null,
      },
      items: [],
    };
    const q2 = progressFromJobResultSummary(ADMIN_QUESTION_BATCH_JOB_TOOL, qRaw);
    assert.ok(q2);
    assert.equal(q2!.kind, "question");
    assert.equal(q2!.total, 0);
  });

  it("batchProgressLogDetail is JSON-safe shape", () => {
    const d = batchProgressLogDetail({
      kind: "lesson",
      tool: ADMIN_LESSON_BATCH_TOOL,
      total: 2,
      pending: 0,
      generating: 0,
      completed: 2,
      failed: 0,
      skippedDuplicate: 0,
      skippedDuplicateStem: 0,
      canceled: 0,
      allTerminal: true,
    });
    assert.ok(typeof d.totals === "object");
    assert.equal((d.totals as { completed: number }).completed, 2);
  });

  it("allLessonItemsTerminal", () => {
    assert.equal(
      allLessonItemsTerminal([
        lessonBatchItemWithDefaults({
          itemId: "a",
          topic: "t",
          batchTopicKey: "k",
          status: "completed",
        }),
      ]),
      true,
    );
    assert.equal(
      allLessonItemsTerminal([
        lessonBatchItemWithDefaults({
          itemId: "a",
          topic: "t",
          batchTopicKey: "k",
          status: "pending",
        }),
      ]),
      false,
    );
  });
});
