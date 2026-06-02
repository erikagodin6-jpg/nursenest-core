import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveBuilderCategoryId } from "@/lib/flashcards/flashcard-builder-taxonomy";
import {
  foldExamQuestionTopicBodyGroupsIntoBuilderCounts,
  type ExamQuestionTopicBodyGroupRow,
} from "@/lib/flashcards/flashcards-exam-inventory-counts";

const PATHWAY = "ca-rn-nclex-rn";

function bruteForceCounts(rows: Array<{ bodySystem: string | null; topic: string | null }>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const q of rows) {
    const id = resolveBuilderCategoryId({
      label: q.topic?.trim() || q.bodySystem?.trim() || "General",
      topicCode: null,
      pathwayId: PATHWAY,
      deckTitle: null,
      front: "",
      back: "",
      examBodySystem: q.bodySystem,
      examTopic: q.topic,
    });
    out[id] = (out[id] ?? 0) + 1;
  }
  return out;
}

function toGroups(rows: Array<{ bodySystem: string | null; topic: string | null }>): ExamQuestionTopicBodyGroupRow[] {
  const map = new Map<string, number>();
  const key = (b: string | null, t: string | null) => `${b ?? ""}\0${t ?? ""}`;
  for (const r of rows) {
    const k = key(r.bodySystem, r.topic);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([k, n]) => {
    const [bodySystem, topic] = k.split("\0");
    return {
      bodySystem: bodySystem.length ? bodySystem : null,
      topic: topic.length ? topic : null,
      _count: { _all: n },
    };
  });
}

describe("foldExamQuestionTopicBodyGroupsIntoBuilderCounts", () => {
  it("matches per-row brute-force totals for a small synthetic pool", () => {
    const rows = [
      { bodySystem: "Cardiovascular", topic: "Heart failure" },
      { bodySystem: "Cardiovascular", topic: "Heart failure" },
      { bodySystem: "Respiratory", topic: "Asthma" },
      { bodySystem: null, topic: "Pharmacology" },
      { bodySystem: "Neurological", topic: null },
    ];
    const fromGroups = foldExamQuestionTopicBodyGroupsIntoBuilderCounts(toGroups(rows), PATHWAY);
    const brute = bruteForceCounts(rows);
    assert.deepEqual(fromGroups, brute);
  });

  it("aggregates duplicate (bodySystem, topic) buckets into one classifier call worth of weight", () => {
    const groups: ExamQuestionTopicBodyGroupRow[] = [
      { bodySystem: "GI", topic: "Liver", _count: { _all: 100 } },
    ];
    const out = foldExamQuestionTopicBodyGroupsIntoBuilderCounts(groups, PATHWAY);
    const sum = Object.values(out).reduce((a, b) => a + b, 0);
    assert.equal(sum, 100);
  });
});
