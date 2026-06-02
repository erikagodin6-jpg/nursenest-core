import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GLOBAL_CLINICAL_CORE_REGISTRY,
  GLOBAL_INHERITANCE_REQUIRED_SEQUENCE,
  GLOBAL_REUSE_TARGETS,
  INTERNATIONAL_EXPANSION_OVERLAY_PRIORITY,
  INTERNATIONAL_EXPANSION_REQUIRED_STEPS,
  buildGlobalInheritanceReuseDashboard,
  evaluateGenerationRequest,
  getMissingInheritanceLayers,
  validateGlobalInheritanceReuseEnforcementSystem,
} from "./global-inheritance-reuse-enforcement-system";

const completeInheritedRequest = {
  topic: "Sepsis early deterioration",
  assetKind: "Lesson",
  role: "RN",
  country: "United Kingdom",
  exam: "NMC CBT",
  language: "en",
  similarityPercent: 20,
  existingGlobalCore: true,
  existingRoleOverlay: true,
  existingCountryOverlay: true,
  existingExamOverlay: true,
  existingLanguageOverlay: true,
  equivalentClinicalObjectiveExists: false,
  equivalentLearningObjectiveExists: false,
} as const;

describe("global inheritance reuse enforcement system", () => {
  it("validates the reuse enforcement contract", () => {
    assert.deepEqual(validateGlobalInheritanceReuseEnforcementSystem(), []);
  });

  it("declares minimum reuse targets by asset category", () => {
    assert.equal(GLOBAL_REUSE_TARGETS.Lessons, 85);
    assert.equal(GLOBAL_REUSE_TARGETS.Flashcards, 90);
    assert.equal(GLOBAL_REUSE_TARGETS.Simulations, 95);
    assert.equal(GLOBAL_REUSE_TARGETS["Clinical Cases"], 90);
    assert.equal(GLOBAL_REUSE_TARGETS.Labs, 95);
    assert.equal(GLOBAL_REUSE_TARGETS.ECG, 95);
    assert.equal(GLOBAL_REUSE_TARGETS.Pharmacology, 90);
  });

  it("assigns canonical topics to the global clinical core registry", () => {
    for (const topic of ["Heart Failure", "COPD", "Sepsis", "Shock", "ECG", "ABGs", "Labs", "Pharmacology", "Clinical Assessment"]) {
      assert.ok(GLOBAL_CLINICAL_CORE_REGISTRY.includes(topic));
    }
  });

  it("enforces reuse-first inheritance order", () => {
    assert.deepEqual(GLOBAL_INHERITANCE_REQUIRED_SEQUENCE, [
      "Global Core",
      "Role Overlay",
      "Country Overlay",
      "Exam Overlay",
      "Language Overlay",
      "Educational Asset",
    ]);
  });

  it("blocks generation when existing inherited content satisfies requirements", () => {
    const decision = evaluateGenerationRequest(completeInheritedRequest);

    assert.equal(decision.status, "GENERATION_BLOCKED");
    assert.equal(decision.reason, "existing_inherited_content_satisfies_requirements");
    assert.deepEqual(decision.missingLayers, []);
  });

  it("blocks duplicate-prone generation above similarity threshold", () => {
    const decision = evaluateGenerationRequest({
      ...completeInheritedRequest,
      similarityPercent: 86,
      existingLanguageOverlay: false,
    });

    assert.equal(decision.status, "GENERATION_BLOCKED");
    assert.equal(decision.reason, "similarity_exceeds_threshold");
  });

  it("blocks generation when equivalent clinical or learning objectives already exist", () => {
    const clinicalDecision = evaluateGenerationRequest({
      ...completeInheritedRequest,
      existingLanguageOverlay: false,
      equivalentClinicalObjectiveExists: true,
    });

    const learningDecision = evaluateGenerationRequest({
      ...completeInheritedRequest,
      existingLanguageOverlay: false,
      equivalentLearningObjectiveExists: true,
    });

    assert.equal(clinicalDecision.status, "GENERATION_BLOCKED");
    assert.equal(clinicalDecision.reason, "equivalent_clinical_objective_exists");
    assert.equal(learningDecision.status, "GENERATION_BLOCKED");
    assert.equal(learningDecision.reason, "equivalent_learning_objective_exists");
  });

  it("blocks role scope violations", () => {
    const decision = evaluateGenerationRequest({
      ...completeInheritedRequest,
      topic: "Heart failure NP prescribing and advanced diagnostics",
      role: "PN",
      existingLanguageOverlay: false,
    });

    assert.equal(decision.status, "GENERATION_BLOCKED");
    assert.equal(decision.reason, "role_scope_violation");
  });

  it("requires an approved new-content reason before generating missing layers", () => {
    const missingReasonDecision = evaluateGenerationRequest({
      ...completeInheritedRequest,
      existingCountryOverlay: false,
      existingLanguageOverlay: false,
    });

    assert.equal(missingReasonDecision.status, "GENERATION_BLOCKED");
    assert.equal(missingReasonDecision.reason, "new_content_reason_required");

    const approvedDecision = evaluateGenerationRequest({
      ...completeInheritedRequest,
      existingCountryOverlay: false,
      existingLanguageOverlay: false,
      requestedNewContentReason: "regulatory_requirements_differ",
    });

    assert.equal(approvedDecision.status, "GENERATE_MISSING_LAYERS_ONLY");
    assert.equal(approvedDecision.approvedReason, "regulatory_requirements_differ");
    assert.deepEqual(approvedDecision.missingLayers, ["Country Overlay", "Language Overlay"]);
  });

  it("reports missing inheritance layers", () => {
    assert.deepEqual(
      getMissingInheritanceLayers({
        ...completeInheritedRequest,
        existingGlobalCore: false,
        existingRoleOverlay: false,
        existingExamOverlay: false,
      }),
      ["Global Core", "Role Overlay", "Exam Overlay"],
    );
  });

  it("requires future international expansion to start with overlays", () => {
    assert.deepEqual(INTERNATIONAL_EXPANSION_OVERLAY_PRIORITY, ["Ireland", "UAE", "Saudi Arabia", "Singapore", "India", "Philippines"]);
    assert.deepEqual(INTERNATIONAL_EXPANSION_REQUIRED_STEPS.slice(0, 4), ["Recovery", "Classification", "Inheritance", "Localization"]);
  });

  it("builds the executive reuse dashboard", () => {
    const dashboard = buildGlobalInheritanceReuseDashboard();

    assert.equal(dashboard.globalCoreInventory, GLOBAL_CLINICAL_CORE_REGISTRY.length);
    assert.equal(dashboard.roleOverlayInventory, 3);
    assert.equal(dashboard.countryOverlayInventory, 6);
    assert.equal(dashboard.requiredReuseTargetAverage, 91);
    assert.equal(dashboard.duplicatePreventionPercent, 90);
    assert.equal(dashboard.internationalReadiness, "recovery-classification-inheritance-required-before-generation");
    assert.ok(dashboard.estimatedHoursSaved > 0);
    assert.ok(dashboard.estimatedContentAvoided > 0);
  });
});
