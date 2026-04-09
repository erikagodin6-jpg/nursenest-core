/**
 * Run: `npx tsx --test src/lib/lessons/admin-ai-lesson-batch.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  lessonBatchTopicKey,
  normalizeBatchTopic,
  parseTopicList,
  reviveStaleGeneratingItems,
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
        {
          itemId: "1",
          topic: "A",
          batchTopicKey: "k",
          status: "generating",
          startedAt: old,
        },
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
        {
          itemId: "1",
          topic: "A",
          batchTopicKey: "k",
          status: "generating",
          startedAt: recent,
        },
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
