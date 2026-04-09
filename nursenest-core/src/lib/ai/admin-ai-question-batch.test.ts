/**
 * Run: `npx tsx --test src/lib/ai/admin-ai-question-batch.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseQuestionBatchTopicList,
  questionBatchTopicKey,
  reviveStaleQuestionBatchItems,
  type QuestionBatchSettings,
} from "./admin-ai-question-batch";

const baseSettings = (): QuestionBatchSettings => ({
  tier: "rn",
  country: "US",
  examFamily: "NCLEX_RN",
  pathwayLabel: "RN",
  difficulty: "INTERMEDIATE",
  questionTypeMode: "auto",
  questionStyleHints: ["labs"],
  lessonTargetIds: [],
  lessonId: null,
  categoryId: null,
});

describe("parseQuestionBatchTopicList", () => {
  it("dedupes and splits", () => {
    const out = parseQuestionBatchTopicList("Topic One\ntopic one\nTopic Two");
    assert.deepEqual(out, ["Topic One", "Topic Two"]);
  });
});

describe("questionBatchTopicKey", () => {
  it("changes when tier changes", () => {
    const s = baseSettings();
    const a = questionBatchTopicKey("Sepsis", s);
    const b = questionBatchTopicKey("Sepsis", { ...s, tier: "np" });
    assert.notEqual(a, b);
  });
});

describe("reviveStaleQuestionBatchItems", () => {
  it("resets stale generating", () => {
    const old = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { summary, mutated } = reviveStaleQuestionBatchItems({
      version: 1,
      allowDuplicates: false,
      settings: baseSettings(),
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
});
