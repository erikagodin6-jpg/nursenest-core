import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeQuestionBodySystem,
  parsePracticeHubIdsParam,
  practiceHubIdsToCatTopicNames,
} from "@/lib/questions/normalize-question-body-system";

describe("normalizeQuestionBodySystem", () => {
  it("maps requested NCLEX hub body-system signals without changing hub ids", () => {
    const cases: Array<[Parameters<typeof normalizeQuestionBodySystem>[0], ReturnType<typeof normalizeQuestionBodySystem>]> = [
      [{ bodySystem: "Cardiac", topic: null }, "cardiovascular"],
      [{ bodySystem: null, topic: "Angina" }, "cardiovascular"],
      [{ bodySystem: "Pharmacology", topic: "beta blocker adverse effects" }, "pharmacology"],
      [{ bodySystem: null, topic: "ABG Interpretation" }, "respiratory"],
      [{ bodySystem: "Pulmonary", topic: null }, "respiratory"],
      [{ bodySystem: null, topic: "Postpartum hemorrhage" }, "maternity_reproductive"],
      [{ bodySystem: null, topic: "Pediatric dehydration" }, "pediatrics"],
      [{ bodySystem: null, topic: "Therapeutic communication in depression" }, "mental_health"],
      [{ bodySystem: "Multisystem", topic: "eating-disorders" }, "mental_health"],
      [{ bodySystem: null, topic: "Vital signs and patient safety" }, "fundamentals_safety"],
      [{ bodySystem: null, topic: "Delegation and prioritization" }, "leadership_prioritization"],
      [{ bodySystem: "Multisystem", topic: "five-rights-of-delegation" }, "leadership_prioritization"],
      [{ bodySystem: "Multisystem", topic: "informed-consent" }, "leadership_prioritization"],
      [{ bodySystem: null, topic: "Endocrine insulin teaching" }, "endocrine"],
      [{ bodySystem: null, topic: "Renal dialysis access" }, "renal_urinary"],
      [{ bodySystem: null, topic: "Stroke assessment" }, "neurological"],
      [{ bodySystem: null, topic: "GI bleed and liver disease" }, "gastrointestinal"],
      [{ bodySystem: null, topic: "Isolation precautions for infection control" }, "immune_infection"],
      [{ bodySystem: null, topic: "Fracture mobility plan" }, "musculoskeletal"],
      [{ bodySystem: null, topic: "Wound and pressure injury care" }, "integumentary"],
    ];

    for (const [input, expected] of cases) {
      assert.equal(normalizeQuestionBodySystem(input), expected, JSON.stringify(input));
    }
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

  it("keeps labs and other module-only generic labels out of broad false-positive body-system buckets", () => {
    assert.equal(normalizeQuestionBodySystem({ bodySystem: "Labs", topic: "Lab values reference" }), "uncategorized");
    assert.equal(normalizeQuestionBodySystem({ bodySystem: null, topic: "Other mixed review" }), "uncategorized");
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
