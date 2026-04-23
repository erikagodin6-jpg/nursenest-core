import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { selectNextQuestion, type CatPoolRow } from "@/lib/exams/cat-engine";

function pool(): CatPoolRow[] {
  return [
    {
      id: "q-a",
      difficulty: 3,
      bodySystem: "Cardiac",
      topic: "HF",
      nclexClientNeedsCategory: "safe-effective",
    },
    {
      id: "q-b",
      difficulty: 3,
      bodySystem: "Neuro",
      topic: "Stroke",
      nclexClientNeedsCategory: "safe-effective",
    },
    {
      id: "q-c",
      difficulty: 3,
      bodySystem: "GI",
      topic: "Liver",
      nclexClientNeedsCategory: "health-promotion",
    },
  ];
}

describe("selectNextQuestion sessionPickSalt", () => {
  it("tie-break among equal-score rows changes with sessionPickSalt", () => {
    const p = pool();
    const used = new Set<string>();
    const delivered = new Map<string, number>();
    const weights: Record<string, number> = { "safe-effective": 0.5, "health-promotion": 0.5 };
    const a = selectNextQuestion(p, used, 3, delivered, null, {
      blueprintWeights: weights,
      sessionPickSalt: "aaaaaaaaaaaaaaaa",
    }).selected?.id;
    const b = selectNextQuestion(p, used, 3, delivered, null, {
      blueprintWeights: weights,
      sessionPickSalt: "bbbbbbbbbbbbbbbb",
    }).selected?.id;
    assert.ok(a && b);
    assert.notEqual(a, b);
  });
});
