import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { US_NEW_GRAD_TRANSITION_PATHWAY_ID } from "@/lib/navigation/marketing-pathway-nav-destinations";

import {
  expectedNewGradPremiumModuleKeys,
  listNewGradExamPathwaysFromRegistry,
  newGradCatalogLessonCount,
} from "./new-grad-hub-program-model";

describe("New Grad hub program model", () => {
  it("registry exposes exactly one NEW_GRAD tier exam pathway", () => {
    const rows = listNewGradExamPathwaysFromRegistry();
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.id, US_NEW_GRAD_TRANSITION_PATHWAY_ID);
  });

  it("premium module matrix omits ECG and NP clinical cases for New Grad", () => {
    const k = expectedNewGradPremiumModuleKeys(false, false);
    assert.ok(!k.studyTools.includes("ecg"));
    assert.ok(!k.studyTools.includes("clinical_cases"));
    assert.ok(k.studyTools.includes("flashcards"));
    assert.ok(k.newGradStrip.includes("transition"));
    assert.ok(k.newGradStrip.includes("clinical_judgment"));
    assert.ok(k.newGradStrip.includes("new_grad_pathway_cat"));
    assert.ok(k.newGradStrip.includes("skills_refresher"));
  });

  it("catalog reports a positive lesson count for the transition pathway", () => {
    const { count, source } = newGradCatalogLessonCount();
    assert.equal(source, "catalog");
    assert.ok(count > 0);
  });
});
