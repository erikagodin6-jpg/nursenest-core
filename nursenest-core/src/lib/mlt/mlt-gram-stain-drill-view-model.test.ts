import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { mltGramStainReference } from "@/content/morphology/mlt-gram-stain-reference";
import { buildMltGramStainDrillViewModel } from "./mlt-gram-stain-drill-view-model";

describe("MLS/MLT Gram stain drill view model", () => {
  it("builds drill cards from Gram stain reference metadata", () => {
    const viewModel = buildMltGramStainDrillViewModel();

    assert.equal(viewModel.domain, "gram-stain-morphology");
    assert.equal(viewModel.totalCards, mltGramStainReference.length);
    assert.equal(viewModel.drillCards.length, mltGramStainReference.length);
    assert.equal(viewModel.comparisonCards.length, mltGramStainReference.length);
  });

  it("keeps every Gram stain drill workflow-aware and source-aware", () => {
    const viewModel = buildMltGramStainDrillViewModel();

    for (const card of viewModel.drillCards) {
      assert.ok(card.prompt.includes("workflow concern"), `${card.id} prompt must include workflow reasoning`);
      assert.ok(card.answer.length > 6, `${card.id} must include an answer`);
      assert.ok(card.morphology.length > 2, `${card.id} must include morphology`);
      assert.ok(card.arrangement.length > 2, `${card.id} must include arrangement`);
      assert.ok(card.commonOrganismGroups.length >= 1, `${card.id} must include organism groups`);
      assert.ok(card.specimenContext.length >= 1, `${card.id} must include specimen context`);
      assert.ok(card.differentialPatterns.length >= 1, `${card.id} must include differentials`);
      assert.ok(card.workflowImplications.length >= 1, `${card.id} must include workflow implications`);
      assert.ok(card.escalationTriggers.length >= 1, `${card.id} must include escalation triggers`);
      assert.ok(card.gramStainTags.length >= 1, `${card.id} must include Gram stain tags`);
      assert.ok(["intro", "core", "exam"].includes(card.difficulty), `${card.id} difficulty is invalid`);
    }
  });

  it("creates comparison cards for microbiology differential reasoning", () => {
    const viewModel = buildMltGramStainDrillViewModel();

    for (const card of viewModel.comparisonCards) {
      assert.ok(card.id.endsWith("-comparison"), `${card.id} must use comparison id suffix`);
      assert.ok(card.primaryPattern.length > 6, `${card.id} must name the primary pattern`);
      assert.ok(card.compareWith.length >= 1, `${card.id} must include comparison targets`);
      assert.ok(card.sourceContext.length >= 1, `${card.id} must include source context`);
      assert.match(card.teachingPoint, /Compare/i, `${card.id} teaching point must reinforce differential reasoning`);
      assert.ok(card.escalationTriggers.length >= 1, `${card.id} must preserve escalation triggers`);
    }
  });

  it("classifies sterile-site Gram stain patterns as exam-level difficulty", () => {
    const viewModel = buildMltGramStainDrillViewModel();
    const bloodCultureClusterPattern = viewModel.drillCards.find((card) => card.id === "gram-positive-cocci-clusters");

    assert.ok(bloodCultureClusterPattern, "Gram-positive cocci clusters drill card must exist");
    assert.equal(bloodCultureClusterPattern?.difficulty, "exam");
    assert.ok(
      bloodCultureClusterPattern?.escalationTriggers.some((trigger) => /blood culture|bacteremia|sterile|positive/i.test(trigger)),
    );
  });

  it("reports sterile-site escalation count for adaptive prioritization", () => {
    const viewModel = buildMltGramStainDrillViewModel();

    assert.ok(viewModel.sterileSiteEscalationCount >= 1);
    assert.ok(viewModel.sterileSiteEscalationCount <= viewModel.totalCards);
  });
});
