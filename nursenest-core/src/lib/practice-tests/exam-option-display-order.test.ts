import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildExamOptionDisplayOrder,
  shouldDisableOptionShuffleMcq,
} from "@/lib/practice-tests/exam-option-display-order";

describe("exam-option-display-order", () => {
  it("buildExamOptionDisplayOrder is stable for the same session + question", () => {
    const keys = ["a", "b", "c", "d"];
    const o1 = buildExamOptionDisplayOrder({ sessionKey: "salt-one", questionId: "q1", canonicalKeys: keys });
    const o2 = buildExamOptionDisplayOrder({ sessionKey: "salt-one", questionId: "q1", canonicalKeys: keys });
    assert.deepEqual(o1, o2);
    assert.deepEqual(new Set(o1), new Set(keys));
  });

  it("buildExamOptionDisplayOrder differs across session keys", () => {
    const keys = ["a", "b", "c", "d"];
    const o1 = buildExamOptionDisplayOrder({ sessionKey: "session-aaa", questionId: "q1", canonicalKeys: keys });
    const o2 = buildExamOptionDisplayOrder({ sessionKey: "session-bbb", questionId: "q1", canonicalKeys: keys });
    assert.notDeepEqual(o1, o2);
  });

  it("shouldDisableOptionShuffleMcq respects tags and SATA", () => {
    assert.equal(
      shouldDisableOptionShuffleMcq({
        questionType: "SATA",
        tags: [],
        optionTexts: ["x", "y"],
      }),
      true,
    );
    assert.equal(
      shouldDisableOptionShuffleMcq({
        questionType: "MCQ",
        tags: ["disable_option_shuffle"],
        optionTexts: ["x", "y"],
      }),
      true,
    );
    assert.equal(
      shouldDisableOptionShuffleMcq({
        questionType: "MCQ",
        tags: [],
        optionTexts: ["All of the above", "Other"],
      }),
      true,
    );
  });
});
