import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveAuthContinuationHint } from "./auth-study-continuation-context";

describe("resolveAuthContinuationHint", () => {
  it("returns flashcards hint for tier-scoped callback", () => {
    const hint = resolveAuthContinuationHint("/app/flashcards?pathwayId=us-rn-nclex-rn");
    assert.ok(hint);
    assert.match(hint!.headline, /flashcard/i);
    assert.match(hint!.headline, /NCLEX-RN/);
  });

  it("returns null for marketing callbacks", () => {
    assert.equal(resolveAuthContinuationHint("/pricing"), null);
    assert.equal(resolveAuthContinuationHint(null), null);
  });
});
