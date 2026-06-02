import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { NP_COMPETENCY_CROSSWALK, NP_COMPETENCY_DOMAINS, validateNpCompetencyFramework } from "./np-competency-framework";
import {
  NP_ADVANCED_ASSESSMENT_ACADEMY,
  NP_ADVANCED_PHARMACOLOGY_ACADEMY,
  summarizeNpPharmacologyTargets,
  validateNpAdvancedPracticeAcademies,
} from "./np-advanced-practice-academies";
import { NP_DIAGNOSTIC_REASONING_WORKFLOWS, validateNpDiagnosticReasoningEngine } from "./np-diagnostic-reasoning-engine";
import {
  NP_ADVANCED_CASE_LIBRARY_TARGETS,
  NP_OSCE_PREPARATION_DOMAINS,
  NP_READINESS_PASSPORT_DOMAINS,
  NP_SPECIALTY_READINESS_MODELS,
  validateNpAdvancedCaseOsceReadiness,
} from "./np-advanced-case-osce-readiness";
import { NP_MARKETING_SCREENSHOT_LIBRARY, validateNpMarketingScreenshotLibrary } from "./np-marketing-asset-library";

describe("NP advanced practice ecosystem phase 2", () => {
  it("maps all NP certifications across the shared competency domains", () => {
    assert.deepEqual(validateNpCompetencyFramework(), []);
    assert.equal(NP_COMPETENCY_DOMAINS.length, 10);
    assert.equal(NP_COMPETENCY_CROSSWALK.length, 9);
    for (const row of NP_COMPETENCY_CROSSWALK) {
      assert.equal(Object.keys(row.weights).length, NP_COMPETENCY_DOMAINS.length);
    }
  });

  it("defines hidden advanced pharmacology and assessment academies at requested scale", () => {
    assert.deepEqual(validateNpAdvancedPracticeAcademies(), []);
    const totals = summarizeNpPharmacologyTargets();
    assert.ok(totals.lessons >= 500);
    assert.ok(totals.flashcards >= 5000);
    assert.ok(totals.questions >= 3000);
    assert.equal(NP_ADVANCED_PHARMACOLOGY_ACADEMY.length, 10);
    assert.equal(NP_ADVANCED_ASSESSMENT_ACADEMY.length, 10);
  });

  it("defines diagnostic reasoning workflows for common NP presentations", () => {
    assert.deepEqual(validateNpDiagnosticReasoningEngine(), []);
    const concerns = new Set(NP_DIAGNOSTIC_REASONING_WORKFLOWS.map((workflow) => workflow.chiefConcern));
    for (const concern of ["Chest Pain", "Shortness Of Breath", "Syncope", "Headache", "Abdominal Pain", "Fatigue", "Depression", "Anxiety", "Fever", "Weight Loss"]) {
      assert.ok(concerns.has(concern));
    }
  });

  it("targets 1,000+ cases and defines OSCE/readiness passport foundations", () => {
    assert.deepEqual(validateNpAdvancedCaseOsceReadiness(), []);
    assert.ok(NP_ADVANCED_CASE_LIBRARY_TARGETS.reduce((sum, target) => sum + target.caseTarget, 0) >= 1000);
    assert.equal(NP_OSCE_PREPARATION_DOMAINS.length, 7);
    assert.equal(NP_READINESS_PASSPORT_DOMAINS.length, 7);
    assert.equal(NP_SPECIALTY_READINESS_MODELS.length, 9);
  });

  it("keeps all hidden academy, readiness, and marketing screenshot assets unpublished", () => {
    assert.deepEqual(validateNpMarketingScreenshotLibrary(), []);
    assert.equal(NP_MARKETING_SCREENSHOT_LIBRARY.length, 63);
    for (const asset of NP_MARKETING_SCREENSHOT_LIBRARY) {
      assert.equal(asset.publicReferenceAllowed, false);
      assert.equal(asset.adminOnly, true);
      assert.match(asset.filePath, /^\/images\/np-pathways\//);
    }
    for (const item of [
      ...NP_ADVANCED_PHARMACOLOGY_ACADEMY,
      ...NP_ADVANCED_ASSESSMENT_ACADEMY,
      ...NP_DIAGNOSTIC_REASONING_WORKFLOWS,
      ...NP_ADVANCED_CASE_LIBRARY_TARGETS,
      ...NP_OSCE_PREPARATION_DOMAINS,
      ...NP_SPECIALTY_READINESS_MODELS,
    ]) {
      assert.equal(item.published, false);
      assert.equal(item.visibleInNavigation, false);
      assert.equal(item.launchReady, false);
      assert.equal(item.indexable, false);
      assert.equal(item.adminOnly, true);
    }
  });
});
