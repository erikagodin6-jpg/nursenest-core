/**
 * CNPLE Slice Content — Product Regression Contract
 *
 * Guards the NP/CNPLE hub from drifting back into a generic, flat feature grid.
 * The learner-facing order must reflect the actual study progression:
 *   Lessons → Practice Questions → Flashcards → Simulation → Practice Exam
 *
 * Run:
 *   node --import tsx --test src/lib/exam-pathways/cnple-slice-content.contract.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  buildNursingTierHubContent,
  resolveNursingTierHubActionHref,
} from "@/lib/marketing/nursing-tier-hub-content";

const pathway = getExamPathwayById("ca-np-cnple");
assert.ok(pathway, "ca-np-cnple pathway must be registered");
const content = buildNursingTierHubContent(pathway);

describe("CNPLE hub slices — ordered by actual NP study progression", () => {
  it("orders action cards as Lessons → Practice Questions → Flashcards → Simulation → Practice Exam", () => {
    assert.deepEqual(
      content.actions.map((action) => action.label),
      ["Lessons", "Practice Questions", "Flashcards", "Simulation", "Practice Exam"],
      "CNPLE hub actions must follow learner progression, not a generic feature-grid order",
    );
  });

  it("keeps Practice Questions ahead of Flashcards because applied reasoning is the primary work block", () => {
    const labels = content.actions.map((action) => action.label);
    assert.ok(
      labels.indexOf("Practice Questions") < labels.indexOf("Flashcards"),
      "Practice Questions must appear before Flashcards for NP/CNPLE prep",
    );
  });

  it("routes the Simulation card to the canonical /simulation page", () => {
    const simulation = content.actions.find((action) => action.label === "Simulation");
    assert.ok(simulation, "Simulation card must exist");
    assert.equal(
      resolveNursingTierHubActionHref(pathway, simulation),
      "/canada/np/cnple/simulation",
      "CNPLE Simulation must route to /simulation, not /cat",
    );
  });
});

describe("CNPLE hub slices — copy is NP-specific and not generic", () => {
  it("frames the pathway as Canadian NP clinical reasoning, not a generic question bank", () => {
    assert.match(content.intro, /Canadian NP clinical reasoning/i);
    assert.match(content.description, /full preparation pathway/i);
    assert.match(content.includedNote, /Canadian NP lessons/i);
  });

  it("explains the recommended sequence in startHere", () => {
    assert.match(content.startHere, /Lessons.*Practice Questions.*Flashcards.*Simulation.*Practice Exam/i);
  });

  it("explains LOFT and explicitly rejects CAT adaptive shutdown", () => {
    const simulation = content.actions.find((action) => action.label === "Simulation");
    assert.ok(simulation, "Simulation card must exist");
    assert.match(simulation.description, /LOFT linear simulation/i);
    assert.match(simulation.description, /No CAT adaptive shutdown/i);
  });

  it("marks Practice Questions as the primary NP work block", () => {
    const practice = content.actions.find((action) => action.label === "Practice Questions");
    assert.ok(practice, "Practice Questions card must exist");
    assert.match(practice.description, /Primary work block/i);
    assert.match(practice.description, /CNPLE-tagged/i);
    assert.match(practice.description, /Canadian-aligned NP/i);
  });

  it("prevents generic fallback descriptions from being used for CNPLE actions", () => {
    const descriptions = content.actions.map((action) => action.description).join("\n");
    assert.doesNotMatch(descriptions, /Review concepts by topic\./);
    assert.doesNotMatch(descriptions, /Drill by topic or weakness\./);
    assert.doesNotMatch(descriptions, /Strengthen recall quickly\./);
  });
});
