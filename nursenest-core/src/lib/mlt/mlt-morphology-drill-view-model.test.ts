import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { mltRbcMorphologyReference } from "@/content/morphology/mlt-rbc-morphology-reference";
import { buildMltMorphologyDrillViewModel } from "./mlt-morphology-drill-view-model";

describe("MLS/MLT morphology drill view model", () => {
  it("builds drill cards from RBC morphology reference metadata", () => {
    const viewModel = buildMltMorphologyDrillViewModel();

    assert.equal(viewModel.domain, "rbc-morphology");
    assert.equal(viewModel.totalCards, mltRbcMorphologyReference.length);
    assert.equal(viewModel.drillCards.length, mltRbcMorphologyReference.length);
    assert.equal(viewModel.comparisonCards.length, mltRbcMorphologyReference.length);
  });

  it("keeps every drill card workflow-aware and remediation-ready", () => {
    const viewModel = buildMltMorphologyDrillViewModel();

    for (const card of viewModel.drillCards) {
      assert.ok(card.prompt.includes("workflow implication"), `${card.id} prompt must include workflow reasoning`);
      assert.ok(card.answer.length > 3, `${card.id} must include an answer`);
      assert.ok(card.associatedConditions.length >= 1, `${card.id} must include associated conditions`);
      assert.ok(card.differentialMorphologies.length >= 1, `${card.id} must include differential morphologies`);
      assert.ok(card.workflowImplications.length >= 1, `${card.id} must include workflow implications`);
      assert.ok(card.escalationTriggers.length >= 1, `${card.id} must include escalation triggers`);
      assert.ok(card.morphologyTags.length >= 1, `${card.id} must include morphology tags`);
      assert.ok(["intro", "core", "exam"].includes(card.difficulty), `${card.id} difficulty is invalid`);
    }
  });

  it("creates comparison cards for morphology differential reasoning", () => {
    const viewModel = buildMltMorphologyDrillViewModel();

    for (const card of viewModel.comparisonCards) {
      assert.ok(card.id.endsWith("-comparison"), `${card.id} must use comparison id suffix`);
      assert.ok(card.primaryMorphology.length > 3, `${card.id} must name the primary morphology`);
      assert.ok(card.compareWith.length >= 1, `${card.id} must include comparison targets`);
      assert.match(card.teachingPoint, /Distinguish/i, `${card.id} teaching point must reinforce differential reasoning`);
      assert.ok(card.escalationTriggers.length >= 1, `${card.id} must preserve escalation triggers`);
    }
  });

  it("classifies high-risk morphology as exam-level difficulty", () => {
    const viewModel = buildMltMorphologyDrillViewModel();
    const schistocyte = viewModel.drillCards.find((card) => card.id === "schistocyte");

    assert.ok(schistocyte, "schistocyte drill card must exist");
    assert.equal(schistocyte?.difficulty, "exam");
    assert.ok(schistocyte?.escalationTriggers.some((trigger) => /DIC|TTP|thrombocytopenia|critical|high/i.test(trigger)));
  });

  it("reports high escalation morphology count for adaptive prioritization", () => {
    const viewModel = buildMltMorphologyDrillViewModel();

    assert.ok(viewModel.highEscalationCount >= 1);
    assert.ok(viewModel.highEscalationCount <= viewModel.totalCards);
  });
});
