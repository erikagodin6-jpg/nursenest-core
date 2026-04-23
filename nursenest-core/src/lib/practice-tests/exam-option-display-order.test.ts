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

  it("buildExamOptionDisplayOrder permutes keys so canonical correctAnswer keys stay valid", () => {
    const keys = ["opt-a", "opt-b", "opt-c", "opt-d"];
    const sessionKey = "33333333-3333-4333-8333-333333333333";
    const order = buildExamOptionDisplayOrder({ sessionKey, questionId: "q-permute", canonicalKeys: keys });
    assert.equal(order.length, keys.length);
    assert.deepEqual([...order].sort(), [...keys].sort());
    const userAnswerCanonical = "opt-b";
    assert.equal(order.includes(userAnswerCanonical), true);
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
        questionType: "SELECT_ALL_THAT_APPLY",
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
        tags: ["NO_OPTION_SHUFFLE"],
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
    assert.equal(
      shouldDisableOptionShuffleMcq({
        questionType: "MCQ",
        tags: [],
        optionTexts: ["NONE OF THE ABOVE", "A"],
      }),
      true,
    );
    assert.equal(
      shouldDisableOptionShuffleMcq({
        questionType: "MCQ",
        tags: [],
        optionTexts: ["Plain stem A", "Plain stem B", "Plain stem C"],
      }),
      false,
    );
  });

  it("shouldDisableOptionShuffleMcq catches both A and B order variants", () => {
    assert.equal(
      shouldDisableOptionShuffleMcq({
        questionType: "MCQ",
        tags: [],
        optionTexts: ["Both B and A apply"],
      }),
      true,
    );
  });
});
