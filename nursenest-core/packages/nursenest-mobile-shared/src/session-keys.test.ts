import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NN_SECURE_PREFIX,
  flashcardDeckResumeKey,
  npCatResumeKey,
  pathwaySelectionKey,
  practiceTestResumeKey,
} from "./session-keys";

describe("session-keys", () => {
  it("uses stable prefix", () => {
    assert.equal(NN_SECURE_PREFIX.startsWith("nn."), true);
  });

  it("produces deterministic keys", () => {
    assert.equal(flashcardDeckResumeKey("deck1"), `${NN_SECURE_PREFIX}.flashcards.deck:deck1`);
    assert.equal(practiceTestResumeKey("pt_1"), `${NN_SECURE_PREFIX}.practiceTest:pt_1`);
    assert.equal(npCatResumeKey("pt_1"), `${NN_SECURE_PREFIX}.cat.np.practiceTest:pt_1`);
    assert.equal(pathwaySelectionKey(), `${NN_SECURE_PREFIX}.pathwayId`);
  });
});
