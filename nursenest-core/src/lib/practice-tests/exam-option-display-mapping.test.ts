/**
 * Contract: exam option shuffle permutes **canonical** option keys for display.
 * Stored answers / PATCH payloads must remain canonical keys — never display indices.
 * Runner mirrors this with `optsOrderCanonical` / `optsOrderDisplay` in the practice test client.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildExamOptionDisplayOrder } from "@/lib/practice-tests/exam-option-display-order";

function displayRowForOrder(optsCanonical: string[], optsDisplay: string[], order: string[]): string[] {
  const mapCanonToDisplay = new Map(optsCanonical.map((k, i) => [k, optsDisplay[i] ?? k]));
  return order.map((k) => mapCanonToDisplay.get(k) ?? k);
}

describe("exam option display row mirrors canonical identity", () => {
  it("permutes display labels with canonical keys (same multiset as server order)", () => {
    const optsCanonical = ["opt-a", "opt-b", "opt-c", "opt-d"];
    const optsDisplay = ["Alpha", "Bravo", "Charlie", "Delta"];
    const order = buildExamOptionDisplayOrder({
      sessionKey: "session-11111111-1111-4111-8111-111111111111",
      questionId: "q-1",
      canonicalKeys: optsCanonical,
    });
    const row = displayRowForOrder(optsCanonical, optsDisplay, order);
    assert.deepEqual(new Set(row), new Set(optsDisplay));
    assert.equal(row.length, optsDisplay.length);
    const userAnswerCanonical = order[2]!;
    assert.equal(optsCanonical.includes(userAnswerCanonical), true);
    const letterIndex = 2;
    assert.equal(order[letterIndex], userAnswerCanonical);
  });
});
