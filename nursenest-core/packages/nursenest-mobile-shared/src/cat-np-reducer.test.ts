import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { reduceNpCatPhase, type NpCatPhase } from "./cat-np-reducer";

describe("NP CAT reducer", () => {
  it("completes on sessionComplete", () => {
    let s: NpCatPhase = { kind: "idle" };
    s = reduceNpCatPhase(s, { type: "session_created", practiceTestId: "pt" });
    assert.equal(s.kind, "active");
    s = reduceNpCatPhase(s, {
      type: "answer_response",
      practiceTestId: "pt",
      body: { sessionComplete: true, nextQuestion: null },
    });
    assert.equal(s.kind, "complete");
  });
});
