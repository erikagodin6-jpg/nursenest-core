/**
 * Run: `npx tsx --test src/lib/lessons/admin-ai-lesson-batch.test.ts`
 */
import assert from "node:assert/strict";
import { JobStatus } from "@prisma/client";
import { describe, it } from "node:test";
import {
  computeBatchDerivedSummary,
  escapeLessonBatchCsvField,
  formatLessonBatchCsv,
  isTerminalBatchStatus,
  lessonBatchItemWithDefaults,
  lessonBatchTopicKey,
  normalizeBatchTopic,
  parseTopicList,
  resolveLessonBatchDerived,
  reviveStaleGeneratingItems,
  sanitizeLessonBatchError,
  staleGeneratingReviveTargetQueueStatus,
} from "./admin-ai-lesson-batch";

describe("parseTopicList", () => {
  it("dedupes case-insensitively and preserves first casing", () => {
    const out = parseTopicList("AKI basics\naki basics\nHeart failure");
    assert.deepEqual(out, ["AKI basics", "Heart failure"]);
  });

  it("splits on commas and semicolons", () => {
    const out = parseTopicList("Topic Alpha, Topic Beta; Topic Gamma");
    assert.deepEqual(out, ["Topic Alpha", "Topic Beta", "Topic Gamma"]);
  });
});

describe("lessonBatchTopicKey", () => {
  it("is stable for normalized topic", () => {
    const a = lessonBatchTopicKey("  Heart Failure ", "NCLEX-RN", "US", "disease");
    const b = lessonBatchTopicKey("heart failure", "NCLEX-RN", "US", "disease");
    assert.equal(a, b);
  });

  it("differs when pathway changes", () => {
    const a = lessonBatchTopicKey("Sepsis", "NCLEX-RN", "US", "disease");
    const b = lessonBatchTopicKey("Sepsis", "NCLEX-PN", "US", "disease");
    assert.notEqual(a, b);
  });
});

describe("reviveStaleGeneratingItems", () => {
  it("resets stale generating rows to pending", () => {
    const old = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { summary, mutated } = reviveStaleGeneratingItems({
      version: 1,
      allowDuplicates: false,
      settings: {
        pathway: "NCLEX-RN",
        country: "US",
        topicDomain: "x",
        lessonType: "disease",
        relatedCategoryIds: [],
      },
      items: [
        lessonBatchItemWithDefaults({
          itemId: "1",
          topic: "A",
          batchTopicKey: "k",
          status: "generating",
          startedAt: old,
        }),
      ],
    });
    assert.equal(mutated, true);
    assert.equal(summary.items[0]?.status, "pending");
  });

  it("leaves fresh generating alone", () => {
    const recent = new Date().toISOString();
    const { mutated } = reviveStaleGeneratingItems({
      version: 1,
      allowDuplicates: false,
      settings: {
        pathway: "NCLEX-RN",
        country: "US",
        topicDomain: "x",
        lessonType: "disease",
        relatedCategoryIds: [],
      },
      items: [
        lessonBatchItemWithDefaults({
          itemId: "1",
          topic: "A",
          batchTopicKey: "k",
          status: "generating",
          startedAt: recent,
        }),
      ],
    });
    assert.equal(mutated, false);
  });
});

describe("normalizeBatchTopic", () => {
  it("trims and collapses whitespace", () => {
    assert.equal(normalizeBatchTopic("  a   b  "), "a b");
  });
});

describe("resolveLessonBatchDerived", () => {
  it("returns embedded derived when set", () => {
    const embedded = {
      total: 2,
      pending: 0,
      generating: 0,
      completed: 2,
      failed: 0,
      skipped_duplicate: 0,
      canceled: 0,
      remaining: 0,
      allTerminal: true,
    };
    const summary = {
      version: 1 as const,
      allowDuplicates: false,
      settings: {
        pathway: "NCLEX-RN" as const,
        country: "US" as const,
        topicDomain: "x",
        lessonType: "disease" as const,
        relatedCategoryIds: [] as string[],
      },
      derived: embedded,
      items: [
        lessonBatchItemWithDefaults({ itemId: "a", topic: "t", batchTopicKey: "k", status: "pending" }),
        lessonBatchItemWithDefaults({ itemId: "b", topic: "u", batchTopicKey: "k", status: "pending" }),
      ],
    };
    assert.deepEqual(resolveLessonBatchDerived(summary), embedded);
  });

  it("computes from items when derived omitted", () => {
    const summary = {
      version: 1 as const,
      allowDuplicates: false,
      settings: {
        pathway: "NCLEX-RN" as const,
        country: "US" as const,
        topicDomain: "x",
        lessonType: "disease" as const,
        relatedCategoryIds: [] as string[],
      },
      items: [lessonBatchItemWithDefaults({ itemId: "a", topic: "t", batchTopicKey: "k", status: "completed" })],
    };
    const d = resolveLessonBatchDerived(summary);
    assert.equal(d.total, 1);
    assert.equal(d.completed, 1);
    assert.equal(d.allTerminal, true);
  });
});

describe("staleGeneratingReviveTargetQueueStatus", () => {
  it("uses CANCELLED when the job was canceled", () => {
    assert.equal(staleGeneratingReviveTargetQueueStatus(JobStatus.CANCELLED), "CANCELLED");
  });

  it("uses PENDING for runnable jobs", () => {
    assert.equal(staleGeneratingReviveTargetQueueStatus(JobStatus.RUNNING), "PENDING");
  });
});

describe("computeBatchDerivedSummary", () => {
  it("counts terminal states and remaining", () => {
    const d = computeBatchDerivedSummary([
      lessonBatchItemWithDefaults({ itemId: "1", topic: "a", batchTopicKey: "k", status: "completed" }),
      lessonBatchItemWithDefaults({ itemId: "2", topic: "b", batchTopicKey: "k", status: "failed" }),
      lessonBatchItemWithDefaults({ itemId: "3", topic: "c", batchTopicKey: "k", status: "pending" }),
      lessonBatchItemWithDefaults({ itemId: "4", topic: "d", batchTopicKey: "k", status: "skipped_duplicate" }),
      lessonBatchItemWithDefaults({ itemId: "5", topic: "e", batchTopicKey: "k", status: "canceled" }),
    ]);
    assert.equal(d.total, 5);
    assert.equal(d.pending, 1);
    assert.equal(d.completed, 1);
    assert.equal(d.failed, 1);
    assert.equal(d.skipped_duplicate, 1);
    assert.equal(d.canceled, 1);
    assert.equal(d.remaining, 1);
    assert.equal(d.allTerminal, false);
  });

  it("allTerminal when every row is terminal", () => {
    const d = computeBatchDerivedSummary([
      lessonBatchItemWithDefaults({ itemId: "1", topic: "a", batchTopicKey: "k", status: "completed" }),
      lessonBatchItemWithDefaults({ itemId: "2", topic: "b", batchTopicKey: "k", status: "skipped_duplicate" }),
    ]);
    assert.equal(d.allTerminal, true);
    assert.equal(d.remaining, 0);
  });
});

describe("isTerminalBatchStatus", () => {
  it("treats canceled as terminal", () => {
    assert.equal(isTerminalBatchStatus("canceled"), true);
  });
});

describe("sanitizeLessonBatchError", () => {
  it("redacts sk- style tokens", () => {
    const s = sanitizeLessonBatchError("OpenAI error sk-abc123456789012345678901234");
    assert.ok(!s.includes("sk-abc"));
    assert.ok(s.includes("redacted"));
  });
});

describe("formatLessonBatchCsv", () => {
  it("includes required columns and escapes commas", () => {
    const csv = formatLessonBatchCsv(
      "job-1",
      [
        lessonBatchItemWithDefaults({
          itemId: "u1",
          topic: 'Hello, "world"',
          normalizedTopic: "hello, \"world\"",
          batchTopicKey: "abc123",
          status: "completed",
          position: 0,
          attemptCount: 2,
          startedAt: "2026-01-01T00:00:00.000Z",
          completedAt: "2026-01-01T00:01:00.000Z",
          skippedAt: null,
          draftId: "d1",
          generatedDraftTitle: "Title",
        }),
      ],
      {
        pathway: "NCLEX-RN",
        country: "US",
        topicDomain: "renal",
        lessonType: "disease",
        relatedCategoryIds: [],
      },
    );
    const lines = csv.trim().split("\n");
    assert.equal(lines.length, 2);
    assert.ok(lines[0]!.includes("jobId"));
    assert.ok(lines[0]!.includes("existingDraftId"));
    assert.ok(lines[0]!.includes("batchTopicKey"));
    assert.ok(lines[1]!.includes("job-1"));
    assert.ok(lines[1]!.includes("abc123"));
    assert.ok(lines[1]!.includes('"')); // quoted field
  });

  it("prefixes formula-like topic values to reduce CSV injection", () => {
    const esc = escapeLessonBatchCsvField("=cmd|'/c calc'!A0");
    assert.ok(esc.startsWith("'"));
  });
});
