import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeQuestionBodySystem,
  parsePracticeHubIdsParam,
  practiceHubIdsToCatTopicNames,
} from "@/lib/questions/normalize-question-body-system";

describe("normalizeQuestionBodySystem", () => {
  it("maps cardiovascular aliases", () => {
    assert.equal(normalizeQuestionBodySystem({ bodySystem: "Cardiac", topic: null }), "cardiovascular");
    assert.equal(normalizeQuestionBodySystem({ bodySystem: null, topic: "Angina" }), "cardiovascular");
  });

  it("maps respiratory / ABG-style topics", () => {
    assert.equal(normalizeQuestionBodySystem({ bodySystem: null, topic: "ABG Interpretation" }), "respiratory");
    assert.equal(normalizeQuestionBodySystem({ bodySystem: "Pulmonary", topic: null }), "respiratory");
  });

  it("uses linked lesson bodySystem when question fields are sparse", () => {
    assert.equal(
      normalizeQuestionBodySystem({ bodySystem: null, topic: "Misc" }, { bodySystem: "Neurological", topic: null }),
      "neurological",
    );
  });

  it("returns uncategorized when no signal", () => {
    assert.equal(normalizeQuestionBodySystem({ bodySystem: null, topic: "ZZZ-unknown-topic-zzz" }), "uncategorized");
  });
});

describe("parsePracticeHubIdsParam", () => {
  it("returns unique allowed ids and drops uncategorized", () => {
    assert.deepEqual(parsePracticeHubIdsParam("cardiovascular, respiratory ,cardiovascular"), [
      "cardiovascular",
      "respiratory",
    ]);
    assert.deepEqual(parsePracticeHubIdsParam("uncategorized,cardiovascular"), ["cardiovascular"]);
  });
});

describe("practiceHubIdsToCatTopicNames", () => {
  it("maps hub ids to CAT topic bias labels", () => {
    const names = practiceHubIdsToCatTopicNames(["renal_urinary", "maternity_reproductive"]);
    assert.deepEqual(names, ["Renal", "Maternity"]);
  });
});
